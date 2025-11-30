-- ============================================
-- AJOUTER UN STATUT DE SOUMISSION AUX MÉDITATIONS
-- ============================================
-- Permet de distinguer les méditations en brouillon des méditations soumises

-- Ajouter la colonne status
ALTER TABLE meditation_responses 
ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted'));

-- Ajouter la date de soumission
ALTER TABLE meditation_responses 
ADD COLUMN submitted_at TIMESTAMP WITH TIME ZONE;

-- Commentaires
COMMENT ON COLUMN meditation_responses.status IS 'Statut de la méditation: draft (brouillon) ou submitted (soumise)';
COMMENT ON COLUMN meditation_responses.submitted_at IS 'Date et heure de soumission de la méditation';

-- Créer un index pour filtrer rapidement les méditations soumises
CREATE INDEX idx_meditation_responses_status ON meditation_responses(status);
