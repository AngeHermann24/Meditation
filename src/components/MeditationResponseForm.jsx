import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Save, Edit2, Eye, EyeOff, Send } from 'lucide-react'

const MeditationResponseForm = ({ chapterId, meditationGuide }) => {
  const { user } = useAuth()
  const [responses, setResponses] = useState({
    observation_who: '',
    observation_what: '',
    observation_whom: '',
    observation_context: '',
    interpretation_meaning: '',
    interpretation_truth: '',
    interpretation_message: '',
    application_rhema: '',
    application_action: '',
    application_transformation: '',
    status: 'draft'
  })
  const [isEditing, setIsEditing] = useState(false)
  const [hasResponses, setHasResponses] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showResponses, setShowResponses] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    fetchResponses()
  }, [chapterId, user])

  const fetchResponses = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('meditation_responses')
        .select('*')
        .eq('user_id', user.id)
        .eq('chapter_id', chapterId)
        .single()

      if (data) {
        setResponses(data)
        setHasResponses(true)
        setShowResponses(true)
        setIsSubmitted(data.status === 'submitted')
      } else {
        setIsEditing(true)
      }
    } catch (error) {
      console.error('Error fetching responses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    setSaving(true)
    try {
      const dataToSave = {
        user_id: user.id,
        chapter_id: chapterId,
        ...responses,
        status: 'draft'
      }

      if (hasResponses) {
        // Update existing
        const { error } = await supabase
          .from('meditation_responses')
          .update(dataToSave)
          .eq('user_id', user.id)
          .eq('chapter_id', chapterId)
        
        if (error) throw error
      } else {
        // Insert new
        const { error } = await supabase
          .from('meditation_responses')
          .insert([dataToSave])
        
        if (error) throw error
        setHasResponses(true)
      }

      setIsEditing(false)
      setShowResponses(true)
      alert('✅ Brouillon sauvegardé ! Vous pourrez le modifier et le soumettre plus tard.')
    } catch (error) {
      console.error('Error saving draft:', error)
      alert('❌ Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const dataToSubmit = {
        user_id: user.id,
        chapter_id: chapterId,
        ...responses,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      }

      if (hasResponses) {
        // Update existing
        const { error } = await supabase
          .from('meditation_responses')
          .update(dataToSubmit)
          .eq('user_id', user.id)
          .eq('chapter_id', chapterId)
        
        if (error) throw error
      } else {
        // Insert new
        const { error } = await supabase
          .from('meditation_responses')
          .insert([dataToSubmit])
        
        if (error) throw error
        setHasResponses(true)
      }

      setIsEditing(false)
      setShowResponses(true)
      setIsSubmitted(true)
      alert('✅ Méditation soumise avec succès ! Votre pasteur pourra la consulter.')
    } catch (error) {
      console.error('Error submitting:', error)
      alert('❌ Erreur lors de la soumission')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Chargement...</div>
  }

  if (!meditationGuide) {
    return null
  }

  return (
    <div className="mt-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border-2 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="font-bold text-xl text-gray-900 flex items-center space-x-2">
            <span className="text-2xl">✍️</span>
            <span>Mes Réponses Personnelles</span>
          </h3>
          {hasResponses && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              isSubmitted 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isSubmitted ? '✓ Soumise' : '📝 Brouillon'}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasResponses && !isEditing && (
            <>
              <button
                onClick={() => setShowResponses(!showResponses)}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
              >
                {showResponses ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showResponses ? 'Masquer' : 'Afficher'}</span>
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-800"
              >
                <Edit2 className="h-4 w-4" />
                <span>Modifier</span>
              </button>
            </>
          )}
        </div>
      </div>

      {(!hasResponses || isEditing) && (
        <div className="bg-white rounded-lg p-5 shadow-sm space-y-6">
          {/* Observation */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-primary-700">O : Observation</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                De qui parle le texte ?
              </label>
              <textarea
                value={responses.observation_who}
                onChange={(e) => setResponses({ ...responses, observation_who: e.target.value })}
                className="input-field resize-none"
                rows="2"
                placeholder="Identifiez les personnages principaux..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                De quoi parle le texte ?
              </label>
              <textarea
                value={responses.observation_what}
                onChange={(e) => setResponses({ ...responses, observation_what: e.target.value })}
                className="input-field resize-none"
                rows="2"
                placeholder="Quel est le sujet principal ?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                À qui le texte s'adresse-t-il ?
              </label>
              <textarea
                value={responses.observation_whom}
                onChange={(e) => setResponses({ ...responses, observation_whom: e.target.value })}
                className="input-field resize-none"
                rows="2"
                placeholder="Qui est l'audience ?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Que se passe-t-il ? (contexte, actions, mots importants)
              </label>
              <textarea
                value={responses.observation_context}
                onChange={(e) => setResponses({ ...responses, observation_context: e.target.value })}
                className="input-field resize-none"
                rows="3"
                placeholder="Décrivez le contexte et les événements..."
              />
            </div>
          </div>

          {/* Interprétation */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h4 className="font-bold text-lg text-primary-700">I : Interprétation</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qu'est-ce que ce texte veut dire ?
              </label>
              <textarea
                value={responses.interpretation_meaning}
                onChange={(e) => setResponses({ ...responses, interpretation_meaning: e.target.value })}
                className="input-field resize-none"
                rows="3"
                placeholder="Quelle est la signification du texte ?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quelle vérité spirituelle se dégage ?
              </label>
              <textarea
                value={responses.interpretation_truth}
                onChange={(e) => setResponses({ ...responses, interpretation_truth: e.target.value })}
                className="input-field resize-none"
                rows="3"
                placeholder="Quelle leçon spirituelle apprenez-vous ?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qu'est-ce que je comprends du message de Dieu ici ?
              </label>
              <textarea
                value={responses.interpretation_message}
                onChange={(e) => setResponses({ ...responses, interpretation_message: e.target.value })}
                className="input-field resize-none"
                rows="3"
                placeholder="Que vous révèle Dieu à travers ce texte ?"
              />
            </div>
          </div>

          {/* Application */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h4 className="font-bold text-lg text-primary-700">A : Application</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rhéma : Qu'est-ce que Dieu me dit personnellement aujourd'hui ?
              </label>
              <textarea
                value={responses.application_rhema}
                onChange={(e) => setResponses({ ...responses, application_rhema: e.target.value })}
                className="input-field resize-none"
                rows="3"
                placeholder="Quelle parole personnelle Dieu vous adresse-t-il ?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quelle action concrète dois-je poser en réponse à ce que j'ai reçu ?
              </label>
              <textarea
                value={responses.application_action}
                onChange={(e) => setResponses({ ...responses, application_action: e.target.value })}
                className="input-field resize-none"
                rows="3"
                placeholder="Quelle action allez-vous entreprendre ?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment ce texte transforme ma manière de penser, parler ou agir ?
              </label>
              <textarea
                value={responses.application_transformation}
                onChange={(e) => setResponses({ ...responses, application_transformation: e.target.value })}
                className="input-field resize-none"
                rows="3"
                placeholder="Comment ce texte va-t-il changer votre vie ?"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            {hasResponses && (
              <button
                onClick={() => {
                  setIsEditing(false)
                  fetchResponses()
                }}
                className="btn-secondary"
              >
                Annuler
              </button>
            )}
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="btn-secondary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Sauvegarde...' : 'Sauvegarder brouillon'}</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="btn-primary flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{saving ? 'Soumission...' : 'Soumettre ma méditation'}</span>
            </button>
          </div>
        </div>
      )}

      {hasResponses && !isEditing && showResponses && (
        <div className="bg-white rounded-lg p-5 shadow-sm space-y-6">
          {/* Display saved responses */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-primary-700">O : Observation</h4>
            {responses.observation_who && (
              <div>
                <p className="text-sm font-medium text-gray-600">De qui parle le texte ?</p>
                <p className="text-gray-800 mt-1">{responses.observation_who}</p>
              </div>
            )}
            {responses.observation_what && (
              <div>
                <p className="text-sm font-medium text-gray-600">De quoi parle le texte ?</p>
                <p className="text-gray-800 mt-1">{responses.observation_what}</p>
              </div>
            )}
            {responses.observation_whom && (
              <div>
                <p className="text-sm font-medium text-gray-600">À qui le texte s'adresse-t-il ?</p>
                <p className="text-gray-800 mt-1">{responses.observation_whom}</p>
              </div>
            )}
            {responses.observation_context && (
              <div>
                <p className="text-sm font-medium text-gray-600">Que se passe-t-il ?</p>
                <p className="text-gray-800 mt-1">{responses.observation_context}</p>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h4 className="font-bold text-lg text-primary-700">I : Interprétation</h4>
            {responses.interpretation_meaning && (
              <div>
                <p className="text-sm font-medium text-gray-600">Qu'est-ce que ce texte veut dire ?</p>
                <p className="text-gray-800 mt-1">{responses.interpretation_meaning}</p>
              </div>
            )}
            {responses.interpretation_truth && (
              <div>
                <p className="text-sm font-medium text-gray-600">Quelle vérité spirituelle se dégage ?</p>
                <p className="text-gray-800 mt-1">{responses.interpretation_truth}</p>
              </div>
            )}
            {responses.interpretation_message && (
              <div>
                <p className="text-sm font-medium text-gray-600">Qu'est-ce que je comprends du message de Dieu ?</p>
                <p className="text-gray-800 mt-1">{responses.interpretation_message}</p>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h4 className="font-bold text-lg text-primary-700">A : Application</h4>
            {responses.application_rhema && (
              <div>
                <p className="text-sm font-medium text-gray-600">Rhéma : Qu'est-ce que Dieu me dit personnellement ?</p>
                <p className="text-gray-800 mt-1">{responses.application_rhema}</p>
              </div>
            )}
            {responses.application_action && (
              <div>
                <p className="text-sm font-medium text-gray-600">Quelle action concrète dois-je poser ?</p>
                <p className="text-gray-800 mt-1">{responses.application_action}</p>
              </div>
            )}
            {responses.application_transformation && (
              <div>
                <p className="text-sm font-medium text-gray-600">Comment ce texte transforme ma vie ?</p>
                <p className="text-gray-800 mt-1">{responses.application_transformation}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!hasResponses && !isEditing && (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Vous n'avez pas encore répondu aux questions de méditation</p>
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            Commencer ma méditation
          </button>
        </div>
      )}
    </div>
  )
}

export default MeditationResponseForm
