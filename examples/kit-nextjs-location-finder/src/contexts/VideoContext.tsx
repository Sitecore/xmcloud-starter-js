import type React from 'react';
import { createContext, useContext, useState } from 'react';

interface VideoContextType {
  playingVideoId: string | null;
  // eslint-disable-next-line no-unused-vars
  setPlayingVideoId: (id: string | null) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  return (
    <VideoContext.Provider value={{ playingVideoId, setPlayingVideoId }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
}
