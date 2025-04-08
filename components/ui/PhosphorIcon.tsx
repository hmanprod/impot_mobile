import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import * as PhosphorIcons from 'phosphor-react-native';

type IconName = keyof typeof PhosphorIcons;

export function PhosphorIcon({
  name,
  size = 24,
  color,
  weight = 'regular',
  style,
}: {
  name: IconName;
  size?: number;
  color: string;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  style?: StyleProp<ViewStyle>;
}) {
  const IconComponent = PhosphorIcons[name] as React.ComponentType<{
    size?: number;
    color?: string;
    weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
    style?: StyleProp<ViewStyle>;
  }>;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Phosphor Icons`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      color={color}
      weight={weight}
      style={style}
    />
  );
}
