import Image, { ImageProps } from 'next/image';
import { buildImgUrl } from '@/lib/imagery/url';

type Props = Omit<ImageProps,'src'> & {
  keyPath: string;        // clave en R2/S3
  w?: number; h?: number;
  fmt?: 'webp'|'avif'|'jpeg'|'png';
  fit?: 'cover'|'contain'|'inside'|'outside'|'fill';
  q?: number;
  watermark?: boolean;
  wmPos?: 'center'|'north'|'south'|'east'|'west'|'northeast'|'northwest'|'southeast'|'southwest';
  wmColor?: string; wmOpacity?: number;
};

export default function NextImagePro({
  keyPath, w, h, fmt='webp', fit='cover', q=82,
  watermark=false, wmPos='southeast', wmColor='#ffffff', wmOpacity=0.2,
  alt, ...rest
}: Props){
  const src = buildImgUrl({
    key: keyPath, w, h, fmt, fit, q,
    wm: watermark?1:0, wmPos, wmColor, wmOpacity
  });
  return <Image src={src} alt={alt} {...rest} />;
}

