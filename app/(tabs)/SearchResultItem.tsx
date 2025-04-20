import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { PhosphorIcon } from '@/components/ui/PhosphorIcon';
import type { SearchResult } from '@/types';
import { highlightText } from '@/utils/highlight';

// On étend SearchResult pour inclure breadcrumb (qui vient de la vue SQL)
type SearchResultWithBreadcrumb = SearchResult & { breadcrumb?: string };

interface Props {
  item: SearchResultWithBreadcrumb;
  onPress: () => void;
  styles: any;
  searchQuery?: string;
}

function getSnippet(text: string, term: string, maxLines = 2, charsPerLine = 60) {
  const contextLen = Math.floor((maxLines * charsPerLine - (term?.length || 0)) / 2);
  if (!term) return text.slice(0, maxLines * charsPerLine) + (text.length > maxLines * charsPerLine ? '…' : '');
  const regex = new RegExp(term.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'), 'i');
  const match = regex.exec(text);
  if (!match) return text.slice(0, maxLines * charsPerLine) + (text.length > maxLines * charsPerLine ? '…' : '');
  const start = Math.max(0, match.index - contextLen);
  const end = Math.min(text.length, match.index + match[0].length + contextLen);
  let snippet = text.slice(start, end);
  if (start > 0) snippet = '…' + snippet;
  if (end < text.length) snippet = snippet + '…';
  return snippet;
}

export const SearchResultItem: React.FC<Props> = ({ item, onPress, styles, searchQuery }) => {
  // Utilise le breadcrumb texte s'il existe, sinon fallback
  let chemin = item.breadcrumb || '';
  // Retirer le dernier élément après le dernier '>'
  if (chemin.includes('>')) {
    chemin = chemin.split('>').slice(0, -1).join('>').trim();
  }
  const content = item.content ?? '';
  const snippet = getSnippet(content, searchQuery ?? '', 4); // 4 lignes souhaitées
  return (
    <TouchableOpacity style={styles.resultItem} onPress={onPress}>
      <View style={styles.resultItemHeader}>
        <ThemedText style={styles.resultItemCode}>
          {chemin}
        </ThemedText>
        <PhosphorIcon
          name="ArrowSquareOut"
          size={16}
          color="#666"
          weight="regular"
        />
      </View>
      <ThemedText style={styles.resultItemTitle}>{item.title}</ThemedText>
      <ThemedText style={styles.resultItemContent} numberOfLines={4}>
        {highlightText(snippet, searchQuery ?? '')}
      </ThemedText>
    </TouchableOpacity>
  );
};
