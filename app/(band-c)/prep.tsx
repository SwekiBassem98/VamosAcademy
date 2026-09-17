import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { BAND_C_THEME } from '../../theme/tokens.ts';

export default function BandCPrep() {
  const SESSIONS = [
    {
      code: 'BAC-MATH-2024',
      title: 'Session Principale 2024 — Mathématiques',
      stream: 'Section Mathématiques',
      questionsCount: 4,
      duration: '4h 00m',
    },
    {
      code: 'BAC-SC-2024',
      title: 'Session Principale 2024 — Sciences Physiques',
      stream: 'Section Sciences Expérimentales',
      questionsCount: 5,
      duration: '3h 00m',
    },
    {
      code: 'BAC-INFO-2024',
      title: 'Session Principale 2024 — Algorithmique & Programmation',
      stream: 'Section Sciences de l’Informatique',
      questionsCount: 3,
      duration: '3h 00m',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>OFFICIAL TUNISIAN BACCALAUREATE ARCHIVE</Text>
      {SESSIONS.map((item) => (
        <View key={item.code} style={styles.card}>
          <View style={styles.topRow}>
            <Text style={styles.code}>{item.code}</Text>
            <Text style={styles.stream}>{item.stream}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>⏱️ {item.duration}</Text>
            <Text style={styles.meta}>📝 {item.questionsCount} Exercises</Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.drillBtn}>
            <Text style={styles.drillBtnText}>Start Timed Exam Session →</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BAND_C_THEME.colors.surface,
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 11,
    fontWeight: '700',
    color: BAND_C_THEME.colors.textMuted,
    marginVertical: 12,
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BAND_C_THEME.colors.outline,
    marginVertical: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  code: {
    fontSize: 10,
    fontWeight: '700',
    color: BAND_C_THEME.colors.secondary,
    letterSpacing: 0.8,
  },
  stream: {
    fontSize: 11,
    color: BAND_C_THEME.colors.textMuted,
    fontWeight: '500',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: BAND_C_THEME.colors.textPrimary,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 14,
  },
  meta: {
    fontSize: 12,
    color: BAND_C_THEME.colors.textMuted,
    fontWeight: '500',
  },
  drillBtn: {
    backgroundColor: BAND_C_THEME.colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  drillBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});
