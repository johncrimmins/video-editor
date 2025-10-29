import { useState, useEffect } from 'react';
import { convertToFileUrl } from '../../../shared/domains/video';

const useVideoPlayer = (videoFile) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    if (!videoFile) {
      setVideoUrl(null);
      setIsVideoReady(false);
      return;
    }

    // Convert file path to app:// URL
    const url = convertToFileUrl(videoFile.path);
    setVideoUrl(url);
    
    // For now, assume video is ready once URL is set
    // In a more complex implementation, we'd wait for video metadata
    setIsVideoReady(true);
  }, [videoFile]);

  return {
    videoUrl,
    isVideoReady
  };
};
export default useVideoPlayer;
