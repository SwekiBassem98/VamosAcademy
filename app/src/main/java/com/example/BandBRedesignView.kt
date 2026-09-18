package com.example

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
 * Band B Redesign (Ages 10-13) inspired by Khan Academy:
 * - Persistent Top-level Navigation (Practice, Courses/Subjects, Progress/Profile)
 * - Clear Subject -> Unit -> Skill hierarchy with 4-state mastery indicators
 * - Vibrant Club Africain brand red (#D80027) as primary progress & action color
 * - Badge and level-up celebrations with restrained, non-cartoonish styling
 * - Clean content-forward exercise modal with single primary action
 * - Visible practice streak and activity calendar heatmap
 */
@Composable
fun BandBView(primary: Color, secondary: Color) {
  // Persistent top-level navigation: "practice" | "courses" | "progress"
  var currentTab by remember { mutableStateOf("practice") }

  // State & metrics
  var xp by remember { mutableIntStateOf(1420) }
  var level by remember { mutableIntStateOf(4) }
  val streakDays = 5
  var masteryScore by remember { mutableIntStateOf(18) } // Total mastered skills
  var toastMessage by remember { mutableStateOf<String?>(null) }
  var showLevelUpBadge by remember { mutableStateOf(false) }

  // Exercise modal states
  var activePracticeSkill by remember { mutableStateOf<KhanSkill?>(null) }
  var activePracticeUnit by remember { mutableStateOf<KhanUnit?>(null) }

  // Club Africain bold palette for Band B (Visual energy, brand red #D80027 as primary)
  val brandRed = Color(0xFFD80027)
  val neutralDark = Color(0xFF0F172A)
  val neutralMuted = Color(0xFF64748B)
  val surfaceBg = Color(0xFFF8FAFC)
  val cardBg = Color.White
  val borderColor = Color(0xFFE2E8F0)

  fun onSkillMastered(correct: Boolean) {
    if (correct) {
      xp += 75
      masteryScore += 1
      val newLevel = (xp / 400) + 1
      if (newLevel > level) {
        level = newLevel
        showLevelUpBadge = true
        toastMessage = "🏆 NIVEAU SUPÉRIEUR ! Tu as atteint le Grade $level !"
      } else {
        toastMessage = "✓ Compétence validée ! +75 XP ajoutés au profil"
      }
    } else {
      xp += 15
      toastMessage = "Entraînement enregistré. +15 XP"
    }
    activePracticeSkill = null
    activePracticeUnit = null
  }

  Column(
    modifier = Modifier
      .fillMaxWidth()
      .testTag("band_b_view")
  ) {
    // 1. Persistent Top-Level Navigation Bar (Practice | Courses/Subjects | Progress/Profile)
    Surface(
      shape = RoundedCornerShape(12.dp),
      color = cardBg,
      border = androidx.compose.foundation.BorderStroke(1.5.dp, borderColor),
      shadowElevation = 1.dp,
      modifier = Modifier
        .fillMaxWidth()
        .testTag("band_b_top_nav")
    ) {
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .padding(4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
      ) {
        listOf(
          Triple("practice", "Pratique", "🎯"),
          Triple("courses", "Matières & Cours", "📚"),
          Triple("progress", "Progression & Profil", "📈")
        ).forEach { (tabId, label, icon) ->
          val isSelected = currentTab == tabId
          Surface(
            shape = RoundedCornerShape(8.dp),
            color = if (isSelected) brandRed else Color.Transparent,
            modifier = Modifier
              .weight(1f)
              .clickable { currentTab = tabId }
              .testTag("band_b_tab_$tabId")
          ) {
            Row(
              modifier = Modifier.padding(vertical = 10.dp),
              horizontalArrangement = Arrangement.Center,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Text(icon, fontSize = 14.sp)
              Spacer(Modifier.width(6.dp))
              Text(
                label,
                fontSize = 12.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.SemiBold,
                color = if (isSelected) Color.White else neutralMuted
              )
            }
          }
        }
      }
    }

    // Toast Banner
    if (toastMessage != null) {
      Spacer(Modifier.height(10.dp))
      Surface(
        shape = RoundedCornerShape(10.dp),
        color = neutralDark,
        modifier = Modifier.fillMaxWidth()
      ) {
        Row(
          modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text("⚡", fontSize = 16.sp)
          Spacer(Modifier.width(8.dp))
          Text(
            toastMessage!!,
            color = Color(0xFF38BDF8),
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.weight(1f)
          )
          TextButton(
            onClick = { toastMessage = null },
            contentPadding = PaddingValues(0.dp)
          ) {
            Text("OK", color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
          }
        }
      }
    }

    // Level-up celebration modal card
    if (showLevelUpBadge) {
      Spacer(Modifier.height(10.dp))
      Surface(
        shape = RoundedCornerShape(14.dp),
        color = Color(0xFFFEF2F2),
        border = androidx.compose.foundation.BorderStroke(2.dp, brandRed),
        modifier = Modifier.fillMaxWidth()
      ) {
        Row(
          modifier = Modifier.padding(14.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Surface(
            shape = CircleShape,
            color = brandRed,
            modifier = Modifier.size(46.dp)
          ) {
            Box(contentAlignment = Alignment.Center) {
              Text("👑", fontSize = 24.sp)
            }
          }
          Spacer(Modifier.width(12.dp))
          Column(modifier = Modifier.weight(1f)) {
            Text(
              "NOUVEAU GRADE DÉBLOQUÉ !",
              fontSize = 10.sp,
              fontWeight = FontWeight.Black,
              color = brandRed,
              letterSpacing = 0.5.sp
            )
            Text(
              "Navigateur d'Élite • Grade $level",
              fontSize = 15.sp,
              fontWeight = FontWeight.Bold,
              color = neutralDark
            )
            Text(
              "+3 badges de maîtrise disponibles",
              fontSize = 11.sp,
              color = neutralMuted
            )
          }
          OutlinedButton(
            onClick = { showLevelUpBadge = false },
            shape = RoundedCornerShape(8.dp),
            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
            modifier = Modifier.height(34.dp)
          ) {
            Text("Super !", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = brandRed)
          }
        }
      }
    }

    Spacer(Modifier.height(14.dp))

    // 2. Tab Views
    when (currentTab) {
      "practice" -> {
        // --- PRACTICE SCREEN (Khan Academy style: Next up + active skill practices) ---
        // Quick Resume Hero Card
        Surface(
          shape = RoundedCornerShape(14.dp),
          color = cardBg,
          border = androidx.compose.foundation.BorderStroke(1.dp, borderColor),
          shadowElevation = 1.dp,
          modifier = Modifier.fillMaxWidth()
        ) {
          Column(modifier = Modifier.padding(16.dp)) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Surface(
                shape = RoundedCornerShape(6.dp),
                color = brandRed.copy(alpha = 0.1f)
              ) {
                Text(
                  "REPRENDRE L'ENTRAÎNEMENT",
                  fontSize = 10.sp,
                  fontWeight = FontWeight.Black,
                  color = brandRed,
                  letterSpacing = 0.5.sp,
                  modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
              }
              Text("Maths 7ème", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = neutralMuted)
            }

            Spacer(Modifier.height(8.dp))
            Text(
              "Résolution d'équations simples ax = b",
              fontSize = 16.sp,
              fontWeight = FontWeight.Bold,
              color = neutralDark
            )
            Text(
              "Unité 1 : Nombres relatifs et fractions • 4 exercices restants",
              fontSize = 12.sp,
              color = neutralMuted
            )

            Spacer(Modifier.height(12.dp))
            Row(
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
              KhanMasteryIndicator(mastery = MasteryLevel.NOT_STARTED)
              Spacer(Modifier.weight(1f))
              Button(
                onClick = {
                  activePracticeUnit = sampleKhanSubjectsBandB[0].units[0]
                  activePracticeSkill = sampleKhanSubjectsBandB[0].units[0].skills[3]
                },
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(containerColor = brandRed),
                modifier = Modifier.height(38.dp)
              ) {
                Text("Pratiquer maintenant ➔", fontSize = 12.sp, fontWeight = FontWeight.Bold)
              }
            }
          }
        }

        Spacer(Modifier.height(16.dp))

        // Daily Practice Focus Queue
        Text(
          "COMPÉTENCES RECOMMANDÉES AUJOURD'HUI",
          fontSize = 11.sp,
          fontWeight = FontWeight.Black,
          color = neutralMuted,
          letterSpacing = 0.6.sp
        )
        Spacer(Modifier.height(8.dp))

        sampleKhanSubjectsBandB[0].units.forEach { unit ->
          unit.skills.take(2).forEach { skill ->
            Surface(
              shape = RoundedCornerShape(10.dp),
              color = cardBg,
              border = androidx.compose.foundation.BorderStroke(1.dp, borderColor),
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
                    fontWeight = FontWeight.Bold,
                    color = neutralDark
                  )
                  Text(
                    unit.title,
                    fontSize = 11.sp,
                    color = neutralMuted
                  )
                  Spacer(Modifier.height(4.dp))
                  KhanMasteryIndicator(mastery = skill.mastery)
                }

                Surface(
                  shape = RoundedCornerShape(6.dp),
                  color = Color(0xFFF1F5F9),
                  modifier = Modifier.padding(start = 8.dp)
                ) {
                  Text(
                    "Démarrer",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = brandRed,
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                  )
                }
              }
            }
          }
        }
      }

      "courses" -> {
        // --- COURSES / SUBJECTS SCREEN (Hierarchy: Subjects -> Units -> Skills) ---
        Text(
          "PROGRAMME SCOLAIRE COLLÈGE (10–13 ANS)",
          fontSize = 11.sp,
          fontWeight = FontWeight.Black,
          color = neutralMuted,
          letterSpacing = 0.6.sp
        )
        Text(
          "Choisis une matière pour explorer ses unités et niveaux de maîtrise.",
          fontSize = 12.sp,
          color = neutralMuted
        )
        Spacer(Modifier.height(10.dp))

        sampleKhanSubjectsBandB.forEach { subject ->
          KhanSubjectHierarchyCard(
            subject = subject,
            primaryColor = brandRed,
            isBandB = true,
            onStartSkillPractice = { unit, skill ->
              activePracticeUnit = unit
              activePracticeSkill = skill
            }
          )
        }
      }

      "progress" -> {
        // --- PROGRESS / PROFILE SCREEN (Streak, Calendar heatmap, mastery tally, badges) ---
        // Top stats summary strip
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          // Mastery Count
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = cardBg,
            border = androidx.compose.foundation.BorderStroke(1.dp, borderColor),
            modifier = Modifier.weight(1f)
          ) {
            Column(modifier = Modifier.padding(12.dp)) {
              Text("COMPÉTENCES", fontSize = 9.sp, fontWeight = FontWeight.Black, color = neutralMuted)
              Spacer(Modifier.height(2.dp))
              Text("$masteryScore maîtrisées", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF10B981))
              Text("sur 32 au programme", fontSize = 10.sp, color = neutralMuted)
            }
          }

          // Streak Counter
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = cardBg,
            border = androidx.compose.foundation.BorderStroke(1.dp, borderColor),
            modifier = Modifier.weight(1f)
          ) {
            Column(modifier = Modifier.padding(12.dp)) {
              Text("SÉRIE ACTIVE", fontSize = 9.sp, fontWeight = FontWeight.Black, color = neutralMuted)
              Spacer(Modifier.height(2.dp))
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("🔥 $streakDays", fontSize = 15.sp, fontWeight = FontWeight.Black, color = brandRed)
                Text(" jours", fontSize = 11.sp, color = neutralMuted)
              }
              Text("Objectif hebdo atteint", fontSize = 10.sp, color = neutralMuted)
            }
          }

          // Total Points / Level
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = cardBg,
            border = androidx.compose.foundation.BorderStroke(1.dp, borderColor),
            modifier = Modifier.weight(1f)
          ) {
            Column(modifier = Modifier.padding(12.dp)) {
              Text("POINTS & RANG", fontSize = 9.sp, fontWeight = FontWeight.Black, color = neutralMuted)
              Spacer(Modifier.height(2.dp))
              Text("$xp XP", fontSize = 15.sp, fontWeight = FontWeight.Black, color = neutralDark)
              Text("Grade $level Navigateur", fontSize = 10.sp, color = brandRed, fontWeight = FontWeight.Bold)
            }
          }
        }

        Spacer(Modifier.height(14.dp))

        // Activity Calendar Heatmap
        KhanActivityHeatmap(
          isDark = false,
          primaryAccent = brandRed
        )

        Spacer(Modifier.height(14.dp))

        // Level-up and Mastery Badges (Energy without cartoon excess)
        Surface(
          shape = RoundedCornerShape(12.dp),
          color = cardBg,
          border = androidx.compose.foundation.BorderStroke(1.dp, borderColor),
          modifier = Modifier.fillMaxWidth()
        ) {
          Column(modifier = Modifier.padding(14.dp)) {
            Text(
              "BADGES DE MAÎTRISE ET D'ASSIDUITÉ",
              fontSize = 11.sp,
              fontWeight = FontWeight.Black,
              color = neutralMuted,
              letterSpacing = 0.5.sp
            )
            Spacer(Modifier.height(8.dp))

            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              listOf(
                Triple("⚡ Rapide", "5 calculs parfaits", true),
                Triple("📐 Géomètre", "Pythagore niveau 3", true),
                Triple("🔥 Flamme 5j", "5 jours consécutifs", true),
                Triple("👑 Élite", "10 compétences à 100%", false)
              ).forEach { (badge, desc, unlocked) ->
                Surface(
                  shape = RoundedCornerShape(8.dp),
                  color = if (unlocked) Color(0xFFFEF2F2) else Color(0xFFF1F5F9),
                  border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    if (unlocked) Color(0xFFFECACA) else Color(0xFFCBD5E1)
                  ),
                  modifier = Modifier.weight(1f).padding(horizontal = 2.dp)
                ) {
                  Column(
                    modifier = Modifier.padding(horizontal = 4.dp, vertical = 6.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                  ) {
                    Text(if (unlocked) badge else "🔒 $badge", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = if (unlocked) brandRed else neutralMuted)
                    Text(desc, fontSize = 8.sp, color = neutralMuted, maxLines = 1)
                  }
                }
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
        primaryColor = brandRed,
        isBandB = true,
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
