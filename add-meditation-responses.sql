-- ============================================
-- TABLE POUR LES RÉPONSES DE MÉDITATION OIA
-- ============================================
-- Permet aux utilisateurs de sauvegarder leurs réponses personnelles
-- aux questions de méditation pour chaque chapitre

-- Créer la table meditation_responses
CREATE TABLE meditation_responses (
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
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Un utilisateur ne peut avoir qu'une seule réponse par chapitre
  UNIQUE(user_id, chapter_id)
);

-- Index pour performance
CREATE INDEX idx_meditation_responses_user_id ON meditation_responses(user_id);
CREATE INDEX idx_meditation_responses_chapter_id ON meditation_responses(chapter_id);

-- Enable Row Level Security
ALTER TABLE meditation_responses ENABLE ROW LEVEL SECURITY;

-- Policies RLS
-- Les utilisateurs peuvent voir uniquement leurs propres réponses
CREATE POLICY "Users can view own meditation responses" 
  ON meditation_responses FOR SELECT 
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs propres réponses
CREATE POLICY "Users can create own meditation responses" 
  ON meditation_responses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent modifier leurs propres réponses
CREATE POLICY "Users can update own meditation responses" 
  ON meditation_responses FOR UPDATE 
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres réponses
CREATE POLICY "Users can delete own meditation responses" 
  ON meditation_responses FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger pour updated_at
CREATE TRIGGER update_meditation_responses_updated_at 
  BEFORE UPDATE ON meditation_responses
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Commentaires
COMMENT ON TABLE meditation_responses IS 'Réponses personnelles des utilisateurs aux questions de méditation OIA';
COMMENT ON COLUMN meditation_responses.observation_who IS 'Réponse à: De qui parle le texte ?';
COMMENT ON COLUMN meditation_responses.observation_what IS 'Réponse à: De quoi parle le texte ?';
COMMENT ON COLUMN meditation_responses.observation_whom IS 'Réponse à: À qui le texte s''adresse-t-il ?';
COMMENT ON COLUMN meditation_responses.observation_context IS 'Réponse à: Que se passe-t-il ?';
COMMENT ON COLUMN meditation_responses.interpretation_meaning IS 'Réponse à: Qu''est-ce que ce texte veut dire ?';
COMMENT ON COLUMN meditation_responses.interpretation_truth IS 'Réponse à: Quelle vérité spirituelle se dégage ?';
COMMENT ON COLUMN meditation_responses.interpretation_message IS 'Réponse à: Qu''est-ce que je comprends du message de Dieu ?';
COMMENT ON COLUMN meditation_responses.application_rhema IS 'Réponse à: Rhéma - Qu''est-ce que Dieu me dit personnellement ?';
COMMENT ON COLUMN meditation_responses.application_action IS 'Réponse à: Quelle action concrète dois-je poser ?';
COMMENT ON COLUMN meditation_responses.application_transformation IS 'Réponse à: Comment ce texte transforme ma vie ?';
