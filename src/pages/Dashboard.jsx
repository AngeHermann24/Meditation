import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { BookOpen, Users, TrendingUp, Calendar, MessageCircle, Award } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const Dashboard = () => {
  const { user, profile } = useAuth()
  const [currentWeek, setCurrentWeek] = useState(null)
  const [verseOfDay, setVerseOfDay] = useState(null)
  const [stats, setStats] = useState({
    chaptersRead: 0,
    totalChapters: 0,
    quizScore: 0,
    groupProgress: 0
  })
  const [recentComments, setRecentComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch current week
      const { data: weekData } = await supabase
        .from('weeks')
        .select('*, chapters(*)')
        .gte('end_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(1)
        .single()

      setCurrentWeek(weekData)

      // Fetch verse of the day
      const { data: verseData } = await supabase
        .from('daily_verses')
        .select('*')
        .eq('date', format(new Date(), 'yyyy-MM-dd'))
        .single()

      setVerseOfDay(verseData)

      // Fetch user progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)

      // Fetch total chapters
      const { count: totalChapters } = await supabase
        .from('chapters')
        .select('*', { count: 'exact', head: true })

      // Calculate stats
      const chaptersRead = progressData?.filter(p => p.completed).length || 0
      
      // Fetch quiz scores
      const { data: quizData } = await supabase
        .from('quiz_attempts')
        .select('score')
        .eq('user_id', user.id)

      const avgScore = quizData?.length 
        ? quizData.reduce((acc, q) => acc + q.score, 0) / quizData.length 
        : 0

      // Fetch group progress
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const { count: activeUsers } = await supabase
        .from('user_progress')
        .select('user_id', { count: 'exact', head: true })
        .eq('completed', true)

      const groupProgress = totalUsers ? (activeUsers / totalUsers) * 100 : 0

      setStats({
        chaptersRead,
        totalChapters: totalChapters || 0,
        quizScore: Math.round(avgScore),
        groupProgress: Math.round(groupProgress)
      })

      // Fetch recent comments
      const { data: commentsData } = await supabase
        .from('comments')
        .select('*, profiles(full_name), chapters(title)')
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentComments(commentsData || [])

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Bienvenue, {profile?.full_name || 'Frère/Sœur'} ! 🙏
        </h1>
        <p className="text-primary-100">
          Que la grâce et la paix vous soient données de la part de Dieu notre Père.
        </p>
      </div>

      {/* Verse of the Day */}
      {verseOfDay && (
        <div className="card border-l-4 border-gold-500">
          <div className="flex items-start space-x-3">
            <BookOpen className="h-6 w-6 text-gold-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Verset du jour</h3>
              <p className="text-gray-700 italic mb-2">"{verseOfDay.text}"</p>
              <p className="text-sm text-gray-500">{verseOfDay.reference}</p>
            </div>
          </div>
        </div>
      )}

      {/* Current Week */}
      {currentWeek && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Chapitre de la semaine</h2>
            <span className="text-sm text-gray-500">
              {format(new Date(currentWeek.start_date), 'dd MMM', { locale: fr })} - 
              {format(new Date(currentWeek.end_date), 'dd MMM yyyy', { locale: fr })}
            </span>
          </div>
          <div className="bg-primary-50 rounded-lg p-4">
            <h3 className="font-semibold text-primary-900 mb-2">{currentWeek.title}</h3>
            <p className="text-gray-700 mb-4">{currentWeek.description}</p>
            <div className="space-y-2">
              {currentWeek.chapters?.map((chapter) => (
                <Link
                  key={chapter.id}
                  to={`/chapter/${chapter.id}`}
                  className="block bg-white rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{chapter.title}</span>
                    <span className="text-sm text-primary-600">Lire →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Chapitres lus</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.chaptersRead}/{stats.totalChapters}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-gold-100 p-3 rounded-lg">
              <Award className="h-6 w-6 text-gold-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Score moyen</p>
              <p className="text-2xl font-bold text-gray-900">{stats.quizScore}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Progression</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((stats.chaptersRead / stats.totalChapters) * 100)}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Groupe actif</p>
              <p className="text-2xl font-bold text-gray-900">{stats.groupProgress}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Comments */}
      {recentComments.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <MessageCircle className="h-6 w-6" />
            <span>Discussions récentes</span>
          </h2>
          <div className="space-y-4">
            {recentComments.map((comment) => (
              <div key={comment.id} className="border-l-2 border-primary-200 pl-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">
                    {comment.profiles?.full_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(comment.created_at), 'dd MMM HH:mm', { locale: fr })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{comment.content}</p>
                <Link
                  to={`/chapter/${comment.chapter_id}`}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  {comment.chapters?.title} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
