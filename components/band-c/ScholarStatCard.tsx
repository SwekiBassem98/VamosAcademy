import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BAND_C_THEME } from '../../theme/tokens.ts';

interface ScholarStatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  trendPositive?: boolean;
}

export const ScholarStatCard: React.FC<ScholarStatCardProps> = ({
  label,
  value,
  subtext,
  trend,
  trendPositive = true,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {trend && (
          <Text
            style={[
              styles.trend,
              { color: trendPositive ? '#059669' : '#DC2626' },
            ]}
          >
            {trend}
          </Text>
        )}
      </View>
      {subtext && <Text style={styles.subtext}>{subtext}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: BAND_C_THEME.colors.outline,
    flex: 1,
    minWidth: 140,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: BAND_C_THEME.colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: BAND_C_THEME.colors.textPrimary,
  },
  trend: {
    fontSize: 11,
    fontWeight: '600',
  },
  subtext: {
    fontSize: 11,
    color: BAND_C_THEME.colors.textMuted,
    marginTop: 4,
  },
});
