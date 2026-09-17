import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider.tsx';

interface ThemedTextProps extends TextProps {
  variant?: 'headingDisplay' | 'heading1' | 'heading2' | 'bodyLarge' | 'bodyRegular' | 'label' | 'dataMono';
  color?: string;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'bodyRegular',
  color,
  style,
  children,
  ...rest
}) => {
  const { theme } = useTheme();
  const typeToken = theme.typography[variant] || theme.typography.bodyRegular;
  const textColor = color || theme.colors.textPrimary;

  return (
    <Text
      style={[
        {
          fontSize: typeToken.fontSize,
          lineHeight: typeToken.lineHeight,
          fontWeight: typeToken.fontWeight as any,
          letterSpacing: (typeToken as any).letterSpacing || 0,
          color: textColor,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};
