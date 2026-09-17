import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme/ThemeProvider.tsx';
import { ThemedText } from '../../components/shared/ThemedText.tsx';
import { ThemedButton } from '../../components/shared/ThemedButton.tsx';
import { ThemedCard } from '../../components/shared/ThemedCard.tsx';
import { BirthDatePicker } from '../../components/shared/BirthDatePicker.tsx';
import { useUserStore } from '../../store/userStore.ts';
import { createStudentProfile } from '../../lib/auth.ts';
import {
  calculateAgeFromBirthDate,
  resolveAgeBandSafe,
  resolveAgeBandDetails,
  isParentContactRequired,
  isValidStudentAge,
} from '../../lib/themeResolver.ts';

export default function SignUpScreen() {
  const router = useRouter();
  const { theme, setStudentAge } = useTheme();
  const setStudent = useUserStore((s) => s.setStudent);

  // Basic Account Fields
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('Tunis Central');

  // Birthdate State (Default: 8 years old - 2018-09-01)
  const defaultBirthYear = new Date().getFullYear() - 8;
  const [birthDate, setBirthDate] = useState(`${defaultBirthYear}-09-01`);
  const [computedAge, setComputedAge] = useState<number>(8);

  // Parent / Guardian contact (Required for students < 13)
  const [parentFullName, setParentFullName] = useState('');
  const [parentContact, setParentContact] = useState('');

  // Validation / Error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isUnder13 = isParentContactRequired(computedAge);

  const handleBirthDateChange = (dateStr: string, age: number) => {
    setBirthDate(dateStr);
    setComputedAge(age);
    // Clear error when editing
    if (errorMessage) setErrorMessage(null);
  };

  const handleRegister = () => {
    // Basic validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter the student full name.');
      return;
    }
    if (!emailOrPhone.trim()) {
      setErrorMessage('Please enter an email address or mobile phone number.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (!isValidStudentAge(computedAge)) {
      setErrorMessage(`Vamos Academy enrolls students between ages 6 and 19. Computed age: ${computedAge}.`);
      return;
    }

    // Child safety requirement
    if (isUnder13) {
      if (!parentFullName.trim()) {
        setErrorMessage('Parent/Guardian full name is required for students under 13.');
        return;
      }
      if (!parentContact.trim()) {
        setErrorMessage('Parent/Guardian contact (phone/email) is required for child authorization.');
        return;
      }
    }

    // Compute band details
    const bandDetails = resolveAgeBandDetails(computedAge);

    // Synchronously update theme before routing so there is zero flash of neutral/generic UI
    setStudentAge(computedAge);

    // Create student profile with Prisma-aligned attributes
    const profile = createStudentProfile({
      id: 'student_' + Date.now(),
      fullName: fullName.trim(),
      emailOrPhone: emailOrPhone.trim(),
      birthDate,
      age: computedAge,
      parentFullName: isUnder13 ? parentFullName.trim() : undefined,
      parentContact: isUnder13 ? parentContact.trim() : undefined,
      centerBranch: branch,
    });

    // Store student in state
    setStudent(profile);

    // Immediately route into the resolved band prefix
    router.replace(bandDetails.routePrefix as any);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      contentContainerStyle={styles.content}
    >
      <ThemedCard style={styles.card}>
        <ThemedText variant="heading1" style={{ color: theme.colors.primary, textAlign: 'center' }}>
          Enroll at Vamos Academy
        </ThemedText>
        <ThemedText
          variant="bodyRegular"
          style={{ color: theme.colors.textMuted, textAlign: 'center', marginTop: 4, marginBottom: 16 }}
        >
          Adaptive EdTech platform tailored to your age & school level in Tunisia
        </ThemedText>

        {errorMessage && (
          <View style={styles.errorBanner}>
            <ThemedText variant="caption" style={{ color: '#DC2626', fontWeight: '700' }}>
              ⚠️ {errorMessage}
            </ThemedText>
          </View>
        )}

        {/* SECTION 1: Basic Account Fields */}
        <ThemedText variant="label" style={{ color: theme.colors.textMuted, marginTop: 4, marginBottom: 4 }}>
          STUDENT CREDENTIALS
        </ThemedText>

        <TextInput
          placeholder="Student Full Name *"
          placeholderTextColor="#94A3B8"
          value={fullName}
          onChangeText={(txt) => {
            setFullName(txt);
            if (errorMessage) setErrorMessage(null);
          }}
          style={[styles.input, { borderColor: theme.colors.outline }]}
        />

        <TextInput
          placeholder="Email or Mobile Phone (+216) *"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={emailOrPhone}
          onChangeText={(txt) => {
            setEmailOrPhone(txt);
            if (errorMessage) setErrorMessage(null);
          }}
          style={[styles.input, { borderColor: theme.colors.outline }]}
        />

        <TextInput
          placeholder="Password (minimum 6 characters) *"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={password}
          onChangeText={(txt) => {
            setPassword(txt);
            if (errorMessage) setErrorMessage(null);
          }}
          style={[styles.input, { borderColor: theme.colors.outline }]}
        />

        {/* SECTION 2: Birthdate Picker */}
        <BirthDatePicker
          value={birthDate}
          onChange={handleBirthDateChange}
          style={{ marginTop: 8 }}
        />

        {/* SECTION 3: Parent/Guardian Contact (Mandatory for students < 13) */}
        {isUnder13 ? (
          <View style={styles.parentGuardSection}>
            <View style={styles.parentHeaderRow}>
              <ThemedText variant="label" style={{ color: '#D97706', fontWeight: '800' }}>
                🛡️ PARENT / GUARDIAN AUTHORIZATION (REQUIRED)
              </ThemedText>
            </View>
            <ThemedText variant="caption" style={{ color: '#92400E', marginVertical: 4 }}>
              As a student under 13, child protection policies require parent or guardian contact details for study center synchronization.
            </ThemedText>

            <TextInput
              placeholder="Parent/Guardian Full Name *"
              placeholderTextColor="#94A3B8"
              value={parentFullName}
              onChangeText={(txt) => {
                setParentFullName(txt);
                if (errorMessage) setErrorMessage(null);
              }}
              style={[styles.input, styles.parentInput]}
            />

            <TextInput
              placeholder="Parent Phone or Email Contact *"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={parentContact}
              onChangeText={(txt) => {
                setParentContact(txt);
                if (errorMessage) setErrorMessage(null);
              }}
              style={[styles.input, styles.parentInput]}
            />
          </View>
        ) : (
          <View style={styles.optionalParentBox}>
            <ThemedText variant="caption" style={{ color: theme.colors.textMuted }}>
              ℹ️ Age {computedAge}: Self-directed registration enabled for students 13 and older.
            </ThemedText>
          </View>
        )}

        {/* SECTION 4: Study Center Branch */}
        <ThemedText variant="label" style={{ color: theme.colors.textMuted, marginTop: 12, marginBottom: 4 }}>
          STUDY CENTER BRANCH
        </ThemedText>
        <TextInput
          placeholder="Center Branch (e.g. Tunis Central, Sousse, Sfax)"
          placeholderTextColor="#94A3B8"
          value={branch}
          onChangeText={setBranch}
          style={[styles.input, { borderColor: theme.colors.outline }]}
        />

        {/* SUBMIT BUTTON */}
        <ThemedButton
          title={`Complete Enrollment & Enter Band ${computedAge <= 9 ? 'A' : computedAge <= 13 ? 'B' : 'C'}`}
          size="large"
          onPress={handleRegister}
          style={{ marginTop: 16 }}
        />

        <ThemedButton
          title="Already have an account? Sign In"
          variant="outline"
          onPress={() => router.push('/(auth)/sign-in' as any)}
          style={{ marginTop: 10 }}
        />
      </ThemedCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 50,
    paddingBottom: 40,
  },
  card: {
    padding: 20,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginVertical: 5,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  parentGuardSection: {
    backgroundColor: '#FFFBEB',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    marginVertical: 10,
  },
  parentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  parentInput: {
    borderColor: '#FCD34D',
    backgroundColor: '#FFFFFF',
  },
  optionalParentBox: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    marginVertical: 6,
  },
});
