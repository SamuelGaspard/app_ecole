import React, { useState } from 'react';
import { School, Student, FeeStructure, Payment, NetworkStatus } from '../types';
import { DollarSign, CreditCard, Printer, ShieldCheck, QrCode, Smartphone, AlertTriangle, Send, CheckCircle2, History, Search, WifiOff, FileText } from 'lucide-react';
import QRCode from 'qrcode';

interface FinanceCaisseProps {
  school: School;
  students: Student[];
  feeStructures: FeeStructure[];
  payments: Payment[];
  onAddPayment: (payment: Omit<Payment, 'id' | 'qrCodeUrl' | 'securityHash' | 'syncStatus'>) => void;
  networkStatus: NetworkStatus;
  onOpenVerifyModal: (receiptId: string) => void;
}

export const FinanceCaisse: React.FC<FinanceCaisseProps> = ({
  school,
  students,
  feeStructures,
  payments,
  onAddPayment,
  networkStatus,
  onOpenVerifyModal
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'POS' | 'MOBILE_MONEY' | 'HISTORY' | 'IMPAYES'>('POS');
  
  // Cashier POS State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedFeeId, setSelectedFeeId] = useState<string>(feeStructures[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState<number>(feeStructures[0]?.amount || 150000);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CHECK'>('CASH');

  // Mobile Money State
  const [mmStudentId, setMmStudentId] = useState<string>(students[0]?.id || '');
  const [mmFeeId, setMmFeeId] = useState<string>(feeStructures[0]?.id || '');
  const [mmPhone, setMmPhone] = useState<string>('+243 81 555 0192');
  const [mmProvider, setMmProvider] = useState<'MOBILE_MONEY_MPESA' | 'MOBILE_MONEY_ORANGE' | 'MOBILE_MONEY_WAVE' | 'MOBILE_MONEY_MTN'>('MOBILE_MONEY_MPESA');
  const [mmSimulating, setMmSimulating] = useState(false);
  const [mmSuccess, setMmSuccess] = useState(false);

  // Active Thermal Receipt Preview State
  const [activeReceiptPayment, setActiveReceiptPayment] = useState<Payment | null>(payments[0] || null);
  const [receiptQrDataUrl, setReceiptQrDataUrl] = useState<string>('');

  // Generate Receipt QR Code whenever activeReceiptPayment changes
  React.useEffect(() => {
    if (activeReceiptPayment) {
      QRCode.toDataURL(activeReceiptPayment.qrCodeUrl, { margin: 1, width: 140 })
        .then(url => setReceiptQrDataUrl(url))
        .catch(err => console.error(err));
    }
  }, [activeReceiptPayment]);

  const handleFeeChange = (feeId: string) => {
    setSelectedFeeId(feeId);
    const fee = feeStructures.find(f => f.id === feeId);
    if (fee) setPaymentAmount(fee.amount);
  };

  const handleCashierPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === selectedStudentId);
    const fee = feeStructures.find(f => f.id === selectedFeeId);
    if (!st || !fee) return;

    const receiptNum = `REC-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    onAddPayment({
      schoolId: school.id,
      studentId: st.id,
      studentName: `${st.firstName} ${st.lastName}`,
      studentMatricule: st.matricule,
      className: st.className,
      feeStructureId: fee.id,
      feeTitle: fee.title,
      amountPaid: Number(paymentAmount),
      currency: school.currency,
      paymentMethod,
      transactionReference: `POS-${Date.now().toString().slice(-8)}`,
      cashierName: "Mme MUKANYA Jacqueline (Guichet 1)",
      cashierId: "usr_cashier_01",
      paidAt: new Date().toISOString(),
      receiptNumber: receiptNum
    });

    alert(`Paiement de ${paymentAmount.toLocaleString()} ${school.currency} enregistré avec succès ! Ticket ${receiptNum} généré.`);
  };

  const handleMobileMoneySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMmSimulating(true);

    setTimeout(() => {
      const st = students.find(s => s.id === mmStudentId);
      const fee = feeStructures.find(f => f.id === mmFeeId);
      if (!st || !fee) return;

      const receiptNum = `REC-2026-${Math.floor(100000 + Math.random() * 900000)}`;

      onAddPayment({
        schoolId: school.id,
        studentId: st.id,
        studentName: `${st.firstName} ${st.lastName}`,
        studentMatricule: st.matricule,
        className: st.className,
        feeStructureId: fee.id,
        feeTitle: fee.title,
        amountPaid: fee.amount,
        currency: school.currency,
        paymentMethod: mmProvider,
        transactionReference: `MM-WEBHOOK-${Math.floor(10000000 + Math.random() * 90000000)}`,
        cashierName: "Guichet Automatique Mobile Money",
        cashierId: "usr_system_mm",
        paidAt: new Date().toISOString(),
        receiptNumber: receiptNum
      });

      setMmSimulating(false);
      setMmSuccess(true);
      setTimeout(() => setMmSuccess(false), 4000);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Sub Navigation Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('POS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeSubTab === 'POS' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" /> Caisse Guichet POS (Espèces/Chèque)
          </button>

          <button
            onClick={() => setActiveSubTab('MOBILE_MONEY')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeSubTab === 'MOBILE_MONEY' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-4 h-4 text-indigo-400" /> Webhook Mobile Money
          </button>

          <button
            onClick={() => setActiveSubTab('HISTORY')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeSubTab === 'HISTORY' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4 text-teal-400" /> Historique Reçus & Audit
          </button>

          <button
            onClick={() => setActiveSubTab('IMPAYES')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeSubTab === 'IMPAYES' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Impayés & Relances WhatsApp
          </button>
        </div>

        <div className="text-slate-500 font-mono text-[11px] px-3">
          Caisse : {networkStatus === 'ONLINE_CLOUD' ? 'Connectée au Cloud' : 'Mode Hors-Ligne (Local)'}
        </div>
      </div>

      {/* SUB-TAB 1: PHYSICAL CASHIER POS */}
      {activeSubTab === 'POS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* POS Cashier Entry Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Guichet Caisse Physique (Saisie Directe)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Encaissement instantané des frais. Si le réseau est interrompu, le reçu est imprimé avec statut hors-ligne.
              </p>
            </div>

            <form onSubmit={handleCashierPaymentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sélectionner l'Élève *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.lastName} {s.firstName} ({s.matricule})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tranche ou Frais Concerné *</label>
                <select
                  value={selectedFeeId}
                  onChange={(e) => handleFeeChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {feeStructures.map(f => (
                    <option key={f.id} value={f.id}>{f.title} ({f.amount.toLocaleString()} {f.currency})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Montant Encaissé ({school.currency}) *</label>
                  <input
                    type="number"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-black text-emerald-700 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mode de Règlement</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as 'CASH' | 'CHECK')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="CASH">Espèces (Cash)</option>
                    <option value="CHECK">Chèque Bancaire</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Encaisser & Imprimer Ticket Thermique
              </button>
            </form>
          </div>

          {/* Real-time 80mm Thermal Receipt Preview */}
          {activeReceiptPayment && (
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-slate-700" />
                  Aperçu Reçu Thermique POS 80mm & Vérification Anti-Fraude
                </h3>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg inline-flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" /> Imprimer 80mm
                </button>
              </div>

              {/* Thermal POS Paper Ticket Component */}
              <div className="bg-white border-2 border-dashed border-slate-400 rounded-2xl p-6 max-w-sm mx-auto shadow-2xl font-mono text-[11px] text-slate-900 space-y-3">
                {/* School Header */}
                <div className="text-center space-y-0.5 border-b border-slate-300 pb-2">
                  <div className="font-extrabold text-sm uppercase">{school.name}</div>
                  <div className="text-[10px] text-slate-600">{school.address}, {school.city}</div>
                  <div className="text-[10px] text-slate-600">Tél: {school.phone}</div>
                  <div className="font-bold text-xs uppercase pt-1 text-emerald-700">REÇU DE CAISSE D'ÉCOLE</div>
                </div>

                {/* Ticket Metadata */}
                <div className="space-y-1 border-b border-slate-200 pb-2">
                  <div className="flex justify-between">
                    <span>Reçu N°:</span>
                    <span className="font-bold">{activeReceiptPayment.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date/Heure:</span>
                    <span>{new Date(activeReceiptPayment.paidAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mode:</span>
                    <span className="font-bold">{activeReceiptPayment.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Caissier:</span>
                    <span className="truncate max-w-[140px]">{activeReceiptPayment.cashierName}</span>
                  </div>
                </div>

                {/* Student & Fee Line Items */}
                <div className="space-y-1 border-b border-slate-200 pb-2">
                  <div className="flex justify-between">
                    <span>Élève:</span>
                    <span className="font-bold">{activeReceiptPayment.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Matricule:</span>
                    <span>{activeReceiptPayment.studentMatricule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Classe:</span>
                    <span>{activeReceiptPayment.className}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="font-bold">{activeReceiptPayment.feeTitle}</span>
                  </div>
                </div>

                {/* Amount Paid */}
                <div className="flex justify-between items-center text-sm font-extrabold border-b-2 border-slate-900 py-1">
                  <span>MONTANT PAYÉ:</span>
                  <span className="text-emerald-700">{activeReceiptPayment.amountPaid.toLocaleString()} {activeReceiptPayment.currency}</span>
                </div>

                {/* Anti-Fraud QR Code */}
                <div className="text-center pt-2 space-y-2">
                  {receiptQrDataUrl && (
                    <img src={receiptQrDataUrl} alt="QR Code" className="w-28 h-28 mx-auto border rounded p-1" />
                  )}
                  <div className="text-[9px] text-slate-500 leading-tight">
                    Scannez pour vérifier l'authenticité sur le serveur public.
                  </div>
                  <div className="text-[8px] font-mono text-slate-400 break-all">
                    Hash: {activeReceiptPayment.securityHash.slice(0, 32)}...
                  </div>
                </div>

                <button
                  onClick={() => onOpenVerifyModal(activeReceiptPayment.receiptNumber)}
                  className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] rounded border border-indigo-200 transition"
                >
                  Simuler Scan QR Code Audit
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: MOBILE MONEY WEBHOOK SIMULATOR */}
      {activeSubTab === 'MOBILE_MONEY' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-black text-slate-900 flex items-center justify-center gap-2">
              <Smartphone className="w-6 h-6 text-indigo-600" />
              Paiement Direct par Mobile Money (M-Pesa, Orange, Wave, MTN)
            </h3>
            <p className="text-xs text-slate-500">
              Intégration Webhook temps réel. Le parent initialise le transfert et le reçu est auto-généré sur le Cloud.
            </p>
          </div>

          {mmSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-slate-900 text-base">Paiement Mobile Money Validé par Webhook !</h4>
              <p className="text-xs text-slate-600">
                La notification push SMS a été envoyée au parent et le paiement a été inscrit au registre financier.
              </p>
            </div>
          ) : (
            <form onSubmit={handleMobileMoneySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sélectionner l'Opérateur Mobile Money *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setMmProvider('MOBILE_MONEY_MPESA')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition ${
                      mmProvider === 'MOBILE_MONEY_MPESA' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    M-PESA (Vodacom)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMmProvider('MOBILE_MONEY_ORANGE')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition ${
                      mmProvider === 'MOBILE_MONEY_ORANGE' ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Orange Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setMmProvider('MOBILE_MONEY_WAVE')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition ${
                      mmProvider === 'MOBILE_MONEY_WAVE' ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Wave Senegal/CI
                  </button>
                  <button
                    type="button"
                    onClick={() => setMmProvider('MOBILE_MONEY_MTN')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition ${
                      mmProvider === 'MOBILE_MONEY_MTN' ? 'bg-yellow-500 text-slate-950 border-yellow-500' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    MTN MoMo
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Élève *</label>
                <select
                  value={mmStudentId}
                  onChange={(e) => setMmStudentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.lastName} {s.firstName} ({s.className})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Numéro de Téléphone Portefeuille Parent *</label>
                <input
                  type="tel"
                  required
                  value={mmPhone}
                  onChange={(e) => setMmPhone(e.target.value)}
                  placeholder="+243 81 000 0000"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={mmSimulating}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                {mmSimulating ? 'Attente Confirmation USSD Push...' : 'Simuler Webhook Envoi Mobile Money'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* SUB-TAB 3: HISTORY & AUDIT LOGS */}
      {activeSubTab === 'HISTORY' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Registre Historique des Encaissements</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">N° Reçu</th>
                  <th className="p-3">Élève & Classe</th>
                  <th className="p-3">Libellé Frais</th>
                  <th className="p-3">Montant</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3">Horodatage</th>
                  <th className="p-3 text-right">Action Reçu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{p.receiptNumber}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{p.studentName}</div>
                      <div className="text-[10px] text-slate-500">{p.className}</div>
                    </td>
                    <td className="p-3 font-medium text-slate-700">{p.feeTitle}</td>
                    <td className="p-3 font-extrabold text-emerald-700">{p.amountPaid.toLocaleString()} {p.currency}</td>
                    <td className="p-3 font-semibold text-slate-600">{p.paymentMethod}</td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{new Date(p.paidAt).toLocaleTimeString()}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setActiveReceiptPayment(p);
                          setActiveSubTab('POS');
                        }}
                        className="px-2.5 py-1 bg-slate-900 text-white font-bold rounded text-[11px] inline-flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3 text-emerald-400" /> Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: OVERDUE TUITION & AUTOMATED REMINDERS */}
      {activeSubTab === 'IMPAYES' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Tableau de Bord des Impayés & Relances Automatiques
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Envoyez un rappel automatique par SMS/WhatsApp aux tuteurs légaux en 1 clic.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Emmanuel TSISEKEDI (6ème Biologie-Chimie)</h4>
                  <p className="text-xs text-slate-500">Parent: M. TSISEKEDI Joseph (+243 82 111 2233)</p>
                </div>
                <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold text-[10px] rounded">Retard 2ème Tranche</span>
              </div>
              <div className="text-xs font-bold text-slate-800">Solde Restant : 150 000 FC</div>
              <button
                onClick={() => alert("Message WhatsApp de relance envoyé au parent : +243 82 111 2233 avec lien de paiement direct.")}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition inline-flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Envoyer Relance WhatsApp
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Grace MUKENGESHAYI (3ème Littéraire A)</h4>
                  <p className="text-xs text-slate-500">Parent: Mme MUKENGESHAYI Marie (+243 85 999 0011)</p>
                </div>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded">Rappel Échéance</span>
              </div>
              <div className="text-xs font-bold text-slate-800">Solde Restant : 150 000 FC</div>
              <button
                onClick={() => alert("Message WhatsApp de relance envoyé au parent : +243 85 999 0011 avec lien de paiement direct.")}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition inline-flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Envoyer Relance WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
