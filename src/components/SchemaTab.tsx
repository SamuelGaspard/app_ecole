import React, { useState } from 'react';
import { POSTGRES_SCHEMA_SQL } from '../data/dbSchema';
import { Database, Copy, Check, ShieldAlert, Layers, Key, Zap } from 'lucide-react';

export const SchemaTab: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(POSTGRES_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Database className="w-4 h-4" />
              Spécifications d'Architecture & Schéma DDL PostgreSQL
            </div>
            <h2 className="text-2xl font-black text-white">
              Schéma de Base de Données Relationnelle Multi-Tenant
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl">
              Isolation logique par <code className="text-emerald-300 font-mono">school_id</code>, clés primaires universelles UUIDv7, traçabilité inviolable par triggers SQL et support natif de la synchronisation locale-cloud.
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copié dans le Presse-papier !' : 'Copier le Code SQL DDL'}
          </button>
        </div>

        {/* Feature Pill Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
              <Layers className="w-4 h-4" /> Multi-Tenancy Isolée
            </div>
            <p className="text-slate-300 text-xs">
              Indexation composite <code className="text-emerald-300 font-mono">(school_id, id)</code> sur toutes les tables pour cloisonnement étanche.
            </p>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-1">
              <Key className="w-4 h-4" /> Clés Universelles UUIDv7
            </div>
            <p className="text-slate-300 text-xs">
              Génération d'identifiants ordonnés dans le temps localement pour éviter les collisions de clés lors de la réconciliation.
            </p>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-1">
              <ShieldAlert className="w-4 h-4" /> Immuabilité Financière
            </div>
            <p className="text-slate-300 text-xs">
              Trigger SQL <code className="text-amber-300 font-mono">prevent_payment_delete()</code> interdisant la suppression brute de reçus de caisse.
            </p>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs mb-1">
              <Zap className="w-4 h-4" /> HMAC Anti-Fraude
            </div>
            <p className="text-slate-300 text-xs">
              Signature cryptographique HMAC-SHA256 encodée dans chaque QR Code de reçu pour audit public.
            </p>
          </div>
        </div>
      </div>

      {/* Relational Entity Mapping Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-600" />
          Répertoire des Entités Principales & Stratégies de Synchro
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3">Table SQL</th>
                <th className="p-3">Description Fonctionnelle</th>
                <th className="p-3">Clé Primaire / Étrangères</th>
                <th className="p-3">Stratégie Sync Hors-Ligne</th>
                <th className="p-3">Règle d'Inviolabilité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-mono font-bold text-slate-900">schools</td>
                <td className="p-3">Registre des écoles abonnées au SaaS</td>
                <td className="p-3 font-mono text-slate-600">id (PK), subdomain (UQ)</td>
                <td className="p-3 text-slate-500">Lecture seule en local</td>
                <td className="p-3 font-medium text-emerald-700">Validation licence SaaS</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-mono font-bold text-slate-900">users</td>
                <td className="p-3">Directeurs, Comptables, Professeurs, Parents</td>
                <td className="p-3 font-mono text-slate-600">id (PK), school_id (FK)</td>
                <td className="p-3 text-slate-500">Auth local JWT / bcrypt cache</td>
                <td className="p-3 font-medium text-indigo-700">RBAC strict par rôle</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-mono font-bold text-slate-900">students</td>
                <td className="p-3">Fiches élèves & Génération de badges QR</td>
                <td className="p-3 font-mono text-slate-600">id (PK), school_id, class_id</td>
                <td className="p-3 text-slate-500">IndexedDB miroir local</td>
                <td className="p-3 font-medium text-slate-700">Matricule unique / école</td>
              </tr>
              <tr className="hover:bg-slate-50 bg-amber-50/40">
                <td className="p-3 font-mono font-bold text-amber-900">payments</td>
                <td className="p-3">Paiements de caisse & Reçus POS</td>
                <td className="p-3 font-mono text-slate-600">id (UUIDv7), student_id, cashier_id</td>
                <td className="p-3 font-semibold text-amber-700">Queue Outbox FIFO + HMAC</td>
                <td className="p-3 font-bold text-red-600">DELETE interdit (Trigger SQL)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-mono font-bold text-slate-900">grades</td>
                <td className="p-3">Notes, compositions et moyennes</td>
                <td className="p-3 font-mono text-slate-600">id (PK), student_id, subject_id</td>
                <td className="p-3 text-slate-500">Saisie offline + Horloge Vectorielle</td>
                <td className="p-3 font-medium text-slate-700">LWW (Last-Write-Wins)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-mono font-bold text-slate-900">audit_logs</td>
                <td className="p-3">Journal d'audit de toutes les actions ERP</td>
                <td className="p-3 font-mono text-slate-600">id (PK), school_id, user_id</td>
                <td className="p-3 text-slate-500">Batch async post-sync</td>
                <td className="p-3 font-medium text-purple-700">Journal Append-Only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SQL DDL Code Editor Block */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400 font-mono text-xs ml-2">app_ecole_schema.sql</span>
          </div>
          <span className="text-slate-500 text-xs font-mono">PostgreSQL 15+ / Supabase / Cloud SQL</span>
        </div>

        <pre className="text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto p-2 rounded max-h-[600px] no-scrollbar">
          {POSTGRES_SCHEMA_SQL}
        </pre>
      </div>
    </div>
  );
};
