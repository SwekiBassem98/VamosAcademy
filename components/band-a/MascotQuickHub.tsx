import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MASCOTS, MascotId } from './OriginalMascotView.tsx';
import { playTapSound } from '../../lib/soundEffects.ts';

interface MascotQuickHubProps {
  activeMascotId: MascotId;
  onSelectMascot: (id: MascotId) => void;
}

export const MascotQuickHub: React.FC<MascotQuickHubProps> = ({
  activeMascotId,
  onSelectMascot,
}) => {
  const mascotList: MascotId[] = ['fares', 'nour', 'lina', 'zack'];

  const handlePress = (id: MascotId) => {
    playTapSound();
    onSelectMascot(id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>TES COMPAGNONS D'AVENTURE</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {mascotList.map((id) => {
          const mascot = MASCOTS[id];
          const isSelected = id === activeMascotId;

          return (
            <TouchableOpacity
              key={id}
              activeOpacity={0.8}
              onPress={() => handlePress(id)}
              style={[
                styles.card,
                {
                  backgroundColor: isSelected ? mascot.bgTint : '#FFFFFF',
                  borderColor: isSelected ? mascot.accentColor : '#F1F5F9',
                  borderBottomColor: isSelected
                    ? mascot.accentColor
                    : '#E2E8F0',
                },
              ]}
              testID={`mascot_button_${id}`}
            >
              <View
                style={[
                  styles.avatarRing,
                  {
                    borderColor: isSelected
                      ? mascot.accentColor
                      : 'rgba(0,0,0,0.06)',
                  },
                ]}
              >
                <Text style={styles.emoji}>{mascot.emoji}</Text>
              </View>
              <Text
                style={[
                  styles.name,
                  {
                    color: isSelected ? mascot.accentColor : '#334155',
                    fontWeight: isSelected ? '900' : '700',
                  },
                ]}
              >
                {mascot.name.split(' ')[0]}
              </Text>
              <Text style={styles.role}>{mascot.badge}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  scrollContent: {
    gap: 8,
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
  card: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 4,
    minWidth: 84,
    shadowColor: '#12151B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emoji: {
    fontSize: 24,
  },
  name: {
    fontSize: 12,
    marginTop: 2,
  },
  role: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    marginTop: 1,
  },
});
