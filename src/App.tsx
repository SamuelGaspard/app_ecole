import React, { useState, useEffect } from 'react';
import {
  INITIAL_SCHOOLS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_STUDENTS,
  INITIAL_GRADES,
  INITIAL_FEE_STRUCTURES,
  INITIAL_PAYMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PENDING_SYNC_ITEMS
} from './data/initialData';
import { School, Student, Grade, Payment, AuditLog, PendingSyncItem, NetworkStatus, UserRole } from './types';
import { Header } from './components/Header';
import { ErpBackOffice } from './components/ErpBackOffice';
import { FinanceCaisse } from './components/FinanceCaisse';
import { ParentTeacherPortal } from './components/ParentTeacherPortal';
import { PublicShowcase } from './components/PublicShowcase';
import { ReceiptVerifyModal } from './components/ReceiptVerifyModal';

export default function App() {
  const [schools, setSchools] = useState<School[]>(INITIAL_SCHOOLS);
  const [currentSchool, setCurrentSchool] = useState<School>(INITIAL_SCHOOLS[0]);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('ONLINE_CLOUD');
  const [currentRole, setCurrentRole] = useState<UserRole>('SCHOOL_ADMIN');
  const [activeTab, setActiveTab] = useState<'erp' | 'finance' | 'portal'>('erp');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginRole, setLoginRole] = useState<UserRole>('SCHOOL_ADMIN');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Core ERP State
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [grades, setGrades] = useState<Grade[]>(INITIAL_GRADES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [pendingSyncItems, setPendingSyncItems] = useState<PendingSyncItem[]>(INITIAL_PENDING_SYNC_ITEMS);

  // Verification Modal State
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifyReceiptId, setVerifyReceiptId] = useState('REC-2025-101201');

  // Toggle Network Online / Offline Simulation
  const handleToggleNetwork = () => {
    const nextStatus = networkStatus === 'ONLINE_CLOUD' ? 'OFFLINE_LOCAL' : 'ONLINE_CLOUD';
    setNetworkStatus(nextStatus);
  };

  // Add Grade Handler
  const handleAddGrade = (newGradeData: Omit<Grade, 'id' | 'updatedAt' | 'syncStatus'>) => {
    const isOffline = networkStatus === 'OFFLINE_LOCAL';
    const newGrade: Grade = {
      ...newGradeData,
      id: `grd_${Date.now()}`,
      updatedAt: new Date().toISOString(),
      syncStatus: isOffline ? 'PENDING_OFFLINE' : 'SYNCED'
    };

    setGrades(prev => [newGrade, ...prev]);

    if (isOffline) {
      const pendingItem: PendingSyncItem = {
        id: `sync_grd_${Date.now()}`,
        type: 'GRADE',
        payload: {
          studentName: students.find(s => s.id === newGradeData.studentId)?.lastName || 'Élève',
          subject: newGradeData.subjectName,
          score: newGradeData.score,
          maxScore: 20,
          examType: newGradeData.examType
        },
        createdAt: new Date().toISOString(),
        deviceNode: 'Teacher-Tablet-Node01',
        retryCount: 0,
        status: 'QUEUED'
      };
      setPendingSyncItems(prev => [pendingItem, ...prev]);
    }
  };

  // Add Payment Handler
  const handleAddPayment = (newPaymentData: Omit<Payment, 'id' | 'qrCodeUrl' | 'securityHash' | 'syncStatus'>) => {
    const isOffline = networkStatus === 'OFFLINE_LOCAL';
    const uuidV7 = `01948a3f-${Math.floor(1000 + Math.random() * 9000)}-7000-8f92-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const securityHash = `hmac_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const qrUrl = `https://${currentSchool.subdomain}.appecole.com/verify-receipt/${newPaymentData.receiptNumber}`;

    const newPayment: Payment = {
      ...newPaymentData,
      id: uuidV7,
      qrCodeUrl: qrUrl,
      securityHash,
      syncStatus: isOffline ? 'PENDING_OFFLINE' : 'SYNCED',
      syncedAt: isOffline ? undefined : new Date().toISOString()
    };

    setPayments(prev => [newPayment, ...prev]);

    // Audit Log Entry
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      schoolId: currentSchool.id,
      userId: 'usr_cashier_01',
      userName: newPaymentData.cashierName,
      userRole: 'ACCOUNTANT',
      action: 'CREATE_PAYMENT',
      entityName: 'payments',
      entityId: uuidV7,
      details: `Paiement ${newPaymentData.amountPaid.toLocaleString()} FC pour ${newPaymentData.studentName} (${newPaymentData.feeTitle}). Ticket ${newPaymentData.receiptNumber}`,
      ipAddress: isOffline ? '192.168.1.45 (Caisse Local)' : 'Cloud API Gateway',
      timestamp: new Date().toISOString(),
      isOfflineEvent: isOffline
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Queue if Offline
    if (isOffline) {
      const pendingItem: PendingSyncItem = {
        id: `sync_pay_${Date.now()}`,
        type: 'PAYMENT',
        payload: {
          receiptNumber: newPaymentData.receiptNumber,
          studentName: newPaymentData.studentName,
          feeTitle: newPaymentData.feeTitle,
          amountPaid: newPaymentData.amountPaid,
          paymentMethod: newPaymentData.paymentMethod
        },
        createdAt: new Date().toISOString(),
        deviceNode: 'Guichet-POS-01 (IndexedDB)',
        retryCount: 0,
        status: 'QUEUED'
      };
      setPendingSyncItems(prev => [pendingItem, ...prev]);
    }
  };

  // Trigger Sync Batch (Empty Outbox)
  const handleTriggerSyncBatch = () => {
    setPendingSyncItems([]);
    setPayments(prev => prev.map(p => ({ ...p, syncStatus: 'SYNCED', syncedAt: new Date().toISOString() })));
    setGrades(prev => prev.map(g => ({ ...g, syncStatus: 'SYNCED' })));

    const syncLog: AuditLog = {
      id: `log_sync_${Date.now()}`,
      schoolId: currentSchool.id,
      userId: 'usr_admin_01',
      userName: 'M. MUKENDI Alain (Préfet)',
      userRole: 'SCHOOL_ADMIN',
      action: 'SYNC_OFFLINE_BATCH',
      entityName: 'sync_queue',
      entityId: `batch_${Date.now()}`,
      details: 'Resynchronisation réussie des encaissements et notes de la file d\'attente. 0 conflits.',
      ipAddress: '192.168.1.10 (Local Node)',
      timestamp: new Date().toISOString(),
      isOfflineEvent: true
    };
    setAuditLogs(prev => [syncLog, ...prev]);
  };

  const handleOpenVerifyModal = (receiptId?: string) => {
    if (receiptId) setVerifyReceiptId(receiptId);
    setIsVerifyModalOpen(true);
  };

  const getInitialTabForRole = (role: UserRole) => {
    if (role === 'PARENT' || role === 'TEACHER') {
      return 'portal' as const;
    }
    if (role === 'ACCOUNTANT') {
      return 'finance' as const;
    }
    return 'erp' as const;
  };

  const getAvailableTabs = (role: UserRole) => {
    if (role === 'PARENT' || role === 'TEACHER') {
      return ['portal'] as const;
    }
    if (role === 'ACCOUNTANT') {
      return ['finance'] as const;
    }
    if (role === 'SECRETARY') {
      return ['erp'] as const;
    }
    return ['erp', 'finance'] as const;
  };

  const handleStartLogin = () => {
    setShowLogin(true);
    setLoginError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(false);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
    setLoginRole('SCHOOL_ADMIN');
    setCurrentRole('SCHOOL_ADMIN');
    setActiveTab('erp');
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validCredentials: Record<UserRole, { email: string; password: string }> = {
      SUPER_ADMIN: { email: 'superadmin@appecole.com', password: 'SuperAdmin123' },
      SCHOOL_ADMIN: { email: 'directeur@appecole.com', password: 'Directeur123' },
      ACCOUNTANT: { email: 'comptable@appecole.com', password: 'Compta123' },
      SECRETARY: { email: 'secretaire@appecole.com', password: 'Secr@2026' },
      TEACHER: { email: 'enseignant@appecole.com', password: 'Prof2026' },
      PARENT: { email: 'parent@appecole.com', password: 'Parent2026' },
      STUDENT: { email: 'eleve@appecole.com', password: 'Eleve2026' }
    };

    const expected = validCredentials[loginRole];
    if (loginEmail.toLowerCase() === expected.email && loginPassword === expected.password) {
      setIsAuthenticated(true);
      setLoginError('');
      setCurrentRole(loginRole);
      setActiveTab(getInitialTabForRole(loginRole));
      return;
    }

    setLoginError('Email, mot de passe ou rôle incorrect.');
  };

  useEffect(() => {
    const availableTabs = getAvailableTabs(currentRole);
    if (!availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [currentRole, activeTab]);

  if (!isAuthenticated) {
    if (!showLogin) {
      return (
        <PublicShowcase
          school={currentSchool}
          feeStructures={INITIAL_FEE_STRUCTURES}
          onLoginRequest={handleStartLogin}
        />
      );
    }

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-black/20">
          <h1 className="text-3xl font-extrabold text-white mb-4">Connexion</h1>
          <p className="text-slate-400 mb-6">Connectez-vous en tant que parent, professeur, directeur ou secrétaire.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block text-sm font-semibold text-slate-300">
              Rôle
              <select
                value={loginRole}
                onChange={(e) => setLoginRole(e.target.value as UserRole)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
              >
                <option value="PARENT">Parent</option>
                <option value="TEACHER">Professeur</option>
                <option value="SCHOOL_ADMIN">Directeur</option>
                <option value="SECRETARY">Secrétaire</option>
                <option value="ACCOUNTANT">Comptable</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-300">
              Email
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                placeholder="parent@appecole.com"
                required
              />
            </label>
            <label className="block text-sm font-semibold text-slate-300">
              Mot de passe
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400"
                placeholder="********"
                required
              />
            </label>
            {loginError && <div className="text-sm text-rose-400">{loginError}</div>}
            <button
              type="submit"
              className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Se connecter
            </button>
          </form>
          <div className="mt-6 text-xs text-slate-500 space-y-2">
            <p>Exemples de connexion :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Directeur : directeur@appecole.com / Directeur123</li>
              <li>Secrétaire : secretaire@appecole.com / Secr@2026</li>
              <li>Comptable : comptable@appecole.com / Compta123</li>
              <li>Professeur : enseignant@appecole.com / Prof2026</li>
              <li>Parent : parent@appecole.com / Parent2026</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Header Bar */}
      <Header
        schools={schools}
        currentSchool={currentSchool}
        onSelectSchool={setCurrentSchool}
        networkStatus={networkStatus}
        onToggleNetwork={handleToggleNetwork}
        currentRole={currentRole}
        activeTab={activeTab}
        availableTabs={getAvailableTabs(currentRole)}
        onChangeTab={setActiveTab}
        onLogout={handleLogout}
        onVerifyReceiptModal={() => handleOpenVerifyModal()}
      />

      {/* Main Active Tab Content View */}
      <main className="pb-16">
        {activeTab === 'erp' && (
          <ErpBackOffice
            school={currentSchool}
            classes={INITIAL_CLASSES}
            subjects={INITIAL_SUBJECTS}
            students={students}
            grades={grades}
            onAddGrade={handleAddGrade}
            onAddStudent={() => {}}
            isOfflineMode={networkStatus === 'OFFLINE_LOCAL'}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceCaisse
            school={currentSchool}
            students={students}
            feeStructures={INITIAL_FEE_STRUCTURES}
            payments={payments}
            onAddPayment={handleAddPayment}
            networkStatus={networkStatus}
            onOpenVerifyModal={handleOpenVerifyModal}
          />
        )}

        {activeTab === 'portal' && (
          <ParentTeacherPortal
            role={currentRole}
            school={currentSchool}
            students={students}
            grades={grades}
            payments={payments}
            onAddPayment={handleAddPayment}
          />
        )}
      </main>

      {/* Public Receipt Verification Modal */}
      <ReceiptVerifyModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        initialReceiptId={verifyReceiptId}
      />
    </div>
  );
}
