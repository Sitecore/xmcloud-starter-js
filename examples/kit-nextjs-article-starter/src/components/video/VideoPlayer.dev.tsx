'use client';

import { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { useVideo } from '@/contexts/VideoContext';
import { Default as Icon } from '@/components/icon/Icon';
import { extractVideoId } from '@/utils/video';
import { VideoPlayerProps } from './video-player.props';

const safelyInvokePlayerAction = (action: unknown) => {
  if (action && typeof (action as Promise<unknown>).catch === 'function') {
    (action as Promise<unknown>).catch((reason) => {
      console.warn('YouTube player action was rejected.', reason);
    });
  }
};

export function VideoPlayer({
  videoUrl,
  isPlaying,
  onPlay,
  fullScreen = false,
  btnClasses = '',
}: VideoPlayerProps) {
  const [videoId, setVideoId] = useState('');
  const playerRef = useRef<YouTube>(null);
  const { playingVideoId } = useVideo();

  useEffect(() => {
    const id = extractVideoId(videoUrl);
    setVideoId(id);
  }, [videoUrl]);

  useEffect(() => {
    if (playingVideoId !== videoId && isPlaying) {
      safelyInvokePlayerAction(playerRef.current?.internalPlayer?.pauseVideo());
    }
  }, [playingVideoId, videoId, isPlaying]);

  const handlePlay = () => {
    onPlay();
    // If player already mounted (e.g. resuming), play; otherwise autoplay will start when iframe loads
    if (playerRef.current?.internalPlayer) {
      safelyInvokePlayerAction(playerRef.current.internalPlayer.playVideo());
    }
  };

  return (
    <div className={`relative ${fullScreen ? 'inset-0 aspect-video' : 'h-full w-full'}`}>
      {!isPlaying && (
        <button onClick={handlePlay} className={btnClasses} aria-label="Play video">
          <Icon
            iconName="play"
            className={`h-[65px] w-[65px] transition-transform hover:scale-110`}
          />
        </button>
      )}
      {/* Only mount YouTube iframe after user clicks play to avoid third-party cookie warnings */}
      {isPlaying && videoId && (
        <YouTube
          videoId={videoId}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              playsinline: 0,
              autoplay: 1,
              controls: 1,
              modestbranding: 1,
              rel: 0,
              // Enable privacy-enhanced mode to reduce third-party cookies
              origin: typeof window !== 'undefined' ? window.location.origin : '',
            },
            // Use privacy-enhanced YouTube domain (youtube-nocookie.com)
            // This reduces third-party cookie usage
            host: 'https://www.youtube-nocookie.com',
          }}
          className="h-full w-full"
          ref={playerRef}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError={(error: any) => {
            console.error('YouTube video loading error:', error);
          }}
        />
      )}
    </div>
  );
}
