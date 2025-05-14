import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

function flattenStyles(style: any): any[] {
  if (Array.isArray(style)) {
    return style.flat().filter(Boolean);
  }
  return [style].filter(Boolean);
}

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <View
      style={flattenStyles([{ backgroundColor }, style])}
      {...otherProps}
    />
  );
}
