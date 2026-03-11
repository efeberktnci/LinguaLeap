import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleProp, Text, TextStyle } from 'react-native';

type Props = {
  symbol: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

const normalizeSymbol = (value: string) => value.replace(/\uFE0F/g, '');

const SYMBOL_MAP: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  '\u2764': 'heart',
  '\u2661': 'heart-outline',
  '\u{1F494}': 'heart-outline',
  '\u{1F389}': 'sparkles',
  '\u2705': 'checkmark-circle',
  '\u2713': 'checkmark',
  '\u274C': 'close-circle',
  '\u{1F525}': 'flame',
  '\u26A1': 'flash',
  '\u{1F3C6}': 'trophy',
  '\u{1F48E}': 'diamond',
  '\u{1F4A0}': 'diamond',
  '\u{1F3AF}': 'star',
  '\u{1F4DA}': 'library',
  '\u{1F4D6}': 'book',
  '\u{1F31F}': 'star',
  '\u{1F44B}': 'star',
  '\u{1F399}': 'mic',
  '\u{1F9E0}': 'analytics',
  '\u{1F3A7}': 'headset',
  '\u{1F381}': 'gift',
  '\u2708': 'airplane',
  '\u{1F355}': 'pizza',
  '\u{1F6CD}': 'cart',
  '\u{1F4BC}': 'briefcase',
  '\u{1F6E1}\uFE0F': 'shield',
  '\u{1F6E1}': 'shield',
  '\u23F1': 'timer-outline',
  '\u{1F947}': 'trophy',
  '\u{1F948}': 'trophy',
  '\u{1F949}': 'trophy',
  '\u{1F534}': 'ellipse',
  '\u{1F49A}': 'heart',
  '\u{1F49C}': 'heart',
  '\u{1F90D}': 'heart',
  '\u{1F5A4}': 'heart',
};

const AppSymbol: React.FC<Props> = ({ symbol, size = 20, color, style }) => {
  const normalized = normalizeSymbol(symbol);
  const iconName = SYMBOL_MAP[normalized];

  if (iconName) {
    return <Ionicons name={iconName} size={size} color={color} style={style} />;
  }

  return <Text style={style}>{symbol}</Text>;
};

export default AppSymbol;
