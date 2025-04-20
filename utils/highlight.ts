import React, { ReactNode } from 'react';
import { Text } from 'react-native';

export function highlightText(text: string, term: string): ReactNode[] {
  if (!term) return [text];
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")})`, 'gi');
  return text.split(regex).map(function(part: string, i: number): ReactNode {
    return regex.test(part)
      ? React.createElement(Text, { key: i, style: { backgroundColor: '#ffe066', color: '#000', fontWeight: '600' } }, part)
      : part;
  });
}
