import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const SkeletonLoader: React.FC<{ height?: number; width?: number; style?: any; borderRadius?: number }> = ({ height = 20, width = '100%', style, borderRadius = 6 }) => (
  <View
    style={[
      styles.skeleton,
      { height, width, borderRadius, backgroundColor: Colors.light.cardOrange },
      style,
    ]}
  />
);

const styles = StyleSheet.create({
  skeleton: {
    marginVertical: 6,
    backgroundColor: Colors.light.cardOrange,
    overflow: 'hidden',
  },
});
