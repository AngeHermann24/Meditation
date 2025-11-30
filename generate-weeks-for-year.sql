-- ============================================
-- GÉNÉRER AUTOMATIQUEMENT LES SEMAINES POUR UNE ANNÉE
-- ============================================
-- Crée 52 semaines pour l'année en cours, chaque semaine commence le lundi

-- CONFIGURATION: Changez l'année ici
DO $$
DECLARE
  annee INTEGER := 2025; -- Changez l'année ici
  premier_lundi DATE;
  semaine_num INTEGER;
  date_debut DATE;
  date_fin DATE;
BEGIN
  -- Trouver le premier lundi de l'année
  premier_lundi := DATE_TRUNC('year', (annee || '-01-01')::DATE);
  
  -- Ajuster pour trouver le lundi
  WHILE EXTRACT(DOW FROM premier_lundi) != 1 LOOP
    premier_lundi := premier_lundi + INTERVAL '1 day';
  END LOOP;
  
  -- Générer 52 semaines
  FOR semaine_num IN 1..52 LOOP
    date_debut := premier_lundi + (semaine_num - 1) * INTERVAL '7 days';
    date_fin := date_debut + INTERVAL '6 days';
    
    -- Insérer la semaine (si elle n'existe pas déjà)
    INSERT INTO weeks (title, description, start_date, end_date, order_index)
    VALUES (
      'Semaine ' || semaine_num || ' - ' || annee,
      'Semaine du ' || TO_CHAR(date_debut, 'DD/MM/YYYY') || ' au ' || TO_CHAR(date_fin, 'DD/MM/YYYY'),
      date_debut,
      date_fin,
      semaine_num
    )
    ON CONFLICT DO NOTHING; -- Évite les doublons si la semaine existe déjà
  END LOOP;
  
  RAISE NOTICE 'Création de 52 semaines pour l''année % terminée !', annee;
END $$;

-- Vérifier les semaines créées
SELECT 
  title,
  TO_CHAR(start_date, 'DD/MM/YYYY') as debut,
  TO_CHAR(end_date, 'DD/MM/YYYY') as fin,
  EXTRACT(DOW FROM start_date) as jour_semaine_debut, -- 1 = Lundi
  order_index
FROM weeks
WHERE EXTRACT(YEAR FROM start_date) = 2025 -- Changez l'année ici
ORDER BY start_date
LIMIT 10;

-- Compter les semaines créées
SELECT 
  EXTRACT(YEAR FROM start_date) as annee,
  COUNT(*) as nombre_semaines
FROM weeks
GROUP BY EXTRACT(YEAR FROM start_date)
ORDER BY annee DESC;
