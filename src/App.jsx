import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Timer, Heart, CheckCircle, XCircle } from 'lucide-react';


const mockQuizData = {
  questions: [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris"
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars"
    },
    {
      id: 3,
      question: "What is the largest mammal in the world?",
      options: ["African Elephant", "Blue Whale", "Giraffe", "White Rhinoceros"],
      correctAnswer: "Blue Whale"
    },
    {
      id: 4,
      question: "Which programming language was created by James Gosling?",
      options: ["Python", "Java", "C++", "Ruby"],
      correctAnswer: "Java"
    },
    {
      id: 5,
      question: "What is the chemical symbol for gold?",
      options: ["Ag", "Fe", "Au", "Cu"],
      correctAnswer: "Au"
    },
    {
      id: 6,
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      correctAnswer: "Leonardo da Vinci"
    },
    {
      id: 7,
      question: "Which country is home to the Great Barrier Reef?",
      options: ["Brazil", "Australia", "Thailand", "Mexico"],
      correctAnswer: "Australia"
    },
    {
      id: 8,
      question: "What is the largest organ in the human body?",
      options: ["Brain", "Liver", "Skin", "Heart"],
      correctAnswer: "Skin"
    },
    {
      id: 9,
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: "William Shakespeare"
    },
    {
      id: 10,
      question: "What is the capital of Japan?",
      options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
      correctAnswer: "Tokyo"
    },
    {
      id: 11,
      question: "Which element has the atomic number 1?",
      options: ["Helium", "Hydrogen", "Carbon", "Oxygen"],
      correctAnswer: "Hydrogen"
    },
    {
      id: 12,
      question: "What is the square root of 144?",
      options: ["10", "12", "14", "16"],
      correctAnswer: "12"
    },
    {
      id: 13,
      question: "Which ocean is the largest?",
      options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
      correctAnswer: "Pacific Ocean"
    },
    {
      id: 14,
      question: "Who invented the telephone?",
      options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Albert Einstein"],
      correctAnswer: "Alexander Graham Bell"
    },
    {
      id: 15,
      question: "What is the hardest natural substance on Earth?",
      options: ["Gold", "Iron", "Diamond", "Platinum"],
      correctAnswer: "Diamond"
    },
    {
      id: 16,
      question: "Which planet is known as the Morning Star?",
      options: ["Mars", "Venus", "Mercury", "Jupiter"],
      correctAnswer: "Venus"
    },
    {
      id: 17,
      question: "What is the smallest prime number?",
      options: ["0", "1", "2", "3"],
      correctAnswer: "2"
    },
    {
      id: 18,
      question: "Which famous scientist developed the theory of relativity?",
      options: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Galileo Galilei"],
      correctAnswer: "Albert Einstein"
    },
    {
      id: 19,
      question: "What is the main component of the Sun?",
      options: ["Helium", "Hydrogen", "Nitrogen", "Oxygen"],
      correctAnswer: "Hydrogen"
    },
    {
      id: 20,
      question: "Which is the longest river in the world?",
      options: ["Amazon River", "Nile River", "Mississippi River", "Yangtze River"],
      correctAnswer: "Nile River"
    }
  ]
};

const QuizApp = () => {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState('start');
  const [timer, setTimer] = useState(30);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // API fetch
      setQuizData(mockQuizData);
    } catch (err) {
      setError("Failed to load quiz data. Please try again.");
    }
  }, []);

  useEffect(() => {
    let interval;
    if (gameState === 'playing' && timer > 0 && !showFeedback) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      handleWrongAnswer();
    }
    return () => clearInterval(interval);
  }, [gameState, timer, showFeedback]);

  const startQuiz = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setTimer(30);
    setStreak(0);
    setError(null);
  };

  const handleAnswer = (selected) => {
    setSelectedAnswer(selected);
    setShowFeedback(true);
    
    const correct = selected === quizData.questions[currentQuestion].correctAnswer;
    
    if (correct) {
      const streakBonus = streak >= 2 ? 20 : 0;
      const timeBonus = Math.floor(timer / 5);
      setScore(prev => prev + 100 + streakBonus + timeBonus);
      setStreak(prev => prev + 1);
    } else {
      handleWrongAnswer();
    }

  
    setTimeout(() => {
      if (currentQuestion + 1 < quizData.questions.length && lives > 0) {
        setCurrentQuestion(prev => prev + 1);
        setTimer(30);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setGameState('finished');
      }
    }, 1500);
  };

  const handleWrongAnswer = () => {
    setLives(prev => prev - 1);
    setStreak(0);
    if (lives <= 1) {
      setGameState('finished');
    }
  };

  const getOptionClassName = (option) => {
    if (!showFeedback || selectedAnswer !== option) {
      return "p-4 text-left rounded-lg border-2 border-purple-200 hover:border-purple-600 hover:bg-purple-50 transition-all";
    }
    
    const isCorrect = option === quizData.questions[currentQuestion].correctAnswer;
    const isSelected = option === selectedAnswer;
    
    if (isSelected && isCorrect) {
      return "p-4 text-left rounded-lg border-2 border-green-500 bg-green-50 flex justify-between items-center";
    } else if (isSelected && !isCorrect) {
      return "p-4 text-left rounded-lg border-2 border-red-500 bg-red-50 flex justify-between items-center";
    } else if (isCorrect) {
      return "p-4 text-left rounded-lg border-2 border-green-500 bg-green-50 flex justify-between items-center";
    }
    return "p-4 text-left rounded-lg border-2 border-purple-200 bg-gray-50 opacity-50";
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8">
        <div className="max-w-2xl  mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="text-center text-red-600">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p>{error}</p>
            <button
              onClick={startQuiz}
              className="mt-6 bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quizData) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">Loading...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8">
      <div className="max-w-2xl mt-20 mx-auto bg-white rounded-xl shadow-lg p-8">
        {gameState === 'start' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-purple-600 mb-6">Quiz Challenge</h1>
            <p className="text-gray-600 mb-8">Test your knowledge and earn points!</p>
            <button
              onClick={startQuiz}
              className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors"
            >
              Start Quiz
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <Trophy className="text-yellow-500" />
                <span className="text-xl font-semibold">{score}</span>
              </div>
              <div className="flex items-center space-x-2">
                {[...Array(lives)].map((_, i) => (
                  <Heart key={i} className="text-red-500" fill="red" />
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <Timer className="text-blue-500" />
                <span className="text-xl font-semibold">{timer}s</span>
              </div>
            </div>

            <motion.div
              key={currentQuestion}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h2 className="text-xl font-semibold mb-6">
                {quizData.questions[currentQuestion].question}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {quizData.questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showFeedback && handleAnswer(option)}
                    disabled={showFeedback}
                    className={getOptionClassName(option)}
                  >
                    <span>{option}</span>
                    {showFeedback && option === quizData.questions[currentQuestion].correctAnswer && (
                      <CheckCircle className="text-green-500" />
                    )}
                    {showFeedback && option === selectedAnswer && option !== quizData.questions[currentQuestion].correctAnswer && (
                      <XCircle className="text-red-500" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {gameState === 'finished' && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Quiz Complete!</h2>
            <div className="bg-purple-100 rounded-lg p-6 mb-6">
              <p className="text-2xl font-semibold text-purple-600">Final Score: {score}</p>
            </div>
            <button
              onClick={startQuiz}
              className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuizApp;