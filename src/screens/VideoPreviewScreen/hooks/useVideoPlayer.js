import { useState, useEffect } from 'react';

console.log('🎣 useVideoPlayer.js: useVideoPlayer hook loading...');

const useVideoPlayer = (videoFile) => {
  console.log('🎣 useVideoPlayer.js: useVideoPlayer hook initializing...');
  console.log('🎣 useVideoPlayer.js: videoFile parameter:', videoFile);
  
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  
  console.log('🎣 useVideoPlayer.js: Initial state - videoUrl:', videoUrl, 'isVideoReady:', isVideoReady);

  useEffect(() => {
    console.log('🎣 useVideoPlayer.js: useEffect triggered, videoFile:', videoFile);
    
    if (videoFile && videoFile.path) {
      console.log('🎣 useVideoPlayer.js: Converting file path to app:// URL');
      const url = `app://${videoFile.path}`;
      console.log('🎣 useVideoPlayer.js: Generated URL:', url);
      
      setVideoUrl(url);
      setIsVideoReady(true);
      console.log('🎣 useVideoPlayer.js: Video URL set, video ready');
    } else {
      console.log('🎣 useVideoPlayer.js: No video file or path, resetting state');
      setVideoUrl(null);
      setIsVideoReady(false);
    }
  }, [videoFile]);

  console.log('🎣 useVideoPlayer.js: Returning hook values...');
  return {
    videoUrl,
    isVideoReady
  };
};

console.log('🎣 useVideoPlayer.js: useVideoPlayer hook defined, exporting...');
export default useVideoPlayer;
