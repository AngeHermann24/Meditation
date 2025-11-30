-- ============================================
-- CORRIGER LA TABLE WEEKS
-- ============================================
-- Ajouter la colonne order_index si elle n'existe pas

-- Vérifier les colonnes actuelles de la table weeks
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'weeks'
ORDER BY ordinal_position;

-- Ajouter la colonne order_index si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'weeks' AND column_name = 'order_index'
  ) THEN
    ALTER TABLE weeks ADD COLUMN order_index INTEGER;
    RAISE NOTICE '✅ Colonne order_index ajoutée !';
  ELSE
    RAISE NOTICE 'ℹ️ Colonne order_index existe déjà';
  END IF;
END $$;

-- Vérifier que la colonne a été ajoutée
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'weeks'
ORDER BY ordinal_position;
