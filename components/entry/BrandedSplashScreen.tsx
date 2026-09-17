import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text, Dimensions } from 'react-native';

interface BrandedSplashScreenProps {
  onFinish: () => void;
  durationMs?: number; // default 2000ms (1.5 - 2.5s)
}

const { width } = Dimensions.get('window');

export const BrandedSplashScreen: React.FC<BrandedSplashScreenProps> = ({
  onFinish,
  durationMs = 2100,
}) => {
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Entrance animation (scale + fade in)
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 750,
        delay: 250,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Smooth transition out after specified branded loading duration
    const timer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onFinish, logoScale, logoOpacity, textOpacity, screenOpacity]);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      {/* Background brand stripe accent */}
      <View style={styles.topAccentStripe} />

      <View style={styles.centerContent}>
        {/* Animated Vamos Academy / Club Africain Crest */}
        <Animated.View
          style={[
            styles.crestContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.crestShield}>
            {/* Top red header */}
            <View style={styles.crestTopHeader}>
              <Text style={styles.crestStars}>★★★</Text>
            </View>

            {/* Vertical Stripes (Club Africain Heritage: Red & White) */}
            <View style={styles.stripesContainer}>
              <View style={[styles.stripe, { backgroundColor: '#D80027' }]} />
              <View style={[styles.stripe, { backgroundColor: '#FFFFFF' }]} />
              <View style={[styles.stripe, { backgroundColor: '#D80027' }]} />
              <View style={[styles.stripe, { backgroundColor: '#FFFFFF' }]} />
              <View style={[styles.stripe, { backgroundColor: '#D80027' }]} />
            </View>

            {/* Center Emblem / Monogram */}
            <View style={styles.crestCenterBadge}>
              <Text style={styles.crestLetter}>VA</Text>
              <Text style={styles.crestSubYear}>EST. 1920</Text>
            </View>

            {/* Bottom Cobalt Away Accent Bar */}
            <View style={styles.crestBottomBar} />
          </View>
        </Animated.View>

        {/* Brand Wordmark & Tagline */}
        <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
          <Text style={styles.brandTitle}>VAMOS ACADEMY</Text>
          <View style={styles.pillBadge}>
            <View style={styles.redDot} />
            <Text style={styles.pillText}>TUNISIA • ÉDUCATION ADAPTATIVE</Text>
            <View style={styles.blueDot} />
          </View>
          <Text style={styles.brandSub}>Plateforme d'Excellence Scolaire (6–19 ans)</Text>
        </Animated.View>
      </View>

      {/* Subtle Loading Pulse Indicator */}
      <View style={styles.bottomLoaderContainer}>
        <View style={styles.loadingTrack}>
          <View style={styles.loadingBar} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFDF9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  topAccentStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#D80027',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  crestContainer: {
    marginBottom: 26,
    shadowColor: '#12151B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  crestShield: {
    width: 130,
    height: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderBottomLeftRadius: 65,
    borderBottomRightRadius: 65,
    borderWidth: 4,
    borderColor: '#12151B',
    overflow: 'hidden',
    alignItems: 'center',
  },
  crestTopHeader: {
    width: '100%',
    height: 28,
    backgroundColor: '#D80027',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crestStars: {
    color: '#FFBA08',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 4,
  },
  stripesContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 64,
  },
  stripe: {
    flex: 1,
    height: '100%',
  },
  crestCenterBadge: {
    position: 'absolute',
    top: 40,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#12151B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  crestLetter: {
    fontSize: 22,
    fontWeight: '900',
    color: '#D80027',
    letterSpacing: 1,
  },
  crestSubYear: {
    fontSize: 8,
    fontWeight: '800',
    color: '#1A56C4',
    letterSpacing: 0.5,
  },
  crestBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: '#1A56C4',
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#12151B',
    letterSpacing: 2,
    textAlign: 'center',
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE2E6',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#F8B4BD',
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D80027',
  },
  blueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1A56C4',
  },
  pillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#D80027',
    letterSpacing: 0.8,
  },
  brandSub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  bottomLoaderContainer: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
  },
  loadingTrack: {
    width: 140,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  loadingBar: {
    width: '60%',
    height: '100%',
    backgroundColor: '#D80027',
    borderRadius: 2,
  },
});
