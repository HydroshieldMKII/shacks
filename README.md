# Trust — Password Manager

> **Projet de l'équipe *ReachingUncStatus***
>
> Présenté au **Shacks 2025 — Hackathon de l'Université de Sherbrooke** (Thème : **Sécurité**)

---

## Description générale

**Trust** est un gestionnaire de mots de passe sécurisé avec chiffrement AES et récupération de compte par guardians. Conçu pour démontrer les bonnes pratiques de sécurité moderne : chiffrement côté client, authentification par sessions, et système de récupération basé sur la confiance mutuelle.

Ce dépôt contient une API REST complète (NestJS) avec documentation Swagger interactive, tests unitaires, et déploiement Docker.

---

## Principales fonctionnalités

* 🔐 **Chiffrement AES** des mots de passe (clé dérivée : master key + mot de passe utilisateur)
* 🗂️ **Organisation par dossiers** avec suppression en cascade
* 👥 **Système de guardians** : récupération de compte avec 2 clés de confiance
* 🔑 **Génération cryptographique** de clés guardian (128 bits)
* 📝 **Validation stricte** des entrées avec class-validator
* 🔒 **Authentification par sessions** avec cookies sécurisés
* 📚 **Documentation Swagger** interactive à `/api`
* ✅ **Tests unitaires** avec Jest

---

## Architecture & composants

```
shacks/
├── backend/              # API REST NestJS + TypeORM
│   ├── src/
│   │   ├── users/       # Authentification (signup, login, logout)
│   │   ├── passwords/   # Vault chiffré (CRUD)
│   │   ├── folders/     # Organisation des mots de passe
│   │   ├── guardians/   # Système de récupération de compte
│   │   └── common/      # Guards, decorators, services (encryption)
│   └── test/            # Tests E2E
├── docker-compose.yml   # Déploiement conteneurisé
└── README.md            # Ce fichier
```

---

## Stack technique

* **Framework** : NestJS 11 (Node.js/TypeScript)
* **ORM** : TypeORM avec SQLite
* **Chiffrement** : 
  - Mots de passe utilisateurs : bcrypt (10 rounds)
  - Mots de passe stockés : AES (crypto-js) avec clé dérivée
  - Clés guardian : crypto.randomBytes (128 bits)
* **Validation** : class-validator + class-transformer
* **Documentation** : Swagger/OpenAPI 3.0
* **Tests** : Jest + Supertest
* **Déploiement** : Docker + Docker Compose

> **⚠️ Remarque sécurité** : Ce projet est une démonstration pour hackathon. Pour une utilisation en production, un audit de sécurité indépendant est requis.

---

## Installation & Démarrage

### Prérequis

* Node.js 18+ et npm
* Docker & Docker Compose (optionnel)
* Git

### Installation locale (développement)

```bash
# Cloner le dépôt
git clone https://github.com/HydroshieldMKII/shacks.git
cd shacks/backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
# Créer un fichier .env à la racine de backend/
echo "SESSION_SECRET=votre-secret-de-session-32-caracteres-minimum" > .env
echo "ENCRYPTION_KEY=votre-cle-de-chiffrement-32-caracteres-minimum" >> .env

# Démarrer en mode développement
npm run start:dev

# L'API est accessible sur http://localhost:3000
# Documentation Swagger sur http://localhost:3000/api
```

### Déploiement Docker (production)

```bash
# À la racine du projet
docker-compose up -d

# L'API sera accessible via le réseau Docker 'shared-services'
```

### Exécuter les tests

```bash
cd backend

# Tests unitaires
npm run test

# Tests avec couverture
npm run test:cov

# Tests E2E
npm run test:e2e
```

---

## Endpoints API principaux

### Authentification (`/users`)
- `POST /users/signup` - Créer un compte
- `POST /users/login` - Se connecter
- `POST /users/logout` - Se déconnecter
- `GET /users/me` - Informations du compte

### Mots de passe (`/passwords`)
- `GET /passwords` - Lister tous les mots de passe
- `POST /passwords` - Ajouter un mot de passe
- `GET /passwords/:id` - Récupérer un mot de passe (déchiffré)
- `PATCH /passwords/:id` - Modifier un mot de passe
- `DELETE /passwords/:id` - Supprimer un mot de passe

### Dossiers (`/folders`)
- `GET /folders` - Lister tous les dossiers
- `POST /folders` - Créer un dossier
- `GET /folders/:id` - Voir un dossier avec ses mots de passe
- `PATCH /folders/:id` - Renommer un dossier
- `DELETE /folders/:id` - Supprimer un dossier (cascade)

### Guardians (`/guardians`)
- `GET /guardians` - Voir les relations guardian
- `POST /guardians` - Devenir guardian d'un utilisateur
- `DELETE /guardians/:id` - Supprimer une relation
- `POST /guardians/recover` ⭐ - Récupérer un compte avec 2 clés (PUBLIC)

> 📖 Documentation complète interactive : **http://localhost:3000/api**

---

## Système de récupération par Guardians

### Comment ça fonctionne ?

1. **Configuration** : Alice demande à Bob et Charlie d'être ses guardians
   - Bob reçoit une clé unique : `abc123...`
   - Charlie reçoit une clé unique : `xyz789...`

2. **Perte d'accès** : Alice oublie son mot de passe

3. **Récupération** : Alice contacte 2 de ses guardians pour obtenir leurs clés
   ```http
   POST /guardians/recover
   {
     "email": "alice@example.com",
     "guardianKey1": "abc123...",
     "guardianKey2": "xyz789...",
     "newPassword": "NouveauMotDePasse123!"
   }
   ```

4. **Succès** ✅ : Alice peut se reconnecter avec son nouveau mot de passe

### Sécurité
- ✅ Minimum 2 guardians requis
- ✅ Clés cryptographiquement sécurisées (128 bits)
- ✅ Les 2 clés doivent être différentes
- ✅ Endpoint public (pas de connexion requise)

> 📚 Documentation détaillée : `backend/src/guardians/ROUTES.md`

---

## Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `PORT` | Port du serveur | `3000` |
| `SESSION_SECRET` | Clé secrète pour les sessions (32+ caractères) | `your-32-char-secret-here` |
| `ENCRYPTION_KEY` | Clé de chiffrement AES (32+ caractères) | `your-32-char-encryption-key` |
| `NODE_ENV` | Environnement d'exécution | `development` ou `production` |

---

## Scripts disponibles

```bash
npm run start          # Démarrer en production
npm run start:dev      # Démarrer avec hot-reload
npm run start:debug    # Démarrer en mode debug
npm run build          # Compiler le projet
npm run test           # Lancer les tests unitaires
npm run test:cov       # Tests avec couverture
npm run test:e2e       # Tests end-to-end
npm run lint           # Linter le code
npm run format         # Formater le code (Prettier)
```

---

## Structure de la base de données

### Tables
- **users** : Comptes utilisateurs (username, email, password hashé)
- **passwords** : Mots de passe chiffrés avec metadata
- **folders** : Dossiers d'organisation
- **guardians** : Relations de confiance pour récupération

### Relations
- `passwords.userId` → `users.id` (CASCADE DELETE)
- `passwords.folderId` → `folders.id` (SET NULL)
- `folders.userId` → `users.id` (CASCADE DELETE)
- `guardians.userId` → `users.id` (CASCADE DELETE)
- `guardians.guardedEmail` → `users.email`

---

## Développement

### Ajouter une nouvelle fonctionnalité

```bash
# Générer un nouveau module
nest generate module feature-name
nest generate controller feature-name
nest generate service feature-name

# Créer une entité TypeORM
nest generate class feature-name/entities/feature.entity --no-spec

# Créer un DTO
nest generate class feature-name/dto/create-feature.dto --no-spec
```

### Convention de commits

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `refactor:` Refactoring
- `test:` Ajout/modification de tests
- `chore:` Tâches de maintenance

---

## Contacts

**Équipe** : ReachingUncStatus

**Projet** : Trust — Password Manager

**Organisation** : Shacks 2025 — Hackathon de l'Université de Sherbrooke

**Dépôt** : [github.com/HydroshieldMKII/shacks](https://github.com/HydroshieldMKII/shacks)

---

## Licence

Ce projet est présenté dans le cadre du hackathon Shacks 2025. Tous droits réservés.
