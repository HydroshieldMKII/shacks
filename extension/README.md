# Trust - Password Manager Extension

Une extension Chrome pour gérer vos mots de passe de manière sécurisée avec auto-remplissage intelligent.

## 🚀 Fonctionnalités

### 🔐 Gestion des mots de passe
- **Ajout de mots de passe** avec nom, URL, username, password et notes
- **Organisation par dossiers** personnalisés
- **Recherche rapide** dans tous vos mots de passe
- **Édition et suppression** faciles

### 👥 Système de Guardians (Trusted Contacts)
- **Ajoutez des contacts de confiance** pour la récupération de compte
- **Récupération de compte** avec 2 guardians minimum
- **Génération automatique de clés** cryptographiquement sécurisées

### ⚡ Auto-fill intelligent
- **Bouton "Fill" dans la liste** - Remplissage rapide en 1 clic
- **Bouton "Auto-fill" dans les détails** - Remplissage depuis la page de détails
- **Détection intelligente des formulaires**:
  - Support des champs standards (email, username, password)
  - Support des Shadow DOM et Web Components
  - Support des iframes accessibles
  - Fallback automatique pour les formulaires non-standards
- **Animation de chargement** avec points clignotants
- **Injection automatique du script** si nécessaire

### 🎨 Interface utilisateur
- **Design dark mode** élégant et moderne
- **Interface bilingue** (Français/Anglais)
- **Navigation intuitive** avec tabs (Passwords/Trusted)
- **Bouton logout "cursed"** qui bouge au survol (effet fun)
- **Animations fluides** et feedback visuel

### 🔒 Sécurité
- **Chiffrement AES** des mots de passe
- **Clé dérivée** avec SHA256(masterKey + userPassword)
- **Session-based authentication** avec cookies sécurisés
- **Pas de stockage local** des mots de passe déchiffrés
- **Backend NestJS** avec validation et guards

## 📦 Installation

### Prérequis
- Node.js 20.19+ ou 22.12+
- npm
- Chrome ou navigateur Chromium

### Étapes d'installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Builder l'extension**
```bash
npm run build
```

Ou en mode watch pour le développement:
```bash
npm run build-watch
```

3. **Charger l'extension dans Chrome**
   - Allez sur `chrome://extensions/`
   - Activez le "Mode développeur" (en haut à droite)
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez le dossier `extension/dist`

4. **Configurer le backend**
   - Assurez-vous que le backend est lancé sur `http://localhost:3000`
   - Voir le README du backend pour plus d'informations

## 🎯 Utilisation

### Première utilisation
1. Cliquez sur l'icône de l'extension dans la barre d'outils
2. Créez un compte (Signup) ou connectez-vous (Login)
3. Ajoutez vos premiers mots de passe

### Ajouter un mot de passe
1. Cliquez sur le bouton `+` en haut à droite
2. Remplissez les champs (nom, URL, username, password)
3. Optionnel: Ajoutez un dossier et des notes
4. Cliquez sur "Save"

### Utiliser l'auto-fill

**Méthode 1: Bouton rapide "Fill"**
1. Ouvrez le site web où vous voulez vous connecter
2. Ouvrez l'extension Trust
3. Cliquez sur le bouton gris **"Fill"** à côté du mot de passe
4. Les champs sont remplis automatiquement! ✨

**Méthode 2: Depuis les détails**
1. Ouvrez le site web
2. Ouvrez l'extension et cliquez sur un mot de passe
3. Cliquez sur "Auto-fill on current page"
4. Observez le feedback visuel (bouton vert "✓ Filled!")

### Ajouter des Guardians
1. Allez dans l'onglet "Trusted"
2. Cliquez sur le bouton `+`
3. Entrez le nom et l'email du guardian
4. Une clé cryptographique sera générée automatiquement
5. **Important**: Partagez la clé avec votre guardian de manière sécurisée

### Récupérer un compte
1. Allez sur la page de connexion
2. Cliquez sur "Recover Account"
3. Entrez votre email
4. Entrez les clés de 2 guardians différents
5. Définissez votre nouveau mot de passe
6. Accédez à nouveau à votre compte!

## 🏗️ Architecture

```
extension/
├── src/
│   ├── components/        # Composants React réutilisables
│   │   ├── elements/      # PasswordElement, FolderElement
│   │   ├── forms/         # FormContainer, EditFormField
│   │   ├── layout/        # Header, Footer
│   │   ├── modals/        # ConfirmDeleteModal
│   │   └── sections/      # PasswordSection, TrustedSection
│   ├── pages/             # Pages de l'application
│   │   ├── home.tsx       # Page principale avec tabs
│   │   ├── login.tsx      # Connexion
│   │   ├── signup.tsx     # Inscription
│   │   ├── recovery.tsx   # Récupération de compte
│   │   ├── edit-password.tsx
│   │   ├── add-password.tsx
│   │   └── ...
│   ├── services/          # Services pour API calls
│   │   ├── authService.ts
│   │   ├── passwordService.ts
│   │   └── ...
│   ├── models/            # Modèles TypeScript
│   ├── locales/           # Traductions (fr.json, en.json)
│   ├── content.ts         # Content script pour auto-fill
│   ├── background.ts      # Background service worker
│   └── main.tsx           # Point d'entrée React
├── public/
│   ├── manifest.json      # Manifest Chrome Extension V3
│   └── icon*.png          # Icônes de l'extension
└── dist/                  # Build de production
```

## 🛠️ Technologies

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **React Router** - Navigation
- **React Bootstrap** - Composants UI
- **Vite** - Build tool ultra-rapide
- **Chrome Extension Manifest V3** - API moderne
- **SCSS** - Styling avec Bootstrap

## 🔧 Développement

### Scripts disponibles

```bash
# Build production
npm run build

# Build avec watch mode
npm run build-watch

# Linter
npm run lint
```

### Structure des permissions

L'extension demande les permissions suivantes:
- `scripting` - Pour injecter le content script
- `activeTab` - Pour accéder à l'onglet actif
- `tabs` - Pour envoyer des messages aux onglets
- `cookies` - Pour gérer la session
- `storage` - Pour les préférences locales

## 🐛 Débogage

### Logs et console
- **Content script**: Ouvrez la console de la page web (F12)
- **Background script**: Allez sur `chrome://extensions/` → Cliquez sur "Service worker"
- **Extension popup**: Clic droit sur l'extension → "Inspecter"

### Problèmes courants

**L'auto-fill ne fonctionne pas:**
- Rechargez la page web (F5)
- Rechargez l'extension dans `chrome://extensions/`
- Vérifiez que vous êtes connecté à l'extension
- Ouvrez la console pour voir les erreurs

**"Could not establish connection":**
- Le content script n'est pas chargé
- Rechargez la page web
- L'extension injectera automatiquement le script

**"No login form found":**
- Le formulaire n'est peut-être pas détecté
- Assurez-vous que les champs sont visibles
- Certains formulaires utilisent des structures non-standards

## 📝 Notes

- Les mots de passe sont **toujours chiffrés** côté backend
- Le **mot de passe maître** n'est jamais envoyé au serveur
- L'extension utilise des **cookies HttpOnly** pour la session
- Les **clés de guardian** sont générées avec crypto.randomBytes()
- L'auto-fill fonctionne sur **tous les sites web** (sauf pages internes Chrome)

## 🚀 Prochaines fonctionnalités

- [ ] Export/Import des mots de passe
- [ ] Génération de mots de passe sécurisés
- [ ] Historique des modifications
- [ ] Support multi-comptes
- [ ] Extension Firefox
- [ ] Mode hors-ligne

## 📄 Licence

Projet personnel - Tous droits réservés

## 🤝 Contribution

Ce projet est actuellement en développement privé.

---