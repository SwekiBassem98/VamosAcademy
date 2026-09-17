import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { playTapSound, playStarSound, playBoingSound } from '../../lib/soundEffects.ts';

export interface PathNode {
  id: string;
  stepNumber: number;
  title: string;
  subTitle: string;
  emoji: string;
  starsEarned: number;
  totalStars: number;
  status: 'completed' | 'current' | 'locked';
  alignment: 'left' | 'center' | 'right';
  badgeLabel?: string;
}

export const ADVENTURE_PATH_NODES: PathNode[] = [
  {
    id: 'step_1',
    stepNumber: 1,
    title: 'Oasis des Étoiles',
    subTitle: 'Nombres & Compter',
    emoji: '🌴',
    starsEarned: 3,
    totalStars: 3,
    status: 'completed',
    alignment: 'center',
    badgeLabel: 'Terminé !',
  },
  {
    id: 'step_2',
    stepNumber: 2,
    title: 'Dunes Dorées',
    subTitle: 'Animaux du Désert',
    emoji: '🏜️',
    starsEarned: 3,
    totalStars: 3,
    status: 'completed',
    alignment: 'left',
    badgeLabel: 'Terminé !',
  },
  {
    id: 'step_3',
    stepNumber: 3,
    title: 'Palais de Carthage',
    subTitle: 'Mission du Jour',
    emoji: '🏛️',
    starsEarned: 0,
    totalStars: 3,
    status: 'current',
    alignment: 'right',
    badgeLabel: 'En cours !',
  },
  {
    id: 'step_4',
    stepNumber: 4,
    title: 'Phare de Sidi Bou',
    subTitle: 'Couleurs & Formes',
    emoji: '🌊',
    starsEarned: 0,
    totalStars: 3,
    status: 'locked',
    alignment: 'center',
    badgeLabel: 'Étape 4',
  },
  {
    id: 'step_5',
    stepNumber: 5,
    title: 'Île aux Flamants',
    subTitle: 'Vocabulaire Magique',
    emoji: '🦩',
    starsEarned: 0,
    totalStars: 3,
    status: 'locked',
    alignment: 'left',
    badgeLabel: 'Étape 5',
  },
  {
    id: 'step_6',
    stepNumber: 6,
    title: 'Grande Fusée Cosmique',
    subTitle: 'Grand Trésor des Explorateurs',
    emoji: '🚀',
    starsEarned: 0,
    totalStars: 5,
    status: 'locked',
    alignment: 'center',
    badgeLabel: 'COFFRE 🎁',
  },
];

interface LearningPathTrailProps {
  onSelectNode: (node: PathNode) => void;
  onMascotCheer?: () => void;
}

export const LearningPathTrail: React.FC<LearningPathTrailProps> = ({
  onSelectNode,
  onMascotCheer,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for active stepping stone
  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handlePressNode = (node: PathNode) => {
    if (node.status === 'locked') {
      playBoingSound();
      return;
    }
    if (node.status === 'completed') {
      playStarSound();
    } else {
      playTapSound();
    }
    onSelectNode(node);
  };

  return (
    <View style={styles.container}>
      {/* Path Title Badge */}
      <View style={styles.trailHeader}>
        <View style={styles.badgeRow}>
          <Text style={styles.trailEmoji}>🗺️</Text>
          <Text style={styles.trailTitle}>CHEMIN DES EXPLORATEURS</Text>
        </View>
        <Text style={styles.trailSubtitle}>
          Avance pas à pas avec Farès pour débloquer les étoiles !
        </Text>
      </View>

      {/* Meandering Winding Path of Stepping Stones */}
      <View style={styles.pathWrapper}>
        {ADVENTURE_PATH_NODES.map((node, index) => {
          const isCompleted = node.status === 'completed';
          const isCurrent = node.status === 'current';
          const isLocked = node.status === 'locked';

          // Alignment position for meandering trail effect
          const alignStyle =
            node.alignment === 'left'
              ? styles.alignLeft
              : node.alignment === 'right'
              ? styles.alignRight
              : styles.alignCenter;

          return (
            <View key={node.id} style={[styles.nodeWrapper, alignStyle]}>
              {/* Stepping Stone */}
              <TouchableOpacity
                activeOpacity={isLocked ? 0.9 : 0.8}
                onPress={() => handlePressNode(node)}
                style={styles.touchableNode}
                testID={`path_node_${node.id}`}
              >
                {/* Active Current Node: Fares Standing On It & Glowing Accent Halo */}
                {isCurrent ? (
                  <View style={styles.currentGuideContainer}>
                    {/* Farès Mini Mascot on Top of Stone */}
                    <View style={styles.faresAvatarContainer}>
                      <View style={styles.faresAvatarCircle}>
                        <Text style={styles.faresAvatarEmoji}>🦊</Text>
                      </View>
                      <View style={styles.speechPill}>
                        <Text style={styles.speechPillText}>C'EST ICI ! ➔</Text>
                      </View>
                    </View>

                    {/* Animated Pulsing Stepping Stone */}
                    <Animated.View
                      style={[
                        styles.stoneBase,
                        styles.stoneCurrent,
                        { transform: [{ scale: pulseAnim }] },
                      ]}
                    >
                      <View style={styles.stoneIconCircleCurrent}>
                        <Text style={styles.stoneEmoji}>{node.emoji}</Text>
                      </View>
                      <View style={styles.currentInfoBlock}>
                        <Text style={styles.stoneTitleCurrent}>{node.title}</Text>
                        <Text style={styles.stoneSubCurrent}>{node.subTitle}</Text>
                        <View style={styles.playActionPill}>
                          <Text style={styles.playActionText}>JOUER ⭐</Text>
                        </View>
                      </View>
                    </Animated.View>
                  </View>
                ) : isCompleted ? (
                  /* Completed Node (Soft green tint, 3 gold stars, checkmark) */
                  <View style={[styles.stoneBase, styles.stoneCompleted]}>
                    <View style={styles.stoneIconCircleCompleted}>
                      <Text style={styles.stoneEmoji}>{node.emoji}</Text>
                    </View>
                    <View style={styles.nodeTextCol}>
                      <Text style={styles.stoneTitleCompleted}>{node.title}</Text>
                      <View style={styles.starsRow}>
                        <Text style={styles.starsText}>⭐⭐⭐</Text>
                        <Text style={styles.completedCheck}>✓ Terminé</Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  /* Locked Node */
                  <View style={[styles.stoneBase, styles.stoneLocked]}>
                    <View style={styles.stoneIconCircleLocked}>
                      <Text style={styles.lockEmoji}>🔒</Text>
                    </View>
                    <View style={styles.nodeTextCol}>
                      <Text style={styles.stoneTitleLocked}>{node.title}</Text>
                      <Text style={styles.stoneSubLocked}>Étape suivante</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>

              {/* Meandering Trail Connector Footsteps / Dash Dots */}
              {index < ADVENTURE_PATH_NODES.length - 1 && (
                <View style={styles.trailConnector}>
                  <View
                    style={[
                      styles.pathDot,
                      isCompleted ? styles.pathDotActive : styles.pathDotInactive,
                    ]}
                  />
                  <View
                    style={[
                      styles.pathDot,
                      isCompleted || isCurrent
                        ? styles.pathDotActive
                        : styles.pathDotInactive,
                    ]}
                  />
                  <View
                    style={[
                      styles.pathDot,
                      styles.pathDotInactive,
                    ]}
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 12,
  },
  trailHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FDE2E6',
    gap: 8,
    shadowColor: '#12151B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  trailEmoji: {
    fontSize: 18,
  },
  trailTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#D80027', // Club Africain Rouge Accent
    letterSpacing: 0.6,
  },
  trailSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
  },
  pathWrapper: {
    width: '100%',
    paddingHorizontal: 8,
  },
  nodeWrapper: {
    width: '100%',
    marginVertical: 4,
  },
  alignLeft: {
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  alignRight: {
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  alignCenter: {
    alignItems: 'center',
  },
  touchableNode: {
    maxWidth: 320,
    width: '100%',
  },
  stoneBase: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderBottomWidth: 5,
  },
  stoneCompleted: {
    backgroundColor: '#FFFFFF',
    borderColor: '#BBF7D0',
    borderBottomColor: '#86EFAC',
  },
  stoneCurrent: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D80027', // Club Africain Rouge Bold highlight
    borderBottomColor: '#B70020',
    borderWidth: 3,
    borderBottomWidth: 6,
    shadowColor: '#D80027',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  stoneLocked: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderBottomColor: '#CBD5E1',
    opacity: 0.85,
  },
  currentGuideContainer: {
    width: '100%',
  },
  faresAvatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -14,
    marginLeft: 18,
    zIndex: 10,
    gap: 8,
  },
  faresAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FDE2E6',
    borderWidth: 2.5,
    borderColor: '#D80027',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  faresAvatarEmoji: {
    fontSize: 24,
  },
  speechPill: {
    backgroundColor: '#D80027',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  speechPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  stoneIconCircleCurrent: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFF1F2',
    borderWidth: 2,
    borderColor: '#FECDD3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stoneIconCircleCompleted: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stoneIconCircleLocked: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stoneEmoji: {
    fontSize: 26,
  },
  lockEmoji: {
    fontSize: 20,
    opacity: 0.6,
  },
  currentInfoBlock: {
    flex: 1,
  },
  nodeTextCol: {
    flex: 1,
  },
  stoneTitleCurrent: {
    fontSize: 15,
    fontWeight: '900',
    color: '#12151B',
  },
  stoneSubCurrent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  playActionPill: {
    backgroundColor: '#D80027',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  playActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  stoneTitleCompleted: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  starsText: {
    fontSize: 12,
  },
  completedCheck: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
  stoneTitleLocked: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
  stoneSubLocked: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 1,
  },
  trailConnector: {
    alignItems: 'center',
    marginVertical: 4,
    gap: 4,
  },
  pathDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pathDotActive: {
    backgroundColor: '#FCA5A5',
  },
  pathDotInactive: {
    backgroundColor: '#E2E8F0',
  },
});
