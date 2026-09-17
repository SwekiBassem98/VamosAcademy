import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { AgeBand } from '../../types/user.ts';

interface BandLoadingStateProps {
  band: AgeBand;
  message?: string;
  isDark?: boolean;
}

export const BandLoadingState: React.FC<BandLoadingStateProps> = ({
  band,
  message,
  isDark = false,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Continuous smooth rotation
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    pulse.start();
    rotate.start();

    return () => {
      pulse.stop();
      rotate.stop();
    };
  }, [pulseAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (band === 'BAND_A') {
    return (
      <View style={styles.centerContainer}>
        <Animated.View
          style={[
            styles.iconBubbleA,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Text style={styles.iconA}>🌟</Text>
        </Animated.View>
        <Text style={styles.titleA}>
          {message || 'Préparation de ta mission Safari...'}
        </Text>
        <Text style={styles.captionA}>
          Léo le Lion rassemble tes étoiles et tes cartes magiques !
        </Text>
      </View>
    );
  }

  if (band === 'BAND_B') {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.techWrapperB}>
          <Animated.View
            style={[
              styles.radarRingB,
              {
                borderColor: isDark ? '#22D3EE' : '#6366F1',
                transform: [{ rotate: spin }],
              },
            ]}
          />
          <Animated.Text
            style={[
              styles.iconB,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            ⚡
          </Animated.Text>
        </View>
        <Text
          style={[
            styles.titleB,
            { color: isDark ? '#22D3EE' : '#4F46E5' },
          ]}
        >
          {message || 'CALIBRATION VANGUARD EN COURS'}
        </Text>
        <Text
          style={[
            styles.captionB,
            { color: isDark ? '#94A3B8' : '#64748B' },
          ]}
        >
          Synchronisation des protocoles d'entraînement et des classements
        </Text>
      </View>
    );
  }

  // Band C: The Scholars
  return (
    <View style={styles.centerContainer}>
      <Animated.View
        style={[
          styles.scholarRingC,
          {
            borderColor: isDark ? '#38BDF8' : '#0F172A',
            borderTopColor: 'transparent',
            transform: [{ rotate: spin }],
          },
        ]}
      />
      <Text
        style={[
          styles.titleC,
          { color: isDark ? '#F8FAFC' : '#0F172A' },
        ]}
      >
        {message || 'Chargement du corpus académique...'}
      </Text>
      <Text
        style={[
          styles.quoteC,
          { color: isDark ? '#94A3B8' : '#64748B' },
        ]}
      >
        « Le savoir s’acquiert par la persévérance et la méthode. »
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },

  // Band A
  iconBubbleA: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#FED7AA',
  },
  iconA: {
    fontSize: 34,
  },
  titleA: {
    fontSize: 16,
    fontWeight: '800',
    color: '#C2410C',
    textAlign: 'center',
    marginBottom: 4,
  },
  captionA: {
    fontSize: 13,
    color: '#9A3412',
    textAlign: 'center',
  },

  // Band B
  techWrapperB: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  radarRingB: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  iconB: {
    fontSize: 26,
  },
  titleB: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 4,
  },
  captionB: {
    fontSize: 11,
    textAlign: 'center',
  },

  // Band C
  scholarRingC: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    marginBottom: 16,
  },
  titleC: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
    textAlign: 'center',
    marginBottom: 6,
  },
  quoteC: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
