import React, { useRef, useEffect } from 'react';

/**
 * LiveVideoPreview - Component for showing live video stream preview
 * Similar to VideoElement but designed for MediaStream objects
 */
const LiveVideoPreview = ({ 
  srcObject, 
  autoPlay = true,
  muted = true,
  style = {},
  className = '',
  ...props
}) => {
  const videoRef = useRef(null);

  // Set the srcObject when it changes
  useEffect(() => {
    if (videoRef.current && srcObject) {
      videoRef.current.srcObject = srcObject;
    }
  }, [srcObject]);

  const baseStyles = {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    ...style,
  };

  if (!srcObject) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      autoPlay={autoPlay}
      muted={muted}
      playsInline
      style={baseStyles}
      className={className}
      {...props}
    />
  );
};

export default LiveVideoPreview;
