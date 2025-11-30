import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Trophy, CheckCircle, XCircle, ArrowRight } from 'lucide-react'

const Quiz = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuiz()
  }, [id])

  const fetchQuiz = async () => {
    try {
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*, weeks(*)')
        .eq('id', id)
        .single()

      if (quizError) throw quizError

      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', id)
        .order('order_index', { ascending: true })

      if (questionsError) throw questionsError

      setQuiz(quizData)
      setQuestions(questionsData || [])
    } catch (error) {
      console.error('Error fetching quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAnswer = (questionId, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    // Calculate score
    let correctAnswers = 0
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correct_answer) {
        correctAnswers++
      }
    })

    const finalScore = Math.round((correctAnswers / questions.length) * 100)
    setScore(finalScore)
    setShowResults(true)

    // Save attempt to database
    try {
      await supabase.from('quiz_attempts').insert({
        quiz_id: id,
        user_id: user.id,
        score: finalScore,
        answers: selectedAnswers
      })
    } catch (error) {
      console.error('Error saving quiz attempt:', error)
    }
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setScore(0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600">Quiz non disponible</p>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 mb-4">
              <Trophy className="h-10 w-10 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quiz terminé !
            </h1>
            <p className="text-gray-600">Voici vos résultats</p>
          </div>

          <div className="bg-gradient-to-r from-primary-50 to-gold-50 rounded-lg p-8 mb-6">
            <div className="text-6xl font-bold text-primary-600 mb-2">
              {score}%
            </div>
            <p className="text-gray-700">
              {questions.filter((q) => selectedAnswers[q.id] === q.correct_answer).length} / {questions.length} bonnes réponses
            </p>
          </div>

          {/* Results by question */}
          <div className="space-y-4 mb-6 text-left">
            {questions.map((question, idx) => {
              const isCorrect = selectedAnswers[question.id] === question.correct_answer
              const options = [
                question.option_a,
                question.option_b,
                question.option_c,
                question.option_d
              ]

              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">
                        Question {idx + 1}: {question.question}
                      </p>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">
                          Votre réponse: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                            {options[selectedAnswers[question.id]]}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-gray-600">
                            Bonne réponse: <span className="text-green-600">
                              {options[question.correct_answer]}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex space-x-4">
            <button onClick={handleRetry} className="btn-secondary flex-1">
              Réessayer
            </button>
            <button onClick={() => navigate('/study-plan')} className="btn-primary flex-1">
              Retour au plan
            </button>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const options = [
    question.option_a,
    question.option_b,
    question.option_c,
    question.option_d
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-6">
            {question.question}
          </h2>

          <div className="space-y-3">
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(question.id, idx)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswers[question.id] === idx
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[question.id] === idx
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedAnswers[question.id] === idx && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="btn-secondary disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            onClick={handleNext}
            disabled={selectedAnswers[question.id] === undefined}
            className="btn-primary flex items-center space-x-2"
          >
            <span>
              {currentQuestion === questions.length - 1 ? 'Terminer' : 'Suivant'}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Quiz
