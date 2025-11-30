-- ============================================
-- GÉNÉRER LES 52 SEMAINES DE 2025
-- ============================================
-- Chaque semaine commence le LUNDI et dure 7 jours

-- Supprimer les semaines existantes de 2025 (optionnel)
-- DELETE FROM weeks WHERE EXTRACT(YEAR FROM start_date) = 2025;

-- Générer les 52 semaines de 2025
DO $$
DECLARE
  premier_lundi DATE := '2025-01-06'; -- Premier lundi de 2025
  semaine_num INTEGER;
  date_debut DATE;
  date_fin DATE;
  titre_semaine TEXT;
BEGIN
  FOR semaine_num IN 1..52 LOOP
    date_debut := premier_lundi + (semaine_num - 1) * INTERVAL '7 days';
    date_fin := date_debut + INTERVAL '6 days';
    
    -- Titre personnalisable selon le mois
    titre_semaine := CASE 
      WHEN EXTRACT(MONTH FROM date_debut) = 1 THEN 'Semaine ' || semaine_num || ' - Janvier'
      WHEN EXTRACT(MONTH FROM date_debut) = 2 THEN 'Semaine ' || semaine_num || ' - Février'
      WHEN EXTRACT(MONTH FROM date_debut) = 3 THEN 'Semaine ' || semaine_num || ' - Mars'
      WHEN EXTRACT(MONTH FROM date_debut) = 4 THEN 'Semaine ' || semaine_num || ' - Avril'
      WHEN EXTRACT(MONTH FROM date_debut) = 5 THEN 'Semaine ' || semaine_num || ' - Mai'
      WHEN EXTRACT(MONTH FROM date_debut) = 6 THEN 'Semaine ' || semaine_num || ' - Juin'
      WHEN EXTRACT(MONTH FROM date_debut) = 7 THEN 'Semaine ' || semaine_num || ' - Juillet'
      WHEN EXTRACT(MONTH FROM date_debut) = 8 THEN 'Semaine ' || semaine_num || ' - Août'
      WHEN EXTRACT(MONTH FROM date_debut) = 9 THEN 'Semaine ' || semaine_num || ' - Septembre'
      WHEN EXTRACT(MONTH FROM date_debut) = 10 THEN 'Semaine ' || semaine_num || ' - Octobre'
      WHEN EXTRACT(MONTH FROM date_debut) = 11 THEN 'Semaine ' || semaine_num || ' - Novembre'
      WHEN EXTRACT(MONTH FROM date_debut) = 12 THEN 'Semaine ' || semaine_num || ' - Décembre'
      ELSE 'Semaine ' || semaine_num
    END;
    
    INSERT INTO weeks (title, description, start_date, end_date, order_index)
    VALUES (
      titre_semaine,
      'Du ' || TO_CHAR(date_debut, 'DD/MM/YYYY') || ' au ' || TO_CHAR(date_fin, 'DD/MM/YYYY'),
      date_debut,
      date_fin,
      semaine_num
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
  
  RAISE NOTICE '✅ 52 semaines créées pour 2025 !';
END $$;

-- Afficher les 10 premières semaines
SELECT 
  order_index as num,
  title,
  TO_CHAR(start_date, 'DD/MM/YYYY (Day)') as debut,
  TO_CHAR(end_date, 'DD/MM/YYYY (Day)') as fin
FROM weeks
WHERE EXTRACT(YEAR FROM start_date) = 2025
ORDER BY start_date
LIMIT 10;

-- Statistiques
SELECT 
  '✅ Total semaines 2025' as info,
  COUNT(*) as nombre
FROM weeks
WHERE EXTRACT(YEAR FROM start_date) = 2025;
