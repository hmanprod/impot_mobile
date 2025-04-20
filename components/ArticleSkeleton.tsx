import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';

export const ArticleSkeleton: React.FC = () => (
  <View style={styles.container}>
    <SkeletonLoader height={28} width={120} style={{ marginBottom: 8 }} />
    <SkeletonLoader height={18} width={220} style={{ marginBottom: 14 }} />
    <SkeletonLoader height={16} width={300} style={{ marginBottom: 20 }} />
    <SkeletonLoader height={16} width={260} style={{ marginBottom: 10 }} />
    <SkeletonLoader height={16} width={280} style={{ marginBottom: 10 }} />
    <SkeletonLoader height={16} width={240} style={{ marginBottom: 10 }} />
    <SkeletonLoader height={16} width={270} style={{ marginBottom: 10 }} />
    <SkeletonLoader height={16} width={250} style={{ marginBottom: 10 }} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
