# 📋 Remember

> Ne laissez plus jamais un document important expirer.  
> **Remember** vous permet de suivre les dates d'expiration de vos documents personnels et de recevoir des rappels automatiques par Email, SMS ou WhatsApp.

 <img width="1343" height="611" alt="image" src="https://github.com/user-attachments/assets/f0b0146b-73bc-444c-88d1-18d60e465111" />
<br/>
 <img width="829" height="617" alt="image" src="https://github.com/user-attachments/assets/6c88ab95-5e2b-4305-a656-13f6c9122261" />
<br/>
 <img width="556" height="615" alt="image" src="https://github.com/user-attachments/assets/ae2b4777-9e1f-42d3-8edb-7988474fb7e3" />
<br/>
 <img width="1352" height="627" alt="image" src="https://github.com/user-attachments/assets/12c45ccf-d690-4ecd-823c-5476bab1590b" />

 
## ✨ Fonctionnalités

- ✅ Inscription & connexion sécurisée (JWT)
- 📄 Ajout de documents personnels avec date d'expiration
- 🔔 Rappels automatiques — Email, SMS, WhatsApp
- ⏰ Alertes configurables — 1, 2, 3 ou 6 mois avant expiration
- 📊 Dashboard avec statut des documents (Valides / Bientôt / Urgents / Expirés)
- 🗂️ Types de documents supportés :
  - Carte d'identité
  - Passeport
  - Permis de conduire
  - Carte Vitale
  - Titre de séjour
  - Visa
  - Assurance
  - Autre

---

## 🚀 Technologies utilisées

### Frontend
- **React.js** — Interface utilisateur
- **Tailwind CSS** — Design moderne et responsive
- **Axios** — Communication avec l'API

### Backend
- **Node.js / Express.js** — API REST
- **MySQL** — Base de données
- **JWT** — Authentification sécurisée

---

## 📂 Structure du projet
Projet-Remember/
├── backend/
│   ├── middleware/       # Authentification JWT
│   ├── routes/           # Routes API
│   ├── db.js             # Connexion MySQL
│   ├── server.js         # Point d'entrée
│   ├── schema.sql        # Structure de la base de données
│   └── .env              # Variables d'environnement (non partagé)
│
└── remember/             # Frontend React
