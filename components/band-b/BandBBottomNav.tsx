import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BAND_B_THEME } from '../../theme/tokens.ts';

export type BandBTab = 'home' | 'practice' | 'games' | 'leaderboard' | 'profile';

interface BandBBottomNavProps {
  activeTab: BandBTab;
  onSelectTab: (tab: BandBTab) => void;
}

interface NavItem {
  id: BandBTab;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'practice', label: 'Practice', icon: '🎯' },
  { id: 'games', label: 'Games', icon: '🎮' },
  { id: 'leaderboard', label: 'Ranks', icon: '🏆' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

export function BandBBottomNav({ activeTab, onSelectTab }: BandBBottomNavProps) {
  return (
    <View style={styles.navBar}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={() => onSelectTab(item.id)}
            style={styles.navItem}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            testID={`tab_${item.id}`}
          >
            <View style={[styles.iconContainer, isActive && styles.iconActiveContainer]}>
              <Text style={styles.iconText}>{item.icon}</Text>
            </View>
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
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
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 58,
    minHeight: 48,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 38,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActiveContainer: {
    backgroundColor: '#EEF2FF',
  },
  iconText: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },
  navLabelActive: {
    color: BAND_B_THEME.colors.primary,
    fontWeight: '900',
  },
});
