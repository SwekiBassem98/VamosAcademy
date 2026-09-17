import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BAND_B_THEME } from '../../theme/tokens.ts';

export default function BandBGuilds() {
  const GUILDS = [
    { rank: 1, name: 'Tunis Falcon Elite', xp: '18,400 XP', badge: '🥇' },
    { rank: 2, name: 'Sfax Code Squad', xp: '16,200 XP', badge: '🥈' },
    { rank: 3, name: 'Carthage Cyber Guild (You)', xp: '14,900 XP', badge: '🥉' },
    { rank: 4, name: 'Sousse Astro Knights', xp: '12,500 XP', badge: '⭐' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>TUNISIA REGIONAL LEAGUE</Text>
      {GUILDS.map((g) => (
        <View key={g.rank} style={styles.row}>
          <Text style={styles.badge}>{g.badge}</Text>
          <View style={styles.info}>
            <Text style={styles.name}>{g.name}</Text>
            <Text style={styles.xp}>{g.xp}</Text>
          </View>
          <Text style={styles.rank}>#{g.rank}</Text>
        </View>
      ))}
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
  },
  header: {
    fontSize: 12,
    fontWeight: '800',
    color: BAND_B_THEME.colors.textMuted,
    marginVertical: 12,
    letterSpacing: 0.8,
  },
  row: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    borderWidth: 1.5,
    borderColor: BAND_B_THEME.colors.outline,
    gap: 12,
  },
  badge: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: BAND_B_THEME.colors.textPrimary,
  },
  xp: {
    fontSize: 12,
    color: BAND_B_THEME.colors.textMuted,
    marginTop: 2,
  },
  rank: {
    fontSize: 16,
    fontWeight: '800',
    color: BAND_B_THEME.colors.primary,
  },
});
