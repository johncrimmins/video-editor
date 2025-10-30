/**
 * Simple test for thumbnail generation
 * This can be run in the renderer process to test thumbnail functionality
 */

import { generateDefaultThumbnail } from '../shared/domains/video';

// Test thumbnail generation
const testThumbnailGeneration = async () => {
  console.log('🧪 Testing thumbnail generation...');
  
  try {
    // This would need a real video file path
    const testVideoPath = '/path/to/test/video.mp4';
    const testThumbnailPath = '/path/to/test/thumbnail.jpg';
    
    const result = await generateDefaultThumbnail(testVideoPath, testThumbnailPath);
    
    if (result.success) {
      console.log('✅ Thumbnail generation test passed:', result);
    } else {
      console.error('❌ Thumbnail generation test failed:', result);
    }
  } catch (error) {
    console.error('❌ Thumbnail generation test error:', error);
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testThumbnailGeneration = testThumbnailGeneration;
}

export { testThumbnailGeneration };
