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
  loading: boolean;
  onSwitchToLogin: () => void;
}

export interface SignUpFormData {
  email: string;
  password: string;
  companyName: string;
  industry: string;
  acceptTerms: boolean;
}

interface StructureFormData {
  structureType: 'consultant' | 'entreprise' | 'autre';
  companyName: string;
  activityDescription: string;
  employeeCount?: string; // Changed to string to store the selected value
}

const activityOptions = [
  "Comptabilité et fiscalité",
  "Conseil en gestion",
  "Audit financier",
  "Droit des affaires",
  "Gestion de patrimoine",
  "Autre",
];

const employeeCountOptions = ["Consultant", "Micro-entreprise", "Petite entreprise", "Moyenne entreprise", "Grosse entreprise"];

const SignUpForm: React.FC<SignUpFormProps> = ({ onSignUp, onSwitchToLogin, loading }) => {
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isOtherActivity, setIsOtherActivity] = useState(false);
  const [structureData, setStructureData] = useState<StructureFormData>({
    structureType: 'consultant',
    companyName: '',
    activityDescription: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

    const handleChangeActivity = (value: string) => {
      if (value === "Autre") {
        setIsOtherActivity(true);
      } else {
        setIsOtherActivity(false);
      }
      setStructureData({ ...structureData, activityDescription: value });
    };
  const handleContinue = () => {
    if (!email || !password) {
      alert('Please fill in email and password.');
      return;
    }
    setCurrentStep(2);
  };

  const handleSignUp = () => {
    if (currentStep === 1) {
      handleContinue();
    }else if(!acceptTerms) {
        alert('Please accept the terms of service.');
        return;
      }

      onSignUp({ email, password, companyName: structureData.companyName, industry: structureData.activityDescription, acceptTerms });    
    // setLoading(false); // Set loading to false after async operation in parent
  };

  const inputBackgroundColor = Colors[colorScheme ?? 'light'].background;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const placeholderColor = Colors[colorScheme ?? 'light'].icon;
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  const handleBack = () => {
    setCurrentStep(1);
  };


  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Create your account
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Enter your details to get started
      </ThemedText>

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
          </>
        )}

        {currentStep === 2 && (<>
            <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
              <IconSymbol name="briefcase" size={20} color={placeholderColor} />
                <View style={[styles.selectContainer, { backgroundColor: inputBackgroundColor }]}>
                  <select 
                    style={[styles.selectInput, { color: textColor}]}
                    value={structureData.structureType}
                    onChange={(e) =>
                      setStructureData({ ...structureData, structureType: e.target.value as any })
                    }
                  >
                    <option value="consultant">Consultant</option>
                    <option value="entreprise">Entreprise</option>
                    <option value="autre">Autre</option>
                  </select>
                </View>
            </View>

            <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
              <IconSymbol name="building.columns" size={20} color={placeholderColor} />
              <TextInput
                style={[styles.input, { color: textColor, flex: 1 }]}
                placeholder="Nom commercial"
                placeholderTextColor={placeholderColor}
                value={structureData.companyName}
                onChangeText={(text) => setStructureData({ ...structureData, companyName: text })}
                autoCapitalize="words"
              />
            </View>           

            <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
              <IconSymbol name="briefcase" size={20} color={placeholderColor} />
                <View style={[styles.selectContainer, { backgroundColor: inputBackgroundColor }]}>
                  <select
                      style={[styles.selectInput, { color: textColor }]}
                      value={structureData.activityDescription}
                      onChange={(e) => handleChangeActivity(e.target.value)}
                    >
                      {activityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                    {isOtherActivity && (
                      <TextInput
                        style={[styles.input, { color: textColor }]}
                        placeholder="Précisez votre activité"
                        placeholderTextColor={placeholderColor}
                        value={structureData.activityDescription}
                        onChangeText={(text) => setStructureData({ ...structureData, activityDescription: text })}
                        autoCapitalize="sentences"
                      />
                    )}
                </View>
            </View>

            {(structureData.structureType === 'entreprise' || structureData.structureType === 'autre') && (
            <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
              <IconSymbol name="users" size={20} color={placeholderColor} />
              <View style={[styles.selectContainer, { backgroundColor: inputBackgroundColor }]}>
                <select 
                  style={[styles.selectInput, { color: textColor }]}
                  value={structureData.employeeCount || ''}
                  onChange={(e) => {                    
                    const selectedValue = e.target.value;
                   setStructureData((prevData) => ({ ...prevData, employeeCount: selectedValue }));
                  }}
                >
                  {employeeCountOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                   ))}                
                </select>
                </View>
            </View>
            )}
            <View style={styles.checkboxContainer}>
            </View>
            </View>)}


            <View style={styles.checkboxContainer}>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: tintColor }]}
              onPress={handleBack}
              disabled={loading}
            >
              <ThemedText style={styles.buttonText}>
                Retour
              </ThemedText>
            </TouchableOpacity>
               <Checkbox
                value={acceptTerms}
                onValueChange={setAcceptTerms}
                color={acceptTerms ? tintColor : undefined}>               
              </ThemedText>
            </TouchableOpacity>
          </>
            )}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: tintColor }]}
          onPress={currentStep === 1 ? handleContinue : handleSignUp}
          disabled={loading}
        >
          <ThemedText style={styles.buttonText}>
            {loading ? 'Signing Up...' : currentStep === 1 ? 'Continuer' : 'S\'inscrire'}
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
    selectContainer: {
    flex: 1,
    marginLeft: 8,
  },
  selectInput: {
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
