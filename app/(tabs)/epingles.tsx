import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useBookmarks } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase';

export default function EpinglesScreen() {
  const colorScheme = useColorScheme();
  const [userId, setUserId] = useState<string | null>(null);
  const { loading, bookmarks, removeBookmark } = useBookmarks(userId);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status on component mount
  React.useEffect(() => {
    checkAuth();
    
    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        setUserId(session?.user?.id || null);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    setUserId(session?.user?.id || null);
  };

  const handleLogin = async () => {
    // In a real app, you would implement a proper login flow
    Alert.alert(
      "Authentication Required",
      "You need to be logged in to view your bookmarks.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Login",
          onPress: () => router.push("/auth")
        }
      ]
    );
  };

  const handleBookmarkPress = (bookmarkId: number, articleId: number) => {
    router.push(`/article/${articleId}`);
  };

  const handleRemoveBookmark = (bookmarkId: number) => {
    Alert.alert(
      "Remove Bookmark",
      "Are you sure you want to remove this bookmark?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeBookmark(bookmarkId)
        }
      ]
    );
  };

  const renderBookmarkItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.bookmarkItem}
      onPress={() => handleBookmarkPress(item.id, item.article_id)}>
      <View style={styles.bookmarkContent}>
        <View style={styles.bookmarkHeader}>
          <ThemedText type="defaultSemiBold">{item.code_sections.code}</ThemedText>
          <ThemedText style={styles.bookmarkType}>{item.code_sections.type}</ThemedText>
        </View>
        <ThemedText>{item.code_sections.title}</ThemedText>
        {item.notes && (
          <ThemedText style={styles.bookmarkNotes} numberOfLines={2}>
            {item.notes}
          </ThemedText>
        )}
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveBookmark(item.id)}>
        <IconSymbol
          name="trash"
          size={20}
          color={Colors[colorScheme ?? 'light'].icon}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title">Épingles</ThemedText>
          <ThemedText type="subtitle">Vos articles sauvegardés</ThemedText>
        </View>
        
        <View style={styles.authPrompt}>
          <IconSymbol
            name="lock"
            size={50}
            color={Colors[colorScheme ?? 'light'].icon}
          />
          <ThemedText type="subtitle">Connexion requise</ThemedText>
          <ThemedText style={styles.authText}>
            Vous devez vous connecter pour accéder à vos articles épinglés
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint }
            ]}
            onPress={handleLogin}>
            <ThemedText style={styles.loginButtonText}>Se connecter</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Épingles</ThemedText>
        <ThemedText type="subtitle">Vos articles sauvegardés</ThemedText>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText>Chargement de vos épingles...</ThemedText>
        </View>
      ) : bookmarks.length > 0 ? (
        <FlatList
          data={bookmarks}
          renderItem={renderBookmarkItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.bookmarksList}
        />
      ) : (
        <View style={styles.emptyState}>
          <IconSymbol
            name="bookmark"
            size={50}
            color={Colors[colorScheme ?? 'light'].icon}
          />
          <ThemedText type="subtitle">Aucun article épinglé</ThemedText>
          <ThemedText style={styles.emptyStateText}>
            Épinglez des articles pour les retrouver facilement ici
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.browseButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint }
            ]}
            onPress={() => router.push('/')}>
            <ThemedText style={styles.browseButtonText}>Parcourir les articles</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginTop: 60,
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  bookmarksList: {
    paddingBottom: 16,
  },
  bookmarkItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  bookmarkContent: {
    flex: 1,
  },
  bookmarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bookmarkType: {
    fontSize: 12,
    textTransform: 'capitalize',
    opacity: 0.7,
  },
  bookmarkNotes: {
    marginTop: 8,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  removeButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyStateText: {
    textAlign: 'center',
    marginHorizontal: 32,
  },
  browseButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  authText: {
    textAlign: 'center',
    marginHorizontal: 32,
  },
  loginButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
