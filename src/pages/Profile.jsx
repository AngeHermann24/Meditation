import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Calendar, Award, BookOpen, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const Profile = () => {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({
    chaptersRead: 0,
    quizzesTaken: 0,
    averageScore: 0,
    commentsPosted: 0,
    joinedDate: null
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      fetchUserStats()
    }
  }, [user, profile])

  const fetchUserStats = async () => {
    try {
      // Chapters read
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)

      // Quiz attempts
      const { data: quizData } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user.id)

      const avgScore = quizData?.length
        ? quizData.reduce((acc, q) => acc + q.score, 0) / quizData.length
        : 0

      // Comments
      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Recent activity
      const { data: recentProgress } = await supabase
        .from('user_progress')
        .select('*, chapters(title, book, chapter_number)')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('completed_at', { ascending: false })
        .limit(5)

      setStats({
        chaptersRead: progressData?.length || 0,
        quizzesTaken: quizData?.length || 0,
        averageScore: Math.round(avgScore),
        commentsPosted: commentsCount || 0,
        joinedDate: profile?.created_at
      })

      setRecentActivity(recentProgress || [])
    } catch (error) {
      console.error('Error fetching user stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)

      if (error) throw error
      
      setEditing(false)
      alert('Profil mis à jour avec succès !')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Erreur lors de la mise à jour du profil')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white text-3xl font-bold">
              {profile?.full_name?.[0] || user.email[0].toUpperCase()}
            </div>
            <div>
              {editing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-2">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-field"
                    placeholder="Nom complet"
                  />
                  <div className="flex space-x-2">
                    <button type="submit" className="btn-primary text-sm">
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false)
                        setFullName(profile?.full_name || '')
                      }}
                      className="btn-secondary text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile?.full_name || 'Utilisateur'}
                  </h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    {stats.joinedDate && (
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          Membre depuis {format(new Date(stats.joinedDate), 'MMMM yyyy', { locale: fr })}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-secondary">
              Modifier
            </button>
          )}
        </div>

        {profile?.role === 'admin' && (
          <div className="mt-4 inline-flex items-center space-x-2 bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-sm font-medium">
            <Award className="h-4 w-4" />
            <span>Administrateur</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Chapitres lus</p>
              <p className="text-2xl font-bold text-gray-900">{stats.chaptersRead}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-gold-100 p-3 rounded-lg">
              <Award className="h-6 w-6 text-gold-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Quiz complétés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.quizzesTaken}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Score moyen</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Commentaires</p>
              <p className="text-2xl font-bold text-gray-900">{stats.commentsPosted}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Activité récente</h2>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {activity.chapters?.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.chapters?.book} {activity.chapters?.chapter_number}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {format(new Date(activity.completed_at), 'dd MMM yyyy', { locale: fr })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucune activité récente
          </div>
        )}
      </div>

      {/* Achievements (Future feature) */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Badges et récompenses</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.chaptersRead >= 10 && (
            <div className="text-center p-4 bg-gold-50 rounded-lg">
              <div className="text-4xl mb-2">📖</div>
              <p className="text-sm font-medium text-gray-900">Lecteur assidu</p>
              <p className="text-xs text-gray-600">10+ chapitres lus</p>
            </div>
          )}
          {stats.quizzesTaken >= 5 && (
            <div className="text-center p-4 bg-gold-50 rounded-lg">
              <div className="text-4xl mb-2">🏆</div>
              <p className="text-sm font-medium text-gray-900">Champion</p>
              <p className="text-xs text-gray-600">5+ quiz complétés</p>
            </div>
          )}
          {stats.averageScore >= 80 && (
            <div className="text-center p-4 bg-gold-50 rounded-lg">
              <div className="text-4xl mb-2">⭐</div>
              <p className="text-sm font-medium text-gray-900">Expert</p>
              <p className="text-xs text-gray-600">Score moyen 80%+</p>
            </div>
          )}
          {stats.commentsPosted >= 10 && (
            <div className="text-center p-4 bg-gold-50 rounded-lg">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-sm font-medium text-gray-900">Contributeur</p>
              <p className="text-xs text-gray-600">10+ commentaires</p>
            </div>
          )}
        </div>
        {stats.chaptersRead < 10 && stats.quizzesTaken < 5 && stats.averageScore < 80 && stats.commentsPosted < 10 && (
          <div className="text-center py-8 text-gray-500">
            Continuez à étudier pour débloquer des badges !
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
