import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

const { width } = Dimensions.get('window');

interface TourSlide {
  id: string;
  emoji: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  accentColor: string;
}

const TOUR_SLIDES: TourSlide[] = [
  {
    id: '1',
    emoji: '🏫',
    badge: 'CENTRE & CURRICULUM',
    badgeColor: '#FDE2E6',
    title: 'Practice what you learn at the center',
    description: 'Direct alignment with the official Tunisian curriculum and your study branch.',
    accentColor: '#D80027',
  },
  {
    id: '2',
    emoji: '🎮',
    badge: 'GAMIFIED MASTERY',
    badgeColor: '#EFF6FF',
    title: 'Play games to review & reinforce',
    description: 'Solve puzzles, memory challenges, and timed drills tailored to your skill level.',
    accentColor: '#1A56C4',
  },
  {
    id: '3',
    emoji: '📈',
    badge: 'GROWTH TELEMETRY',
    badgeColor: '#FEF3C7',
    title: 'Track your progress & achievements',
    description: 'Collect stars, level up your avatar, and build daily study streaks.',
    accentColor: '#B45309',
  },
  {
    id: '4',
    emoji: '🦊',
    badge: 'ADAPTIVE EXPERIENCE',
    badgeColor: '#FDE2E6',
    title: 'An interface designed exclusively for you',
    description: 'Visual styles, tasks, and companions calibrate automatically to your age band.',
    accentColor: '#D80027',
  },
];

interface GuidedTourProps {
  onComplete: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    if (index >= 0 && index < TOUR_SLIDES.length && index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    if (currentIndex < TOUR_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar with Skip Option */}
      <View style={styles.topBar}>
        <View style={styles.brandTag}>
          <Text style={styles.brandTagText}>VAMOS ACADEMY</Text>
        </View>
        <TouchableOpacity
          onPress={onComplete}
          style={styles.skipButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          testID="skip_tour_button"
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable Screens */}
      <FlatList
        ref={flatListRef}
        data={TOUR_SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {/* Illustration Circle */}
            <View style={[styles.illustrationCircle, { borderColor: item.accentColor }]}>
              <Text style={styles.illustrationEmoji}>{item.emoji}</Text>
            </View>

            {/* Badge pill */}
            <View style={[styles.badgePill, { backgroundColor: item.badgeColor }]}>
              <Text style={[styles.badgeText, { color: item.accentColor }]}>{item.badge}</Text>
            </View>

            {/* Title: 1 short sentence */}
            <Text style={styles.slideTitle}>{item.title}</Text>

            {/* Description */}
            <Text style={styles.slideDescription}>{item.description}</Text>
          </View>
        )}
      />

      {/* Bottom Controls: Dots Indicator + Next/Get Started Button */}
      <View style={styles.bottomControls}>
        {/* Progress Dots Indicator */}
        <View style={styles.dotsRow}>
          {TOUR_SLIDES.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <View
                key={idx}
                style={[
                  styles.dot,
                  isActive && styles.activeDot,
                ]}
              />
            );
          })}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleNext}
          style={styles.actionButton}
          testID="tour_next_button"
        >
          <Text style={styles.actionButtonText}>
            {currentIndex === TOUR_SLIDES.length - 1 ? 'Get Started ➔' : 'Continue ➔'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
    justifyContent: 'space-between',
    paddingTop: 54,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 44,
  },
  brandTag: {
    backgroundColor: '#FDE2E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  brandTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#D80027',
    letterSpacing: 0.8,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  skipText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  illustrationCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    shadowColor: '#12151B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 28,
  },
  illustrationEmoji: {
    fontSize: 64,
  },
  badgePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#12151B',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 28,
  },
  slideDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  bottomControls: {
    paddingHorizontal: 24,
    gap: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#D80027',
  },
  actionButton: {
    backgroundColor: '#D80027',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#B70020',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
