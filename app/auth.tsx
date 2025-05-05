import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { Stack, router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import LoginForm from '@/components/LoginForm';
import SignUpForm from '@/components/SignUpForm';
import { supabase } from '@/lib/supabase';

enum AuthView {
  Login,
  SignUp,
  ForgotPassword,
}

export default function AuthScreen() {
  const colorScheme = useColorScheme();
  const [currentView, setCurrentView] = useState<AuthView>(AuthView.Login);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.replace('/(tabs)');
    } catch (err) {
      setError((err as Error).message);
      Alert.alert('Login Error', (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (formData: any) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Signup Error', (err as Error).message);
    } finally {setLoading(false)};
  }

  const handleSwitchToLogin = () => {
    setCurrentView(AuthView.Login);
  };

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
    signUpFormContainer: {
      width: '100%', // Add this line
    },
    subtitle: {
      textAlign: 'center',
      opacity: 0.7,
    },
    switchLink: {
      marginTop: 16,
      color: Colors[colorScheme ?? 'light'].tint,
      textAlign: 'center',
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
        </View>
        <View style={styles.form}>          
          {currentView === AuthView.Login && (
            <>
             <LoginForm loading={loading} onLogin={handleLogin} onForgotPasswordPress={() => setCurrentView(AuthView.ForgotPassword)}/>
              <TouchableOpacity onPress={() => setCurrentView(AuthView.SignUp)}>
                <ThemedText style={styles.switchLink}>Don't have an account? Sign Up</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCurrentView(AuthView.ForgotPassword)}>
                <ThemedText style={styles.switchLink}>Forgot Password?</ThemedText>
              </TouchableOpacity>
            </>
          )}

          {currentView === AuthView.SignUp && (
            <View style={styles.signUpFormContainer}>
              <SignUpForm
                loading={loading}
                onSignUp={handleSignUp}
                onSwitchToLogin={handleSwitchToLogin}
              />
              <TouchableOpacity onPress={() => setCurrentView(AuthView.Login)}>
                <ThemedText style={styles.switchLink}>Already have an account? Sign In</ThemedText>
              </TouchableOpacity>
            </View>
            
          )}

          {currentView === AuthView.ForgotPassword && (
            <>
              <ThemedText style={styles.subtitle}>Forgot Password Screen</ThemedText>
              <TouchableOpacity onPress={() => setCurrentView(AuthView.Login)}>
                <ThemedText style={styles.switchLink}>Back to Sign In</ThemedText>
              </TouchableOpacity>
            </>
          )}
          
         <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <ThemedText>Cancel</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </>
  );
}
