# 🏗️ Architecture Technique

## Vue d'ensemble

L'application est construite avec une architecture moderne **JAMstack** :
- **Frontend** : React SPA (Single Page Application)
- **Backend** : Supabase (PostgreSQL + API REST auto-générée)
- **Authentification** : Supabase Auth
- **Hébergement** : Peut être déployé sur Netlify, Vercel, ou tout hébergeur statique

## Stack Technique

### Frontend

#### React 18
- **Hooks** : useState, useEffect, useContext
- **Context API** : Gestion de l'état d'authentification
- **Functional Components** : Pas de classes
- **JSX** : Syntaxe déclarative

#### React Router v6
- **Routing client-side** : Navigation sans rechargement
- **Protected Routes** : Routes protégées par authentification
- **Admin Routes** : Routes réservées aux administrateurs
- **Nested Routes** : Layout partagé

#### TailwindCSS
- **Utility-first** : Classes utilitaires
- **Responsive** : Mobile-first design
- **Custom theme** : Couleurs personnalisées (primary, gold)
- **Components** : Classes réutilisables (btn-primary, card, etc.)

#### Lucide React
- **Icons** : Bibliothèque d'icônes moderne
- **Tree-shakeable** : Import uniquement des icônes utilisées
- **Consistent** : Style cohérent

#### date-fns
- **Manipulation de dates** : Formatage et calculs
- **Locale FR** : Support du français
- **Lightweight** : Alternative légère à Moment.js

### Backend (Supabase)

#### PostgreSQL
- **Base de données relationnelle** : Structure normalisée
- **Transactions ACID** : Fiabilité des données
- **Indexes** : Performance optimisée
- **Triggers** : Automatisation (profil, timestamps)

#### Supabase API
- **REST API auto-générée** : Basée sur le schéma
- **Realtime** : WebSocket pour les mises à jour en temps réel
- **PostgREST** : API RESTful automatique
- **Storage** : Stockage de fichiers (non utilisé actuellement)

#### Supabase Auth
- **Email/Password** : Authentification classique
- **OAuth** : Google, GitHub, etc.
- **JWT** : Tokens sécurisés
- **Row Level Security** : Sécurité au niveau des lignes

## Structure des Dossiers

```
bible-study-app/
│
├── public/                      # Fichiers statiques
│   └── bible-icon.svg          # (à créer)
│
├── src/
│   ├── components/             # Composants réutilisables
│   │   └── Layout.jsx         # Layout principal avec navigation
│   │
│   ├── contexts/              # Contexts React
│   │   └── AuthContext.jsx   # Gestion de l'authentification
│   │
│   ├── lib/                   # Utilitaires et configuration
│   │   └── supabase.js       # Client Supabase
│   │
│   ├── pages/                 # Pages de l'application
│   │   ├── Login.jsx         # Connexion/Inscription
│   │   ├── Dashboard.jsx     # Tableau de bord
│   │   ├── StudyPlan.jsx     # Plan d'étude
│   │   ├── Chapter.jsx       # Détails d'un chapitre
│   │   ├── Quiz.jsx          # Interface de quiz
│   │   ├── Profile.jsx       # Profil utilisateur
│   │   └── AdminPanel.jsx    # Panneau admin
│   │
│   ├── App.jsx               # Configuration des routes
│   ├── main.jsx              # Point d'entrée
│   └── index.css             # Styles globaux
│
├── .env                       # Variables d'environnement
├── .env.example              # Template des variables
├── .gitignore                # Fichiers ignorés par Git
├── package.json              # Dépendances npm
├── vite.config.js            # Configuration Vite
├── tailwind.config.js        # Configuration Tailwind
├── postcss.config.js         # Configuration PostCSS
├── index.html                # HTML principal
│
├── README.md                 # Documentation principale
├── QUICK_START.md           # Guide de démarrage
├── FEATURES.md              # Guide des fonctionnalités
├── ARCHITECTURE.md          # Ce fichier
│
├── supabase-schema.sql      # Schéma de la base de données
└── sample-data.sql          # Données d'exemple
```

## Schéma de Base de Données

### Tables et Relations

```
┌─────────────┐
│   auth.users│ (Supabase Auth)
└──────┬──────┘
       │
       │ 1:1
       │
┌──────▼──────────┐
│   profiles      │
│─────────────────│
│ id (PK, FK)     │
│ email           │
│ full_name       │
│ role            │
└─────────────────┘
       │
       │ 1:N
       │
       ├──────────────────────┐
       │                      │
┌──────▼──────────┐    ┌─────▼────────┐
│ user_progress   │    │  comments    │
│─────────────────│    │──────────────│
│ id (PK)         │    │ id (PK)      │
│ user_id (FK)    │    │ user_id (FK) │
│ chapter_id (FK) │    │ chapter_id   │
│ completed       │    │ parent_id    │
└─────────────────┘    │ content      │
                       └──────┬───────┘
                              │
                              │ 1:N
                              │
                       ┌──────▼───────┐
                       │  reactions   │
                       │──────────────│
                       │ id (PK)      │
                       │ comment_id   │
                       │ user_id (FK) │
                       │ type         │
                       └──────────────┘

┌─────────────┐
│   weeks     │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────────┐
│   chapters      │
│─────────────────│
│ id (PK)         │
│ week_id (FK)    │
│ title           │
│ book            │
│ chapter_number  │
│ content         │
└─────────────────┘

┌─────────────┐
│   weeks     │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────────┐
│   quizzes       │
│─────────────────│
│ id (PK)         │
│ week_id (FK)    │
│ title           │
└──────┬──────────┘
       │
       │ 1:N
       │
┌──────▼──────────────┐
│ quiz_questions      │
│─────────────────────│
│ id (PK)             │
│ quiz_id (FK)        │
│ question            │
│ option_a/b/c/d      │
│ correct_answer      │
└─────────────────────┘

┌─────────────────┐
│ daily_verses    │
│─────────────────│
│ id (PK)         │
│ date (UNIQUE)   │
│ text            │
│ reference       │
└─────────────────┘
```

## Flux de Données

### Authentification

```
User Input (Login)
    ↓
AuthContext.signIn()
    ↓
Supabase Auth API
    ↓
JWT Token + User Object
    ↓
AuthContext State Update
    ↓
Fetch User Profile
    ↓
Redirect to Dashboard
```

### Lecture d'un Chapitre

```
User clicks Chapter
    ↓
Navigate to /chapter/:id
    ↓
Chapter Component mounts
    ↓
useEffect fetches:
  - Chapter data
  - User progress
  - Comments
    ↓
Render Chapter UI
    ↓
User clicks "Mark as Read"
    ↓
Insert/Delete in user_progress
    ↓
Update local state
    ↓
UI updates (checkmark)
```

### Ajout d'un Commentaire

```
User types comment
    ↓
Submit form
    ↓
Insert into comments table
    ↓
Supabase validates:
  - User is authenticated
  - RLS policies pass
    ↓
Comment saved
    ↓
Fetch updated comments
    ↓
UI updates with new comment
```

## Sécurité

### Row Level Security (RLS)

Toutes les tables ont RLS activé avec des policies spécifiques :

#### Profiles
- ✅ Tout le monde peut voir les profils
- ✅ Utilisateurs peuvent modifier leur propre profil

#### Weeks, Chapters, Quizzes
- ✅ Tout le monde peut lire
- 🔒 Seuls les admins peuvent créer/modifier/supprimer

#### User Progress
- ✅ Utilisateurs voient uniquement leur propre progression
- ✅ Utilisateurs peuvent modifier leur propre progression

#### Comments
- ✅ Tout le monde peut lire
- ✅ Utilisateurs authentifiés peuvent créer
- ✅ Utilisateurs peuvent modifier leurs propres commentaires
- 🔒 Admins peuvent supprimer n'importe quel commentaire

### Authentification

- **JWT Tokens** : Stockés dans localStorage
- **Expiration** : Tokens expirent après 1 heure
- **Refresh** : Tokens automatiquement rafraîchis
- **HTTPS** : Obligatoire en production

### Validation

- **Frontend** : Validation basique (required, minLength)
- **Backend** : Contraintes PostgreSQL (CHECK, NOT NULL, UNIQUE)
- **RLS** : Vérification des permissions

## Performance

### Optimisations Frontend

- **Code Splitting** : Routes chargées à la demande
- **Lazy Loading** : Images et composants
- **Memoization** : React.memo pour composants lourds
- **Debouncing** : Recherche et filtres

### Optimisations Backend

- **Indexes** : Sur toutes les foreign keys
- **Pagination** : Limite de résultats (LIMIT)
- **Select spécifique** : Seulement les colonnes nécessaires
- **Joins optimisés** : Relations préchargées

### Caching

- **Browser Cache** : Assets statiques
- **Supabase Cache** : Queries fréquentes
- **Local State** : Éviter les re-fetch inutiles

## Déploiement

### Build Production

```bash
npm run build
```

Génère un dossier `dist/` avec :
- HTML minifié
- CSS minifié et purgé
- JS bundlé et minifié
- Assets optimisés

### Hébergement Recommandé

#### Netlify
```bash
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Vercel
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### Variables d'Environnement

En production, configurez :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Monitoring et Logs

### Frontend
- **Console Errors** : Capturés dans la console navigateur
- **Network Tab** : Inspection des requêtes API

### Backend (Supabase)
- **Logs** : Accessible dans Supabase Dashboard
- **Query Performance** : Analyse des requêtes lentes
- **Auth Logs** : Tentatives de connexion

## Tests (À implémenter)

### Tests Unitaires
```javascript
// Exemple avec Vitest
import { render, screen } from '@testing-library/react'
import Dashboard from './Dashboard'

test('renders dashboard', () => {
  render(<Dashboard />)
  expect(screen.getByText(/Bienvenue/i)).toBeInTheDocument()
})
```

### Tests d'Intégration
- Test des flows complets (login → read → comment)
- Test des permissions (user vs admin)

### Tests E2E
- Cypress ou Playwright
- Scénarios utilisateur complets

## Évolutivité

### Scalabilité Horizontale
- **Frontend** : CDN global (Netlify, Vercel)
- **Backend** : Supabase gère automatiquement

### Scalabilité Verticale
- **Database** : Upgrade du plan Supabase
- **Connections** : Pool de connexions PostgreSQL

### Limites Actuelles
- **Supabase Free Tier** :
  - 500 MB base de données
  - 1 GB bandwidth/mois
  - 50 000 utilisateurs actifs/mois

## Maintenance

### Mises à Jour
```bash
# Vérifier les dépendances obsolètes
npm outdated

# Mettre à jour
npm update

# Audit de sécurité
npm audit
```

### Backups
- **Supabase** : Backups automatiques quotidiens (plan payant)
- **Manuel** : Export SQL régulier

### Monitoring
- Vérifier les logs Supabase hebdomadairement
- Surveiller les performances
- Analyser l'engagement utilisateur

---

**Architecture conçue pour la simplicité, la sécurité et la scalabilité** 🚀
