import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Easing,
} from 'react-native';

interface AnimatedMascotProps {
  isCelebrating?: boolean;
  celebrationMessage?: string;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const AnimatedMascot: React.FC<AnimatedMascotProps> = ({
  isCelebrating = false,
  celebrationMessage = 'Awesome work!',
  onPress,
  size = 'medium',
}) => {
  const jumpAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const speechAnim = useRef(new Animated.Value(0)).current;
  const particleScale = useRef(new Animated.Value(0)).current;

  // Subtle breathing idle loop
  useEffect(() => {
    const idleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(jumpAnim, {
          toValue: -6,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(jumpAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    if (!isCelebrating) {
      idleLoop.start();
    } else {
      idleLoop.stop();
    }

    return () => idleLoop.stop();
  }, [isCelebrating]);

  // Celebration sequence trigger
  useEffect(() => {
    if (isCelebrating) {
      // 1. Reset values
      jumpAnim.setValue(0);
      rotateAnim.setValue(0);
      speechAnim.setValue(0);
      particleScale.setValue(0);

      // 2. Play high-energy celebratory jump + wiggle
      Animated.parallel([
        Animated.sequence([
          Animated.spring(jumpAnim, {
            toValue: -32,
            tension: 80,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.spring(jumpAnim, {
            toValue: -12,
            tension: 50,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.spring(jumpAnim, {
            toValue: 0,
            tension: 40,
            friction: 6,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.25,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -1,
            duration: 160,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 120,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(speechAnim, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.spring(particleScale, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.delay(1800),
          Animated.timing(particleScale, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [isCelebrating]);

  const spin = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  const mascotFontSize = size === 'large' ? 68 : size === 'small' ? 36 : 52;

  const handleTap = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
    onPress?.();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handleTap}
      style={styles.container}
    >
      {/* Celebration Speech Bubble */}
      {isCelebrating ? (
        <Animated.View
          style={[
            styles.speechBubble,
            {
              opacity: speechAnim,
              transform: [
                {
                  scale: speechAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1],
                  }),
                },
                { translateY: jumpAnim },
              ],
            },
          ]}
        >
          <Text style={styles.speechText}>🎉 {celebrationMessage}</Text>
          <View style={styles.speechArrow} />
        </Animated.View>
      ) : null}

      {/* Bursting Confetti / Star Particles */}
      {isCelebrating ? (
        <Animated.View
          style={[
            styles.particleBurst,
            {
              transform: [{ scale: particleScale }],
              opacity: particleScale,
            },
          ]}
        >
          <Text style={[styles.particle, styles.p1]}>⭐</Text>
          <Text style={[styles.particle, styles.p2]}>✨</Text>
          <Text style={[styles.particle, styles.p3]}>🌟</Text>
          <Text style={[styles.particle, styles.p4]}>🎉</Text>
        </Animated.View>
      ) : null}

      {/* Mascot Avatar Body */}
      <Animated.View
        style={[
          styles.mascotCircle,
          {
            transform: [
              { translateY: jumpAnim },
              { scale: scaleAnim },
              { rotate: spin },
            ],
          },
        ]}
      >
        <Text style={[styles.mascotEmoji, { fontSize: mascotFontSize }]}>
          {isCelebrating ? '🥳' : '🦊'}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mascotCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFE8E2',
    borderWidth: 3,
    borderColor: '#FF6B4A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  mascotEmoji: {
    textAlign: 'center',
  },
  speechBubble: {
    position: 'absolute',
    top: -50,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 10,
    alignItems: 'center',
  },
  speechText: {
    color: '#B45309',
    fontSize: 14,
    fontWeight: '900',
  },
  speechArrow: {
    position: 'absolute',
    bottom: -6,
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#F59E0B',
    transform: [{ rotate: '45deg' }],
  },
  particleBurst: {
    position: 'absolute',
    width: 130,
    height: 130,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    fontSize: 20,
  },
  p1: { top: 0, left: 10 },
  p2: { top: 0, right: 10 },
  p3: { bottom: 10, left: 0 },
  p4: { bottom: 10, right: 0 },
});
