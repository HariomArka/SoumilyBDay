import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';

// Fonts: add these <link> tags in index.html <head> for best performance
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
// <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">

import Home from './Pages/Home';

type QA = { question: string; answers: string[] };
type Section = { id: string; title: string; question: QA };
type Questions = { entryQuestion: QA; sections: Section[] };

// images.json example:
// { "2nd": ["/2ndsem/1.jpg","/2ndsem/2.jpg"], "3rd": ["/3rdsem/1.jpg"], "summer": ["/summer/1.png"] }
type ImageMap = Record<string, string[]>;

const gradient = 'linear-gradient(135deg, #ffd1e8 0%, #ffc0d7 30%, #ffb3cf 60%, #ffa6c7 100%)';

function usePreloadImages(srcs: string[]) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!srcs?.length) {
      setReady(true);
      return;
    }
    let cancelled = false;

    const preload = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // tolerate errors to not block UI
        img.decoding = 'async';
        img.referrerPolicy = 'no-referrer';
        img.src = src;
      });

    (async () => {
      try {
        await Promise.all(srcs.map(preload));
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [srcs]);

  return ready;
}

export default function App() {
  const [qData, setQData] = useState<Questions | null>(null);
  const [imgMap, setImgMap] = useState<ImageMap>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [qRes, iRes] = await Promise.all([
          fetch('/security/questions.json', { headers: { Accept: 'application/json' } }),
          fetch('/security/images.json', { headers: { Accept: 'application/json' } }),
        ]);
        if (!qRes.ok) throw new Error(`questions.json ${qRes.status}`);
        if (!iRes.ok) throw new Error(`images.json ${iRes.status}`);
        const q = (await qRes.json()) as Questions;
        const imgs = (await iRes.json()) as ImageMap;
        if (mounted) {
          setQData(q);
          setImgMap(imgs);
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load configuration');
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Flatten all image URLs for preloading on app start
  const allImages = useMemo(() => Object.values(imgMap).flat().filter(Boolean), [imgMap]);

  const imagesReady = usePreloadImages(allImages);

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="min-h-screen relative"
        style={{
          background: gradient,
          fontFamily:
            'Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, sans-serif',
        }}
      >
        {/* Decorative floating hearts - hide on small screens to reduce motion */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden hidden sm:block">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: '110%', opacity: 0, x: Math.sin(i) * 40 }}
              animate={{
                y: ['110%', '-10%'],
                opacity: [0, 0.4, 0],
                x: [Math.sin(i) * 40, Math.sin(i + 2) * 60],
              }}
              transition={{ duration: 12 + (i % 5), repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
              style={{
                position: 'absolute',
                left: `${(i * 83) % 100}%`,
                fontSize: `${16 + (i % 5) * 6}px`,
                color: '#ff5ea9',
                filter: 'blur(0.4px)',
              }}
            >
              ♥
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!qData && !error ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto px-4 py-12 sm:py-16 text-center text-pink-900/80 text-sm sm:text-base"
            >
              Loading a little surprise…
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto px-4 py-12 sm:py-16 text-center text-red-700 text-sm sm:text-base"
            >
              {error}
            </motion.div>
          ) : !imagesReady ? (
            <motion.div
              key="preloading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-5xl mx-auto px-4 py-12 sm:py-16 text-center text-pink-900/80 text-sm sm:text-base"
            >
              Warming up memories…
            </motion.div>
          ) : (
            <motion.main
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative z-10"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Home data={qData!} images={imgMap} />
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
