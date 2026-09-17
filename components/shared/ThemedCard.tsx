import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider.tsx';

interface ThemedCardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'subtle';
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  children,
  style,
  variant = 'elevated',
}) => {
  const { theme } = useTheme();
  const comp = theme.components;

  const backgroundColor =
    variant === 'subtle'
      ? theme.colors.primaryContainer
      : theme.colors.surfaceElevated;

  const borderWidth = variant === 'outlined' || theme.band === 'BAND_C' ? 1 : 0;
  const borderColor = theme.colors.outline;

  return (
    <View
      style={[
        {
          backgroundColor,
          borderRadius: comp.cardRadius,
          padding: 18,
          borderWidth,
          borderColor,
          // Subtle elevation
          shadowColor: '#000',
          shadowOffset: { width: 0, height: comp.elevation },
          shadowOpacity: comp.elevation * 0.03,
          shadowRadius: comp.elevation * 3,
          elevation: comp.elevation,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
