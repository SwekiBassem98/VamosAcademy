import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { BAND_A_THEME } from '../../theme/tokens.ts';
import { LuxuriousPressable } from '../shared/LuxuriousPressable.tsx';

interface TactileButtonProps {
  title: string;
  emoji?: string;
  onPress: () => void;
  color?: string;
  bevelColor?: string;
  loading?: boolean;
  disabled?: boolean;
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  title,
  emoji = '⭐',
  onPress,
  color = BAND_A_THEME.colors.primary,
  bevelColor = '#B70020',
  loading = false,
  disabled = false,
}) => {
  return (
    <LuxuriousPressable
      scaleOnPress={0.93}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: color,
          borderBottomColor: bevelColor,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <View style={styles.contentRow}>
          {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
          <Text style={styles.text}>{title}</Text>
        </View>
      )}
    </LuxuriousPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 28,
    minHeight: 58,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#B70020',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 22,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
