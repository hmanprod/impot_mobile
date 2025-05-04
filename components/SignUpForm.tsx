import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Checkbox from 'expo-checkbox'; // You might need to install expo-checkbox
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface SignUpFormProps {
  onSignUp: (formData: SignUpFormData) => void;
  onSwitchToLogin: () => void;
}

export interface SignUpFormData {
  email: string;
  password: string;
  companyName: string;
  industry: string;
  acceptTerms: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSignUp, onSwitchToLogin }) => {
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    // Basic validation (more comprehensive validation needed)
    if (!email || !password || !companyName || !industry || !acceptTerms) {
      alert('Please fill in all fields and accept the terms.');
      return;
    }

    setLoading(true);
    onSignUp({ email, password, companyName, industry, acceptTerms });
    // setLoading(false); // Set loading to false after async operation in parent
  };

  const inputBackgroundColor = Colors[colorScheme ?? 'light'].background;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const placeholderColor = Colors[colorScheme ?? 'light'].icon;
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Create your account
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Enter your details to get started
      </ThemedText>

      <View style={styles.form}>
        <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
          <IconSymbol name="envelope" size={20} color={placeholderColor} />
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="Email"
            placeholderTextColor={placeholderColor}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
          <IconSymbol name="lock.shield" size={20} color={placeholderColor} />
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="Password"
            placeholderTextColor={placeholderColor}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* B2B Information Fields */}
        <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
          <IconSymbol name="building.columns" size={20} color={placeholderColor} />
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="Company Name"
            placeholderTextColor={placeholderColor}
            value={companyName}
            onChangeText={setCompanyName}
            autoCapitalize="words"
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
          <IconSymbol name="briefcase" size={20} color={placeholderColor} />
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="Industry"
            placeholderTextColor={placeholderColor}
            value={industry}
            onChangeText={setIndustry}
            autoCapitalize="words"
          />
        </View>

        {/* Terms of Service Checkbox */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={acceptTerms}
            onValueChange={setAcceptTerms}
            color={acceptTerms ? tintColor : undefined}
          />
          <ThemedText style={styles.checkboxLabel}>
            I agree to the terms of service
          </ThemedText>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: tintColor }]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <ThemedText style={styles.buttonText}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchButton} onPress={onSwitchToLogin}>
          <ThemedText style={styles.switchButtonText}>
            Already have an account? <ThemedText type="link">Sign In</ThemedText>
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 30,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8, // Slightly less rounded than original for Notion feel
    paddingHorizontal: 12, // Reduced padding for Notion feel
    paddingVertical: 12,
    marginBottom: 12, // Reduced margin
    borderWidth: 1, // Added border for Notion feel
    borderColor: '#E0E0E0', // Light gray border
    shadowColor: 'transparent', // Remove shadow for Notion feel
    elevation: 0, // Remove elevation
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    paddingVertical: 0, // Remove vertical padding
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
  button: {
    paddingVertical: 12, // Reduced padding
    borderRadius: 8, // Slightly less rounded
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  switchButton: {
    alignItems: 'center',
    padding: 8,
  },
  switchButtonText: {
    fontSize: 14,
  }
});

export default SignUpForm;