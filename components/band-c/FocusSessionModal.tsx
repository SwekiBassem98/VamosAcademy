import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';

interface FocusSessionModalProps {
  visible: boolean;
  onClose: () => void;
  exerciseTitle?: string;
  subject?: string;
  initialMinutes?: number;
  onComplete?: (timeSpentMinutes: number) => void;
  isDark?: boolean;
}

export function FocusSessionModal({
  visible,
  onClose,
  exerciseTitle = 'Differential Equations & Exponential Systems',
  subject = 'Mathématiques (Baccalaureate)',
  initialMinutes = 25,
  onComplete,
  isDark = false,
}: FocusSessionModalProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [notes, setNotes] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Sync initial timer when opened
  useEffect(() => {
    if (visible) {
      setSecondsRemaining(initialMinutes * 60);
      setIsRunning(true);
      setSelectedOption(null);
    }
  }, [visible, initialMinutes]);

  // Countdown loop
  useEffect(() => {
    let interval: any = null;
    if (visible && isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [visible, isRunning, secondsRemaining]);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const bg = isDark ? '#090D16' : '#FAFAFA';
  const cardBg = isDark ? '#111827' : '#FFFFFF';
  const borderCol = isDark ? '#1F2937' : '#E5E7EB';
  const textPrimary = isDark ? '#F9FAFB' : '#111827';
  const textMuted = isDark ? '#9CA3AF' : '#6B7280';
  const accent = isDark ? '#38BDF8' : '#0284C7';

  const sampleQuestions = [
    { text: 'A) y(t) = C · e^(-2t) + 3/2' },
    { text: 'B) y(t) = C · e^(2t) - 1/2' },
    { text: 'C) y(t) = 2 · e^(-t) + C' },
    { text: 'D) y(t) = e^(-3t) · cos(t)' },
  ];

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
        <View style={styles.container}>
          {/* Top Bar: Distraction-Free Header */}
          <View style={[styles.topBar, { borderBottomColor: borderCol }]}>
            <View style={styles.badgeRow}>
              <View style={[styles.focusPill, { backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : '#F0F9FF' }]}>
                <View style={[styles.pulseDot, { backgroundColor: isRunning ? '#10B981' : '#F59E0B' }]} />
                <Text style={[styles.focusPillText, { color: accent }]}>FOCUS MODE ACTIVE</Text>
              </View>
              <Text style={[styles.dndNotice, { color: textMuted }]}>🔕 Notifications Muted</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={[styles.exitButton, { borderColor: borderCol }]}
            >
              <Text style={[styles.exitButtonText, { color: textMuted }]}>Exit Session ✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Minimalist Prominent Timer */}
            <View style={[styles.timerCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
              <Text style={[styles.timerLabel, { color: textMuted }]}>SESSION REMAINING</Text>
              <Text style={[styles.timerDisplay, { color: textPrimary }]}>{timerText}</Text>

              <View style={styles.timerControls}>
                <TouchableOpacity
                  onPress={() => setIsRunning(!isRunning)}
                  style={[styles.timerBtn, { backgroundColor: isRunning ? '#EF4444' : accent }]}
                >
                  <Text style={styles.timerBtnText}>{isRunning ? 'Pause' : 'Resume'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSecondsRemaining((prev) => prev + 300)}
                  style={[styles.timerBtnSecondary, { borderColor: borderCol }]}
                >
                  <Text style={[styles.timerBtnSecondaryText, { color: textPrimary }]}>+5 min</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setIsRunning(false);
                    setSecondsRemaining(initialMinutes * 60);
                  }}
                  style={[styles.timerBtnSecondary, { borderColor: borderCol }]}
                >
                  <Text style={[styles.timerBtnSecondaryText, { color: textMuted }]}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Problem Statement Card */}
            <View style={[styles.problemCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
              <Text style={[styles.subjectTag, { color: accent }]}>{subject.toUpperCase()}</Text>
              <Text style={[styles.exerciseTitle, { color: textPrimary }]}>{exerciseTitle}</Text>

              <Text style={[styles.problemText, { color: textPrimary }]}>
                Problem 1: Solve the differential equation y' + 2y = 3, given the boundary condition y(0) = 2.
                Determine the general solution and the steady-state limit as t → +∞.
              </Text>

              {/* Multiple Choice Options */}
              <View style={styles.optionsList}>
                {sampleQuestions.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  return (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.8}
                      onPress={() => setSelectedOption(idx)}
                      style={[
                        styles.optionCard,
                        {
                          backgroundColor: isSelected
                            ? isDark ? 'rgba(56, 189, 248, 0.15)' : '#F0F9FF'
                            : cardBg,
                          borderColor: isSelected ? accent : borderCol,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.radioCircle,
                          { borderColor: isSelected ? accent : borderCol },
                        ]}
                      >
                        {isSelected && <View style={[styles.radioFill, { backgroundColor: accent }]} />}
                      </View>
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color: isSelected ? (isDark ? '#F9FAFB' : '#0F172A') : textPrimary,
                            fontWeight: isSelected ? '700' : '400',
                          },
                        ]}
                      >
                        {opt.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Scratchpad notes input */}
              <Text style={[styles.scratchpadLabel, { color: textMuted }]}>SCHOLAR SCRATCHPAD</Text>
              <TextInput
                style={[
                  styles.scratchpadInput,
                  {
                    backgroundColor: isDark ? '#090D16' : '#F9FAFB',
                    borderColor: borderCol,
                    color: textPrimary,
                  },
                ]}
                placeholder="Type your derivation steps, integrals, or thoughts here..."
                placeholderTextColor={textMuted}
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
              />

              {/* Complete action */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  const spent = Math.max(1, Math.round((initialMinutes * 60 - secondsRemaining) / 60));
                  onComplete?.(spent);
                  onClose();
                }}
                style={[styles.submitButton, { backgroundColor: accent }]}
              >
                <Text style={styles.submitButtonText}>Submit Solution & Complete Session ➔</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  focusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  focusPillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  dndNotice: {
    fontSize: 11,
    fontWeight: '500',
  },
  exitButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  exitButtonText: {
    fontSize: 11,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  timerCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginVertical: 4,
    letterSpacing: -1,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  timerBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  timerBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  timerBtnSecondary: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  timerBtnSecondaryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  problemCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 18,
  },
  subjectTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  problemText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  optionsList: {
    gap: 8,
    marginBottom: 14,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioFill: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  optionText: {
    fontSize: 13,
    flex: 1,
  },
  scratchpadLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  scratchpadInput: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    fontSize: 13,
    textAlignVertical: 'top',
    minHeight: 70,
    marginBottom: 16,
  },
  submitButton: {
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
