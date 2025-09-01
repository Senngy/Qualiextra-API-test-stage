# API REST Qualiextra - Test de Stage

## Projet

Ce projet est un test de stage pour le poste de développeur Back-End chez Qualiextra.  
Il consiste en la création d'une API REST sécurisée avec gestion des utilisateurs, rôles et validation d’email, ainsi qu’une intégration Front-End avec Next.js 13 et Tailwind CSS.

---

## 🛠️ Stack technique

### Back-End

- Node.js + TypeScript
- Express
- TSOA (pour la génération automatique des routes et du Swagger)
- Prisma ORM
- PostgreSQL
- Crypto Node.js pour le hashage des mots de passe

## 💾 Base de données

### Configuration locale

- PostgreSQL utilisé localement et création d'un utilisateur et du base de donnée dédiés.
- Base : `qualiextra_test`
- Utilisateur dédié au projet : `qualiextra_user` 

#### Commandes SQL pour setup local

```sql
-- Crée un utilisateur dédié au projet
CREATE USER qualiextra_user WITH PASSWORD 'motdepasse';

-- Crée la base de données
CREATE DATABASE qualiextra_test OWNER qualiextra_user;

-- Donne tous les droits à l'utilisateur sur cette base
GRANT ALL PRIVILEGES ON DATABASE qualiextra_test TO qualiextra_user;
```

### Configuration Prisma

Dans .env

```env
DATABASE_URL="postgresql://qualiextra_user:motdepasse@localhost:5432/qualiextra_test"
```

- Prisma gère la création des tables via les migrations.

- L’utilisateur dédié permet d’éviter l’utilisation du superuser et facilite la migration vers un environnement distant.

## Installation

### API

```bash
# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Créer la base via Prisma (si migrations nécessaires)
npx prisma migrate dev --name init

# Générer la documentation OpenAPI et les routes avec TSOA
npm run tsoa:spec
npm run tsoa:routes

# Compiler TypeScript
npm run build

# Lancer le serveur
npm run dev
```

## 🔑 Fonctionnalités

### API

- CRUD utilisateurs
- Authentification `/login`
- Route privée `/private` accessible uniquement aux utilisateurs connectés
- Ajout d'une route `/register` pour les
- Gestion des rôles (Admin/User)
- Vérification d'email avec token unique
- Blocage des emails temporaires
- Swagger pour tester l’API

### ⚡ Notes techniques

- Hash des mots de passe avec `crypto.scrypt` (sel + hash) sécurisé
- Service dédié pour les utilisateurs (`UserService`) séparé du contrôleur (`UsersController`)
