import { useState, useEffect, useRef } from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { VideoComponentFields, VideoComponentProps } from './video-props';
import { VideoPlayer } from './VideoPlayer.dev';
import { VideoModal } from './VideoModal.dev';
import { useVideoModal } from '../../hooks/useVideoModal';
import { useVideo } from '@/contexts/VideoContext';
import { Default as Icon } from '@/components/icon/Icon';
import { Default as ImageWrapper } from '../image/ImageWrapper.dev';
import { motion } from 'framer-motion';
import { isMobile } from '@/utils/isMobile';
import { extractVideoId } from '@/utils/video';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { cn, getYouTubeThumbnail } from '@/lib/utils';

export const VideoBase: React.FC<VideoComponentFields> = (props) => {
  const { fields, params, playButtonClassName } = props;

  // playButtonClassName is applied to button but can be use to style the icon
  const [isPlaying, setIsPlaying] = useState(false);
  const { isOpen, openModal, closeModal } = useVideoModal();
  const { playingVideoId, setPlayingVideoId } = useVideo();

  const { video, image } = fields || {};
  const { displayIcon, darkPlayIcon = '0', useModal = '1' } = params || {};

  const videoUrl = video?.value?.href;
  const videoId = extractVideoId(videoUrl);
  const [canUseModal, setCanUseModal] = useState(useModal === '1');
  const [fallbackImage, setFallbackImage] = useState<string | undefined>('/placeholder.svg');

  const componentRef = useRef<HTMLDivElement>(null);

  const btnClasses = cn('absolute inset-0 z-20 flex cursor-pointer items-center justify-center', {
    'text-black': darkPlayIcon === '1',
    'text-white': darkPlayIcon !== '1',
    [`${playButtonClassName}`]: playButtonClassName,
  });
  const handlePlay = () => {
    if (canUseModal && !isPageEditing) {
      openModal();
    } else if (!isPageEditing) {
      setIsPlaying(true);
      setPlayingVideoId(videoId);
    }
  };

  const handleModalClose = () => {
    closeModal();
    setIsPlaying(false);
    setPlayingVideoId(null);
  };

  useEffect(() => {
    //only use modal for desktop
    setCanUseModal(useModal === '1' && !isMobile());
    if (playingVideoId && playingVideoId !== videoId) {
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playingVideoId, videoId]);

  useEffect(() => {
    if (!image?.value?.src && componentRef?.current) {
      const { clientWidth, clientHeight } = componentRef.current;
      setFallbackImage(getYouTubeThumbnail(videoId, clientWidth, clientHeight));
    }
  }, [componentRef, videoId, image]);

  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  return !videoUrl ? (
    <p className="bg-secondary flex aspect-video items-center justify-center border">
      <span className="font-bold">Please add video</span>
    </p>
  ) : (
    <motion.div
      whileHover="hover"
      initial="initial"
      className="max-w-screens-2xl relative z-10 mx-auto overflow-hidden"
    >
      <div className="relative aspect-video w-full" ref={componentRef}>
        <div className="absolute inset-0">
          {!isPlaying && (
            <motion.div
              className="absolute inset-0"
              variants={{
                hover: {
                  scale: 1.05,
                  transition: {
                    duration: 0.3,
                    ease: 'easeOut',
                  },
                },
              }}
            >
              {image?.value?.src ? (
                <ImageWrapper
                  image={image}
                  className="absolute inset-0 h-full w-full object-cover"
                  aria-hidden="true"
                  wrapperClass="absolute inset-0 cover-image"
                />
              ) : (
                <div className="cover-image absolute inset-0">
                  <img
                    src={fallbackImage}
                    aria-hidden="true"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              )}
            </motion.div>
          )}
          {displayIcon && (
            <div className="absolute inset-0 flex max-w-[30%] items-center justify-center">
              <svg
                width="364"
                height="358"
                viewBox="0 0 364 358"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute bottom-0 left-0 block h-auto w-full"
                aria-hidden="true"
              >
                <path
                  d="M244.774 214.641L324.325 292.523L297.024 319.411L217.472 241.065C212.294 244.31 207.116 246.165 200.997 248.019V358.353H162.398V248.019C156.749 246.628 151.101 244.31 145.923 241.065L66.8421 319.411L39.5404 292.523L119.092 214.641C115.797 209.541 113.914 203.978 112.031 198.415H0V160.401H112.031C113.443 154.374 115.797 149.275 119.092 144.176L39.5404 65.8293L66.8421 38.9413L145.923 117.287C151.101 114.506 156.749 112.188 162.398 110.334V0H200.997V110.334C207.116 112.188 212.294 114.506 217.472 117.287L297.024 38.9413L324.325 65.8293L244.774 144.176C247.598 149.275 249.952 154.374 251.835 160.401H363.866V198.415H251.835C249.952 203.978 247.598 209.541 244.774 214.641Z"
                  fill="#EA580C"
                />
              </svg>
            </div>
          )}
          {/* always use normal player for mobile devices */}
          {!canUseModal && (
            <VideoPlayer
              videoUrl={videoUrl}
              isPlaying={isPlaying}
              onPlay={handlePlay}
              fullScreen={!canUseModal}
              btnClasses={btnClasses}
            />
          )}
          {!isPlaying && canUseModal && (
            <button onClick={handlePlay} className={btnClasses} aria-label="Play video">
              <Icon
                iconName="play"
                className={`h-[65px] w-[65px] transition-transform hover:scale-110`}
              />
            </button>
          )}
        </div>
      </div>

      {canUseModal && (
        <VideoModal
          isOpen={isOpen}
          onClose={handleModalClose}
          videoUrl={videoUrl}
          componentRef={componentRef}
        />
      )}
    </motion.div>
  );
};

export function Default({ fields, params }: VideoComponentProps) {
  if (fields) {
    return <VideoBase fields={fields} params={params} />;
  }
  return <NoDataFallback componentName="Video" />;
}
