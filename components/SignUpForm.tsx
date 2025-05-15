import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
// import GoogleSvgIcon from '@/components/ui/GoogleSvgIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface SignUpFormProps {
  onSignUp: (formData: SignUpFormData) => void;
  loading: boolean;
  onSwitchToLogin: () => void;
}

export interface SignUpFormData {
  email: string;
  password: string;
  companyName: string;
  industry: string;
  employeeCount?: string;
  testObjective?: string;
  acceptTerms: boolean;
}

interface StructureFormData {
  structureType: 'consultant' | 'entreprise' | 'autre';
  companyName: string;
  activityDescription: string;
  employeeCount?: string;
  testObjective?: string;
}

const activityOptions = [
  "Comptabilité et fiscalité",
  "Conseil en gestion",
  "Audit financier",
  "Droit des affaires",
  "Gestion de patrimoine",
  "Autre",
];

const employeeCountOptions = [
  "1",
  "2-5",
  "6-20",
  ">20"
];

const SignUpForm: React.FC<SignUpFormProps> = ({ onSignUp, onSwitchToLogin, loading }) => {
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isOtherActivity, setIsOtherActivity] = useState(false);
  const [structureData, setStructureData] = useState<StructureFormData>({
    structureType: 'consultant',
    companyName: '',
    activityDescription: '',
    employeeCount: '',
    testObjective: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Modal picker state
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerOptions, setPickerOptions] = useState<string[]>([]);
  const [pickerPlaceholder, setPickerPlaceholder] = useState('');
  const [pickerCallback, setPickerCallback] = useState<(value: string) => void>(() => {});

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;

  const validateStep1 = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setFormError('');
    if (!emailRegex.test(email)) {
      setEmailError('Veuillez entrer un email valide.');
      valid = false;
    }
    if (password.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères.');
      valid = false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas.');
      valid = false;
    }
    return valid;
  };

  const handleChangeActivity = (value: string) => {
    if (value === "Autre") {
      setIsOtherActivity(true);
    } else {
      setIsOtherActivity(false);
    }
    setStructureData({ ...structureData, activityDescription: value });
  };

  const handleContinue = () => {
    if (!validateStep1()) {
      return;
    }
    setCurrentStep(2);
  };

  const handleSignUp = () => {
    setFormError('');
    if (currentStep === 1) {
      handleContinue();
      return;
    }
    if (!acceptTerms) {
      setFormError('Veuillez accepter les conditions d\'utilisation.');
      return;
    }
    onSignUp({
      email,
      password,
      companyName: structureData.companyName,
      industry: structureData.activityDescription,
      employeeCount: structureData.employeeCount,
      testObjective: structureData.testObjective,
      acceptTerms,
    });
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  // Colors from theme
  const inputBackgroundColor = Colors[colorScheme ?? 'light'].background;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const placeholderColor = Colors[colorScheme ?? 'light'].icon;
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  // Simple cross-platform picker
  const renderPicker = (value: string, options: string[], placeholder: string, onChange: (value: string) => void) => {
    return (
      <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor, paddingHorizontal: 0 }]}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue: string | number) => onChange(itemValue.toString())}
          style={{ flex: 1, color: textColor }}
          dropdownIconColor={placeholderColor}
        >
          <Picker.Item label={placeholder} value="" color={placeholderColor} />
          {options.map((option) => (
            <Picker.Item key={option} label={option} value={option} color={textColor} />
          ))}
        </Picker>
      </View>
    );
  };

  return (
    <ThemedView style={{ flex: 0 }}>
      <ScrollView
        style={{ flexGrow: 1 }}
        contentContainerStyle={{ paddingVertical: 20 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        <View style={{ paddingHorizontal: 16 }}>
          {/* <ThemedText type="title" style={styles.title}>
            Créez votre compte
          </ThemedText> */}
          {/* <ThemedText style={styles.subtitle}>
            Entrez vos informations pour commencer
          </ThemedText> */}

          <View style={styles.form}>
            {currentStep === 1 && (
              <>
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
                {emailError ? (
                  <ThemedText style={{ color: 'red', marginLeft: 10 }}>{emailError}</ThemedText>
                ) : null}

                <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}> 
                  <IconSymbol name="lock.shield" size={20} color={placeholderColor} />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="Mot de passe"
                    placeholderTextColor={placeholderColor}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
                {passwordError ? (
                  <ThemedText style={{ color: 'red', marginLeft: 10 }}>{passwordError}</ThemedText>
                ) : null}

                <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}> 
                  <IconSymbol name="lock.shield" size={20} color={placeholderColor} />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="Confirmez le mot de passe"
                    placeholderTextColor={placeholderColor}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>
                {confirmPasswordError ? (
                  <ThemedText style={{ color: 'red', marginLeft: 10 }}>{confirmPasswordError}</ThemedText>
                ) : null}
              </>
            )}

            {currentStep === 2 && (
              <>
                {/* <ThemedText type="title" style={{ textAlign: 'center', fontSize: 18, marginBottom: 8 }}>
                  Finalisez votre inscription
                </ThemedText> */}
                {/* <ThemedText style={{ textAlign: 'center', opacity: 0.7, marginBottom: 16 }}>
                  Merci de compléter ces informations pour personnaliser votre expérience.
                </ThemedText> */}
                
                <ThemedText style={{ fontWeight: 'bold', marginBottom: 8 }}>Nom de l'entreprise</ThemedText>
                <TextInput
                  style={[styles.input, { color: textColor, backgroundColor: inputBackgroundColor }]}
                  placeholder="Nom de l'entreprise"
                  placeholderTextColor={placeholderColor}
                  value={structureData.companyName}
                  onChangeText={(text) => setStructureData({ ...structureData, companyName: text })}
                  autoCapitalize="words"
                />
                
                <ThemedText style={{ fontWeight: 'bold', marginBottom: 8, marginTop: 10 }}>Type d'activité</ThemedText>
                {renderPicker(
                  structureData.activityDescription,
                  activityOptions,
                  'Sélectionner',
                  handleChangeActivity
                )}
                
                <ThemedText style={{ fontWeight: 'bold', marginBottom: 8, marginTop: 0 }}>Nombre d'employés</ThemedText>
                {renderPicker(
                  structureData.employeeCount || '',
                  employeeCountOptions,
                  'Sélectionner',
                  (value) => setStructureData({ ...structureData, employeeCount: value })
                )}
                
                {/* <ThemedText style={{ fontWeight: 'bold', marginBottom: 8, marginTop: 10 }}>
                  Votre objectif pour ce test
                </ThemedText>
                <TextInput
                  style={[styles.input, { color: textColor, backgroundColor: inputBackgroundColor, minHeight: 60 }]}
                  placeholder="Ex: Je veux voir comment ce service peut m'aider sur..."
                  placeholderTextColor={placeholderColor}
                  value={structureData.testObjective || ''}
                  onChangeText={(text) => setStructureData({ ...structureData, testObjective: text })}
                  multiline
                  numberOfLines={2}
                /> */}
                
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={acceptTerms}
                    onValueChange={setAcceptTerms}
                    color={acceptTerms ? tintColor : undefined}
                  />
                  <ThemedText style={styles.checkboxLabel}>
                    J'accepte les <ThemedText type="link" style={styles.checkboxLink}>Conditions Générales d'Utilisation</ThemedText>
                  </ThemedText>
                </View>
              </>
            )}

            {formError ? (
              <ThemedText style={{ color: 'red', marginLeft: 10 }}>{formError}</ThemedText>
            ) : null}
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: tintColor }]}
              onPress={currentStep === 1 ? handleContinue : handleSignUp}
              disabled={loading}
            >
              <ThemedText style={styles.buttonText}>
                {loading ? 'Inscription en cours...' : currentStep === 1 ? 'Continuer' : 'S\'inscrire'}
              </ThemedText>
            </TouchableOpacity>

            {currentStep === 2 && (
              <TouchableOpacity
                style={[styles.retourButton, { marginTop: 8 }]}
                onPress={handleBack}
                disabled={loading}
              >
                <ThemedText style={styles.retourText}>
                  Retour
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Picker Modal for Android */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.pickerModalContainer}>
                <ThemedText style={styles.pickerTitle}>{pickerPlaceholder}</ThemedText>
                <FlatList
                  data={pickerOptions}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.pickerItem} 
                      onPress={() => pickerCallback(item)}
                    >
                      <ThemedText>{item}</ThemedText>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: tintColor, marginTop: 16 }]}
                  onPress={() => setPickerVisible(false)}
                >
                  <ThemedText style={styles.buttonText}>Annuler</ThemedText>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  scrollContent: {
    flexGrow: 0,
    paddingVertical: 20,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 0,
    marginBottom: 10,
    backgroundColor: '#F3F4F6',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 18,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  retourButton: {
    marginTop: 18,
    borderRadius: 10,
    paddingVertical: 0,
    alignItems: 'center',
  },
  retourText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
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
  title: {
    marginTop: 0,
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 15,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
  checkboxLink: {
    fontSize: 14,
    lineHeight: 14,
  },
  switchButton: {
    alignItems: 'center',
    padding: 8,
  },
  switchButtonText: {
    fontSize: 14,
  },
  selectInput: {
    width: '100%',
    fontSize: 16,
    paddingVertical: 8,
    color: '#333',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  // Modal picker styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerModalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default SignUpForm;
