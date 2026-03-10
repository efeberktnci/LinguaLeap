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

const LABEL_MAP: Record<string, string> = {
  '\u{1F1EC}\u{1F1E7}': 'EN',
  '\u{1F1F9}\u{1F1F7}': 'TR',
  '\u{1F1E9}\u{1F1EA}': 'DE',
  '\u{1F1EA}\u{1F1F8}': 'ES',
  '\u{1F30D}': 'GL',
};

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
  '\u{1F3AF}': 'star',
  '\u{1F4DA}': 'library',
  '\u{1F4D6}': 'book',
  '\u{1F31F}': 'star',
  '\u{1F44B}': 'star',
  '\u{1F355}': 'pizza',
  '\u{1F6CD}': 'cart',
  '\u{1F4BC}': 'briefcase',
  '\u{1F6E1}\uFE0F': 'shield',
  '\u23F1': 'timer-outline',
  '\u{1F947}': 'trophy',
  '\u{1F948}': 'trophy',
  '\u{1F949}': 'trophy',
  '\u{1F989}': 'person-outline',
  '\u{1F469}\u200D\u{1F9B0}': 'person-outline',
  '\u{1F468}\u200D\u{1F9B1}': 'person-outline',
  '\u{1F981}': 'person-outline',
  '\u{1F436}': 'person-outline',
  '\u{1F431}': 'person-outline',
  '\u{1F98A}': 'person-outline',
  '\u{1F43C}': 'person-outline',
  '\u{1F428}': 'person-outline',
  '\u{1F438}': 'person-outline',
  '\u{1F427}': 'person-outline',
  '\u{1F42F}': 'person-outline',
  '\u{1F984}': 'person-outline',
  '\u{1F43B}': 'person-outline',
  '\u{1F430}': 'person-outline',
  '\u{1F435}': 'person-outline',
  '\u{1F98B}': 'person-outline',
  '\u{1F42C}': 'person-outline',
  '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}': 'people',
  '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F467}': 'people',
  '\u{1F468}\u200D\u{1F469}\u200D\u{1F466}\u200D\u{1F466}': 'people',
  '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}': 'people',
  '\u{1F468}\u200D\u{1F469}\u200D\u{1F466}': 'people',
};

const AppSymbol: React.FC<Props> = ({ symbol, size = 20, color, style }) => {
  const normalized = normalizeSymbol(symbol);
  const label = LABEL_MAP[normalized];
  const iconName = SYMBOL_MAP[normalized];

  if (label) {
    return <Text style={style}>{label}</Text>;
  }

  if (iconName) {
    return <Ionicons name={iconName} size={size} color={color} style={style} />;
  }

  return <Text style={style}>{symbol}</Text>;
};

export default AppSymbol;
