import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, FlatList, TouchableOpacity, ActivityIndicator, Image, SafeAreaView, Text } from 'react-native';
import { router, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { PhosphorIcon } from '@/components/ui/PhosphorIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useArticleSearch } from '@/hooks/useSupabase';
import { SearchResult } from '@/types';

// Define a type for recent searches with timestamps
interface RecentSearch {
  query: string;
  timestamp: number;
}

// Sample data with the correct type structure
const sampleArticles: SearchResult[] = [
  { 
    id: 1, 
    code: "ART. 197", 
    title: "Barème de l'impôt sur le revenu", 
    type: "article", 
    content: "I. En ce qui concerne les contribuables visés à l'article 4 B, il est fait application du tarif progressif ci-après : Fraction du revenu imposable (1 part) / Taux : Jusqu'à 10 777 € / 0% ; De 10 778 € à 27 478 € / 11% ; De 27 479 € à 78 570 € / 30% ; De 78 571 € à 168 994 € / 41% ; Au-delà de 168 994 € / 45%", 
    highlight: "" 
  },
  { 
    id: 2, 
    code: "ART. 200", 
    title: "Réduction d'impôt accordée au titre des dons", 
    type: "article", 
    content: "1. Ouvrent droit à une réduction d'impôt sur le revenu égale à 66 % de leur montant les sommes prises dans la limite de 20 % du revenu imposable qui correspondent à des dons et versements effectués par les contribuables domiciliés en France.", 
    highlight: "" 
  },
  { 
    id: 3, 
    code: "ART. 199", 
    title: "Crédit d'impôt pour la transition énergétique", 
    type: "article", 
    content: "Les contribuables domiciliés en France peuvent bénéficier d'un crédit d'impôt sur le revenu au titre des dépenses effectivement supportées pour la contribution à la transition énergétique du logement dont ils sont propriétaires, locataires ou occupants à titre gratuit et qu'ils affectent à leur habitation principale.", 
    highlight: "" 
  },
  { 
    id: 4, 
    code: "ART. 4 B", 
    title: "Domicile fiscal en France", 
    type: "article", 
    content: "1. Sont considérées comme ayant leur domicile fiscal en France : a. Les personnes qui ont en France leur foyer ou le lieu de leur séjour principal ; b. Celles qui exercent en France une activité professionnelle, salariée ou non, à moins qu'elles ne justifient que cette activité y est exercée à titre accessoire ; c. Celles qui ont en France le centre de leurs intérêts économiques.", 
    highlight: "" 
  },
  { 
    id: 5, 
    code: "ART. 256", 
    title: "Opérations imposables à la TVA", 
    type: "article", 
    content: "I. Sont soumises à la taxe sur la valeur ajoutée les livraisons de biens et les prestations de services effectuées à titre onéreux par un assujetti agissant en tant que tel. II. 1° Est considéré comme livraison d'un bien, le transfert du pouvoir de disposer d'un bien corporel comme un propriétaire.", 
    highlight: "" 
  },
  { 
    id: 6, 
    code: "ART. 13", 
    title: "Définition du revenu imposable", 
    type: "article", 
    content: "1. Le revenu net global est constitué par le total des revenus nets des catégories suivantes : revenus fonciers, bénéfices industriels et commerciaux, rémunérations, pensions et rentes viagères, bénéfices des professions non commerciales, revenus de capitaux mobiliers, plus-values de cession à titre onéreux de biens ou de droits de toute nature, bénéfices de l'exploitation agricole.", 
    highlight: "" 
  },
  { 
    id: 7, 
    code: "ART. 1649 A", 
    title: "Déclaration des comptes ouverts à l'étranger", 
    type: "article", 
    content: "Les personnes physiques, les associations, les sociétés n'ayant pas la forme commerciale, domiciliées ou établies en France, sont tenues de déclarer, en même temps que leur déclaration de revenus ou de résultats, les références des comptes ouverts, utilisés ou clos à l'étranger.", 
    highlight: "" 
  },
  { 
    id: 8, 
    code: "ART. 256 A", 
    title: "Assujettis à la TVA", 
    type: "article", 
    content: "Sont assujetties à la taxe sur la valeur ajoutée les personnes qui effectuent de manière indépendante une des activités économiques mentionnées au cinquième alinéa, quels que soient le statut juridique de ces personnes, leur situation au regard des autres impôts et la forme ou la nature de leur intervention.", 
    highlight: "" 
  },
  { 
    id: 9, 
    code: "ART. 257", 
    title: "Opérations immobilières soumises à la TVA", 
    type: "article", 
    content: "I. Les opérations concourant à la production ou à la livraison d'immeubles sont soumises à la taxe sur la valeur ajoutée dans les conditions qui suivent. II. Sont considérés comme terrains à bâtir les terrains sur lesquels des constructions peuvent être autorisées en application d'un plan local d'urbanisme.", 
    highlight: "" 
  },
  { 
    id: 10, 
    code: "ART. 258", 
    title: "Lieu des livraisons de biens pour la TVA", 
    type: "article", 
    content: "I. Le lieu de livraison de biens meubles corporels est réputé se situer en France lorsque le bien se trouve en France au moment de la livraison. II. Le lieu de livraison des biens expédiés ou transportés par le fournisseur, par l'acquéreur ou par un tiers est réputé se situer en France lorsque le bien se trouve en France au moment du départ de l'expédition ou du transport.", 
    highlight: "" 
  },
  { 
    id: 11, 
    code: "ART. 271", 
    title: "Droit à déduction de la TVA", 
    type: "article", 
    content: "I. 1. La taxe sur la valeur ajoutée qui a grevé les éléments du prix d'une opération imposable est déductible de la taxe sur la valeur ajoutée applicable à cette opération. 2. Le droit à déduction prend naissance lorsque la taxe déductible devient exigible chez le redevable.", 
    highlight: "" 
  },
  { 
    id: 12, 
    code: "ART. 287", 
    title: "Déclaration de TVA", 
    type: "article", 
    content: "1. Tout redevable de la taxe sur la valeur ajoutée est tenu de remettre au service des impôts dont il dépend une déclaration conforme au modèle prescrit par l'administration. 2. Les redevables soumis au régime réel normal d'imposition déposent mensuellement la déclaration visée au 1 indiquant, d'une part, le montant total des opérations réalisées, d'autre part, le détail des opérations taxables.", 
    highlight: "" 
  },
  { 
    id: 13, 
    code: "ART. 293 B", 
    title: "Franchise en base de TVA", 
    type: "article", 
    content: "I. Les assujettis qui réalisent un chiffre d'affaires inférieur à certains seuils bénéficient d'une franchise qui les dispense du paiement de la taxe sur la valeur ajoutée. II. Le chiffre d'affaires limite de la franchise est fixé à 85 800 € pour les livraisons de biens et 34 400 € pour les prestations de services.", 
    highlight: "" 
  }
];

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const { navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'code' | 'text'>('code');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const { searchByCode, searchByText } = useArticleSearch();
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([
    { query: 'Article 197', timestamp: Math.floor(Date.now() / 1000) - 300 }, // 5 minutes ago
    { query: 'Impôt sur le revenu', timestamp: Math.floor(Date.now() / 1000) - 3600 }, // 1 hour ago
    { query: 'Crédit d\'impôt', timestamp: Math.floor(Date.now() / 1000) - 7200 }, // 2 hours ago
    { query: 'TVA', timestamp: Math.floor(Date.now() / 1000) - 86400 }, // 1 day ago
    { query: 'Déclaration fiscale', timestamp: Math.floor(Date.now() / 1000) - 172800 } // 2 days ago
  ]);

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

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Save the search query to recent searches
    saveRecentSearch(searchQuery);
    
    // Set loading state
    setLoading(true);
    
    // Simulate search results with sample data
    const filteredResults = sampleArticles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      article.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.content && article.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    // If no matches in sample data, show all sample data
    const resultsToShow = filteredResults.length > 0 ? filteredResults : sampleArticles;
    
    // Simulate a brief loading delay for realism
    setTimeout(() => {
      // Update the results state directly
      setResults(resultsToShow);
      setLoading(false);
    }, 500);
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
    
    // Set loading state
    setLoading(true);
    
    // Simulate search results with sample data
    const filteredResults = sampleArticles.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) || 
      article.code.toLowerCase().includes(query.toLowerCase()) ||
      (article.content && article.content.toLowerCase().includes(query.toLowerCase()))
    );
    
    // If no matches in sample data, show all sample data
    const resultsToShow = filteredResults.length > 0 ? filteredResults : sampleArticles;
    
    // Simulate a brief loading delay for realism
    setTimeout(() => {
      // Update the results state directly
      setResults(resultsToShow);
      setLoading(false);
    }, 500);
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
              source={require('@/assets/images/icon.png')} 
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
              onSubmitEditing={handleSearch}
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
            onPress={handleSearch}
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

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : results.length > 0 ? (
          <View style={styles.resultsContainer}>
            <ThemedText style={styles.resultsTitle}>Résultats</ThemedText>
            <FlatList
              data={results}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.resultItem}
                  onPress={() => navigate(`/article/${item.id}`)}
                >
                  <View style={styles.resultItemHeader}>
                    <ThemedText style={styles.resultItemCode}>{item.code}</ThemedText>
                    <PhosphorIcon
                      name="ArrowSquareOut"
                      size={16}
                      color="#666"
                      weight="regular"
                    />
                  </View>
                  <ThemedText style={styles.resultItemTitle}>{item.title}</ThemedText>
                  <ThemedText style={styles.resultItemContent} numberOfLines={2}>
                    {item.content}
                  </ThemedText>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : (
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
