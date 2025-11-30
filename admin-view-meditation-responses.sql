-- ============================================
-- PERMETTRE AUX ADMINS DE VOIR TOUTES LES RÉPONSES
-- ============================================
-- Les admins peuvent voir les réponses de méditation de tous les membres
-- pour mieux accompagner spirituellement

-- Policy pour que les admins voient toutes les réponses
CREATE POLICY "Admins can view all meditation responses" 
  ON meditation_responses FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Note: Cette policy s'ajoute aux policies existantes
-- Les utilisateurs peuvent toujours voir leurs propres réponses
-- Les admins peuvent maintenant voir TOUTES les réponses
