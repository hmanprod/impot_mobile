import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ActivityIndicator, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

export interface ProfileFormData {
  company_name: string;
  activity_description: string;
  employee_count?: string;
  test_objective?: string;
}

interface ProfileFormProps {
  initialProfile: ProfileFormData;
  loading: boolean;
  saving: boolean;
  editMode: boolean;
  onChange: (form: ProfileFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  error?: string;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialProfile,
  loading,
  saving,
  editMode,
  onChange,
  onSave,
  onCancel,
  error,
}) => {
  const [form, setForm] = useState<ProfileFormData>(initialProfile);
  const [formError, setFormError] = useState<string | null>(null);
  const colorScheme = useColorScheme() ?? 'light';

  useEffect(() => {
    setForm(initialProfile);
  }, [initialProfile]);

  // Validation example
  const validate = () => {
    if (!form.company_name) {
      setFormError("Le nom de l'entreprise est requis.");
      return false;
    }
    if (!form.activity_description) {
      setFormError("La description d'activité est requise.");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSave = () => {
    if (validate()) {
      onChange(form);
      onSave();
    }
  };

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    onChange(updated);
  };

  return (
    <ThemedView style={styles.container}>
      {loading && <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />}
      {formError && <ThemedText style={styles.error}>{formError}</ThemedText>}
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
      <ThemedText style={styles.label}>Nom de l'entreprise</ThemedText>
      <TextInput
        style={[
          styles.input,
          { borderColor: Colors[colorScheme].icon }
        ]}
        value={form.company_name}
        onChangeText={v => handleChange('company_name', v)}
        editable={editMode}
        placeholder="Nom de l'entreprise"
      />
      <ThemedText style={styles.label}>Description d'activité</ThemedText>
      <TextInput
        style={[
          styles.input,
          { borderColor: Colors[colorScheme].icon }
        ]}
        value={form.activity_description}
        onChangeText={v => handleChange('activity_description', v)}
        editable={editMode}
        placeholder="Ex: Conseil, Audit..."
      />
      <ThemedText style={styles.label}>Nombre d'employés</ThemedText>
      <TextInput
        style={[
          styles.input,
          { borderColor: Colors[colorScheme].icon }
        ]}
        value={form.employee_count || ''}
        onChangeText={v => handleChange('employee_count', v)}
        editable={editMode}
        placeholder="Ex: Micro-entreprise, Petite entreprise..."
      />
      <ThemedText style={styles.label}>Objectif de test</ThemedText>
      <TextInput
        style={[
          styles.input,
          { borderColor: Colors[colorScheme].icon }
        ]}
        value={form.test_objective || ''}
        onChangeText={v => handleChange('test_objective', v)}
        editable={editMode}
        placeholder="Objectif de test (optionnel)"
      />
      <View style={styles.buttonRow}>
        {editMode ? (
          <>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: Colors[colorScheme].tint }
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              <ThemedText style={styles.buttonText}>{saving ? 'Sauvegarde...' : 'Enregistrer'}</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: Colors[colorScheme].card }
              ]}
              onPress={onCancel}
              disabled={saving}
            >
              <ThemedText style={[styles.buttonText, { color: Colors[colorScheme].text }]}>Annuler</ThemedText>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  saveButton: {},
  cancelButton: {},

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
});

export default ProfileForm;
