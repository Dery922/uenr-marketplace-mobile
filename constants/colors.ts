// constants/colors.ts
export const colors = {
  // Primary Colors (Choose ONE direction)
  
  // OPTION 1: Navy Blue Theme (matches login screens)
  primary: '#1E3A8A',
  primaryLight: '#3B82F6',
  primaryDark: '#1E40AF',
  
  // OPTION 2: Light Blue Theme (matches home screen)
  // primary: '#00BFFF',
  // primaryLight: '#87CEFA',
  // primaryDark: '#0096CC',
  
//   // OPTION 3: Professional Navy Blue (Recommended - works with both)
//   primary: '#1E3A8A',       // Main brand color
//   primaryLight: '#3B82F6',  // For highlights
//   primaryDark: '#1E40AF',   // For pressed states
  
  // Secondary Colors
  secondary: '#38B2AC',     // Teal for accents
  success: '#38A169',       // Green for success states
  warning: '#ED8936',       // Orange for warnings
  danger: '#E53E3E',        // Red for errors
  
  // Neutrals (consistent across all screens)
  background: '#F8FAFC',    // Light background
  surface: '#FFFFFF',       // Card/container backgrounds
  border: '#E2E8F0',       // Borders
  
  // Text Colors
  textPrimary: '#1A365D',   // Dark blue for main text
  textSecondary: '#718096', // Gray for secondary text
  textTertiary: '#A0AEC0',  // Light gray for hints
  textOnPrimary: '#FFFFFF', // Text on colored backgrounds
  
  // Overlays
  overlayLight: 'rgba(255, 255, 255, 0.2)',
  overlayDark: 'rgba(0, 0, 0, 0.1)',
  
  // Category Colors (for home screen)
  categoryBooks: '#4299E1',
  categoryElectronics: '#38B2AC',
  categoryClothing: '#ED64A6',
  categoryAccessories: '#9F7AEA',
  categorySoftware: '#48BB78',
  categorySupplies: '#ED8936',
};

export const gradients = {
  primary: ['#1E3A8A', '#3B82F6'], // For login screen curve
  secondary: ['#38B2AC', '#4299E1'],
};

// For theme.js file you mentioned
export const theme = {
  colors,
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 25,
  },
};