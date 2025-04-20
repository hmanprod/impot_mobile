// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'magnifyingglass.circle.fill': 'search',
  'text.book.closed.fill': 'menu_book',
  'bookmark.fill': 'bookmark',
  'gearshape.fill': 'settings',
  'plus': 'add',
  'minus': 'remove',
  'checkbox.green': 'check-circle',
  'cross.red': 'cancel',
} as unknown as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>;

// Ajout explicite des noms MaterialIcons utilisés dans la logique personnalisée
export type IconSymbolName = keyof typeof MAPPING | 'checkbox.green' | 'cross.red' | 'check-circle' | 'cancel';

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  // Affichage direct pour les icônes custom
  if (name === 'checkbox.green') {
    return <MaterialIcons name="check-circle" size={size} color={color} style={style} />;
  }
  if (name === 'cross.red') {
    return <MaterialIcons name="cancel" size={size} color={color} style={style} />;
  }
  // Icônes classiques
  // @ts-ignore: mapping personnalisé
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
