import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AgeBand } from '../../types/user.ts';
import { ThemedButton } from './ThemedButton.tsx';
import { LuxuriousPressable } from './LuxuriousPressable.tsx';

interface BandEmptyStateProps {
  band: AgeBand;
  title?: string;
  subtitle?: string;
  actionTitle?: string;
  onAction?: () => void;
  isDark?: boolean;
}

export const BandEmptyState: React.FC<BandEmptyStateProps> = ({
  band,
  title,
  subtitle,
  actionTitle,
  onAction,
  isDark = false,
}) => {
  if (band === 'BAND_A') {
    return (
      <View style={[styles.containerBandA, isDark && styles.containerDark]}>
        <View style={styles.badgeA}>
          <Text style={styles.emojiA}>🦊✨</Text>
        </View>
        <Text style={styles.titleA}>{title || 'Bravo ! Tout est terminé !'}</Text>
        <Text style={styles.subtitleA}>
          {subtitle ||
            'Tu as remporté toutes les étoiles de cette expédition. Reviens vite pour de nouveaux défis avec Youssef le Fennec !'}
        </Text>
        {onAction && actionTitle && (
          <ThemedButton
            title={actionTitle}
            size="large"
            onPress={onAction}
            style={{ marginTop: 16 }}
          />
        )}
      </View>
    );
  }

  if (band === 'BAND_B') {
    return (
      <View
        style={[
          styles.containerBandB,
          {
            backgroundColor: isDark ? '#0D1117' : '#F8FAFC',
            borderColor: isDark ? '#1A56C4' : '#1A56C4',
          },
        ]}
      >
        <View
          style={[
            styles.radarContainerB,
            { borderColor: isDark ? 'rgba(26, 86, 196, 0.4)' : 'rgba(26, 86, 196, 0.25)' },
          ]}
        >
          <Text style={styles.radarIconB}>📡</Text>
        </View>
        <View style={styles.cyberBadgeB}>
          <Text
            style={[styles.cyberBadgeTextB, { color: isDark ? '#60A5FA' : '#1A56C4' }]}
          >
            SECTEUR SÉCURISÉ • AUCUNE ALERTE
          </Text>
        </View>
        <Text style={[styles.titleB, { color: isDark ? '#F1F5F9' : '#12151B' }]}>
          {title || 'Toutes les missions neutralisées'}
        </Text>
        <Text style={[styles.subtitleB, { color: isDark ? '#94A3B8' : '#64748B' }]}>
          {subtitle ||
            'Excellente exécution Vanguard. Tous les objectifs de ce protocole ont été validés. En attente de la prochaine vague d’exercices.'}
        </Text>
        {onAction && actionTitle && (
          <LuxuriousPressable
            onPress={onAction}
            style={[
              styles.cyberButtonB,
              { backgroundColor: '#D80027' },
            ]}
          >
            <Text style={styles.cyberButtonTextB}>{actionTitle} ➔</Text>
          </LuxuriousPressable>
        )}
      </View>
    );
  }

  // Band C: The Scholars (Refined Academic Minimalist)
  return (
    <View
      style={[
        styles.containerBandC,
        {
          backgroundColor: isDark ? '#12151B' : '#FFFFFF',
          borderColor: isDark ? '#1E2430' : '#E5E7EB',
        },
      ]}
    >
      <View
        style={[
          styles.sealC,
          { backgroundColor: isDark ? '#1E2430' : '#F8F9FA', borderColor: isDark ? '#2D3748' : '#E5E7EB' },
        ]}
      >
        <Text style={styles.sealIconC}>🏛️</Text>
      </View>
      <Text style={[styles.titleC, { color: isDark ? '#F8FAFC' : '#12151B' }]}>
        {title || 'Module d’Étude Validé'}
      </Text>
      <Text style={[styles.subtitleC, { color: isDark ? '#94A3B8' : '#64748B' }]}>
        {subtitle ||
          'Aucune épreuve en suspens pour cette discipline. Lancez une session de travail en profondeur ou explorez les annales nationales du Baccalauréat.'}
      </Text>
      {onAction && actionTitle && (
        <LuxuriousPressable
          onPress={onAction}
          style={[
            styles.scholarButtonC,
            { backgroundColor: '#D80027' },
          ]}
        >
          <Text style={styles.scholarButtonTextC}>{actionTitle}</Text>
        </LuxuriousPressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Band A Styles
  containerBandA: {
    backgroundColor: '#FFFDF9',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginVertical: 12,
    borderWidth: 2,
    borderColor: '#FDE2E6',
  },
  containerDark: {
    backgroundColor: '#1E1B18',
    borderColor: '#B70020',
  },
  badgeA: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FDE2E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emojiA: {
    fontSize: 40,
  },
  titleA: {
    fontSize: 20,
    fontWeight: '900',
    color: '#D80027',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleA: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },

  // Band B Styles
  containerBandB: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginVertical: 12,
    borderWidth: 1.5,
  },
  radarContainerB: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  radarIconB: {
    fontSize: 32,
  },
  cyberBadgeB: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    marginBottom: 8,
  },
  cyberBadgeTextB: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  titleB: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitleB: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 10,
  },
  cyberButtonB: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  cyberButtonTextB: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  // Band C Styles
  containerBandC: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginVertical: 12,
    borderWidth: 1,
  },
  sealC: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sealIconC: {
    fontSize: 28,
  },
  titleC: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitleC: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 14,
  },
  scholarButtonC: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 8,
  },
  scholarButtonTextC: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
