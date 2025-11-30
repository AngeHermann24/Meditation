# 📅 Génération Automatique des Semaines

## 🎯 Objectif

Créer automatiquement **52 semaines** pour toute l'année, chaque semaine commençant le **lundi**.

---

## 🚀 Utilisation Rapide

### Pour 2025 (Recommandé)

Dans **Supabase SQL Editor**, exécutez le fichier **`generate-weeks-2025.sql`** :

1. Ouvrez Supabase SQL Editor
2. Copiez tout le contenu de `generate-weeks-2025.sql`
3. Collez et cliquez sur **"Run"**
4. ✅ **52 semaines créées pour 2025 !**

---

## 📋 Ce qui est créé

### Format des Semaines

Chaque semaine aura :
- **Titre** : "Semaine X - Mois" (ex: "Semaine 1 - Janvier")
- **Description** : "Du DD/MM/YYYY au DD/MM/YYYY"
- **Date début** : Lundi
- **Date fin** : Dimanche (6 jours après)
- **Order index** : Numéro de la semaine (1-52)

### Exemple

```
Semaine 1 - Janvier
Du 06/01/2025 au 12/01/2025

Semaine 2 - Janvier
Du 13/01/2025 au 19/01/2025

Semaine 3 - Janvier
Du 20/01/2025 au 26/01/2025

...

Semaine 52 - Décembre
Du 22/12/2025 au 28/12/2025
```

---

## 🎨 Personnalisation

### Changer l'Année

Dans `generate-weeks-for-year.sql`, modifiez la ligne :

```sql
annee INTEGER := 2025; -- Changez l'année ici
```

### Changer le Format du Titre

Dans `generate-weeks-2025.sql`, modifiez la section `titre_semaine` :

```sql
-- Format actuel
titre_semaine := 'Semaine ' || semaine_num || ' - Janvier'

-- Exemples d'autres formats
titre_semaine := 'S' || semaine_num || ' - Janvier 2025'
titre_semaine := 'Semaine du ' || TO_CHAR(date_debut, 'DD/MM')
titre_semaine := TO_CHAR(date_debut, 'Month YYYY')
```

---

## 📊 Vérification

### Voir toutes les semaines créées

```sql
SELECT 
  order_index,
  title,
  TO_CHAR(start_date, 'DD/MM/YYYY') as debut,
  TO_CHAR(end_date, 'DD/MM/YYYY') as fin
FROM weeks
WHERE EXTRACT(YEAR FROM start_date) = 2025
ORDER BY start_date;
```

### Compter les semaines

```sql
SELECT COUNT(*) FROM weeks WHERE EXTRACT(YEAR FROM start_date) = 2025;
```

**Résultat attendu** : 52

---

## 🔄 Régénération

### Supprimer les semaines existantes

Si vous voulez recommencer :

```sql
DELETE FROM weeks WHERE EXTRACT(YEAR FROM start_date) = 2025;
```

Puis réexécutez le script de génération.

---

## 📅 Calendrier 2025

### Premier lundi de 2025
**6 janvier 2025**

### Semaines importantes

| Semaine | Dates | Événement |
|---------|-------|-----------|
| 1 | 06/01 - 12/01 | Début d'année |
| 14 | 31/03 - 06/04 | Pâques 2025 |
| 26 | 23/06 - 29/06 | Milieu d'année |
| 52 | 22/12 - 28/12 | Noël |

---

## 🎯 Avantages

### Pour les Admins
✅ **Gain de temps** : Plus besoin de créer les semaines manuellement  
✅ **Cohérence** : Toutes les semaines commencent le lundi  
✅ **Planification** : Toute l'année est planifiée d'avance  
✅ **Automatisation** : Un seul script pour tout créer  

### Pour les Membres
✅ **Clarté** : Savoir exactement quand commence chaque semaine  
✅ **Régularité** : Rythme hebdomadaire constant  
✅ **Anticipation** : Voir les semaines à venir  

---

## 🛠️ Scripts Disponibles

### 1. `generate-weeks-2025.sql` ⭐ Recommandé
- Génère 52 semaines pour 2025
- Titres avec le mois
- Prêt à l'emploi

### 2. `generate-weeks-for-year.sql`
- Génère pour n'importe quelle année
- Plus flexible
- Nécessite de changer l'année

---

## 💡 Utilisation Avancée

### Générer pour plusieurs années

```sql
DO $$
DECLARE
  annee INTEGER;
  premier_lundi DATE;
  semaine_num INTEGER;
  date_debut DATE;
  date_fin DATE;
BEGIN
  -- Boucle sur 3 années
  FOR annee IN 2025..2027 LOOP
    -- Trouver le premier lundi de l'année
    premier_lundi := DATE_TRUNC('year', (annee || '-01-01')::DATE);
    WHILE EXTRACT(DOW FROM premier_lundi) != 1 LOOP
      premier_lundi := premier_lundi + INTERVAL '1 day';
    END LOOP;
    
    -- Générer 52 semaines
    FOR semaine_num IN 1..52 LOOP
      date_debut := premier_lundi + (semaine_num - 1) * INTERVAL '7 days';
      date_fin := date_debut + INTERVAL '6 days';
      
      INSERT INTO weeks (title, description, start_date, end_date, order_index)
      VALUES (
        'Semaine ' || semaine_num || ' - ' || annee,
        'Du ' || TO_CHAR(date_debut, 'DD/MM/YYYY') || ' au ' || TO_CHAR(date_fin, 'DD/MM/YYYY'),
        date_debut,
        date_fin,
        semaine_num + ((annee - 2025) * 52)
      )
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;
```

---

## ❓ Questions Fréquentes

### Pourquoi 52 semaines et pas 53 ?

Certaines années ont 53 semaines, mais 52 est le standard. Vous pouvez modifier le script pour générer 53 semaines si nécessaire.

### Que se passe-t-il si j'exécute le script deux fois ?

Le script utilise `ON CONFLICT DO NOTHING`, donc il ne créera pas de doublons.

### Puis-je modifier les semaines après création ?

Oui ! Vous pouvez modifier les titres, descriptions, dates via le panneau admin.

### Comment supprimer une semaine ?

Via le panneau admin ou avec SQL :
```sql
DELETE FROM weeks WHERE id = 'uuid-de-la-semaine';
```

---

## 🎓 Exemple Complet

### Scénario : Planifier l'année 2025

1. **Générer les semaines**
   ```sql
   -- Exécuter generate-weeks-2025.sql
   ```

2. **Vérifier**
   ```sql
   SELECT COUNT(*) FROM weeks WHERE EXTRACT(YEAR FROM start_date) = 2025;
   -- Résultat : 52
   ```

3. **Ajouter des chapitres**
   - Via le panneau admin
   - Associer chaque chapitre à une semaine

4. **Les membres voient**
   - Plan d'étude avec toutes les semaines
   - Chapitres organisés par semaine
   - Progression claire

---

## ✅ Résumé

**Pour créer automatiquement les semaines de 2025** :

1. Ouvrez **Supabase SQL Editor**
2. Exécutez **`generate-weeks-2025.sql`**
3. ✅ **52 semaines créées !**
4. Ajoutez des chapitres via le panneau admin
5. Les membres peuvent commencer l'étude !

---

**Toutes les semaines de l'année créées en 1 clic ! 📅**

*"Il y a un temps pour tout, un temps pour toute chose sous les cieux." - Ecclésiaste 3:1* 🙏⏰✨
