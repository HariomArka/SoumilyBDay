import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface UnlockContextType {
  unlockedSections: Set<string>;
  unlockSection: (sectionId: string) => void;
  isUnlocked: (sectionId: string) => boolean;
}

const UnlockContext = createContext<UnlockContextType | undefined>(undefined);

export const UnlockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Only in-memory state - resets on page refresh
  const [unlockedSections, setUnlockedSections] = useState<Set<string>>(new Set());

  const unlockSection = (sectionId: string) => {
    setUnlockedSections((prev) => new Set([...prev, sectionId]));
  };

  const isUnlocked = (sectionId: string) => {
    return unlockedSections.has(sectionId);
  };

  return (
    <UnlockContext.Provider value={{ unlockedSections, unlockSection, isUnlocked }}>
      {children}
    </UnlockContext.Provider>
  );
};

export const useUnlock = () => {
  const context = useContext(UnlockContext);
  if (!context) {
    throw new Error('useUnlock must be used within UnlockProvider');
  }
  return context;
};
