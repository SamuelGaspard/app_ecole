// Technical Documentation for Hybrid Offline-First Sync & Conflict Resolution in APP ECOLE

export const SYNC_ARCHITECTURE_DOC = {
  title: "FLUX DE SYNCHRONISATION HYBRIDE (OFFLINE-FIRST) & GESTION DES CONFLITS POUR CAISSE ET NOTES",
  overview: "Ce document spécifie le flux exact de persistance locale, de mise en file d'attente (Queue), de resynchronisation idempotente et de résolution de conflits lors de la perte puis du rétablissement de la connexion Internet au niveau d'un guichet de caisse ou d'une classe.",
  
  steps: [
    {
      step: 1,
      title: "1. Saisie Hors-Ligne & Persistance Locale Inviolable (IndexedDB / SQLite local)",
      details: [
        "L'application web/desktop du caissier fonctionne via Service Worker PWA et IndexedDB (ou SQLite via Electron/PouchDB).",
        "Génération d'un identifiant universel ordonné localement : UUIDv7 (basé sur le timestamp milliseconde + entropie) pour garantir l'unicité globale sans contacter le serveur principal.",
        "Calcul du Hash de Sécurité Anti-Fraude localement : HMAC-SHA256(student_id + amount + timestamp + cashier_secret).",
        "Impression immédiate du Ticket Thermique POS 80mm avec QR Code contenant l'URL d'audit `/verify-receipt/{receipt_id}` et le hash de sécurité.",
        "Marquage du paiement dans l'IndexedDB local avec `syncStatus = 'PENDING_OFFLINE'` et insertion dans la table `offline_outbox`."
      ]
    },
    {
      step: 2,
      title: "2. Détection de Reprise de Connexion (Network Reconnection Handler)",
      details: [
        "Un écouteur `navigator.onLine` couplé à un Heartbeat ping (`/api/health` toutes les 10s) détecte le retour d'Internet.",
        "Affichage d'un indicateur visuel 'Resynchronisation en cours...' sur l'interface caisse/enseignant.",
        "Verrouillage temporaire de la file d'attente locale pour éviter tout double envoi concurrent (Mutex/Lock)."
      ]
    },
    {
      step: 3,
      title: "3. Envoi du Batch Idempotent vers le Cloud SaaS (BullMQ + Redis)",
      details: [
        "L'application locale expédie un lot de transactions (`POST /api/sync/batch`) contenant le `client_temp_id`, `receipt_number`, `security_hash` et les détails.",
        "Chaque requête inclut un en-tête d'Idempotence `X-Idempotency-Key: receipt_number`.",
        "Le backend NestJS/FastAPI reçoit le batch, valide l'authenticité des tokens JWT et injecte les jobs dans une file Redis gérée par BullMQ."
      ]
    },
    {
      step: 4,
      title: "4. Algorithme de Résolution de Conflits & Réconciliation (CRDT / Vector Clocks)",
      details: [
        "Paiements de Caisse (Finances) : Strictement Aditifs (Append-Only). Aucun conflit n'est possible sur le montant payé car chaque reçu possède un UUIDv7 unique. Si le même numéro de reçu est réémis, la contrainte d'unicité PostgreSQL `UNIQUE(receipt_number)` rejette la doublon de manière idempotente sans erreur.",
        "Notes & Présences (Enseignants) : Si deux enseignants ou le directeur modifient la même note hors-ligne, le serveur applique la règle LWW (Last-Write-Wins) basée sur l'horodatage logique + horloge vectorielle de la modification `updated_at`. Si un écart > 24h est détecté, un événement de conflit est journalisé dans `audit_logs` pour validation par le Directeur."
      ]
    },
    {
      step: 5,
      title: "5. Invalidation du Cache local, Notification WebSockets & Traçabilité",
      details: [
        "Dès l'écriture réussie dans PostgreSQL Cloud, le serveur retourne un ACK (`200 OK`) avec la liste des ID synchronisés.",
        "L'IndexedDB du caissier met à jour les reçus : `syncStatus = 'SYNCED'` et `syncedAt = NOW()`.",
        "Émission d'un SMS / notification WhatsApp automatique aux parents via Webhook (Twilio / Africa's Talking) pour confirmer la réception du paiement.",
        "Mise à jour du Tableau de Bord Financier en temps réel via WebSockets."
      ]
    },
    {
      step: 6,
      title: "6. Sécurité Anti-Fraude & Audit du QR Code (`/verify-receipt/{receipt_id}`)",
      details: [
        "Chaque ticket imprimé comporte un QR Code lisible par n'importe quel smartphone.",
        "Le QR Code pointe vers : `https://appecole.com/verify-receipt/REC-2026-00892`.",
        "Si l'élève tente de falsifier le montant sur le papier, la vérification du QR code interroge la route publique de vérification qui affiche en vert 'TICKET VALIDE ET AUTHENTIFIÉ' avec le montant exact enregistré sur la blockchain/base sécurisée de l'école."
      ]
    }
  ]
};
