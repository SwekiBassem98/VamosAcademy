import React from 'react';
import { ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider.tsx';
import { ThemedText } from './ThemedText.tsx';
import { LuxuriousPressable } from './LuxuriousPressable.tsx';

interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'normal' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'normal',
  style,
  textStyle,
  disabled = false,
  loading = false,
  leftIcon,
}) => {
  const { theme } = useTheme();
  const comp = theme.components;

  let backgroundColor = theme.colors.primary;
  let textColor = '#FFFFFF';
  let borderWidth = 0;
  let borderColor = 'transparent';

  if (variant === 'secondary') {
    backgroundColor = theme.colors.secondary;
  } else if (variant === 'outline') {
    backgroundColor = 'transparent';
    borderWidth = 1.5;
    borderColor = theme.colors.outline;
    textColor = theme.colors.textPrimary;
  }

  // 3D tactile offset if Band A
  const bevelOffset = comp.has3DBevel ? 4 : 0;
  const shadowColor = comp.has3DBevel ? '#D95333' : 'rgba(0,0,0,0.1)';

  return (
    <LuxuriousPressable
      scaleOnPress={comp.has3DBevel ? 0.94 : 0.97}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        {
          backgroundColor,
          borderRadius: comp.buttonRadius,
          minHeight: comp.minTouchTarget,
          paddingVertical: size === 'large' ? 16 : 12,
          paddingHorizontal: 24,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth,
          borderColor,
          borderBottomWidth: comp.has3DBevel ? bevelOffset : borderWidth,
          borderBottomColor: comp.has3DBevel ? shadowColor : borderColor,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {leftIcon}
          <ThemedText
            variant="label"
            style={[{ color: textColor, textAlign: 'center' }, textStyle]}
          >
            {title}
          </ThemedText>
        </View>
      )}
    </LuxuriousPressable>
  );
};
