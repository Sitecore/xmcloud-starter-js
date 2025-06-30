import { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { useVideo } from '@/contexts/VideoContext';
import { Default as Icon } from '@/components/icon/Icon';
import { extractVideoId } from '@/utils/video';

interface VideoPlayerProps {
  videoUrl: string;
  isPlaying: boolean;
  onPlay: () => void;
  fullScreen?: boolean;
  btnClasses: string;
}

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
      playerRef.current?.internalPlayer.pauseVideo();
    }
  }, [playingVideoId, videoId, isPlaying]);

  const handlePlay = () => {
    onPlay();
    playerRef.current?.internalPlayer.playVideo();
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
      <YouTube
        videoId={videoId}
        opts={{
          width: '100%',
          height: '100%',
          playerVars: {
            playsinline: 0,
            autoplay: isPlaying ? 1 : 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
          },
        }}
        className={`h-full w-full ${isPlaying ? 'block' : 'hidden'}`}
        ref={playerRef}
      />
    </div>
  );
}
