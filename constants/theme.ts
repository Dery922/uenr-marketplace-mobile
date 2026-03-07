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
  background: '#0F172A',
  card: '#1E293B',
  text: '#F1F5F9',
  subText: '#94A3B8',
  border: '#334155',
  primary: '#00BFFF',
  icon: '#CBD5F5',
};


