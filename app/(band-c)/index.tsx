import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScholarStatsDashboard } from '../../components/band-c/ScholarStatsDashboard.tsx';
import { RecommendedExercisesList, ExerciseItem } from '../../components/band-c/RecommendedExercisesList.tsx';
import { ScholarBottomNav, ScholarTab } from '../../components/band-c/ScholarBottomNav.tsx';
import { FocusSessionModal } from '../../components/band-c/FocusSessionModal.tsx';
import { MasteryRadar } from '../../components/band-c/MasteryRadar.tsx';
import { ExamTimer } from '../../components/band-c/ExamTimer.tsx';
import { TimedQuizGame } from '../../components/games/TimedQuizGame.tsx';
import { MemoryMatchGame } from '../../components/games/MemoryMatchGame.tsx';
import { ClassLeaderboardModal } from '../../components/games/ClassLeaderboardModal.tsx';
import { useProgressStore } from '../../store/progressStore.ts';
import { useUserStore } from '../../store/userStore.ts';
import { useGameStore } from '../../store/gameStore.ts';

type ThemeMode = 'system' | 'light' | 'dark';

export default function BandCHomeScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  // Respect OS setting by default, allow manual override
  const isDark = themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';

  const student = useUserStore((s) => s.student);
  const { accuracyRate, bacReadinessScore } = useProgressStore((s) => s.metrics);
  const addXp = useProgressStore((s) => s.addXp);

  const [activeTab, setActiveTab] = useState<ScholarTab>('home');
  const [focusModalVisible, setFocusModalVisible] = useState(false);
  const [activeFocusExercise, setActiveFocusExercise] = useState<ExerciseItem | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [activeGameMode, setActiveGameMode] = useState<'hub' | 'blitz' | 'memory'>('hub');
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);

  const games = useGameStore((s) => s.games.filter((g) => g.band === 'BAND_C'));
  const blitzItem = games.find((g) => g.id === 'gc_1') || games[0];
  const memoryItem = games.find((g) => g.id === 'gc_2') || games[1];

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3000);
  };

  const handleSelectExercise = (ex: ExerciseItem, startFocus = false) => {
    if (startFocus) {
      setActiveFocusExercise(ex);
      setFocusModalVisible(true);
    } else {
      addXp(50);
      showToast(`Started "${ex.title}". +50 study points logged.`);
    }
  };

  const handleCompleteFocusSession = (minutesSpent: number) => {
    addXp(minutesSpent * 5);
    showToast(`🎯 Focus Session Complete! ${minutesSpent} min logged (+${minutesSpent * 5} pts).`);
  };

  const MASTERY_DATA = [
    { subject: 'Advanced Mathematics (Mathématiques)', percentage: 88 },
    { subject: 'Experimental Sciences & Physics', percentage: 76 },
    { subject: 'Computer Science & Algorithms', percentage: 94 },
    { subject: 'French & Philosophy Synthesis', percentage: 82 },
  ];

  // Theme palettes
  const bg = isDark ? '#090D16' : '#F8FAFC';
  const cardBg = isDark ? '#111827' : '#FFFFFF';
  const borderCol = isDark ? '#1F2937' : '#E2E8F0';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const accent = isDark ? '#38BDF8' : '#0284C7';

  return (
    <View style={[styles.rootContainer, { backgroundColor: bg }]}>
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.content}>
        {/* Top Header: Scholar Title & OS Dark/Light Mode Switcher */}
        <View style={styles.headerControlsRow}>
          <View>
            <Text style={[styles.academyTag, { color: textMuted }]}>VAMOS SCHOLARS • AGES 14–19</Text>
            <Text style={[styles.scholarName, { color: textPrimary }]}>
              {student?.fullName || 'Senior Scholar Bassem'}
            </Text>
          </View>

          {/* System Dark / Light Mode Switcher */}
          <View style={[styles.modeSegment, { backgroundColor: isDark ? '#1F2937' : '#F1F5F9', borderColor: borderCol }]}>
            <TouchableOpacity
              onPress={() => setThemeMode('system')}
              style={[styles.modeBtn, themeMode === 'system' && (isDark ? styles.modeBtnDarkActive : styles.modeBtnLightActive)]}
              accessibilityLabel="System Mode"
            >
              <Text style={[styles.modeBtnText, themeMode === 'system' && styles.modeBtnTextActive]}>
                Auto {systemColorScheme === 'dark' ? '🌙' : '☀️'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setThemeMode('light')}
              style={[styles.modeBtn, themeMode === 'light' && styles.modeBtnLightActive]}
              accessibilityLabel="Light Mode"
            >
              <Text style={[styles.modeBtnText, themeMode === 'light' && styles.modeBtnTextActive]}>
                ☀️
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setThemeMode('dark')}
              style={[styles.modeBtn, themeMode === 'dark' && styles.modeBtnDarkActive]}
              accessibilityLabel="Dark Mode"
            >
              <Text style={[styles.modeBtnText, themeMode === 'dark' && styles.modeBtnTextActive]}>
                🌙
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {notificationToast && (
          <View style={[styles.toastCard, { backgroundColor: isDark ? '#1E293B' : '#0F172A' }]}>
            <Text style={styles.toastText}>{notificationToast}</Text>
          </View>
        )}

        {/* ================= TAB 1: HOME (STUDY PRODUCTIVITY) ================= */}
        {activeTab === 'home' && (
          <>
            {/* 1. Stats Dashboard: Time studied, Accuracy trends, Streak */}
            <ScholarStatsDashboard
              timeStudiedHours={14.8}
              timeTargetHours={18.0}
              accuracyPercent={accuracyRate || 94.2}
              streakDays={18}
              isDark={isDark}
            />

            {/* Quick Action: Enter Instant Focus Session */}
            <View style={[styles.quickFocusBanner, { backgroundColor: cardBg, borderColor: borderCol }]}>
              <View style={styles.quickFocusLeft}>
                <Text style={styles.quickFocusGlyph}>⚡</Text>
                <View>
                  <Text style={[styles.quickFocusTitle, { color: textPrimary }]}>
                    Distraction-Free Focus Mode
                  </Text>
                  <Text style={[styles.quickFocusDesc, { color: textMuted }]}>
                    Mutes alerts, hides badges, full-screen Pomodoro
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setActiveFocusExercise(null);
                  setFocusModalVisible(true);
                }}
                style={[styles.quickFocusBtn, { backgroundColor: isDark ? '#0284C7' : '#0F172A' }]}
              >
                <Text style={styles.quickFocusBtnText}>Start Focus</Text>
              </TouchableOpacity>
            </View>

            {/* 2. Clean List of Upcoming / Recommended Exercises */}
            <RecommendedExercisesList
              onSelectExercise={handleSelectExercise}
              isDark={isDark}
            />

            {/* 3. Deep Work Exam Timer Widget */}
            <ExamTimer defaultMinutes={25} />

            {/* 4. Curricular Mastery Radar */}
            <MasteryRadar items={MASTERY_DATA} />
          </>
        )}

        {/* ================= TAB 2: PRACTICE ================= */}
        {activeTab === 'practice' && (
          <View style={styles.tabContent}>
            <Text style={[styles.tabHeading, { color: textPrimary }]}>Practice Modules</Text>
            <Text style={[styles.tabSubheading, { color: textMuted }]}>
              Targeted drills for the Tunisian Baccalaureate exam
            </Text>

            <RecommendedExercisesList
              onSelectExercise={handleSelectExercise}
              isDark={isDark}
            />
          </View>
        )}

        {/* ================= TAB 3: LOGIC & GAMES ================= */}
        {activeTab === 'games' && (
          <View style={styles.tabContent}>
            {activeGameMode === 'blitz' ? (
              <TimedQuizGame
                band="BAND_C"
                gameId={blitzItem.id}
                gameTitle="BACCALAURÉAT BLITZ : SPRINT ÉCLAIR"
                questionCount={5}
                isDark={isDark}
                onExit={() => setActiveGameMode('hub')}
              />
            ) : activeGameMode === 'memory' ? (
              <MemoryMatchGame
                band="BAND_C"
                pairCount={5}
                gameId={memoryItem.id}
                gameTitle="DOCTRINES & FORMULES : APPARIEMENT"
                isDark={isDark}
                onExit={() => setActiveGameMode('hub')}
              />
            ) : (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={[styles.tabHeading, { color: textPrimary, marginBottom: 0 }]}>
                    Cognitive & Logic Drills
                  </Text>
                  <TouchableOpacity
                    onPress={() => setLeaderboardVisible(true)}
                    style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: borderCol }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '800', color: accent }}>🏆 Palmarès</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.tabSubheading, { color: textMuted }]}>
                  High-speed competitive problem solving reusing the exercises engine
                </Text>

                {/* Game 1: Baccalaureate Blitz */}
                <View style={[styles.gameCard, { backgroundColor: cardBg, borderColor: borderCol, flexDirection: 'column', alignItems: 'stretch' }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[styles.gameCategory, { color: accent }]}>CADENCE RAPIDE • 8S / QUESTION</Text>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: textMuted }}>
                      Record : {blitzItem?.highScore || 2840} pts
                    </Text>
                  </View>
                  <Text style={[styles.gameTitle, { color: textPrimary, marginTop: 4 }]}>
                    Baccalauréat Blitz : Sprint Éclair
                  </Text>
                  <Text style={{ fontSize: 12, color: textMuted, lineHeight: 17, marginVertical: 8 }}>
                    Épreuve chrono impitoyable : analyse réelle, nombres complexes, circuits RLC et thèses philosophiques.
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setActiveGameMode('blitz')}
                      style={[styles.playButton, { flex: 1, backgroundColor: isDark ? '#0284C7' : '#0F172A' }]}
                    >
                      <Text style={styles.playButtonText}>Lancer le Sprint Éclair ➔</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setLeaderboardVisible(true)}
                      style={{ paddingHorizontal: 12, height: 36, borderRadius: 6, borderWidth: 1, borderColor: borderCol, alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '700', color: textPrimary }}>Classement</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Game 2: Doctrines & Formulas Memory Match */}
                <View style={[styles.gameCard, { backgroundColor: cardBg, borderColor: borderCol, flexDirection: 'column', alignItems: 'stretch' }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[styles.gameCategory, { color: '#10B981' }]}>APPARIEMENT CONCEPTUEL • 10 CARTES</Text>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: textMuted }}>
                      Record : {memoryItem?.highScore || 1650} pts
                    </Text>
                  </View>
                  <Text style={[styles.gameTitle, { color: textPrimary, marginTop: 4 }]}>
                    Memory Match : Doctrines & Dérivées
                  </Text>
                  <Text style={{ fontSize: 12, color: textMuted, lineHeight: 17, marginVertical: 8 }}>
                    Association des thèses philosophiques à leurs auteurs et des fonctions d'analyse à leurs formes dérivées.
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setActiveGameMode('memory')}
                    style={[styles.playButton, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderWidth: 1, borderColor: borderCol }]}
                  >
                    <Text style={[styles.playButtonText, { color: textPrimary }]}>Démarrer le Memory Conceptuel ➔</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}

        {/* ================= TAB 4: STATS & ANALYTICS ================= */}
        {activeTab === 'stats' && (
          <View style={styles.tabContent}>
            <Text style={[styles.tabHeading, { color: textPrimary }]}>Performance Analytics</Text>
            <Text style={[styles.tabSubheading, { color: textMuted }]}>
              Comprehensive study telemetry and readiness tracking
            </Text>

            <ScholarStatsDashboard
              timeStudiedHours={14.8}
              timeTargetHours={18.0}
              accuracyPercent={accuracyRate || 94.2}
              streakDays={18}
              isDark={isDark}
            />

            <View style={[styles.statDetailCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
              <Text style={[styles.statDetailTitle, { color: textPrimary }]}>Baccalaureate Readiness Index</Text>
              <Text style={[styles.statDetailValue, { color: accent }]}>{bacReadinessScore || 84}%</Text>
              <Text style={[styles.statDetailDesc, { color: textMuted }]}>
                Based on mock exams, weighted accuracy in Mathematics, Physics, and French synthesis.
              </Text>
            </View>

            <MasteryRadar items={MASTERY_DATA} />
          </View>
        )}

        {/* ================= TAB 5: PROFILE ================= */}
        {activeTab === 'profile' && (
          <View style={styles.tabContent}>
            <Text style={[styles.tabHeading, { color: textPrimary }]}>Scholar Dossier</Text>
            <Text style={[styles.tabSubheading, { color: textMuted }]}>
              Academic identity, credentials & settings
            </Text>

            <View style={[styles.profileCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
              <View style={[styles.crestCircle, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderColor: borderCol }]}>
                <Text style={styles.crestEmoji}>🏛️</Text>
              </View>
              <Text style={[styles.profileFullName, { color: textPrimary }]}>
                {student?.fullName || 'Senior Scholar Bassem'}
              </Text>
              <Text style={[styles.profileCandidateTag, { color: accent }]}>
                Tunisian Baccalaureate Candidate • Section Mathématiques
              </Text>
              <Text style={[styles.profileSchoolText, { color: textMuted }]}>
                Lycée Pilote de Sousse • Class 4-Math-2
              </Text>
            </View>

            <View style={[styles.settingsGroup, { backgroundColor: cardBg, borderColor: borderCol }]}>
              <Text style={[styles.settingsTitle, { color: textMuted }]}>APPEARANCE SETTING</Text>
              <View style={styles.settingRow}>
                <Text style={[styles.settingLabel, { color: textPrimary }]}>Active Theme</Text>
                <Text style={[styles.settingValue, { color: textMuted }]}>
                  {themeMode === 'system' ? `System (${isDark ? 'Dark' : 'Light'})` : themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Focus Mode Full-Screen Distraction-Free Modal */}
      <FocusSessionModal
        visible={focusModalVisible}
        onClose={() => setFocusModalVisible(false)}
        exerciseTitle={activeFocusExercise?.title || 'Differential Equations & Exponential Systems'}
        subject={activeFocusExercise?.subject || 'Mathématiques (Baccalaureate)'}
        initialMinutes={activeFocusExercise?.durationMinutes || 25}
        onComplete={handleCompleteFocusSession}
        isDark={isDark}
      />

      {/* Class & National Leaderboard Modal */}
      <ClassLeaderboardModal
        visible={leaderboardVisible}
        onClose={() => setLeaderboardVisible(false)}
        gameId="gc_1"
        band="BAND_C"
        studentScore={blitzItem?.highScore || 2840}
        isDark={isDark}
      />

      {/* Subtle, Non-Cartoonish Bottom Tab Navigation */}
      <ScholarBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isDark={isDark}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  headerControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  academyTag: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  scholarName: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  modeSegment: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    padding: 2,
    gap: 2,
  },
  modeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeBtnLightActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  modeBtnDarkActive: {
    backgroundColor: '#374151',
  },
  modeBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  modeBtnTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  toastCard: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  toastText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  quickFocusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginVertical: 6,
  },
  quickFocusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  quickFocusGlyph: {
    fontSize: 20,
  },
  quickFocusTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  quickFocusDesc: {
    fontSize: 11,
    marginTop: 1,
  },
  quickFocusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  quickFocusBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  tabContent: {
    paddingTop: 8,
    gap: 10,
  },
  tabHeading: {
    fontSize: 20,
    fontWeight: '700',
  },
  tabSubheading: {
    fontSize: 12,
    marginBottom: 4,
  },
  gameCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  gameInfo: {
    flex: 1,
  },
  gameCategory: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  gameTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  playButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  statDetailCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
  },
  statDetailTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  statDetailValue: {
    fontSize: 32,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginVertical: 4,
  },
  statDetailDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  profileCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  crestCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  crestEmoji: {
    fontSize: 32,
  },
  profileFullName: {
    fontSize: 18,
    fontWeight: '700',
  },
  profileCandidateTag: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  profileSchoolText: {
    fontSize: 12,
    marginTop: 4,
  },
  settingsGroup: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  settingsTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  settingValue: {
    fontSize: 12,
  },
});
