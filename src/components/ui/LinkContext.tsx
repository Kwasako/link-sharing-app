'use client';
import React, { createContext, useState, useContext } from 'react';

type LinkContextType = {
  selectedPlatforms: Array<{ platform: string; url: string }>;
  updateSelectedPlatforms: (platforms: Array<{ platform: string; url: string }>) => void;
};

const LinkContext = createContext<LinkContextType | undefined>(undefined);

export const LinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Array<{ platform: string; url: string }>>([]);

  const updateSelectedPlatforms = (platforms: Array<{ platform: string; url: string }>) => {
    setSelectedPlatforms(platforms);
  };

  return (
    <LinkContext.Provider value={{ selectedPlatforms, updateSelectedPlatforms }}>
      {children}
    </LinkContext.Provider>
  );
};

export const useLink = () => {
  const context = useContext(LinkContext);
  if (context === undefined) {
    throw new Error('useLink must be used within a LinkProvider');
  }
  return context;
};