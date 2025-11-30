# 🔧 Dépannage : Admin ne voit pas les Méditations

## 🎯 Problème

L'admin va dans **Admin > Méditations** et voit "Aucune méditation pour le moment", même s'il devrait y avoir des méditations.

---

## 🔍 Diagnostic en 3 Étapes

### Étape 1 : Vérifier la Configuration

Dans **Supabase SQL Editor**, exécutez le fichier `debug-meditation-admin.sql` :

Cela vous dira :
- ✅ Si la table existe
- ✅ Si les colonnes sont correctes
- ✅ Combien de méditations existent
- ✅ Si vous êtes admin
- ✅ Si les policies sont en place

---

### Étape 2 : Réparer Automatiquement

Dans **Supabase SQL Editor**, exécutez le fichier `fix-meditation-admin.sql` :

Ce script va :
- ✅ Créer la table si elle n'existe pas
- ✅ Ajouter les colonnes manquantes
- ✅ Créer tous les index
- ✅ Activer RLS
- ✅ Créer toutes les policies nécessaires
- ✅ Créer le trigger updated_at

**C'est la solution la plus simple !**

---

### Étape 3 : Créer une Méditation de Test

Si après l'étape 2 vous ne voyez toujours rien, c'est qu'il n'y a simplement **aucune méditation** dans la base.

**Créez une méditation de test** :

1. **En tant qu'utilisateur** (pas admin)
2. Allez sur un chapitre avec guide de méditation
3. Remplissez le formulaire
4. Cliquez sur "Soumettre ma méditation"
5. Retournez dans **Admin > Méditations**
6. Vous devriez voir la méditation !

---

## 🆘 Solutions aux Problèmes Courants

### Problème 1 : "Table meditation_responses n'existe pas"

**Solution** : Exécutez `fix-meditation-admin.sql` qui créera la table.

Ou manuellement :
```sql
-- Exécutez tout le contenu de add-meditation-responses.sql
```

---

### Problème 2 : "Vous n'êtes pas admin"

**Vérification** :
```sql
SELECT email, role FROM profiles WHERE id = auth.uid();
```

**Solution** :
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'votre@email.com';
```

---

### Problème 3 : "Aucune policy pour les admins"

**Vérification** :
```sql
SELECT policyname FROM pg_policies 
WHERE tablename = 'meditation_responses' 
AND policyname = 'Admins can view all meditation responses';
```

**Solution** : Exécutez `fix-meditation-admin.sql` ou :
```sql
CREATE POLICY "Admins can view all meditation responses" 
  ON meditation_responses FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

---

### Problème 4 : "Aucune méditation dans la base"

**Vérification** :
```sql
SELECT COUNT(*) FROM meditation_responses;
```

Si le résultat est **0**, c'est normal que l'admin ne voie rien !

**Solution** : Créez une méditation de test (voir Étape 3 ci-dessus).

---

### Problème 5 : "Erreur de permission"

**Vérification** :
```sql
-- Vérifier si RLS est activé
SELECT relrowsecurity FROM pg_class WHERE relname = 'meditation_responses';
```

**Solution** :
```sql
ALTER TABLE meditation_responses ENABLE ROW LEVEL SECURITY;
```

---

### Problème 6 : "Les colonnes status/submitted_at n'existent pas"

**Vérification** :
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'meditation_responses';
```

**Solution** : Exécutez `add-meditation-status.sql` ou :
```sql
ALTER TABLE meditation_responses 
ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted'));

ALTER TABLE meditation_responses 
ADD COLUMN submitted_at TIMESTAMP WITH TIME ZONE;
```

---

## 📋 Checklist Complète

Cochez chaque élément :

### Base de Données
- [ ] Table `meditation_responses` existe
- [ ] Colonne `status` existe
- [ ] Colonne `submitted_at` existe
- [ ] RLS est activé
- [ ] Policy "Admins can view all meditation responses" existe
- [ ] Au moins une méditation existe dans la table

### Utilisateur
- [ ] Vous êtes connecté
- [ ] Votre rôle est 'admin'
- [ ] Vous avez rechargé l'application (F5)

### Frontend
- [ ] Onglet "Méditations" visible dans Admin
- [ ] Pas d'erreur dans la console (F12)
- [ ] Application à jour (dernier code)

---

## 🎯 Solution Rapide (Recommandée)

**Si vous voulez tout réparer d'un coup** :

1. **Ouvrez Supabase SQL Editor**
2. **Exécutez `fix-meditation-admin.sql`**
3. **Vérifiez que vous êtes admin** :
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'votre@email.com';
   ```
4. **Créez une méditation de test** (en tant qu'utilisateur)
5. **Rechargez l'application** (F5)
6. **Allez dans Admin > Méditations**
7. ✅ **Vous devriez voir la méditation !**

---

## 🔍 Vérification Manuelle Détaillée

### Test 1 : La table existe-t-elle ?

```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'meditation_responses'
);
```

**Résultat attendu** : `true`

---

### Test 2 : Combien de méditations ?

```sql
SELECT COUNT(*) FROM meditation_responses;
```

**Résultat attendu** : Au moins 1

---

### Test 3 : Êtes-vous admin ?

```sql
SELECT email, role FROM profiles WHERE id = auth.uid();
```

**Résultat attendu** : `role = 'admin'`

---

### Test 4 : Les policies existent-elles ?

```sql
SELECT policyname FROM pg_policies 
WHERE tablename = 'meditation_responses';
```

**Résultat attendu** : Au moins 5 policies dont "Admins can view all meditation responses"

---

### Test 5 : Pouvez-vous lire les méditations ?

```sql
SELECT * FROM meditation_responses LIMIT 1;
```

**Résultat attendu** : Au moins une ligne (si des méditations existent)

---

## 💡 Erreurs Courantes

### Erreur : "permission denied for table meditation_responses"

**Cause** : RLS est activé mais vous n'avez pas la policy admin.

**Solution** :
```sql
CREATE POLICY "Admins can view all meditation responses" 
  ON meditation_responses FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

---

### Erreur : "column status does not exist"

**Cause** : La colonne status n'a pas été ajoutée.

**Solution** :
```sql
ALTER TABLE meditation_responses 
ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted'));
```

---

### Erreur : "relation meditation_responses does not exist"

**Cause** : La table n'a pas été créée.

**Solution** : Exécutez `add-meditation-responses.sql` ou `fix-meditation-admin.sql`

---

## 🎓 Comprendre le Problème

### Pourquoi l'admin ne voit pas les méditations ?

Il y a **3 raisons possibles** :

1. **La table n'existe pas** → Créer la table
2. **Les permissions RLS bloquent** → Ajouter la policy admin
3. **Aucune méditation n'existe** → Créer une méditation de test

---

## ✅ Après la Réparation

Une fois que tout fonctionne, vous devriez voir :

```
┌─────────────────────────────────────────────────────┐
│  Panneau d'administration                           │
│  [Semaines] [Chapitres] [Quiz] [Users] [Commentaires] [Méditations] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Marie Dupont [✓ Soumise]                           │
│  Chapitre: Matthieu 5 - Les Béatitudes              │
│  Créée le 27 nov 2025 à 14:30                       │
│  • Soumise le 27 nov 2025 à 18:45                   │
│  [Réponses OIA complètes...]                        │
└─────────────────────────────────────────────────────┘
```

---

## 📞 Besoin d'Aide ?

Si rien ne fonctionne :

1. **Exécutez `debug-meditation-admin.sql`**
2. **Copiez les résultats**
3. **Partagez-les avec moi**
4. Je vous aiderai à identifier le problème exact !

---

**La solution la plus simple : Exécutez `fix-meditation-admin.sql` et créez une méditation de test !** 🎯
