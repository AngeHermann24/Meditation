import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Calendar, BookOpen, CheckCircle, Circle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const StudyPlan = () => {
  const { user } = useAuth()
  const [weeks, setWeeks] = useState([])
  const [userProgress, setUserProgress] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudyPlan()
  }, [user])

  const fetchStudyPlan = async () => {
    try {
      // Fetch all weeks with chapters
      const { data: weeksData, error: weeksError } = await supabase
        .from('weeks')
        .select(`
          *,
          chapters (
            id,
            title,
            book,
            chapter_number,
            order_index
          )
        `)
        .order('start_date', { ascending: true })

      if (weeksError) throw weeksError

      // Fetch user progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)

      if (progressError) throw progressError

      // Create progress map
      const progressMap = {}
      progressData?.forEach(p => {
        progressMap[p.chapter_id] = p.completed
      })

      setWeeks(weeksData || [])
      setUserProgress(progressMap)
    } catch (error) {
      console.error('Error fetching study plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const getWeekProgress = (chapters) => {
    if (!chapters || chapters.length === 0) return 0
    const completed = chapters.filter(ch => userProgress[ch.id]).length
    return Math.round((completed / chapters.length) * 100)
  }

  const isCurrentWeek = (week) => {
    const now = new Date()
    const start = new Date(week.start_date)
    const end = new Date(week.end_date)
    return now >= start && now <= end
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plan d'étude biblique</h1>
          <p className="text-gray-600 mt-2">
            Suivez votre progression dans l'étude de la Parole de Dieu
          </p>
        </div>
      </div>

      {weeks.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun plan d'étude disponible
          </h3>
          <p className="text-gray-600">
            Les administrateurs n'ont pas encore créé de plan d'étude.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {weeks.map((week) => {
            const progress = getWeekProgress(week.chapters)
            const isCurrent = isCurrentWeek(week)
            
            return (
              <div
                key={week.id}
                className={`card ${isCurrent ? 'border-2 border-primary-500 shadow-lg' : ''}`}
              >
                {isCurrent && (
                  <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium inline-block mb-3">
                    Semaine en cours
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {week.title}
                    </h2>
                    <p className="text-gray-600 mb-3">{week.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(week.start_date), 'dd MMM', { locale: fr })} - 
                          {format(new Date(week.end_date), 'dd MMM yyyy', { locale: fr })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{week.chapters?.length || 0} chapitres</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-3xl font-bold text-primary-600">
                      {progress}%
                    </div>
                    <div className="text-xs text-gray-500">Complété</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Chapters List */}
                {week.chapters && week.chapters.length > 0 && (
                  <div className="space-y-2">
                    {week.chapters
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((chapter) => (
                        <Link
                          key={chapter.id}
                          to={`/chapter/${chapter.id}`}
                          className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                            {userProgress[chapter.id] ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400" />
                            )}
                            <div>
                              <div className="font-medium text-gray-900">
                                {chapter.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {chapter.book} {chapter.chapter_number}
                              </div>
                            </div>
                          </div>
                          <span className="text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            Lire →
                          </span>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StudyPlan
