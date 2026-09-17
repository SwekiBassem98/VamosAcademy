import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { playBoingSound, playTapSound } from '../../lib/soundEffects.ts';

export type MascotId = 'fares' | 'nour' | 'lina' | 'zack';

export interface MascotProfile {
  id: MascotId;
  name: string;
  role: string;
  emoji: string;
  dialogue: string;
  accentColor: string;
  bgTint: string;
  badge: string;
}

export const MASCOTS: Record<MascotId, MascotProfile> = {
  fares: {
    id: 'fares',
    name: 'Farès le Fennec',
    role: 'Guide de l’Aventure',
    emoji: '🦊',
    dialogue: 'Yalla ! Suis le chemin magique avec moi ! ⭐',
    accentColor: '#D80027', // Club Africain Rouge highlight
    bgTint: '#FDE2E6',
    badge: 'LEADER',
  },
  nour: {
    id: 'nour',
    name: 'Nour la Gazelle',
    role: 'Chiffres & Calculs',
    emoji: '🦌',
    dialogue: '1, 2, 3... bondissons vers les étoiles ! 🌟',
    accentColor: '#B45309',
    bgTint: '#FEF3C7',
    badge: 'MATHS',
  },
  lina: {
    id: 'lina',
    name: 'Lina la Tortue',
    role: 'Jeux & Mémoire',
    emoji: '🐢',
    dialogue: 'Retrouve les paires et gagne des badges ! 🎮',
    accentColor: '#1A56C4', // Club Africain Cobalt Blue
    bgTint: '#EFF6FF',
    badge: 'JEUX',
  },
  zack: {
    id: 'zack',
    name: 'Zack le Faucon',
    role: 'Mots & Lecture',
    emoji: '🦅',
    dialogue: 'Déployons nos ailes vers les histoires ! 📖',
    accentColor: '#059669',
    bgTint: '#ECFDF5',
    badge: 'LECTURE',
  },
};

interface OriginalMascotViewProps {
  mascotId?: MascotId;
  isCelebrating?: boolean;
  size?: 'hero' | 'medium' | 'small';
  customDialogue?: string;
  onPress?: () => void;
  showSpeechBubble?: boolean;
}

export const OriginalMascotView: React.FC<OriginalMascotViewProps> = ({
  mascotId = 'fares',
  isCelebrating = false,
  size = 'hero',
  customDialogue,
  onPress,
  showSpeechBubble = true,
}) => {
  const mascot = MASCOTS[mascotId];
  const jumpAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const earWiggleAnim = useRef(new Animated.Value(0)).current;
  const speechAnim = useRef(new Animated.Value(0)).current;

  // Idle gentle breathing loop
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(jumpAnim, {
          toValue: -6,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(jumpAnim, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    if (!isCelebrating) {
      loop.start();
    } else {
      loop.stop();
    }

    return () => loop.stop();
  }, [isCelebrating]);

  // Speech bubble entrance
  useEffect(() => {
    Animated.spring(speechAnim, {
      toValue: 1,
      tension: 60,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [customDialogue, mascotId]);

  // Celebration bounce
  useEffect(() => {
    if (isCelebrating) {
      Animated.parallel([
        Animated.sequence([
          Animated.spring(jumpAnim, {
            toValue: -28,
            tension: 90,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.spring(jumpAnim, {
            toValue: 0,
            tension: 50,
            friction: 5,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 160,
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
            duration: 140,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [isCelebrating]);

  const handleTap = () => {
    playBoingSound();
    playTapSound();

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.15,
        friction: 3,
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

  const spin = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  const isHero = size === 'hero';
  const isMedium = size === 'medium';

  const avatarDimensions = isHero ? 116 : isMedium ? 80 : 54;
  const emojiSize = isHero ? 62 : isMedium ? 44 : 28;

  return (
    <View style={styles.container}>
      {/* Friendly Character Speech Bubble */}
      {showSpeechBubble && (
        <Animated.View
          style={[
            styles.speechBubble,
            {
              opacity: speechAnim,
              transform: [
                {
                  scale: speechAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
                { translateY: jumpAnim },
              ],
            },
          ]}
        >
          <Text style={styles.speechText}>
            {customDialogue || mascot.dialogue}
          </Text>
          <View style={styles.speechPointer} />
        </Animated.View>
      )}

      {/* Main Mascot Character Container */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleTap}
        style={styles.touchable}
        testID={`mascot_${mascot.id}`}
      >
        <Animated.View
          style={[
            styles.mascotHalo,
            {
              width: avatarDimensions + 14,
              height: avatarDimensions + 14,
              borderRadius: (avatarDimensions + 14) / 2,
              backgroundColor: mascot.bgTint,
              borderColor: mascot.accentColor,
              transform: [
                { translateY: jumpAnim },
                { scale: scaleAnim },
                { rotate: spin },
              ],
            },
          ]}
        >
          {/* Outer Ring with subtle Club Africain Red accent badge */}
          <View
            style={[
              styles.innerAvatar,
              {
                width: avatarDimensions,
                height: avatarDimensions,
                borderRadius: avatarDimensions / 2,
                backgroundColor: '#FFFFFF',
              },
            ]}
          >
            <Text style={{ fontSize: emojiSize }}>{mascot.emoji}</Text>

            {/* Fares iconic Club Africain Scarf / Crest Mini Ribbon */}
            {mascotId === 'fares' && (
              <View style={styles.clubAfricainRibbon}>
                <View style={styles.ribbonStripeRed} />
                <View style={styles.ribbonStripeWhite} />
                <View style={styles.ribbonStripeRed} />
              </View>
            )}
          </View>

          {/* Role Pill Badge */}
          {isHero && (
            <View
              style={[
                styles.badgePill,
                { backgroundColor: mascot.accentColor },
              ]}
            >
              <Text style={styles.badgeText}>{mascot.name.split(' ')[0]}</Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotHalo: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    shadowColor: '#12151B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  innerAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.06)',
    position: 'relative',
    overflow: 'hidden',
  },
  clubAfricainRibbon: {
    position: 'absolute',
    bottom: 4,
    flexDirection: 'row',
    height: 6,
    width: 32,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  ribbonStripeRed: {
    flex: 1,
    backgroundColor: '#D80027',
  },
  ribbonStripeWhite: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  badgePill: {
    position: 'absolute',
    bottom: -8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FDE2E6',
    shadowColor: '#12151B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
    maxWidth: 280,
    alignItems: 'center',
    position: 'relative',
  },
  speechText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#12151B',
    textAlign: 'center',
    lineHeight: 18,
  },
  speechPointer: {
    position: 'absolute',
    bottom: -6,
    width: 12,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#FDE2E6',
    transform: [{ rotate: '45deg' }],
  },
});
