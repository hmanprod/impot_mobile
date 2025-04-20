import React from 'react';
import type { SearchResult } from '@/types';
import { ThemedText } from '@/components/ThemedText';

// On étend SearchResult pour inclure breadcrumb (optionnel)
type SearchResultWithBreadcrumb = SearchResult & { breadcrumb?: string };

interface Props {
  breadcrumb: string | undefined;
  style?: any;
}

export const ArticleBreadcrumb: React.FC<Props> = ({ breadcrumb, style }) => {
  if (!breadcrumb) return null;

  // Retirer le dernier élément après le dernier '>'
  if (breadcrumb.includes('>')) {
    breadcrumb = breadcrumb.split('>').slice(0, -1).join('>').trim();
  }

  return (
    <ThemedText style={style} numberOfLines={1}>
      {breadcrumb}
    </ThemedText>
  );
};

// Composant simple pour mutualiser le rendu du chemin de fer
export const SearchResultBreadcrumb: React.FC<{ chemin: string; style?: any }> = ({ chemin, style }) => (
  <>
    <React.Fragment>
      <ThemedText style={style}>{chemin}</ThemedText>
    </React.Fragment>
  </>
);
