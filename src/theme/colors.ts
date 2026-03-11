import { TextStyle, ViewStyle } from 'react-native';

export const COLORS = {
  primary: '#58CC02',
  primaryDark: '#46A302',
  primaryLight: '#89E219',
  primaryBg: '#DDF4BB',
  primarySoft: '#F0F9E4',

  secondary: '#CE82FF',
  secondaryDark: '#A855F7',
  secondarySoft: '#F6EDFF',

  accent: '#FF9600',
  accentDark: '#E08600',
  accentLight: '#FFC800',
  accentSoft: '#FFF1DA',

  correct: '#58CC02',
  incorrect: '#FF4B4B',
  warning: '#FFC800',

  blue: '#1CB0F6',
  blueDark: '#0A8FD4',
  blueLight: '#84D8FF',

  red: '#FF4B4B',
  redDark: '#EA2B2B',
  redLight: '#FF9090',

  white: '#FFFFFF',
  snow: '#F7F7F7',
  eel: '#4B4B4B',
  hare: '#AFAFAF',
  swan: '#E5E5E5',
  polar: '#F0F0F0',
  wolf: '#777777',
  owl: '#3C3C3C',
  black: '#1A1A1A',

  bgPrimary: '#FFFFFF',
  bgSecondary: '#F7F7F7',
  bgTertiary: '#235390',
  bgCanvas: '#F5F7F1',
  bgPanel: '#FFFEFB',
  bgPanelAlt: '#F8FBFF',
  ink: '#213027',
  inkSoft: '#55635B',
  mintLine: '#DCEBD0',
  skyLine: '#D6EAF8',

  border: '#E5E5E5',
  borderDark: '#CDCDCD',

  shadowGreen: '#46A302',
  shadowGray: '#D4D4D4',
  shadowBlue: '#0A8FD4',
  shadowRed: '#CC3B3B',
  shadowPurple: '#A855F7',
  shadowOrange: '#CC7A00',
} as const;

export type ColorKey = keyof typeof COLORS;

export const FONTS: Record<string, TextStyle> = {
  bold: { fontWeight: '800' },
  semiBold: { fontWeight: '700' },
  medium: { fontWeight: '600' },
  regular: { fontWeight: '400' },
};

export const SHADOWS: Record<string, ViewStyle> = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  borderRadius: 16,
  borderRadiusFull: 999,
} as const;

export const UI = {
  radius: {
    sm: 12,
    md: 18,
    lg: 24,
    pill: 999,
  },
  stroke: {
    soft: 1,
    strong: 2,
  },
  card: {
    base: {
      backgroundColor: '#FFFEFB',
      borderColor: '#E7EFE0',
    },
    cool: {
      backgroundColor: '#F8FBFF',
      borderColor: '#D6EAF8',
    },
    warm: {
      backgroundColor: '#FFF8EE',
      borderColor: '#F8DEB9',
    },
  },
} as const;
