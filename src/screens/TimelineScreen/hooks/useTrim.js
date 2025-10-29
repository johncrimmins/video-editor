import { calculateDuration, generateOutputPath } from '../../../shared/domains/timeline';
import { trimVideo } from '../../../shared/domains/video';

const useTrim = (videoFile, trimPoints) => {
  const applyTrim = async () => {
    if (!videoFile || !trimPoints) {
      throw new Error('Missing video file or trim points');
    }
    
    const { inTime, outTime } = trimPoints;
    const duration = calculateDuration(trimPoints);
    
    if (duration <= 0) {
      throw new Error('Invalid trim duration');
    }
    
    const outputPath = generateOutputPath(videoFile.path, inTime, outTime);
    
    if (!outputPath) {
      throw new Error('Failed to generate output path');
    }
    
    // Call video service IPC handler
    const result = await trimVideo({
      inputPath: videoFile.path,
      outputPath,
      startTime: inTime,
      duration
    });
    
    if (!result.success) {
      throw new Error('Trim operation failed');
    }
    
    return result;
  };
  
  return {
    applyTrim
  };
};

export default useTrim;

