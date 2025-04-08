import React from 'react';
import { StyleSheet } from 'react-native';
import { PhosphorIcon } from './PhosphorIcon';

export function TabBarPhosphorIcon(props: {
  name: React.ComponentProps<typeof PhosphorIcon>['name'];
  color: string;
}) {
  return <PhosphorIcon size={24} style={styles.icon} {...props} weight="fill" />;
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: -3,
  },
});
