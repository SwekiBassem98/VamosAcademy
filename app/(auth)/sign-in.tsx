import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme/ThemeProvider.tsx';
import { ThemedText } from '../../components/shared/ThemedText.tsx';
import { ThemedButton } from '../../components/shared/ThemedButton.tsx';
import { ThemedCard } from '../../components/shared/ThemedCard.tsx';
import { useUserStore } from '../../store/userStore.ts';
import { authenticateStudent } from '../../lib/auth.ts';

export default function SignInScreen() {
  const router = useRouter();
  const { theme, setStudentAge } = useTheme();
  const [studentCode, setStudentCode] = useState('');
  const [pin, setPin] = useState('');
  const setStudent = useUserStore((s) => s.setStudent);
  const setGuestStudent = useUserStore((s) => s.setGuestStudent);

  const handleSignIn = async () => {
    try {
      const session = await authenticateStudent({
        studentCode: studentCode.trim() || 'VA-10-8842',
        accessPin: pin || '1234',
      });
      setStudentAge(session.student.age);
      setStudent(session.student);

      const routePrefix = session.student.ageBand === 'BAND_A'
        ? '/(band-a)'
        : session.student.ageBand === 'BAND_B'
        ? '/(band-b)'
        : '/(band-c)';
      router.replace(routePrefix as any);
    } catch {
      // Fallback
      router.push('/(auth)/age-selection' as any);
    }
  };

  const handleQuickDemo = (age: number) => {
    setStudentAge(age);
    setGuestStudent(age, `Student (${age}y)`);
    if (age <= 9) router.replace('/(band-a)' as any);
    else if (age <= 13) router.replace('/(band-b)' as any);
    else router.replace('/(band-c)' as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <ThemedCard style={styles.card}>
        <ThemedText variant="heading1" style={{ textAlign: 'center', color: theme.colors.primary }}>
          Vamos Academy
        </ThemedText>
        <ThemedText variant="bodyRegular" style={{ textAlign: 'center', color: theme.colors.textMuted, marginVertical: 8 }}>
          Student Center Portal — Tunisia
        </ThemedText>

        <TextInput
          placeholder="Center Student Code (e.g. VA-10-8842)"
          placeholderTextColor="#94A3B8"
          value={studentCode}
          onChangeText={setStudentCode}
          style={[styles.input, { borderColor: theme.colors.outline }]}
        />
        <TextInput
          placeholder="Access PIN"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={pin}
          onChangeText={setPin}
          style={[styles.input, { borderColor: theme.colors.outline }]}
        />

        <ThemedButton title="Sign In (Check-on-Login)" onPress={handleSignIn} style={{ marginTop: 12 }} />
        <ThemedButton
          title="New Student? Complete Sign-Up"
          variant="outline"
          onPress={() => router.push('/(auth)/sign-up' as any)}
          style={{ marginTop: 8 }}
        />

        <View style={styles.divider} />
        <ThemedText variant="label" style={{ textAlign: 'center', color: theme.colors.textMuted, marginBottom: 8 }}>
          QUICK BAND PREVIEW:
        </ThemedText>
        <View style={styles.quickRow}>
          <ThemedButton title="Band A (7y)" size="normal" onPress={() => handleQuickDemo(7)} style={styles.quickBtn} />
          <ThemedButton title="Band B (11y)" size="normal" onPress={() => handleQuickDemo(11)} style={styles.quickBtn} />
          <ThemedButton title="Band C (17y)" size="normal" onPress={() => handleQuickDemo(17)} style={styles.quickBtn} />
        </View>
      </ThemedCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    padding: 24,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginVertical: 6,
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 18,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 6,
  },
  quickBtn: {
    flex: 1,
    paddingHorizontal: 6,
  },
});
