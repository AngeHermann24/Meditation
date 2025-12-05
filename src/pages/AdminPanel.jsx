import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Edit, Trash2, Users, BookOpen, MessageCircle, Calendar, X } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Week Form Modal Component
const WeekFormModal = ({ week, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: week?.title || '',
    description: week?.description || '',
    start_date: week?.start_date || '',
    end_date: week?.end_date || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (week) {
        // Update existing week
        const { error } = await supabase
          .from('weeks')
          .update(formData)
          .eq('id', week.id)
        if (error) throw error
      } else {
        // Create new week
        const { error } = await supabase
          .from('weeks')
          .insert([formData])
        if (error) throw error
      }
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {week ? 'Modifier' : 'Créer'} une semaine
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Ex: Semaine 1 - Les Béatitudes"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field resize-none"
                rows="3"
                placeholder="Décrivez le thème de cette semaine..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début *
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin *
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="btn-secondary">
                Annuler
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Chapter Form Modal Component
const ChapterFormModal = ({ chapter, weeks, onClose, onSuccess }) => {
  // Template par défaut pour le guide de méditation
  const defaultMeditationGuide = `O : Observation
De qui parle le texte ?
De quoi parle le texte ?
À qui le texte s'adresse-t-il ?
Que se passe-t-il ? (contexte, actions, mots importants)

I : Interprétation
Qu'est-ce que ce texte veut dire ?
Quelle vérité spirituelle se dégage ?
Qu'est-ce que je comprends du message de Dieu ici ?

A : Application
Rhéma : Qu'est-ce que Dieu me dit personnellement aujourd'hui ?
Quelle action concrète dois-je poser en réponse à ce que j'ai reçu ?
Comment ce texte transforme ma manière de penser, parler ou agir ?`

  const [formData, setFormData] = useState({
    week_id: chapter?.week_id || '',
    title: chapter?.title || '',
    book: chapter?.book || '',
    chapter_number: chapter?.chapter_number || '',
    description: chapter?.description || '',
    content: chapter?.content || '',
    study_questions: chapter?.study_questions || '',
    meditation_guide: chapter?.meditation_guide || defaultMeditationGuide,
    order_index: chapter?.order_index || 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (chapter) {
        // Update existing chapter
        const { error } = await supabase
          .from('chapters')
          .update(formData)
          .eq('id', chapter.id)
        if (error) throw error
      } else {
        // Create new chapter
        const { error } = await supabase
          .from('chapters')
          .insert([formData])
        if (error) throw error
      }
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {chapter ? 'Modifier' : 'Créer'} un chapitre
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semaine *
                </label>
                <select
                  value={formData.week_id}
                  onChange={(e) => setFormData({ ...formData, week_id: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Sélectionnez une semaine</option>
                  {weeks.map((week) => (
                    <option key={week.id} value={week.id}>
                      {week.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Ex: Les Béatitudes - Partie 1"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Livre biblique *
                </label>
                <input
                  type="text"
                  value={formData.book}
                  onChange={(e) => setFormData({ ...formData, book: e.target.value })}
                  className="input-field"
                  placeholder="Ex: Matthieu"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro du chapitre *
                </label>
                <input
                  type="number"
                  value={formData.chapter_number}
                  onChange={(e) => setFormData({ ...formData, chapter_number: parseInt(e.target.value) })}
                  className="input-field"
                  placeholder="Ex: 5"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field resize-none"
                rows="2"
                placeholder="Courte description du chapitre..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu biblique *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="input-field resize-none"
                rows="10"
                placeholder="Collez ici le texte biblique complet..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Questions de réflexion
              </label>
              <textarea
                value={formData.study_questions}
                onChange={(e) => setFormData({ ...formData, study_questions: e.target.value })}
                className="input-field resize-none"
                rows="4"
                placeholder="Une question par ligne...&#10;Ex: Que signifie être pauvre en esprit ?&#10;Comment pouvons-nous être des artisans de paix ?"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Guide de Méditation OIA (Observation, Interprétation, Application)
                </label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, meditation_guide: defaultMeditationGuide })}
                  className="text-xs text-primary-600 hover:text-primary-800 underline"
                >
                  Réinitialiser au template
                </button>
              </div>
              <textarea
                value={formData.meditation_guide}
                onChange={(e) => setFormData({ ...formData, meditation_guide: e.target.value })}
                className="input-field resize-none font-mono text-sm"
                rows="12"
                placeholder="O : Observation&#10;De qui parle le texte ?&#10;De quoi parle le texte ?&#10;À qui le texte s'adresse-t-il ?&#10;Que se passe-t-il ? (contexte, actions, mots importants)&#10;&#10;I : Interprétation&#10;Qu'est-ce que ce texte veut dire ?&#10;Quelle vérité spirituelle se dégage ?&#10;Qu'est-ce que je comprends du message de Dieu ici ?&#10;&#10;A : Application&#10;Rhéma : Qu'est-ce que Dieu me dit personnellement aujourd'hui ?&#10;Quelle action concrète dois-je poser en réponse à ce que j'ai reçu ?&#10;Comment ce texte transforme ma manière de penser, parler ou agir ?"
              />
              <div className="mt-2 flex items-start space-x-2">
                <p className="text-sm text-gray-500">
                  💡 <strong>Remplissage automatique :</strong> Le template OIA est déjà pré-rempli. Vous pouvez le personnaliser selon le chapitre ou le laisser tel quel.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="btn-secondary">
                Annuler
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Quiz Form Modal Component
const QuizFormModal = ({ quiz, weeks, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    week_id: quiz?.week_id || '',
    title: quiz?.title || '',
    description: quiz?.description || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (quiz) {
        // Update existing quiz
        const { error } = await supabase
          .from('quizzes')
          .update(formData)
          .eq('id', quiz.id)
        if (error) throw error
      } else {
        // Create new quiz
        const { error } = await supabase
          .from('quizzes')
          .insert([formData])
        if (error) throw error
      }
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {quiz ? 'Modifier' : 'Créer'} un quiz
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semaine *
              </label>
              <select
                value={formData.week_id}
                onChange={(e) => setFormData({ ...formData, week_id: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Sélectionnez une semaine</option>
                {weeks.map((week) => (
                  <option key={week.id} value={week.id}>
                    {week.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Ex: Quiz - Les Béatitudes"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field resize-none"
                rows="3"
                placeholder="Testez votre compréhension du chapitre..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Astuce :</strong> Après avoir créé le quiz, vous pourrez ajouter des questions dans l'onglet "Quiz" en cliquant sur "Modifier".
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="btn-secondary">
                Annuler
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('weeks')
  const [weeks, setWeeks] = useState([])
  const [chapters, setChapters] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [users, setUsers] = useState([])
  const [comments, setComments] = useState([])
  const [meditations, setMeditations] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    // Toujours charger les semaines pour les formulaires
    if (activeTab !== 'weeks' && weeks.length === 0) {
      fetchWeeks()
    }
  }, [activeTab])

  const fetchWeeks = async () => {
    const { data } = await supabase
      .from('weeks')
      .select('*')
      .order('start_date', { ascending: false })
    setWeeks(data || [])
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'weeks') {
        const { data } = await supabase
          .from('weeks')
          .select('*, chapters(count)')
          .order('start_date', { ascending: false })
        setWeeks(data || [])
      } else if (activeTab === 'chapters') {
        const { data } = await supabase
          .from('chapters')
          .select('*, weeks(title)')
          .order('created_at', { ascending: false })
        setChapters(data || [])
      } else if (activeTab === 'quizzes') {
        const { data } = await supabase
          .from('quizzes')
          .select('*, weeks(title), quiz_questions(count)')
          .order('created_at', { ascending: false })
        setQuizzes(data || [])
      } else if (activeTab === 'users') {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
        setUsers(data || [])
      } else if (activeTab === 'comments') {
        const { data } = await supabase
          .from('comments')
          .select('*, profiles(full_name), chapters(title)')
          .order('created_at', { ascending: false })
          .limit(50)
        setComments(data || [])
      } else if (activeTab === 'meditations') {
        const { data, error } = await supabase
          .from('meditation_responses')
          .select('*, profiles(full_name, email), chapters(title, book, chapter_number)')
          .order('created_at', { ascending: false })
          .limit(100)
        
        if (error) {
          console.error('Erreur lors du chargement des méditations:', error)
          alert('Erreur: ' + error.message)
        }
        
        setMeditations(data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (table, id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return

    try {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleDeleteComment = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return

    try {
      const { error } = await supabase.from('comments').delete().eq('id', id)
      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const openModal = (type, item = null) => {
    setModalType(type)
    setEditingItem(item)
    setShowModal(true)
  }

  const tabs = [
    { id: 'weeks', label: 'Semaines', icon: Calendar },
    { id: 'chapters', label: 'Chapitres', icon: BookOpen },
    { id: 'quizzes', label: 'Quiz', icon: BookOpen },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'comments', label: 'Commentaires', icon: MessageCircle },
    { id: 'meditations', label: 'Méditations', icon: BookOpen },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Panneau d'administration</h1>
      </div>

      {/* Tabs */}
      <div className="card overflow-hidden">
        <div className="flex space-x-1 border-b border-gray-200 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-3 border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium text-sm sm:text-base">{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {/* Weeks Tab */}
              {activeTab === 'weeks' && (
                <div className="space-y-4">
                  <button
                    onClick={() => openModal('week')}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Nouvelle semaine</span>
                  </button>

                  <div className="space-y-3">
                    {weeks.map((week) => (
                      <div key={week.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{week.title}</h3>
                          <p className="text-sm text-gray-600">{week.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(week.start_date), 'dd MMM', { locale: fr })} - 
                            {format(new Date(week.end_date), 'dd MMM yyyy', { locale: fr })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 self-end sm:self-center">
                          <button
                            onClick={() => openModal('week', week)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete('weeks', week.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chapters Tab */}
              {activeTab === 'chapters' && (
                <div className="space-y-4">
                  <button
                    onClick={() => openModal('chapter')}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Nouveau chapitre</span>
                  </button>

                  <div className="space-y-3">
                    {chapters.map((chapter) => (
                      <div key={chapter.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
                          <p className="text-sm text-gray-600">
                            {chapter.book} {chapter.chapter_number}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Semaine: {chapter.weeks?.title || 'Non assigné'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 self-end sm:self-center">
                          <button
                            onClick={() => openModal('chapter', chapter)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete('chapters', chapter.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quizzes Tab */}
              {activeTab === 'quizzes' && (
                <div className="space-y-4">
                  <button
                    onClick={() => openModal('quiz')}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Nouveau quiz</span>
                  </button>

                  <div className="space-y-3">
                    {quizzes.map((quiz) => (
                      <div key={quiz.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                          <p className="text-sm text-gray-600">{quiz.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Semaine: {quiz.weeks?.title || 'Non assigné'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openModal('quiz', quiz)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete('quizzes', quiz.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                          {user.full_name?.[0] || 'U'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.full_name || 'Sans nom'}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            Inscrit le {format(new Date(user.created_at), 'dd MMM yyyy', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-gold-100 text-gold-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comments Tab */}
              {activeTab === 'comments' && (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {comment.profiles?.full_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(comment.created_at), 'dd MMM à HH:mm', { locale: fr })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">{comment.content}</p>
                        <p className="text-xs text-gray-500">
                          Sur: {comment.chapters?.title}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded flex-shrink-0"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Meditations Tab */}
              {activeTab === 'meditations' && (
                <div className="space-y-4">
                  {meditations.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Aucune méditation pour le moment
                    </div>
                  )}
                  {meditations.map((meditation) => (
                    <div key={meditation.id} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-bold text-gray-900">
                              {meditation.profiles?.full_name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({meditation.profiles?.email})
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              meditation.status === 'submitted' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {meditation.status === 'submitted' ? '✓ Soumise' : '📝 Brouillon'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Chapitre: {meditation.chapters?.book} {meditation.chapters?.chapter_number} - {meditation.chapters?.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            Créée le {format(new Date(meditation.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                            {meditation.submitted_at && (
                              <span> • Soumise le {format(new Date(meditation.submitted_at), 'dd MMM yyyy à HH:mm', { locale: fr })}</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 space-y-4">
                        {/* Observation */}
                        {(meditation.observation_who || meditation.observation_what || meditation.observation_whom || meditation.observation_context) && (
                          <div>
                            <h4 className="font-bold text-primary-700 mb-2">O : Observation</h4>
                            <div className="space-y-2 text-sm">
                              {meditation.observation_who && (
                                <div>
                                  <span className="font-medium text-gray-600">De qui parle le texte ?</span>
                                  <p className="text-gray-800 ml-4">{meditation.observation_who}</p>
                                </div>
                              )}
                              {meditation.observation_what && (
                                <div>
                                  <span className="font-medium text-gray-600">De quoi parle le texte ?</span>
                                  <p className="text-gray-800 ml-4">{meditation.observation_what}</p>
                                </div>
                              )}
                              {meditation.observation_whom && (
                                <div>
                                  <span className="font-medium text-gray-600">À qui le texte s'adresse-t-il ?</span>
                                  <p className="text-gray-800 ml-4">{meditation.observation_whom}</p>
                                </div>
                              )}
                              {meditation.observation_context && (
                                <div>
                                  <span className="font-medium text-gray-600">Que se passe-t-il ?</span>
                                  <p className="text-gray-800 ml-4">{meditation.observation_context}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Interprétation */}
                        {(meditation.interpretation_meaning || meditation.interpretation_truth || meditation.interpretation_message) && (
                          <div className="pt-3 border-t border-gray-200">
                            <h4 className="font-bold text-primary-700 mb-2">I : Interprétation</h4>
                            <div className="space-y-2 text-sm">
                              {meditation.interpretation_meaning && (
                                <div>
                                  <span className="font-medium text-gray-600">Qu'est-ce que ce texte veut dire ?</span>
                                  <p className="text-gray-800 ml-4">{meditation.interpretation_meaning}</p>
                                </div>
                              )}
                              {meditation.interpretation_truth && (
                                <div>
                                  <span className="font-medium text-gray-600">Quelle vérité spirituelle se dégage ?</span>
                                  <p className="text-gray-800 ml-4">{meditation.interpretation_truth}</p>
                                </div>
                              )}
                              {meditation.interpretation_message && (
                                <div>
                                  <span className="font-medium text-gray-600">Qu'est-ce que je comprends du message de Dieu ?</span>
                                  <p className="text-gray-800 ml-4">{meditation.interpretation_message}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Application */}
                        {(meditation.application_rhema || meditation.application_action || meditation.application_transformation) && (
                          <div className="pt-3 border-t border-gray-200">
                            <h4 className="font-bold text-primary-700 mb-2">A : Application</h4>
                            <div className="space-y-2 text-sm">
                              {meditation.application_rhema && (
                                <div>
                                  <span className="font-medium text-gray-600">Rhéma : Qu'est-ce que Dieu me dit personnellement ?</span>
                                  <p className="text-gray-800 ml-4">{meditation.application_rhema}</p>
                                </div>
                              )}
                              {meditation.application_action && (
                                <div>
                                  <span className="font-medium text-gray-600">Quelle action concrète dois-je poser ?</span>
                                  <p className="text-gray-800 ml-4">{meditation.application_action}</p>
                                </div>
                              )}
                              {meditation.application_transformation && (
                                <div>
                                  <span className="font-medium text-gray-600">Comment ce texte transforme ma vie ?</span>
                                  <p className="text-gray-800 ml-4">{meditation.application_transformation}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showModal && modalType === 'week' && (
        <WeekFormModal
          week={editingItem}
          onClose={() => {
            setShowModal(false)
            setEditingItem(null)
          }}
          onSuccess={() => {
            fetchData()
            setShowModal(false)
            setEditingItem(null)
          }}
        />
      )}

      {showModal && modalType === 'chapter' && (
        <ChapterFormModal
          chapter={editingItem}
          weeks={weeks}
          onClose={() => {
            setShowModal(false)
            setEditingItem(null)
          }}
          onSuccess={() => {
            fetchData()
            setShowModal(false)
            setEditingItem(null)
          }}
        />
      )}

      {showModal && modalType === 'quiz' && (
        <QuizFormModal
          quiz={editingItem}
          weeks={weeks}
          onClose={() => {
            setShowModal(false)
            setEditingItem(null)
          }}
          onSuccess={() => {
            fetchData()
            setShowModal(false)
            setEditingItem(null)
          }}
        />
      )}
    </div>
  )
}

export default AdminPanel
