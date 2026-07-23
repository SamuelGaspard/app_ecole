// Types for APP ECOLE - Solution de Gestion Scolaire Hybride

export type NetworkStatus = 'ONLINE_CLOUD' | 'OFFLINE_LOCAL';

export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'ACCOUNTANT' | 'SECRETARY' | 'TEACHER' | 'PARENT' | 'STUDENT';

export interface School {
  id: string; // school_id for multi-tenancy
  name: string;
  subdomain: string; // e.g. ecole-espoir.appecole.com
  code: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  logoUrl: string;
  motto: string;
  currency: 'FC' | 'USD' | 'XOF' | 'EUR';
  academicYear: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface User {
  id: string;
  schoolId: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone: string;
  avatarUrl?: string;
}

export interface Student {
  id: string;
  schoolId: string;
  matricule: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  dateOfBirth: string;
  placeOfBirth: string;
  classId: string;
  className: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  qrCodeData: string;
  photoUrl?: string;
  status: 'ACTIVE' | 'GRADUATED' | 'TRANSFERRED';
}

export interface SchoolClass {
  id: string;
  schoolId: string;
  name: string; // e.g., 6ème Biologie-Chimie, 3ème Primaire A
  section: string; // Primaire, Secondaire Technique, Maternelle
  cycle: string;
  academicYear: string;
  capacity: number;
  studentCount: number;
  mainTeacherName: string;
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string; // e.g., Mathématiques, Francais, Physique
  code: string;
  coefficient: number;
  category: 'SCIENCES' | 'LITTERATURE' | 'LANGUES' | 'GENERAL';
}

export interface Grade {
  id: string;
  schoolId: string;
  studentId: string;
  subjectId: string;
  subjectName: string;
  coefficient: number;
  score: number; // e.g., 16.5 / 20
  maxScore: number; // 20
  term: 'TRIMESTRE_1' | 'TRIMESTRE_2' | 'TRIMESTRE_3';
  examType: 'INTERRO' | 'EXAMEN' | 'DEVOIR';
  comments?: string;
  teacherId: string;
  updatedAt: string;
  syncStatus: 'SYNCED' | 'PENDING_OFFLINE';
}

export interface ReportCard {
  studentId: string;
  studentName: string;
  matricule: string;
  className: string;
  term: string;
  academicYear: string;
  subjects: {
    subjectName: string;
    score: number;
    maxScore: number;
    coefficient: number;
    weightedScore: number;
    appreciation: string;
  }[];
  totalPoints: number;
  maxTotalPoints: number;
  average: number; // / 20
  rank: number;
  totalStudentsInClass: number;
  conduct: string;
  decision: string;
  qrCodeVerificationUrl: string;
}

export interface FeeStructure {
  id: string;
  schoolId: string;
  title: string; // e.g., Minerval Tranche 1, Frais d'Uniforme, Cantine
  amount: number;
  currency: string;
  dueDate: string;
  cycle: string;
  isRequired: boolean;
}

export interface Payment {
  id: string; // UUID v7 generated locally
  clientTempId?: string; // local offline key
  schoolId: string;
  studentId: string;
  studentName: string;
  studentMatricule: string;
  className: string;
  feeStructureId: string;
  feeTitle: string;
  amountPaid: number;
  currency: string;
  paymentMethod: 'CASH' | 'CHECK' | 'MOBILE_MONEY_MPESA' | 'MOBILE_MONEY_ORANGE' | 'MOBILE_MONEY_WAVE' | 'MOBILE_MONEY_MTN';
  transactionReference: string;
  cashierName: string;
  cashierId: string;
  paidAt: string;
  qrCodeUrl: string;
  receiptNumber: string;
  securityHash: string; // Cryptographic anti-fraud payload
  syncStatus: 'SYNCED' | 'PENDING_OFFLINE' | 'SYNC_FAILED';
  syncedAt?: string;
  offlineDeviceMac?: string;
}

export interface AuditLog {
  id: string;
  schoolId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'CREATE_PAYMENT' | 'VOID_PAYMENT' | 'UPDATE_GRADE' | 'SYNC_OFFLINE_BATCH' | 'GENERATE_REPORT_CARD';
  entityName: string;
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  isOfflineEvent: boolean;
}

export interface PendingSyncItem {
  id: string;
  type: 'PAYMENT' | 'GRADE' | 'ATTENDANCE';
  payload: any;
  createdAt: string;
  deviceNode: string;
  retryCount: number;
  status: 'QUEUED' | 'SYNCING' | 'SUCCESS' | 'CONFLICT';
  conflictDetails?: string;
}
