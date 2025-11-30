# 🤝 Guide de Contribution

Merci de votre intérêt pour améliorer cette application d'étude biblique ! Ce guide vous aidera à contribuer efficacement.

## 🎯 Types de Contributions

Nous acceptons plusieurs types de contributions :

- 🐛 **Corrections de bugs**
- ✨ **Nouvelles fonctionnalités**
- 📝 **Améliorations de la documentation**
- 🎨 **Améliorations du design/UX**
- ⚡ **Optimisations de performance**
- 🌍 **Traductions**
- 🧪 **Tests**

## 🚀 Démarrage Rapide

### 1. Fork et Clone

```bash
# Fork le projet sur GitHub, puis :
git clone https://github.com/votre-username/bible-study-app.git
cd bible-study-app
```

### 2. Installation

```bash
npm install
```

### 3. Configuration

Copiez `.env.example` vers `.env` et configurez vos variables Supabase.

### 4. Lancer en développement

```bash
npm run dev
```

## 📋 Workflow de Contribution

### 1. Créer une branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-bug
```

### 2. Faire vos modifications

- Écrivez du code propre et lisible
- Suivez les conventions de code existantes
- Commentez les parties complexes
- Testez vos modifications

### 3. Commit

Utilisez des messages de commit clairs :

```bash
git commit -m "feat: ajoute la fonctionnalité de recherche de chapitres"
git commit -m "fix: corrige l'affichage des commentaires"
git commit -m "docs: met à jour le README"
```

**Convention des commits** :
- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage, point-virgules manquants, etc.
- `refactor:` Refactorisation du code
- `test:` Ajout de tests
- `chore:` Maintenance

### 4. Push et Pull Request

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

Créez ensuite une Pull Request sur GitHub avec :
- Un titre descriptif
- Une description détaillée des changements
- Des captures d'écran si pertinent
- Référence aux issues liées

## 🎨 Standards de Code

### React/JavaScript

```javascript
// ✅ BON
const MyComponent = ({ user, onSubmit }) => {
  const [loading, setLoading] = useState(false)
  
  const handleClick = async () => {
    setLoading(true)
    try {
      await onSubmit()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Chargement...' : 'Soumettre'}
    </button>
  )
}

// ❌ MAUVAIS
const MyComponent = (props) => {
  const [loading, setLoading] = useState(false)
  
  return (
    <button onClick={() => {
      setLoading(true)
      props.onSubmit()
      setLoading(false)
    }}>
      Soumettre
    </button>
  )
}
```

### Conventions de Nommage

- **Composants** : PascalCase (`UserProfile.jsx`)
- **Fonctions** : camelCase (`fetchUserData`)
- **Constantes** : UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Fichiers** : kebab-case pour les utilitaires (`date-utils.js`)

### TailwindCSS

```jsx
// ✅ BON - Classes organisées
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <span className="text-lg font-semibold text-gray-900">Titre</span>
  <button className="btn-primary">Action</button>
</div>

// ❌ MAUVAIS - Classes désorganisées
<div className="p-4 flex shadow-md bg-white items-center rounded-lg justify-between">
  <span className="font-semibold text-gray-900 text-lg">Titre</span>
  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg">Action</button>
</div>
```

### Gestion d'État

```javascript
// ✅ BON - État local pour UI, Context pour global
const Chapter = () => {
  const { user } = useAuth() // Context pour auth
  const [comments, setComments] = useState([]) // État local pour données
  
  useEffect(() => {
    fetchComments()
  }, [])
  
  return <div>...</div>
}

// ❌ MAUVAIS - Prop drilling excessif
const App = () => {
  const [user, setUser] = useState(null)
  return <Dashboard user={user} setUser={setUser} />
}
```

## 🗂️ Structure des Fichiers

### Nouveau Composant

```
src/components/
└── MonComposant/
    ├── MonComposant.jsx      # Composant principal
    ├── MonComposant.test.jsx # Tests (optionnel)
    └── index.js              # Export
```

### Nouvelle Page

```
src/pages/
└── MaPage.jsx
```

## 🧪 Tests

### Tests Unitaires (À venir)

```javascript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Dashboard from './Dashboard'

describe('Dashboard', () => {
  it('affiche le message de bienvenue', () => {
    render(<Dashboard />)
    expect(screen.getByText(/Bienvenue/i)).toBeInTheDocument()
  })
})
```

### Tests Manuels

Avant de soumettre une PR, testez :

1. ✅ Connexion/Déconnexion
2. ✅ Navigation entre pages
3. ✅ Création de commentaires
4. ✅ Passage de quiz
5. ✅ Responsive (mobile, tablette, desktop)
6. ✅ Permissions (user vs admin)

## 📝 Documentation

### Commenter le Code

```javascript
// ✅ BON - Commentaire utile
// Fetch comments with nested replies for better UX
const fetchComments = async () => {
  const { data } = await supabase
    .from('comments')
    .select('*, replies(*)')
  return data
}

// ❌ MAUVAIS - Commentaire inutile
// This function fetches comments
const fetchComments = async () => {
  return await supabase.from('comments').select('*')
}
```

### Mettre à Jour la Documentation

Si vous ajoutez une fonctionnalité, mettez à jour :
- `README.md` - Vue d'ensemble
- `FEATURES.md` - Détails de la fonctionnalité
- `ARCHITECTURE.md` - Si changement architectural

## 🐛 Signaler un Bug

### Template de Bug Report

```markdown
**Description**
Description claire et concise du bug.

**Étapes pour Reproduire**
1. Aller sur '...'
2. Cliquer sur '...'
3. Voir l'erreur

**Comportement Attendu**
Ce qui devrait se passer.

**Comportement Actuel**
Ce qui se passe réellement.

**Captures d'écran**
Si applicable.

**Environnement**
- OS: [e.g. Windows 11]
- Navigateur: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Logs**
Copier les erreurs de la console (F12).
```

## ✨ Proposer une Fonctionnalité

### Template de Feature Request

```markdown
**Problème à Résoudre**
Quel problème cette fonctionnalité résout-elle ?

**Solution Proposée**
Comment devrait-elle fonctionner ?

**Alternatives Considérées**
Autres approches possibles.

**Contexte Additionnel**
Captures d'écran, mockups, etc.
```

## 🔍 Code Review

Votre PR sera examinée selon ces critères :

- ✅ **Fonctionnalité** : Fonctionne comme prévu
- ✅ **Code Quality** : Propre, lisible, maintenable
- ✅ **Performance** : Pas de régression
- ✅ **Sécurité** : Pas de failles introduites
- ✅ **Tests** : Fonctionnalité testée
- ✅ **Documentation** : Mise à jour si nécessaire

## 🎯 Priorités Actuelles

### High Priority
- [ ] Tests unitaires et d'intégration
- [ ] Système de notifications
- [ ] Recherche de chapitres
- [ ] Mode hors ligne

### Medium Priority
- [ ] Groupes d'étude privés
- [ ] Export PDF
- [ ] Thème sombre
- [ ] Traductions (EN, ES)

### Low Priority
- [ ] Application mobile
- [ ] Méditations audio
- [ ] Intégration calendrier

## 💬 Communication

### Où Poser des Questions ?

- **GitHub Issues** : Bugs et fonctionnalités
- **GitHub Discussions** : Questions générales
- **Email** : Pour les questions privées

### Code of Conduct

- 🤝 Soyez respectueux et bienveillant
- 💡 Accueillez les nouvelles idées
- 🎯 Restez concentré sur l'objectif
- 🙏 Rappelez-vous : c'est un projet spirituel

## 🎁 Reconnaissance

Tous les contributeurs seront mentionnés dans :
- Le fichier `CONTRIBUTORS.md`
- Les release notes
- La page "À propos" de l'application

## 📚 Ressources Utiles

- [Documentation React](https://react.dev)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation TailwindCSS](https://tailwindcss.com/docs)
- [Guide Git](https://git-scm.com/doc)

## ❓ Questions Fréquentes

### Comment tester les fonctionnalités admin ?

```sql
-- Dans Supabase SQL Editor
UPDATE profiles SET role = 'admin' WHERE email = 'votre@email.com';
```

### Comment réinitialiser la base de données ?

1. Supprimez toutes les tables dans Supabase
2. Ré-exécutez `supabase-schema.sql`
3. Optionnellement, exécutez `sample-data.sql`

### Puis-je utiliser une autre base de données ?

Oui, mais vous devrez :
1. Adapter les requêtes Supabase
2. Implémenter l'authentification
3. Gérer les permissions manuellement

---

**Merci de contribuer à ce projet qui aide les gens à grandir dans leur foi ! 🙏**

*"Que tout se fasse pour l'édification" - 1 Corinthiens 14:26*
