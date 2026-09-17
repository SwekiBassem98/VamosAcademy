import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { OriginalMascotView } from '../../components/band-a/OriginalMascotView.tsx';
import { useProgressStore } from '../../store/progressStore.ts';
import {
  playTapSound,
  playSuccessSound,
  playStarSound,
  playBoingSound,
} from '../../lib/soundEffects.ts';

interface Question {
  id: string;
  promptText: string;
  emojiPrompt: string;
  options: { label: string; emoji: string; isCorrect: boolean }[];
  audioHint: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    promptText: 'Combien d’étoiles vois-tu ?',
    emojiPrompt: '⭐ ⭐ ⭐',
    options: [
      { label: '2', emoji: '✌️', isCorrect: false },
      { label: '3', emoji: '✨', isCorrect: true },
      { label: '4', emoji: '🍀', isCorrect: false },
    ],
    audioHint: 'Écoute : Compte les étoiles une par une !',
  },
  {
    id: 'q2',
    promptText: 'Qui est le champion du Sahara ?',
    emojiPrompt: '🦊 🐪 🦁',
    options: [
      { label: 'Le Fennec', emoji: '🦊', isCorrect: true },
      { label: 'Le Chameau', emoji: '🐪', isCorrect: false },
      { label: 'Le Lion', emoji: '🦁', isCorrect: false },
    ],
    audioHint: 'Écoute : Il a de très grandes oreilles !',
  },
  {
    id: 'q3',
    promptText: 'Quelle est la couleur du Soleil ?',
    emojiPrompt: '☀️',
    options: [
      { label: 'Bleu', emoji: '🔵', isCorrect: false },
      { label: 'Jaune', emoji: '🟡', isCorrect: true },
      { label: 'Vert', emoji: '🟢', isCorrect: false },
    ],
    audioHint: 'Écoute : Brillant et chaud comme le miel !',
  },
];

export default function PracticeScreen() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [completed, setCompleted] = useState(false);

  const addStars = useProgressStore((s) => s.addStars);
  const triggerCelebration = useProgressStore((s) => s.triggerCelebration);
  const stars = useProgressStore((s) => s.metrics.stars);

  const currentQ = QUESTIONS[currentIdx];
  const optionScale = useRef(new Animated.Value(1)).current;

  const handleSelectOption = (index: number) => {
    if (isCelebrating || completed) return;
    playTapSound();
    setSelectedOption(index);

    const isCorrect = currentQ.options[index].isCorrect;
    if (isCorrect) {
      playSuccessSound();
      setIsCelebrating(true);
      addStars(3);
      triggerCelebration('Bravo champion ! +3 Étoiles ! ⭐');

      setTimeout(() => {
        playStarSound();
        setIsCelebrating(false);
        setSelectedOption(null);
        if (currentIdx + 1 < QUESTIONS.length) {
          setCurrentIdx((prev) => prev + 1);
        } else {
          setCompleted(true);
        }
      }, 2000);
    } else {
      playBoingSound();
      // Gentle wrong answer soft reset
      setTimeout(() => {
        setSelectedOption(null);
      }, 700);
    }
  };

  const handleAudioHintTap = () => {
    playTapSound();
    playBoingSound();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Full-Screen Low-Chrome Top Activity Bar (Khan Academy Kids style) */}
      <View style={styles.topChromeBar}>
        {/* Kid-friendly big round Back button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            playTapSound();
            router.back();
          }}
          style={styles.largeBackButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          testID="practice_back_button"
        >
          <Text style={styles.backEmoji}>⬅️</Text>
        </TouchableOpacity>

        {/* Minimal Progress Step Dots */}
        <View style={styles.stepsPill}>
          {QUESTIONS.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    idx < currentIdx || completed
                      ? '#16A34A'
                      : idx === currentIdx
                      ? '#D80027' // Club Africain Rouge Accent
                      : '#E2E8F0',
                  width: idx === currentIdx ? 22 : 10,
                },
              ]}
            />
          ))}
        </View>

        {/* Star Counter Pill */}
        <View style={styles.starPill}>
          <Text style={styles.starEmoji}>⭐</Text>
          <Text style={styles.starText}>{stars}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Character Reaction Area: Farès Cheering */}
        <View style={styles.mascotArea}>
          <OriginalMascotView
            mascotId="fares"
            isCelebrating={isCelebrating || completed}
            customDialogue={
              completed
                ? 'Mission accomplie ! Tu es un super explorateur ! 🏆'
                : isCelebrating
                ? 'Super travail ! +3 Étoiles ! ⭐'
                : 'Choisis la bonne réponse ! 🦊'
            }
            size="medium"
          />
        </View>

        {!completed ? (
          /* Focused Activity Card: Minimal chrome, large tactile targets */
          <View style={styles.activityCard}>
            {/* Audio Hint Pill */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAudioHintTap}
              style={styles.audioPromptButton}
            >
              <Text style={styles.speakerEmoji}>🔊</Text>
              <Text style={styles.audioHintText}>{currentQ.audioHint}</Text>
            </TouchableOpacity>

            {/* Prompt & Visual Emojis */}
            <Text style={styles.promptText}>{currentQ.promptText}</Text>
            <Text style={styles.emojiVisual}>{currentQ.emojiPrompt}</Text>

            {/* Huge Tactile Answer Buttons */}
            <View style={styles.optionsGrid}>
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isRight = isSelected && opt.isCorrect;
                const isWrong = isSelected && !opt.isCorrect;

                return (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.8}
                    onPress={() => handleSelectOption(i)}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: isRight
                          ? '#DCFCE7'
                          : isWrong
                          ? '#FEE2E2'
                          : '#FFFFFF',
                        borderColor: isRight
                          ? '#16A34A'
                          : isWrong
                          ? '#DC2626'
                          : '#FDE2E6',
                        borderBottomColor: isRight
                          ? '#15803D'
                          : isWrong
                          ? '#B91C1C'
                          : '#F8B4BD',
                      },
                    ]}
                    testID={`option_button_${i}`}
                  >
                    <Text style={styles.optEmoji}>{opt.emoji}</Text>
                    <Text
                      style={[
                        styles.optText,
                        {
                          color: isRight
                            ? '#15803D'
                            : isWrong
                            ? '#B91C1C'
                            : '#12151B',
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          /* Completed Victory Screen */
          <View style={styles.victoryCard}>
            <Text style={styles.victoryEmoji}>🏆</Text>
            <Text style={styles.victoryTitle}>MISSION ACCOMPLIE !</Text>
            <Text style={styles.victorySub}>
              Tu as gagné toutes tes étoiles aujourd'hui !
            </Text>

            <TouchableOpacity
              style={styles.doneButton}
              activeOpacity={0.85}
              onPress={() => {
                playStarSound();
                router.replace('/(band-a)' as any);
              }}
              testID="victory_done_button"
            >
              <Text style={styles.doneButtonText}>🏠 RETOUR AU CHEMIN</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF9', // Soft warm cream canvas
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  topChromeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFDF9',
  },
  largeBackButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FDE2E6',
    borderBottomWidth: 4,
    borderBottomColor: '#F8B4BD',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#12151B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  backEmoji: {
    fontSize: 20,
  },
  stepsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    gap: 6,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    gap: 4,
  },
  starEmoji: {
    fontSize: 16,
  },
  starText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#B45309',
  },
  content: {
    padding: 16,
    alignItems: 'center',
    paddingBottom: 40,
  },
  mascotArea: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FDE2E6',
    borderBottomWidth: 5,
    borderBottomColor: '#F8B4BD',
    shadowColor: '#12151B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  audioPromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE2E6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    gap: 8,
    marginBottom: 8,
  },
  speakerEmoji: {
    fontSize: 18,
  },
  audioHintText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D80027', // Club Africain Rouge Accent
  },
  promptText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#12151B',
    textAlign: 'center',
    marginVertical: 8,
  },
  emojiVisual: {
    fontSize: 42,
    marginVertical: 12,
    letterSpacing: 4,
  },
  optionsGrid: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 14,
  },
  optionButton: {
    flex: 1,
    minHeight: 90,
    borderRadius: 22,
    borderWidth: 2,
    borderBottomWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    shadowColor: '#12151B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  optEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  optText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  victoryCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 26,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FDE68A',
    borderBottomWidth: 6,
    borderBottomColor: '#F59E0B',
    marginTop: 20,
  },
  victoryEmoji: {
    fontSize: 64,
  },
  victoryTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#B45309',
    marginTop: 8,
    textAlign: 'center',
  },
  victorySub: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginVertical: 8,
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: '#D80027', // Club Africain accent
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
    borderBottomWidth: 4,
    borderBottomColor: '#B70020',
    marginTop: 14,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
