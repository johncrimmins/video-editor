/**
 * Simple feature flag hook for component versioning
 * Returns true if V2 components should be used
 */
export const useComponentVersion = () => {
  // Check environment variable for V2 components
  return process.env.REACT_APP_USE_V2_COMPONENTS === 'true';
};

/**
 * Hook to get component version for specific screen
 * @param {string} screen - Screen name (home, projects, etc.)
 * @returns {boolean} - Whether to use V2 components for this screen
 */
export const useScreenComponentVersion = (screen) => {
  const useV2 = useComponentVersion();
  
  // For now, all screens use the same version
  // In the future, we could have per-screen flags
  return useV2;
};
