package com.example

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * Band C Redesign (Ages 14-19) directly inspired by Khan Academy's main product:
 * - Mature, minimal restraint with typography-first hierarchy and generous whitespace
 * - Muted color palette: charcoal/near-black and pure white, with Club Africain red (#D80027) used ONLY for focal accents
 * - Persistent top-level navigation: Practice | Courses/Subjects | Progress/Stats
 * - Clear Subject -> Unit -> Skill hierarchy with 4-level mastery indicators
 * - Content-forward exercise screen with single primary action per screen
 * - Stats-first progress dashboard with study time (hours/minutes), accuracy rate (%), 28-day activity calendar heatmap
 */
@Composable
fun BandCView(primary: Color, secondary: Color) {
  // Persistent top navigation: "practice" | "courses" | "progress"
  var currentTab by remember { mutableStateOf("practice") }

  // Dark / Light Mode theme
  var themeMode by remember { mutableStateOf("system") }
  val isSystemDark = isSystemInDarkTheme()
  val isDark = when (themeMode) {
    "system" -> isSystemDark
    "dark" -> true
    else -> false
  }

  // Academic metrics
  var studyMinutesTotal by remember { mutableIntStateOf(1640) } // ~27.3 hrs
  var weeklyStudyGoalHours by remember { mutableIntStateOf(10) }
  var weeklyCurrentHours by remember { mutableFloatStateOf(8.2f) }
  var accuracyPercent by remember { mutableIntStateOf(92) }
  val streakDays = 7
  var toastMessage by remember { mutableStateOf<String?>(null) }

  // Active exercise dialog
  var activePracticeSkill by remember { mutableStateOf<KhanSkill?>(null) }
  var activePracticeUnit by remember { mutableStateOf<KhanUnit?>(null) }

  // Academic Mature Palette (Near-black, pure white, cobalt blue, sparing red accent)
  val bgCol = if (isDark) Color(0xFF0B0D11) else Color(0xFFF8F9FA)
  val cardCol = if (isDark) Color(0xFF12151B) else Color(0xFFFFFFFF)
  val borderCol = if (isDark) Color(0xFF1E2430) else Color(0xFFE2E8F0)
  val textPrimary = if (isDark) Color(0xFFF8FAFC) else Color(0xFF0F172A)
  val textMuted = if (isDark) Color(0xFF94A3B8) else Color(0xFF64748B)
  val redAccent = Color(0xFFD80027) // Club Africain red for key focal highlights only
  val academicBlue = if (isDark) Color(0xFF38BDF8) else Color(0xFF0284C7)

  fun onSkillMastered(correct: Boolean) {
    studyMinutesTotal += 15
    weeklyCurrentHours += 0.25f
    if (correct) {
      toastMessage = "Validation enregistrée. Maîtrise de la compétence mise à jour."
    } else {
      toastMessage = "Session enregistrée dans votre historique d'entraînement."
    }
    activePracticeSkill = null
    activePracticeUnit = null
  }

  Surface(
    modifier = Modifier
      .fillMaxWidth()
      .clip(RoundedCornerShape(16.dp))
      .border(1.dp, borderCol, RoundedCornerShape(16.dp))
      .testTag("band_c_view"),
    color = bgCol
  ) {
    Column(modifier = Modifier.padding(14.dp)) {
      // 1. Scholar Minimal Top Bar with Academic Branding & Theme Switcher
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Column {
          Text(
            "VAMOS SCHOLARS • LYCÉE & PRÉPARATOIRE (14–19)",
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = textMuted,
            letterSpacing = 0.8.sp
          )
          Text(
            "Youssef Mansouri",
            fontSize = 17.sp,
            fontWeight = FontWeight.Bold,
            color = textPrimary
          )
        }

        // Minimal Dark/Light Mode Pill
        Surface(
          shape = RoundedCornerShape(8.dp),
          color = if (isDark) Color(0xFF1E2430) else Color(0xFFF1F5F9),
          border = androidx.compose.foundation.BorderStroke(1.dp, borderCol)
        ) {
          Row(modifier = Modifier.padding(2.dp)) {
            listOf("system" to (if (isSystemDark) "Auto 🌙" else "Auto ☀️"), "light" to "☀️", "dark" to "🌙").forEach { (mode, label) ->
              val isSelected = themeMode == mode
              Surface(
                shape = RoundedCornerShape(6.dp),
                color = if (isSelected) (if (isDark) Color(0xFF334155) else Color.White) else Color.Transparent,
                modifier = Modifier
                  .clickable { themeMode = mode }
                  .padding(horizontal = 6.dp, vertical = 4.dp)
              ) {
                Text(
                  label,
                  fontSize = 10.sp,
                  fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                  color = if (isSelected) textPrimary else textMuted
                )
              }
            }
          }
        }
      }

      Spacer(Modifier.height(12.dp))

      // 2. Persistent Top-Level Navigation (Practice | Courses/Subjects | Progress/Profile)
      Surface(
        shape = RoundedCornerShape(10.dp),
        color = cardCol,
        border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
        modifier = Modifier
          .fillMaxWidth()
          .testTag("band_c_top_nav")
      ) {
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .padding(3.dp),
          horizontalArrangement = Arrangement.SpaceBetween
        ) {
          listOf(
            Triple("practice", "Pratique ciblée", "◈"),
            Triple("courses", "Matières & Bac", "▤"),
            Triple("progress", "Statistiques & Progrès", "📈")
          ).forEach { (tabId, label, glyph) ->
            val isSelected = currentTab == tabId
            Surface(
              shape = RoundedCornerShape(8.dp),
              color = if (isSelected) (if (isDark) Color(0xFF1E293B) else Color(0xFF0F172A)) else Color.Transparent,
              modifier = Modifier
                .weight(1f)
                .clickable { currentTab = tabId }
                .testTag("band_c_tab_$tabId")
            ) {
              Row(
                modifier = Modifier.padding(vertical = 8.dp),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
              ) {
                Text(
                  glyph,
                  fontSize = 12.sp,
                  color = if (isSelected) Color.White else textMuted
                )
                Spacer(Modifier.width(6.dp))
                Text(
                  label,
                  fontSize = 11.sp,
                  fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                  color = if (isSelected) Color.White else textMuted
                )
              }
            }
          }
        }
      }

      // Toast feedback banner
      if (toastMessage != null) {
        Spacer(Modifier.height(10.dp))
        Surface(
          shape = RoundedCornerShape(8.dp),
          color = if (isDark) Color(0xFF1E293B) else Color(0xFF0F172A),
          modifier = Modifier.fillMaxWidth()
        ) {
          Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Text(
              toastMessage!!,
              color = Color.White,
              fontSize = 11.sp,
              fontWeight = FontWeight.Medium,
              modifier = Modifier.weight(1f)
            )
            TextButton(
              onClick = { toastMessage = null },
              contentPadding = PaddingValues(0.dp)
            ) {
              Text("Fermer", color = redAccent, fontSize = 11.sp, fontWeight = FontWeight.Bold)
            }
          }
        }
      }

      Spacer(Modifier.height(14.dp))

      // 3. Screen Views
      when (currentTab) {
        "practice" -> {
          // --- PRACTICE SCREEN (Content-forward, minimal distractions, clear single primary action) ---
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = cardCol,
            border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
            modifier = Modifier.fillMaxWidth()
          ) {
            Column(modifier = Modifier.padding(16.dp)) {
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
              ) {
                Text(
                  "CONTINUER LA MAÎTRISE DU PROGRAMME",
                  fontSize = 10.sp,
                  fontWeight = FontWeight.Black,
                  color = academicBlue,
                  letterSpacing = 0.5.sp
                )
                Surface(
                  shape = RoundedCornerShape(4.dp),
                  color = redAccent.copy(alpha = 0.1f)
                ) {
                  Text(
                    "ÉPREUVE BAC BLANC DANS 18J",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    color = redAccent,
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                  )
                }
              }

              Spacer(Modifier.height(8.dp))
              Text(
                "Résolution de y' + ay = b avec condition initiale",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = textPrimary
              )
              Text(
                "Mathématiques • Unité 1 : Analyse Réelle & Équations Différentielles",
                fontSize = 12.sp,
                color = textMuted
              )

              Spacer(Modifier.height(12.dp))
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
              ) {
                KhanMasteryIndicator(mastery = MasteryLevel.PROFICIENT)
                Button(
                  onClick = {
                    activePracticeUnit = sampleKhanSubjectsBandC[0].units[0]
                    activePracticeSkill = sampleKhanSubjectsBandC[0].units[0].skills[2]
                  },
                  shape = RoundedCornerShape(6.dp),
                  colors = ButtonDefaults.buttonColors(
                    containerColor = if (isDark) Color(0xFF0284C7) else Color(0xFF0F172A)
                  ),
                  modifier = Modifier.height(36.dp)
                ) {
                  Text("Résoudre l'exercice ➔", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
              }
            }
          }

          Spacer(Modifier.height(16.dp))

          // Practice queue items (High academic relevance, clean layout)
          Text(
            "COMPÉTENCES PRIORITAIRES DE RÉVISION",
            fontSize = 10.sp,
            fontWeight = FontWeight.Black,
            color = textMuted,
            letterSpacing = 0.6.sp
          )
          Spacer(Modifier.height(8.dp))

          sampleKhanSubjectsBandC[0].units.forEach { unit ->
            unit.skills.take(2).forEach { skill ->
              Surface(
                shape = RoundedCornerShape(8.dp),
                color = cardCol,
                border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
                modifier = Modifier
                  .fillMaxWidth()
                  .padding(vertical = 4.dp)
                  .clickable {
                    activePracticeUnit = unit
                    activePracticeSkill = skill
                  }
              ) {
                Row(
                  modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp),
                  verticalAlignment = Alignment.CenterVertically,
                  horizontalArrangement = Arrangement.SpaceBetween
                ) {
                  Column(modifier = Modifier.weight(1f)) {
                    Text(
                      skill.title,
                      fontSize = 13.sp,
                      fontWeight = FontWeight.SemiBold,
                      color = textPrimary
                    )
                    Text(
                      unit.title,
                      fontSize = 11.sp,
                      color = textMuted
                    )
                    Spacer(Modifier.height(4.dp))
                    KhanMasteryIndicator(mastery = skill.mastery)
                  }

                  OutlinedButton(
                    onClick = {
                      activePracticeUnit = unit
                      activePracticeSkill = skill
                    },
                    shape = RoundedCornerShape(6.dp),
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                    modifier = Modifier.height(32.dp)
                  ) {
                    Text("S'entraîner", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                  }
                }
              }
            }
          }
        }

        "courses" -> {
          // --- COURSES / SUBJECTS SCREEN (Hierarchy: Subjects -> Units -> Skills) ---
          Text(
            "PROGRAMME DU BACCALAURÉAT NATIONAL",
            fontSize = 10.sp,
            fontWeight = FontWeight.Black,
            color = textMuted,
            letterSpacing = 0.6.sp
          )
          Text(
            "Progression méthodique par compétences validées et unités d'enseignement.",
            fontSize = 12.sp,
            color = textMuted
          )
          Spacer(Modifier.height(10.dp))

          sampleKhanSubjectsBandC.forEach { subject ->
            KhanSubjectHierarchyCard(
              subject = subject,
              primaryColor = academicBlue,
              isBandB = false,
              onStartSkillPractice = { unit, skill ->
                activePracticeUnit = unit
                activePracticeSkill = skill
              }
            )
          }
        }

        "progress" -> {
          // --- PROGRESS / STATS-FIRST SCREEN (Dashboard with study time, accuracy, heatmap) ---
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
          ) {
            // Tile 1: Study Time
            Surface(
              shape = RoundedCornerShape(10.dp),
              color = cardCol,
              border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
              modifier = Modifier.weight(1f)
            ) {
              Column(modifier = Modifier.padding(12.dp)) {
                Text("TEMPS D'ÉTUDE", fontSize = 9.sp, fontWeight = FontWeight.Black, color = textMuted)
                Spacer(Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.Bottom) {
                  Text(
                    String.format("%.1f", weeklyCurrentHours),
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Black,
                    color = textPrimary
                  )
                  Text("h cette semaine", fontSize = 10.sp, color = textMuted, modifier = Modifier.padding(bottom = 2.dp))
                }
                Spacer(Modifier.height(4.dp))
                LinearProgressIndicator(
                  progress = { (weeklyCurrentHours / weeklyStudyGoalHours).coerceIn(0f, 1f) },
                  color = redAccent,
                  trackColor = if (isDark) Color(0xFF1E293B) else Color(0xFFE2E8F0),
                  modifier = Modifier
                    .fillMaxWidth()
                    .height(4.dp)
                    .clip(RoundedCornerShape(2.dp))
                )
                Text("Objectif : ${weeklyStudyGoalHours}h", fontSize = 9.sp, color = textMuted, modifier = Modifier.padding(top = 2.dp))
              }
            }

            // Tile 2: Accuracy
            Surface(
              shape = RoundedCornerShape(10.dp),
              color = cardCol,
              border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
              modifier = Modifier.weight(1f)
            ) {
              Column(modifier = Modifier.padding(12.dp)) {
                Text("TAUX D'EXACTITUDE", fontSize = 9.sp, fontWeight = FontWeight.Black, color = textMuted)
                Spacer(Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.Bottom) {
                  Text("$accuracyPercent%", fontSize = 18.sp, fontWeight = FontWeight.Black, color = Color(0xFF10B981))
                  Text(" global", fontSize = 10.sp, color = textMuted, modifier = Modifier.padding(bottom = 2.dp))
                }
                Spacer(Modifier.height(4.dp))
                Text("+2.1% ce mois-ci", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFF10B981))
                Text("64 résolutions réussies", fontSize = 9.sp, color = textMuted)
              }
            }

            // Tile 3: Streak
            Surface(
              shape = RoundedCornerShape(10.dp),
              color = cardCol,
              border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
              modifier = Modifier.weight(1f)
            ) {
              Column(modifier = Modifier.padding(12.dp)) {
                Text("RÉGULARITÉ", fontSize = 9.sp, fontWeight = FontWeight.Black, color = textMuted)
                Spacer(Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.Bottom) {
                  Text("$streakDays", fontSize = 18.sp, fontWeight = FontWeight.Black, color = textPrimary)
                  Text(" jours consécutifs", fontSize = 10.sp, color = textMuted, modifier = Modifier.padding(bottom = 2.dp))
                }
                Spacer(Modifier.height(4.dp))
                Text("Session active aujourd'hui", fontSize = 9.sp, fontWeight = FontWeight.SemiBold, color = academicBlue)
              }
            }
          }

          Spacer(Modifier.height(14.dp))

          // 28-Day Activity Calendar Heatmap
          KhanActivityHeatmap(
            isDark = isDark,
            primaryAccent = redAccent
          )

          Spacer(Modifier.height(14.dp))

          // Mastery progression breakdown table
          Surface(
            shape = RoundedCornerShape(10.dp),
            color = cardCol,
            border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
            modifier = Modifier.fillMaxWidth()
          ) {
            Column(modifier = Modifier.padding(14.dp)) {
              Text(
                "RÉPARTITION DE LA MAÎTRISE DU BACCALAURÉAT",
                fontSize = 10.sp,
                fontWeight = FontWeight.Black,
                color = textMuted,
                letterSpacing = 0.5.sp
              )
              Spacer(Modifier.height(8.dp))

              listOf(
                Triple("Maîtrisées (Niveau 3)", "14 compétences", Color(0xFF10B981)),
                Triple("Compétentes (Niveau 2)", "9 compétences", academicBlue),
                Triple("Familier (Niveau 1)", "6 compétences", Color(0xFFF59E0B)),
                Triple("Non commencées (Niveau 0)", "8 compétences", Color(0xFF94A3B8))
              ).forEach { (label, count, col) ->
                Row(
                  modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                  horizontalArrangement = Arrangement.SpaceBetween,
                  verticalAlignment = Alignment.CenterVertically
                ) {
                  Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Box(Modifier.size(8.dp).clip(CircleShape).background(col))
                    Text(label, fontSize = 12.sp, color = textPrimary, fontWeight = FontWeight.Medium)
                  }
                  Text(count, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = textMuted)
                }
              }
            }
          }
        }
      }

      // Active Exercise Dialog Modal
      if (activePracticeSkill != null && activePracticeUnit != null) {
        KhanExerciseDialog(
          skillTitle = activePracticeSkill!!.title,
          unitTitle = activePracticeUnit!!.title,
          primaryColor = if (isDark) academicBlue else Color(0xFF0F172A),
          isBandB = false,
          onDismiss = {
            activePracticeSkill = null
            activePracticeUnit = null
          },
          onMasteryEarned = { correct ->
            onSkillMastered(correct)
          }
        )
      }
    }
  }
}
