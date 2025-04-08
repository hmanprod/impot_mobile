import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useHierarchy } from '@/hooks/useSupabase';
import { CodeSection, SectionType } from '@/types';

export default function SommairesScreen() {
  const colorScheme = useColorScheme();
  const { loading, sections, fetchChildSections } = useHierarchy();
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const [childSections, setChildSections] = useState<Record<number, CodeSection[]>>({});
  const [loadingChildren, setLoadingChildren] = useState<Record<number, boolean>>({});

  const getSectionIcon = (type: SectionType) => {
    switch (type) {
      case 'livre':
        return 'book.fill';
      case 'partie':
        return 'doc.text.fill';
      case 'titre':
        return 'list.bullet.indent';
      case 'chapitre':
        return 'list.bullet';
      case 'section':
        return 'list.dash';
      case 'sous_titre':
        return 'text.alignleft';
      case 'article':
        return 'doc.plaintext.fill';
      default:
        return 'doc.fill';
    }
  };

  const toggleSection = async (section: CodeSection) => {
    const sectionId = section.id;
    
    // If this is an article, navigate to article detail
    if (section.type === 'article') {
      router.push(`/article/${sectionId}`);
      return;
    }
    
    // Toggle expanded state
    const isExpanded = !!expandedSections[sectionId];
    setExpandedSections({ ...expandedSections, [sectionId]: !isExpanded });
    
    // If expanding and we don't have children yet, fetch them
    if (!isExpanded && !childSections[sectionId]) {
      setLoadingChildren({ ...loadingChildren, [sectionId]: true });
      const children = await fetchChildSections(sectionId);
      setChildSections({ ...childSections, [sectionId]: children });
      setLoadingChildren({ ...loadingChildren, [sectionId]: false });
    }
  };

  const renderSectionItem = ({ item, level = 0 }: { item: CodeSection; level?: number }) => {
    const isExpanded = !!expandedSections[item.id];
    const hasChildren = item.type !== 'article';
    const children = childSections[item.id] || [];
    const isLoading = !!loadingChildren[item.id];
    
    return (
      <View>
        <TouchableOpacity
          style={[
            styles.sectionItem,
            { paddingLeft: 16 + level * 20 }
          ]}
          onPress={() => toggleSection(item)}>
          <View style={styles.sectionItemContent}>
            <IconSymbol
              name={getSectionIcon(item.type)}
              size={20}
              color={Colors[colorScheme ?? 'light'].icon}
              style={styles.sectionIcon}
            />
            <View style={styles.sectionTextContainer}>
              <ThemedText type="defaultSemiBold">{item.code}</ThemedText>
              <ThemedText numberOfLines={2}>{item.title}</ThemedText>
            </View>
          </View>
          
          {hasChildren && (
            isLoading ? (
              <ActivityIndicator size="small" color={Colors[colorScheme ?? 'light'].tint} />
            ) : (
              <IconSymbol
                name={isExpanded ? 'chevron.down' : 'chevron.right'}
                size={20}
                color={Colors[colorScheme ?? 'light'].icon}
              />
            )
          )}
        </TouchableOpacity>
        
        {isExpanded && children.length > 0 && (
          <View>
            {children.map(child => (
              <View key={child.id}>
                {renderSectionItem({ item: child, level: level + 1 })}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Sommaire</ThemedText>
        <ThemedText type="subtitle">Parcourez la structure du code des impôts</ThemedText>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText>Chargement du sommaire...</ThemedText>
        </View>
      ) : (
        <FlatList
          data={sections}
          renderItem={renderSectionItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.sectionsList}
        />
      )}
      
      <TouchableOpacity
        style={[
          styles.floatingButton,
          { backgroundColor: Colors[colorScheme ?? 'light'].tint }
        ]}
        onPress={() => setExpandedSections({})}>
        <IconSymbol name="arrow.up.left.and.arrow.down.right" size={20} color="white" />
      </TouchableOpacity>
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
  sectionsList: {
    paddingBottom: 80,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  sectionItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionTextContainer: {
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
