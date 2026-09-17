import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BAND_C_THEME } from '../../theme/tokens.ts';

interface SubjectMastery {
  subject: string;
  percentage: number;
}

interface MasteryRadarProps {
  items: SubjectMastery[];
}

export const MasteryRadar: React.FC<MasteryRadarProps> = ({ items }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>CURRICULAR MASTERY INDEX</Text>
      {items.map((item) => (
        <View key={item.subject} style={styles.row}>
          <View style={styles.subjectRow}>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.percent}>{item.percentage}%</Text>
          </View>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                {
                  width: `${item.percentage}%`,
                  backgroundColor:
                    item.percentage >= 85
                      ? BAND_C_THEME.colors.secondary
                      : item.percentage >= 70
                      ? '#3B82F6'
                      : '#F59E0B',
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BAND_C_THEME.colors.outline,
    marginVertical: 8,
  },
  header: {
    fontSize: 11,
    fontWeight: '700',
    color: BAND_C_THEME.colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  row: {
    marginBottom: 10,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  subject: {
    fontSize: 13,
    fontWeight: '600',
    color: BAND_C_THEME.colors.textPrimary,
  },
  percent: {
    fontSize: 12,
    fontWeight: '700',
    color: BAND_C_THEME.colors.textMuted,
  },
  track: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
