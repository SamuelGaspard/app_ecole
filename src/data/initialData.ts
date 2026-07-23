import { School, User, Student, SchoolClass, Subject, Grade, FeeStructure, Payment, AuditLog, PendingSyncItem } from '../types';

export const INITIAL_SCHOOLS: School[] = [
  {
    id: "sch_espoir_01",
    name: "Complexe Scolaire Espoir de Kinshasa",
    subdomain: "ecole-espoir",
    code: "CS-ESP-01",
    address: "124 Avenue Tombalbaye, Gombe",
    city: "Kinshasa",
    country: "RD Congo",
    phone: "+243 81 234 5678",
    email: "contact@ecole-espoir.cd",
    logoUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=200&q=80",
    motto: "Discipline - Travail - Excellence",
    currency: "FC",
    academicYear: "2025-2026",
    status: "ACTIVE",
    createdAt: "2025-08-15T08:00:00Z"
  },
  {
    id: "sch_stemarie_02",
    name: "Lycée Sainte-Marie de Goma",
    subdomain: "lycee-stemarie",
    code: "LSM-GOM-02",
    address: "45 Boulevard Kanyamuhanga",
    city: "Goma",
    country: "RD Congo",
    phone: "+243 99 876 5432",
    email: "info@stemarie-goma.org",
    logoUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80",
    motto: "Lux et Veritas",
    currency: "USD",
    academicYear: "2025-2026",
    status: "ACTIVE",
    createdAt: "2025-09-01T08:00:00Z"
  }
];

export const INITIAL_CLASSES: SchoolClass[] = [
  {
    id: "cls_6bio_01",
    schoolId: "sch_espoir_01",
    name: "6ème Biologie-Chimie",
    section: "Secondaire Scientifique",
    cycle: "Humanités",
    academicYear: "2025-2026",
    capacity: 35,
    studentCount: 28,
    mainTeacherName: "Prof. LUKUSA Jean-Paul"
  },
  {
    id: "cls_3lit_02",
    schoolId: "sch_espoir_01",
    name: "3ème Littéraire A",
    section: "Secondaire Littéraire",
    cycle: "Humanités",
    academicYear: "2025-2026",
    capacity: 40,
    studentCount: 32,
    mainTeacherName: "Prof. MBUYI Marie"
  },
  {
    id: "cls_5prim_03",
    schoolId: "sch_espoir_01",
    name: "5ème Primaire B",
    section: "Primaire",
    cycle: "Primaire",
    academicYear: "2025-2026",
    capacity: 40,
    studentCount: 38,
    mainTeacherName: "Mme KABEDI Sarah"
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: "sub_math_01", schoolId: "sch_espoir_01", name: "Mathématiques Générales", code: "MATH", coefficient: 4, category: "SCIENCES" },
  { id: "sub_phys_02", schoolId: "sch_espoir_01", name: "Physique Appliquée", code: "PHYS", coefficient: 3, category: "SCIENCES" },
  { id: "sub_chim_03", schoolId: "sch_espoir_01", name: "Chimie Organique", code: "CHIM", coefficient: 3, category: "SCIENCES" },
  { id: "sub_fr_04", schoolId: "sch_espoir_01", name: "Langue Française & Littérature", code: "FRAN", coefficient: 3, category: "LITTERATURE" },
  { id: "sub_ang_05", schoolId: "sch_espoir_01", name: "Anglais Commercial", code: "ANGL", coefficient: 2, category: "LANGUES" },
  { id: "sub_hist_06", schoolId: "sch_espoir_01", name: "Histoire du Congo & Géographie", code: "HIST", coefficient: 2, category: "GENERAL" },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "stu_001",
    schoolId: "sch_espoir_01",
    matricule: "STU-2026-089",
    firstName: "Marc",
    lastName: "KABAMBA MUTA",
    gender: "M",
    dateOfBirth: "2008-04-12",
    placeOfBirth: "Kinshasa",
    classId: "cls_6bio_01",
    className: "6ème Biologie-Chimie",
    parentName: "M. KABAMBA Augustin",
    parentPhone: "+243 81 555 0192",
    parentEmail: "augustin.kabamba@gmail.com",
    address: "Q/ Matonge, N°45 C/ Kalamu",
    qrCodeData: "https://appecole.com/student/STU-2026-089",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    status: "ACTIVE"
  },
  {
    id: "stu_002",
    schoolId: "sch_espoir_01",
    matricule: "STU-2026-090",
    firstName: "Aïcha",
    lastName: "BAHATI BINTI",
    gender: "F",
    dateOfBirth: "2009-09-24",
    placeOfBirth: "Goma",
    classId: "cls_6bio_01",
    className: "6ème Biologie-Chimie",
    parentName: "Mme BAHATI Fatou",
    parentPhone: "+243 99 444 8811",
    parentEmail: "fatou.bahati@yahoo.fr",
    address: "Q/ Ma Campagne, N°12 C/ Ngaliema",
    qrCodeData: "https://appecole.com/student/STU-2026-090",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    status: "ACTIVE"
  },
  {
    id: "stu_003",
    schoolId: "sch_espoir_01",
    matricule: "STU-2026-091",
    firstName: "Emmanuel",
    lastName: "TSISEKEDI KONGOLO",
    gender: "M",
    dateOfBirth: "2008-11-05",
    placeOfBirth: "Lubumbashi",
    classId: "cls_6bio_01",
    className: "6ème Biologie-Chimie",
    parentName: "M. TSISEKEDI Joseph",
    parentPhone: "+243 82 111 2233",
    parentEmail: "joseph.tsise@gmail.com",
    address: "Av. Huileries, N°88 C/ Lingwala",
    qrCodeData: "https://appecole.com/student/STU-2026-091",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    status: "ACTIVE"
  },
  {
    id: "stu_004",
    schoolId: "sch_espoir_01",
    matricule: "STU-2026-092",
    firstName: "Grace",
    lastName: "MUKENGESHAYI Divine",
    gender: "F",
    dateOfBirth: "2010-01-18",
    placeOfBirth: "Kananga",
    classId: "cls_3lit_02",
    className: "3ème Littéraire A",
    parentName: "Mme MUKENGESHAYI Marie",
    parentPhone: "+243 85 999 0011",
    parentEmail: "m.mukenges@gmail.com",
    address: "Av. Victoire, N°230 C/ Kasa-Vubu",
    qrCodeData: "https://appecole.com/student/STU-2026-092",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    status: "ACTIVE"
  }
];

export const INITIAL_GRADES: Grade[] = [
  // Marc Kabamba
  { id: "grd_01", schoolId: "sch_espoir_01", studentId: "stu_001", subjectId: "sub_math_01", subjectName: "Mathématiques Générales", coefficient: 4, score: 17.5, maxScore: 20, term: "TRIMESTRE_1", examType: "EXAMEN", comments: "Excellente maitrise du calcul différentiel.", teacherId: "tch_01", updatedAt: "2026-02-10T10:00:00Z", syncStatus: "SYNCED" },
  { id: "grd_02", schoolId: "sch_espoir_01", studentId: "stu_001", subjectId: "sub_phys_02", subjectName: "Physique Appliquée", coefficient: 3, score: 16.0, maxScore: 20, term: "TRIMESTRE_1", examType: "EXAMEN", comments: "Très bon travail.", teacherId: "tch_01", updatedAt: "2026-02-10T11:00:00Z", syncStatus: "SYNCED" },
  { id: "grd_03", schoolId: "sch_espoir_01", studentId: "stu_001", subjectId: "sub_chim_03", subjectName: "Chimie Organique", coefficient: 3, score: 15.0, maxScore: 20, term: "TRIMESTRE_1", examType: "EXAMEN", comments: "Bonne compréhension.", teacherId: "tch_01", updatedAt: "2026-02-10T11:30:00Z", syncStatus: "SYNCED" },
  { id: "grd_04", schoolId: "sch_espoir_01", studentId: "stu_001", subjectId: "sub_fr_04", subjectName: "Langue Française & Littérature", coefficient: 3, score: 14.5, maxScore: 20, term: "TRIMESTRE_1", examType: "EXAMEN", comments: "Assez bien rédigé.", teacherId: "tch_02", updatedAt: "2026-02-11T09:00:00Z", syncStatus: "SYNCED" },
  { id: "grd_05", schoolId: "sch_espoir_01", studentId: "stu_001", subjectId: "sub_ang_05", subjectName: "Anglais Commercial", coefficient: 2, score: 18.0, maxScore: 20, term: "TRIMESTRE_1", examType: "EXAMEN", comments: "Fluide et méthodique.", teacherId: "tch_02", updatedAt: "2026-02-11T10:00:00Z", syncStatus: "SYNCED" },
  { id: "grd_06", schoolId: "sch_espoir_01", studentId: "stu_001", subjectId: "sub_hist_06", subjectName: "Histoire du Congo & Géographie", coefficient: 2, score: 15.5, maxScore: 20, term: "TRIMESTRE_1", examType: "EXAMEN", comments: "Bonne rigueur.", teacherId: "tch_02", updatedAt: "2026-02-11T11:00:00Z", syncStatus: "SYNCED" },

  // Aïcha Bahati
  { id: "grd_07", schoolId: "sch_espoir_01", studentId: "stu_002", subjectId: "sub_math_01", subjectName: "Mathématiques Générales", coefficient: 4, score: 18.0, maxScore: 20, term: "TRIMESTRE_1", examType: "EXAMEN", comments: "Majore de la classe en mathématiques.", teacherId: "tch_01", updatedAt: "2026-02-10T10:05:00Z", syncStatus: "SYNCED" },
  { id: "grd_08", schoolId: "sch_espoir_01", studentId: "stu_002", subjectId: "sub_phys_02", subjectName: "Physique Appliquée", coefficient: 3, score: 17.5, maxScore: 20, term: "TRIMESTRE_1", examType: "EXAMEN", comments: "Brillante démonstration.", teacherId: "tch_01", updatedAt: "2026-02-10T11:05:00Z", syncStatus: "SYNCED" },
  { id: "grd_09", schoolId: "sch_espoir_01", studentId: "stu_002", subjectId: "sub_chim_03", subjectName: "Chimie Organique", coefficient: 3, score: 16.5, maxScore: 20, term: "TRIMESTRE_1", examType: "EXAMEN", comments: "Très méthodique.", teacherId: "tch_01", updatedAt: "2026-02-10T11:35:00Z", syncStatus: "SYNCED" },
];

export const INITIAL_FEE_STRUCTURES: FeeStructure[] = [
  { id: "fee_tr1", schoolId: "sch_espoir_01", title: "Minerval - 1ère Tranche 2025-2026", amount: 150000, currency: "FC", dueDate: "2025-10-15", cycle: "Toutes Sections", isRequired: true },
  { id: "fee_tr2", schoolId: "sch_espoir_01", title: "Minerval - 2ème Tranche 2025-2026", amount: 150000, currency: "FC", dueDate: "2026-01-15", cycle: "Toutes Sections", isRequired: true },
  { id: "fee_tr3", schoolId: "sch_espoir_01", title: "Minerval - 3ème Tranche 2025-2026", amount: 120000, currency: "FC", dueDate: "2026-04-15", cycle: "Toutes Sections", isRequired: true },
  { id: "fee_cantine", schoolId: "sch_espoir_01", title: "Abonnement Cantine & Collation (Mensuel)", amount: 45000, currency: "FC", dueDate: "2026-03-01", cycle: "Optionnel", isRequired: false },
  { id: "fee_badge", schoolId: "sch_espoir_01", title: "Frais de Badge Plastifié & Carnet", amount: 15000, currency: "FC", dueDate: "2025-09-30", cycle: "Inscriptions", isRequired: true },
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: "01948a3f-10ab-7000-8f92-a8f391b4c902",
    schoolId: "sch_espoir_01",
    studentId: "stu_001",
    studentName: "Marc KABAMBA MUTA",
    studentMatricule: "STU-2026-089",
    className: "6ème Biologie-Chimie",
    feeStructureId: "fee_tr1",
    feeTitle: "Minerval - 1ère Tranche 2025-2026",
    amountPaid: 150000,
    currency: "FC",
    paymentMethod: "CASH",
    transactionReference: "POS-20251012-001",
    cashierName: "Mme MUKANYA Jacqueline (Caisse 1)",
    cashierId: "usr_cashier_01",
    paidAt: "2025-10-12T09:14:22Z",
    qrCodeUrl: "https://appecole.com/verify-receipt/REC-2025-101201",
    receiptNumber: "REC-2025-101201",
    securityHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    syncStatus: "SYNCED",
    syncedAt: "2025-10-12T09:14:25Z"
  },
  {
    id: "01948a3f-10ab-7000-8f92-a8f391b4c903",
    schoolId: "sch_espoir_01",
    studentId: "stu_001",
    studentName: "Marc KABAMBA MUTA",
    studentMatricule: "STU-2026-089",
    className: "6ème Biologie-Chimie",
    feeStructureId: "fee_tr2",
    feeTitle: "Minerval - 2ème Tranche 2025-2026",
    amountPaid: 150000,
    currency: "FC",
    paymentMethod: "MOBILE_MONEY_MPESA",
    transactionReference: "MPESA-8910239120",
    cashierName: "Guichet Automatique Mobile Money",
    cashierId: "usr_system_mobile",
    paidAt: "2026-01-14T14:32:10Z",
    qrCodeUrl: "https://appecole.com/verify-receipt/REC-2026-011402",
    receiptNumber: "REC-2026-011402",
    securityHash: "f92d8e3c129038ba102938475a82910384729103847291029384729103928103",
    syncStatus: "SYNCED",
    syncedAt: "2026-01-14T14:32:12Z"
  },
  {
    id: "01948a3f-10ab-7000-8f92-a8f391b4c904",
    schoolId: "sch_espoir_01",
    studentId: "stu_002",
    studentName: "Aïcha BAHATI BINTI",
    studentMatricule: "STU-2026-090",
    className: "6ème Biologie-Chimie",
    feeStructureId: "fee_tr1",
    feeTitle: "Minerval - 1ère Tranche 2025-2026",
    amountPaid: 150000,
    currency: "FC",
    paymentMethod: "MOBILE_MONEY_ORANGE",
    transactionReference: "OM-9920193021",
    cashierName: "Paiement En Ligne Parent",
    cashierId: "usr_parent_02",
    paidAt: "2025-10-10T16:05:40Z",
    qrCodeUrl: "https://appecole.com/verify-receipt/REC-2025-101003",
    receiptNumber: "REC-2025-101003",
    securityHash: "920193028102938475a829103847291038472910384729102938472910392810",
    syncStatus: "SYNCED",
    syncedAt: "2025-10-10T16:05:42Z"
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log_001",
    schoolId: "sch_espoir_01",
    userId: "usr_cashier_01",
    userName: "Mme MUKANYA Jacqueline",
    userRole: "ACCOUNTANT",
    action: "CREATE_PAYMENT",
    entityName: "payments",
    entityId: "01948a3f-10ab-7000-8f92-a8f391b4c902",
    details: "Enregistrement du paiement comptant 150,000 FC pour Marc KABAMBA (Tranche 1). Ticket REC-2025-101201 rédigé.",
    ipAddress: "192.168.1.45 (Local POS Caisse 1)",
    timestamp: "2025-10-12T09:14:22Z",
    isOfflineEvent: false
  },
  {
    id: "log_002",
    schoolId: "sch_espoir_01",
    userId: "usr_admin_01",
    userName: "M. MUKENDI Alain (Préfet)",
    userRole: "SCHOOL_ADMIN",
    action: "SYNC_OFFLINE_BATCH",
    entityName: "sync_queue",
    entityId: "batch_2026_01_15",
    details: "Resynchronisation de 14 paiements et 42 notes saisies durant la coupure Internet de la matinée. Conflit réglé: 0.",
    ipAddress: "192.168.1.10 (Serveur Local Ecole)",
    timestamp: "2026-01-15T12:00:10Z",
    isOfflineEvent: true
  }
];

export const INITIAL_PENDING_SYNC_ITEMS: PendingSyncItem[] = [
  {
    id: "item_sync_01",
    type: "PAYMENT",
    payload: {
      receiptNumber: "REC-2026-031589",
      studentName: "Emmanuel TSISEKEDI",
      feeTitle: "Minerval - 2ème Tranche 2025-2026",
      amountPaid: 150000,
      paymentMethod: "CASH",
      cashier: "Caisse Guichet 2 (Node-POS-02)",
      paidAt: "2026-03-15T10:20:00Z"
    },
    createdAt: "2026-03-15T10:20:00Z",
    deviceNode: "POS-GUICHET-02 (Offline IndexedDB)",
    retryCount: 0,
    status: "QUEUED"
  },
  {
    id: "item_sync_02",
    type: "GRADE",
    payload: {
      studentName: "Grace MUKENGESHAYI",
      subject: "Français & Expression Oral",
      score: 16,
      maxScore: 20,
      examType: "INTERRO",
      teacher: "Prof. MBUYI Marie"
    },
    createdAt: "2026-03-15T11:05:12Z",
    deviceNode: "Tablet-Teacher-Node04",
    retryCount: 0,
    status: "QUEUED"
  }
];
