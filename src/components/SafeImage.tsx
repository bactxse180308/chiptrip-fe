import { useEffect, useState, type ImgHTMLAttributes } from "react";

type SafeImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  fallbackSrc: string;
};

const SafeImage = ({
  src,
  fallbackSrc,
  onError,
  loading = "lazy",
  decoding = "async",
  ...props
}: SafeImageProps) => {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img
      {...props}
      src={currentSrc}
      loading={loading}
      decoding={decoding}
      onError={(event) => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
        onError?.(event);
      }}
    />
  );
};

export default SafeImage;
