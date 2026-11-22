import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  BrainCircuit,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCw,
  Star,
  Award,
  Layers,
  HelpCircle,
  Plus,
  BookOpen
} from 'lucide-react';
import { api } from '../lib/api';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';

export default function QuizFlashcardsPage() {
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' or 'flashcards'
  const [subjects, setSubjects] = useState([]);
  const [resources, setResources] = useState([]);

  // Quiz Generator States
  const [quizSubjectId, setQuizSubjectId] = useState('');
  const [quizResourceId, setQuizResourceId] = useState('');
  const [quizTopic, setQuizTopic] = useState('Data Structures & Algorithms');
  const [quizDifficulty, setQuizDifficulty] = useState('Medium');
  const [quizCount, setQuizCount] = useState(5);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { 0: 2, 1: 0 }
  const [quizResult, setQuizResult] = useState(null);
  const [attempts, setAttempts] = useState([]);

  // Flashcards States
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [generatingCards, setGeneratingCards] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [newCardDeck, setNewCardDeck] = useState('DSA Concepts');

  useEffect(() => {
    loadBaseData();
  }, []);

  const loadBaseData = async () => {
    try {
      const [subData, resData, attemptsData, fcData] = await Promise.all([
        api.getSubjects(),
        api.getResources(),
        api.getQuizAttempts(),
        api.getFlashcards()
      ]);
      setSubjects(subData);
      setResources(resData);
      setAttempts(attemptsData);
      setFlashcards(fcData);
    } catch (e) {
      console.error(e);
    }
  };

  // ----------------- Quiz Handlers -----------------
  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setGeneratingQuiz(true);
    setQuizResult(null);
    setUserAnswers({});
    setCurrentQIndex(0);

    try {
      const quiz = await api.generateQuiz({
        subject_id: quizSubjectId || undefined,
        resource_id: quizResourceId || undefined,
        topic: quizTopic,
        difficulty: quizDifficulty,
        total_questions: parseInt(quizCount, 10)
      });
      setActiveQuiz(quiz);
    } catch (err) {
      alert('Quiz generation failed: ' + err.message);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleSelectOption = (qIdx, optionIdx) => {
    setUserAnswers(prev => ({ ...prev, [qIdx]: optionIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    const formattedAnswers = Object.keys(userAnswers).map(k => ({
      question_index: parseInt(k, 10),
      selected_option: userAnswers[k]
    }));

    try {
      const result = await api.submitQuiz({
        quiz_id: activeQuiz.id,
        answers: formattedAnswers
      });
      setQuizResult(result);

      // Trigger Confetti Celebration if passing score
      if (result.percentage >= 60) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      loadBaseData();
    } catch (e) {
      alert(e.message);
    }
  };

  // ----------------- Flashcards Handlers -----------------
  const handleGenerateCards = async () => {
    setGeneratingCards(true);
    try {
      const newCards = await api.generateFlashcards({
        subject_id: quizSubjectId || undefined,
        resource_id: quizResourceId || undefined,
        deck_title: `${quizTopic} Deck`,
        count: 6
      });
      setFlashcards(prev => [...newCards, ...prev]);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } catch (e) {
      alert(e.message);
    } finally {
      setGeneratingCards(false);
    }
  };

  const handleCreateManualCard = async (e) => {
    e.preventDefault();
    if (!newCardFront.trim() || !newCardBack.trim()) return;
    try {
      const created = await api.createFlashcard({
        deck_title: newCardDeck,
        front: newCardFront,
        back: newCardBack
      });
      setFlashcards(prev => [created, ...prev]);
      setIsAddCardOpen(false);
      setNewCardFront('');
      setNewCardBack('');
    } catch (e) {
      alert(e.message);
    }
  };

  const handleToggleStar = async (fcId) => {
    try {
      await api.toggleFlashcardStar(fcId);
      setFlashcards(prev => prev.map(fc => fc.id === fcId ? { ...fc, is_starred: !fc.is_starred } : fc));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Tab Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">Quiz & Active Recall Flashcards</h2>
          <p className="text-xs text-[#6B7280]">
            Evaluate your exam preparation with AI multiple choice tests and concept revision cards
          </p>
        </div>

        <div className="flex p-1 bg-white rounded-2xl border border-[#EDE9FE] shadow-xs">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'quiz'
                ? 'bg-[#EDE9FE] text-[#7C3AED] shadow-xs'
                : 'text-[#6B7280] hover:text-[#1F2937]'
            }`}
          >
            AI MCQ Quiz
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'flashcards'
                ? 'bg-[#EDE9FE] text-[#7C3AED] shadow-xs'
                : 'text-[#6B7280] hover:text-[#1F2937]'
            }`}
          >
            <span>Flashcards</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#7C3AED] text-white text-[10px]">
              {flashcards.length}
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'quiz' ? (
        <div className="space-y-6">
          {/* Active Quiz Runner or Quiz Generator */}
          {!activeQuiz || quizResult ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Quiz Generator Form */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#1F2937] pb-3 border-b border-[#EDE9FE]">
                  Generate AI MCQ Assessment
                </h3>

                <form onSubmit={handleGenerateQuiz} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4B5563]">Subject</label>
                    <select
                      value={quizSubjectId}
                      onChange={(e) => setQuizSubjectId(e.target.value)}
                      className="mt-1 w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
                    >
                      <option value="">-- All Subjects / General --</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4B5563]">Study Document (Optional)</label>
                    <select
                      value={quizResourceId}
                      onChange={(e) => {
                        setQuizResourceId(e.target.value);
                        const r = resources.find(res => res.id === e.target.value);
                        if (r) setQuizTopic(r.title);
                      }}
                      className="mt-1 w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
                    >
                      <option value="">-- None (Curriculum Syllabus) --</option>
                      {resources.map(r => (
                        <option key={r.id} value={r.id}>{r.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4B5563]">Topic / Concept Title *</label>
                    <input
                      type="text"
                      required
                      value={quizTopic}
                      onChange={(e) => setQuizTopic(e.target.value)}
                      placeholder="e.g. Stacks, Queues, and Expression Evaluation"
                      className="mt-1 w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#4B5563]">Difficulty</label>
                      <select
                        value={quizDifficulty}
                        onChange={(e) => setQuizDifficulty(e.target.value)}
                        className="mt-1 w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
                      >
                        <option value="Easy">Easy (Fundamentals)</option>
                        <option value="Medium">Medium (University Standard)</option>
                        <option value="Hard">Hard (Gate & Numerical)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4B5563]">Number of Questions</label>
                      <select
                        value={quizCount}
                        onChange={(e) => setQuizCount(e.target.value)}
                        className="mt-1 w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl focus:bg-white focus:outline-none"
                      >
                        <option value={3}>3 Questions (Quick Test)</option>
                        <option value={5}>5 Questions (Standard)</option>
                        <option value={10}>10 Questions (Mock Exam)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={generatingQuiz}
                    className="w-full mt-4 py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#7C3AED]/20 transition-all disabled:opacity-50"
                  >
                    {generatingQuiz ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating MCQs with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Start New Quiz</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Past Attempts History */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-[#EDE9FE] shadow-xs">
                <h3 className="text-sm font-bold text-[#1F2937] pb-3 border-b border-[#EDE9FE] flex items-center justify-between">
                  <span>Recent Quiz Performance</span>
                  <span className="text-xs text-[#7C3AED] font-semibold">{attempts.length} Attempted</span>
                </h3>

                <div className="mt-4 space-y-3 max-h-[360px] overflow-y-auto">
                  {attempts.length === 0 ? (
                    <div className="text-center py-12 text-[#9CA3AF]">
                      <BrainCircuit className="w-8 h-8 mx-auto mb-2 text-[#DDD6FE]" />
                      <p className="text-xs font-medium">No quiz attempts yet. Generate a test to evaluate yourself!</p>
                    </div>
                  ) : (
                    attempts.map((att) => (
                      <div
                        key={att.id}
                        className="p-3.5 rounded-2xl bg-[#F8F7FF] border border-[#EDE9FE] flex items-center justify-between"
                      >
                        <div className="truncate">
                          <p className="text-xs font-bold text-[#1F2937]">Score: {att.score} / {att.total_questions}</p>
                          <p className="text-[11px] text-[#6B7280]">
                            {new Date(att.completed_at).toLocaleDateString()} • {att.percentage >= 60 ? 'Passed' : 'Needs Revision'}
                          </p>
                        </div>
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                          att.percentage >= 75
                            ? 'bg-emerald-100 text-emerald-700'
                            : att.percentage >= 50
                            ? 'bg-purple-100 text-[#7C3AED]'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {att.percentage}%
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* Active Quiz Runner Screen */}
          {activeQuiz && !quizResult && (
            <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#EDE9FE]">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] uppercase">
                    Question {currentQIndex + 1} of {activeQuiz.questions.length}
                  </span>
                  <h3 className="text-sm font-bold text-[#1F2937] mt-1">{activeQuiz.title}</h3>
                </div>

                <button
                  onClick={() => setActiveQuiz(null)}
                  className="text-xs font-semibold text-[#9CA3AF] hover:text-red-500"
                >
                  Exit Test
                </button>
              </div>

              {/* Question Text */}
              {(() => {
                const q = activeQuiz.questions[currentQIndex];
                if (!q) return null;

                return (
                  <div className="space-y-6">
                    <p className="text-sm sm:text-base font-bold text-[#1F2937] leading-relaxed">
                      {q.question_text}
                    </p>

                    {/* 4 Options */}
                    <div className="space-y-3">
                      {q.options.map((option, optIdx) => {
                        const isSelected = userAnswers[currentQIndex] === optIdx;

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(currentQIndex, optIdx)}
                            className={`p-4 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                              isSelected
                                ? 'border-[#7C3AED] bg-[#EDE9FE]/60 ring-2 ring-[#7C3AED]/20 shadow-xs'
                                : 'border-[#EDE9FE] bg-[#F8F7FF] hover:bg-white hover:border-[#C4B5FD]'
                            }`}
                          >
                            <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isSelected ? 'bg-[#7C3AED] text-white' : 'bg-white text-[#4B5563] border border-[#EDE9FE]'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-[#1F2937]">{option}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="pt-6 border-t border-[#EDE9FE] flex items-center justify-between">
                      <button
                        onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQIndex === 0}
                        className="px-4 py-2 text-xs font-bold text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>

                      {currentQIndex < activeQuiz.questions.length - 1 ? (
                        <button
                          onClick={() => setCurrentQIndex(prev => prev + 1)}
                          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] flex items-center gap-1 shadow-xs"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitQuiz}
                          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 shadow-md shadow-emerald-600/20"
                        >
                          <span>Submit Assessment</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Final Quiz Result Screen */}
          {quizResult && (
            <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-[#EDE9FE] shadow-sm space-y-6 animate-in zoom-in-95 duration-200">
              <div className="text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-3xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-[#1F2937]">Quiz Completed!</h3>
                <p className="text-xs text-[#6B7280] mt-1">
                  You scored <span className="font-bold text-[#7C3AED] text-sm">{quizResult.score}</span> out of {quizResult.total_questions} ({quizResult.percentage}%)
                </p>
              </div>

              {/* Explanations List */}
              <div className="space-y-4 pt-4 border-t border-[#EDE9FE]">
                <h4 className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Answer Review & Explanations:</h4>
                {quizResult.answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border ${
                      ans.is_correct ? 'bg-emerald-50/40 border-emerald-200' : 'bg-red-50/40 border-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {ans.is_correct ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-[#1F2937]">{ans.question_text}</p>
                        <p className="text-xs font-medium text-[#4B5563] mt-1">
                          Your Answer: Option {String.fromCharCode(65 + ans.selected_option)} | Correct Answer: Option {String.fromCharCode(65 + ans.correct_option)}
                        </p>
                        {ans.explanation && (
                          <p className="text-xs text-[#6B7280] mt-2 bg-white/70 p-2.5 rounded-xl border border-[#EDE9FE]">
                            💡 <span className="font-semibold">Explanation:</span> {ans.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setActiveQuiz(null);
                    setQuizResult(null);
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] shadow-xs"
                >
                  Take Another Assessment
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Flashcards Mode */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerateCards}
                disabled={generatingCards}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] shadow-xs transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{generatingCards ? 'Generating Flashcards...' : 'AI Generate Flashcards'}</span>
              </button>

              <button
                onClick={() => setIsAddCardOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#4B5563] bg-white border border-[#EDE9FE] hover:bg-[#F8F7FF]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Card</span>
              </button>
            </div>

            <span className="text-xs text-[#6B7280]">
              Card {flashcards.length > 0 ? currentCardIndex + 1 : 0} of {flashcards.length}
            </span>
          </div>

          {flashcards.length === 0 ? (
            <EmptyState
              icon={BrainCircuit}
              title="No flashcards created"
              description="Click 'AI Generate Flashcards' to automatically create active recall cards from your syllabus."
              actionLabel="Generate Now"
              onAction={handleGenerateCards}
            />
          ) : (
            <div className="max-w-xl mx-auto space-y-6">
              {/* Interactive 3D Card Box */}
              {(() => {
                const card = flashcards[currentCardIndex];
                if (!card) return null;

                return (
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="h-80 w-full rounded-3xl bg-white border-2 border-[#DDD6FE] hover:border-[#7C3AED] shadow-lg cursor-pointer p-8 flex flex-col justify-between transition-all select-none relative group"
                  >
                    {/* Top card metadata */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] uppercase">
                        {isFlipped ? 'Answer / Solution' : 'Prompt / Concept'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStar(card.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          card.is_starred ? 'text-amber-500' : 'text-[#9CA3AF] hover:text-amber-500'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${card.is_starred ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Middle Card Content */}
                    <div className="flex-1 flex items-center justify-center text-center p-4">
                      <p className="text-base sm:text-lg font-bold text-[#1F2937] leading-relaxed whitespace-pre-wrap">
                        {isFlipped ? card.back : card.front}
                      </p>
                    </div>

                    {/* Bottom Flip Prompt */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#EDE9FE] text-xs text-[#9CA3AF]">
                      <span>{card.deck_title}</span>
                      <span className="flex items-center gap-1 font-semibold text-[#7C3AED]">
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Click card to {isFlipped ? 'see question' : 'reveal answer'}</span>
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Navigation Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setCurrentCardIndex(prev => Math.max(0, prev - 1));
                    setIsFlipped(false);
                  }}
                  disabled={currentCardIndex === 0}
                  className="p-3 rounded-2xl bg-white border border-[#EDE9FE] text-[#4B5563] hover:text-[#7C3AED] disabled:opacity-30 shadow-xs"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-6 py-2.5 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] font-bold text-xs hover:bg-[#DDD6FE] transition-colors"
                >
                  Flip Card
                </button>

                <button
                  onClick={() => {
                    setCurrentCardIndex(prev => Math.min(flashcards.length - 1, prev + 1));
                    setIsFlipped(false);
                  }}
                  disabled={currentCardIndex === flashcards.length - 1}
                  className="p-3 rounded-2xl bg-white border border-[#EDE9FE] text-[#4B5563] hover:text-[#7C3AED] disabled:opacity-30 shadow-xs"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Create Flashcard */}
      <Modal isOpen={isAddCardOpen} onClose={() => setIsAddCardOpen(false)} title="Create Revision Flashcard">
        <form onSubmit={handleCreateManualCard} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#374151]">Deck Title</label>
            <input
              type="text"
              value={newCardDeck}
              onChange={(e) => setNewCardDeck(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151]">Front (Concept Question)</label>
            <textarea
              rows={3}
              required
              placeholder="e.g. What is the time complexity of QuickSort in worst case?"
              value={newCardFront}
              onChange={(e) => setNewCardFront(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151]">Back (Answer Explanation)</label>
            <textarea
              rows={3}
              required
              placeholder="e.g. O(n^2) when pivot selection is degenerate."
              value={newCardBack}
              onChange={(e) => setNewCardBack(e.target.value)}
              className="mt-1 block w-full px-3 py-2 text-xs bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddCardOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#6B7280]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#7C3AED] rounded-xl"
            >
              Save Card
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
