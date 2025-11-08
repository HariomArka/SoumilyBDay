import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {Sparkles, Heart } from 'lucide-react';
import '../App.css'

const Home = () => {
  const [showBirthday, setShowBirthday] = useState(true);
  const [showBucket, setShowBucket] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [answer, setAnswer] = useState('');
  const [wrong, setWrong] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const navigate = useNavigate();

  // Correct answers for the date question
  const correctAnswers = ["31st March", "31.03.2025", "31/03/2025","31 March","31 march"];

  useEffect(() => {
    // After 5 seconds, hide birthday text and show bucket
    const timer = setTimeout(() => {
      setShowBirthday(false);
      setShowBucket(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = answer.toLowerCase().trim();
    const isCorrect = correctAnswers.some(ans => normalized.includes(ans));

    if (isCorrect) {
      setUnlocked(true);
      setTimeout(() => setShowQuestion(false), 1000);
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 800);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-100 via-pink-50 to-pink-200 overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Birthday Animation */}
        {showBirthday && (
          <motion.div
            key="birthday"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center px-4">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-cursive text-pink-600 mb-4">
                  Happy Birthday
                </h1>
              </motion.div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-cursive text-pink-700 font-bold">
                  Soumily
                </h2>
              </motion.div>

              {/* Floating Hearts Animation */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 100, x: Math.random() * 100 - 50, opacity: 0 }}
                  animate={{
                    y: -100,
                    x: Math.random() * 200 - 100,
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    delay: i * 0.3,
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                >
                  <Heart className="text-pink-400" size={20 + Math.random() * 20} fill="currentColor" />
                </motion.div>
              ))}

              {/* Sparkles */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: [0, 1, 0], rotate: 360 }}
                  transition={{
                    delay: i * 0.2,
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                >
                  <Sparkles className="text-yellow-400" size={15 + Math.random() * 15} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bucket Scene */}
        {showBucket && !unlocked && (
          <motion.div
            key="bucket"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute inset-0 flex items-center justify-center p-4"
          >
            <div className="max-w-2xl w-full">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="backdrop-blur-md bg-white/30 shadow-2xl border border-white/40 rounded-3xl p-6 sm:p-8 md:p-12"
              >
                {/* Bucket Icon */}
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    {/* <Gift className="text-pink-600 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32" strokeWidth={1.5} /> */}
                    <img src="/she.png" className='w-[300px]' alt="" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -top-2 -right-2"
                    >
                      <Sparkles className="text-yellow-500 w-8 h-8" fill="currentColor" />
                    </motion.div>
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-cursive text-pink-800 text-center mb-4"
                >
                  A Bucket Full of Surprises! 🎁
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-base sm:text-lg md:text-xl text-pink-700 text-center mb-8 px-2"
                >
                  But first, you need the secret key to unlock it...
                </motion.p>

                {!showQuestion ? (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowQuestion(true)}
                    className="w-full bg-linear-to-r from-pink-500 to-pink-600 text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg"
                  >
                    Find the Secret Key
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-pink-50/50 rounded-2xl p-4 sm:p-6 mb-4">
                      <p className="text-pink-800 font-medium text-center mb-4 text-sm sm:text-base md:text-lg">
                        মনে আছে তারিখটা 👀👀?
                      </p>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                          type="text"
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="Enter the special date..."
                          className={`w-full px-4 py-3 rounded-xl outline-none border-2 transition-all duration-300 text-sm sm:text-base ${
                            wrong
                              ? 'border-red-400 bg-red-50 shake'
                              : 'border-pink-300 focus:border-pink-500 bg-white/70'
                          }`}
                        />
                        <button
                          type="submit"
                          className="w-full bg-linear-to-r from-pink-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg text-sm sm:text-base"
                        >
                          Unlock
                        </button>
                      </form>
                      {wrong && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-red-500 text-center mt-2 text-sm sm:text-base"
                        >
                          Oops! Not quite. Try again! 💭
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Unlocked - Show Navigation Cards */}
        {unlocked && (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
          >
            <div className="max-w-6xl w-full">
              <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-cursive text-pink-800 text-center mb-8 sm:mb-12"
              >
                Journey Down the Memory Lane! ✨
              </motion.h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { title: '3rd Sem', path: '/3rdsem', emoji: '', delay: 0.1 },
                  { title: '4th Sem', path: '/4thsem', emoji: '', delay: 0.2 },
                  { title: 'Summer 2025', path: '/summer', emoji: '', delay: 0.3 },
                  { title: 'Astami 2025', path: '/astami', emoji: '', delay: 0.4 },
                  { title: '5th Sem', path: '/5thsem', emoji: '', delay: 0.5 },
                ].map((item) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: item.delay }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(item.path)}
                    className="backdrop-blur-md bg-white/40 shadow-xl border border-white/50 rounded-2xl p-6 sm:p-8 cursor-pointer group hover:bg-white/50 transition-all duration-300"
                  >
                    <div className="text-center">
                      <div className="text-4xl sm:text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {item.emoji}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-pink-800 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-pink-600 text-sm sm:text-base">Click to unlock memories</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-pink-700 mt-8 sm:mt-12 font-cursive text-lg sm:text-xl md:text-2xl"
              >
                Made with 💕 for the most special girl
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Home;
