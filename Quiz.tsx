import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../../components/ui/Toast';
import { Check, X, Award, HelpCircle, ArrowRight, CornerDownRight } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Header from '../../../components/layout/Header';

export default function QuizGame() {
  const { currentUser, questions, addCoins, appSettings } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [playsLeft, setPlaysLeft] = useState(appSettings.quizLimit);
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[currentIdx];

  const handleSelectOption = async (optIdx: number) => {
    if (isAnswered) return;
    
    setSelectedOpt(optIdx);
    setIsAnswered(true);

    const isCorrect = optIdx === currentQuestion.correctAnswer;
    if (isCorrect) {
      setCurrentScore((prev) => prev + 1);
      toast(`Correct! +🪙 ${currentQuestion.prizeCoins} Golden Coins earned!`, 'success');
      await addCoins(currentQuestion.prizeCoins, `Correct Answer to Trivia: ${currentQuestion.question.substring(0, 30)}...`, 'game');
    } else {
      toast('Incorrect Answer. Try better on the next question!', 'error');
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      setPlaysLeft(prev => prev - 1);
    }
  };

  const restartQuiz = () => {
    if (playsLeft <= 0) {
      toast('You reached your daily Quiz limit. Unlock PRO to play unlimited!', 'warning');
      return;
    }
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setCurrentScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0A0F]">
      <Header title="Islamic Trivia Quiz" showBack={true} onBackClick={() => navigate('/games')} />

      {/* Main Viewport */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 flex flex-col justify-between items-stretch text-left">
        <AnimatePresence mode="wait">
          {!quizFinished ? (
            <motion.div
              key={currentIdx}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-5 flex-1 flex flex-col justify-between"
            >
              {/* Question Header Status */}
              <div>
                <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 select-none">
                  <span>Question {currentIdx + 1} of {questions.length}</span>
                  <span className="text-[#D4AF37] font-mono">PRIZE: 🪙 {currentQuestion.prizeCoins} Coins</span>
                </div>
                
                {/* Horizontal progress bar */}
                <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#4F8EF7]"
                    style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  />
                </div>

                {/* Big question box statement */}
                <Card variant="gold" className="p-5 mt-4 border-[#D4AF37]/30 bg-[#12121A] relative shadow-lg">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 blur-2xl rounded-full" />
                  <h4 className="text-base font-bold font-serif text-gray-100 leading-relaxed pl-1.5">
                    {currentQuestion.question}
                  </h4>
                </Card>
              </div>

              {/* Options list selection */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, oIdx) => {
                  const isSelected = selectedOpt === oIdx;
                  const isCorrectAnswer = currentQuestion.correctAnswer === oIdx;
                  
                  // Conditional option coloring
                  let buttonColor = 'border-gray-900 bg-[#12121A] hover:border-gray-700/50 text-gray-300';
                  let icon = <HelpCircle className="w-4 h-4 text-gray-600" />;

                  if (isAnswered) {
                    if (isCorrectAnswer) {
                      buttonColor = 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold';
                      icon = <Check className="w-4 h-4 text-emerald-500 stroke-[3px]" />;
                    } else if (isSelected) {
                      buttonColor = 'border-red-500 bg-red-500/10 text-red-400 font-bold';
                      icon = <X className="w-4 h-4 text-red-500 stroke-[3px]" />;
                    } else {
                      buttonColor = 'border-gray-900 bg-[#12121A]/30 text-gray-600';
                      icon = <HelpCircle className="w-4 h-4 text-gray-800" />;
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      disabled={isAnswered}
                      className={`
                        w-full p-4 rounded-xl border flex items-center justify-between outline-none transition-all duration-150 text-left text-xs text-medium
                        active:scale-[0.99]
                        ${buttonColor}
                      `}
                    >
                      <span>{opt}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {/* Next navigation indicators */}
              <div className="pt-2">
                <Button
                  onClick={handleNext}
                  disabled={!isAnswered}
                  variant="gold"
                  iconAfter={<ArrowRight className="w-4.5 h-4.5" />}
                  className="w-full tracking-wider font-bold uppercase"
                >
                  {currentIdx < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                </Button>
              </div>
            </motion.div>
          ) : (
            /* Quiz Completed Final Screen results */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6 flex-1 flex flex-col justify-center text-center max-w-[340px] mx-auto w-full"
            >
              <div className="inline-flex items-center justify-center w-18 h-18 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] mx-auto mb-1 animate-bounce">
                <Award className="w-10 h-10 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold font-serif text-gray-100 flex items-center justify-center gap-1.5">
                   Quiz Showdown Over!
                </h2>
                <p className="text-xs text-gray-400">Excellent attention shown during Pakistani Facts quest.</p>
              </div>

              <Card variant="gold" className="p-5 select-none text-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Your Quiz Performance Score</span>
                <p className="text-3xl font-bold font-serif mt-2 text-[#D4AF37]">
                  {currentScore} / {questions.length} Correct
                </p>
                <span className="text-[10px] text-[#22C55E] mt-1 block font-mono font-medium">
                   Accumulated +🪙 {currentScore * 100} Coins payout!
                </span>
              </Card>

              <div className="space-y-3 pt-2">
                <Button
                  onClick={restartQuiz}
                  disabled={playsLeft <= 0}
                  variant="navy"
                  className="w-full font-bold uppercase text-xs tracking-wider"
                >
                  Play Another Quiz ({playsLeft} daily left)
                </Button>

                <Button
                  onClick={() => navigate('/games')}
                  variant="ghost"
                  className="w-full text-xs text-gray-500"
                >
                  Return to Active Games Lobby
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
