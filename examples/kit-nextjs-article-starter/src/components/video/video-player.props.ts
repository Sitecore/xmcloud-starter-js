export interface VideoPlayerProps {
  videoUrl: string;
  isPlaying: boolean;
  onPlay: () => void;
  fullScreen?: boolean;
  btnClasses: string;
}
