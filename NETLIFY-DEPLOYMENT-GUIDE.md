# 🚀 Guide de Déploiement sur Netlify

## 🎯 Objectif

Déployer votre application Bible Study sur Netlify pour la rendre accessible en ligne.

---

## 📋 Prérequis

- ✅ Code sur GitHub : https://github.com/AngeHermann24/Meditation
- ✅ Compte Netlify (gratuit) : https://netlify.com
- ✅ Variables d'environnement Supabase

---

## 🚀 Méthode 1 : Déploiement via l'Interface Netlify (Recommandé)

### Étape 1 : Créer un Compte Netlify

1. **Allez sur** : https://app.netlify.com/signup
2. **Connectez-vous** avec GitHub
3. **Autorisez** Netlify à accéder à vos dépôts

### Étape 2 : Importer le Projet

1. **Cliquez** sur **"Add new site"** → **"Import an existing project"**
2. **Sélectionnez** **"GitHub"**
3. **Cherchez** et sélectionnez le dépôt **"Meditation"**
4. **Cliquez** sur le dépôt pour continuer

### Étape 3 : Configurer le Build

Netlify devrait détecter automatiquement les paramètres :

```
Build command: npm run build
Publish directory: dist
```

Si ce n'est pas le cas, entrez ces valeurs manuellement.

### Étape 4 : Ajouter les Variables d'Environnement

**IMPORTANT** : Avant de déployer, ajoutez vos variables Supabase !

1. **Cliquez** sur **"Add environment variables"** ou **"Advanced build settings"**
2. **Ajoutez** les variables suivantes :

```
VITE_SUPABASE_URL = https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY = votre-clé-anon-publique
```

**Où trouver ces valeurs ?**
- Allez sur https://supabase.com
- Sélectionnez votre projet
- Settings → API
- Copiez "Project URL" et "anon public"

### Étape 5 : Déployer

1. **Cliquez** sur **"Deploy site"**
2. **Attendez** 2-3 minutes que le build se termine
3. ✅ **Votre site est en ligne !**

---

## 🌐 Méthode 2 : Déploiement via Netlify CLI

### Installation

```bash
npm install -g netlify-cli
```

### Connexion

```bash
netlify login
```

### Déploiement

```bash
cd c:\Users\Angeh\OneDrive\Bureau\Meditation\bible-study-app
netlify init
netlify deploy --prod
```

---

## 🔧 Configuration Post-Déploiement

### 1. Configurer le Nom de Domaine

Par défaut, Netlify vous donne un domaine comme :
```
https://random-name-123456.netlify.app
```

Pour le personnaliser :
1. **Allez** dans **Site settings** → **Domain management**
2. **Cliquez** sur **"Options"** → **"Edit site name"**
3. **Changez** en : `bible-study-app` ou `meditation-app`
4. **Votre nouveau domaine** : `https://bible-study-app.netlify.app`

### 2. Configurer Supabase

Dans Supabase, ajoutez votre URL Netlify aux URL autorisées :

1. **Allez** sur https://supabase.com
2. **Sélectionnez** votre projet
3. **Authentication** → **URL Configuration**
4. **Ajoutez** dans **"Site URL"** :
   ```
   https://votre-site.netlify.app
   ```
5. **Ajoutez** dans **"Redirect URLs"** :
   ```
   https://votre-site.netlify.app/**
   ```
6. **Save**

### 3. Tester l'Application

1. **Visitez** votre site : `https://votre-site.netlify.app`
2. **Testez** l'inscription
3. **Testez** la connexion
4. **Vérifiez** que tout fonctionne

---

## 📊 Structure des Fichiers

Votre projet contient déjà les fichiers nécessaires :

```
bible-study-app/
├── netlify.toml          ← Configuration Netlify
├── public/
│   └── _redirects        ← Redirections pour React Router
├── .env.example          ← Exemple de variables d'environnement
└── dist/                 ← Dossier de build (généré)
```

---

## 🔐 Variables d'Environnement

### Dans Netlify Dashboard

1. **Site settings** → **Environment variables**
2. **Add a variable**
3. **Ajoutez** :

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

⚠️ **Ne commitez JAMAIS ces valeurs dans Git !**

---

## 🔄 Déploiement Automatique

Netlify redéploie automatiquement votre site à chaque push sur GitHub :

```bash
git add .
git commit -m "Update feature"
git push origin main
```

➡️ Netlify détecte le push et redéploie automatiquement !

---

## 🐛 Dépannage

### Problème 1 : Build Failed

**Erreur** : `npm run build` échoue

**Solution** :
1. Vérifiez que `package.json` contient :
   ```json
   "scripts": {
     "build": "vite build"
   }
   ```
2. Testez localement : `npm run build`
3. Vérifiez les logs dans Netlify

### Problème 2 : Page Blanche

**Erreur** : Le site affiche une page blanche

**Solution** :
1. Vérifiez que les variables d'environnement sont configurées
2. Ouvrez la console (F12) pour voir les erreurs
3. Vérifiez que `_redirects` existe dans `public/`

### Problème 3 : 404 sur les Routes

**Erreur** : `/dashboard` ou `/profile` retourne 404

**Solution** :
1. Vérifiez que `netlify.toml` contient :
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
2. Ou que `public/_redirects` contient :
   ```
   /* /index.html 200
   ```

### Problème 4 : Erreur Supabase

**Erreur** : "Invalid API key" ou erreurs de connexion

**Solution** :
1. Vérifiez les variables d'environnement dans Netlify
2. Vérifiez que l'URL Netlify est dans Supabase → Authentication → URL Configuration
3. Redéployez le site après avoir ajouté les variables

---

## 📈 Optimisations

### 1. Activer HTTPS

✅ Netlify active automatiquement HTTPS avec Let's Encrypt

### 2. Optimiser les Performances

Dans `netlify.toml`, les headers de cache sont déjà configurés :

```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 3. Ajouter un Domaine Personnalisé

1. **Achetez** un domaine (ex: `meditation-eglise.com`)
2. **Dans Netlify** : Site settings → Domain management → Add custom domain
3. **Suivez** les instructions pour configurer les DNS

---

## 🎯 Checklist Complète

### Avant le Déploiement
- [ ] Code poussé sur GitHub
- [ ] Variables Supabase prêtes
- [ ] `netlify.toml` configuré
- [ ] `public/_redirects` créé

### Pendant le Déploiement
- [ ] Compte Netlify créé
- [ ] Dépôt GitHub connecté
- [ ] Variables d'environnement ajoutées
- [ ] Build command : `npm run build`
- [ ] Publish directory : `dist`

### Après le Déploiement
- [ ] Site accessible en ligne
- [ ] URL Netlify ajoutée dans Supabase
- [ ] Inscription testée
- [ ] Connexion testée
- [ ] Navigation testée
- [ ] Version mobile testée

---

## 🌟 Résultat Final

Votre application sera accessible à :
```
https://votre-nom-de-site.netlify.app
```

Et se mettra à jour automatiquement à chaque push sur GitHub !

---

## 📚 Ressources

- **Netlify Docs** : https://docs.netlify.com
- **Vite Deployment** : https://vitejs.dev/guide/static-deploy.html
- **Supabase Auth** : https://supabase.com/docs/guides/auth

---

## 💡 Commandes Utiles

```bash
# Build local
npm run build

# Preview du build
npm run preview

# Déployer avec Netlify CLI
netlify deploy --prod

# Voir les logs
netlify logs

# Ouvrir le site
netlify open:site
```

---

**Votre application sera en ligne en quelques minutes ! 🚀✨**

*"Allez, faites de toutes les nations des disciples" - Matthieu 28:19* 🌍📖🙏
