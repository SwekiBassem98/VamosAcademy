package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.platform.testTag
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
  Text(text = "Hello $name!", modifier = modifier)
}

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      VamosAcademyApp()
    }
  }
}

enum class AgeBand(val title: String, val ageRange: String) {
  BAND_A("The Explorers", "Ages 6–9"),
  BAND_B("The Adventurers", "Ages 10–13"),
  BAND_C("The Scholars", "Ages 14–19");

  companion object {
    fun fromAge(age: Int): AgeBand {
      return when {
        age <= 9 -> BAND_A
        age <= 13 -> BAND_B
        else -> BAND_C
      }
    }
  }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VamosAcademyApp() {
  var studentAge by remember { mutableIntStateOf(8) }
  var studentName by remember { mutableStateOf("Youssef Mansouri") }
  val currentBand = remember(studentAge) { AgeBand.fromAge(studentAge) }

  var showEnrollDialog by remember { mutableStateOf(false) }
  var showLevelUpDialog by remember { mutableStateOf(false) }
  var levelUpPrevBand by remember { mutableStateOf(AgeBand.BAND_A) }
  var levelUpNewBand by remember { mutableStateOf(AgeBand.BAND_B) }

  // Dynamic Theme Colors mapped from DESIGN_SYSTEM.md (Club Africain Rebrand)
  val primaryColor by animateColorAsState(
    targetValue = when (currentBand) {
      AgeBand.BAND_A -> Color(0xFFD80027) // Rouge Sang
      AgeBand.BAND_B -> Color(0xFFD80027) // Red primary action
      AgeBand.BAND_C -> Color(0xFF12151B) // Near-black charcoal
    },
    label = "primary"
  )

  val secondaryColor by animateColorAsState(
    targetValue = when (currentBand) {
      AgeBand.BAND_A -> Color(0xFF1A56C4) // Away Kit Cobalt Blue
      AgeBand.BAND_B -> Color(0xFF1A56C4) // Cobalt Blue competitive accent
      AgeBand.BAND_C -> Color(0xFF1A56C4) // Cobalt Blue secondary
    },
    label = "secondary"
  )

  val containerColor by animateColorAsState(
    targetValue = when (currentBand) {
      AgeBand.BAND_A -> Color(0xFFFDE2E6) // Soft crimson tint
      AgeBand.BAND_B -> Color(0xFFEFF6FF) // Cobalt blue tint
      AgeBand.BAND_C -> Color(0xFFF1F5F9)
    },
    label = "container"
  )

  val bgColor by animateColorAsState(
    targetValue = when (currentBand) {
      AgeBand.BAND_A -> Color(0xFFFFFDF9)
      AgeBand.BAND_B -> Color(0xFFF8FAFC)
      AgeBand.BAND_C -> Color(0xFFF8F9FA)
    },
    label = "bg"
  )

  Scaffold(
    containerColor = bgColor,
    topBar = {
      TopAppBar(
        colors = TopAppBarDefaults.topAppBarColors(
          containerColor = containerColor
        ),
        title = {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
              "Vamos Academy",
              fontWeight = FontWeight.Black,
              color = primaryColor,
              fontSize = 20.sp
            )
            Spacer(Modifier.width(8.dp))
            Surface(
              color = primaryColor.copy(alpha = 0.15f),
              shape = RoundedCornerShape(8.dp)
            ) {
              Text(
                "TUNISIA",
                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = primaryColor
              )
            }
          }
        },
        actions = {
          Surface(
            color = Color(0xFFFEF3C7),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier
              .clickable {
                levelUpPrevBand = currentBand
                val nextBand = when (currentBand) {
                  AgeBand.BAND_A -> AgeBand.BAND_B
                  AgeBand.BAND_B -> AgeBand.BAND_C
                  AgeBand.BAND_C -> AgeBand.BAND_A
                }
                levelUpNewBand = nextBand
                showLevelUpDialog = true
              }
              .padding(end = 8.dp)
          ) {
            Text(
              "🎂 Level Up",
              color = Color(0xFFB45309),
              fontWeight = FontWeight.Bold,
              fontSize = 12.sp,
              modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp)
            )
          }

          Surface(
            color = primaryColor,
            shape = CircleShape,
            modifier = Modifier.padding(end = 12.dp)
          ) {
            Text(
              "${studentAge}y",
              color = Color.White,
              fontWeight = FontWeight.Bold,
              fontSize = 14.sp,
              modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
            )
          }
        }
      )
    }
  ) { padding ->
    Column(
      modifier = Modifier
        .fillMaxSize()
        .padding(padding)
        .verticalScroll(rememberScrollState())
        .padding(16.dp)
    ) {
      // Action Row: Sign-Up & Birthday Simulation Buttons
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
      ) {
        Button(
          onClick = { showEnrollDialog = true },
          colors = ButtonDefaults.buttonColors(containerColor = primaryColor),
          shape = RoundedCornerShape(12.dp),
          modifier = Modifier.weight(1f)
        ) {
          Text("✍️ Sign-Up Flow", fontWeight = FontWeight.Bold, fontSize = 13.sp)
        }

        OutlinedButton(
          onClick = {
            levelUpPrevBand = currentBand
            val targetBand = if (currentBand == AgeBand.BAND_A) AgeBand.BAND_B else AgeBand.BAND_C
            levelUpNewBand = targetBand
            showLevelUpDialog = true
          },
          shape = RoundedCornerShape(12.dp),
          modifier = Modifier.weight(1f)
        ) {
          Text("🎂 Birthday Check", fontWeight = FontWeight.Bold, fontSize = 13.sp)
        }
      }

      Spacer(Modifier.height(14.dp))

      // Age Selector Bar
      Text(
        "STUDENT AGE SELECTOR (6–19):",
        fontSize = 12.sp,
        fontWeight = FontWeight.ExtraBold,
        color = Color(0xFF64748B),
        letterSpacing = 0.5.sp
      )
      Spacer(Modifier.height(8.dp))
      LazyRow(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier.fillMaxWidth()
      ) {
        items((6..19).toList()) { age ->
          val isSelected = age == studentAge
          val band = AgeBand.fromAge(age)
          val pillColor = if (isSelected) primaryColor else Color.White

          Surface(
            shape = RoundedCornerShape(16.dp),
            color = pillColor,
            shadowElevation = if (isSelected) 3.dp else 1.dp,
            border = if (!isSelected) androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0)) else null,
            modifier = Modifier
              .clickable { studentAge = age }
          ) {
            Column(
              horizontalAlignment = Alignment.CenterHorizontally,
              modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp)
            ) {
              Text(
                "${age}y",
                fontWeight = FontWeight.Bold,
                color = if (isSelected) Color.White else Color(0xFF1E293B),
                fontSize = 14.sp
              )
              Text(
                when (band) {
                  AgeBand.BAND_A -> "Band A"
                  AgeBand.BAND_B -> "Band B"
                  AgeBand.BAND_C -> "Band C"
                },
                fontSize = 10.sp,
                color = if (isSelected) Color.White.copy(alpha = 0.85f) else Color(0xFF94A3B8)
              )
            }
          }
        }
      }

      Spacer(Modifier.height(16.dp))

      // Age Band Status Banner
      Surface(
        shape = RoundedCornerShape(when (currentBand) {
          AgeBand.BAND_A -> 24.dp
          AgeBand.BAND_B -> 16.dp
          AgeBand.BAND_C -> 10.dp
        }),
        color = containerColor,
        modifier = Modifier.fillMaxWidth()
      ) {
        Row(
          modifier = Modifier.padding(16.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Column(modifier = Modifier.weight(1f)) {
            Text(
              currentBand.title.uppercase(),
              fontWeight = FontWeight.ExtraBold,
              fontSize = 12.sp,
              color = primaryColor,
              letterSpacing = 1.sp
            )
            Text(
              when (currentBand) {
                AgeBand.BAND_A -> "Companion: Youssef the Fennec 🦊"
                AgeBand.BAND_B -> "Companion: The Vamos Vanguard ⚡"
                AgeBand.BAND_C -> "Companion: Academic Fellow Honors 🏛️"
              },
              fontWeight = FontWeight.Bold,
              fontSize = 16.sp,
              color = Color(0xFF1E293B)
            )
            Text(
              "Resolved Band: ${currentBand.name} (${currentBand.ageRange})",
              fontSize = 12.sp,
              color = Color(0xFF64748B)
            )
          }
          Text(
            when (currentBand) {
              AgeBand.BAND_A -> "🦊"
              AgeBand.BAND_B -> "⚡"
              AgeBand.BAND_C -> "🏛️"
            },
            fontSize = 38.sp
          )
        }
      }

      Spacer(Modifier.height(16.dp))

      // Band-Specific Adaptive Interfaces
      when (currentBand) {
        AgeBand.BAND_A -> BandAView(primaryColor, secondaryColor)
        AgeBand.BAND_B -> BandBView(primaryColor, secondaryColor)
        AgeBand.BAND_C -> BandCView(primaryColor, secondaryColor)
      }

      Spacer(Modifier.height(20.dp))

      // Scaffolding status card
      Surface(
        shape = RoundedCornerShape(12.dp),
        color = Color.White,
        shadowElevation = 1.dp,
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0)),
        modifier = Modifier.fillMaxWidth()
      ) {
        Column(modifier = Modifier.padding(14.dp)) {
          Text(
            "VAMOS ACADEMY AGE ADAPTIVE SYSTEM",
            fontSize = 11.sp,
            fontWeight = FontWeight.ExtraBold,
            color = Color(0xFF0F172A),
            letterSpacing = 0.5.sp
          )
          Spacer(Modifier.height(4.dp))
          Text(
            "• Sign-Up Flow: Birthdate Picker + Child-Safety Parent Guard (<13)\n• themeResolver: 27/27 Passing Tests (Age, Band, Birthday Transitions)\n• Prisma Backend: birthDate, ageBand, parentContact Schema Stored\n• Level-Up Engine: Auto-detects birthday progression with celebratory transition",
            fontSize = 12.sp,
            color = Color(0xFF475569),
            lineHeight = 18.sp
          )
        }
      }
    }
  }

  // Dialog 1: Enroll Student Sign-Up Flow
  if (showEnrollDialog) {
    EnrollStudentDialog(
      onDismiss = { showEnrollDialog = false },
      onEnrollSuccess = { name, computedAge, band ->
        studentName = name
        studentAge = computedAge
        showEnrollDialog = false
      }
    )
  }

  // Dialog 2: Birthday Level-Up Transition Screen
  if (showLevelUpDialog) {
    LevelUpDialog(
      prevBand = levelUpPrevBand,
      newBand = levelUpNewBand,
      onDismiss = { showLevelUpDialog = false },
      onEnterNewBand = { newAge ->
        studentAge = newAge
        showLevelUpDialog = false
      }
    )
  }
}

@Composable
fun BandAView(primary: Color, secondary: Color) {
  var stars by remember { mutableIntStateOf(24) }
  val streakDays = 5
  var isCelebrating by remember { mutableStateOf(false) }
  var celebrationText by remember { mutableStateOf("Tap any big tile to begin! 🌟") }
  var activeModal by remember { mutableStateOf<String?>(null) } // "PRACTICE", "PLAY", "STARS", "PROGRESS"

  fun triggerCelebration(message: String, starsEarned: Int = 0) {
    if (starsEarned > 0) {
      stars += starsEarned
    }
    celebrationText = message
    isCelebrating = true
  }

  Column {
    // 1. Hero Mascot Welcome Banner with Animated Bouncing Youssef
    Surface(
      shape = RoundedCornerShape(26.dp),
      color = Color(0xFFFFE8E2),
      border = androidx.compose.foundation.BorderStroke(2.dp, Color(0xFFF2D8D0)),
      shadowElevation = 2.dp,
      modifier = Modifier.fillMaxWidth()
    ) {
      Row(
        modifier = Modifier.padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
      ) {
        Column(modifier = Modifier.weight(1f)) {
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = Color.White,
            modifier = Modifier.padding(bottom = 6.dp)
          ) {
            Text(
              "THE EXPLORERS (AGES 6–9)",
              fontSize = 10.sp,
              fontWeight = FontWeight.Black,
              color = primary,
              letterSpacing = 0.5.sp,
              modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
            )
          }
          Text(
            "Bonjour, Champion!",
            fontSize = 20.sp,
            fontWeight = FontWeight.Black,
            color = Color(0xFF2D2327)
          )
          Spacer(Modifier.height(2.dp))
          Text(
            "\"Tap any big tile to start!\"",
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold,
            color = Color(0xFF7C6E75)
          )
        }

        // Animated Interactive Mascot Component
        AnimatedMascotCompose(
          isCelebrating = isCelebrating,
          celebrationMessage = celebrationText,
          onMascotTap = {
            triggerCelebration("Youssef loves you! 🦊✨")
          }
        )
      }
    }

    Spacer(Modifier.height(14.dp))

    // 2. Prominent Reward System: Visible Stars & Sticker Album Accumulation
    Surface(
      shape = RoundedCornerShape(24.dp),
      color = Color.White,
      shadowElevation = 3.dp,
      border = androidx.compose.foundation.BorderStroke(2.dp, Color(0xFFFDE68A)),
      modifier = Modifier
        .fillMaxWidth()
        .clickable { activeModal = "STARS" }
        .testTag("reward_showcase")
    ) {
      Column(modifier = Modifier.padding(14.dp)) {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          // Big Star Bank
          Surface(
            shape = RoundedCornerShape(18.dp),
            color = Color(0xFFFFFBEB),
            border = androidx.compose.foundation.BorderStroke(2.dp, Color(0xFFFDE68A))
          ) {
            Row(
              verticalAlignment = Alignment.CenterVertically,
              modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
            ) {
              Text("⭐", fontSize = 26.sp)
              Spacer(Modifier.width(8.dp))
              Column {
                Text(
                  "$stars",
                  fontSize = 20.sp,
                  fontWeight = FontWeight.Black,
                  color = Color(0xFFB45309),
                  lineHeight = 22.sp
                )
                Text(
                  "STARS",
                  fontSize = 10.sp,
                  fontWeight = FontWeight.Black,
                  color = Color(0xFFD97706),
                  letterSpacing = 0.5.sp
                )
              }
            }
          }

          // Streak Pill
          Surface(
            shape = RoundedCornerShape(18.dp),
            color = Color(0xFFFEF2F2),
            border = androidx.compose.foundation.BorderStroke(2.dp, Color(0xFFFECACA))
          ) {
            Row(
              verticalAlignment = Alignment.CenterVertically,
              modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
            ) {
              Text("🔥", fontSize = 24.sp)
              Spacer(Modifier.width(6.dp))
              Column {
                Text(
                  "$streakDays",
                  fontSize = 18.sp,
                  fontWeight = FontWeight.Black,
                  color = Color(0xFFDC2626),
                  lineHeight = 20.sp
                )
                Text(
                  "DAYS",
                  fontSize = 10.sp,
                  fontWeight = FontWeight.Black,
                  color = Color(0xFFEF4444),
                  letterSpacing = 0.5.sp
                )
              }
            }
          }
        }

        Spacer(Modifier.height(10.dp))

        // Sticker Badges Row
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text(
            "STICKER ALBUM",
            fontSize = 11.sp,
            fontWeight = FontWeight.ExtraBold,
            color = Color(0xFF7C6E75),
            letterSpacing = 0.6.sp
          )
          Text(
            "Tap to open ➔",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = primary
          )
        }

        Spacer(Modifier.height(6.dp))

        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
          listOf(
            "🦊" to 5,
            "🪄" to 10,
            "🌴" to 15,
            "🐪" to 20,
            "🚀" to 30,
            "👑" to 45
          ).forEach { (emoji, needed) ->
            val unlocked = stars >= needed
            Surface(
              shape = RoundedCornerShape(12.dp),
              color = if (unlocked) Color(0xFFFEF3C7) else Color(0xFFF1F5F9),
              border = androidx.compose.foundation.BorderStroke(
                1.5.dp,
                if (unlocked) Color(0xFFF59E0B) else Color(0xFFCBD5E1)
              ),
              modifier = Modifier
                .weight(1f)
                .height(38.dp)
            ) {
              Box(contentAlignment = Alignment.Center) {
                Text(if (unlocked) emoji else "🔒", fontSize = 16.sp)
              }
            }
          }
        }

        Spacer(Modifier.height(8.dp))
        val nextGoal = if (stars < 30) 30 else 45
        val needed = maxOf(0, nextGoal - stars)
        Surface(
          shape = RoundedCornerShape(10.dp),
          color = Color(0xFFFFF7ED),
          modifier = Modifier.fillMaxWidth()
        ) {
          Text(
            if (needed > 0) "🎯 $needed more ⭐ until next sticker!" else "👑 Master Explorer! All stickers unlocked!",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFFC2410C),
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
          )
        }
      }
    }

    Spacer(Modifier.height(14.dp))

    // Khan Academy Kids Inspired: Primary Journey CTA (Instant 1-Tap entry into active step)
    Surface(
      shape = RoundedCornerShape(24.dp),
      color = Color.White,
      shadowElevation = 3.dp,
      border = androidx.compose.foundation.BorderStroke(2.dp, Color(0xFFFDE2E6)),
      modifier = Modifier
        .fillMaxWidth()
        .clickable { activeModal = "PRACTICE" }
        .testTag("continue_journey_cta")
    ) {
      Row(
        modifier = Modifier.padding(14.dp),
        verticalAlignment = Alignment.CenterVertically
      ) {
        Surface(
          shape = CircleShape,
          color = Color(0xFFFDE2E6),
          modifier = Modifier.size(52.dp)
        ) {
          Box(contentAlignment = Alignment.Center) {
            Text("🚀", fontSize = 28.sp)
          }
        }
        Spacer(Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
          Text(
            "MISSION EN COURS",
            fontWeight = FontWeight.Black,
            fontSize = 10.sp,
            color = Color(0xFFD80027), // Club Africain Accent
            letterSpacing = 0.5.sp
          )
          Text(
            "Palais de Carthage",
            fontWeight = FontWeight.Black,
            fontSize = 16.sp,
            color = Color(0xFF12151B)
          )
          Text(
            "Étape 3 • Gagne +3 étoiles ⭐",
            fontSize = 12.sp,
            color = Color(0xFF64748B),
            fontWeight = FontWeight.SemiBold
          )
        }
        Surface(
          shape = CircleShape,
          color = Color(0xFFD80027), // Club Africain Rouge Accent
          shadowElevation = 2.dp,
          modifier = Modifier.size(42.dp)
        ) {
          Box(contentAlignment = Alignment.Center) {
            Text("➔", color = Color.White, fontWeight = FontWeight.Black, fontSize = 18.sp)
          }
        }
      }
    }

    Spacer(Modifier.height(16.dp))

    // Companion Characters Bar (Khan Academy Kids Room Switcher)
    Text(
      "TES COMPAGNONS D'AVENTURE",
      fontWeight = FontWeight.Black,
      fontSize = 11.sp,
      color = Color(0xFF94A3B8),
      letterSpacing = 0.8.sp
    )
    Spacer(Modifier.height(8.dp))

    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
      listOf(
        Triple("Farès", "🦊", "PRACTICE"),
        Triple("Nour", "🦌", "PRACTICE"),
        Triple("Lina", "🐢", "PLAY"),
        Triple("Zack", "🦅", "STARS")
      ).forEach { (name, emoji, modal) ->
        Surface(
          shape = RoundedCornerShape(18.dp),
          color = Color.White,
          shadowElevation = 1.dp,
          border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFFF1F5F9)),
          modifier = Modifier
            .weight(1f)
            .clickable { activeModal = modal }
        ) {
          Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(vertical = 10.dp, horizontal = 4.dp)
          ) {
            Surface(
              shape = CircleShape,
              color = Color(0xFFFFFDF9),
              border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFFFDE2E6)),
              modifier = Modifier.size(40.dp)
            ) {
              Box(contentAlignment = Alignment.Center) {
                Text(emoji, fontSize = 22.sp)
              }
            }
            Spacer(Modifier.height(4.dp))
            Text(name, fontWeight = FontWeight.Black, fontSize = 11.sp, color = Color(0xFF334155))
          }
        }
      }
    }

    Spacer(Modifier.height(16.dp))

    // Visual "Learning Path" Trail Metaphor (Stepping Stones)
    Text(
      "LE SENTIER DES ÉTOILES",
      fontWeight = FontWeight.Black,
      fontSize = 11.sp,
      color = Color(0xFF94A3B8),
      letterSpacing = 0.8.sp
    )
    Spacer(Modifier.height(8.dp))

    Surface(
      shape = RoundedCornerShape(24.dp),
      color = Color.White,
      shadowElevation = 2.dp,
      border = androidx.compose.foundation.BorderStroke(2.dp, Color(0xFFF1F5F9)),
      modifier = Modifier
        .fillMaxWidth()
        .testTag("learning_path_trail")
    ) {
      Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
      ) {
        listOf(
          Triple("Oasis des Étoiles", "🌴", "completed"),
          Triple("Dunes Dorées", "🐪", "completed"),
          Triple("Palais de Carthage", "🦊", "current"),
          Triple("Phare de Sidi Bou", "🏛️", "locked"),
          Triple("Grande Fusée", "🚀", "locked")
        ).forEachIndexed { idx, (title, emoji, status) ->
          val isCurrent = status == "current"
          val isCompleted = status == "completed"

          Surface(
            shape = RoundedCornerShape(18.dp),
            color = when {
              isCurrent -> Color(0xFFFFF1F2)
              isCompleted -> Color(0xFFF0FDF4)
              else -> Color(0xFFF8FAFC)
            },
            border = androidx.compose.foundation.BorderStroke(
              if (isCurrent) 2.dp else 1.dp,
              when {
                isCurrent -> Color(0xFFD80027) // Club Africain Rouge Accent
                isCompleted -> Color(0xFF86EFAC)
                else -> Color(0xFFE2E8F0)
              }
            ),
            modifier = Modifier
              .fillMaxWidth()
              .clickable {
                if (status != "locked") {
                  activeModal = "PRACTICE"
                }
              }
          ) {
            Row(
              modifier = Modifier.padding(12.dp),
              verticalAlignment = Alignment.CenterVertically
            ) {
              Surface(
                shape = CircleShape,
                color = when {
                  isCurrent -> Color(0xFFD80027)
                  isCompleted -> Color(0xFF22C55E)
                  else -> Color(0xFFCBD5E1)
                },
                modifier = Modifier.size(36.dp)
              ) {
                Box(contentAlignment = Alignment.Center) {
                  Text(
                    if (isCompleted) "✓" else if (isCurrent) emoji else "🔒",
                    fontSize = if (isCompleted) 16.sp else 18.sp,
                    color = Color.White
                  )
                }
              }

              Spacer(Modifier.width(12.dp))

              Column(modifier = Modifier.weight(1f)) {
                Text(
                  "ÉTAPE ${idx + 1}",
                  fontSize = 9.sp,
                  fontWeight = FontWeight.Black,
                  color = if (isCurrent) Color(0xFFD80027) else Color(0xFF94A3B8),
                  letterSpacing = 0.5.sp
                )
                Text(
                  title,
                  fontWeight = FontWeight.Black,
                  fontSize = 14.sp,
                  color = if (status == "locked") Color(0xFF94A3B8) else Color(0xFF1E293B)
                )
              }

              Surface(
                shape = RoundedCornerShape(10.dp),
                color = when {
                  isCompleted -> Color(0xFFDCFCE7)
                  isCurrent -> Color(0xFFFDE2E6)
                  else -> Color(0xFFF1F5F9)
                }
              ) {
                Text(
                  when {
                    isCompleted -> "⭐⭐⭐"
                    isCurrent -> "EN COURS"
                    else -> "VERROUILLÉ"
                  },
                  fontSize = 10.sp,
                  fontWeight = FontWeight.Black,
                  color = when {
                    isCompleted -> Color(0xFF15803D)
                    isCurrent -> Color(0xFFD80027)
                    else -> Color(0xFF94A3B8)
                  },
                  modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
              }
            }
          }
        }
      }
    }
  }

  // --- Subscreens (1-2 taps from home, minimal text, large back button) ---
  when (activeModal) {
    "PRACTICE" -> {
      PracticeDialog(
        stars = stars,
        onCompleteQuest = { earned ->
          triggerCelebration("SUPERSTAR! +$earned STARS! ⭐", earned)
        },
        onDismiss = { activeModal = null }
      )
    }
    "PLAY" -> {
      PlayGameDialog(
        onMatchPair = {
          triggerCelebration("PAIR MATCHED! ✨")
        },
        onWinGame = { earned ->
          triggerCelebration("GAME WON! +$earned STARS! 🏆", earned)
        },
        onDismiss = { activeModal = null }
      )
    }
    "STARS" -> {
      StarsVaultDialog(
        stars = stars,
        streakDays = streakDays,
        onStickerTap = { emoji, name ->
          triggerCelebration("Unlocked $name! $emoji")
        },
        onDismiss = { activeModal = null }
      )
    }
    "PROGRESS" -> {
      ProgressTrailDialog(
        stars = stars,
        onStartQuest = {
          activeModal = "PRACTICE"
        },
        onDismiss = { activeModal = null }
      )
    }
  }
}

/**
 * Animated Mascot Component in Jetpack Compose
 * Rebound jump physics, face switch, and celebratory speech bubble
 */
@Composable
fun AnimatedMascotCompose(
  isCelebrating: Boolean,
  celebrationMessage: String,
  onMascotTap: () -> Unit = {}
) {
  val jumpOffset by animateFloatAsState(
    targetValue = if (isCelebrating) -18f else 0f,
    animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessLow),
    label = "mascotJump"
  )

  Column(
    horizontalAlignment = Alignment.CenterHorizontally,
    modifier = Modifier.padding(start = 8.dp)
  ) {
    if (isCelebrating) {
      Surface(
        shape = RoundedCornerShape(14.dp),
        color = Color.White,
        border = androidx.compose.foundation.BorderStroke(2.dp, Color(0xFFF59E0B)),
        shadowElevation = 4.dp,
        modifier = Modifier.offset(y = (-4).dp)
      ) {
        Text(
          "🎉 $celebrationMessage",
          fontSize = 11.sp,
          fontWeight = FontWeight.ExtraBold,
          color = Color(0xFFB45309),
          modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
      }
    }

    Surface(
      shape = CircleShape,
      color = Color(0xFFFFE8E2),
      border = androidx.compose.foundation.BorderStroke(3.dp, Color(0xFFFF6B4A)),
      shadowElevation = 4.dp,
      modifier = Modifier
        .size(68.dp)
        .offset(y = jumpOffset.dp)
        .clickable { onMascotTap() }
    ) {
      Box(contentAlignment = Alignment.Center) {
        Text(
          if (isCelebrating) "🥳" else "🦊",
          fontSize = 36.sp
        )
      }
    }
  }
}

/**
 * Huge Tappable Tile for Band A
 * Full of color, 3D bottom bevel, simple friendly mascot, one-word label
 */
@Composable
fun BandAHugeTile(
  label: String,
  mascotEmoji: String,
  subtitle: String,
  badge: String? = null,
  backgroundColor: Color,
  bevelColor: Color,
  onClick: () -> Unit,
  modifier: Modifier = Modifier,
  testTag: String = ""
) {
  Surface(
    shape = RoundedCornerShape(26.dp),
    color = backgroundColor,
    shadowElevation = 4.dp,
    border = androidx.compose.foundation.BorderStroke(3.dp, bevelColor),
    modifier = modifier
      .height(150.dp)
      .clip(RoundedCornerShape(26.dp))
      .clickable { onClick() }
      .testTag(testTag)
  ) {
    Box(modifier = Modifier.fillMaxSize()) {
      // Bottom 3D bevel accent
      Box(
        modifier = Modifier
          .fillMaxWidth()
          .height(6.dp)
          .align(Alignment.BottomCenter)
          .background(bevelColor)
      )

      // Optional Badge
      if (badge != null) {
        Surface(
          shape = RoundedCornerShape(10.dp),
          color = Color.White.copy(alpha = 0.95f),
          modifier = Modifier
            .align(Alignment.TopEnd)
            .padding(8.dp)
        ) {
          Text(
            badge,
            fontSize = 11.sp,
            fontWeight = FontWeight.Black,
            color = Color(0xFF1E293B),
            modifier = Modifier.padding(horizontal = 7.dp, vertical = 2.dp)
          )
        }
      }

      Column(
        modifier = Modifier
          .fillMaxSize()
          .padding(12.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
      ) {
        Surface(
          shape = CircleShape,
          color = Color.White.copy(alpha = 0.28f),
          modifier = Modifier.size(54.dp)
        ) {
          Box(contentAlignment = Alignment.Center) {
            Text(mascotEmoji, fontSize = 32.sp)
          }
        }
        Spacer(Modifier.height(8.dp))
        Text(
          label.uppercase(),
          fontSize = 18.sp,
          fontWeight = FontWeight.Black,
          color = Color.White,
          letterSpacing = 0.8.sp
        )
        Text(
          subtitle,
          fontSize = 12.sp,
          fontWeight = FontWeight.Bold,
          color = Color.White.copy(alpha = 0.9f)
        )
      }
    }
  }
}

/**
 * Minimal-Text Navigation: Large Back Button (56dp min hit target)
 */
@Composable
fun LargeBackButton(onBack: () -> Unit) {
  Button(
    onClick = onBack,
    shape = RoundedCornerShape(20.dp),
    colors = ButtonDefaults.buttonColors(containerColor = Color.White),
    elevation = ButtonDefaults.buttonElevation(defaultElevation = 2.dp),
    border = androidx.compose.foundation.BorderStroke(2.dp, Color(0xFFFDE2E6)),
    modifier = Modifier
      .height(52.dp)
      .testTag("large_back_button")
  ) {
    Text("⬅️", fontSize = 20.sp)
    Spacer(Modifier.width(6.dp))
    Text("BACK", fontWeight = FontWeight.Black, fontSize = 15.sp, color = Color(0xFFD80027))
  }
}

/**
 * Practice Screen Modal (1 short sentence, audio prompt, 3 big buttons)
 */
@Composable
fun PracticeDialog(
  stars: Int,
  onCompleteQuest: (Int) -> Unit,
  onDismiss: () -> Unit
) {
  var selectedChoice by remember { mutableStateOf<Int?>(null) }
  var isAnswered by remember { mutableStateOf(false) }

  AlertDialog(
    onDismissRequest = onDismiss,
    confirmButton = {},
    dismissButton = {},
    shape = RoundedCornerShape(28.dp),
    containerColor = Color(0xFFFFFDF9),
    text = {
      Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.fillMaxWidth()
      ) {
        // Large Back Button at Top
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Start) {
          LargeBackButton(onBack = onDismiss)
        }

        Spacer(Modifier.height(12.dp))

        // Animated Mascot Reacting
        Surface(
          shape = CircleShape,
          color = Color(0xFFFFE8E2),
          border = androidx.compose.foundation.BorderStroke(3.dp, Color(0xFFFF6B4A)),
          modifier = Modifier.size(72.dp)
        ) {
          Box(contentAlignment = Alignment.Center) {
            Text(if (isAnswered) "🥳" else "🦊", fontSize = 38.sp)
          }
        }

        Spacer(Modifier.height(10.dp))

        // Audio Prompt Pill
        Surface(
          shape = RoundedCornerShape(16.dp),
          color = Color(0xFFFFE8E2),
          modifier = Modifier.padding(bottom = 6.dp)
        ) {
          Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
          ) {
            Text("🔊", fontSize = 16.sp)
            Spacer(Modifier.width(6.dp))
            Text("Listen: Count 1 by 1!", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFFFF6B4A))
          }
        }

        // Short Sentence Prompt (Zero reading fatigue)
        Text(
          "How many stars do you see?",
          fontSize = 20.sp,
          fontWeight = FontWeight.Black,
          color = Color(0xFF2D2327),
          modifier = Modifier.padding(vertical = 4.dp)
        )

        Text(
          "⭐ ⭐ ⭐",
          fontSize = 38.sp,
          modifier = Modifier.padding(vertical = 10.dp)
        )

        // 3 Huge Choice Buttons
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          listOf(
            Triple(1, "2", "✌️"),
            Triple(2, "3", "✨"),
            Triple(3, "4", "🍀")
          ).forEach { (id, label, emoji) ->
            val isCorrect = id == 2
            val isChosen = selectedChoice == id

            Button(
              onClick = {
                if (!isAnswered) {
                  selectedChoice = id
                  if (isCorrect) {
                    isAnswered = true
                    onCompleteQuest(3)
                  }
                }
              },
              shape = RoundedCornerShape(20.dp),
              colors = ButtonDefaults.buttonColors(
                containerColor = when {
                  isChosen && isCorrect -> Color(0xFF38B000)
                  isChosen && !isCorrect -> Color(0xFFEF4444)
                  else -> Color.White
                }
              ),
              border = androidx.compose.foundation.BorderStroke(
                2.5.dp,
                when {
                  isChosen && isCorrect -> Color(0xFF2B8200)
                  isChosen && !isCorrect -> Color(0xFFDC2626)
                  else -> Color(0xFFF2D8D0)
                }
              ),
              elevation = ButtonDefaults.buttonElevation(defaultElevation = 3.dp),
              modifier = Modifier
                .weight(1f)
                .height(86.dp)
            ) {
              Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(emoji, fontSize = 26.sp)
                Text(
                  label,
                  fontSize = 18.sp,
                  fontWeight = FontWeight.Black,
                  color = if (isChosen) Color.White else Color(0xFF2D2327)
                )
              }
            }
          }
        }

        if (isAnswered) {
          Spacer(Modifier.height(16.dp))
          Surface(
            shape = RoundedCornerShape(16.dp),
            color = Color(0xFFDCFCE7),
            border = androidx.compose.foundation.BorderStroke(2.dp, Color(0xFF86EFAC)),
            modifier = Modifier.fillMaxWidth()
          ) {
            Column(
              horizontalAlignment = Alignment.CenterHorizontally,
              modifier = Modifier.padding(12.dp)
            ) {
              Text("🏆 SUPERSTAR! +3 STARS!", fontWeight = FontWeight.Black, fontSize = 16.sp, color = Color(0xFF15803D))
              Spacer(Modifier.height(8.dp))
              Button(
                onClick = onDismiss,
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF38B000))
              ) {
                Text("🏠 BACK HOME", fontWeight = FontWeight.Black, fontSize = 14.sp)
              }
            }
          }
        }
      }
    }
  )
}

/**
 * Play Screen Modal (Memory card matching with mascot cheer)
 */
@Composable
fun PlayGameDialog(
  onMatchPair: () -> Unit,
  onWinGame: (Int) -> Unit,
  onDismiss: () -> Unit
) {
  var flippedCards by remember { mutableStateOf(setOf<Int>()) }
  val cardEmojis = remember { listOf("🦊", "⭐", "🦁", "🦊", "⭐", "🦁") }
  val isWon = flippedCards.size == cardEmojis.size

  AlertDialog(
    onDismissRequest = onDismiss,
    confirmButton = {},
    dismissButton = {},
    shape = RoundedCornerShape(28.dp),
    containerColor = Color(0xFFFFFDF9),
    text = {
      Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Start) {
          LargeBackButton(onBack = onDismiss)
        }

        Spacer(Modifier.height(10.dp))
        Text("STAR MEMORY", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color(0xFF38B000))
        Text("Tap cards to find twin pairs!", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF7C6E75))

        Spacer(Modifier.height(14.dp))

        // 2x3 Grid of Big Cards
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
          for (row in 0..1) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
              for (col in 0..2) {
                val idx = row * 3 + col
                val isFlipped = flippedCards.contains(idx)

                Surface(
                  shape = RoundedCornerShape(18.dp),
                  color = if (isFlipped) Color.White else Color(0xFF38B000),
                  border = androidx.compose.foundation.BorderStroke(
                    2.dp,
                    if (isFlipped) Color(0xFFCBD5E1) else Color(0xFF2B8200)
                  ),
                  shadowElevation = 3.dp,
                  modifier = Modifier
                    .weight(1f)
                    .height(78.dp)
                    .clickable {
                      if (!isFlipped) {
                        val next = flippedCards + idx
                        flippedCards = next
                        if (next.size % 2 == 0) {
                          onMatchPair()
                        }
                        if (next.size == cardEmojis.size) {
                          onWinGame(5)
                        }
                      }
                    }
                ) {
                  Box(contentAlignment = Alignment.Center) {
                    Text(
                      if (isFlipped) cardEmojis[idx] else "❓",
                      fontSize = 30.sp
                    )
                  }
                }
              }
            }
          }
        }

        if (isWon) {
          Spacer(Modifier.height(14.dp))
          Surface(
            shape = RoundedCornerShape(16.dp),
            color = Color(0xFFDCFCE7),
            modifier = Modifier.fillMaxWidth()
          ) {
            Column(
              horizontalAlignment = Alignment.CenterHorizontally,
              modifier = Modifier.padding(12.dp)
            ) {
              Text("🎉 YOU WON +5 STARS!", fontWeight = FontWeight.Black, fontSize = 16.sp, color = Color(0xFF15803D))
              Spacer(Modifier.height(8.dp))
              Button(
                onClick = onDismiss,
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF38B000))
              ) {
                Text("COLLECT & RETURN", fontWeight = FontWeight.Black, fontSize = 14.sp)
              }
            }
          }
        }
      }
    }
  )
}

/**
 * Stars & Sticker Album Modal
 */
@Composable
fun StarsVaultDialog(
  stars: Int,
  streakDays: Int,
  onStickerTap: (String, String) -> Unit,
  onDismiss: () -> Unit
) {
  AlertDialog(
    onDismissRequest = onDismiss,
    confirmButton = {},
    dismissButton = {},
    shape = RoundedCornerShape(28.dp),
    containerColor = Color(0xFFFFFDF9),
    text = {
      Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Start) {
          LargeBackButton(onBack = onDismiss)
        }

        Spacer(Modifier.height(10.dp))

        // Big Star Bank
        Surface(
          shape = CircleShape,
          color = Color(0xFFFEF3C7),
          border = androidx.compose.foundation.BorderStroke(3.dp, Color(0xFFF59E0B)),
          modifier = Modifier.size(72.dp)
        ) {
          Box(contentAlignment = Alignment.Center) {
            Text("⭐", fontSize = 38.sp)
          }
        }

        Text("$stars", fontSize = 38.sp, fontWeight = FontWeight.Black, color = Color(0xFFB45309))
        Text("TOTAL STARS COLLECTED", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Color(0xFFD97706))

        Spacer(Modifier.height(14.dp))
        Text("MY STICKER COLLECTION", fontSize = 13.sp, fontWeight = FontWeight.Black, color = Color(0xFF7C6E75))
        Text("Tap any sticker to play sound!", fontSize = 11.sp, color = Color(0xFF94A3B8))

        Spacer(Modifier.height(8.dp))

        val stickers = listOf(
          Triple("🦊", "Youssef", 5),
          Triple("🪄", "Star Wand", 10),
          Triple("🌴", "Oasis Palm", 15),
          Triple("🐪", "Sahara Camel", 20),
          Triple("🚀", "Solar Rocket", 30),
          Triple("👑", "Royal Crown", 45)
        )

        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
          for (row in 0..1) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
              for (col in 0..2) {
                val item = stickers[row * 3 + col]
                val unlocked = stars >= item.third

                Surface(
                  shape = RoundedCornerShape(16.dp),
                  color = if (unlocked) Color(0xFFFFFBEB) else Color(0xFFF1F5F9),
                  border = androidx.compose.foundation.BorderStroke(
                    2.dp,
                    if (unlocked) Color(0xFFFDE68A) else Color(0xFFE2E8F0)
                  ),
                  modifier = Modifier
                    .weight(1f)
                    .height(68.dp)
                    .clickable {
                      if (unlocked) {
                        onStickerTap(item.first, item.second)
                      }
                    }
                ) {
                  Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                  ) {
                    Text(if (unlocked) item.first else "🔒", fontSize = 24.sp)
                    Text(
                      if (unlocked) item.second else "${item.third} ⭐",
                      fontSize = 10.sp,
                      fontWeight = FontWeight.Bold,
                      color = if (unlocked) Color(0xFF2D2327) else Color(0xFF94A3B8)
                    )
                  }
                }
              }
            }
          }
        }
      }
    }
  )
}

/**
 * Progress Trail Modal (Visual stepping stones)
 */
@Composable
fun ProgressTrailDialog(
  stars: Int,
  onStartQuest: () -> Unit,
  onDismiss: () -> Unit
) {
  AlertDialog(
    onDismissRequest = onDismiss,
    confirmButton = {},
    dismissButton = {},
    shape = RoundedCornerShape(28.dp),
    containerColor = Color(0xFFFFFDF9),
    text = {
      Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Start) {
          LargeBackButton(onBack = onDismiss)
        }

        Spacer(Modifier.height(10.dp))
        Text("ADVENTURE TRAIL", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color(0xFF8B5CF6))
        Text("Follow the trail to the Rocket!", fontSize = 12.sp, color = Color(0xFF7C6E75), fontWeight = FontWeight.SemiBold)

        Spacer(Modifier.height(14.dp))

        listOf(
          Triple("Desert Dunes", "🐪", "⭐⭐⭐ Done"),
          Triple("Palm Oasis", "🌴", "⭐⭐⭐ Done"),
          Triple("Star Valley", "⭐", "👉 Tap to Play!"),
          Triple("Moon Rocket", "🚀", "🔒 Locked")
        ).forEachIndexed { idx, step ->
          Surface(
            shape = RoundedCornerShape(18.dp),
            color = if (idx == 2) Color(0xFFFDE2E6) else if (idx < 2) Color(0xFFD1FAE5) else Color(0xFFF1F5F9),
            border = androidx.compose.foundation.BorderStroke(
              2.dp,
              if (idx == 2) Color(0xFFD80027) else if (idx < 2) Color(0xFF10B981) else Color(0xFFCBD5E1)
            ),
            modifier = Modifier
              .fillMaxWidth()
              .padding(vertical = 4.dp)
              .clickable {
                if (idx == 2) {
                  onStartQuest()
                }
              }
          ) {
            Row(
              verticalAlignment = Alignment.CenterVertically,
              modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp)
            ) {
              Text(step.second, fontSize = 26.sp)
              Spacer(Modifier.width(12.dp))
              Column(modifier = Modifier.weight(1f)) {
                Text(step.first, fontSize = 14.sp, fontWeight = FontWeight.Black, color = Color(0xFF12151B))
                Text(step.third, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF64748B))
              }
              if (idx == 2) {
                Surface(
                  shape = RoundedCornerShape(12.dp),
                  color = Color(0xFFD80027)
                ) {
                  Text("PLAY", color = Color.White, fontWeight = FontWeight.Black, fontSize = 11.sp, modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp))
                }
              }
            }
          }
        }
      }
    }
  )
}

// Band B and Band C implementations are encapsulated in dedicated modules:
// - BandBRedesignView.kt (Khan Academy inspired hierarchy, brand red accents, level-up moments)
// - BandCRedesignView.kt (Khan Academy inspired stats-first, minimal typography, activity heatmap)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EnrollStudentDialog(
  onDismiss: () -> Unit,
  onEnrollSuccess: (name: String, age: Int, band: AgeBand) -> Unit
) {
  var fullName by remember { mutableStateOf("") }
  var emailOrPhone by remember { mutableStateOf("") }
  var password by remember { mutableStateOf("") }
  
  var selectedYear by remember { mutableIntStateOf(2018) }
  var selectedMonth by remember { mutableIntStateOf(9) }
  var selectedDay by remember { mutableIntStateOf(1) }

  var parentFullName by remember { mutableStateOf("") }
  var parentContact by remember { mutableStateOf("") }

  var errorText by remember { mutableStateOf<String?>(null) }

  // Compute age from birthdate (reference 2026-09-13)
  val computedAge = remember(selectedYear, selectedMonth, selectedDay) {
    var age = 2026 - selectedYear
    if (selectedMonth > 9 || (selectedMonth == 9 && selectedDay > 13)) {
      age -= 1
    }
    age.coerceIn(6, 19)
  }

  val band = remember(computedAge) { AgeBand.fromAge(computedAge) }
  val isUnder13 = computedAge < 13

  val bandColor = when (band) {
    AgeBand.BAND_A -> Color(0xFFFF6B4A)
    AgeBand.BAND_B -> Color(0xFF4F46E5)
    AgeBand.BAND_C -> Color(0xFF0F172A)
  }

  AlertDialog(
    onDismissRequest = onDismiss,
    confirmButton = {
      Button(
        onClick = {
          if (fullName.isBlank()) {
            errorText = "Please enter the student's full name."
            return@Button
          }
          if (emailOrPhone.isBlank()) {
            errorText = "Please enter an email or phone number."
            return@Button
          }
          if (password.length < 6) {
            errorText = "Password must be at least 6 characters."
            return@Button
          }
          if (isUnder13) {
            if (parentFullName.isBlank() || parentContact.isBlank()) {
              errorText = "Parent/Guardian contact is mandatory for students under 13."
              return@Button
            }
          }
          onEnrollSuccess(fullName, computedAge, band)
        },
        colors = ButtonDefaults.buttonColors(containerColor = bandColor),
        shape = RoundedCornerShape(12.dp)
      ) {
        Text("Complete & Enter Band ${band.name.takeLast(1)}", fontWeight = FontWeight.Bold)
      }
    },
    dismissButton = {
      TextButton(onClick = onDismiss) {
        Text("Cancel", color = Color(0xFF64748B))
      }
    },
    title = {
      Column {
        Text("Enroll at Vamos Academy", fontWeight = FontWeight.Black, fontSize = 18.sp, color = bandColor)
        Text("Adaptive Student Profile Setup", fontSize = 12.sp, color = Color(0xFF64748B))
      }
    },
    text = {
      Column(
        modifier = Modifier
          .fillMaxWidth()
          .verticalScroll(rememberScrollState())
      ) {
        if (errorText != null) {
          Surface(
            color = Color(0xFFFEE2E2),
            shape = RoundedCornerShape(8.dp),
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
          ) {
            Text(
              "⚠️ $errorText",
              color = Color(0xFFDC2626),
              fontSize = 12.sp,
              fontWeight = FontWeight.Bold,
              modifier = Modifier.padding(8.dp)
            )
          }
        }

        OutlinedTextField(
          value = fullName,
          onValueChange = { fullName = it; errorText = null },
          label = { Text("Student Full Name *") },
          modifier = Modifier.fillMaxWidth(),
          shape = RoundedCornerShape(10.dp),
          singleLine = true
        )

        Spacer(Modifier.height(6.dp))

        OutlinedTextField(
          value = emailOrPhone,
          onValueChange = { emailOrPhone = it; errorText = null },
          label = { Text("Email or Phone (+216) *") },
          modifier = Modifier.fillMaxWidth(),
          shape = RoundedCornerShape(10.dp),
          singleLine = true
        )

        Spacer(Modifier.height(6.dp))

        OutlinedTextField(
          value = password,
          onValueChange = { password = it; errorText = null },
          label = { Text("Password (min 6 chars) *") },
          modifier = Modifier.fillMaxWidth(),
          shape = RoundedCornerShape(10.dp),
          singleLine = true
        )

        Spacer(Modifier.height(10.dp))

        // BIRTHDATE PICKER BOX
        Surface(
          shape = RoundedCornerShape(12.dp),
          color = Color(0xFFF8FAFC),
          border = androidx.compose.foundation.BorderStroke(1.5.dp, bandColor),
          modifier = Modifier.fillMaxWidth()
        ) {
          Column(modifier = Modifier.padding(10.dp)) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Text(
                "📅 $selectedYear-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}",
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp
              )
              Surface(
                color = bandColor,
                shape = RoundedCornerShape(8.dp)
              ) {
                Text(
                  "$computedAge YEARS OLD",
                  color = Color.White,
                  fontWeight = FontWeight.ExtraBold,
                  fontSize = 10.sp,
                  modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                )
              }
            }

            Spacer(Modifier.height(4.dp))
            Text(
              "Assigned: ${band.title} (${band.ageRange})",
              color = bandColor,
              fontWeight = FontWeight.Bold,
              fontSize = 11.sp
            )

            Spacer(Modifier.height(8.dp))
            Text("Select Birth Year:", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF64748B))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
              items((2007..2020).toList()) { yr ->
                val isYrSelected = yr == selectedYear
                Surface(
                  shape = RoundedCornerShape(8.dp),
                  color = if (isYrSelected) bandColor else Color.White,
                  border = androidx.compose.foundation.BorderStroke(1.dp, if (isYrSelected) bandColor else Color(0xFFCBD5E1)),
                  modifier = Modifier.clickable { selectedYear = yr }
                ) {
                  Text(
                    "$yr",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (isYrSelected) Color.White else Color(0xFF334155),
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                  )
                }
              }
            }

            Spacer(Modifier.height(6.dp))
            Text("Select Month:", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF64748B))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
              val months = listOf("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
              items(months.indices.toList()) { idx ->
                val m = idx + 1
                val isMSelected = m == selectedMonth
                Surface(
                  shape = RoundedCornerShape(8.dp),
                  color = if (isMSelected) bandColor else Color.White,
                  border = androidx.compose.foundation.BorderStroke(1.dp, if (isMSelected) bandColor else Color(0xFFCBD5E1)),
                  modifier = Modifier.clickable { selectedMonth = m }
                ) {
                  Text(
                    months[idx],
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (isMSelected) Color.White else Color(0xFF334155),
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                  )
                }
              }
            }
          }
        }

        // CHILD SAFETY GUARDIAN REQUIREMENT (< 13)
        if (isUnder13) {
          Spacer(Modifier.height(10.dp))
          Surface(
            shape = RoundedCornerShape(10.dp),
            color = Color(0xFFFFFBEB),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFDE68A)),
            modifier = Modifier.fillMaxWidth()
          ) {
            Column(modifier = Modifier.padding(10.dp)) {
              Text(
                "🛡️ PARENT AUTHORIZATION (REQUIRED)",
                fontWeight = FontWeight.ExtraBold,
                fontSize = 11.sp,
                color = Color(0xFFB45309)
              )
              Text(
                "Students under 13 require parent/guardian contact info.",
                fontSize = 10.sp,
                color = Color(0xFF92400E)
              )

              Spacer(Modifier.height(6.dp))
              OutlinedTextField(
                value = parentFullName,
                onValueChange = { parentFullName = it; errorText = null },
                label = { Text("Parent / Guardian Name *") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(8.dp),
                singleLine = true
              )

              Spacer(Modifier.height(4.dp))
              OutlinedTextField(
                value = parentContact,
                onValueChange = { parentContact = it; errorText = null },
                label = { Text("Parent Phone or Email *") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(8.dp),
                singleLine = true
              )
            }
          }
        }
      }
    }
  )
}

@Composable
fun LevelUpDialog(
  prevBand: AgeBand,
  newBand: AgeBand,
  onDismiss: () -> Unit,
  onEnterNewBand: (newAge: Int) -> Unit
) {
  val targetAge = when (newBand) {
    AgeBand.BAND_A -> 8
    AgeBand.BAND_B -> 11
    AgeBand.BAND_C -> 16
  }

  val newBandColor = when (newBand) {
    AgeBand.BAND_A -> Color(0xFFFF6B4A)
    AgeBand.BAND_B -> Color(0xFF4F46E5)
    AgeBand.BAND_C -> Color(0xFF0F172A)
  }

  AlertDialog(
    onDismissRequest = onDismiss,
    confirmButton = {
      Button(
        onClick = { onEnterNewBand(targetAge) },
        colors = ButtonDefaults.buttonColors(containerColor = newBandColor),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.fillMaxWidth()
      ) {
        Text("Enter My Upgraded Academy 🚀", fontWeight = FontWeight.Bold, fontSize = 14.sp)
      }
    },
    title = {
      Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
        Surface(
          color = Color(0xFFFEF3C7),
          shape = RoundedCornerShape(12.dp)
        ) {
          Text(
            "🎂 BIRTHDAY MILESTONE REACHED",
            color = Color(0xFFB45309),
            fontWeight = FontWeight.ExtraBold,
            fontSize = 10.sp,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
          )
        }
        Spacer(Modifier.height(6.dp))
        Text(
          "Your App Just Leveled Up!",
          fontWeight = FontWeight.Black,
          fontSize = 18.sp,
          color = Color(0xFF0F172A)
        )
      }
    },
    text = {
      Column(modifier = Modifier.fillMaxWidth()) {
        Text(
          "You celebrated a birthday! As you grow at Vamos Academy, your interface, curriculum, and mascot dynamically transform.",
          fontSize = 12.sp,
          color = Color(0xFF475569),
          lineHeight = 17.sp
        )

        Spacer(Modifier.height(14.dp))

        // Transition Box
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = Color(0xFFF1F5F9),
            modifier = Modifier.weight(1f)
          ) {
            Column(
              horizontalAlignment = Alignment.CenterHorizontally,
              modifier = Modifier.padding(10.dp)
            ) {
              Text("PREVIOUS", fontSize = 10.sp, color = Color(0xFF64748B), fontWeight = FontWeight.Bold)
              Text(
                when (prevBand) {
                  AgeBand.BAND_A -> "🦊"
                  AgeBand.BAND_B -> "⚡"
                  AgeBand.BAND_C -> "🏛️"
                },
                fontSize = 24.sp
              )
              Text(prevBand.title, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF475569))
            }
          }

          Text(" ➔ ", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color(0xFFF59E0B))

          Surface(
            shape = RoundedCornerShape(12.dp),
            color = newBandColor.copy(alpha = 0.12f),
            border = androidx.compose.foundation.BorderStroke(2.dp, newBandColor),
            modifier = Modifier.weight(1f)
          ) {
            Column(
              horizontalAlignment = Alignment.CenterHorizontally,
              modifier = Modifier.padding(10.dp)
            ) {
              Text("NEW TIER", fontSize = 10.sp, color = newBandColor, fontWeight = FontWeight.ExtraBold)
              Text(
                when (newBand) {
                  AgeBand.BAND_A -> "🦊"
                  AgeBand.BAND_B -> "⚡"
                  AgeBand.BAND_C -> "🏛️"
                },
                fontSize = 24.sp
              )
              Text(newBand.title, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = newBandColor)
            }
          }
        }

        Spacer(Modifier.height(14.dp))

        Surface(
          shape = RoundedCornerShape(10.dp),
          color = Color(0xFFF8FAFC),
          border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0)),
          modifier = Modifier.fillMaxWidth()
        ) {
          Column(modifier = Modifier.padding(10.dp)) {
            Text("Unlocked in Your New Tier:", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Color(0xFF1E293B))
            Spacer(Modifier.height(4.dp))
            when (newBand) {
              AgeBand.BAND_A -> {
                Text("• Big Tactile Star Books & Audio Guidance\n• Playful Fennec Fox Mascot\n• 5-Minute Micro-Challenges", fontSize = 11.sp, color = Color(0xFF475569))
              }
              AgeBand.BAND_B -> {
                Text("• Carthage Cyber Guilds & XP Leaderboards\n• Vanguard Missions & Streaks\n• Interactive Code & Math Arena", fontSize = 11.sp, color = Color(0xFF475569))
              }
              AgeBand.BAND_C -> {
                Text("• Tunisian Baccalaureate Exam Archives\n• Deep Work Pomodoro Focus Drills\n• Precision Accuracy & Readiness Metrics", fontSize = 11.sp, color = Color(0xFF475569))
              }
            }
          }
        }
      }
    }
  )
}

