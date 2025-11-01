# Trust API Backend

> **API REST pour le gestionnaire de mots de passe Trust**
>
> Projet **Shacks 2025** — Équipe **ReachingUncStatus**

---

## Description

API backend sécurisée construite avec **NestJS** pour le gestionnaire de mots de passe **Trust**. Implémente un système de chiffrement AES, authentification par sessions, organisation par dossiers, et récupération de compte par guardians.

### Fonctionnalités principales

- 🔐 **Chiffrement AES** des mots de passe (clé dérivée : master key + mot de passe utilisateur)
- 🔑 **Authentification sécurisée** avec sessions et cookies httpOnly
- 📁 **Gestion de dossiers** avec cascade delete
- 👥 **Système de guardians** : récupération de compte avec 2 clés de confiance
- 📚 **Documentation Swagger** interactive
- ✅ **Tests unitaires** et E2E avec Jest
- 🛡️ **Validation stricte** des entrées (class-validator)

---

## Stack technique

| Technologie | Usage |
|-------------|-------|
| **NestJS 11** | Framework backend TypeScript |
| **TypeORM** | ORM pour SQLite |
| **SQLite** | Base de données relationnelle |
| **bcrypt** | Hash des mots de passe utilisateurs |
| **crypto-js** | Chiffrement AES des mots de passe stockés |
| **crypto** | Génération de clés guardian sécurisées |
| **express-session** | Gestion des sessions |
| **class-validator** | Validation des DTOs |
| **Swagger** | Documentation API interactive |
| **Jest** | Tests unitaires et E2E |

---

## Installation

### Prérequis

- Node.js 18+
- npm 9+

### Installation des dépendances

```bash
npm install
```

### Configuration des variables d'environnement

Créer un fichier `.env` à la racine du dossier `backend/` :

```env
# Port du serveur (défaut: 3000)
PORT=3000

# Clé secrète pour les sessions (32+ caractères requis)
SESSION_SECRET=votre-secret-de-session-minimum-32-caracteres

# Clé de chiffrement AES (32+ caractères requis)
ENCRYPTION_KEY=votre-cle-de-chiffrement-minimum-32-caracteres

# Environnement
NODE_ENV=development
```

> ⚠️ **Important** : Ne jamais committer le fichier `.env` ! Générez des clés sécurisées avec `openssl rand -hex 32`

---

## Démarrage

### Mode développement

```bash
# Démarrage avec hot-reload
npm run start:dev

# L'API sera disponible sur http://localhost:3000
# Documentation Swagger sur http://localhost:3000/api
```

### Mode production

```bash
# Compiler le projet
npm run build

# Démarrer en production
npm run start:prod
```

### Mode debug

```bash
npm run start:debug
```

---

## Tests

```bash
# Tests unitaires
npm run test

# Tests unitaires en mode watch
npm run test:watch

# Tests E2E
npm run test:e2e

# Couverture de code
npm run test:cov

# Mode debug pour tests
npm run test:debug
```

### Exemples de tests

- ✅ Authentification (signup, login, logout)
- ✅ CRUD des mots de passe avec chiffrement
- ✅ Gestion des dossiers et relations
- ✅ Système de guardians et récupération de compte
- ✅ Validation des DTOs

---

## Architecture

```
backend/
├── src/
│   ├── users/              # Authentification et gestion des utilisateurs
│   │   ├── dto/           # DTOs (CreateUser, Login, UpdateUser)
│   │   ├── entities/      # Entity User (TypeORM)
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── passwords/          # Vault de mots de passe chiffrés
│   │   ├── dto/           # DTOs (CreatePassword, UpdatePassword)
│   │   ├── entities/      # Entity Password
│   │   ├── passwords.controller.ts
│   │   ├── passwords.service.ts
│   │   └── passwords.module.ts
│   │
│   ├── folders/            # Organisation par dossiers
│   │   ├── dto/           # DTOs (CreateFolder, UpdateFolder)
│   │   ├── entities/      # Entity Folder
│   │   ├── folders.controller.ts
│   │   ├── folders.service.ts
│   │   └── folders.module.ts
│   │
│   ├── guardians/          # Système de récupération de compte
│   │   ├── dto/           # DTOs (CreateGuardian, RecoverAccount)
│   │   ├── entities/      # Entity Guardian
│   │   ├── guardians.controller.ts
│   │   ├── guardians.service.ts
│   │   ├── guardians.module.ts
│   │   └── ROUTES.md      # Documentation détaillée
│   │
│   ├── common/             # Composants partagés
│   │   ├── decorators/    # @CurrentUser, @Public
│   │   ├── guards/        # AuthGuard (vérification session)
│   │   └── services/      # EncryptionService (AES)
│   │
│   ├── types/              # Types TypeScript
│   ├── app.module.ts       # Module racine
│   └── main.ts             # Point d'entrée (config Swagger, CORS, sessions)
│
├── test/                   # Tests E2E
├── data/                   # Base de données SQLite (généré)
├── .env                    # Variables d'environnement (à créer)
├── package.json
├── tsconfig.json
└── README.md               # Ce fichier
```

---

## Endpoints API

### 🔐 Authentification (`/users`)

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/users/signup` | Créer un compte | ❌ |
| POST | `/users/login` | Se connecter | ❌ |
| POST | `/users/logout` | Se déconnecter | ✅ |
| GET | `/users/me` | Infos du compte | ✅ |

### 🔑 Mots de passe (`/passwords`)

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/passwords` | Lister tous les mots de passe | ✅ |
| POST | `/passwords` | Ajouter un mot de passe | ✅ |
| GET | `/passwords/:id` | Récupérer un mot de passe (déchiffré) | ✅ |
| PATCH | `/passwords/:id` | Modifier un mot de passe | ✅ |
| DELETE | `/passwords/:id` | Supprimer un mot de passe | ✅ |

### 📁 Dossiers (`/folders`)

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/folders` | Lister tous les dossiers | ✅ |
| POST | `/folders` | Créer un dossier | ✅ |
| GET | `/folders/:id` | Voir un dossier avec ses mots de passe | ✅ |
| PATCH | `/folders/:id` | Renommer un dossier | ✅ |
| DELETE | `/folders/:id` | Supprimer un dossier (cascade) | ✅ |
| POST | `/folders/:folderId/passwords/:passwordId` | Déplacer un mot de passe | ✅ |

### 👥 Guardians (`/guardians`)

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/guardians` | Voir les relations guardian | ✅ |
| POST | `/guardians` | Devenir guardian d'un utilisateur | ✅ |
| DELETE | `/guardians/:id` | Supprimer une relation | ✅ |
| POST | `/guardians/recover` | ⭐ Récupérer un compte avec 2 clés | ❌ PUBLIC |

> 📖 **Documentation complète et interactive** : http://localhost:3000/api

---

## Système de récupération par Guardians

### Concept

Un utilisateur peut désigner des "guardians" (gardiens) de confiance qui recevront chacun une clé cryptographique unique. Si l'utilisateur perd l'accès à son compte, il peut le récupérer en fournissant 2 clés de ses guardians.

### Exemple d'utilisation

```bash
# 1. Bob devient guardian d'Alice
POST /guardians
Authorization: Bearer <bob-session>
{
  "guardedEmail": "alice@example.com"
}
# Réponse: { guardianKeyValue: "abc123..." } → Bob sauvegarde cette clé

# 2. Charlie devient guardian d'Alice
POST /guardians
Authorization: Bearer <charlie-session>
{
  "guardedEmail": "alice@example.com"
}
# Réponse: { guardianKeyValue: "xyz789..." } → Charlie sauvegarde cette clé

# 3. Alice perd son mot de passe et contacte Bob et Charlie

# 4. Alice récupère son compte (endpoint PUBLIC)
POST /guardians/recover
{
  "email": "alice@example.com",
  "guardianKey1": "abc123...",
  "guardianKey2": "xyz789...",
  "newPassword": "NouveauMotDePasse123!"
}
# Réponse: { message: "Account recovered successfully" }
```

### Sécurité

- ✅ Clés générées avec `crypto.randomBytes(16)` (128 bits)
- ✅ Minimum 2 guardians requis
- ✅ Les 2 clés doivent être valides et différentes
- ✅ Nouveau mot de passe hashé avec bcrypt

> 📚 **Documentation détaillée** : `src/guardians/ROUTES.md`

---

## Chiffrement

### Mots de passe utilisateurs
- **Algorithme** : bcrypt
- **Rounds** : 10
- **Usage** : Hash du mot de passe lors du signup

### Mots de passe stockés
- **Algorithme** : AES (crypto-js)
- **Clé** : SHA256(ENCRYPTION_KEY + userPassword)
- **Usage** : Chiffrement/déchiffrement des mots de passe sauvegardés

### Clés guardian
- **Algorithme** : crypto.randomBytes
- **Taille** : 128 bits (32 caractères hex)
- **Usage** : Récupération de compte

---

## Scripts npm

```bash
npm run start          # Démarrer en production
npm run start:dev      # Démarrer avec hot-reload
npm run start:debug    # Démarrer en mode debug
npm run build          # Compiler le projet
npm run format         # Formater le code (Prettier)
npm run lint           # Linter le code (ESLint)
npm run test           # Tests unitaires
npm run test:watch     # Tests en mode watch
npm run test:cov       # Tests avec couverture
npm run test:debug     # Tests en mode debug
npm run test:e2e       # Tests end-to-end
```

---

## Base de données

### Tables

| Table | Description |
|-------|-------------|
| `users` | Comptes utilisateurs (username, email, password hashé) |
| `passwords` | Mots de passe chiffrés avec metadata |
| `folders` | Dossiers d'organisation |
| `guardians` | Relations de confiance pour récupération |

### Relations

```
users (1) ──< (n) passwords (CASCADE DELETE)
users (1) ──< (n) folders (CASCADE DELETE)
folders (1) ──< (n) passwords (SET NULL on folder delete)
users (1) ──< (n) guardians (CASCADE DELETE)
users.email ──< guardians.guardedEmail
```

---

## Déploiement

### Avec Docker (recommandé)

Voir le fichier `docker-compose.yml` à la racine du projet :

```bash
# À la racine du projet
docker-compose up -d
```

### Variables d'environnement en production

```env
NODE_ENV=production
PORT=3000
SESSION_SECRET=<secret-securise-32-caracteres-minimum>
ENCRYPTION_KEY=<cle-chiffrement-32-caracteres-minimum>
```

> ⚠️ **Sécurité** : Utilisez des clés générées aléatoirement en production !

---

## Développement

### Ajouter un nouveau module

```bash
# Générer un module complet
nest generate resource feature-name

# Ou générer individuellement
nest generate module feature-name
nest generate controller feature-name
nest generate service feature-name
```

### Convention de code

- **DTOs** : Validation avec `class-validator`
- **Entities** : Décorateurs TypeORM
- **Services** : Logique métier, injection de repositories
- **Controllers** : Routes API, documentation Swagger
- **Guards** : AuthGuard pour vérifier les sessions

### Linting et formatage

```bash
# Formater le code
npm run format

# Linter et corriger automatiquement
npm run lint
```

---

## Documentation

| Fichier | Description |
|---------|-------------|
| `ROUTES.md` | Documentation complète de tous les endpoints |
| `src/guardians/ROUTES.md` | Guide détaillé du système de guardians |
| http://localhost:3000/api | Documentation Swagger interactive |

---

## Dépannage

### Erreur : "SESSION_SECRET environment variable is not set"

Créez un fichier `.env` avec la variable `SESSION_SECRET` :

```bash
echo "SESSION_SECRET=$(openssl rand -hex 32)" > .env
echo "ENCRYPTION_KEY=$(openssl rand -hex 32)" >> .env
```

### Erreur : "ENCRYPTION_KEY environment variable not set"

Ajoutez la variable `ENCRYPTION_KEY` dans votre fichier `.env`.

### Base de données corrompue

Supprimez le fichier de base de données et redémarrez :

```bash
rm -rf data/
npm run start:dev
```

### Port 3000 déjà utilisé

Modifiez le port dans `.env` :

```env
PORT=3001
```

---

## Tests avec VS Code REST Client

Le fichier `src/guardians/recovery.http` contient des exemples de requêtes HTTP pour tester l'API. Installez l'extension **REST Client** dans VS Code pour les exécuter.

```http
### Créer un compte
POST http://localhost:3000/users/signup
Content-Type: application/json

{
  "username": "alice",
  "email": "alice@example.com",
  "password": "AlicePassword123!"
}

### Se connecter
POST http://localhost:3000/users/login
Content-Type: application/json

{
  "username": "alice",
  "password": "AlicePassword123!"
}
```

---

## Ressources

### NestJS
- [Documentation officielle](https://docs.nestjs.com)
- [Discord NestJS](https://discord.gg/G7Qnnhy)

### Sécurité
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [crypto-js](https://github.com/brix/crypto-js)

### TypeORM
- [Documentation TypeORM](https://typeorm.io/)
- [SQLite](https://www.sqlite.org/docs.html)

---

## Contributeurs

**Équipe** : ReachingUncStatus

**Projet** : Trust — Password Manager

**Organisation** : Shacks 2025 — Hackathon de l'Université de Sherbrooke

---

## Licence

Projet présenté dans le cadre du hackathon Shacks 2025. Tous droits réservés.
