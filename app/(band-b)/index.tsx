import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BAND_B_THEME } from '../../theme/tokens.ts';
import { LevelAvatar } from '../../components/band-b/LevelAvatar.tsx';
import { ContinueLearningCard } from '../../components/band-b/ContinueLearningCard.tsx';
import { ClassLeaderboard } from '../../components/band-b/ClassLeaderboard.tsx';
import { BandBBottomNav, BandBTab } from '../../components/band-b/BandBBottomNav.tsx';
import { MissionCard } from '../../components/band-b/MissionCard.tsx';
import { useProgressStore } from '../../store/progressStore.ts';
import { useUserStore } from '../../store/userStore.ts';

export default function BandBHomeScreen() {
  const router = useRouter();
  const student = useUserStore((s) => s.student);
  const { xp, currentLevel, streakDays } = useProgressStore((s) => s.metrics);
  const addXp = useProgressStore((s) => s.addXp);

  const [activeTab, setActiveTab] = useState<BandBTab>('home');
  const [lastActionToast, setLastActionToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setLastActionToast(msg);
    setTimeout(() => setLastActionToast(null), 2500);
  };

  const handleResumeMission = () => {
    addXp(45);
    showToast('⚡ Mission Resumed! +45 XP earned');
  };

  const daysOfWeek = [
    { day: 'M', completed: true },
    { day: 'T', completed: true },
    { day: 'W', completed: true },
    { day: 'T', completed: true },
    { day: 'F', completed: true },
    { day: 'S', completed: false },
    { day: 'S', completed: false },
  ];

  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.content}>
        {/* Action Toast Alert */}
        {lastActionToast && (
          <View style={styles.toastBanner}>
            <Text style={styles.toastText}>{lastActionToast}</Text>
          </View>
        )}

        {/* --- TAB 1: HOME --- */}
        {activeTab === 'home' && (
          <>
            {/* Header greeting */}
            <View style={styles.headerGreeting}>
              <View>
                <Text style={styles.bandBadge}>THE ADVENTURERS (AGES 10–13)</Text>
                <Text style={styles.cadetTitle}>
                  Welcome back, {student?.fullName || 'Cadet Bassem'}!
                </Text>
              </View>
            </View>

            {/* 1. Visible Progress/Level System: Avatar that Levels Up */}
            <LevelAvatar
              level={currentLevel}
              xp={xp}
              rankTitle={currentLevel >= 5 ? 'Cyber Vanguard Commander' : 'Vanguard Specialist'}
              onPress={() => {
                addXp(75);
                showToast('🚀 XP Added! Keep leveling up!');
              }}
            />

            {/* 2. Structured Streak Counter with 7-Day Dots */}
            <View style={styles.streakCard}>
              <View style={styles.streakTopRow}>
                <View style={styles.streakLeft}>
                  <Text style={styles.streakFlame}>🔥</Text>
                  <View>
                    <Text style={styles.streakDaysTitle}>{streakDays}-DAY STREAK</Text>
                    <Text style={styles.streakSubtitle}>+20 XP multiplier active today</Text>
                  </View>
                </View>
                <View style={styles.multiplierBadge}>
                  <Text style={styles.multiplierText}>1.5X XP</Text>
                </View>
              </View>

              {/* 7-Day Tracker */}
              <View style={styles.daysRow}>
                {daysOfWeek.map((item, idx) => (
                  <View key={idx} style={styles.dayCol}>
                    <View style={[styles.dayDot, item.completed && styles.dayDotCompleted]}>
                      <Text style={[styles.dayCheck, item.completed && styles.dayCheckCompleted]}>
                        {item.completed ? '✓' : '•'}
                      </Text>
                    </View>
                    <Text style={[styles.dayLabel, item.completed && styles.dayLabelCompleted]}>
                      {item.day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 3. "Continue Where You Left Off" Card */}
            <ContinueLearningCard onResume={handleResumeMission} />

            {/* 4. Section: Practice Preview */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>PRACTICE MISSIONS</Text>
              <TouchableOpacity onPress={() => setActiveTab('practice')}>
                <Text style={styles.viewMoreText}>Go to Arena ➔</Text>
              </TouchableOpacity>
            </View>

            <MissionCard
              title="Algebraic Fuel Balancer: Systems of Equations"
              category="Math & Logic"
              xpReward={75}
              progressPercent={65}
              onStart={() => {
                addXp(75);
                showToast('🎯 Equations solved! +75 XP');
              }}
            />

            <MissionCard
              title="Mediterranean Marine Ecosystems in 3D"
              category="Science Lab"
              xpReward={60}
              progressPercent={25}
              onStart={() => {
                addXp(60);
                showToast('🔬 Ecosystem analyzed! +60 XP');
              }}
            />

            {/* 5. Section: Lightweight Scoped Class Leaderboard */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>SCOPED LEADERBOARD</Text>
              <TouchableOpacity onPress={() => setActiveTab('leaderboard')}>
                <Text style={styles.viewMoreText}>Full Ranks ➔</Text>
              </TouchableOpacity>
            </View>

            <ClassLeaderboard
              compact
              onViewAll={() => setActiveTab('leaderboard')}
            />

            {/* 6. Section: Vanguard Games Preview */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>GAMES ARENA</Text>
              <TouchableOpacity onPress={() => setActiveTab('games')}>
                <Text style={styles.viewMoreText}>Play All ➔</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.gamesPreviewRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  addXp(40);
                  showToast('⚡ Equation Dash finished! +40 XP');
                }}
                style={[styles.gameMiniCard, { borderColor: '#06B6D4' }]}
              >
                <Text style={styles.gameMiniIcon}>⚡</Text>
                <Text style={styles.gameMiniTitle}>Equation Dash</Text>
                <Text style={styles.gameMiniXp}>+40 XP</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  addXp(40);
                  showToast('🎮 Word Blitz completed! +40 XP');
                }}
                style={[styles.gameMiniCard, { borderColor: '#8B5CF6' }]}
              >
                <Text style={styles.gameMiniIcon}>🎮</Text>
                <Text style={styles.gameMiniTitle}>Word Blitz</Text>
                <Text style={styles.gameMiniXp}>+40 XP</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* --- TAB 2: PRACTICE --- */}
        {activeTab === 'practice' && (
          <View style={styles.tabContentArea}>
            <View style={styles.tabHeader}>
              <Text style={styles.tabMainTitle}>🎯 Practice Arena</Text>
              <Text style={styles.tabSubTitle}>Structured skill tracks for ages 10–13</Text>
            </View>

            <View style={styles.filterPillsRow}>
              {['All', 'Math', 'Science', 'Languages', 'Coding'].map((cat, idx) => (
                <View key={cat} style={[styles.filterPill, idx === 0 && styles.filterPillActive]}>
                  <Text style={[styles.filterPillText, idx === 0 && styles.filterPillTextActive]}>
                    {cat}
                  </Text>
                </View>
              ))}
            </View>

            <MissionCard
              title="Algebraic Fuel Balancer: Systems of Equations"
              category="Math & Logic"
              xpReward={75}
              progressPercent={65}
              onStart={() => {
                addXp(75);
                showToast('Solved equations! +75 XP');
              }}
            />

            <MissionCard
              title="Mediterranean Marine Ecosystems in 3D"
              category="Science Lab"
              xpReward={60}
              progressPercent={25}
              onStart={() => {
                addXp(60);
                showToast('Ecosystem explored! +60 XP');
              }}
            />

            <MissionCard
              title="Speed Vocabulary: Tech & Robotics"
              category="Languages"
              xpReward={50}
              progressPercent={90}
              onStart={() => {
                addXp(50);
                showToast('Vocab mastered! +50 XP');
              }}
            />

            <MissionCard
              title="Logic Circuits & Python Loops"
              category="Coding"
              xpReward={80}
              progressPercent={10}
              onStart={() => {
                addXp(80);
                showToast('Circuits simulated! +80 XP');
              }}
            />
          </View>
        )}

        {/* --- TAB 3: GAMES --- */}
        {activeTab === 'games' && (
          <View style={styles.tabContentArea}>
            <View style={styles.tabHeader}>
              <Text style={styles.tabMainTitle}>🎮 Vanguard Games Arena</Text>
              <Text style={styles.tabSubTitle}>Speed challenges, math duels, and memory arenas</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => {
                addXp(50);
                showToast('⚡ Equation Dash High Score! +50 XP');
              }}
              style={styles.gameCard}
            >
              <View style={styles.gameCardTop}>
                <Text style={styles.gameCardIcon}>⚡</Text>
                <View style={styles.gameCardInfo}>
                  <Text style={styles.gameCardTitle}>Equation Dash</Text>
                  <Text style={styles.gameCardDesc}>Solve fast math puzzles before the fuse runs out!</Text>
                </View>
                <View style={styles.gameXpPill}>
                  <Text style={styles.gameXpText}>+50 XP</Text>
                </View>
              </View>
              <View style={styles.gameActionRow}>
                <Text style={styles.gameDifficulty}>Tier 2 • High Speed</Text>
                <Text style={styles.gamePlayText}>START GAME ➔</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => {
                addXp(50);
                showToast('🎮 Vocabulary Blitz Complete! +50 XP');
              }}
              style={styles.gameCard}
            >
              <View style={styles.gameCardTop}>
                <Text style={styles.gameCardIcon}>📖</Text>
                <View style={styles.gameCardInfo}>
                  <Text style={styles.gameCardTitle}>Vocabulary Blitz</Text>
                  <Text style={styles.gameCardDesc}>English & French rapid synonym matching battle</Text>
                </View>
                <View style={styles.gameXpPill}>
                  <Text style={styles.gameXpText}>+50 XP</Text>
                </View>
              </View>
              <View style={styles.gameActionRow}>
                <Text style={styles.gameDifficulty}>Tier 1 • Dual Language</Text>
                <Text style={styles.gamePlayText}>START GAME ➔</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => {
                addXp(60);
                showToast('🛡️ Cyber Defense Duel Won! +60 XP');
              }}
              style={styles.gameCard}
            >
              <View style={styles.gameCardTop}>
                <Text style={styles.gameCardIcon}>🛡️</Text>
                <View style={styles.gameCardInfo}>
                  <Text style={styles.gameCardTitle}>Cyber Defense Duel</Text>
                  <Text style={styles.gameCardDesc}>Co-op logic defense against buggy algorithms</Text>
                </View>
                <View style={styles.gameXpPill}>
                  <Text style={styles.gameXpText}>+60 XP</Text>
                </View>
              </View>
              <View style={styles.gameActionRow}>
                <Text style={styles.gameDifficulty}>Tier 3 • Guild Co-Op</Text>
                <Text style={styles.gamePlayText}>START GAME ➔</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* --- TAB 4: LEADERBOARD --- */}
        {activeTab === 'leaderboard' && (
          <View style={styles.tabContentArea}>
            <View style={styles.tabHeader}>
              <Text style={styles.tabMainTitle}>🏆 Class & League Standings</Text>
              <Text style={styles.tabSubTitle}>Scoped to your class (7-B) and age group (10–13)</Text>
            </View>

            <ClassLeaderboard />

            {/* Guild Standings Card */}
            <View style={styles.guildStandingsCard}>
              <Text style={styles.guildStandingsTitle}>🛡️ SQUAD STANDINGS: CARTHAGE CYBER GUILD</Text>
              <Text style={styles.guildStandingsSub}>
                Your squad is #3 among 18 schools in Tunisia Central.
              </Text>
              <View style={styles.squadScoreRow}>
                <Text style={styles.squadScoreText}>Total Guild XP: <Text style={styles.squadScoreBold}>18,420</Text></Text>
                <TouchableOpacity
                  onPress={() => {
                    addXp(30);
                    showToast('Contributed +30 XP to Carthage Guild!');
                  }}
                  style={styles.contributeButton}
                >
                  <Text style={styles.contributeText}>CONTRIBUTE XP</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* --- TAB 5: PROFILE --- */}
        {activeTab === 'profile' && (
          <View style={styles.tabContentArea}>
            <View style={styles.tabHeader}>
              <Text style={styles.tabMainTitle}>👤 Cadet Vanguard Profile</Text>
              <Text style={styles.tabSubTitle}>Avatar customization, rank titles & badges</Text>
            </View>

            {/* Profile Hero */}
            <View style={styles.profileHeroCard}>
              <View style={styles.profileAvatarBig}>
                <Text style={styles.profileBigEmoji}>{currentLevel >= 5 ? '🦅' : '⚡'}</Text>
              </View>
              <Text style={styles.profileName}>{student?.fullName || 'Cadet Bassem'}</Text>
              <Text style={styles.profileRank}>
                {currentLevel >= 5 ? 'CYBER COMMANDER (LEVEL 5)' : 'VANGUARD SPECIALIST (LEVEL 4)'}
              </Text>
              <Text style={styles.profileSchool}>Class 7-B • Sousse Academy Branch</Text>
            </View>

            {/* Stats Overview */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{xp}</Text>
                <Text style={styles.statLbl}>TOTAL XP</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>Level {currentLevel}</Text>
                <Text style={styles.statLbl}>CURRENT TIER</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{streakDays} Days</Text>
                <Text style={styles.statLbl}>STREAK</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>#4</Text>
                <Text style={styles.statLbl}>CLASS RANK</Text>
              </View>
            </View>

            {/* Unlocked Badges */}
            <Text style={styles.badgesHeader}>UNLOCKED VANGUARD BADGES</Text>
            <View style={styles.badgesRow}>
              {[
                { emoji: '⚡', name: 'Fast Solver' },
                { emoji: '🔥', name: '5-Day Flame' },
                { emoji: '🛡️', name: 'Guild Guard' },
                { emoji: '🔭', name: 'Star Navigator' },
              ].map((b, i) => (
                <View key={i} style={styles.badgeItem}>
                  <View style={styles.badgeCircle}>
                    <Text style={styles.badgeEmoji}>{b.emoji}</Text>
                  </View>
                  <Text style={styles.badgeName}>{b.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Tab Navigation: Home, Practice, Games, Leaderboard, Profile */}
      <BandBBottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: BAND_B_THEME.colors.surface,
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  toastBanner: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  toastText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
  },
  headerGreeting: {
    marginBottom: 10,
  },
  bandBadge: {
    fontSize: 10,
    fontWeight: '900',
    color: BAND_B_THEME.colors.primary,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  cadetTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  streakCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginVertical: 10,
  },
  streakTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakFlame: {
    fontSize: 28,
  },
  streakDaysTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  streakSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  multiplierBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  multiplierText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#DC2626',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  dayCol: {
    alignItems: 'center',
    gap: 4,
  },
  dayDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  dayDotCompleted: {
    backgroundColor: '#DC2626',
    borderColor: '#B91C1C',
  },
  dayCheck: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '900',
  },
  dayCheckCompleted: {
    color: '#FFFFFF',
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  dayLabelCompleted: {
    color: '#0F172A',
    fontWeight: '900',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: BAND_B_THEME.colors.primary,
  },
  gamesPreviewRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 6,
  },
  gameMiniCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gameMiniIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  gameMiniTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  gameMiniXp: {
    fontSize: 11,
    fontWeight: '800',
    color: '#06B6D4',
  },
  tabContentArea: {
    marginTop: 6,
  },
  tabHeader: {
    marginBottom: 12,
  },
  tabMainTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  tabSubTitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: BAND_B_THEME.colors.primary,
    borderColor: BAND_B_THEME.colors.primary,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  gameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  gameCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  gameCardIcon: {
    fontSize: 32,
  },
  gameCardInfo: {
    flex: 1,
  },
  gameCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  gameCardDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  gameXpPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gameXpText: {
    fontSize: 11,
    fontWeight: '900',
    color: BAND_B_THEME.colors.primary,
  },
  gameActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  gameDifficulty: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  gamePlayText: {
    fontSize: 12,
    fontWeight: '900',
    color: BAND_B_THEME.colors.primary,
  },
  guildStandingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  guildStandingsTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.6,
  },
  guildStandingsSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 12,
  },
  squadScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  squadScoreText: {
    fontSize: 13,
    color: '#64748B',
  },
  squadScoreBold: {
    fontWeight: '900',
    color: '#0F172A',
  },
  contributeButton: {
    backgroundColor: '#06B6D4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contributeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  profileHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  profileAvatarBig: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: BAND_B_THEME.colors.primary,
    marginBottom: 10,
  },
  profileBigEmoji: {
    fontSize: 40,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  profileRank: {
    fontSize: 12,
    fontWeight: '800',
    color: BAND_B_THEME.colors.primary,
    letterSpacing: 0.6,
    marginTop: 2,
  },
  profileSchool: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  statLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
  },
  badgesHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  badgeItem: {
    alignItems: 'center',
    gap: 4,
  },
  badgeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  badgeEmoji: {
    fontSize: 22,
  },
  badgeName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E293B',
  },
});
