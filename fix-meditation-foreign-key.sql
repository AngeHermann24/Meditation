-- ============================================
-- CORRIGER LA FOREIGN KEY POUR LES MÉDITATIONS
-- ============================================
-- Le problème: meditation_responses.user_id référence auth.users
-- Solution: Il doit référencer profiles

-- ÉTAPE 1: Supprimer l'ancienne contrainte de foreign key
ALTER TABLE meditation_responses 
DROP CONSTRAINT IF EXISTS meditation_responses_user_id_fkey;

-- ÉTAPE 2: Ajouter la nouvelle contrainte vers profiles
ALTER TABLE meditation_responses
ADD CONSTRAINT meditation_responses_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- ÉTAPE 3: Vérifier que ça fonctionne
SELECT 
  'Test de jointure' as test,
  COUNT(*) as total_meditations
FROM meditation_responses mr
JOIN profiles p ON mr.user_id = p.id;

-- ÉTAPE 4: Afficher quelques méditations avec les infos utilisateur
SELECT 
  mr.id,
  p.full_name,
  p.email,
  mr.status,
  mr.created_at
FROM meditation_responses mr
JOIN profiles p ON mr.user_id = p.id
ORDER BY mr.created_at DESC
LIMIT 5;
