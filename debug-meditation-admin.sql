-- ============================================
-- SCRIPT DE DIAGNOSTIC POUR LES MÉDITATIONS ADMIN
-- ============================================
-- Exécutez ce script pour diagnostiquer pourquoi l'admin ne voit pas les méditations

-- 1. Vérifier si la table existe
SELECT 
  'Table meditation_responses existe' as check_name,
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'meditation_responses'
  ) as result;

-- 2. Vérifier les colonnes de la table
SELECT 
  'Colonnes de meditation_responses' as check_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'meditation_responses'
ORDER BY ordinal_position;

-- 3. Compter les méditations
SELECT 
  'Nombre total de méditations' as check_name,
  COUNT(*) as count
FROM meditation_responses;

-- 4. Compter par statut
SELECT 
  'Méditations par statut' as check_name,
  status,
  COUNT(*) as count
FROM meditation_responses
GROUP BY status;

-- 5. Vérifier votre rôle
SELECT 
  'Votre rôle' as check_name,
  email,
  role
FROM profiles
WHERE id = auth.uid();

-- 6. Vérifier les policies RLS
SELECT 
  'Policies sur meditation_responses' as check_name,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'meditation_responses';

-- 7. Tester si vous pouvez voir les méditations
SELECT 
  'Test de lecture des méditations' as check_name,
  COUNT(*) as meditations_visibles
FROM meditation_responses;

-- 8. Voir les 3 dernières méditations (si vous êtes admin)
SELECT 
  'Dernières méditations' as info,
  id,
  status,
  created_at
FROM meditation_responses
ORDER BY created_at DESC
LIMIT 3;

-- 9. Vérifier RLS est activé
SELECT 
  'RLS activé sur meditation_responses' as check_name,
  relrowsecurity as rls_enabled
FROM pg_class
WHERE relname = 'meditation_responses';
