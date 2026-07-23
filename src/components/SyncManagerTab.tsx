import React, { useState } from 'react';
import { SYNC_ARCHITECTURE_DOC } from '../data/syncDocs';
import { NetworkStatus, PendingSyncItem, AuditLog } from '../types';
import { RefreshCw, Wifi, WifiOff, CheckCircle2, AlertTriangle, Play, Server, Database, ShieldCheck, ArrowRight, Activity } from 'lucide-react';

interface SyncManagerTabProps {
  networkStatus: NetworkStatus;
  onToggleNetwork: () => void;
  pendingSyncItems: PendingSyncItem[];
  onTriggerSyncBatch: () => void;
  auditLogs: AuditLog[];
}

export const SyncManagerTab: React.FC<SyncManagerTabProps> = ({
  networkStatus,
  onToggleNetwork,
  pendingSyncItems,
  onTriggerSyncBatch,
  auditLogs
}) => {
  const [isSyncingProcess, setIsSyncingProcess] = useState(false);
  const [syncStep, setSyncStep] = useState<number>(0);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  const runDetailedSyncSimulation = () => {
    setIsSyncingProcess(true);
    setSyncStep(1);
    setSyncLogs([`[${new Date().toLocaleTimeString()}] Détection du rétablissement réseau (Ping /api/health OK)...`]);

    setTimeout(() => {
      setSyncStep(2);
      setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Extraction de 2 transactions de la file IndexedDB local outbox...`]);
    }, 1200);

    setTimeout(() => {
      setSyncStep(3);
      setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Vérification des signatures HMAC-SHA256 & Unicité des UUIDv7...`]);
    }, 2400);

    setTimeout(() => {
      setSyncStep(4);
      setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Injection dans la queue Redis + Worker BullMQ [Queue: sync-school-payments]...`]);
    }, 3600);

    setTimeout(() => {
      setSyncStep(5);
      setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Écriture réussie dans PostgreSQL Cloud (0 conflits). Envoi SMS de confirmation aux parents.`]);
      onTriggerSyncBatch();
    }, 4800);

    setTimeout(() => {
      setIsSyncingProcess(false);
      setSyncStep(6);
    }, 5500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Network Status & Control Banner */}
      <div className={`border rounded-2xl p-6 shadow-xl transition-all ${
        networkStatus === 'ONLINE_CLOUD'
          ? 'bg-slate-900 border-slate-800 text-white'
          : 'bg-amber-950/80 border-amber-600/60 text-amber-100'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {networkStatus === 'ONLINE_CLOUD' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs">
                  <Wifi className="w-3.5 h-3.5" /> RECOUPEMENT EN LIGNE (SaaS Cloud PostgreSQL)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs animate-pulse">
                  <WifiOff className="w-3.5 h-3.5" /> MODE ISOLÉ HORS-LIGNE (Guichet Caisse / IndexedDB)
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black">
              Moteur de Synchronisation Resiliente & Tolerante aux Pannes
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              En cas de coupure de fibre ou d'électricité à l'école, les encaissements et saisies de notes continuent en local sans interruption. Les reçus authentifiés par QR Code sont imprimés instantanément.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={onToggleNetwork}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition border ${
                networkStatus === 'ONLINE_CLOUD'
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
              }`}
            >
              {networkStatus === 'ONLINE_CLOUD' ? (
                <>
                  <WifiOff className="w-4 h-4" /> Simuler Coupure Réseau
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4" /> Rétablir la Connexion
                </>
              )}
            </button>

            <button
              onClick={runDetailedSyncSimulation}
              disabled={pendingSyncItems.length === 0 || isSyncingProcess}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition ${
                pendingSyncItems.length > 0 && !isSyncingProcess
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingProcess ? 'animate-spin' : ''}`} />
              {isSyncingProcess ? 'Lancement du Sync Engine...' : `Lancer la Synchro (${pendingSyncItems.length} items)`}
            </button>
          </div>
        </div>

        {/* Live Progress Bar during sync simulation */}
        {isSyncingProcess && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-400 flex items-center gap-2">
                <Activity className="w-4 h-4 animate-spin" /> Étape {syncStep}/5 en cours d'exécution...
              </span>
              <span className="text-slate-400">{syncStep * 20}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-700 ease-out"
                style={{ width: `${syncStep * 20}%` }}
              ></div>
            </div>

            {/* Live Terminal Log */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-emerald-400 space-y-1">
              {syncLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pending Queue Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-amber-600" />
              File d'Attente Locale Outbox (IndexedDB / Local Storage)
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Éléments mis en mémoire locale durant le mode hors-ligne en attente d'envoi vers Redis / BullMQ Cloud.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full border border-amber-200">
            {pendingSyncItems.length} En attente
          </span>
        </div>

        {pendingSyncItems.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">File d'attente synchronisée à 100%</h4>
            <p className="text-slate-500 text-xs max-w-md mx-auto">
              Toutes les transactions financières et saisies de notes de l'établissement sont parfaitement à jour sur le serveur Cloud PostgreSQL.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Type</th>
                  <th className="p-3">Identifiant / Détails</th>
                  <th className="p-3">Nœud d'Origine</th>
                  <th className="p-3">Horodatage Local</th>
                  <th className="p-3">Statut Queue</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pendingSyncItems.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/50 transition">
                    <td className="p-3 font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        item.type === 'PAYMENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">
                        {item.payload.receiptNumber || item.payload.studentName}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {item.payload.feeTitle || item.payload.subject} • {item.payload.amountPaid ? `${item.payload.amountPaid.toLocaleString()} FC` : `${item.payload.score}/20`}
                      </div>
                    </td>
                    <td className="p-3 text-slate-600 font-mono text-[11px]">{item.deviceNode}</td>
                    <td className="p-3 text-slate-500">{new Date(item.createdAt).toLocaleTimeString()}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        <AlertTriangle className="w-3 h-3" /> Hors-Ligne (IndexedDB)
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={runDetailedSyncSimulation}
                        className="px-2.5 py-1 bg-slate-900 text-white font-semibold text-[11px] rounded hover:bg-slate-800"
                      >
                        Resynchroniser
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sync Architecture Technical Steps Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white space-y-6">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            Spécifications de la Résilience Caisse / Synchronisation Idempotente
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Explication pas-à-pas du protocole de tolérance aux pannes appliqué aux transactions de guichet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SYNC_ARCHITECTURE_DOC.steps.map((s) => (
            <div key={s.step} className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 space-y-2">
              <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
                Étape {s.step}
              </div>
              <h4 className="font-extrabold text-sm text-white">{s.title}</h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                {s.details.map((d, i) => (
                  <li key={i} className="leading-relaxed">{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Trail Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />
          Journal d'Audit des Synchronisations & Événements Immuables
        </h3>
        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{log.userName}</span>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-mono text-[10px]">
                    {log.userRole}
                  </span>
                  {log.isOfflineEvent && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-medium text-[10px] border border-amber-300">
                      Sync Après Panne
                    </span>
                  )}
                </div>
                <p className="text-slate-600">{log.details}</p>
                <div className="text-[11px] text-slate-400 font-mono">
                  IP / Node: {log.ipAddress} • Ref: {log.entityId}
                </div>
              </div>
              <div className="text-right text-slate-400 text-[11px] shrink-0 font-mono">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
