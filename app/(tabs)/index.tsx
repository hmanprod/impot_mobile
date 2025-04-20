import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, FlatList, TouchableOpacity, ActivityIndicator, Image, SafeAreaView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { PhosphorIcon } from '@/components/ui/PhosphorIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useArticleSearch } from '@/hooks/useSupabase';
import type { SearchResult } from '@/types';
import { SearchResultItem } from '@/components/SearchResultItem';
import { SearchSkeleton } from '@/components/SearchSkeleton';


// Define a type for recent searches with timestamps
interface RecentSearch {
  query: string;
  timestamp: number;
}

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const { navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const { searchByText } = useArticleSearch();
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    // Load recent searches when component mounts
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const savedSearches = await AsyncStorage.getItem('recentSearches');
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    try {
      // Add to the beginning and remove duplicates
      const timestamp = Math.floor(Date.now() / 1000);
      const updatedSearches = [{ query, timestamp }, ...recentSearches.filter(item => item.query !== query)].slice(0, 5);
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  // handleSearch accepte maintenant un paramètre optionnel pour la query
  const handleSearch = async (queryOverride?: string) => {
    const query = (queryOverride !== undefined ? queryOverride : searchQuery).trim();
    if (!query) return;

    saveRecentSearch(query);
    setLoading(true);

    try {
      // Recherche unique sur code + texte
      const fetchedResults = await searchByText(query);
      setResults(fetchedResults);
    } catch (error) {
      console.error("Erreur lors de la recherche d'articles:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // handleRecentSearchPress passe la query au handleSearch
  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const navigateToTab = (tabName: string) => {
    switch(tabName) {
      case 'index':
        navigate('/');
        break;
      case 'sommaires':
        navigate('/(tabs)/sommaires');
        break;
      case 'epingles':
        navigate('/(tabs)/epingles');
        break;
      case 'parametres':
        navigate('/(tabs)/parametres');
        break;
      default:
        navigate('/');
    }
  };

  // Format timestamp to "il y a..." format
  const formatTimeAgo = (timestamp: number): string => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    
    if (diff < 60) {
      return 'il y a quelques secondes';
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (diff < 604800) {
      const days = Math.floor(diff / 86400);
      return `il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else if (diff < 2592000) {
      const weeks = Math.floor(diff / 604800);
      return `il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    } else if (diff < 31536000) {
      const months = Math.floor(diff / 2592000);
      return `il y a ${months} mois`;
    } else {
      const years = Math.floor(diff / 31536000);
      return `il y a ${years} an${years > 1 ? 's' : ''}`;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        {!loading && results.length === 0 && (
          <View style={styles.welcomeContainer}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <ThemedText style={styles.welcomeText}>
              Que souhaitez-vous rechercher{'\n'}aujourd'hui?
            </ThemedText>
          </View>
        )}
        
        <View style={styles.searchContainer}>
          <View style={[
            styles.searchInputContainer,
            { backgroundColor: Colors[colorScheme ?? 'light'].card }
          ]}>
            <PhosphorIcon
              name="MagnifyingGlass"
              size={20}
              color={Colors[colorScheme ?? 'light'].icon}
              weight="regular"
            />
            <TextInput
              style={[
                styles.searchInputText,
                { color: Colors[colorScheme ?? 'light'].text }
              ]}
              placeholder="Rechercher un article ou un texte..."
              placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={(e) => handleSearch(e.nativeEvent.text)}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => {
                setSearchQuery('');
                setResults([]);
              }}>
                <PhosphorIcon
                  name="X"
                  size={20}
                  color={Colors[colorScheme ?? 'light'].icon}
                  weight="bold"
                />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => handleSearch()}
            disabled={!searchQuery.trim()}>
            <PhosphorIcon
              name="MagnifyingGlass"
              size={20}
              color="white"
              weight="bold"
            />
            <Text style={styles.searchButtonText}>Rechercher un article</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <SearchSkeleton />
        )}
        {!loading && results.length === 0 && (
          <View style={styles.recentSearchesWrapper}>
            <View style={styles.recentSearchesContainer}>
              {recentSearches.length > 0 && (
                <>
                  <ThemedText style={styles.recentSearchesTitle}>
                    Recherches récentes
                  </ThemedText>
                  <FlatList
                    data={recentSearches}
                    keyExtractor={(item, index) => `search-${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity 
                        style={styles.recentSearchItem}
                        onPress={() => handleRecentSearchPress(item.query)}>
                        <PhosphorIcon
                          name="Clock"
                          size={16}
                          color={Colors[colorScheme ?? 'light'].icon}
                          style={styles.recentSearchIcon}
                          weight="regular"
                        />
                        <ThemedText style={styles.recentSearchTextItem}>{item.query}</ThemedText>
                        <ThemedText style={styles.recentSearchTime}>{formatTimeAgo(item.timestamp)}</ThemedText>
                      </TouchableOpacity>
                    )}
                  />
                </>
              )}
            </View>
          </View>
        )}
        {!loading && results.length > 0 && (
          <View style={styles.resultsContainer}>
            <ThemedText style={styles.resultsTitle}>Résultats</ThemedText>
            <FlatList
              data={results}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <SearchResultItem
                  item={item}
                  onPress={() => navigate({
                    pathname: '/article/[id]',
                    params: { id: item.id.toString(), search: searchQuery }
                  })}
                  styles={styles}
                  searchQuery={searchQuery || ''}
                />
              )}
            />
          </View>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  welcomeContainer: {
    alignItems: 'flex-start',
    marginTop: 40,
    marginBottom: 30,
    paddingHorizontal: 24,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  welcomeText: {
    fontSize: 32,
    lineHeight: 37,
    color: '#000000',
    fontFamily: 'System',
    fontWeight: '700',
    textAlign: 'left',
    marginBottom: 0,
  },
  searchContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  searchInputContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputText: {
    flex: 1,
    height: 50,
    fontSize: 14,
    paddingHorizontal: 8,
  },
  searchButton: {
    height: 50,
    backgroundColor: '#000000',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    marginBottom: 8,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
  },
  recentSearchesContainer: {
    marginBottom: 50,
    paddingHorizontal: 24,
  },
  recentSearchesTitle: {
    marginBottom: 10,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 0,
    boxShadow: 'none',
  },
  recentSearchTextItem: {
    fontSize: 13,
    flex: 1,
  },
  recentSearchTime: {
    fontSize: 11,
    color: '#888',
    marginLeft: 'auto',
    fontStyle: 'italic',
  },
  recentSearchIcon: {
    marginRight: 12,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    marginBottom: 50,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  resultItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultItemCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  resultItemTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  resultItemContent: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentSearchesWrapper: {
    flex: 1,
    paddingHorizontal: 24,
  },
});
