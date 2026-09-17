import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import type { AgeBand } from '../../theme/types.ts';
import type { LeaderboardEntry } from '../../lib/exercises/gameTypes.ts';
import { getGameLeaderboardData } from '../../lib/exercises/api.ts';

interface Props {
  visible: boolean;
  onClose: () => void;
  gameId: string;
  band: AgeBand;
  studentScore?: number;
  studentName?: string;
  isDark?: boolean;
}

export function ClassLeaderboardModal({
  visible,
  onClose,
  gameId,
  band,
  studentScore,
  studentName,
  isDark = false,
}: Props) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      getGameLeaderboardData(gameId, band, studentScore, studentName)
        .then((data) => setLeaderboard(data))
        .finally(() => setLoading(false));
    }
  }, [visible, gameId, band, studentScore, studentName]);

  const bg = isDark ? '#0F172A' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const accent = isDark ? '#38BDF8' : '#0284C7';
  const highlightBg = isDark ? '#1E3A5F' : '#E0F2FE';
  const highlightBorder = isDark ? '#0284C7' : '#7DD3FC';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.container, { backgroundColor: bg, borderColor: borderCol }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: borderCol }]}>
            <View style={styles.titleRow}>
              <Text style={styles.trophyEmoji}>🏆</Text>
              <View>
                <Text style={[styles.title, { color: textPrimary }]}>
                  {band === 'BAND_C'
                    ? 'CLASSEMENT NATIONAL LYCÉES PILOTES'
                    : 'CLASSEMENT VANGUARD ARENA'}
                </Text>
                <Text style={[styles.sub, { color: textMuted }]}>
                  {band === 'BAND_C'
                    ? 'Élite Baccalauréat • Concours & Épreuves Rapides'
                    : 'Meilleurs scores des Cadets de Vamos Academy'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}
              accessibilityLabel="Fermer le classement"
            >
              <Text style={[styles.closeBtnText, { color: textPrimary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Body */}
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={accent} />
              <Text style={[styles.loadingText, { color: textMuted }]}>
                Calcul du classement en temps réel...
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.listArea} contentContainerStyle={styles.listContent}>
              {leaderboard.map((entry) => {
                const isHighlight = entry.isCurrentStudent;
                const medalEmoji =
                  entry.rank === 1
                    ? '🥇'
                    : entry.rank === 2
                    ? '🥈'
                    : entry.rank === 3
                    ? '🥉'
                    : `#${entry.rank}`;

                return (
                  <View
                    key={entry.studentId}
                    style={[
                      styles.entryCard,
                      {
                        backgroundColor: isHighlight ? highlightBg : cardBg,
                        borderColor: isHighlight ? highlightBorder : borderCol,
                        borderWidth: isHighlight ? 2 : 1,
                      },
                    ]}
                  >
                    <View style={styles.rankBadge}>
                      <Text
                        style={[
                          styles.rankText,
                          typeof medalEmoji === 'string' && medalEmoji.startsWith('#')
                            ? { color: textMuted, fontWeight: '800' }
                            : { fontSize: 20 },
                        ]}
                      >
                        {medalEmoji}
                      </Text>
                    </View>

                    <View style={styles.entryInfo}>
                      <View style={styles.nameRow}>
                        <Text style={[styles.studentName, { color: textPrimary }]}>
                          {entry.studentName}
                        </Text>
                        {isHighlight && (
                          <View style={styles.youBadge}>
                            <Text style={styles.youBadgeText}>VOUS</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.schoolText, { color: textMuted }]}>
                        {entry.schoolOrCity}
                      </Text>
                      <View style={styles.metaRow}>
                        <Text style={[styles.metaText, { color: textMuted }]}>
                          Précision : {entry.accuracy}%
                        </Text>
                        <Text style={[styles.metaText, { color: textMuted }]}>•</Text>
                        <Text style={[styles.metaText, { color: textMuted }]}>
                          Temps : {entry.timeSeconds}s
                        </Text>
                      </View>
                    </View>

                    <View style={styles.scoreCol}>
                      <Text style={[styles.scoreValue, { color: accent }]}>
                        {entry.score}
                      </Text>
                      <Text style={[styles.scoreLabel, { color: textMuted }]}>PTS</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: borderCol }]}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.doneBtn, { backgroundColor: isDark ? '#0284C7' : '#0F172A' }]}
            >
              <Text style={styles.doneBtnText}>Fermer le classement</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '85%',
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  trophyEmoji: {
    fontSize: 28,
  },
  title: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  sub: {
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  loadingBox: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listArea: {
    maxHeight: 440,
  },
  listContent: {
    padding: 14,
    gap: 10,
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  rankBadge: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 14,
  },
  entryInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
  },
  youBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  youBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  schoolText: {
    fontSize: 11,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  metaText: {
    fontSize: 10,
    fontWeight: '600',
  },
  scoreCol: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '700',
  },
  footer: {
    padding: 14,
    borderTopWidth: 1,
  },
  doneBtn: {
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
