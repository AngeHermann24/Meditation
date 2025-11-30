-- ============================================
-- AJOUT DU CHAMP MEDITATION_GUIDE
-- ============================================
-- Exécutez ce script dans Supabase SQL Editor pour ajouter
-- le guide de méditation OIA aux chapitres

ALTER TABLE chapters 
ADD COLUMN meditation_guide TEXT;

-- Commentaire pour expliquer le champ
COMMENT ON COLUMN chapters.meditation_guide IS 'Guide de méditation OIA (Observation, Interprétation, Application) pour le chapitre';

-- Exemple de mise à jour pour un chapitre existant (optionnel)
-- UPDATE chapters 
-- SET meditation_guide = 'O : Observation
-- De qui parle le texte ?
-- De quoi parle le texte ?
-- À qui le texte s''adresse-t-il ?
-- Que se passe-t-il ?
-- 
-- I : Interprétation
-- Qu''est-ce que ce texte veut dire ?
-- Quelle vérité spirituelle se dégage ?
-- 
-- A : Application
-- Rhéma : Qu''est-ce que Dieu me dit personnellement ?
-- Quelle action concrète dois-je poser ?
-- Comment ce texte transforme ma vie ?'
-- WHERE id = 'votre-id-chapitre';
