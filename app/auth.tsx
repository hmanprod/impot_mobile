import React, { useState } from 'react';
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
      if (error) {
        if (error.code === 'email_not_confirmed') {
          setError('Veuillez confirmer votre adresse email avant de vous connecter.');
        } else {
          setError(error.message);
        }
        throw error;
      }
      router.replace('/(tabs)');
    } catch (err: any) {
      if (err?.code === 'email_not_confirmed') {
        setError('Veuillez confirmer votre adresse email avant de vous connecter.');
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError('Erreur de connexion.');
      }
      Alert.alert('Erreur de connexion', err?.message || 'Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };


  const handleSignUp = async (formData: any) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (error) {
      // Supabase duplicate email error code: 'auth/email-already-in-use'
      if (error.code === 'auth/email-already-in-use' || error.message?.toLowerCase().includes('email')) {
        setError("Cet email est déjà utilisé. Veuillez en choisir un autre ou vous connecter.");
      } else {
        setError(error.message);
      }
      throw error;
    }
      const user = data?.user;
      // 2. If registration succeeded, insert profile data
      if (user) {
        const { error: profileError } = await supabase
          .from('profil')
          .insert({
            user_id: user.id,
            company_name: formData.companyName,
            activity_description: formData.industry,
            employee_count: formData.employeeCount || null,
            // test_objective: formData.testObjective || null,
          });
        if (profileError) throw profileError;
      }
      // router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Erreur d\'inscription', (err as Error).message);
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
      fontSize: 24,
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
      marginTop: 0,
      color: Colors[colorScheme ?? 'light'].tint,
      textAlign: 'center',
      fontSize: 14,
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
          title: 'Authentification',
          headerShown: false,
        }}
      />
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <IconSymbol
            name="lock.shield"
            size={60}
            color={Colors[colorScheme ?? 'light'].tint}
          />
               
        </View>
        <View style={styles.form}>          
          {currentView === AuthView.Login && (
            <>
            <ThemedText type="title" style={styles.title}>
            Connectez-vous à{"\n"}votre compte
            </ThemedText>   
             <LoginForm
               loading={loading}
               onLogin={handleLogin}
               onForgotPasswordPress={() => setCurrentView(AuthView.ForgotPassword)}
               errorMessage={error}
             />
              <TouchableOpacity onPress={() => setCurrentView(AuthView.SignUp)}>
                <ThemedText style={styles.switchLink}>Vous n'avez pas de compte ? Inscrivez-vous</ThemedText>
              </TouchableOpacity>
            </>
          )}

          {currentView === AuthView.SignUp && (
            <View style={styles.signUpFormContainer}>
              <ThemedText type="title" style={styles.title}>
                Créez votre compte
              </ThemedText>   
              <SignUpForm
                loading={loading}
                onSignUp={handleSignUp}
                onSwitchToLogin={handleSwitchToLogin}
                errorMessage={error}
              />
              <TouchableOpacity onPress={() => setCurrentView(AuthView.Login)}>
                <ThemedText style={styles.switchLink}>Vous avez déjà un compte ? Connectez-vous</ThemedText>
              </TouchableOpacity>
            </View>
            
          )}

          {currentView === AuthView.ForgotPassword && (
            <>
              <ThemedText style={styles.subtitle}>Récupération de mot de passe</ThemedText>
              <TouchableOpacity onPress={() => setCurrentView(AuthView.Login)}>
                <ThemedText style={styles.switchLink}>Retour à la connexion</ThemedText>
              </TouchableOpacity>
            </>
          )}
          
        </View>
      </ThemedView>
    </>
  );
}
