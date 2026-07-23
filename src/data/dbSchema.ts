// PostgreSQL Database Schema Definition for APP ECOLE Multi-Tenant ERP & Offline Sync

export const POSTGRES_SCHEMA_SQL = `-- =====================================================================
-- APP ECOLE - SCHÉMA DE BASE DE DONNÉES POSTGRESQL MULTI-TENANT
-- Architecture : Hybrid Offline-First (UUID v7, Isolation Logique par school_id)
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABLE DES ÉTABLISSEMENTS (SCHOOLS - Multi-Tenancy Engine)
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL, -- ecole-espoir.appecole.com
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'RDC',
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    currency VARCHAR(10) NOT NULL DEFAULT 'FC',
    logo_url TEXT,
    motto TEXT,
    academic_year VARCHAR(20) NOT NULL DEFAULT '2025-2026',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_schools_subdomain ON schools(subdomain);

-- 2. TABLE DES UTILISATEURS (USERS)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT', 'TEACHER', 'PARENT', 'STUDENT')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_email_per_school UNIQUE (school_id, email)
);

CREATE INDEX idx_users_school ON users(school_id, role);

-- 3. TABLE DES CLASSES ET SECTIONS (CLASSES)
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g. "6ème Biologie-Chimie"
    section VARCHAR(50) NOT NULL, -- "Primaire", "Secondaire"
    cycle VARCHAR(50),
    academic_year VARCHAR(20) NOT NULL,
    capacity INT DEFAULT 40,
    main_teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_classes_school ON classes(school_id, academic_year);

-- 4. TABLE DES ÉLÈVES (STUDENTS)
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    matricule VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    date_of_birth DATE,
    place_of_birth VARCHAR(100),
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(50) NOT NULL,
    parent_email VARCHAR(255),
    address TEXT,
    qr_code_data TEXT NOT NULL,
    photo_url TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'GRADUATED', 'TRANSFERRED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_matricule_per_school UNIQUE (school_id, matricule)
);

CREATE INDEX idx_students_school_class ON students(school_id, class_id);

-- 5. TABLE DES MATIÈRES (SUBJECTS)
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(20) NOT NULL,
    coefficient INT NOT NULL DEFAULT 1,
    category VARCHAR(50) DEFAULT 'GENERAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABLE DES NOTES (GRADES - Sync Offline avec horodatage)
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    score NUMERIC(5,2) NOT NULL,
    max_score NUMERIC(5,2) NOT NULL DEFAULT 20.00,
    term VARCHAR(30) NOT NULL CHECK (term IN ('TRIMESTRE_1', 'TRIMESTRE_2', 'TRIMESTRE_3')),
    exam_type VARCHAR(30) NOT NULL CHECK (exam_type IN ('INTERRO', 'EXAMEN', 'DEVOIR')),
    comments TEXT,
    device_node VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sync_version BIGINT DEFAULT 1,
    CONSTRAINT uq_grade_entry UNIQUE (school_id, student_id, subject_id, term, exam_type)
);

CREATE INDEX idx_grades_lookup ON grades(school_id, student_id, term);

-- 7. TABLE STRUCTURE DE FRAIS (FEE_STRUCTURES)
CREATE TABLE fee_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL, -- "Minerval Tranche 1", "Frais d'Examen"
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'FC',
    due_date DATE,
    cycle VARCHAR(50),
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABLE DES PAIEMENTS DE CAISSE (PAYMENTS - Immuabilité Strict)
CREATE TABLE payments (
    id UUID PRIMARY KEY, -- Généré localement (UUIDv7) lors de la saisie hors-ligne
    client_temp_id VARCHAR(100), -- ID temporaire IndexedDB/SQLite local
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    fee_structure_id UUID REFERENCES fee_structures(id),
    amount_paid NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'FC',
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('CASH', 'CHECK', 'MOBILE_MONEY_MPESA', 'MOBILE_MONEY_ORANGE', 'MOBILE_MONEY_WAVE', 'MOBILE_MONEY_MTN')),
    transaction_reference VARCHAR(100) NOT NULL,
    receipt_number VARCHAR(100) UNIQUE NOT NULL,
    cashier_id UUID REFERENCES users(id),
    security_hash VARCHAR(255) NOT NULL, -- HMAC-SHA256 pour validation anti-fraude du QR Code
    device_mac VARCHAR(100),
    paid_at TIMESTAMP WITH TIME ZONE NOT NULL,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_voided BOOLEAN DEFAULT FALSE,
    void_reason TEXT
);

CREATE INDEX idx_payments_school_student ON payments(school_id, student_id);
CREATE INDEX idx_payments_receipt ON payments(receipt_number);

-- 9. TABLE D'AUDIT LOGS (INVIOLABILITÉ FINANCIÈRE)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(50),
    is_offline_event BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_school ON audit_logs(school_id, timestamp DESC);

-- TRIGGER D'IMMUABILITÉ DES PAIEMENTS : Empêche la suppression brute d'une transaction financière
CREATE OR REPLACE FUNCTION prevent_payment_delete()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'SUPPRESSION INTERDITE: Les enregistrements de paiement dans APP ECOLE sont immuables. Utilisez une annulation avec lettre d''avoir.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_payments
BEFORE DELETE ON payments
FOR EACH ROW EXECUTE FUNCTION prevent_payment_delete();
`;
