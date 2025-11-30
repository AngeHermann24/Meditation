# 📖 Application d'Étude Biblique - Plateforme Collaborative

Une application web moderne permettant aux membres d'une église d'étudier la Bible ensemble, de partager leurs réflexions et de suivre leur progression spirituelle.

## ✨ Fonctionnalités

### Pour les Membres
- 🔐 **Authentification** : Connexion par email/mot de passe ou Google
- 📚 **Plan d'étude hebdomadaire** : Chapitres organisés par semaine
- 💬 **Discussions** : Commentaires et réponses sur chaque chapitre
- 🎯 **Quiz** : Questions pour valider la compréhension
- 📊 **Progression** : Suivi personnel et statistiques de groupe
- 🏆 **Badges** : Récompenses pour encourager l'engagement
- 📖 **Verset du jour** : Inspiration quotidienne

### Pour les Administrateurs
- 📅 **Gestion des semaines** : Créer et organiser le plan d'étude
- 📝 **Gestion des chapitres** : Ajouter du contenu biblique
- ❓ **Création de quiz** : Questions à choix multiples
- 👥 **Gestion des utilisateurs** : Vue d'ensemble de la communauté
- 🛡️ **Modération** : Gérer les commentaires

## 🛠️ Technologies Utilisées

- **Frontend** : React 18 + Vite
- **Routing** : React Router v6
- **Styling** : TailwindCSS
- **Backend** : Supabase (PostgreSQL)
- **Auth** : Supabase Auth
- **Icons** : Lucide React
- **Dates** : date-fns

## 📋 Prérequis

- Node.js 16+ et npm
- Un compte Supabase (gratuit)

## 🚀 Installation

### 1. Cloner le projet

```bash
cd bible-study-app
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer Supabase

1. Créez un compte sur [Supabase](https://supabase.com)
2. Créez un nouveau projet
3. Copiez l'URL et la clé anonyme du projet

### 4. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase
```

### 5. Créer les tables dans Supabase

Allez dans l'éditeur SQL de Supabase et exécutez le script suivant :

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Weeks table
CREATE TABLE weeks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Chapters table
CREATE TABLE chapters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  week_id UUID REFERENCES weeks ON DELETE CASCADE,
  title TEXT NOT NULL,
  book TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  content TEXT,
  description TEXT,
  study_questions TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- User Progress table
CREATE TABLE user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  chapter_id UUID REFERENCES chapters ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, chapter_id)
);

-- Comments table
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  chapter_id UUID REFERENCES chapters ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES comments ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Reactions table
CREATE TABLE reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  comment_id UUID REFERENCES comments ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pray', 'fire', 'like', 'heart')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(comment_id, user_id, type)
);

-- Quizzes table
CREATE TABLE quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  week_id UUID REFERENCES weeks ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Quiz Questions table
CREATE TABLE quiz_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer INTEGER NOT NULL CHECK (correct_answer BETWEEN 0 AND 3),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Quiz Attempts table
CREATE TABLE quiz_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  answers JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Daily Verses table
CREATE TABLE daily_verses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  text TEXT NOT NULL,
  reference TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_chapters_week_id ON chapters(week_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_chapter_id ON user_progress(chapter_id);
CREATE INDEX idx_comments_chapter_id ON comments(chapter_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_reactions_comment_id ON reactions(comment_id);
CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_verses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Weeks policies
CREATE POLICY "Weeks are viewable by everyone" ON weeks FOR SELECT USING (true);
CREATE POLICY "Only admins can insert weeks" ON weeks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can update weeks" ON weeks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can delete weeks" ON weeks FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Chapters policies
CREATE POLICY "Chapters are viewable by everyone" ON chapters FOR SELECT USING (true);
CREATE POLICY "Only admins can insert chapters" ON chapters FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can update chapters" ON chapters FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can delete chapters" ON chapters FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- User Progress policies
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress" ON user_progress FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments or admins can delete any" ON comments FOR DELETE USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Reactions policies
CREATE POLICY "Reactions are viewable by everyone" ON reactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reactions" ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON reactions FOR DELETE USING (auth.uid() = user_id);

-- Quizzes policies
CREATE POLICY "Quizzes are viewable by everyone" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Only admins can manage quizzes" ON quizzes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Quiz Questions policies
CREATE POLICY "Quiz questions are viewable by everyone" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Only admins can manage quiz questions" ON quiz_questions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Quiz Attempts policies
CREATE POLICY "Users can view own attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily Verses policies
CREATE POLICY "Daily verses are viewable by everyone" ON daily_verses FOR SELECT USING (true);
CREATE POLICY "Only admins can manage daily verses" ON daily_verses FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weeks_updated_at BEFORE UPDATE ON weeks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 6. Créer un utilisateur admin (optionnel)

Après avoir créé votre premier compte via l'application, exécutez dans Supabase SQL Editor :

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'votre@email.com';
```

### 7. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 📁 Structure du Projet

```
bible-study-app/
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Layout principal avec navigation
│   ├── contexts/
│   │   └── AuthContext.jsx     # Gestion de l'authentification
│   ├── lib/
│   │   └── supabase.js         # Configuration Supabase
│   ├── pages/
│   │   ├── Login.jsx           # Page de connexion/inscription
│   │   ├── Dashboard.jsx       # Tableau de bord
│   │   ├── StudyPlan.jsx       # Plan d'étude
│   │   ├── Chapter.jsx         # Détails d'un chapitre
│   │   ├── Quiz.jsx            # Interface de quiz
│   │   ├── Profile.jsx         # Profil utilisateur
│   │   └── AdminPanel.jsx      # Panneau d'administration
│   ├── App.jsx                 # Routes et configuration
│   ├── main.jsx               # Point d'entrée
│   └── index.css              # Styles globaux
├── .env                        # Variables d'environnement
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Design

L'application utilise une palette de couleurs spirituelle et apaisante :
- **Bleu** (Primary) : Confiance, paix, spiritualité
- **Or** (Gold) : Divin, précieux, sagesse
- **Blanc** : Pureté, clarté
- Interface moderne et épurée avec TailwindCSS

## 🔐 Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Authentification sécurisée via Supabase Auth
- Permissions basées sur les rôles (user/admin)
- Protection CSRF intégrée

## 📊 Base de Données

### Tables Principales

1. **profiles** : Profils utilisateurs
2. **weeks** : Semaines d'étude
3. **chapters** : Chapitres bibliques
4. **user_progress** : Progression des utilisateurs
5. **comments** : Commentaires et discussions
6. **reactions** : Réactions aux commentaires
7. **quizzes** : Quiz hebdomadaires
8. **quiz_questions** : Questions de quiz
9. **quiz_attempts** : Tentatives de quiz
10. **daily_verses** : Versets du jour

## 🚀 Fonctionnalités Futures

- [ ] Notifications push
- [ ] Mode hors ligne
- [ ] Export PDF des études
- [ ] Partage sur réseaux sociaux
- [ ] Application mobile (React Native)
- [ ] Groupes d'étude privés
- [ ] Calendrier d'événements
- [ ] Méditations audio/vidéo

## 🤝 Contribution

Ce projet est conçu pour votre église. N'hésitez pas à l'adapter selon vos besoins !

## 📝 Licence

Ce projet est libre d'utilisation pour votre communauté.

## 💡 Support

Pour toute question ou amélioration, contactez votre administrateur système.

---

**"Ta parole est une lampe à mes pieds, Et une lumière sur mon sentier." - Psaume 119:105**
