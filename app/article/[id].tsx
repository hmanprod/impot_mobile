import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, ActivityIndicator, Share } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useArticleDetails, useBookmarks } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase';
import { ArticleVersion } from '@/types';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const articleId = typeof id === 'string' ? parseInt(id, 10) : null;
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

  const handleToggleBookmark = async () => {
    if (!userId) {
      router.push('/auth');
      return;
    }

    if (isBookmarked) {
      const bookmark = bookmarks.find(b => b.article_id === articleId);
      if (bookmark) {
        await removeBookmark(bookmark.id);
        setIsBookmarked(false);
      }
    } else if (articleId) {
      await addBookmark(articleId);
      setIsBookmarked(true);
    }
  };

  const handleShare = async () => {
    if (!article) return;

    try {
      await Share.share({
        message: `${article.code} - ${article.title}\n\n${article.content || ''}`,
        title: article.code,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
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
      <ThemedText type="defaultSemiBold">
        {new Date(version.effective_date).toLocaleDateString()}
      </ThemedText>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
        <ThemedText>Chargement de l'article...</ThemedText>
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
    <>
      <Stack.Screen
        options={{
          title: article.code,
          headerShown: true,
          headerBackTitle: 'Retour',
        }}
      />
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <ThemedText type="title">{article.code}</ThemedText>
            <ThemedText type="subtitle">{article.title}</ThemedText>
            <ThemedText style={styles.versionDate}>
              Dernière mise à jour: {new Date(article.version_date).toLocaleDateString()}
            </ThemedText>
          </View>
          
          <ThemedView style={styles.contentBox}>
            <ThemedText style={styles.articleContent}>
              {displayContent || 'Aucun contenu disponible pour cet article.'}
            </ThemedText>
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
                  name={showVersions ? 'chevron.up' : 'chevron.down'}
                  size={18}
                  color={Colors[colorScheme ?? 'light'].icon}
                />
              </TouchableOpacity>
              
              {showVersions && (
                <View style={styles.versionsList}>
                  <TouchableOpacity
                    style={[styles.versionItem, !selectedVersion && styles.versionItemActive]}
                    onPress={() => setSelectedVersion(null)}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={!selectedVersion ? styles.versionItemActiveText : {}}>
                      Version actuelle
                    </ThemedText>
                  </TouchableOpacity>
                  {versions.map(renderVersionItem)}
                </View>
              )}
            </View>
          )}
        </ScrollView>
        
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleToggleBookmark}>
            <IconSymbol
              name={isBookmarked ? 'bookmark.fill' : 'bookmark'}
              size={24}
              color={isBookmarked ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].icon}
            />
            <ThemedText style={styles.actionButtonText}>
              {isBookmarked ? 'Épinglé' : 'Épingler'}
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}>
            <IconSymbol
              name="square.and.arrow.up"
              size={24}
              color={Colors[colorScheme ?? 'light'].icon}
            />
            <ThemedText style={styles.actionButtonText}>Partager</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  versionDate: {
    marginTop: 8,
    opacity: 0.7,
  },
  contentBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    marginBottom: 24,
  },
  articleContent: {
    lineHeight: 22,
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
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  actionButtonText: {
    marginTop: 4,
    fontSize: 12,
  },
});
