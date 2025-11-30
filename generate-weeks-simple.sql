-- ============================================
-- GÉNÉRER 52 SEMAINES À PARTIR DU PROCHAIN LUNDI
-- ============================================
-- Version simple sans order_index
-- Commence le lundi 2 décembre 2024 et continue pour 52 semaines

-- Supprimer les semaines existantes (optionnel)
-- DELETE FROM weeks;

-- Générer 52 semaines à partir du prochain lundi
DO $$
DECLARE
  premier_lundi DATE := '2024-12-02'; -- Lundi 2 décembre 2024
  semaine_num INTEGER;
  date_debut DATE;
  date_fin DATE;
  titre_semaine TEXT;
  mois_nom TEXT;
  annee INTEGER;
BEGIN
  FOR semaine_num IN 1..52 LOOP
    date_debut := premier_lundi + (semaine_num - 1) * INTERVAL '7 days';
    date_fin := date_debut + INTERVAL '6 days';
    annee := EXTRACT(YEAR FROM date_debut);
    
    -- Nom du mois en français
    mois_nom := CASE EXTRACT(MONTH FROM date_debut)
      WHEN 1 THEN 'Janvier'
      WHEN 2 THEN 'Février'
      WHEN 3 THEN 'Mars'
      WHEN 4 THEN 'Avril'
      WHEN 5 THEN 'Mai'
      WHEN 6 THEN 'Juin'
      WHEN 7 THEN 'Juillet'
      WHEN 8 THEN 'Août'
      WHEN 9 THEN 'Septembre'
      WHEN 10 THEN 'Octobre'
      WHEN 11 THEN 'Novembre'
      WHEN 12 THEN 'Décembre'
    END;
    
    -- Titre avec le mois et l'année
    titre_semaine := 'Semaine ' || semaine_num || ' - ' || mois_nom || ' ' || annee;
    
    -- Insertion sans order_index
    INSERT INTO weeks (title, description, start_date, end_date)
    VALUES (
      titre_semaine,
      'Du ' || TO_CHAR(date_debut, 'DD/MM/YYYY') || ' au ' || TO_CHAR(date_fin, 'DD/MM/YYYY'),
      date_debut,
      date_fin
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
  
  RAISE NOTICE '✅ 52 semaines créées à partir du lundi 2 décembre 2024 !';
END $$;

-- Afficher les 10 premières semaines
SELECT 
  id,
  title,
  TO_CHAR(start_date, 'DD/MM/YYYY') as debut,
  TO_CHAR(end_date, 'DD/MM/YYYY') as fin,
  CASE EXTRACT(DOW FROM start_date)
    WHEN 1 THEN '✅ Lundi'
    ELSE '❌ Pas lundi'
  END as verification
FROM weeks
ORDER BY start_date
LIMIT 10;

-- Afficher les dernières semaines
SELECT 
  title,
  TO_CHAR(start_date, 'DD/MM/YYYY') as debut,
  TO_CHAR(end_date, 'DD/MM/YYYY') as fin
FROM weeks
ORDER BY start_date DESC
LIMIT 5;

-- Statistiques
SELECT 
  '✅ Total semaines créées' as info,
  COUNT(*) as nombre,
  TO_CHAR(MIN(start_date), 'DD/MM/YYYY') as premiere_semaine,
  TO_CHAR(MAX(end_date), 'DD/MM/YYYY') as derniere_semaine
FROM weeks;
