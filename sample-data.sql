-- ============================================
-- DONNÉES D'EXEMPLE POUR TESTER L'APPLICATION
-- ============================================
-- Exécutez ce script après avoir créé le schéma principal

-- Semaines d'étude
INSERT INTO weeks (title, description, start_date, end_date) VALUES
('Semaine 1 - Les Béatitudes', 'Découverte du Sermon sur la Montagne et des Béatitudes', '2025-01-06', '2025-01-12'),
('Semaine 2 - L''Amour du Prochain', 'Comprendre l''amour selon Jésus', '2025-01-13', '2025-01-19'),
('Semaine 3 - La Foi', 'Qu''est-ce que la foi véritable ?', '2025-01-20', '2025-01-26'),
('Semaine 4 - La Prière', 'Apprendre à prier selon la volonté de Dieu', '2025-01-27', '2025-02-02');

-- Chapitres pour la Semaine 1
INSERT INTO chapters (week_id, title, book, chapter_number, description, content, study_questions, meditation_guide, order_index)
SELECT 
  w.id,
  'Les Béatitudes - Partie 1',
  'Matthieu',
  5,
  'Introduction aux Béatitudes et aux premiers enseignements de Jésus',
  'Voyant la foule, Jésus monta sur la montagne; et, après qu''il se fut assis, ses disciples s''approchèrent de lui. Puis, ayant ouvert la bouche, il les enseigna, et dit:

Heureux les pauvres en esprit, car le royaume des cieux est à eux!
Heureux les affligés, car ils seront consolés!
Heureux les débonnaires, car ils hériteront la terre!
Heureux ceux qui ont faim et soif de la justice, car ils seront rassasiés!
Heureux les miséricordieux, car ils obtiendront miséricorde!
Heureux ceux qui ont le cœur pur, car ils verront Dieu!
Heureux ceux qui procurent la paix, car ils seront appelés fils de Dieu!
Heureux ceux qui sont persécutés pour la justice, car le royaume des cieux est à eux!

Heureux serez-vous, lorsqu''on vous outragera, qu''on vous persécutera et qu''on dira faussement de vous toute sorte de mal, à cause de moi. Réjouissez-vous et soyez dans l''allégresse, parce que votre récompense sera grande dans les cieux; car c''est ainsi qu''on a persécuté les prophètes qui ont été avant vous.',
  'Que signifie être "pauvre en esprit" ?
Pourquoi Jésus dit-il que les affligés seront consolés ?
Comment pouvons-nous être des artisans de paix dans notre quotidien ?
Quelle béatitude vous parle le plus et pourquoi ?',
  'O : Observation
De qui parle le texte ? Jésus s''adresse à ses disciples et à la foule
De quoi parle le texte ? Des béatitudes - les attitudes qui rendent heureux selon Dieu
À qui le texte s''adresse-t-il ? À tous ceux qui veulent suivre Jésus
Que se passe-t-il ? Jésus enseigne sur la montagne, décrivant 9 béatitudes qui renversent les valeurs du monde

I : Interprétation
Qu''est-ce que ce texte veut dire ? Le bonheur véritable ne vient pas de la richesse, du pouvoir ou du confort, mais d''une relation juste avec Dieu
Quelle vérité spirituelle se dégage ? Dieu bénit ceux qui reconnaissent leur besoin de Lui et vivent selon Ses valeurs
Qu''est-ce que je comprends du message de Dieu ici ? Les valeurs du Royaume de Dieu sont à l''opposé des valeurs du monde

A : Application
Rhéma : Qu''est-ce que Dieu me dit personnellement aujourd''hui ? Quelle béatitude résonne particulièrement dans ma vie actuelle ?
Quelle action concrète dois-je poser en réponse à ce que j''ai reçu ? Identifier un domaine où je dois adopter l''attitude d''une béatitude
Comment ce texte transforme ma manière de penser, parler ou agir ? Chercher le bonheur dans les choses de Dieu plutôt que dans les choses du monde',
  1
FROM weeks w WHERE w.title = 'Semaine 1 - Les Béatitudes';

INSERT INTO chapters (week_id, title, book, chapter_number, description, content, study_questions, order_index)
SELECT 
  w.id,
  'Le Sel et la Lumière',
  'Matthieu',
  5,
  'Jésus nous appelle à être le sel de la terre et la lumière du monde',
  'Vous êtes le sel de la terre. Mais si le sel perd sa saveur, avec quoi la lui rendra-t-on? Il ne sert plus qu''à être jeté dehors, et foulé aux pieds par les hommes.

Vous êtes la lumière du monde. Une ville située sur une montagne ne peut être cachée; et on n''allume pas une lampe pour la mettre sous le boisseau, mais on la met sur le chandelier, et elle éclaire tous ceux qui sont dans la maison.

Que votre lumière luise ainsi devant les hommes, afin qu''ils voient vos bonnes œuvres, et qu''ils glorifient votre Père qui est dans les cieux.',
  'Que signifie être le sel de la terre aujourd''hui ?
Comment pouvons-nous être lumière dans notre environnement ?
Quelles "bonnes œuvres" pouvons-nous faire pour glorifier Dieu ?',
  2
FROM weeks w WHERE w.title = 'Semaine 1 - Les Béatitudes';

-- Chapitres pour la Semaine 2
INSERT INTO chapters (week_id, title, book, chapter_number, description, content, study_questions, order_index)
SELECT 
  w.id,
  'Le Plus Grand Commandement',
  'Matthieu',
  22,
  'Jésus révèle le commandement le plus important',
  'Les pharisiens, ayant appris qu''il avait réduit au silence les sadducéens, se rassemblèrent, et l''un d''eux, docteur de la loi, lui fit cette question, pour l''éprouver: Maître, quel est le plus grand commandement de la loi?

Jésus lui répondit: Tu aimeras le Seigneur, ton Dieu, de tout ton cœur, de toute ton âme, et de toute ta pensée. C''est le premier et le plus grand commandement.

Et voici le second, qui lui est semblable: Tu aimeras ton prochain comme toi-même. De ces deux commandements dépendent toute la loi et les prophètes.',
  'Comment aimer Dieu de tout son cœur dans la vie quotidienne ?
Qui est notre "prochain" selon Jésus ?
Comment ces deux commandements sont-ils liés ?',
  1
FROM weeks w WHERE w.title = 'Semaine 2 - L''Amour du Prochain';

-- Versets du jour
INSERT INTO daily_verses (date, text, reference) VALUES
(CURRENT_DATE, 'Ta parole est une lampe à mes pieds, Et une lumière sur mon sentier.', 'Psaume 119:105'),
(CURRENT_DATE + INTERVAL '1 day', 'Car Dieu a tant aimé le monde qu''il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu''il ait la vie éternelle.', 'Jean 3:16'),
(CURRENT_DATE + INTERVAL '2 days', 'Je puis tout par celui qui me fortifie.', 'Philippiens 4:13'),
(CURRENT_DATE + INTERVAL '3 days', 'L''Éternel est mon berger: je ne manquerai de rien.', 'Psaume 23:1'),
(CURRENT_DATE + INTERVAL '4 days', 'Cherchez premièrement le royaume et la justice de Dieu; et toutes ces choses vous seront données par-dessus.', 'Matthieu 6:33'),
(CURRENT_DATE + INTERVAL '5 days', 'Confie-toi en l''Éternel de tout ton cœur, Et ne t''appuie pas sur ta sagesse.', 'Proverbes 3:5'),
(CURRENT_DATE + INTERVAL '6 days', 'Car mes pensées ne sont pas vos pensées, Et vos voies ne sont pas mes voies, Dit l''Éternel.', 'Ésaïe 55:8');

-- Quiz pour la Semaine 1
INSERT INTO quizzes (week_id, title, description)
SELECT 
  w.id,
  'Quiz - Les Béatitudes',
  'Testez votre compréhension du Sermon sur la Montagne'
FROM weeks w WHERE w.title = 'Semaine 1 - Les Béatitudes';

-- Questions du quiz
INSERT INTO quiz_questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, order_index)
SELECT 
  q.id,
  'Selon Matthieu 5, qui héritera la terre ?',
  'Les pauvres en esprit',
  'Les débonnaires',
  'Les miséricordieux',
  'Les affligés',
  1,
  1
FROM quizzes q WHERE q.title = 'Quiz - Les Béatitudes';

INSERT INTO quiz_questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, order_index)
SELECT 
  q.id,
  'Jésus dit que nous sommes le sel de la terre et...',
  'Le pain du monde',
  'La lumière du monde',
  'L''eau vive',
  'Le rocher',
  1,
  2
FROM quizzes q WHERE q.title = 'Quiz - Les Béatitudes';

INSERT INTO quiz_questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, order_index)
SELECT 
  q.id,
  'Pourquoi devons-nous laisser briller notre lumière ?',
  'Pour être admirés',
  'Pour montrer notre supériorité',
  'Pour que les hommes glorifient notre Père céleste',
  'Pour avoir une bonne réputation',
  2,
  3
FROM quizzes q WHERE q.title = 'Quiz - Les Béatitudes';

INSERT INTO quiz_questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, order_index)
SELECT 
  q.id,
  'Qui sont ceux qui verront Dieu selon les Béatitudes ?',
  'Les pauvres en esprit',
  'Ceux qui ont le cœur pur',
  'Les miséricordieux',
  'Les artisans de paix',
  1,
  4
FROM quizzes q WHERE q.title = 'Quiz - Les Béatitudes';

-- Quiz pour la Semaine 2
INSERT INTO quizzes (week_id, title, description)
SELECT 
  w.id,
  'Quiz - L''Amour',
  'Testez votre compréhension du commandement de l''amour'
FROM weeks w WHERE w.title = 'Semaine 2 - L''Amour du Prochain';

INSERT INTO quiz_questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, order_index)
SELECT 
  q.id,
  'Quel est le plus grand commandement selon Jésus ?',
  'Ne pas tuer',
  'Aimer Dieu de tout son cœur',
  'Honorer ses parents',
  'Observer le sabbat',
  1,
  1
FROM quizzes q WHERE q.title = 'Quiz - L''Amour';

INSERT INTO quiz_questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, order_index)
SELECT 
  q.id,
  'Le second commandement est semblable au premier. Lequel est-ce ?',
  'Tu ne voleras point',
  'Tu aimeras ton prochain comme toi-même',
  'Tu ne mentiras point',
  'Tu sanctifieras le jour du Seigneur',
  1,
  2
FROM quizzes q WHERE q.title = 'Quiz - L''Amour';

-- ============================================
-- NOTES
-- ============================================
-- Après avoir exécuté ce script :
-- 1. Vous aurez 4 semaines d'étude
-- 2. 3 chapitres bibliques avec contenu
-- 3. 7 versets du jour
-- 4. 2 quiz avec 6 questions au total
-- 
-- Vous pouvez maintenant :
-- - Créer un compte utilisateur
-- - Le promouvoir en admin : UPDATE profiles SET role = 'admin' WHERE email = 'votre@email.com';
-- - Tester toutes les fonctionnalités de l'application
