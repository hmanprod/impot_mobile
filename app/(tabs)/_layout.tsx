import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { PhosphorIcon } from '@/components/ui/PhosphorIcon';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderRadius: 20,
          marginHorizontal: 16,
          marginBottom: 10 + insets.bottom,
          height: 60,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
          borderTopWidth: 0,
          paddingHorizontal: 10,
          justifyContent: 'space-around',
          paddingTop: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Recherche',
          tabBarIcon: ({ color }: { color: string }) => <PhosphorIcon name="Binoculars" size={24} color={color} weight="fill" />,
        }}
      />
      <Tabs.Screen
        name="sommaires"
        options={{
          title: 'Sommaires',
          tabBarIcon: ({ color }: { color: string }) => <PhosphorIcon name="ListMagnifyingGlass" size={24} color={color} weight="fill" />,
        }}
      />
      <Tabs.Screen
        name="epingles"
        options={{
          title: 'Épinglés',
          tabBarIcon: ({ color }: { color: string }) => <PhosphorIcon name="Bookmark" size={24} color={color} weight="fill" />,
        }}
      />
      <Tabs.Screen
        name="parametres"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ color }: { color: string }) => <PhosphorIcon name="UserCircleGear" size={24} color={color} weight="fill" />,
        }}
      />
    </Tabs>
  );
}
