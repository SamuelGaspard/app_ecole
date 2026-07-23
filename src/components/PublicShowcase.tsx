import React, { useState } from 'react';
import { School, FeeStructure } from '../types';
import { Globe, GraduationCap, Calendar, CheckCircle2, Phone, Mail, MapPin, Award, BookOpen, Send, Sparkles } from 'lucide-react';

interface PublicShowcaseProps {
  school: School;
  feeStructures: FeeStructure[];
  onLoginRequest: () => void;
}

export const PublicShowcase: React.FC<PublicShowcaseProps> = ({
  school,
  feeStructures,
  onLoginRequest
}) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'ADMISSION' | 'FEES' | 'CONTACT'>('HOME');
  const [admissionSubmitted, setAdmissionSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    desiredClass: '6ème Biologie-Chimie',
    notes: ''
  });

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdmissionSubmitted(true);
    setTimeout(() => {
      setAdmissionSubmitted(false);
      setFormData({
        studentName: '',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        desiredClass: '6ème Biologie-Chimie',
        notes: ''
      });
    }, 4000);
  };

  return (
    <div className="bg-slate-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      {/* Subdomain URL Simulator Bar */}
      <div className="max-w-6xl mx-auto mb-6 bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-white shadow-lg">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">Site Vitrine Public Généré Automatiquement :</span>
          <span className="font-mono text-emerald-300 font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            https://{school.subdomain}.appecole.com
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-slate-300 text-[11px]">En Ligne • SSL Crypté & Certifié</span>
        </div>
      </div>

      {/* Main Website Showcase Frame */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* Navigation Header */}
        <header className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={school.logoUrl}
              alt={school.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500/40"
            />
            <div>
              <h1 className="text-lg font-extrabold text-white">{school.name}</h1>
              <p className="text-xs text-emerald-400 font-semibold italic">{school.motto}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('HOME')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'HOME' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Accueil & Présentation
            </button>
            <button
              onClick={() => setActiveTab('FEES')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'FEES' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Frais & Grille Tarifaire
            </button>
            <button
              onClick={() => setActiveTab('ADMISSION')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'ADMISSION' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Admission en Ligne
            </button>
            <button
              onClick={() => setActiveTab('CONTACT')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'CONTACT' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Contact
            </button>
          </nav>
        </header>

        {/* Tab Content 1: HOME */}
        {activeTab === 'HOME' && (
          <div className="space-y-8 pb-12">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white px-8 py-16 text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" /> Année Scolaire {school.academicYear} • Inscriptions Ouvertes
              </div>
              <h2 className="text-3xl sm:text-4xl font-black max-w-3xl mx-auto leading-tight">
                Façonner l'Élite de Demain par une Éducation Rigoureuse & Rigoureusement Suivie
              </h2>
              <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
                {school.name} offre un enseignement de qualité supérieure avec un suivi numérique personnalisé des notes, présences et bulletins pour chaque élève.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setActiveTab('ADMISSION')}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                >
                  Inscrire mon Enfant en Ligne
                </button>
                <button
                  onClick={() => setActiveTab('FEES')}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition"
                >
                  Consulter les Frais Scolaires
                </button>
                <button
                  onClick={onLoginRequest}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl border border-slate-300 transition"
                >
                  Se connecter
                </button>
              </div>
            </div>

            {/* Key Stats Cards */}
            <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-1">
                <Award className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-2xl font-black text-slate-900">98.5%</div>
                <div className="text-xs text-slate-500 font-semibold">Réussite à l'Examen d'État</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-1">
                <GraduationCap className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-2xl font-black text-slate-900">1 240+</div>
                <div className="text-xs text-slate-500 font-semibold">Élèves Enregistrés</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-1">
                <BookOpen className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-2xl font-black text-slate-900">100%</div>
                <div className="text-xs text-slate-500 font-semibold">Bulletins & Reçus Digitalisés</div>
              </div>
            </div>

            {/* News & Announcements Feed */}
            <div className="max-w-5xl mx-auto px-6 space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Dernières Actualités & Avis aux Parents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Rentrée & Organisation
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">Paiement de la 2ème Tranche de Minerval</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Les parents d'élèves sont priés d'effectuer le règlement au guichet de l'école ou directement via Mobile Money (M-Pesa / Orange Money) depuis le portail.
                  </p>
                  <span className="text-[11px] text-slate-400 block pt-1 font-mono">Publié le 15 Janvier 2026</span>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                    Événement
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">Remise des Bulletins du 1er Trimestre</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    La réunion des parents d'élèves aura lieu ce samedi à 09h00. Les bulletins sécurisés par QR Code seront distribués en main propre ou téléchargeables.
                  </p>
                  <span className="text-[11px] text-slate-400 block pt-1 font-mono">Publié le 10 Février 2026</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: FEES */}
        {activeTab === 'FEES' && (
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Grille des Frais Scolaires - {school.academicYear}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Modalités de paiement transparentes en monnaie officielle ({school.currency}). Paiements acceptés en espèces au guichet ou via Mobile Money.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feeStructures.map((fee) => (
                <div key={fee.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{fee.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Section : {fee.cycle} • Échéance : {fee.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-600">
                      {fee.amount.toLocaleString()} {fee.currency}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                      {fee.isRequired ? 'Obligatoire' : 'Optionnel'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: ADMISSION */}
        {activeTab === 'ADMISSION' && (
          <div className="p-8 space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Demande d'Admission en Ligne</h2>
              <p className="text-xs text-slate-500">
                Remplissez ce formulaire pour préinscrire votre enfant à {school.name}. La direction de l'école vous recontactera sous 24h par SMS.
              </p>
            </div>

            {admissionSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-black text-slate-900 text-lg">Demande Enregistrée avec Succès !</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Votre demande de préinscription a été transmise à la direction de {school.name}. Vous recevrez un SMS de confirmation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAdmissionSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom complet du candidat élève *</label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="Ex: KABAMBA Grace"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Classe demandée *</label>
                    <select
                      value={formData.desiredClass}
                      onChange={(e) => setFormData({ ...formData, desiredClass: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="6ème Biologie-Chimie">6ème Biologie-Chimie</option>
                      <option value="3ème Littéraire A">3ème Littéraire A</option>
                      <option value="5ème Primaire B">5ème Primaire B</option>
                      <option value="Autre Class">Autre Classe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nom du Parent / Tuteur *</label>
                    <input
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="Ex: M. KABAMBA Augustin"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Téléphone Whatsapp Parent *</label>
                    <input
                      type="tel"
                      required
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      placeholder="+243 81 000 0000"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Adresse Email Parent</label>
                    <input
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      placeholder="parent@gmail.com"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Soumettre la Demande d'Admission
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab Content 4: CONTACT */}
        {activeTab === 'CONTACT' && (
          <div className="p-8 space-y-6 max-w-2xl mx-auto text-xs text-slate-700">
            <h2 className="text-2xl font-black text-slate-900 text-center">Coordonnées de l'Établissement</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Adresse Physique</h4>
                  <p className="text-slate-600">{school.address}, {school.city}, {school.country}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Téléphone du Secrétariat</h4>
                  <p className="text-slate-600">{school.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Adresse Électronique</h4>
                  <p className="text-slate-600">{school.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-slate-950 text-slate-400 text-xs px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <span>© 2026 {school.name}. Propulsé par APP ECOLE SaaS Hybride.</span>
          <span className="font-mono text-[11px] text-slate-500">ID: {school.id}</span>
        </footer>
      </div>
    </div>
  );
};
