import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface LoginFormProps {
  onForgotPasswordPress: () => void;
  onLogin: (email: string, password: string) => void;
  loading: boolean;
}

export default function LoginForm({ onForgotPasswordPress, onLogin, loading }: LoginFormProps) {
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginPress = () => {
    onLogin(email, password);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Enter your credentials to log in
      </ThemedText>

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
          style={[
            styles.button,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint },
          ]}
          onPress={handleLoginPress}
          disabled={loading}
        >
          <ThemedText style={styles.buttonText}>Log In</ThemedText>
        </TouchableOpacity>

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
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  form: {
    width: '100%',
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
    paddingVertical: 0, // Adjust vertical padding
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