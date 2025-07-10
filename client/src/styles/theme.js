export const theme = {
  colors: {
    // Colores principales
    primary: '#2C3E50',
    secondary: '#E74C3C',
    accent: '#F39C12',
    
    // Colores de texto
    text: '#2C3E50',
    textLight: '#7F8C8D',
    textDark: '#1A1A1A',
    heading: '#2C3E50',
    
    // Colores de fondo
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    backgroundDark: '#2C3E50',
    
    // Colores de estado
    success: '#27AE60',
    warning: '#F39C12',
    error: '#E74C3C',
    info: '#3498DB',
    
    // Colores neutros
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      100: '#F8F9FA',
      200: '#E9ECEF',
      300: '#DEE2E6',
      400: '#CED4DA',
      500: '#ADB5BD',
      600: '#6C757D',
      700: '#495057',
      800: '#343A40',
      900: '#212529'
    },
    
    // Gradientes
    gradient: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      dark: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
      light: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
    },
    
    // Sombras
    shadow: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
      xxl: '0 25px 50px rgba(0, 0, 0, 0.15)'
    }
  },
  
  fonts: {
    primary: '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: '"Playfair Display", "Georgia", serif',
    mono: '"Fira Code", "Consolas", monospace'
  },
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
    xxxl: '2rem'
  },
  
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem'
  },
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    xxl: '1.5rem',
    full: '9999px'
  },
  
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px'
  },
  
  transitions: {
    fast: '0.15s ease',
    standard: '0.3s ease',
    slow: '0.5s ease'
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060
  },
  
  // Configuración específica para componentes
  components: {
    button: {
      height: {
        sm: '2rem',
        md: '2.5rem',
        lg: '3rem'
      },
      padding: {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
        lg: '1rem 2rem'
      }
    },
    
    input: {
      height: {
        sm: '2rem',
        md: '2.5rem',
        lg: '3rem'
      },
      padding: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem'
      }
    },
    
    card: {
      padding: {
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem'
      }
    }
  }
}; 