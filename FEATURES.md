# 📋 Guide des Fonctionnalités

## 🔐 Authentification

### Connexion par Email/Mot de passe
- Inscription avec nom complet, email et mot de passe
- Connexion sécurisée
- Vérification par email (optionnelle)
- Réinitialisation de mot de passe

### Connexion Google OAuth
- Connexion en un clic avec Google
- Synchronisation automatique du profil
- Pas besoin de créer un mot de passe

## 📊 Dashboard (Tableau de Bord)

### Vue d'ensemble
- Message de bienvenue personnalisé
- Verset du jour avec référence biblique
- Chapitre de la semaine en cours
- Statistiques personnelles

### Statistiques affichées
- **Chapitres lus** : Nombre total de chapitres complétés
- **Score moyen** : Performance moyenne aux quiz
- **Progression** : Pourcentage de complétion du plan
- **Groupe actif** : Pourcentage de membres actifs

### Discussions récentes
- Aperçu des 5 derniers commentaires
- Lien direct vers les chapitres commentés
- Nom de l'auteur et date

## 📚 Plan d'Étude

### Organisation
- Semaines organisées chronologiquement
- Indication de la semaine en cours
- Barre de progression par semaine
- Nombre de chapitres par semaine

### Chapitres
- Titre et référence biblique
- Statut : Lu ✓ ou Non lu ○
- Ordre personnalisable par l'admin
- Lien direct vers le contenu

### Progression
- Pourcentage de complétion par semaine
- Suivi visuel avec barre de progression
- Statistiques globales

## 📖 Page Chapitre

### Contenu
- Titre et référence biblique
- Texte biblique complet
- Description et contexte
- Questions de réflexion

### Interaction
- Bouton "Marquer comme lu"
- Statut sauvegardé automatiquement
- Navigation entre chapitres

### Discussions
- **Commentaires principaux**
  - Ajout de nouveaux commentaires
  - Avatar avec initiales
  - Date et heure de publication
  - Badge "Admin" pour les administrateurs

- **Réponses**
  - Répondre à un commentaire
  - Fil de discussion organisé
  - Indentation visuelle

- **Réactions**
  - 🙏 Prière
  - 🔥 Puissant
  - 👍 J'aime
  - ❤️ Amour
  - Compteur de réactions
  - Une réaction par type par utilisateur

## 🎯 Quiz

### Fonctionnement
- Questions à choix multiples (4 options)
- Une seule bonne réponse par question
- Navigation question par question
- Barre de progression

### Passage du quiz
1. Sélectionner une réponse
2. Cliquer sur "Suivant"
3. Répéter pour toutes les questions
4. Cliquer sur "Terminer"

### Résultats
- Score en pourcentage
- Nombre de bonnes réponses
- Détail question par question
- Indication des bonnes/mauvaises réponses
- Possibilité de réessayer

### Historique
- Toutes les tentatives sauvegardées
- Calcul du score moyen
- Visible dans le profil

## 👤 Profil Utilisateur

### Informations
- Avatar avec initiales
- Nom complet (modifiable)
- Email
- Date d'inscription
- Badge admin (si applicable)

### Statistiques personnelles
- Chapitres lus
- Quiz complétés
- Score moyen
- Nombre de commentaires

### Activité récente
- Liste des 5 derniers chapitres lus
- Date de complétion
- Référence biblique

### Badges et récompenses
- 📖 **Lecteur assidu** : 10+ chapitres lus
- 🏆 **Champion** : 5+ quiz complétés
- ⭐ **Expert** : Score moyen 80%+
- 💬 **Contributeur** : 10+ commentaires

## 🛡️ Panneau Administrateur

### Gestion des Semaines
- **Créer** une nouvelle semaine
  - Titre
  - Description
  - Date de début
  - Date de fin
- **Modifier** une semaine existante
- **Supprimer** une semaine
- Voir le nombre de chapitres par semaine

### Gestion des Chapitres
- **Créer** un nouveau chapitre
  - Titre
  - Livre biblique
  - Numéro de chapitre
  - Contenu (texte biblique)
  - Description
  - Questions de réflexion
  - Ordre d'affichage
  - Association à une semaine
- **Modifier** un chapitre
- **Supprimer** un chapitre
- Voir la semaine associée

### Gestion des Quiz
- **Créer** un quiz
  - Titre
  - Description
  - Association à une semaine
- **Ajouter des questions**
  - Question
  - 4 options de réponse
  - Indication de la bonne réponse
  - Ordre des questions
- **Modifier** quiz et questions
- **Supprimer** quiz
- Voir le nombre de questions

### Gestion des Utilisateurs
- Liste de tous les utilisateurs
- Informations : nom, email, date d'inscription
- Rôle (user/admin)
- Possibilité de promouvoir en admin (via SQL)

### Modération des Commentaires
- Liste des commentaires récents
- Auteur et date
- Chapitre associé
- **Supprimer** les commentaires inappropriés
- Voir le contenu complet

## 🔔 Notifications (À venir)

### Types de notifications prévus
- Nouveau chapitre disponible
- Nouveau commentaire sur un chapitre suivi
- Réponse à votre commentaire
- Nouveau quiz disponible
- Rappel de lecture hebdomadaire

## 📱 Responsive Design

### Mobile
- Interface adaptée aux petits écrans
- Navigation simplifiée
- Boutons tactiles optimisés
- Texte lisible

### Tablette
- Mise en page optimisée
- Grille adaptative
- Meilleure utilisation de l'espace

### Desktop
- Expérience complète
- Sidebar de navigation
- Grilles multi-colonnes
- Espacement généreux

## 🎨 Personnalisation

### Couleurs
- **Primary (Bleu)** : Navigation, boutons principaux
- **Gold (Or)** : Accents, badges admin
- **Vert** : Succès, complétion
- **Rouge** : Erreurs, suppression

### Thème
- Dégradés doux
- Ombres subtiles
- Coins arrondis
- Animations fluides

## 🔒 Sécurité

### Row Level Security (RLS)
- Chaque utilisateur ne voit que ses données
- Les admins ont des permissions étendues
- Impossible de modifier les données d'autres utilisateurs

### Permissions
- **Utilisateur standard** :
  - Lire tout le contenu
  - Créer ses propres commentaires
  - Marquer sa progression
  - Passer des quiz
  - Modifier son profil

- **Administrateur** :
  - Toutes les permissions utilisateur
  - Créer/modifier/supprimer semaines
  - Créer/modifier/supprimer chapitres
  - Créer/modifier/supprimer quiz
  - Modérer les commentaires
  - Voir tous les utilisateurs

## 📈 Métriques et Analytics

### Pour les utilisateurs
- Progression personnelle
- Score moyen aux quiz
- Nombre de chapitres lus
- Activité récente

### Pour les admins
- Taux d'engagement global
- Chapitres les plus lus
- Quiz les plus réussis
- Utilisateurs les plus actifs

## 🚀 Fonctionnalités Futures

### Court terme
- [ ] Recherche de chapitres
- [ ] Filtres par livre biblique
- [ ] Export de notes personnelles
- [ ] Favoris/Signets

### Moyen terme
- [ ] Groupes d'étude privés
- [ ] Chat en temps réel
- [ ] Notifications push
- [ ] Mode hors ligne

### Long terme
- [ ] Application mobile native
- [ ] Méditations audio
- [ ] Vidéos d'enseignement
- [ ] Calendrier d'événements
- [ ] Partage sur réseaux sociaux

## 💡 Bonnes Pratiques

### Pour les membres
1. Lisez régulièrement les chapitres de la semaine
2. Participez aux discussions
3. Soyez respectueux dans les commentaires
4. Passez les quiz pour valider votre compréhension
5. Encouragez les autres membres

### Pour les administrateurs
1. Planifiez les semaines à l'avance
2. Créez des questions de réflexion pertinentes
3. Modérez avec bienveillance
4. Encouragez la participation
5. Ajoutez régulièrement des versets du jour
6. Variez les livres bibliques étudiés

## 🆘 Support

Pour toute question sur les fonctionnalités :
1. Consultez ce guide
2. Consultez le README.md
3. Consultez le QUICK_START.md
4. Contactez votre administrateur

---

**"Que la parole de Christ habite parmi vous abondamment" - Colossiens 3:16**
