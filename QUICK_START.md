# 🚀 Guide de Démarrage Rapide

## Étape 1 : Installation des dépendances

```bash
cd bible-study-app
npm install
```

## Étape 2 : Configuration Supabase

### 2.1 Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Créez un nouveau projet (choisissez un nom, mot de passe et région)
4. Attendez que le projet soit prêt (~2 minutes)

### 2.2 Obtenir les clés API

1. Dans votre projet Supabase, allez dans **Settings** (⚙️) > **API**
2. Copiez :
   - **Project URL** (sous Project URL)
   - **anon public** key (sous Project API keys)

### 2.3 Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```bash
# Windows PowerShell
Copy-Item .env.example .env
```

Éditez le fichier `.env` et remplacez par vos vraies valeurs :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon_ici
```

## Étape 3 : Créer la base de données

### 3.1 Exécuter le schéma principal

1. Dans Supabase, allez dans **SQL Editor** (icône SQL)
2. Cliquez sur **New query**
3. Copiez tout le contenu du fichier `supabase-schema.sql`
4. Collez dans l'éditeur et cliquez sur **Run**

✅ Vous devriez voir : "Success. No rows returned"

### 3.2 Ajouter des données d'exemple (optionnel)

1. Toujours dans SQL Editor, créez une nouvelle requête
2. Copiez le contenu de `sample-data.sql`
3. Collez et cliquez sur **Run**

✅ Cela créera des semaines, chapitres et quiz de test

## Étape 4 : Configurer l'authentification Google (optionnel)

1. Dans Supabase : **Authentication** > **Providers**
2. Activez **Google**
3. Suivez les instructions pour créer des credentials OAuth Google
4. Ajoutez l'URL de callback fournie par Supabase

## Étape 5 : Lancer l'application

```bash
npm run dev
```

L'application s'ouvrira sur `http://localhost:3000`

## Étape 6 : Créer votre premier compte

1. Cliquez sur "Pas encore de compte ? S'inscrire"
2. Remplissez le formulaire
3. Vérifiez votre email (si configuré) ou continuez

## Étape 7 : Devenir administrateur

Pour accéder au panneau admin, vous devez promouvoir votre compte :

1. Allez dans Supabase : **Table Editor** > **profiles**
2. Trouvez votre profil (par email)
3. Modifiez la colonne `role` : changez `user` en `admin`
4. Sauvegardez

OU exécutez dans SQL Editor :

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'votre@email.com';
```

🎉 Rechargez l'application, vous verrez maintenant l'onglet **Admin** !

## 🎯 Prochaines étapes

### En tant qu'administrateur

1. **Créer un plan d'étude**
   - Allez dans Admin > Semaines
   - Créez vos semaines d'étude
   - Ajoutez des chapitres bibliques

2. **Créer des quiz**
   - Allez dans Admin > Quiz
   - Créez des questions pour chaque semaine

3. **Gérer les versets du jour**
   - Ajoutez des versets dans la table `daily_verses`

### En tant qu'utilisateur

1. Explorez le **Dashboard**
2. Consultez le **Plan d'étude**
3. Lisez un chapitre et marquez-le comme lu
4. Ajoutez des commentaires
5. Passez un quiz

## 🔧 Dépannage

### Problème : "Invalid API key"

- Vérifiez que votre fichier `.env` contient les bonnes clés
- Redémarrez le serveur de développement (`npm run dev`)

### Problème : "Failed to fetch"

- Vérifiez que l'URL Supabase est correcte
- Vérifiez votre connexion internet
- Vérifiez que le projet Supabase est actif

### Problème : Pas de données affichées

- Vérifiez que vous avez exécuté `supabase-schema.sql`
- Optionnellement, exécutez `sample-data.sql` pour avoir des données de test
- Vérifiez les Row Level Security policies dans Supabase

### Problème : Impossible de se connecter

- Vérifiez que l'authentification est activée dans Supabase
- Vérifiez que le trigger `on_auth_user_created` existe
- Regardez les logs dans la console du navigateur (F12)

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation React](https://react.dev)
- [Documentation TailwindCSS](https://tailwindcss.com)

## 💡 Conseils

1. **Sauvegardez régulièrement** : Exportez votre base de données Supabase
2. **Testez d'abord** : Utilisez les données d'exemple avant d'ajouter du vrai contenu
3. **Invitez progressivement** : Commencez avec quelques utilisateurs de confiance
4. **Personnalisez** : Adaptez les couleurs, textes et fonctionnalités à votre église

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :

1. Vérifiez les logs du navigateur (F12 > Console)
2. Vérifiez les logs Supabase (Logs dans le menu)
3. Relisez ce guide étape par étape
4. Vérifiez que toutes les dépendances sont installées

---

**Que Dieu bénisse votre communauté dans l'étude de Sa Parole ! 🙏**
