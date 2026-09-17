import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export type ScholarTab = 'home' | 'practice' | 'games' | 'stats' | 'profile';

interface ScholarBottomNavProps {
  activeTab: ScholarTab;
  onSelectTab: (tab: ScholarTab) => void;
  isDark?: boolean;
}

interface NavItem {
  id: ScholarTab;
  label: string;
  glyph: string;
}

// Subtle, non-cartoonish, academic/minimalist glyphs
const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', glyph: '⌂' },
  { id: 'practice', label: 'Practice', glyph: '◈' },
  { id: 'games', label: 'Logic', glyph: '⌘' },
  { id: 'stats', label: 'Stats', glyph: '▤' },
  { id: 'profile', label: 'Profile', glyph: '●' },
];

export function ScholarBottomNav({ activeTab, onSelectTab, isDark = false }: ScholarBottomNavProps) {
  const bg = isDark ? '#0F172A' : '#FFFFFF';
  const borderCol = isDark ? '#1E293B' : '#E2E8F0';
  const activeColor = isDark ? '#38BDF8' : '#0F172A';
  const inactiveColor = isDark ? '#64748B' : '#94A3B8';
  const activeBg = isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(15, 23, 42, 0.05)';

  return (
    <View style={[styles.navBar, { backgroundColor: bg, borderTopColor: borderCol }]}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.75}
            onPress={() => onSelectTab(item.id)}
            style={styles.navItem}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            testID={`scholar_tab_${item.id}`}
          >
            <View style={[styles.glyphContainer, isActive && { backgroundColor: activeBg }]}>
              <Text style={[styles.glyph, { color: isActive ? activeColor : inactiveColor }]}>
                {item.glyph}
              </Text>
            </View>
            <Text
              style={[
                styles.label,
                { color: isActive ? activeColor : inactiveColor, fontWeight: isActive ? '700' : '500' },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 54,
    minHeight: 48,
    paddingHorizontal: 6,
  },
  glyphContainer: {
    width: 32,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  glyph: {
    fontSize: 16,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
});
