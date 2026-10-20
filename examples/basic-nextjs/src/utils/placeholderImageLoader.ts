import type { ImageLoaderProps } from 'next/image';

const placeholderImageLoader = ({ src, width }: ImageLoaderProps) => {
  const imagePath = src.replace('https://picsum.photos/', '');
  const pathArray = imagePath.split('/');

  // grab the original height + width
  const originalHeight: number = Number(pathArray.pop());
  const originalWidth: number = Number(pathArray.pop());

  // Next doesn't pass us the height, so we have to calculate it
  const aspectRatioHeight = (
    originalWidth: number,
    originalHeight: number,
    width: number
  ): number => Math.round((originalHeight / originalWidth) * width);

  const height = aspectRatioHeight(originalWidth, originalHeight, width);

  // if the src includes the string "id"
  const id = pathArray[0] === 'id' ? `/id/${pathArray[1]}` : '';

  // put it all together
  const newSrc: string = `https://picsum.photos${id}/${width}/${height}`;

  return newSrc;
};

export default placeholderImageLoader;
