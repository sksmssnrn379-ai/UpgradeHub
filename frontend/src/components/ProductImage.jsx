import { useState } from "react";

function ProductImage({
  src,
  alt,
  fallback,
  className = "",
}) {
  const [errorSrc, setErrorSrc] = useState(null);

  const hasError = errorSrc === src;

  if (!src || hasError) {
    return fallback;
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => {
        setErrorSrc(src);
      }}
      className={className}
    />
  );
}

export default ProductImage;