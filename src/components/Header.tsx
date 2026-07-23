import React from 'react';
import { School, UserRole, NetworkStatus } from '../types';
import { Building2, Wifi, WifiOff, DollarSign, GraduationCap, ShieldCheck, LogOut } from 'lucide-react';

interface HeaderProps {
  schools: School[];
  currentSchool: School;
  onSelectSchool: (school: School) => void;
  networkStatus: NetworkStatus;
  onToggleNetwork: () => void;
  currentRole: UserRole;
  activeTab: 'erp' | 'finance' | 'portal';
  availableTabs: ('erp' | 'finance' | 'portal')[];
  onChangeTab: (tab: 'erp' | 'finance' | 'portal') => void;
  onVerifyReceiptModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  schools,
  currentSchool,
  onSelectSchool,
  networkStatus,
  onToggleNetwork,
  currentRole,
  activeTab,
  availableTabs,
  onChangeTab,
  onVerifyReceiptModal,
  onLogout
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            APP ECOLE v2.4 SaaS Hybride
          </div>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currentSchool.id}
              onChange={(e) => {
                const s = schools.find(x => x.id === e.target.value);
                if (s) onSelectSchool(s);
              }}
              className="bg-slate-800 border border-slate-700 text-white rounded px-2 py-0.5 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {schools.map(school => (
                <option key={school.id} value={school.id}>
                  {school.name} ({school.currency})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Online / Offline Simulator Toggle */}
          <button
            onClick={onToggleNetwork}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold text-xs transition-all ${
              networkStatus === 'ONLINE_CLOUD'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 animate-pulse'
            }`}
            title="Cliquer pour simuler une panne d'Internet"
          >
            {networkStatus === 'ONLINE_CLOUD' ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Mode Cloud :</span> En Ligne
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Mode Local :</span> HORS-LIGNE
              </>
            )}
          </button>

          {/* Verification URL Quick Action */}
          <button
            onClick={onVerifyReceiptModal}
            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-md text-xs font-medium transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline">Vérifier un Reçu</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1 px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-md text-xs font-medium transition"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-300" />
            <span className="hidden lg:inline">Déconnexion</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700">
            <span className="text-slate-400 text-[11px] font-mono uppercase">Rôle connecté :</span>
            <span className="text-xs font-semibold text-white">{currentRole.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-emerald-500/20">
            AE
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
              APP ECOLE
              <span className="text-[10px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                {currentSchool.subdomain}.appecole.com
              </span>
            </h1>
            <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
              {currentSchool.name} • Annee {currentSchool.academicYear}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800 shrink-0">
          {availableTabs.includes('erp') && (
            <button
              onClick={() => onChangeTab('erp')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'erp'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>ERP Back-Office</span>
            </button>
          )}

          {availableTabs.includes('finance') && (
            <button
              onClick={() => onChangeTab('finance')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'finance'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Caisse & Finances</span>
            </button>
          )}

          {availableTabs.includes('portal') && (
            <button
              onClick={() => onChangeTab('portal')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'portal'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Portail</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
