import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useUnlock } from '../context/UnlockContext';

interface Question {
  question: string;
  answers: string[];
}

interface MemoryPageProps {
  sectionId: string;
  title: string;
  question: Question;
  images: string[];
}

const MemoryPage: React.FC<MemoryPageProps> = ({ sectionId, title, question, images }) => {
  const { isUnlocked, unlockSection } = useUnlock();
  const [isUnlockedLocal, setIsUnlockedLocal] = useState(isUnlocked(sectionId));
  const [answer, setAnswer] = useState('');
  const [wrong, setWrong] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Check if already unlocked when component mounts
  useEffect(() => {
    setIsUnlockedLocal(isUnlocked(sectionId));
  }, [sectionId, isUnlocked]);

  const checkAnswer = (userAnswer: string, correctAnswers: string[]) => {
    const normalized = userAnswer.toLowerCase().trim();
    return correctAnswers.some(ans => normalized.includes(ans.toLowerCase()));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (checkAnswer(answer, question.answers)) {
      unlockSection(sectionId); // Save to global state & localStorage
      setIsUnlockedLocal(true);
      setAnswer('');
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 800);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-100 via-pink-50 to-pink-200 p-4 sm:p-6 md:p-8">
      <AnimatePresence mode="wait">
        {!isUnlockedLocal ? (
          // Question/Lock Screen
          <motion.div
            key="locked"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto mt-10 sm:mt-20"
          >
            <div className="backdrop-blur-md bg-white/40 shadow-2xl border border-white/50 rounded-3xl p-6 sm:p-8 md:p-12">
              {/* Header with Lock Badge */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-800 text-center sm:text-left">
                  {title}
                </h1>
                <span className="flex items-center gap-2 bg-pink-200 text-pink-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Lock size={18} />
                  Locked
                </span>
              </div>

              {/* Divider */}
              <div className="h-px bg-linear-to-r from-transparent via-pink-300 to-transparent mb-6"></div>

              {/* Question Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl sm:text-2xl font-semibold text-pink-700 mb-4">
                  Unlock this chapter
                </h2>
                <p className="text-pink-600 mb-6 text-base sm:text-lg">
                  {question.question}
                </p>

                {/* Answer Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="জানি তো ভুলে গেছিস 😭"
                    className={`w-full px-4 py-3 sm:py-4 rounded-xl outline-none border-2 transition-all duration-300 text-sm sm:text-base ${
                      wrong
                        ? 'border-red-400 bg-red-50 shake'
                        : 'border-pink-300 focus:border-pink-500 bg-white/70'
                    }`}
                  />
                  <button
                    type="submit"
                    className="w-full bg-linear-to-r from-pink-500 to-pink-600 text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Unlock
                  </button>
                </form>

                {wrong && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-center mt-3 text-sm sm:text-base"
                  >
                    ঠিক করে ভাব🥱🥱
                  </motion.p>
                )}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          // Unlocked - Gallery View
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-800 text-center sm:text-left">
                {title}
              </h1>
              <span className="flex items-center gap-2 bg-green-200 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                <Unlock size={18} />
                Unlocked
              </span>
            </div>

            {/* Featured Image Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mb-8 sm:mb-12 backdrop-blur-md bg-white/40 shadow-xl border border-white/50 rounded-3xl p-4 sm:p-6 overflow-hidden"
            >
              <div className="relative aspect-4/3 sm:aspect-video bg-pink-100 rounded-2xl overflow-hidden">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={`Memory ${currentImageIndex + 1}`}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => openLightbox(currentImageIndex)}
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-pink-600 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-pink-600 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>
            </motion.div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className={`relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 ${
                    currentImageIndex === index ? 'ring-4 ring-pink-500' : ''
                  }`}
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {currentImageIndex === index && (
                    <div className="absolute inset-0 bg-pink-500/20 backdrop-blur-[1px]"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setShowLightbox(false)}
          >
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 z-10"
            >
              <X size={24} />
            </button>

            <div className="relative max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={`Full size ${currentImageIndex + 1}`}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />

              {/* Lightbox Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-pink-600 p-3 rounded-full shadow-lg transition-all duration-300"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-pink-600 p-3 rounded-full shadow-lg transition-all duration-300"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
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

export default MemoryPage;
