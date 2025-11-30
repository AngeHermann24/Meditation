-- ============================================
-- DÉSACTIVER LA VÉRIFICATION D'EMAIL
-- ============================================
-- Note: Il est préférable de le faire via l'interface Supabase
-- Mais si nécessaire, vous pouvez aussi modifier la configuration

-- Vérifier les utilisateurs non confirmés
SELECT 
  email,
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '❌ Non confirmé'
    ELSE '✅ Confirmé'
  END as statut
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- Si vous voulez confirmer manuellement tous les utilisateurs existants
-- ATTENTION: À utiliser avec précaution !
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW() 
-- WHERE email_confirmed_at IS NULL;

-- Confirmer un utilisateur spécifique par email
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW() 
-- WHERE email = 'utilisateur@email.com';
