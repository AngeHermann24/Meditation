# 🚀 Déploiement Rapide sur Netlify

## ⚡ En 5 Minutes

### 1️⃣ Préparez vos Variables Supabase

Allez sur https://supabase.com → Votre projet → Settings → API

Copiez :
- **Project URL** : `https://xxxxx.supabase.co`
- **anon public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

### 2️⃣ Connectez-vous à Netlify

1. Allez sur : https://app.netlify.com/signup
2. Connectez-vous avec GitHub
3. Autorisez Netlify

---

### 3️⃣ Importez le Projet

1. Cliquez sur **"Add new site"** → **"Import an existing project"**
2. Sélectionnez **"GitHub"**
3. Cherchez et sélectionnez **"Meditation"**

---

### 4️⃣ Configurez le Build

```
Build command: npm run build
Publish directory: dist
```

---

### 5️⃣ Ajoutez les Variables d'Environnement

Cliquez sur **"Add environment variables"** :

```
VITE_SUPABASE_URL = https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 6️⃣ Déployez !

Cliquez sur **"Deploy site"**

⏱️ Attendez 2-3 minutes...

✅ **Votre site est en ligne !**

---

### 7️⃣ Configurez Supabase

Dans Supabase → Authentication → URL Configuration :

**Site URL** :
```
https://votre-site.netlify.app
```

**Redirect URLs** :
```
https://votre-site.netlify.app/**
```

---

## 🎉 C'est Fait !

Votre application est maintenant accessible à :
```
https://votre-site.netlify.app
```

---

## 🔄 Mises à Jour Automatiques

Chaque fois que vous poussez sur GitHub :
```bash
git push origin main
```

➡️ Netlify redéploie automatiquement !

---

**Pour plus de détails, consultez `NETLIFY-DEPLOYMENT-GUIDE.md`** 📚
