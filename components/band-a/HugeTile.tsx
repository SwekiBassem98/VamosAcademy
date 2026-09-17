import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';

interface HugeTileProps {
  label: string;
  mascotEmoji: string;
  subtitle?: string;
  badge?: string;
  backgroundColor: string;
  bevelColor: string;
  onPress: () => void;
  testID?: string;
}

export const HugeTile: React.FC<HugeTileProps> = ({
  label,
  mascotEmoji,
  subtitle,
  badge,
  backgroundColor,
  bevelColor,
  onPress,
  testID,
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [elevateAnim] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }),
      Animated.timing(elevateAnim, {
        toValue: 4,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 15,
        bounciness: 6,
      }),
      Animated.timing(elevateAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [
            { scale: scaleAnim },
            { translateY: elevateAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        testID={testID}
        activeOpacity={0.92}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          styles.tileContainer,
          {
            backgroundColor,
            borderColor: bevelColor,
            borderBottomColor: bevelColor,
          },
        ]}
      >
        {/* Optional small corner badge */}
        {badge ? (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}

        {/* Large Centered Mascot / Illustration */}
        <View style={styles.illustrationWrapper}>
          <Text style={styles.mascotEmoji}>{mascotEmoji}</Text>
        </View>

        {/* One word of label text - per spec */}
        <View style={styles.labelWrapper}>
          <Text style={styles.labelText}>{label.toUpperCase()}</Text>
          {subtitle ? <Text style={styles.subtext}>{subtitle}</Text> : null}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '48%',
    minHeight: 155,
    marginVertical: 6,
  },
  tileContainer: {
    flex: 1,
    borderRadius: 26,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderBottomWidth: 6, // 3D neo-tactile bottom bevel per Band A spec
    position: 'relative',
    overflow: 'hidden',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1E293B',
  },
  illustrationWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  mascotEmoji: {
    fontSize: 38,
  },
  labelWrapper: {
    alignItems: 'center',
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
});
