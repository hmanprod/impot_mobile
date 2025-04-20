import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';

export const SearchSkeleton: React.FC = () => (
  <View style={styles.container}>
    {[...Array(6)].map((_, i) => (
      <View key={i} style={styles.item}>
        <SkeletonLoader height={18} width={120} style={{ marginBottom: 8 }} />
        <SkeletonLoader height={16} width={180} style={{ marginBottom: 4 }} />
        <SkeletonLoader height={14} width={220} style={{ marginBottom: 8 }} />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  item: {
    marginBottom: 18,
  },
});
