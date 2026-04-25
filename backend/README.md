# Remember Backend

## 🚀 Démarrage rapide

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer la base de données

#### Avec MySQL sur Windows :

1. Ouvre MySQL Workbench ou utilise le terminal MySQL :

```bash
mysql -u root -p
```

2. Crée la base de données et les tables :

```bash
source schema.sql
```

Ou manuellement :

```sql
CREATE DATABASE IF NOT EXISTS remember_db;
USE remember_db;
CREATE TABLE users (...);
CREATE TABLE documents (...);
```

### 3. Configurer .env

Édite le fichier `.env` avec tes infos MySQL :

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=remember_db
PORT=3000
JWT_SECRET=une_clef_secrete_tres_longue
```

### 4. Démarrer le serveur

**Mode développement** (avec hot reload) :

```bash
npm run dev
```

**Mode production** :

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

---

## 📝 Routes API

### Authentification

- `POST /api/auth/signup` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `PATCH /api/auth/change-password` - Modifier le mot de passe (authentifié)
- `POST /api/auth/logout` - Se déconnecter (authentifié)

### Users

- `GET /api/users` - Récupérer tous les utilisateurs (authentifié)
- `GET /api/users/:id` - Récupérer un utilisateur par son id (authentifié)

### Documents

- `GET /api/documents` - Récupérer tous les documents (authentifié)
- `POST /api/documents` - Ajouter un document (authentifié)
- `PUT /api/documents/:id` - Modifier un document (authentifié)
- `DELETE /api/documents/:id` - Supprimer un document (authentifié)

---

## 🔐 Sécurité

- Les mots de passe sont hashés avec bcrypt
- Les tokens JWT expirent après 7 jours
- Les données sont isolées par utilisateur
- CORS activé pour le frontend

---

## 📦 Dépendances

- **express** - Framework web
- **mysql2** - Driver MySQL
- **bcrypt** - Hash des mots de passe
- **jsonwebtoken** - Tokens JWT
- **dotenv** - Variables d'environnement
- **cors** - Autoriser les requêtes cross-origin
