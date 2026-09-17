import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BAND_B_THEME } from '../../theme/tokens.ts';
import { useProgressStore } from '../../store/progressStore.ts';
import { useUserStore } from '../../store/userStore.ts';

export default function BandBProfileScreen() {
  const router = useRouter();
  const student = useUserStore((s) => s.student);
  const { xp, currentLevel, streakDays } = useProgressStore((s) => s.metrics);
  const [selectedAvatar, setSelectedAvatar] = useState('⚡');

  const avatarChoices = [
    { emoji: '⚡', name: 'Cyber Bolt', req: 'Level 1' },
    { emoji: '🐺', name: 'Desert Wolf', req: 'Level 2' },
    { emoji: '🦅', name: 'Atlas Eagle', req: 'Level 4' },
    { emoji: '🚀', name: 'Solar Cadet', req: 'Level 6' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>VANGUARD PROFILE</Text>
        <Text style={styles.sub}>Cadet credentials, custom avatar & unlocked titles</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>{selectedAvatar}</Text>
        </View>
        <Text style={styles.name}>{student?.fullName || 'Cadet Bassem'}</Text>
        <Text style={styles.rank}>
          {currentLevel >= 5 ? 'CYBER COMMANDER • LEVEL 5' : 'VANGUARD SPECIALIST • LEVEL 4'}
        </Text>
        <Text style={styles.school}>Class 7-B • Sousse Academy Branch</Text>
      </View>

      <Text style={styles.sectionTitle}>SELECT AVATAR CREST</Text>
      <View style={styles.avatarRow}>
        {avatarChoices.map((av) => (
          <TouchableOpacity
            key={av.name}
            style={[styles.avatarOption, selectedAvatar === av.emoji && styles.avatarOptionActive]}
            onPress={() => setSelectedAvatar(av.emoji)}
          >
            <Text style={styles.optionEmoji}>{av.emoji}</Text>
            <Text style={styles.optionName}>{av.name}</Text>
            <Text style={styles.optionReq}>{av.req}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>LIFETIME PERFORMANCE</Text>
        <View style={styles.statGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{xp}</Text>
            <Text style={styles.statLabel}>TOTAL XP</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{streakDays} Days</Text>
            <Text style={styles.statLabel}>STREAK RECORD</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>94%</Text>
            <Text style={styles.statLabel}>ACCURACY</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>#4</Text>
            <Text style={styles.statLabel}>CLASS RANK</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← RETURN TO HQ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BAND_B_THEME.colors.surface,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  sub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: BAND_B_THEME.colors.primary,
    marginBottom: 10,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  rank: {
    fontSize: 12,
    fontWeight: '800',
    color: BAND_B_THEME.colors.primary,
    letterSpacing: 0.6,
    marginTop: 2,
  },
  school: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  avatarOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  avatarOptionActive: {
    borderColor: BAND_B_THEME.colors.primary,
    backgroundColor: '#EEF2FF',
  },
  optionEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  optionName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  optionReq: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
  },
  backButton: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: BAND_B_THEME.colors.primary,
  },
});
