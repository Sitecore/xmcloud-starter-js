'use client';

import { useEffect, useState, type RefObject } from 'react';
import YouTube from 'react-youtube';
import { FocusTrap } from 'focus-trap-react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideo } from '@/contexts/VideoContext';
import { preventScroll, allowScroll } from '@/utils/bodyClass';
import { extractVideoId } from '@/utils/video';
import { Portal } from '@/components/portal/portal.dev';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  componentRef: RefObject<HTMLDivElement | null>;
}

export function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  const [showCloseButton, setShowCloseButton] = useState(true);
  const [videoId, setVideoId] = useState('');
  const { setPlayingVideoId } = useVideo();

  useEffect(() => {
    const id = extractVideoId(videoUrl);
    setVideoId(id);
  }, [videoUrl]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      // console.log('resetTimer');
      setShowCloseButton(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowCloseButton(false), 3000);
    };

    if (isOpen) {
      resetTimer();
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      setPlayingVideoId(videoId);
      preventScroll();
    } else {
      allowScroll();
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      if (!isOpen) {
        setPlayingVideoId(null);
        allowScroll();
      }
    };
  }, [isOpen, videoId, setPlayingVideoId]);

  const fadeOutClass = 'transition-opacity duration-1000 ease-out';
  const visibleClass = 'opacity-100';
  const hiddenClass = 'opacity-0';

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring' as const,
        damping: 15,
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        ease: 'easeInOut' as const,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleClose = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.KeyboardEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    onClose();
    allowScroll();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <FocusTrap>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-100 backdrop-blur-sm"
              onClick={handleClose}
              role="dialog"
              aria-modal="true"
              aria-label={'video modal, video will start playing automatically'}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative h-[calc(100vh-2rem)] max-h-[calc((100vw-4rem)*9/16)] w-[calc(100%-4rem)] max-w-[calc(100vh*16/9)]"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div variants={itemVariants} className="absolute inset-0">
                  {videoId ? (
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
                        },
                      }}
                      className="h-full w-full"
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onReady={(event: any) => {
                        event.target.playVideo();
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                      No video available
                    </div>
                  )}
                </motion.div>
              </motion.div>
              <motion.div variants={itemVariants} className="fixed right-4 top-4 z-[110]">
                <Button
                  className={`bg-white text-black hover:bg-gray-200  ${fadeOutClass} ${
                    showCloseButton ? visibleClass : hiddenClass
                  }`}
                  variant="default"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </FocusTrap>
        </Portal>
      )}
    </AnimatePresence>
  );
}
