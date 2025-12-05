# 🔧 Corriger l'Erreur CORS avec Supabase

## 🎯 Erreur

```
Access to fetch at 'https://ugdqurvlpoiajljjbxbs.supabase.co/auth/v1/token?grant_type=password'
from origin 'http://localhost:3000' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## ✅ Solution Complète (5 minutes)

### Étape 1 : Configurer les URLs dans Supabase

1. **Allez sur** : https://supabase.com
2. **Connectez-vous** et sélectionnez votre projet
3. **Cliquez** sur **Authentication** (🔐) dans le menu de gauche
4. **Cliquez** sur **URL Configuration**
5. **Ajoutez** les URLs suivantes :

#### Site URL
```
http://localhost:3000
```

#### Redirect URLs (une par ligne)
```
http://localhost:3000/**
http://localhost:5173/**
http://127.0.0.1:3000/**
http://127.0.0.1:5173/**
```

6. **Cliquez** sur **Save**

---

### Étape 2 : Vérifier le fichier `.env`

Votre fichier `.env` doit contenir :

```env
VITE_SUPABASE_URL=https://ugdqurvlpoiajljjbxbs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnZHF1cnZscG9pYWpsampieGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMTI4NTMsImV4cCI6MjA0ODg4ODg1M30.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

✅ **Vos valeurs sont correctes !**

---

### Étape 3 : Vérifier que le Projet Supabase est Actif

1. **Allez** sur votre dashboard Supabase
2. **Vérifiez** qu'il n'y a pas de message "Project is paused"
3. Si le projet est en pause, cliquez sur **"Restore project"**
4. **Attendez** 2-3 minutes que le projet redémarre

---

### Étape 4 : Redémarrer le Serveur

1. **Arrêtez** le serveur (Ctrl+C dans le terminal)
2. **Relancez** :
   ```bash
   npm run dev
   ```
3. **Rechargez** la page (F5)

---

## 📸 Capture d'Écran de la Configuration

### Dans Supabase → Authentication → URL Configuration

```
┌─────────────────────────────────────────────┐
│ Site URL                                    │
│ ┌─────────────────────────────────────────┐ │
│ │ http://localhost:3000                   │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Redirect URLs                               │
│ ┌─────────────────────────────────────────┐ │
│ │ http://localhost:3000/**                │ │
│ │ http://localhost:5173/**                │ │
│ │ http://127.0.0.1:3000/**                │ │
│ │ http://127.0.0.1:5173/**                │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [Save]                                      │
└─────────────────────────────────────────────┘
```

---

## 🔍 Vérifications

### Test 1 : Variables d'Environnement

Dans le terminal :
```powershell
cd c:\Users\Angeh\OneDrive\Bureau\Meditation\bible-study-app
Get-Content .env
```

Vous devriez voir :
```
VITE_SUPABASE_URL=https://ugdqurvlpoiajljjbxbs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Test 2 : Console du Navigateur

1. **Ouvrez** la console (F12)
2. **Tapez** :
   ```javascript
   console.log(import.meta.env.VITE_SUPABASE_URL)
   console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
   ```
3. **Vérifiez** que les valeurs s'affichent correctement

---

## 🐛 Problèmes Courants

### Problème 1 : "Project is paused"

**Solution** :
1. Allez sur https://supabase.com
2. Sélectionnez votre projet
3. Cliquez sur "Restore project"
4. Attendez 2-3 minutes

### Problème 2 : URLs non sauvegardées

**Solution** :
1. Vérifiez que vous avez cliqué sur **"Save"** dans Supabase
2. Attendez 1-2 minutes que les changements se propagent
3. Redémarrez votre serveur

### Problème 3 : Mauvaise clé API

**Solution** :
1. Allez sur Supabase → Settings → API
2. Copiez la clé **"anon public"** (pas la clé "service_role")
3. Mettez à jour `.env`
4. Redémarrez le serveur

### Problème 4 : Cache du navigateur

**Solution** :
1. Videz le cache (Ctrl+Shift+Delete)
2. Ou ouvrez en navigation privée (Ctrl+Shift+N)
3. Rechargez la page

---

## 📋 Checklist Complète

- [ ] ✅ Projet Supabase actif (pas en pause)
- [ ] ✅ URLs ajoutées dans Authentication → URL Configuration
- [ ] ✅ Site URL : `http://localhost:3000`
- [ ] ✅ Redirect URLs : `http://localhost:3000/**`
- [ ] ✅ Changements sauvegardés (bouton "Save")
- [ ] ✅ Fichier `.env` correct
- [ ] ✅ Serveur redémarré
- [ ] ✅ Page rechargée (F5)
- [ ] ✅ Cache vidé

---

## 🎯 Résumé des Étapes

```
1. Supabase Dashboard
   ↓
2. Authentication → URL Configuration
   ↓
3. Ajouter http://localhost:3000 et http://localhost:3000/**
   ↓
4. Save
   ↓
5. Redémarrer le serveur (npm run dev)
   ↓
6. Recharger la page (F5)
   ↓
7. ✅ Connexion fonctionne !
```

---

## 🆘 Si Ça Ne Fonctionne Toujours Pas

### Vérifiez dans la Console

Ouvrez la console (F12) et cherchez :
- ❌ Erreurs CORS
- ❌ Erreurs 401 (mauvaise clé)
- ❌ Erreurs 403 (permissions)
- ❌ Erreurs de réseau

### Testez avec cURL

Dans le terminal :
```bash
curl -X POST https://ugdqurvlpoiajljjbxbs.supabase.co/auth/v1/token?grant_type=password ^
  -H "apikey: VOTRE_CLE_ANON" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

Si cURL fonctionne mais pas le navigateur, c'est un problème CORS.

---

## 💡 Pourquoi Cette Erreur ?

Supabase bloque les requêtes provenant d'origines non autorisées pour des raisons de sécurité.

**Par défaut**, seules les URLs configurées dans "URL Configuration" peuvent faire des requêtes.

**Solution** : Ajouter `http://localhost:3000` dans les URLs autorisées.

---

## ✅ Après la Correction

Une fois configuré, vous pourrez :
- ✅ Vous inscrire
- ✅ Vous connecter
- ✅ Accéder au dashboard
- ✅ Utiliser toutes les fonctionnalités

---

**Suivez ces étapes et l'erreur CORS sera résolue ! 🎉**

*Si vous avez encore des problèmes, partagez les erreurs de la console avec moi.* 😊
