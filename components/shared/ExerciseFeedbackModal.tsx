import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import type { ExerciseEvaluationResult } from '../../lib/exercises/types.ts';
import { BAND_A_THEME, BAND_B_THEME, BAND_C_THEME } from '../../theme/tokens.ts';

interface ExerciseFeedbackModalProps {
  visible: boolean;
  result: ExerciseEvaluationResult | null;
  onClose: () => void;
  onNext?: () => void;
}

export const ExerciseFeedbackModal: React.FC<ExerciseFeedbackModalProps> = ({
  visible,
  result,
  onClose,
  onNext,
}) => {
  const [audioMuted, setAudioMuted] = useState(false);

  if (!result) return null;

  const band = result.feedbackPayload.band;
  const isCorrect = result.isCorrect;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={band === 'BAND_A' ? 'bounce' : 'fade'}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            band === 'BAND_A' && styles.containerBandA,
            band === 'BAND_B' && styles.containerBandB,
            band === 'BAND_C' && styles.containerBandC,
          ]}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* ========================================================= */}
            {/* BAND A PRESENTATION: Big Cheerful Animation + Audio FX    */}
            {/* ========================================================= */}
            {band === 'BAND_A' && (
              <View style={styles.bandAWrapper}>
                <View style={styles.audioRow}>
                  <TouchableOpacity
                    style={styles.soundPill}
                    onPress={() => setAudioMuted(!audioMuted)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.soundPillText}>
                      {audioMuted ? '🔇 Son coupé' : '🔊 Son magique: Actif'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Big Mascot Animation Avatar */}
                <View style={styles.bandAMascotCircle}>
                  <Text style={styles.mascotEmoji}>
                    {isCorrect ? '🦊🎉' : '🦊💛'}
                  </Text>
                </View>

                <Text style={styles.bandATitle}>
                  {result.feedbackPayload.bandA?.cheerTitle || (isCorrect ? '🌟 SUPER CHAMPION !' : '💪 BRAVO POUR TON EFFORT !')}
                </Text>

                {/* Stars Display */}
                <View style={styles.starsRow}>
                  <Text style={styles.starText}>
                    {isCorrect ? '⭐ ⭐ ⭐' : '⭐ ⭐'}
                  </Text>
                  <Text style={styles.starsEarnedLabel}>
                    +{result.feedbackPayload.bandA?.starsEarned ?? 3} Étoiles d'or gagnées !
                  </Text>
                </View>

                <Text style={styles.bandAMessage}>
                  {result.feedbackPayload.bandA?.cheerMessage}
                </Text>

                {/* Explanation Card */}
                <View style={styles.bandAExplanationBox}>
                  <Text style={styles.bandAExplanationHeader}>💡 Le secret de Youssef :</Text>
                  <Text style={styles.bandAExplanationText}>{result.explanation}</Text>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.bandABtn, styles.bandABtnPrimary]}
                    onPress={onNext || onClose}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.bandABtnText}>
                      {onNext ? 'Mission Suivante ➔' : 'Continuer l’aventure !'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ========================================================= */}
            {/* BAND B PRESENTATION: XP Gained + Streak Update            */}
            {/* ========================================================= */}
            {band === 'BAND_B' && (
              <View style={styles.bandBWrapper}>
                <View style={styles.bandBHeaderRow}>
                  <View style={styles.bandBBadge}>
                    <Text style={styles.bandBBadgeText}>
                      {isCorrect ? 'MISSION REUSSIE' : 'RAPPORT DE MISSION'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setAudioMuted(!audioMuted)}
                    style={styles.soundIconBtn}
                  >
                    <Text style={styles.soundIconText}>{audioMuted ? '🔇' : '⚡'}</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.bandBMainScore}>
                  {isCorrect ? 'OBJECTIF ACCOMPLI !' : 'RÉVISION DU PROTOCOLE'}
                </Text>

                {/* XP Earned Card */}
                <View style={styles.xpCard}>
                  <View style={styles.xpRow}>
                    <Text style={styles.xpValue}>
                      +{result.feedbackPayload.bandB?.xpGained ?? 50} XP
                    </Text>
                    <View style={styles.streakPill}>
                      <Text style={styles.streakText}>
                        🔥 {result.feedbackPayload.bandB?.streakDays ?? 5}J Streak
                      </Text>
                    </View>
                  </View>

                  {/* Level Progression Bar */}
                  <View style={styles.levelProgressContainer}>
                    <View style={styles.levelLabelRow}>
                      <Text style={styles.levelLabel}>
                        Niveau {result.feedbackPayload.bandB?.level ?? 4} Vanguard
                      </Text>
                      <Text style={styles.levelPercent}>
                        {result.feedbackPayload.bandB?.xpProgressPercent ?? 65}%
                      </Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${Math.min(
                              100,
                              Math.max(10, result.feedbackPayload.bandB?.xpProgressPercent ?? 65)
                            )}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>

                {/* Debrief & Logic Explanation */}
                <View style={styles.bandBExplanationBox}>
                  <Text style={styles.bandBExplanationHeader}>ANALYSE TACTIQUE & SOLUTION</Text>
                  <Text style={styles.bandBExplanationText}>{result.explanation}</Text>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.bandBBtn, styles.bandBBtnPrimary]}
                    onPress={onNext || onClose}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.bandBBtnText}>
                      {onNext ? 'Mission Suivante ➔' : 'Continuer'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ========================================================= */}
            {/* BAND C PRESENTATION: Accuracy Stat & Minimal Animation    */}
            {/* ========================================================= */}
            {band === 'BAND_C' && (
              <View style={styles.bandCWrapper}>
                <View style={styles.bandCTopBar}>
                  <Text style={styles.bandCTag}>
                    ÉVALUATION ACADÉMIQUE • BAC TUNISIEN
                  </Text>
                  <Text style={styles.bandCTime}>
                    ⏱ {result.attemptRecord.timeTakenSeconds}s
                  </Text>
                </View>

                <Text style={styles.bandCStatus}>
                  {isCorrect ? 'Solution Validée avec Rigueur' : 'Inexactitude Identifiée'}
                </Text>

                {/* Telemetry Accuracy Stat Row */}
                <View style={styles.bandCStatsGrid}>
                  <View style={styles.bandCStatTile}>
                    <Text style={styles.bandCStatLabel}>PRÉCISION GLOBALE</Text>
                    <View style={styles.bandCStatValRow}>
                      <Text style={styles.bandCStatValue}>
                        {result.feedbackPayload.bandC?.accuracyPercent ?? 93.8}%
                      </Text>
                      <Text
                        style={[
                          styles.bandCDelta,
                          isCorrect ? styles.deltaPositive : styles.deltaNegative,
                        ]}
                      >
                        {isCorrect ? '+0.8%' : '-1.2%'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bandCStatTile}>
                    <Text style={styles.bandCStatLabel}>INDICE BAC</Text>
                    <View style={styles.bandCStatValRow}>
                      <Text style={styles.bandCStatValue}>
                        {result.feedbackPayload.bandC?.bacReadinessScore ?? 84.5}%
                      </Text>
                      <Text style={[styles.bandCDelta, styles.deltaNeutral]}>
                        {isCorrect ? '+0.5%' : '0.0%'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Rigorous Marking Rubric & Pedagogical Proof */}
                <View style={styles.bandCRubricBox}>
                  <Text style={styles.bandCRubricHeader}>
                    {result.feedbackPayload.bandC?.markingRubric || 'BARÈME OFFICIEL & ANALYSE'}
                  </Text>
                  <Text style={styles.bandCExplanationText}>{result.explanation}</Text>
                </View>

                <View style={styles.bandCActionsRow}>
                  <TouchableOpacity
                    style={styles.bandCOutlineBtn}
                    onPress={onClose}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.bandCOutlineBtnText}>Fermer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.bandCPrimaryBtn}
                    onPress={onNext || onClose}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.bandCPrimaryBtnText}>
                      {onNext ? 'Épreuve Suivante ➔' : 'Retour au Dossier'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 20,
  },

  // Band A Styles (Big, cheerful, warm, bouncy)
  containerBandA: {
    backgroundColor: '#FFFBEB', // Warm light cream
    borderWidth: 4,
    borderColor: '#F59E0B',
  },
  bandAWrapper: {
    alignItems: 'center',
  },
  audioRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  soundPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  soundPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  bandAMascotCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FED7AA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FB923C',
    marginVertical: 6,
  },
  mascotEmoji: {
    fontSize: 44,
  },
  bandATitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#9A3412',
    textAlign: 'center',
    marginVertical: 6,
  },
  starsRow: {
    alignItems: 'center',
    marginVertical: 4,
  },
  starText: {
    fontSize: 26,
    letterSpacing: 6,
  },
  starsEarnedLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D97706',
    marginTop: 2,
  },
  bandAMessage: {
    fontSize: 14,
    color: '#78350F',
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: '600',
  },
  bandAExplanationBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    width: '100%',
    borderWidth: 2,
    borderColor: '#FDE68A',
    marginVertical: 10,
  },
  bandAExplanationHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
    marginBottom: 4,
  },
  bandAExplanationText: {
    fontSize: 13,
    color: '#451A03',
    lineHeight: 18,
  },
  bandABtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  bandABtnPrimary: {
    backgroundColor: '#D80027',
    shadowColor: '#D80027',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  bandABtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  // Band B Styles (Gamified, XP, futuristic navy)
  containerBandB: {
    backgroundColor: '#0F172A', // Slate 900
    borderWidth: 2,
    borderColor: '#1A56C4',
  },
  bandBWrapper: {
    width: '100%',
  },
  bandBHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bandBBadge: {
    backgroundColor: 'rgba(26, 86, 196, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1A56C4',
  },
  bandBBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#60A5FA',
    letterSpacing: 1,
  },
  soundIconBtn: {
    padding: 4,
  },
  soundIconText: {
    fontSize: 16,
  },
  bandBMainScore: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    marginVertical: 4,
  },
  xpCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: 10,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#D80027',
  },
  streakPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  streakText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FBBF24',
  },
  levelProgressContainer: {
    marginTop: 4,
  },
  levelLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  levelLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  levelPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A56C4',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#0F172A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#D80027',
    borderRadius: 4,
  },
  bandBExplanationBox: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: 8,
  },
  bandBExplanationHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  bandBExplanationText: {
    fontSize: 12,
    color: '#E2E8F0',
    lineHeight: 18,
  },
  bandBBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  bandBBtnPrimary: {
    backgroundColor: '#D80027',
  },
  bandBBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  // Band C Styles (Sober, minimal animation, academic telemetry)
  containerBandC: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  bandCWrapper: {
    width: '100%',
  },
  bandCTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bandCTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  bandCTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  bandCStatus: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  bandCStatsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  bandCStatTile: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bandCStatLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  bandCStatValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  bandCStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  bandCDelta: {
    fontSize: 10,
    fontWeight: '700',
  },
  deltaPositive: {
    color: '#059669',
  },
  deltaNegative: {
    color: '#DC2626',
  },
  deltaNeutral: {
    color: '#2563EB',
  },
  bandCRubricBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  bandCRubricHeader: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  bandCExplanationText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  bandCActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  bandCOutlineBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  bandCOutlineBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  bandCPrimaryBtn: {
    backgroundColor: '#D80027',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  bandCPrimaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  buttonRow: {
    width: '100%',
  },
});
