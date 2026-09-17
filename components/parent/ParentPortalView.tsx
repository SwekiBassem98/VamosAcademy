import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../store/userStore.ts';
import { useProgressStore } from '../../store/progressStore.ts';
import { useTheme } from '../../theme/ThemeProvider.tsx';
import { LuxuriousPressable } from '../shared/LuxuriousPressable.tsx';

interface LinkedChild {
  id: string;
  name: string;
  age: number;
  band: 'BAND_A' | 'BAND_B' | 'BAND_C';
  bandName: string;
  avatar: string;
  gradeLevel: string;
  weeklyHours: number;
  exercisesCompleted: number;
  accuracy: number;
  primaryReward: string;
  centerBranch: string;
}

const SAMPLE_LINKED_CHILDREN: LinkedChild[] = [
  {
    id: 'child_1',
    name: 'Yassine Ben Salem',
    age: 8,
    band: 'BAND_A',
    bandName: 'The Explorers',
    avatar: '🦁',
    gradeLevel: '3ème Année Primaire',
    weeklyHours: 3.5,
    exercisesCompleted: 24,
    accuracy: 94,
    primaryReward: '38 ⭐ Étoiles Safari',
    centerBranch: 'Tunis Central',
  },
  {
    id: 'child_2',
    name: 'Mariem Ben Salem',
    age: 12,
    band: 'BAND_B',
    bandName: 'The Adventurers',
    avatar: '⚡',
    gradeLevel: '7ème Année de Base (Collège)',
    weeklyHours: 5.2,
    exercisesCompleted: 42,
    accuracy: 89,
    primaryReward: '1,450 XP (Niveau 4 Vanguard)',
    centerBranch: 'Tunis Central',
  },
  {
    id: 'child_3',
    name: 'Ahmed Ben Salem',
    age: 17,
    band: 'BAND_C',
    bandName: 'The Scholars',
    avatar: '🏛️',
    gradeLevel: '4ème Année Secondaire (Bac Math)',
    weeklyHours: 7.8,
    exercisesCompleted: 68,
    accuracy: 96,
    primaryReward: 'Est. Bac 16.8 / 20 (Très Bien)',
    centerBranch: 'Tunis Central',
  },
];

interface ParentPortalViewProps {
  onExit?: () => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({ onExit }) => {
  const router = useRouter();
  const currentUser = useUserStore((s) => s.student);
  const logout = useUserStore((s) => s.logout);
  const { setStudentAge } = useTheme();

  // Selected student in parent view
  const [selectedChildId, setSelectedChildId] = useState<string>(
    currentUser ? currentUser.id : SAMPLE_LINKED_CHILDREN[0].id
  );

  // Active tab in parent portal
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'safety'>('overview');

  // Build the list of children, including the current logged-in user
  const allChildren: LinkedChild[] = [
    ...(currentUser
      ? [
          {
            id: currentUser.id,
            name: currentUser.fullName || 'Étudiant Actif',
            age: currentUser.age,
            band: currentUser.ageBand,
            bandName:
              currentUser.ageBand === 'BAND_A'
                ? 'The Explorers'
                : currentUser.ageBand === 'BAND_B'
                ? 'The Adventurers'
                : 'The Scholars',
            avatar:
              currentUser.ageBand === 'BAND_A'
                ? '🦁'
                : currentUser.ageBand === 'BAND_B'
                ? '⚡'
                : '🏛️',
            gradeLevel:
              currentUser.age <= 9
                ? 'Cycle Primaire'
                : currentUser.age <= 13
                ? 'Collège de Base'
                : 'Lycée Secondaire',
            weeklyHours: 4.6,
            exercisesCompleted: 35,
            accuracy: 93,
            primaryReward:
              currentUser.ageBand === 'BAND_A'
                ? '42 ⭐ Étoiles'
                : currentUser.ageBand === 'BAND_B'
                ? '1,280 XP'
                : 'Annales Validées',
            centerBranch: currentUser.centerBranch || 'Tunis Central',
          },
        ]
      : []),
    ...SAMPLE_LINKED_CHILDREN,
  ];

  // Deduplicate by ID
  const uniqueChildren = allChildren.filter(
    (c, idx, arr) => arr.findIndex((x) => x.id === c.id) === idx
  );

  const activeChild =
    uniqueChildren.find((c) => c.id === selectedChildId) || uniqueChildren[0];

  const handleLogoutAndSwitchAccount = () => {
    logout();
    if (onExit) {
      onExit();
    } else {
      router.replace('/' as any);
    }
  };

  const handleExportSummary = async () => {
    try {
      await Share.share({
        title: `Rapport Académique Vamos — ${activeChild.name}`,
        message: `📊 BILAN ACADÉMIQUE VAMOS ACADEMY\nÉlève : ${activeChild.name} (${activeChild.age} ans)\nCycle : ${activeChild.bandName} (${activeChild.gradeLevel})\nHeures d'étude cette semaine : ${activeChild.weeklyHours}h\nExercices complétés : ${activeChild.exercisesCompleted}\nTaux d'exactitude : ${activeChild.accuracy}%\nStatut : Progression optimale validée par Vamos Academy.`,
      });
    } catch (e) {
      Alert.alert('Partage', 'Bilan académique prêt à être transmis au directeur du centre.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Guardian Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.shieldBadge}>
            <Text style={styles.shieldIcon}>🛡️</Text>
          </View>
          <View>
            <Text style={styles.portalTitle}>PORTAIL PARENT & DIRECTION</Text>
            <Text style={styles.portalSubtitle}>Supervision académique en lecture seule</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogoutAndSwitchAccount}
          style={styles.exitButton}
          testID="parent_portal_logout_button"
        >
          <Text style={styles.exitButtonText}>Déconnexion ➔</Text>
        </TouchableOpacity>
      </View>

      {/* Linked Children Selector */}
      <Text style={styles.sectionLabel}>ÉLÈVES RATTACHÉS AU COMPTE TUTEUR</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.childrenRow}
      >
        {uniqueChildren.map((child) => {
          const isSelected = child.id === activeChild.id;
          const bandColor =
            child.band === 'BAND_A'
              ? '#FF6B4A'
              : child.band === 'BAND_B'
              ? '#4F46E5'
              : '#0F172A';

          return (
            <LuxuriousPressable
              key={child.id}
              onPress={() => setSelectedChildId(child.id)}
              style={[
                styles.childCard,
                isSelected && { borderColor: bandColor, borderWidth: 2, backgroundColor: '#FFFFFF' },
              ]}
            >
              <View style={styles.childHeader}>
                <Text style={styles.childAvatar}>{child.avatar}</Text>
                <View
                  style={[
                    styles.bandChip,
                    { backgroundColor: `${bandColor}15` },
                  ]}
                >
                  <Text style={[styles.bandChipText, { color: bandColor }]}>
                    {child.band.replace('_', ' ')}
                  </Text>
                </View>
              </View>
              <Text style={styles.childName} numberOfLines={1}>
                {child.name}
              </Text>
              <Text style={styles.childAge}>
                {child.age} ans • {child.gradeLevel}
              </Text>
            </LuxuriousPressable>
          );
        })}
      </ScrollView>

      {/* Navigation Tabs for Parent View */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveTab('overview')}
          style={[styles.tabItem, activeTab === 'overview' && styles.tabItemActive]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'overview' && styles.tabTextActive,
            ]}
          >
            Vue d'Ensemble
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('subjects')}
          style={[styles.tabItem, activeTab === 'subjects' && styles.tabItemActive]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'subjects' && styles.tabTextActive,
            ]}
          >
            Disciplines & Maîtrise
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('safety')}
          style={[styles.tabItem, activeTab === 'safety' && styles.tabItemActive]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'safety' && styles.tabTextActive,
            ]}
          >
            Sécurité & Conformité
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <View style={styles.tabContent}>
          {/* Main Key Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>⏱️</Text>
              <Text style={styles.metricValue}>{activeChild.weeklyHours}h</Text>
              <Text style={styles.metricLabel}>Temps d'étude (Semaine)</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>🎯</Text>
              <Text style={[styles.metricValue, { color: '#10B981' }]}>
                {activeChild.accuracy}%
              </Text>
              <Text style={styles.metricLabel}>Taux d'exactitude moyen</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>📚</Text>
              <Text style={styles.metricValue}>{activeChild.exercisesCompleted}</Text>
              <Text style={styles.metricLabel}>Exercices validés</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>🏆</Text>
              <Text style={[styles.metricValue, { fontSize: 14, color: '#D97706' }]} numberOfLines={1}>
                {activeChild.primaryReward}
              </Text>
              <Text style={styles.metricLabel}>Palmarès & Récompense</Text>
            </View>
          </View>

          {/* Academic Journey Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusTitle}>PARCOURS PÉDAGOGIQUE EN COURS</Text>
              <Text style={styles.statusBadge}>EN PROGRESSION ACTIVE</Text>
            </View>
            <Text style={styles.statusBody}>
              {activeChild.name} suit le programme officiel {activeChild.bandName} adapté à son âge ({activeChild.age} ans). Le moteur ajuste automatiquement la difficulté des exercices selon ses temps de réponse.
            </Text>
            <View style={styles.centerInfoRow}>
              <Text style={styles.centerInfoText}>
                📍 Centre d'études : <Text style={{ fontWeight: '700' }}>{activeChild.centerBranch}</Text>
              </Text>
              <Text style={styles.centerInfoText}>
                👨‍🏫 Tuteur référent : <Text style={{ fontWeight: '700' }}>Coordination Pédagogique Vamos</Text>
              </Text>
            </View>
          </View>

          {/* Export / Share Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleExportSummary}
              style={styles.exportButton}
            >
              <Text style={styles.exportButtonText}>📥 Exporter le bilan hebdomadaire</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert(
                  'Message au Centre',
                  'Une notification a été transmise à la direction de votre centre Vamos.'
                )
              }
              style={styles.contactButton}
            >
              <Text style={styles.contactButtonText}>💬 Écrire au Tuteur</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* TAB 2: SUBJECTS & MASTERY */}
      {activeTab === 'subjects' && (
        <View style={styles.tabContent}>
          <Text style={styles.tabSubheading}>
            Évaluation continue des compétences clés par discipline :
          </Text>

          {[
            {
              subject: 'Mathématiques & Raisonnement Logique',
              score: 94,
              status: 'Excellente maîtrise',
              color: '#10B981',
              note: 'Calcul rapide, géométrie et équations assimilés avec fluidité.',
            },
            {
              subject: 'Sciences & Méthodologie Expérimentale',
              score: 88,
              status: 'Solide progression',
              color: '#3B82F6',
              note: 'Concepts physiques et analyse des systèmes bien structurés.',
            },
            {
              subject: 'Langues & Compréhension Écrite (FR / EN / AR)',
              score: 91,
              status: 'Très bon niveau',
              color: '#8B5CF6',
              note: 'Vocabulaire académique et formulation d’arguments maîtrisés.',
            },
            {
              subject: 'Informatique & Algorithmique',
              score: 85,
              status: 'En consolidation',
              color: '#F59E0B',
              note: 'Bonne compréhension des boucles et des conditions.',
            },
          ].map((item, idx) => (
            <View key={idx} style={styles.subjectCard}>
              <View style={styles.subjectHeaderRow}>
                <Text style={styles.subjectName}>{item.subject}</Text>
                <Text style={[styles.subjectScore, { color: item.color }]}>
                  {item.score}%
                </Text>
              </View>
              {/* Progress bar */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${item.score}%`, backgroundColor: item.color },
                  ]}
                />
              </View>
              <View style={styles.subjectFooterRow}>
                <Text style={[styles.subjectStatus, { color: item.color }]}>
                  ● {item.status}
                </Text>
                <Text style={styles.subjectNote}>{item.note}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* TAB 3: SAFETY & COMPLIANCE */}
      {activeTab === 'safety' && (
        <View style={styles.tabContent}>
          <View style={styles.safetyCard}>
            <Text style={styles.safetyHeader}>🔒 PROTECTION DES DONNÉES & SÉCURITÉ DES MINEURS</Text>
            <Text style={styles.safetyText}>
              Vamos Academy applique scrupuleusement les exigences de protection des mineurs (COPPA et réglementation tunisienne INPDP) :
            </Text>

            <View style={styles.safetyCheckItem}>
              <Text style={styles.checkIcon}>✅</Text>
              <Text style={styles.checkText}>
                <Text style={{ fontWeight: '700' }}>Zéro publicité & traqueurs commerciaux :</Text> Aucun profil publicitaire n'est créé à partir des sessions de l'enfant.
              </Text>
            </View>

            <View style={styles.safetyCheckItem}>
              <Text style={styles.checkIcon}>✅</Text>
              <Text style={styles.checkText}>
                <Text style={{ fontWeight: '700' }}>Autorisation parentale vérifiée :</Text> Pour les élèves de moins de 13 ans, les coordonnées du tuteur sont requises lors de l'inscription.
              </Text>
            </View>

            <View style={styles.safetyCheckItem}>
              <Text style={styles.checkIcon}>✅</Text>
              <Text style={styles.checkText}>
                <Text style={{ fontWeight: '700' }}>Accompagnement bienveillant :</Text> Erreurs accompagnées d'explications détaillées et de relances positives sans sanction punitive.
              </Text>
            </View>

            <View style={styles.safetyCheckItem}>
              <Text style={styles.checkIcon}>✅</Text>
              <Text style={styles.checkText}>
                <Text style={{ fontWeight: '700' }}>Accès réservé aux tuteurs et centres certifiés :</Text> Seuls les parents et directeurs d'antenne accèdent aux rapports de synthèse.
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 18,
    paddingTop: 48,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shieldBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  shieldIcon: {
    fontSize: 22,
  },
  portalTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  portalSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  exitButton: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exitButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  childrenRow: {
    gap: 10,
    paddingBottom: 12,
  },
  childCard: {
    width: 170,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  childAvatar: {
    fontSize: 24,
  },
  bandChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bandChipText: {
    fontSize: 9,
    fontWeight: '800',
  },
  childName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  childAge: {
    fontSize: 10,
    color: '#64748B',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    padding: 3,
    marginVertical: 14,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0F172A',
  },
  tabContent: {
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    fontVariant: ['tabular-nums'],
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  statusBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBody: {
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
    marginBottom: 10,
  },
  centerInfoRow: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    gap: 4,
  },
  centerInfoText: {
    fontSize: 11,
    color: '#334155',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  exportButton: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '800',
  },
  tabSubheading: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  subjectCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  subjectHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  subjectScore: {
    fontSize: 15,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  subjectFooterRow: {
    marginTop: 2,
  },
  subjectStatus: {
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 2,
  },
  subjectNote: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  safetyCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  safetyHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  safetyText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  safetyCheckItem: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  checkIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  checkText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },
});
