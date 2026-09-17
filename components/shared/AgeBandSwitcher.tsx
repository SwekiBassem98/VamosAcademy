import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider.tsx';
import { useUserStore } from '../../store/userStore.ts';
import { ThemedText } from './ThemedText.tsx';

const TEST_AGES = [6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18, 19];

export const AgeBandSwitcher: React.FC = () => {
  const { age, band, setStudentAge, theme } = useTheme();
  const updateStoreAge = useUserStore((s) => s.updateAge);
  const triggerSimulatedLevelUp = useUserStore((s) => s.triggerSimulatedLevelUp);

  const handleSelectAge = (selected: number) => {
    setStudentAge(selected);
    updateStoreAge(selected);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText variant="label" style={{ color: theme.colors.textMuted }}>
          TEST AGE RESOLVER:
        </ThemedText>
        <View
          style={[
            styles.badge,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <ThemedText
            variant="label"
            style={{ color: theme.colors.primary, fontSize: 13 }}
          >
            {theme.name} ({theme.targetAgeLabel})
          </ThemedText>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <TouchableOpacity
          onPress={() => triggerSimulatedLevelUp()}
          style={[
            styles.agePill,
            {
              backgroundColor: '#FEF3C7',
              borderColor: '#F59E0B',
            },
          ]}
        >
          <ThemedText
            variant="label"
            style={{
              color: '#B45309',
              fontSize: 13,
              fontWeight: '700',
            }}
          >
            🎂 Simulate Birthday Level-Up
          </ThemedText>
        </TouchableOpacity>

        {TEST_AGES.map((a) => {
          const isSelected = a === age;
          return (
            <TouchableOpacity
              key={a}
              onPress={() => handleSelectAge(a)}
              style={[
                styles.agePill,
                {
                  backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceElevated,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
                },
              ]}
            >
              <ThemedText
                variant="label"
                style={{
                  color: isSelected ? '#FFFFFF' : theme.colors.textPrimary,
                  fontSize: 14,
                }}
              >
                {a} yr
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scroll: {
    gap: 8,
    paddingHorizontal: 4,
  },
  agePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    minWidth: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
