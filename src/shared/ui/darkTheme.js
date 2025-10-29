/**
 * Unified theme constants for modern UI
 * Consolidates legacy theme and dark theme into single system
 * Based on the reference design with purple/violet accents
 */

export const darkTheme = {
  // Backgrounds
  background: '#0f0f0f',
  backgroundSecondary: '#1a1a1a',
  sidebar: '#0a0a0a',
  card: '#1e1e1e',
  cardHover: '#252525',
  light: '#f9f9f9', // Legacy compatibility
  
  // Borders
  border: '#2a2a2a',
  borderLight: '#333333',
  
  // Primary colors (Purple/Violet)
  primary: '#6366f1',
  primaryHover: '#4f46e5',
  primaryLight: '#818cf8',
  primaryDark: '#3730a3',
  
  // Legacy primary colors (for backward compatibility)
  secondary: '#6c757d', // Legacy gray
  
  // Text colors
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  textMuted: '#666666',
  textDisabled: '#404040',
  
  // Status colors
  success: '#10b981',
  successBg: '#064e3b',
  error: '#ef4444',
  errorBg: '#7f1d1d',
  danger: '#ef4444', // Legacy compatibility
  warning: '#f59e0b',
  warningBg: '#78350f',
  
  // Interactive elements
  hover: '#2a2a2a',
  active: '#3a3a3a',
  focus: '#6366f1',
  
  // Legacy colors (for backward compatibility)
  dark: '#333',
  
  // Shadows
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
};

export const darkSpacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
  xxxxl: '48px',
};

// Legacy spacing (for backward compatibility)
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '10px',
  lg: '15px',
  xl: '20px',
  xxl: '30px',
  xxxl: '40px',
};

export const darkBorderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

// Legacy border radius (for backward compatibility)
export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
};

export const darkFontSizes = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
  xxxxl: '48px',
};

// Legacy font sizes (for backward compatibility)
export const fontSizes = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
};

export const darkFontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Legacy shadows (for backward compatibility)
export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 2px 4px rgba(0,0,0,0.1)',
  lg: '0 4px 8px rgba(0,0,0,0.15)',
};

