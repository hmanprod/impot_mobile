import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthentication } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase';

export default function ParametresScreen() {
  const colorScheme = useColorScheme();
  const { user, session } = useAuthentication();

  const [profile, setProfile] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company_name: '',
    activity_description: '',
    employee_count: '',
    test_objective: '',
  });

  // Fetch profile on mount
  useEffect(() => {
    console.log('user',user);
    console.log('session',session);

    if (!user) {
      console.log("No user found, skipping profile fetch.");
      return;
    }
    setLoading(true);
    console.log("Fetching profile for user id:", user.id);
  
    supabase
      .from('profil')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Supabase error fetching profile:", error);
          setProfile(null);
        } else {
          console.log("Profile data received:", data);
          setProfile(data);
          setForm({
            company_name: data.company_name || '',
            activity_description: data.activity_description || '',
            employee_count: data.employee_count || '',
            test_objective: data.test_objective || '',
          });
        }
        setLoading(false);
      });
  }, [user]);

  const handleSave = async () => {
    if (!user || !profile) return;
    setSaving(true);
    const { error } = await supabase
      .from('profil')
      .update({
        company_name: form.company_name,
        activity_description: form.activity_description,
        employee_count: form.employee_count,
        test_objective: form.test_objective,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);
    setSaving(false);
    if (error) {
      Alert.alert('Erreur', "Impossible de sauvegarder le profil : " + error.message);
    } else {
      setProfile({ ...profile, ...form });
      setEditMode(false);
      Alert.alert('Succès', 'Profil mis à jour !');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText style={styles.sectionTitle}>Mon compte</ThemedText>
          <View style={styles.card}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { color: Colors[colorScheme ?? 'light'].text, backgroundColor: Colors[colorScheme ?? 'light'].background, opacity: 0.7 }]}
                value={user?.email || ''}
                editable={false}
                selectTextOnFocus={false}
              />
            </View>
          </View>
          <TouchableOpacity
            style={[styles.button, styles.logoutButton, { marginTop: 16 }]}
            onPress={async () => {
              try {
                await supabase.auth.signOut();
                // Redirige vers l'écran d'authentification
                router.replace('/auth');
              } catch (err) {
                Alert.alert('Erreur', "La déconnexion a échoué.");
              }
            }}
          >
            <ThemedText style={styles.buttonText}>Se déconnecter</ThemedText>
          </TouchableOpacity>

        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fafbfc',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
    marginTop: 10,
  },
  inputWrapper: {
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e4e4e4',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f7f7f8',
    color: '#222',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginLeft: 6,
  },
  editButton: {
    backgroundColor: '#f5f6fa',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  saveButton: {
    backgroundColor: '#3f51b5',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  logoutButton: {
    backgroundColor: '#d9534f', // rouge
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
