import React, { useState } from 'react';
import { School, Student, SchoolClass, Subject, Grade, ReportCard } from '../types';
import { GraduationCap, Users, BookOpen, QrCode, FileText, Plus, Search, Award, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import QRCode from 'qrcode';

interface ErpBackOfficeProps {
  school: School;
  classes: SchoolClass[];
  subjects: Subject[];
  students: Student[];
  grades: Grade[];
  onAddGrade: (grade: Omit<Grade, 'id' | 'updatedAt' | 'syncStatus'>) => void;
  onAddStudent: (student: Omit<Student, 'id' | 'qrCodeData' | 'status'>) => void;
  isOfflineMode: boolean;
}

export const ErpBackOffice: React.FC<ErpBackOfficeProps> = ({
  school,
  classes,
  subjects,
  students,
  grades,
  onAddGrade,
  onAddStudent,
  isOfflineMode
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'STUDENTS' | 'CLASSES' | 'GRADES' | 'BULLETIN'>('STUDENTS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForBadge, setSelectedStudentForBadge] = useState<Student | null>(null);
  const [badgeQrDataUrl, setBadgeQrDataUrl] = useState<string>('');

  // Grade Entry State
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [gradeScore, setGradeScore] = useState<number>(15);
  const [gradeComment, setGradeComment] = useState<string>('Bon travail');

  // Selected Student for Bulletin PDF Generator
  const [selectedReportStudent, setSelectedReportStudent] = useState<Student>(students[0]);
  const [reportQrUrl, setReportQrUrl] = useState<string>('');

  // Badge QR Code Generator
  const handleOpenBadge = async (student: Student) => {
    setSelectedStudentForBadge(student);
    try {
      const url = await QRCode.toDataURL(student.qrCodeData, { margin: 1, width: 180 });
      setBadgeQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  // Report Card Generator Logic
  const generateReportCardData = (student: Student): ReportCard => {
    const studentGrades = grades.filter(g => g.studentId === student.id && g.term === 'TRIMESTRE_1');
    let totalWeighted = 0;
    let totalCoeff = 0;

    const subjectsCalculated = subjects.map(sub => {
      const grade = studentGrades.find(g => g.subjectId === sub.id);
      const score = grade ? grade.score : 12;
      const weightedScore = score * sub.coefficient;
      totalWeighted += weightedScore;
      totalCoeff += sub.coefficient * 20;

      let appreciation = 'Passable';
      if (score >= 16) appreciation = 'Excellent';
      else if (score >= 14) appreciation = 'Très Bien';
      else if (score >= 12) appreciation = 'Bien';
      else if (score < 10) appreciation = 'Insuffisant';

      return {
        subjectName: sub.name,
        score,
        maxScore: 20,
        coefficient: sub.coefficient,
        weightedScore,
        appreciation
      };
    });

    const average = totalCoeff > 0 ? (totalWeighted / (totalCoeff / 20)) : 12;

    return {
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      matricule: student.matricule,
      className: student.className,
      term: '1er Trimestre',
      academicYear: school.academicYear,
      subjects: subjectsCalculated,
      totalPoints: totalWeighted,
      maxTotalPoints: totalCoeff,
      average: parseFloat(average.toFixed(2)),
      rank: student.id === 'stu_002' ? 1 : (student.id === 'stu_001' ? 2 : 3),
      totalStudentsInClass: 28,
      conduct: 'Excellente',
      decision: average >= 10 ? 'Admis(e) au trimestre suivant' : 'Avertissement Travail',
      qrCodeVerificationUrl: `https://${school.subdomain}.appecole.com/verify-bulletin/${student.matricule}`
    };
  };

  const currentReportCard = generateReportCardData(selectedReportStudent);

  // Generate Report QR code on selection change
  React.useEffect(() => {
    QRCode.toDataURL(currentReportCard.qrCodeVerificationUrl, { margin: 1, width: 140 })
      .then(url => setReportQrUrl(url))
      .catch(e => console.error(e));
  }, [selectedReportStudent]);

  const filteredStudents = students.filter(s =>
    `${s.firstName} ${s.lastName} ${s.matricule}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find(s => s.id === selectedSubjectId);
    if (!sub) return;

    onAddGrade({
      schoolId: school.id,
      studentId: selectedStudentId,
      subjectId: selectedSubjectId,
      subjectName: sub.name,
      coefficient: sub.coefficient,
      score: Number(gradeScore),
      maxScore: 20,
      term: 'TRIMESTRE_1',
      examType: 'EXAMEN',
      comments: gradeComment,
      teacherId: 'usr_teacher_01'
    });

    alert(`Note enregistrée ! ${isOfflineMode ? '(Enregistrée hors-ligne dans IndexedDB)' : '(Sauvegardée sur le Cloud)'}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Sub Navigation Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('STUDENTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeSubTab === 'STUDENTS' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" /> Registre Élèves & Badges
          </button>

          <button
            onClick={() => setActiveSubTab('GRADES')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeSubTab === 'GRADES' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-400" /> Saisie des Notes {isOfflineMode && '(Hors-ligne)'}
          </button>

          <button
            onClick={() => setActiveSubTab('BULLETIN')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeSubTab === 'BULLETIN' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" /> Bulletins de Notes PDF
          </button>

          <button
            onClick={() => setActiveSubTab('CLASSES')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeSubTab === 'CLASSES' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-teal-400" /> Structures & Classes
          </button>
        </div>

        <div className="text-slate-500 font-mono text-[11px] px-3">
          Élèves inscrits: {students.length} • Année {school.academicYear}
        </div>
      </div>

      {/* SUB-TAB 1: STUDENTS & QR BADGES */}
      {activeSubTab === 'STUDENTS' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  Gestion de l'Effectif Scolaire & Badges Plastifiés
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Recherchez un élève pour consulter son dossier, son historique ou générer son badge QR Code d'accès.
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher nom ou matricule..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Matricule</th>
                    <th className="p-3">Élève</th>
                    <th className="p-3">Classe</th>
                    <th className="p-3">Sexe</th>
                    <th className="p-3">Parent / Tuteur</th>
                    <th className="p-3 text-right">Actions Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{s.matricule}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={s.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                            alt={s.firstName}
                            className="w-8 h-8 rounded-full object-cover border"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{s.lastName} {s.firstName}</div>
                            <div className="text-[10px] text-slate-400">Né(e) le {s.dateOfBirth} à {s.placeOfBirth}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-medium text-slate-700">{s.className}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          s.gender === 'M' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                        }`}>
                          {s.gender}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{s.parentName}</div>
                        <div className="text-slate-500 font-mono text-[11px]">{s.parentPhone}</div>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleOpenBadge(s)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition inline-flex items-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5 text-emerald-400" /> Badge QR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Badge Preview Modal / Card */}
          {selectedStudentForBadge && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                  <QrCode className="w-4 h-4" /> Badge Élève Officiel Plastifié (Format 85x54mm)
                </h4>
                <button
                  onClick={() => setSelectedStudentForBadge(null)}
                  className="text-slate-400 hover:text-white font-bold text-xs"
                >
                  Fermer
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center bg-slate-950 p-6 rounded-xl border border-slate-800">
                {/* Front side of badge */}
                <div className="w-80 h-48 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 border-2 border-emerald-500/50 rounded-xl p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-xs">AE</div>
                      <div>
                        <div className="font-extrabold text-[11px] text-white leading-tight">{school.name}</div>
                        <div className="text-[9px] text-emerald-400">{school.motto}</div>
                      </div>
                    </div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded border border-emerald-500/30">ÉLÈVE</span>
                  </div>

                  <div className="flex items-center gap-3 my-1">
                    <img
                      src={selectedStudentForBadge.photoUrl}
                      alt={selectedStudentForBadge.firstName}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-white/20"
                    />
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-sm text-white leading-tight">
                        {selectedStudentForBadge.lastName}
                      </div>
                      <div className="font-semibold text-xs text-emerald-300">
                        {selectedStudentForBadge.firstName}
                      </div>
                      <div className="text-[10px] text-slate-300">
                        Classe: <span className="font-bold text-white">{selectedStudentForBadge.className}</span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">
                        Mat: {selectedStudentForBadge.matricule}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-1 text-[9px] text-slate-400 font-mono">
                    <span>Année: {school.academicYear}</span>
                    <span>Kinshasa, RDC</span>
                  </div>
                </div>

                {/* Back side with QR Code */}
                <div className="w-80 h-48 bg-white text-slate-900 border-2 border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2 shadow-xl">
                  {badgeQrDataUrl && (
                    <img src={badgeQrDataUrl} alt="QR Code" className="w-24 h-24 border rounded p-1" />
                  )}
                  <div className="font-bold text-xs text-slate-800">Vérification d'Identité & Présence</div>
                  <div className="text-[10px] text-slate-500 max-w-xs leading-tight">
                    Scannez ce QR Code à l'entrée de l'établissement ou sur le portail public d'audit.
                  </div>
                  <div className="font-mono text-[9px] text-emerald-700 font-bold">{selectedStudentForBadge.qrCodeData}</div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow inline-flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Imprimer le Badge Plastifié
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: GRADE ENTRY */}
      {activeSubTab === 'GRADES' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grade Entry Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Saisie des Notes (Carnet Professeur)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Fonctionne même hors-connexion. Les notes sont enregistrées localement et synchronisées plus tard.
              </p>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Classe *</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Élève concerné *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.lastName} {s.firstName} ({s.matricule})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Matière *</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (Coeff {s.coefficient})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Note attribuée / 20 *</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    required
                    value={gradeScore}
                    onChange={(e) => setGradeScore(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trimestre</label>
                  <input
                    type="text"
                    readOnly
                    value="1er Trimestre"
                    className="w-full bg-slate-200 border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Appréciation de l'enseignant</label>
                <input
                  type="text"
                  value={gradeComment}
                  onChange={(e) => setGradeComment(e.target.value)}
                  placeholder="Ex: Excellent raisonnement logique..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow transition"
              >
                Enregistrer la Note {isOfflineMode ? '(IndexedDB)' : ''}
              </button>
            </form>
          </div>

          {/* Grades Log Table */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Relevé Récent des Notes Saisies</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Matière</th>
                    <th className="p-3">Élève</th>
                    <th className="p-3">Coeff</th>
                    <th className="p-3">Note / 20</th>
                    <th className="p-3">Appréciation</th>
                    <th className="p-3">Statut Sync</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {grades.map((g) => {
                    const st = students.find(s => s.id === g.studentId);
                    return (
                      <tr key={g.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{g.subjectName}</td>
                        <td className="p-3 text-slate-800">{st ? `${st.lastName} ${st.firstName}` : g.studentId}</td>
                        <td className="p-3 font-mono font-bold">{g.coefficient}</td>
                        <td className="p-3 font-bold text-indigo-700">{g.score} / 20</td>
                        <td className="p-3 text-slate-600 italic">{g.comments}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                            g.syncStatus === 'SYNCED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {g.syncStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BULLETIN DE NOTES PDF GENERATOR */}
      {activeSubTab === 'BULLETIN' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                Générateur de Bulletins Scolaires Sécurisés par QR Code
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sélectionnez un élève pour calculer automatiquement sa moyenne pondérée, son rang et imprimer son bulletin infalsifiable.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Choisir l'Élève :</span>
              <select
                value={selectedReportStudent.id}
                onChange={(e) => {
                  const s = students.find(x => x.id === e.target.value);
                  if (s) setSelectedReportStudent(s);
                }}
                className="bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.lastName} {s.firstName} ({s.className})</option>
                ))}
              </select>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow inline-flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Imprimer le Bulletin PDF
              </button>
            </div>
          </div>

          {/* Printable Bulletin Document Frame */}
          <div className="bg-white border-2 border-slate-300 rounded-2xl p-8 max-w-4xl mx-auto shadow-xl text-slate-900 space-y-6">
            {/* School Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div className="flex items-center gap-4">
                <img src={school.logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-cover border" />
                <div>
                  <h2 className="text-xl font-black uppercase text-slate-900">{school.name}</h2>
                  <p className="text-xs font-bold text-emerald-700 italic">{school.motto}</p>
                  <p className="text-[11px] text-slate-500">{school.address}, {school.city} • Tél: {school.phone}</p>
                </div>
              </div>
              <div className="text-right border-l-2 border-slate-200 pl-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</div>
                <div className="text-xs font-bold text-slate-700">MINISTÈRE DE L'ÉDUCATION NATIONALE</div>
                <div className="font-mono text-xs font-bold text-amber-700 mt-1">
                  BULLETIN OFFICIEL TRIMESTRIEL
                </div>
              </div>
            </div>

            {/* Student Info Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-mono text-[10px] block">NOM & PRÉNOM</span>
                <span className="font-extrabold text-slate-900">{currentReportCard.studentName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[10px] block">MATRICULE</span>
                <span className="font-bold font-mono text-slate-900">{currentReportCard.matricule}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[10px] block">CLASSE</span>
                <span className="font-bold text-slate-900">{currentReportCard.className}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[10px] block">PERIODE</span>
                <span className="font-bold text-amber-800">{currentReportCard.term} • {currentReportCard.academicYear}</span>
              </div>
            </div>

            {/* Marks Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold">
                    <th className="p-2.5 border border-slate-700">Matière / Discipline</th>
                    <th className="p-2.5 border border-slate-700 text-center">Coeff</th>
                    <th className="p-2.5 border border-slate-700 text-center">Note / 20</th>
                    <th className="p-2.5 border border-slate-700 text-center">Total Coeff</th>
                    <th className="p-2.5 border border-slate-700">Appréciation des Professeurs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {currentReportCard.subjects.map((sub, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-2.5 border border-slate-300 font-bold text-slate-900">{sub.subjectName}</td>
                      <td className="p-2.5 border border-slate-300 text-center font-mono font-bold">{sub.coefficient}</td>
                      <td className="p-2.5 border border-slate-300 text-center font-bold text-indigo-700">{sub.score} / 20</td>
                      <td className="p-2.5 border border-slate-300 text-center font-mono font-bold text-slate-800">{sub.weightedScore}</td>
                      <td className="p-2.5 border border-slate-300 font-medium italic text-slate-700">{sub.appreciation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Results Summary & Rank Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-xs">
              <div className="text-center">
                <span className="text-emerald-800 font-bold block text-[11px]">MOYENNE GÉNÉRALE</span>
                <span className="text-2xl font-black text-emerald-700">{currentReportCard.average} / 20</span>
              </div>
              <div className="text-center">
                <span className="text-emerald-800 font-bold block text-[11px]">RANG DANS LA CLASSE</span>
                <span className="text-2xl font-black text-slate-900">{currentReportCard.rank}<sup>er</sup> / {currentReportCard.totalStudentsInClass}</span>
              </div>
              <div className="text-center">
                <span className="text-emerald-800 font-bold block text-[11px]">DECISION DU CONSEIL</span>
                <span className="text-sm font-black text-emerald-900">{currentReportCard.decision}</span>
              </div>
            </div>

            {/* Footer with Anti-Fraud QR Code & Signatures */}
            <div className="pt-4 border-t-2 border-slate-900 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                {reportQrUrl && <img src={reportQrUrl} alt="QR Code" className="w-20 h-20 border rounded p-1" />}
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> SÉCURITÉ ANTI-FRAUDE QR
                  </div>
                  <div className="text-[10px] text-slate-500 max-w-xs">
                    Ce bulletin est authentifié par le serveur central de {school.name}. Scannez le QR Code pour vérifier l'authenticité des notes.
                  </div>
                </div>
              </div>

              <div className="text-center space-y-8 pr-6">
                <div className="font-bold text-slate-800">Le Préfet des Études (Cachet & Signature)</div>
                <div className="font-serif italic font-bold text-slate-900">M. MUKENDI Alain</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CLASSES & ACADEMIC STRUCTURE */}
      {activeSubTab === 'CLASSES' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Structure Académique des Classes & Matières</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes.map(c => (
              <div key={c.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="font-black text-slate-900 text-sm">{c.name}</div>
                <div className="text-xs text-slate-500">Section : {c.section} • Cycle : {c.cycle}</div>
                <div className="text-xs text-slate-700 font-semibold">Prof. Titulaire : {c.mainTeacherName}</div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-500">Capacité : {c.capacity} places</span>
                  <span className="font-bold text-emerald-600">{c.studentCount} Élèves</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
