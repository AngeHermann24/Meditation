# 🚀 COMMENCEZ ICI - Guide de Démarrage Ultra-Rapide

## ⚡ Démarrage en 5 Minutes

### ✅ Étape 1 : Vérifier l'Installation (FAIT)

Les dépendances sont déjà installées ! ✅

### 🔥 Étape 2 : Configurer Supabase (5 minutes)

#### A. Créer un compte Supabase

1. Ouvrez votre navigateur
2. Allez sur : **https://supabase.com**
3. Cliquez sur **"Start your project"**
4. Créez un compte (gratuit, pas de carte bancaire nécessaire)

#### B. Créer un projet

1. Cliquez sur **"New project"**
2. Remplissez :
   - **Name** : `bible-study` (ou autre nom)
   - **Database Password** : Créez un mot de passe fort (NOTEZ-LE !)
   - **Region** : Choisissez `Europe West` (ou la plus proche)
3. Cliquez sur **"Create new project"**
4. ⏱️ Attendez 2 minutes (le projet se crée)

#### C. Récupérer les clés API

1. Une fois le projet créé, cliquez sur **⚙️ Settings** (en bas à gauche)
2. Cliquez sur **API** dans le menu
3. Vous verrez deux informations importantes :

   **Project URL** (ressemble à ça) :
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   
   **anon public** (longue clé qui commence par eyJ...) :
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
   ```

4. **COPIEZ ces deux valeurs** (vous en aurez besoin)

#### D. Créer le fichier .env

1. Dans le dossier `bible-study-app`, créez un nouveau fichier nommé **`.env`**
2. Ouvrez-le et collez ceci :

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **REMPLACEZ** les valeurs par celles que vous avez copiées
4. **SAUVEGARDEZ** le fichier

### 💾 Étape 3 : Créer la Base de Données (2 minutes)

#### A. Ouvrir l'éditeur SQL

1. Dans Supabase, cliquez sur **🗄️ SQL Editor** (dans le menu de gauche)
2. Cliquez sur **"New query"** (bouton en haut)

#### B. Exécuter le schéma

1. Ouvrez le fichier **`supabase-schema.sql`** de votre projet
2. **Sélectionnez TOUT le contenu** (Ctrl+A)
3. **Copiez** (Ctrl+C)
4. Retournez dans Supabase SQL Editor
5. **Collez** dans l'éditeur (Ctrl+V)
6. Cliquez sur **"Run"** (ou appuyez sur F5)
7. ✅ Vous devriez voir : **"Success. No rows returned"**

#### C. Ajouter des données de test (OPTIONNEL)

1. Dans SQL Editor, cliquez sur **"New query"**
2. Ouvrez le fichier **`sample-data.sql`**
3. **Copiez TOUT le contenu**
4. **Collez** dans SQL Editor
5. Cliquez sur **"Run"**
6. ✅ Vous avez maintenant des semaines et chapitres de test !

### 🎉 Étape 4 : Lancer l'Application

Ouvrez un terminal dans le dossier du projet et tapez :

```bash
npm run dev
```

L'application s'ouvrira automatiquement sur **http://localhost:3000** ! 🎊

### 👤 Étape 5 : Créer Votre Compte

1. Sur la page de connexion, cliquez sur **"Pas encore de compte ? S'inscrire"**
2. Remplissez :
   - **Nom complet** : Votre nom
   - **Email** : Votre email
   - **Mot de passe** : Au moins 6 caractères
3. Cliquez sur **"S'inscrire"**
4. ✅ Vous êtes connecté !

### 🛡️ Étape 6 : Devenir Administrateur

Pour accéder au panneau admin :

1. Retournez dans **Supabase**
2. Allez dans **SQL Editor**
3. Créez une **nouvelle requête**
4. Collez ceci (en remplaçant par VOTRE email) :

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'votre@email.com';
```

5. Cliquez sur **"Run"**
6. Retournez dans l'application et **rechargez la page** (F5)
7. 🎉 Vous voyez maintenant l'onglet **"Admin"** !

---

## ✅ VOUS ÊTES PRÊT !

Votre application fonctionne ! Voici ce que vous pouvez faire maintenant :

### 🎯 Tester l'Application

1. **Dashboard** : Voyez vos statistiques
2. **Plan d'étude** : Consultez les semaines (si vous avez ajouté sample-data.sql)
3. **Chapitre** : Lisez un chapitre, ajoutez un commentaire
4. **Quiz** : Passez un quiz
5. **Profil** : Voyez vos badges
6. **Admin** : Créez du contenu

### 📝 Prochaines Actions

#### Si vous avez utilisé les données de test :
- ✅ Explorez l'application
- ✅ Testez toutes les fonctionnalités
- ✅ Familiarisez-vous avec l'interface

#### Si vous voulez créer votre propre contenu :
1. Allez dans **Admin** > **Semaines**
2. Créez votre première semaine d'étude
3. Ajoutez des chapitres
4. Créez un quiz

---

## 📚 Documentation Disponible

Vous avez accès à une documentation complète :

| Fichier | Description | Quand le lire |
|---------|-------------|---------------|
| **NEXT_STEPS.md** | Étapes détaillées | Après ce fichier |
| **QUICK_START.md** | Guide de démarrage | Si vous êtes bloqué |
| **FEATURES.md** | Toutes les fonctionnalités | Pour comprendre l'app |
| **README.md** | Documentation complète | Vue d'ensemble |
| **ARCHITECTURE.md** | Détails techniques | Pour les développeurs |
| **PROJECT_SUMMARY.md** | Résumé visuel | Vue d'ensemble rapide |

---

## 🆘 Problèmes Courants

### ❌ "Invalid API key"
**Solution** : Vérifiez votre fichier `.env`, puis redémarrez le serveur :
```bash
# Arrêtez le serveur (Ctrl+C)
npm run dev
```

### ❌ "Failed to fetch"
**Solution** : Vérifiez que :
- Votre projet Supabase est actif
- L'URL dans `.env` est correcte
- Vous avez une connexion internet

### ❌ Pas de données affichées
**Solution** : 
- Vérifiez que vous avez exécuté `supabase-schema.sql`
- Si vous voulez des données de test, exécutez `sample-data.sql`

### ❌ Impossible de se connecter
**Solution** :
- Ouvrez la console du navigateur (F12)
- Regardez les erreurs dans l'onglet "Console"
- Vérifiez que l'authentification est activée dans Supabase

---

## 🎨 Personnalisation Rapide

### Changer le titre de l'application

Éditez `index.html` :
```html
<title>Nom de Votre Église - Étude Biblique</title>
```

### Changer les couleurs

Éditez `tailwind.config.js` et modifiez les valeurs dans `colors`.

---

## 🌐 Déployer en Ligne (Plus tard)

Quand vous serez prêt à partager avec votre église :

1. Créez un compte sur **Netlify.com** (gratuit)
2. Connectez votre projet GitHub
3. Configurez les variables d'environnement
4. Déployez en un clic !

**Guide détaillé** : Voir `NEXT_STEPS.md` section "Déploiement"

---

## 💡 Conseils

✅ **Testez d'abord** : Utilisez les données de test avant d'ajouter du vrai contenu

✅ **Commencez petit** : Créez 1-2 semaines d'étude pour commencer

✅ **Invitez progressivement** : Testez avec quelques personnes de confiance d'abord

✅ **Sauvegardez** : Exportez régulièrement votre base de données Supabase

---

## 🎯 Checklist de Démarrage

- [ ] ✅ Compte Supabase créé
- [ ] ✅ Projet Supabase créé
- [ ] ✅ Clés API copiées
- [ ] ✅ Fichier `.env` créé
- [ ] ✅ Base de données créée (schema.sql)
- [ ] ✅ Données de test ajoutées (optionnel)
- [ ] ✅ Application lancée (`npm run dev`)
- [ ] ✅ Compte utilisateur créé
- [ ] ✅ Promu en admin
- [ ] ✅ Toutes les pages testées

---

## 🙏 Vous Êtes Prêt !

Votre application d'étude biblique est maintenant opérationnelle !

**Prochaine étape** : Lisez **NEXT_STEPS.md** pour aller plus loin.

---

**Que Dieu bénisse votre communauté dans l'étude de Sa Parole !**

*"Ta parole est une lampe à mes pieds, Et une lumière sur mon sentier." - Psaume 119:105* 📖✨
