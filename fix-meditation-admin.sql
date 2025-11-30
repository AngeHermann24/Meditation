-- ============================================
-- SCRIPT DE RÉPARATION POUR LES MÉDITATIONS ADMIN
-- ============================================
-- Ce script configure TOUT ce qui est nécessaire pour que l'admin voie les méditations

-- ÉTAPE 1: Créer la table si elle n'existe pas
CREATE TABLE IF NOT EXISTS meditation_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  chapter_id UUID REFERENCES chapters ON DELETE CASCADE NOT NULL,
  
  -- Réponses Observation
  observation_who TEXT,
  observation_what TEXT,
  observation_whom TEXT,
  observation_context TEXT,
  
  -- Réponses Interprétation
  interpretation_meaning TEXT,
  interpretation_truth TEXT,
  interpretation_message TEXT,
  
  -- Réponses Application
  application_rhema TEXT,
  application_action TEXT,
  application_transformation TEXT,
  
  -- Statut et dates
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Un utilisateur ne peut avoir qu'une seule réponse par chapitre
  UNIQUE(user_id, chapter_id)
);

-- ÉTAPE 2: Ajouter les colonnes status et submitted_at si elles n'existent pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'meditation_responses' AND column_name = 'status'
  ) THEN
    ALTER TABLE meditation_responses ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted'));
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'meditation_responses' AND column_name = 'submitted_at'
  ) THEN
    ALTER TABLE meditation_responses ADD COLUMN submitted_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- ÉTAPE 3: Créer les index
CREATE INDEX IF NOT EXISTS idx_meditation_responses_user_id ON meditation_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_meditation_responses_chapter_id ON meditation_responses(chapter_id);
CREATE INDEX IF NOT EXISTS idx_meditation_responses_status ON meditation_responses(status);

-- ÉTAPE 4: Activer Row Level Security
ALTER TABLE meditation_responses ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 5: Supprimer toutes les anciennes policies (pour repartir à zéro)
DROP POLICY IF EXISTS "Users can view own meditation responses" ON meditation_responses;
DROP POLICY IF EXISTS "Users can create own meditation responses" ON meditation_responses;
DROP POLICY IF EXISTS "Users can update own meditation responses" ON meditation_responses;
DROP POLICY IF EXISTS "Users can delete own meditation responses" ON meditation_responses;
DROP POLICY IF EXISTS "Admins can view all meditation responses" ON meditation_responses;

-- ÉTAPE 6: Créer les nouvelles policies

-- Policy 1: Les utilisateurs voient leurs propres réponses
CREATE POLICY "Users can view own meditation responses" 
  ON meditation_responses FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy 2: Les utilisateurs créent leurs propres réponses
CREATE POLICY "Users can create own meditation responses" 
  ON meditation_responses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Les utilisateurs modifient leurs propres réponses
CREATE POLICY "Users can update own meditation responses" 
  ON meditation_responses FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy 4: Les utilisateurs suppriment leurs propres réponses
CREATE POLICY "Users can delete own meditation responses" 
  ON meditation_responses FOR DELETE 
  USING (auth.uid() = user_id);

-- Policy 5: Les admins voient TOUTES les réponses
CREATE POLICY "Admins can view all meditation responses" 
  ON meditation_responses FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ÉTAPE 7: Créer le trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_meditation_responses_updated_at ON meditation_responses;

CREATE TRIGGER update_meditation_responses_updated_at 
  BEFORE UPDATE ON meditation_responses
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ÉTAPE 8: Vérification finale
SELECT 
  'Configuration terminée' as status,
  COUNT(*) as total_meditations,
  COUNT(*) FILTER (WHERE status = 'draft') as brouillons,
  COUNT(*) FILTER (WHERE status = 'submitted') as soumises
FROM meditation_responses;

-- ÉTAPE 9: Afficher les policies créées
SELECT 
  'Policies créées' as info,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'meditation_responses';
