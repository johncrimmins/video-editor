import { useState, useEffect } from 'react';
import { convertToFileUrl } from '../services/videoService';

console.log('🎣 useVideoPlayer.js: useVideoPlayer hook loading...');

const useVideoPlayer = (videoFile) => {
  console.log('🎣 useVideoPlayer.js: useVideoPlayer hook initializing...');
  console.log('🎣 useVideoPlayer.js: videoFile:', videoFile);
  
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  
  console.log('🎣 useVideoPlayer.js: Initial state - videoUrl:', videoUrl, 'isVideoReady:', isVideoReady);

  useEffect(() => {
    console.log('🎣 useVideoPlayer.js: useEffect triggered, videoFile changed');
    
    if (!videoFile) {
      console.log('🎣 useVideoPlayer.js: No video file, resetting state');
      setVideoUrl(null);
      setIsVideoReady(false);
      return;
    }

    console.log('🎣 useVideoPlayer.js: Processing video file:', videoFile.name);
    
    // Convert file path to app:// URL
    const url = convertToFileUrl(videoFile.path);
    console.log('🎣 useVideoPlayer.js: Generated video URL:', url);
    setVideoUrl(url);
    
    // For now, assume video is ready once URL is set
    // In a more complex implementation, we'd wait for video metadata
    setIsVideoReady(true);
    console.log('🎣 useVideoPlayer.js: Video marked as ready');
  }, [videoFile]);

  console.log('🎣 useVideoPlayer.js: Returning hook values...');
  return {
    videoUrl,
    isVideoReady
  };
};

console.log('🎣 useVideoPlayer.js: useVideoPlayer hook defined, exporting...');
export default useVideoPlayer;
