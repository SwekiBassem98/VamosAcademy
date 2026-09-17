import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { BAND_A_THEME } from '../../theme/tokens.ts';
import { TactileButton } from './TactileButton.tsx';

interface StarRewardModalProps {
  visible: boolean;
  starsEarned: number;
  message?: string;
  onClose: () => void;
}

export const StarRewardModal: React.FC<StarRewardModalProps> = ({
  visible,
  starsEarned = 3,
  message = 'Superstar! You finished the quest!',
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.starsIcon}>🌟 ⭐ 🌟</Text>
          <Text style={styles.title}>+{starsEarned} STARS!</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.mascotTip}>
            <Text style={styles.mascotEmoji}>🦊</Text>
            <Text style={styles.mascotText}>
              Youssef the Fennec says: "Magnifique! Let's explore the next mystery!"
            </Text>
          </View>
          <TactileButton
            title="COLLECT STARS!"
            emoji="✨"
            color={BAND_A_THEME.colors.secondary}
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(45, 35, 39, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFDF9',
    borderRadius: 32,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    borderWidth: 3,
    borderColor: BAND_A_THEME.colors.primaryContainer,
  },
  starsIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: BAND_A_THEME.colors.textPrimary,
    textAlign: 'center',
    marginVertical: 10,
  },
  mascotTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BAND_A_THEME.colors.primaryContainer,
    borderRadius: 16,
    padding: 12,
    marginVertical: 16,
    gap: 10,
  },
  mascotEmoji: {
    fontSize: 28,
  },
  mascotText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: BAND_A_THEME.colors.textPrimary,
  },
});
