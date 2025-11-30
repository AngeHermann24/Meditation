import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { BookOpen, CheckCircle, MessageCircle, Heart, Flame, ThumbsUp, Send } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import MeditationResponseForm from '../components/MeditationResponseForm'

const Chapter = () => {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const [chapter, setChapter] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChapterData()
  }, [id, user])

  const fetchChapterData = async () => {
    try {
      // Fetch chapter
      const { data: chapterData, error: chapterError } = await supabase
        .from('chapters')
        .select('*, weeks(*)')
        .eq('id', id)
        .single()

      if (chapterError) throw chapterError
      setChapter(chapterData)

      // Check if completed
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('chapter_id', id)
        .single()

      setIsCompleted(progressData?.completed || false)

      // Fetch comments
      await fetchComments()
    } catch (error) {
      console.error('Error fetching chapter:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles (full_name, role),
        reactions (type, user_id)
      `)
      .eq('chapter_id', id)
      .is('parent_id', null)
      .order('created_at', { ascending: false })

    if (!error) {
      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        data.map(async (comment) => {
          const { data: replies } = await supabase
            .from('comments')
            .select('*, profiles (full_name, role)')
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true })
          
          return { ...comment, replies: replies || [] }
        })
      )
      setComments(commentsWithReplies)
    }
  }

  const toggleComplete = async () => {
    try {
      if (isCompleted) {
        await supabase
          .from('user_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('chapter_id', id)
      } else {
        await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            chapter_id: id,
            completed: true
          })
      }
      setIsCompleted(!isCompleted)
    } catch (error) {
      console.error('Error toggling completion:', error)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          chapter_id: id,
          user_id: user.id,
          content: newComment,
          parent_id: replyTo
        })

      if (error) throw error

      setNewComment('')
      setReplyTo(null)
      await fetchComments()
    } catch (error) {
      console.error('Error posting comment:', error)
    }
  }

  const handleReaction = async (commentId, reactionType) => {
    try {
      // Check if already reacted
      const { data: existing } = await supabase
        .from('reactions')
        .select('*')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .eq('type', reactionType)
        .single()

      if (existing) {
        // Remove reaction
        await supabase
          .from('reactions')
          .delete()
          .eq('id', existing.id)
      } else {
        // Add reaction
        await supabase
          .from('reactions')
          .insert({
            comment_id: commentId,
            user_id: user.id,
            type: reactionType
          })
      }

      await fetchComments()
    } catch (error) {
      console.error('Error handling reaction:', error)
    }
  }

  const getReactionCount = (comment, type) => {
    return comment.reactions?.filter(r => r.type === type).length || 0
  }

  const hasUserReacted = (comment, type) => {
    return comment.reactions?.some(r => r.type === type && r.user_id === user.id)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600">Chapitre non trouvé</p>
      </div>
    )
  }

  const reactionButtons = [
    { type: 'pray', icon: '🙏', label: 'Prière' },
    { type: 'fire', icon: '🔥', label: 'Puissant' },
    { type: 'like', icon: '👍', label: 'J\'aime' },
    { type: 'heart', icon: '❤️', label: 'Amour' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Chapter Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <Link to="/study-plan" className="hover:text-primary-600">
                Plan d'étude
              </Link>
              <span>/</span>
              <span>{chapter.weeks?.title}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {chapter.title}
            </h1>
            <p className="text-lg text-gray-600">
              {chapter.book} {chapter.chapter_number}
            </p>
          </div>
          
          <button
            onClick={toggleComplete}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isCompleted
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CheckCircle className={`h-5 w-5 ${isCompleted ? 'fill-current' : ''}`} />
            <span>{isCompleted ? 'Complété' : 'Marquer comme lu'}</span>
          </button>
        </div>

        {chapter.description && (
          <p className="text-gray-700 mb-4">{chapter.description}</p>
        )}

        {/* Chapter Content */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {chapter.content || 'Le contenu du chapitre sera affiché ici...'}
            </div>
          </div>
        </div>

        {/* Study Questions */}
        {chapter.study_questions && (
          <div className="mt-6 bg-primary-50 rounded-lg p-6">
            <h3 className="font-semibold text-primary-900 mb-3">
              Questions de réflexion
            </h3>
            <ul className="space-y-2">
              {chapter.study_questions.split('\n').map((question, idx) => (
                question.trim() && (
                  <li key={idx} className="text-gray-700 flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span>{question}</span>
                  </li>
                )
              ))}
            </ul>
          </div>
        )}

        {/* Meditation Guide OIA */}
        {chapter.meditation_guide && (
          <div className="mt-6 bg-gradient-to-br from-gold-50 to-primary-50 rounded-lg p-6 border-2 border-gold-200">
            <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center space-x-2">
              <span className="text-2xl">🙏</span>
              <span>Guide de Méditation OIA</span>
            </h3>
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed space-y-4">
                {chapter.meditation_guide.split('\n\n').map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    {section.split('\n').map((line, lineIdx) => {
                      const isHeader = line.startsWith('O :') || line.startsWith('I :') || line.startsWith('A :')
                      return (
                        <p key={lineIdx} className={isHeader ? 'font-bold text-lg text-primary-700 mt-4 first:mt-0' : 'text-gray-700 ml-4'}>
                          {line}
                        </p>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600 italic">
              💡 Prenez le temps de méditer sur ces questions pour approfondir votre compréhension
            </div>
          </div>
        )}

        {/* User Meditation Responses */}
        {chapter.meditation_guide && (
          <MeditationResponseForm 
            chapterId={chapter.id} 
            meditationGuide={chapter.meditation_guide}
          />
        )}
      </div>

      {/* Comments Section */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <MessageCircle className="h-6 w-6" />
          <span>Discussions ({comments.length})</span>
        </h2>

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-6">
          {replyTo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 flex items-center justify-between">
              <span className="text-sm text-blue-800">
                Répondre à un commentaire...
              </span>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Annuler
              </button>
            </div>
          )}
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                {profile?.full_name?.[0] || user.email[0].toUpperCase()}
              </div>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Partagez vos réflexions..."
                className="input-field resize-none"
                rows="3"
              />
              <div className="mt-2 flex justify-end">
                <button type="submit" className="btn-primary flex items-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Publier</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-l-2 border-gray-200 pl-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                    {comment.profiles?.full_name?.[0] || 'U'}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {comment.profiles?.full_name}
                    </span>
                    {comment.profiles?.role === 'admin' && (
                      <span className="bg-gold-100 text-gold-800 text-xs px-2 py-0.5 rounded">
                        Admin
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {format(new Date(comment.created_at), 'dd MMM à HH:mm', { locale: fr })}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                  
                  {/* Reactions */}
                  <div className="flex items-center space-x-4">
                    {reactionButtons.map((reaction) => {
                      const count = getReactionCount(comment, reaction.type)
                      const hasReacted = hasUserReacted(comment, reaction.type)
                      return (
                        <button
                          key={reaction.type}
                          onClick={() => handleReaction(comment.id, reaction.type)}
                          className={`flex items-center space-x-1 text-sm transition-colors ${
                            hasReacted
                              ? 'text-primary-600 font-medium'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <span>{reaction.icon}</span>
                          {count > 0 && <span>{count}</span>}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => setReplyTo(comment.id)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Répondre
                    </button>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm">
                              {reply.profiles?.full_name?.[0] || 'U'}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900 text-sm">
                                {reply.profiles?.full_name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {format(new Date(reply.created_at), 'dd MMM à HH:mm', { locale: fr })}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Soyez le premier à partager vos réflexions sur ce chapitre
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chapter
