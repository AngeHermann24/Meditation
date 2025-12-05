# 🔧 Résoudre l'Erreur "Failed to fetch"

## 🎯 Problème

L'erreur **"Failed to fetch"** signifie que l'application ne peut pas se connecter à Supabase.

---

## ✅ Solution Rapide

### Étape 1 : Vérifier le fichier `.env`

1. **Ouvrez** le fichier `.env` à la racine du projet
2. **Vérifiez** qu'il contient :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-publique
```

### Étape 2 : Obtenir les Bonnes Valeurs

1. **Allez sur** : https://supabase.com
2. **Sélectionnez** votre projet
3. **Cliquez** sur **Settings** (⚙️) → **API**
4. **Copiez** :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

### Étape 3 : Mettre à Jour `.env`

Remplacez les valeurs dans `.env` :

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnZHF1cnZscG9pYWpsampieGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMTI4NTMsImV4cCI6MjA0ODg4ODg1M30.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Étape 4 : Redémarrer l'Application

1. **Arrêtez** le serveur (Ctrl+C dans le terminal)
2. **Relancez** : `npm run dev`
3. **Rechargez** la page (F5)

---

## 🔍 Vérifications

### Test 1 : Variables d'Environnement

Dans le terminal :

```powershell
cd c:\Users\Angeh\OneDrive\Bureau\Meditation\bible-study-app
Get-Content .env
```

Vous devriez voir vos variables.

### Test 2 : Connexion à Supabase

Ouvrez la console du navigateur (F12) et regardez les erreurs.

---

## 🐛 Problèmes Courants

### Problème 1 : `.env` n'existe pas

**Solution** : Créez le fichier `.env` à la racine :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé
```

### Problème 2 : Mauvaises valeurs

**Solution** : Vérifiez que :
- L'URL commence par `https://` et finit par `.supabase.co`
- La clé commence par `eyJ`

### Problème 3 : Serveur pas redémarré

**Solution** : Après avoir modifié `.env`, **redémarrez toujours** le serveur !

### Problème 4 : Projet Supabase en pause

**Solution** : 
1. Allez sur https://supabase.com
2. Vérifiez que votre projet est actif (pas en pause)
3. Si en pause, cliquez sur "Restore"

---

## 📝 Exemple de `.env` Correct

```env
VITE_SUPABASE_URL=https://ugdqurvlpoiajljjbxbs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnZHF1cnZscG9pYWpsampieGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMTI4NTMsImV4cCI6MjA0ODg4ODg1M30.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **Remplacez par VOS vraies valeurs !**

---

## ✅ Checklist

- [ ] Fichier `.env` existe
- [ ] `VITE_SUPABASE_URL` est correct
- [ ] `VITE_SUPABASE_ANON_KEY` est correct
- [ ] Serveur redémarré après modification
- [ ] Page rechargée (F5)
- [ ] Projet Supabase actif

---

## 🆘 Si Ça Ne Fonctionne Toujours Pas

1. **Ouvrez** la console (F12)
2. **Regardez** l'onglet "Console"
3. **Copiez** les erreurs
4. **Partagez-les** avec moi

---

**Après avoir suivi ces étapes, vous devriez pouvoir vous connecter ! 🎉**
