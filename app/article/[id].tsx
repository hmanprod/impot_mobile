import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, ActivityIndicator, Share, Alert, Text } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useArticleDetails, useBookmarks } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase';
import { ArticleVersion } from '@/types';
import { ArticleBreadcrumb } from '@/components/ArticleBreadcrumb';
import { ArticleSkeleton } from '@/components/ArticleSkeleton';
import { NavigationTabs } from '@/components/ui/NavigationTabs';
import { highlightText } from '@/utils/highlight';

export default function ArticleDetailScreen() {
  const { id, search } = useLocalSearchParams();
  const articleId = typeof id === 'string' ? parseInt(id, 10) : null;
  const searchTerm = typeof search === 'string' ? search : '';
  const colorScheme = useColorScheme();
  const { loading, article, versions, refetch } = useArticleDetails(articleId);
  const [userId, setUserId] = useState<string | null>(null);
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks(userId);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<ArticleVersion | null>(null);
  const [showVersions, setShowVersions] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (bookmarks.length > 0 && articleId) {
      const bookmark = bookmarks.find(b => b.article_id === articleId);
      setIsBookmarked(!!bookmark);
    }
  }, [bookmarks, articleId]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUserId(session?.user?.id || null);
  };

  const handleSelectVersion = (version: ArticleVersion) => {
    setSelectedVersion(version);
    setShowVersions(false);
  };

  const renderVersionItem = (version: ArticleVersion) => (
    <TouchableOpacity
      key={version.id}
      style={styles.versionItem}
      onPress={() => handleSelectVersion(version)}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <ThemedText type="defaultSemiBold">
          Mise à jour du {new Date(version.effective_date).toLocaleDateString()}
        </ThemedText>
        <IconSymbol
          name="chevron.right"
          size={16}
          color={Colors[colorScheme ?? 'light'].icon}
          style={{ marginLeft: 8 }}
        />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ArticleSkeleton />
      </ThemedView>
    );
  }

  if (!article) {
    return (
      <ThemedView style={styles.errorContainer}>
        <IconSymbol
          name="exclamationmark.triangle"
          size={50}
          color={Colors[colorScheme ?? 'light'].icon}
        />
        <ThemedText type="subtitle">Article non trouvé</ThemedText>
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>Retour</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const displayContent = selectedVersion ? selectedVersion.version_content : article.content;

  return (
    <ThemedView style={styles.container}>
      {/* Affichage du chemin de fer si article présent et breadcrumb dispo */}
      <Stack.Screen
        options={{
          title: article.code,
          headerShown: true,
          headerBackTitle: 'Retour',
        }}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <View>
          
            <View style={{ flex: 1, marginRight: 10 }}>
              <ThemedText type="title">{article.title}</ThemedText>
              {/* Chemin de fer sous le header, à la place de la date */}
              {article && 'breadcrumb' in article && article.breadcrumb && (
                <ArticleBreadcrumb breadcrumb={article.breadcrumb} style={{ marginTop: 4, marginBottom: 0, color: Colors[colorScheme ?? 'light'].text, fontSize: 12 }} />
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ThemedText style={textStyles.versionDate}>
                  Dernière mise à jour: {new Date(article.version_date).toLocaleDateString()}
                </ThemedText>
                {(!selectedVersion || selectedVersion.effective_date === article.version_date) ? (
                  <IconSymbol
                    name="checkbox.green"
                    size={18}
                    color="#2ecc40"
                    style={{ marginLeft: 6 }}
                  />
                ) : (
                  <IconSymbol
                    name="cross.red"
                    size={18}
                    color="#ff4136"
                    style={{ marginLeft: 6 }}
                  />
                )}
              </View>
            </View>
        
          </View>
          
        </View>
        <ThemedView style={styles.contentBox}>
          {(displayContent || 'Aucun contenu disponible pour cet article.')
            .split('\n')
            .map((line, i) => (
              <ThemedText style={textStyles.articleContent} key={i}>
                {highlightText(line || '\u00A0', searchTerm)}
              </ThemedText>
            ))}
        </ThemedView>
        
        {versions.length > 0 && (
          <View style={styles.versionsContainer}>
            <TouchableOpacity
              style={styles.versionsButton}
              onPress={() => setShowVersions(!showVersions)}>
              <ThemedText type="defaultSemiBold">
                {selectedVersion ? 'Version du ' + new Date(selectedVersion.effective_date).toLocaleDateString() : 'Historique des versions'}
              </ThemedText>
              <IconSymbol
                name={showVersions ? 'minus' : 'plus'}
                size={18}
                color={Colors[colorScheme ?? 'light'].icon}
              />
            </TouchableOpacity>
            
            {showVersions && (
              <View style={styles.versionsList}>
                <TouchableOpacity
                  style={[styles.versionItem, !selectedVersion && styles.versionItemActive]}
                  onPress={() => setSelectedVersion(null)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={!selectedVersion ? styles.versionItemActiveText : {}}>
                      Version actuelle
                    </ThemedText>
                    <IconSymbol
                      name="chevron.right"
                      size={16}
                      color={Colors[colorScheme ?? 'light'].icon}
                      style={{ marginLeft: 8 }}
                    />
                  </View>
                </TouchableOpacity>
                {versions.map(renderVersionItem)}
              </View>
            )}
          </View>
        )}
      </ScrollView>
      
      {/* Navigation Tabs: */}
      <NavigationTabs />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 24,
  },
  contentBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    marginBottom: 24,
  },
  versionsContainer: {
    marginBottom: 16,
  },
  versionsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  versionsList: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  versionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  versionItemActive: {
    backgroundColor: Colors.light.tint,
  },
  versionItemActiveText: {
    color: 'white',
  },
});

const textStyles = StyleSheet.create({
  articleContent: {
    lineHeight: 22,
    textAlign: 'justify',
  },
  versionDate: {
    marginTop: 0,
    opacity: 0.7,
    fontSize: 12,
  },
});
