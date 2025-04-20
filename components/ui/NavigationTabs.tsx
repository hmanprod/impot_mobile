import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { PhosphorIcon } from '@/components/ui/PhosphorIcon';

// Définition stricte des routes et icônes
const tabs: {
  route: '/' | '/(tabs)/sommaires' | '/(tabs)/epingles' | '/(tabs)/parametres';
  icon: 'Binoculars' | 'ListMagnifyingGlass' | 'Bookmark' | 'UserCircleGear';
  label: string;
}[] = [
  {
    route: '/',
    icon: 'Binoculars',
    label: 'Recherche',
  },
  {
    route: '/(tabs)/sommaires',
    icon: 'ListMagnifyingGlass',
    label: 'Sommaires',
  },
  {
    route: '/(tabs)/epingles',
    icon: 'Bookmark',
    label: 'Épinglés',
  },
  {
    route: '/(tabs)/parametres',
    icon: 'UserCircleGear',
    label: 'Paramètres',
  },
];

export const NavigationTabs = () => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 70}}>
      <View style={[
        styles.tabBar,
        { marginBottom: 10 + insets.bottom }
      ]}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.route}
            onPress={() => router.replace(tab.route)}
            style={styles.tabButton}
          >
            <PhosphorIcon
              name={tab.icon}
              size={24}
              color={'white'}
              weight="fill"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderRadius: 20,
    marginHorizontal: 16,
    height: 60,
    position: 'absolute',
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    borderTopWidth: 0,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 0,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
