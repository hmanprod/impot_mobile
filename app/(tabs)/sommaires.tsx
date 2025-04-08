import React from 'react';
import { StyleSheet, View, SafeAreaView, Image } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { PhosphorIcon } from '@/components/ui/PhosphorIcon';

export default function SommairesScreen() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText style={styles.welcomeText}>
            Sommaires du code général{'\n'}des impôts
          </ThemedText>
        </View>

        <View style={styles.comingSoonCard}>
          <PhosphorIcon
            name="Hourglass"
            size={30}
            color="#000"
            weight="fill"
            style={styles.comingSoonIcon}
          />
          <ThemedText style={styles.comingSoonTitle}>
            Fonctionnalité à venir
          </ThemedText>
          <ThemedText style={styles.comingSoonText}>
            La navigation par sommaires sera bientôt disponible. Vous pourrez parcourir le code général des impôts par livre, titre, chapitre et section.
          </ThemedText>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  welcomeContainer: {
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 0,
  },
  logo: {
    width: 50,
    height: 50,
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
  },
  comingSoonCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  comingSoonIcon: {
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    color: '#444',
  },
});
