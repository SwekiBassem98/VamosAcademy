import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme/ThemeProvider.tsx';
import { ThemedText } from './ThemedText.tsx';

interface VamosHeaderProps {
  title?: string;
  subtitle?: string;
  showParentPortalButton?: boolean;
}

export const VamosHeader: React.FC<VamosHeaderProps> = ({
  title = 'Vamos Academy',
  subtitle,
  showParentPortalButton = true,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <ThemedText variant="heading1" style={{ color: theme.colors.primary }}>
            {title}
          </ThemedText>
          <View
            style={[
              styles.tag,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
          >
            <ThemedText
              variant="label"
              style={{ color: theme.colors.primary, fontSize: 10 }}
            >
              TUNISIA
            </ThemedText>
          </View>
        </View>

        {showParentPortalButton && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/parent-portal' as any)}
            style={[
              styles.parentPortalBtn,
              { borderColor: theme.colors.outline || '#E2E8F0' },
            ]}
          >
            <ThemedText variant="label" style={{ fontSize: 11, color: theme.colors.textPrimary }}>
              🛡️ Parent / Tuteur
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
      {subtitle && (
        <ThemedText
          variant="bodyRegular"
          style={{ color: theme.colors.textMuted, marginTop: 4 }}
        >
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  parentPortalBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
});
