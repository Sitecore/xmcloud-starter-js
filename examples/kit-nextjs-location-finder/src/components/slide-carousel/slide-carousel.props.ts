export type GalleryProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
};

export type GalleryItemProps = {
  children?: React.ReactNode;
};

export type SlideCarouselProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export type SlideCarouselItemWrapProps = {
  className?: string;
  children: React.ReactNode;
};
