import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Pressable } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import GoogleSvgIcon from './ui/GoogleSvgIcon';

interface LoginFormProps {
  onForgotPasswordPress: () => void;
  onLogin: (email: string, password: string) => void;
  loading: boolean;
  errorMessage?: string | null;
}

export default function LoginForm({ onForgotPasswordPress, onLogin, loading, errorMessage }: LoginFormProps) {
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginPress = () => {
    onLogin(email, password);
  };

  const tintColor = Colors[colorScheme ?? 'light'].tint;
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Enter your credentials to log in
      </ThemedText>

      {errorMessage ? (
        <ThemedText style={{ color: 'red', marginBottom: 12, textAlign: 'center', fontWeight: 'bold' }}>
          {errorMessage}
        </ThemedText>
      ) : null}
      <View style={styles.form}>
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: Colors[colorScheme ?? 'light'].background },
          ]}
        >
          <IconSymbol
            name="envelope"
            size={20}
            color={Colors[colorScheme ?? 'light'].icon}
          />
          <TextInput
            style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
            placeholder="Email address"
            placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: Colors[colorScheme ?? 'light'].background },
          ]}
        >
          <IconSymbol
            name="lock"
            size={20}
            color={Colors[colorScheme ?? 'light'].icon}
          />
          <TextInput
            style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
            placeholder="Password"
            placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: tintColor }]}
          onPress={handleLoginPress}
          disabled={loading}
        >
          <ThemedText style={styles.buttonText}>Log In</ThemedText>
        </TouchableOpacity>

        {/* Google Login Button */}
        {/* <Pressable style={styles.googleButton} onPress={() => {}}>
          <GoogleSvgIcon size={22} style={styles.googleIcon} />
          <ThemedText style={styles.googleButtonText}>Se connecter avec Google</ThemedText>
        </Pressable> */}

        <TouchableOpacity style={styles.forgotPasswordButton} onPress={onForgotPasswordPress}>
          <ThemedText style={styles.forgotPasswordText}>Forgot password?</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FAFAFA',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#F3F4F6',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 18,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    justifyContent: 'center',
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  googleButtonText: {
    color: '#222',
    fontWeight: '500',
    fontSize: 15,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 15,
    marginBottom: 16,
  },
  forgotPasswordButton: {
    alignItems: 'center',
    padding: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    opacity: 0.7,
    textDecorationLine: 'underline',
  },
});