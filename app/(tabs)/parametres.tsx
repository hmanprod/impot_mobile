import React, { useState, useEffect } from 'react';
import { StyleSheet, Switch, TouchableOpacity, View, Alert, ScrollView, GestureResponderEvent } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { supabase } from '@/lib/supabase';

export default function ParametresScreen() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [fontSizeOption, setFontSizeOption] = useState<'small' | 'medium' | 'large'>('medium');

  useEffect(() => {
    checkAuth();
    
    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        setUserEmail(session?.user?.email || null);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    setUserEmail(session?.user?.email || null);
  };

  const handleLogin = () => {
    router.push('/auth');
  };

  const handleLogout = async () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: async () => {
            await supabase.auth.signOut();
            setIsAuthenticated(false);
            setUserEmail(null);
          }
        }
      ]
    );
  };

  const handleOpenWebsite = async () => {
    await WebBrowser.openBrowserAsync('https://www.impots.gov.mg');
  };

  const handleOpenPrivacyPolicy = async () => {
    await WebBrowser.openBrowserAsync('https://www.impots.gov.mg/privacy');
  };

  const handleOpenTerms = async () => {
    await WebBrowser.openBrowserAsync('https://www.impots.gov.mg/terms');
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    description: string | null = null,
    rightElement: React.ReactNode | null = null,
    onPress?: (event: GestureResponderEvent) => void
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.settingIconContainer}>
        <IconSymbol
          name={icon}
          size={22}
          color={Colors[colorScheme ?? 'light'].icon}
        />
      </View>
      <View style={styles.settingContent}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        {description && <ThemedText style={styles.settingDescription}>{description}</ThemedText>}
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  const renderFontSizeOption = (size: 'small' | 'medium' | 'large', label: string) => (
    <TouchableOpacity
      style={[
        styles.fontSizeOption,
        fontSizeOption === size && {
          backgroundColor: Colors[colorScheme ?? 'light'].tint,
        },
      ]}
      onPress={() => setFontSizeOption(size)}>
      <ThemedText
        style={[
          fontSizeOption === size && { color: 'white' },
          size === 'small' && { fontSize: 14 },
          size === 'medium' && { fontSize: 16 },
          size === 'large' && { fontSize: 18 },
        ]}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Paramètres</ThemedText>
      </View>
      
      <ScrollView style={styles.settingsContainer}>
        {/* Account Section */}
        <View style={styles.settingSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Compte</ThemedText>
          
          {isAuthenticated ? (
            <>
              {renderSettingItem(
                'person.fill',
                userEmail || 'Utilisateur',
                'Connecté',
                <IconSymbol
                  name="checkmark.circle.fill"
                  size={22}
                  color="#28A745"
                />
              )}
              {renderSettingItem(
                'arrow.right.square',
                'Déconnexion',
                null,
                <IconSymbol
                  name="chevron.right"
                  size={18}
                  color={Colors[colorScheme ?? 'light'].icon}
                />,
                handleLogout
              )}
            </>
          ) : (
            renderSettingItem(
              'person',
              'Se connecter',
              'Accédez à vos épingles et préférences',
              <IconSymbol
                name="chevron.right"
                size={18}
                color={Colors[colorScheme ?? 'light'].icon}
              />,
              handleLogin
            )
          )}
        </View>
        
        {/* Appearance Section */}
        <View style={styles.settingSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Apparence</ThemedText>
          
          {renderSettingItem(
            'moon.fill',
            'Mode sombre',
            'Activer le thème sombre',
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#767577', true: '#28A745' }}
              thumbColor="#f4f3f4"
            />
          )}
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <IconSymbol
                name="textformat.size"
                size={22}
                color={Colors[colorScheme ?? 'light'].icon}
              />
            </View>
            <View style={styles.settingContent}>
              <ThemedText type="defaultSemiBold">Taille du texte</ThemedText>
              <View style={styles.fontSizeOptions}>
                {renderFontSizeOption('small', 'Petit')}
                {renderFontSizeOption('medium', 'Moyen')}
                {renderFontSizeOption('large', 'Grand')}
              </View>
            </View>
          </View>
        </View>
        
        {/* Notifications Section */}
        <View style={styles.settingSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Notifications</ThemedText>
          
          {renderSettingItem(
            'bell.fill',
            'Notifications',
            'Recevoir des alertes de mise à jour',
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: '#28A745' }}
              thumbColor="#f4f3f4"
            />
          )}
        </View>
        
        {/* About Section */}
        <View style={styles.settingSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>À propos</ThemedText>
          
          {renderSettingItem(
            'globe',
            'Site officiel',
            'impots.gov.mg',
            <IconSymbol
              name="chevron.right"
              size={18}
              color={Colors[colorScheme ?? 'light'].icon}
            />,
            handleOpenWebsite
          )}
          
          {renderSettingItem(
            'lock.shield',
            'Politique de confidentialité',
            null,
            <IconSymbol
              name="chevron.right"
              size={18}
              color={Colors[colorScheme ?? 'light'].icon}
            />,
            handleOpenPrivacyPolicy
          )}
          
          {renderSettingItem(
            'doc.text',
            'Conditions d\'utilisation',
            null,
            <IconSymbol
              name="chevron.right"
              size={18}
              color={Colors[colorScheme ?? 'light'].icon}
            />,
            handleOpenTerms
          )}
          
          {renderSettingItem(
            'info.circle',
            'Version',
            '1.0.0'
          )}
        </View>
      </ScrollView>
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
  settingsContainer: {
    flex: 1,
  },
  settingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 8,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  fontSizeOptions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  fontSizeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});
