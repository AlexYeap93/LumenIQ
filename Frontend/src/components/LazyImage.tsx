import { useState, useRef, useEffect } from 'react';

type LazyImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

/**
 * An <img> that shows an animated skeleton placeholder while loading,
 * then fades in once the image has fully downloaded.
 *
 * Drop-in replacement for <img> — same props, same className.
 */
export function LazyImage({ className = '', onLoad, src, ...props }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset loaded state when src changes
  useEffect(() => {
    setLoaded(false);
  }, [src]);

  // Handle images that are already cached by the browser
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-muted rounded-[inherit]" />
      )}
      <img
        ref={imgRef}
        src={src}
        {...props}
        className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </div>
  );
}
