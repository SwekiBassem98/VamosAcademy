import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BAND_C_THEME } from '../../theme/tokens.ts';

interface ExamTimerProps {
  defaultMinutes?: number;
  onFinish?: () => void;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({
  defaultMinutes = 25,
  onFinish,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(defaultMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      onFinish?.();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, onFinish]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>DEEP WORK / EXAM DRILL</Text>
        <Text style={styles.tag}>POMODORO</Text>
      </View>
      <Text style={styles.time}>{formatted}</Text>
      <View style={styles.btnRow}>
        <TouchableOpacity
          onPress={() => setIsActive(!isActive)}
          style={[
            styles.btn,
            { backgroundColor: isActive ? '#DC2626' : BAND_C_THEME.colors.primary },
          ]}
        >
          <Text style={styles.btnText}>{isActive ? 'Pause' : 'Start Focus'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsActive(false);
            setSecondsLeft(defaultMinutes * 60);
          }}
          style={[styles.btn, styles.resetBtn]}
        >
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BAND_C_THEME.colors.outline,
    marginVertical: 8,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  title: {
    fontSize: 10,
    fontWeight: '700',
    color: BAND_C_THEME.colors.textMuted,
    letterSpacing: 0.8,
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: BAND_C_THEME.colors.secondary,
  },
  time: {
    fontSize: 36,
    fontWeight: '800',
    color: BAND_C_THEME.colors.textPrimary,
    fontVariant: ['tabular-nums'],
    marginVertical: 6,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  resetBtn: {
    backgroundColor: '#F1F5F9',
  },
  resetText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
});
