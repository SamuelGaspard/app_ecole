import React, { useState } from 'react';
import { School, Student, Grade, Payment, UserRole } from '../types';
import { Users, GraduationCap, CheckCircle2, Clock, AlertCircle, DollarSign, Calendar, BookOpen, Send } from 'lucide-react';

interface Message {
  id: string;
  senderRole: UserRole;
  senderName: string;
  recipientRole: UserRole;
  recipientName: string;
  content: string;
  timestamp: string;
}

interface ParentTeacherPortalProps {
  role: UserRole;
  school: School;
  students: Student[];
  grades: Grade[];
  payments: Payment[];
  onAddPayment: (payment: Omit<Payment, 'id' | 'qrCodeUrl' | 'securityHash' | 'syncStatus'>) => void;
}

export const ParentTeacherPortal: React.FC<ParentTeacherPortalProps> = ({
  role,
  school,
  students,
  grades,
  payments,
  onAddPayment
}) => {
  const [selectedStudent, setSelectedStudent] = useState<Student>(students[0]);
  const isParent = role === 'PARENT';
  const isTeacher = role === 'TEACHER';
  const isSchoolAdmin = role === 'SCHOOL_ADMIN';

  const getDisplayRoleName = (userRole: UserRole) => {
    if (userRole === 'PARENT') return 'Parent';
    if (userRole === 'TEACHER') return 'Professeur';
    if (userRole === 'SCHOOL_ADMIN') return 'Directeur';
    return userRole;
  };

  // Teacher Class Diary State
  const [lessonTopic, setLessonTopic] = useState('Résolution d\'équations du 2nd degré');
  const [homeworkText, setHomeworkText] = useState('Faire les exercices 12 à 15 page 45.');
  const [diarySaved, setDiarySaved] = useState(false);

  // Attendance State
  const [attendance, setAttendance] = useState<{ [studentId: string]: 'PRESENT' | 'ABSENT' | 'LATE' }>({
    stu_001: 'PRESENT',
    stu_002: 'PRESENT',
    stu_003: 'ABSENT',
    stu_004: 'PRESENT'
  });

  const [messageRecipient, setMessageRecipient] = useState<'TEACHER' | 'SCHOOL_ADMIN'>('TEACHER');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_001',
      senderRole: 'PARENT',
      senderName: 'Mme Mukanya',
      recipientRole: 'TEACHER',
      recipientName: 'M. Lukusa',
      content: 'Bonjour, pouvez-vous m’envoyer la note de Nathan pour le dernier devoir ?',
      timestamp: '2026-07-20 08:43'
    },
    {
      id: 'msg_002',
      senderRole: 'TEACHER',
      senderName: 'M. Lukusa',
      recipientRole: 'PARENT',
      recipientName: 'Mme Mukanya',
      content: 'Bonjour Mme Mukanya, la note est 15/20 et le devoir est disponible dans le cahier de texte.',
      timestamp: '2026-07-20 09:05'
    },
    {
      id: 'msg_003',
      senderRole: 'SCHOOL_ADMIN',
      senderName: 'M. MUKENDI Alain',
      recipientRole: 'PARENT',
      recipientName: 'Mme Mukanya',
      content: 'Je vous invite à la réunion des parents jeudi prochain à 15h.',
      timestamp: '2026-07-21 10:20'
    }
  ]);
  const [messageText, setMessageText] = useState('');
  const relevantMessages = messages.filter((msg) => {
    if (isParent) {
      return msg.senderRole === 'PARENT' || msg.recipientRole === 'PARENT';
    }
    if (isTeacher) {
      return msg.senderRole === 'TEACHER' || msg.recipientRole === 'TEACHER';
    }
    if (isSchoolAdmin) {
      return msg.senderRole === 'SCHOOL_ADMIN' || msg.recipientRole === 'SCHOOL_ADMIN';
    }
    return false;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const recipientRole = role === 'PARENT' ? messageRecipient : 'PARENT';
    const recipientName = recipientRole === 'TEACHER'
      ? 'M. Lukusa'
      : recipientRole === 'SCHOOL_ADMIN'
      ? 'M. MUKENDI Alain'
      : 'Parent';

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderRole: role,
      senderName: role === 'PARENT' ? 'Parent' : role === 'TEACHER' ? 'M. Lukusa' : 'M. MUKENDI Alain',
      recipientRole,
      recipientName,
      content: messageText.trim(),
      timestamp: new Date().toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
  };

  const handleDiarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDiarySaved(true);
    setTimeout(() => setDiarySaved(false), 3000);
  };

  const studentPayments = payments.filter(p => p.studentId === selectedStudent.id);
  const totalPaid = studentPayments.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalTuitionDue = 420000; // 150k + 150k + 120k FC
  const balance = totalTuitionDue - totalPaid;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Role View Selector Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base">{isParent ? 'Espace Parent' : isTeacher ? 'Espace Enseignant' : 'Portail sécurisé'}</h3>
            <p className="text-xs text-slate-400">{isParent ? 'Consultation de l’enfant, paiement et communication avec les professeurs.' : isTeacher ? 'Cahier de texte, présence et messagerie avec les parents.' : 'Accès réservé aux parents et enseignants.'}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-950 border border-slate-800 px-4 py-2 text-xs text-slate-300">
          Rôle actif : <span className="font-semibold text-white">{role === 'PARENT' ? 'Parent' : role === 'TEACHER' ? 'Enseignant' : role}</span>
        </div>
      </div>

      {isParent && (
        <div className="space-y-6">
          {/* Child Selector */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={selectedStudent.photoUrl}
                alt={selectedStudent.firstName}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
              />
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase">Enfant Sélectionné :</div>
                <h4 className="text-lg font-black text-slate-900">{selectedStudent.firstName} {selectedStudent.lastName}</h4>
                <div className="text-xs text-slate-500">{selectedStudent.className} • Mat: {selectedStudent.matricule}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Basculer d'Enfant :</span>
              <select
                value={selectedStudent.id}
                onChange={(e) => {
                  const s = students.find(x => x.id === e.target.value);
                  if (s) setSelectedStudent(s);
                }}
                className="bg-slate-50 border border-slate-300 font-bold text-slate-900 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Financial Summary & Direct Payment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-emerald-400 uppercase">
                <span>Solde Frais Scolaires</span>
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="text-3xl font-black">{balance > 0 ? `${balance.toLocaleString()} ${school.currency}` : '0 FC (Souldé)'}</div>
              <div className="text-xs text-slate-300">Total versé : {totalPaid.toLocaleString()} {school.currency} sur {totalTuitionDue.toLocaleString()} FC</div>

              {balance > 0 && (
                <button
                  onClick={() => alert(`Redirection vers le paiement Mobile Money M-Pesa pour ${balance.toLocaleString()} FC...`)}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
                >
                  Payer le Solde via Mobile Money
                </button>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase">Assiduité & Présence</div>
              <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" /> 96% Présence
              </div>
              <p className="text-xs text-slate-500">1 absence justifiée (Certificat médical fourni)</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase">Moyenne 1er Trimestre</div>
              <div className="text-2xl font-black text-indigo-700">16.3 / 20</div>
              <p className="text-xs text-slate-500">2ème de la classe • Mention Très Bien</p>
            </div>
          </div>

          {/* Payments List for this Student */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Historique de vos Paiements Effectués</h4>
            <div className="space-y-2">
              {studentPayments.map((p) => (
                <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{p.feeTitle}</div>
                    <div className="text-[11px] text-slate-500">Reçu {p.receiptNumber} • {p.paymentMethod}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-700">{p.amountPaid.toLocaleString()} {p.currency}</div>
                    <div className="text-[10px] text-slate-400">{new Date(p.paidAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Parent-Teacher Communication */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Messagerie Parent ↔ Équipe scolaire</h4>
                <p className="text-xs text-slate-500">Choisissez le directeur ou le professeur, puis envoyez votre message.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="text-xs font-semibold text-slate-500">Destinataire</label>
                <select
                  value={messageRecipient}
                  onChange={(e) => setMessageRecipient(e.target.value as 'TEACHER' | 'SCHOOL_ADMIN')}
                  className="rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="TEACHER">Professeur</option>
                  <option value="SCHOOL_ADMIN">Directeur</option>
                </select>
              </div>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {relevantMessages.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  Aucun message pour le moment. Envoyez un premier message et répondez depuis le portail du parent, professeur ou directeur.
                </div>
              ) : relevantMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-2xl p-4 text-xs ${msg.senderRole === 'PARENT' ? 'bg-emerald-50 border border-emerald-200 text-slate-900' : 'bg-slate-900 border border-slate-800 text-slate-100'}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="space-y-1">
                      <div className="font-semibold">{msg.senderRole === 'PARENT' ? 'Vous' : msg.senderName}</div>
                      <div className="text-[10px] text-slate-400">À : {msg.recipientName}</div>
                    </div>
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={3}
                placeholder="Écrire un message au professeur ou au directeur..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white py-3 text-sm font-semibold transition"
              >
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      )}

      {(isTeacher || isSchoolAdmin) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Roll Call / Attendance Marker */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Pointage Journalier des Présences (6ème Bio-Chimie)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Cochez les présences. Les alertes d'absence sont envoyées par SMS.</p>
              </div>
            </div>

            <div className="space-y-2">
              {students.map((st) => (
                <div key={st.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="font-bold text-slate-900">{st.lastName} {st.firstName}</div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setAttendance({ ...attendance, [st.id]: 'PRESENT' })}
                      className={`px-3 py-1 rounded-lg font-bold transition ${
                        attendance[st.id] === 'PRESENT' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      Présent
                    </button>
                    <button
                      onClick={() => setAttendance({ ...attendance, [st.id]: 'ABSENT' })}
                      className={`px-3 py-1 rounded-lg font-bold transition ${
                        attendance[st.id] === 'ABSENT' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Class Diary (Cahier de Texte Digital) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Cahier de Texte Digital (Prof. LUKUSA Jean-Paul)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Saisissez les matières enseignées aujourd'hui et les devoirs à domicile.</p>
            </div>

            {diarySaved ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center text-xs font-bold text-emerald-800">
                Cahier de texte enregistré et synchronisé avec le Portail Parents !
              </div>
            ) : (
              <form onSubmit={handleDiarySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Matière & Chapitre Enseigné *</label>
                  <input
                    type="text"
                    required
                    value={lessonTopic}
                    onChange={(e) => setLessonTopic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Devoir à Domicile pour la Prochaine Séance</label>
                  <textarea
                    rows={3}
                    value={homeworkText}
                    onChange={(e) => setHomeworkText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Publier le Cahier de Texte
                </button>
              </form>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Messagerie {isTeacher ? 'Enseignant' : 'Directeur'} ↔ Parent</h4>
                <p className="text-xs text-slate-500">Envoyez des notes aux parents ou répondez à leurs messages depuis votre espace {isTeacher ? 'professeur' : 'directeur'}.</p>
              </div>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {relevantMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-2xl p-4 text-xs ${msg.senderRole === 'TEACHER' ? 'bg-indigo-50 border border-indigo-200 text-slate-900' : msg.senderRole === 'PARENT' ? 'bg-emerald-50 border border-emerald-200 text-slate-900' : 'bg-slate-900 border border-slate-800 text-slate-100'}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="space-y-1">
                      <div className="font-semibold">{msg.senderRole === 'PARENT' ? 'Parent' : msg.senderName}</div>
                      <div className="text-[10px] text-slate-400">À : {msg.recipientName}</div>
                    </div>
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={3}
                placeholder="Écrire un message au parent..."
                className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-3 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white py-3 text-sm font-semibold transition"
              >
                Envoyer au parent
              </button>
            </form>
          </div>
        </div>
      )}

      {!isParent && !isTeacher && !isSchoolAdmin && (
        <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-sm text-slate-900">
          <h4 className="font-bold text-lg">Accès non autorisé</h4>
          <p className="mt-2 text-sm text-slate-600">Ce portail est réservé aux parents, enseignants et au directeur. Veuillez vous connecter avec le rôle approprié.</p>
        </div>
      )}
    </div>
  );
};
