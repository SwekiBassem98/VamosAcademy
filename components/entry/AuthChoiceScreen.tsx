import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface AuthChoiceScreenProps {
  onSelectStudent: () => void;
  onSelectParent: () => void;
}

export const AuthChoiceScreen: React.FC<AuthChoiceScreenProps> = ({
  onSelectStudent,
  onSelectParent,
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>VA</Text>
        </View>
        <Text style={styles.title}>Welcome to Vamos</Text>
        <Text style={styles.subtitle}>
          Select how you will experience your learning journey today
        </Text>
      </View>

      {/* Choice Cards */}
      <View style={styles.cardsContainer}>
        {/* Student Choice Card */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={onSelectStudent}
          style={[styles.roleCard, styles.studentCard]}
          testID="auth_choice_student_button"
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconCircleRed}>
              <Text style={styles.cardEmoji}>🎒</Text>
            </View>
            <View style={styles.tagStudent}>
              <Text style={styles.tagStudentText}>LEARNER & SCHOLAR</Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>I'm a Student</Text>
          <Text style={styles.cardDesc}>
            Practice exercises, conquer missions, earn stars or XP, and climb your academic leaderboard.
          </Text>

          <View style={styles.featureRow}>
            <Text style={styles.featureBullet}>✓ Tailored to your exact age & level</Text>
            <Text style={styles.featureBullet}>✓ Interactive games & exam drills</Text>
          </View>

          <View style={styles.cardActionRowRed}>
            <Text style={styles.actionTextRed}>Enter Student Portal</Text>
            <Text style={styles.actionArrowRed}>➔</Text>
          </View>
        </TouchableOpacity>

        {/* Parent Choice Card */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={onSelectParent}
          style={[styles.roleCard, styles.parentCard]}
          testID="auth_choice_parent_button"
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconCircleBlue}>
              <Text style={styles.cardEmoji}>🛡️</Text>
            </View>
            <View style={styles.tagParent}>
              <Text style={styles.tagParentText}>GUARDIAN & DIRECTOR</Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>I'm a Parent</Text>
          <Text style={styles.cardDesc}>
            Review child learning analytics, time-spent telemetry, accuracy curves, and center attendance.
          </Text>

          <View style={styles.featureRow}>
            <Text style={styles.featureBullet}>✓ Multi-child performance telemetry</Text>
            <Text style={styles.featureBullet}>✓ Read-only oversight & progress reports</Text>
          </View>

          <View style={styles.cardActionRowBlue}>
            <Text style={styles.actionTextBlue}>Open Parent Portal</Text>
            <Text style={styles.actionArrowBlue}>➔</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer Info */}
      <View style={styles.footerNote}>
        <Text style={styles.footerNoteText}>
          🔒 Identity is verified per session. Switch accounts anytime via secure logout.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D80027',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#D80027',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#12151B',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  cardsContainer: {
    gap: 20,
  },
  roleCard: {
    borderRadius: 20,
    padding: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    shadowColor: '#12151B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  studentCard: {
    borderColor: '#FDE2E6',
  },
  parentCard: {
    borderColor: '#EFF6FF',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconCircleRed: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FDE2E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleBlue: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: {
    fontSize: 22,
  },
  tagStudent: {
    backgroundColor: '#FDE2E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagStudentText: {
    color: '#D80027',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  tagParent: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagParentText: {
    color: '#1A56C4',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#12151B',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    marginBottom: 14,
  },
  featureRow: {
    gap: 4,
    marginBottom: 18,
  },
  featureBullet: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  cardActionRowRed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D80027',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderBottomWidth: 3,
    borderBottomColor: '#B70020',
  },
  actionTextRed: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  actionArrowRed: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  cardActionRowBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A56C4',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderBottomWidth: 3,
    borderBottomColor: '#1545A3',
  },
  actionTextBlue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  actionArrowBlue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  footerNote: {
    marginTop: 28,
    alignItems: 'center',
  },
  footerNoteText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 12,
  },
});
