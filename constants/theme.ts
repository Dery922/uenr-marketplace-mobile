// constants/theme.js
export const theme = {
  colors: {
    // Primary (use this everywhere instead of hardcoded colors)
    primary: '#1E3A8A',        // Navy blue - main brand color
    primaryLight: '#3B82F6',   // Lighter blue for highlights
    primaryDark: '#00004d',    // Darker blue for some buttons
    
    // Backgrounds
    background: '#F8FAFC',     // Light gray background
    surface: '#FFFFFF',        // White for cards/containers
    
    // Text
    textPrimary: '#1A365D',    // Dark blue for main text
    textSecondary: '#718096',  // Gray for secondary text
    textOnPrimary: '#FFFFFF',  // White text on colored backgrounds
    
    // Borders
    border: '#E2E8F0',
    
    // Status
    success: '#38A169',
    warning: '#ED8936',
    error: '#E53E3E',
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
};


export const lightTheme = {
  background: '#FFFFFF',
  card: '#F7FAFC',
  text: '#2D3748',
  subText: '#718096',
  border: '#F1F5F9',
  primary: '#00BFFF',
  icon: '#4A5568',
};

export const darkTheme = {
  background: '#0B1120',   // deeper dark
  card: '#111827',         // card surfaces
  text: '#F9FAFB',
  subText: '#9CA3AF',
  border: '#1F2937',
  primary: '#38BDF8',      // softer blue
  icon: '#D1D5DB',
};
