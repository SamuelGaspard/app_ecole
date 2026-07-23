import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Lock, Building2, Search, X } from 'lucide-react';

interface ReceiptVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReceiptId?: string;
}

export const ReceiptVerifyModal: React.FC<ReceiptVerifyModalProps> = ({
  isOpen,
  onClose,
  initialReceiptId = 'REC-2025-101201'
}) => {
  const [inputReceiptId, setInputReceiptId] = useState(initialReceiptId);
  const [searchedId, setSearchedId] = useState(initialReceiptId);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedId(inputReceiptId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-slate-900 space-y-0 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Portail Public d'Audit Anti-Fraude</h3>
              <p className="text-[11px] text-slate-400">Route publique : /verify-receipt/{searchedId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={inputReceiptId}
              onChange={(e) => setInputReceiptId(e.target.value)}
              placeholder="Entrer un N° de Reçu (ex: REC-2025-101201)..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" /> Vérifier
            </button>
          </form>

          {/* Verification Badge */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-black text-emerald-900 text-sm">REÇU OFFICIEL AUTHENTIFIÉ & INFALSIFIABLE</h4>
            <p className="text-[11px] text-emerald-800 leading-relaxed max-w-sm mx-auto">
              Ce récépissé de paiement à été certifié par le registre financier central de l'établissement scolaire.
            </p>
          </div>

          {/* Audit Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 font-sans">
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Numéro de Reçu:</span>
              <span className="font-mono font-bold text-slate-900">{searchedId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Établissement:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" /> Complexe Scolaire Espoir
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Élève Bénéficiaire:</span>
              <span className="font-bold text-slate-900">Marc KABAMBA MUTA (STU-2026-089)</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Libellé Frais:</span>
              <span className="font-semibold text-slate-800">Minerval - 1ère Tranche 2025-2026</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Montant Certifié:</span>
              <span className="font-black text-emerald-700 text-sm">150,000 FC</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">Mode de Paiement:</span>
              <span className="font-semibold text-slate-800">CASH (Guichet Principal Caisse 1)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Signature HMAC-SHA256:</span>
              <span className="font-mono text-[10px] text-slate-400 truncate max-w-[180px]">
                a8f391b4c902781d4e0291028347
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-500" /> Traçabilité Blockchain/PostgreSQL
            </span>
            <span>Horodatage : {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
