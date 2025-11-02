'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import ReactDOM from 'react-dom';

type QA = { question: string; answers: string[] };
type Section = { id: string; title: string; question: QA };
type Questions = { entryQuestion: QA; sections: Section[] };
type ImageMap = Record<string, string[]>;

type Props = {
  data: Questions;
  images: ImageMap;
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      // use cubic-bezier array for typed easing
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// const stagger: Variants = {
//   visible: { transition: { staggerChildren: 0.12 } },
// };

const glass = 'backdrop-blur-md bg-white/20 shadow-lg border border-white/30 rounded-2xl';

const titleFont = { fontFamily: 'Playfair Display, serif' };

function normalize(s: string) {
  return s.normalize('NFD').toLowerCase().trim();
}

const Gate = ({
  qa,
  onPassed,
  title = 'Welcome',
}: {
  qa: QA;
  onPassed: () => void;
  title?: string;
}) => {
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);

  const normalizedAnswers = useMemo(() => qa.answers.map(normalize), [qa]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = normalizedAnswers.includes(normalize(value));
    if (ok) onPassed();
    else {
      setWrong(true);
      setTimeout(() => setWrong(false), 900);
    }
  };

  return (
    <motion.div
      className={`w-full max-w-xl mx-auto p-4 sm:p-6 ${glass}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-xl sm:text-2xl md:text-3xl font-semibold text-pink-900 mb-2 sm:mb-3"
        style={titleFont}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {title}
      </motion.h2>
      <motion.p
        className="text-sm sm:text-base text-pink-900/80 mb-3 sm:mb-4"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {qa.question}
      </motion.p>
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Your answer"
          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl outline-none border border-pink-300/60 focus:border-pink-500 bg-white/60"
        />
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.03 }}
          className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-pink-600 text-white shadow-md whitespace-nowrap"
          type="submit"
        >
          Unlock
        </motion.button>
      </form>
      <AnimatePresence>
        {wrong && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-2 sm:mt-3 text-sm sm:text-base text-red-700"
          >
            Not quite. Try again.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FullscreenPortal = ({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);

    // Disable background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!mounted) return null;

  const portalRoot = typeof window !== 'undefined' ? document.body : null;
  if (!portalRoot) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 z-[1200] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Dim background */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Absolutely centered image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.img
            src={src}
            alt="fullscreen"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       max-w-[92vw] max-h-[90vh] rounded-xl object-contain shadow-2xl"
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-pink-600 
                       text-white flex items-center justify-center hover:bg-pink-700 
                       transition z-[1300]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>,
    portalRoot
  );
};

export const ImageGrid = ({ images }: { images: string[] }) => {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {images.map((src, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg sm:rounded-xl aspect-square cursor-pointer hover:opacity-90 transition"
            onClick={() => setFullscreenImage(src)}
          >
            <img
              src={src}
              alt={`memory-${i}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Portal */}
      {fullscreenImage && (
        <FullscreenPortal
          src={fullscreenImage}
          onClose={() => setFullscreenImage(null)}
        />
      )}
    </>
  );
};

const SectionCard = ({
  section,
  unlocked,
  onUnlock,
  images,
}: {
  section: Section;
  unlocked: boolean;
  onUnlock: () => void;
  images: string[];
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6 }}
      className={`p-4 sm:p-6 md:p-8 ${glass}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-pink-900" style={titleFont}>
          {section.title}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs sm:text-sm self-start sm:self-auto ${unlocked ? 'bg-green-500 text-white' : 'bg-pink-500/20 text-pink-900'
            }`}
        >
          {unlocked ? 'Unlocked' : 'Locked'}
        </span>
      </div>

      {unlocked ? (
        <ImageGrid images={images} />
      ) : (
        <Gate qa={section.question} onPassed={onUnlock} title="Unlock this chapter" />
      )}
    </motion.section>
  );
};

export default function Home({ data, images }: Props) {
  const [entryPassed, setEntryPassed] = useState(false);
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({});

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-8 sm:py-10 md:py-16">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-6 sm:mb-8 md:mb-12 text-center"
      >
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-pink-900 drop-shadow px-2" style={titleFont}>
          For a very special girl
        </h1>
        <p className="text-sm sm:text-base text-pink-900/80 mt-2 sm:mt-3">A little timeline of us</p>
      </motion.header>

      {!entryPassed ? (
        <div className="flex justify-center px-2">
          <Gate qa={data.entryQuestion} onPassed={() => setEntryPassed(true)} title="Just one question before we begin" />
        </div>
      ) : (
        <motion.div className="space-y-4 sm:space-y-6 md:space-y-8">
          {data.sections.map((sec) => (
            <SectionCard
              key={sec.id}
              section={sec}
              unlocked={!!unlocked[sec.id]}
              images={images[sec.id] ?? []}
              onUnlock={() => setUnlocked((prev) => ({ ...prev, [sec.id]: true }))}
            />
          ))}
        </motion.div>
      )}

      <motion.footer
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mt-8 sm:mt-12 text-xs sm:text-sm text-pink-900/70"
      >
        Made by me for the prettiest Girl..
      </motion.footer>
    </div>
  );
}