import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BAND_B_THEME } from '../../theme/tokens.ts';
import { ClassLeaderboard } from '../../components/band-b/ClassLeaderboard.tsx';

export default function BandBLeaderboardScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>VANGUARD LEADERBOARDS</Text>
        <Text style={styles.sub}>Peer-scoped standings for Class 7-B & Ages 10–13</Text>
      </View>

      <ClassLeaderboard />

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 HOW PROMOTION WORKS</Text>
        <Text style={styles.infoDesc}>
          Rankings reset every Sunday at midnight. The top 5 Cadets in Class 7-B advance to the
          Tunisia Diamond Bracket with special profile badges and bonus XP boosters!
        </Text>
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginVertical: 12,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  infoDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
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
