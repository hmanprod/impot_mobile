import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { supabase } from '@/lib/supabase';

export default function AuthScreen() {
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSendMagicLink = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'impotsmg://auth/callback',
        },
      });

      if (error) throw error;

      setMessage('Check your email for the login link!');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
      console.error('Error sending magic link:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Authentication',
          headerShown: true,
        }}
      />
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <IconSymbol
            name="lock.shield"
            size={60}
            color={Colors[colorScheme ?? 'light'].tint}
          />
          <ThemedText type="title" style={styles.title}>
            Sign in to your account
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Enter your email to receive a magic link
          </ThemedText>
        </View>

        <View style={styles.form}>
          <View style={[
            styles.inputContainer,
            { backgroundColor: Colors[colorScheme ?? 'light'].background }
          ]}>
            <IconSymbol
              name="envelope"
              size={20}
              color={Colors[colorScheme ?? 'light'].icon}
            />
            <TextInput
              style={[
                styles.input,
                { color: Colors[colorScheme ?? 'light'].text }
              ]}
              placeholder="Your email address"
              placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {message && (
            <View style={styles.messageContainer}>
              <IconSymbol
                name="checkmark.circle"
                size={20}
                color="#28A745"
              />
              <ThemedText style={styles.message}>{message}</ThemedText>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint }
            ]}
            onPress={handleSendMagicLink}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <ThemedText style={styles.buttonText}>Send Magic Link</ThemedText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}>
            <ThemedText>Cancel</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  message: {
    marginLeft: 8,
    color: '#28A745',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    alignItems: 'center',
    padding: 8,
  },
});
