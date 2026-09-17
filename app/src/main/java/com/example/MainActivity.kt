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

@Composable
fun BandBView(primary: Color, secondary: Color) {
  var activeTab by remember { mutableStateOf("home") } // "home", "practice", "games", "leaderboard", "profile"
  var xp by remember { mutableIntStateOf(1240) }
  var currentLevel by remember { mutableIntStateOf(4) }
  val streakDays = 5
  var alertMessage by remember { mutableStateOf<String?>(null) }
  var scopeLeaderboard by remember { mutableStateOf("class") } // "class" or "age"

  fun addXpPoints(points: Int, msg: String) {
    xp += points
    val newLevel = (xp / 300) + 1
    if (newLevel > currentLevel) {
      currentLevel = newLevel
      alertMessage = "🎉 PROMOTED! You reached Vanguard Level $currentLevel!"
    } else {
      alertMessage = msg
    }
  }

  Column {
    // Action Toast Banner
    if (alertMessage != null) {
      Surface(
        shape = RoundedCornerShape(12.dp),
        color = Color(0xFF0F172A),
        modifier = Modifier
          .fillMaxWidth()
          .padding(bottom = 10.dp)
      ) {
        Row(
          modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text("⚡", fontSize = 18.sp)
          Spacer(Modifier.width(8.dp))
          Text(
            alertMessage!!,
            color = Color(0xFF38BDF8),
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.weight(1f)
          )
        }
      }
    }

    // --- TAB CONTENT ---
    when (activeTab) {
      "home" -> {
        // 1. Visible Progress/Level System: Avatar that levels up
        Surface(
          shape = RoundedCornerShape(16.dp),
          color = Color.White,
          shadowElevation = 2.dp,
          border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFFE2E8F0)),
          modifier = Modifier
            .fillMaxWidth()
            .clickable { addXpPoints(60, "🚀 Mission Drills completed! +60 XP") }
            .testTag("level_avatar_card")
        ) {
          Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Box(
              modifier = Modifier
                .size(62.dp)
                .clip(CircleShape)
                .background(Color(0xFFEEF2FF))
                .border(2.5.dp, primary, CircleShape),
              contentAlignment = Alignment.Center
            ) {
              Text(if (currentLevel >= 5) "🦅" else "⚡", fontSize = 32.sp)
              Surface(
                shape = RoundedCornerShape(10.dp),
                color = primary,
                border = androidx.compose.foundation.BorderStroke(1.5.dp, Color.White),
                modifier = Modifier.align(Alignment.BottomCenter).offset(y = 4.dp)
              ) {
                Text(
                  "LVL $currentLevel",
                  fontSize = 9.sp,
                  fontWeight = FontWeight.Black,
                  color = Color.White,
                  modifier = Modifier.padding(horizontal = 6.dp, vertical = 1.dp)
                )
              }
            }

            Spacer(Modifier.width(14.dp))

            Column(modifier = Modifier.weight(1f)) {
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
              ) {
                Text(
                  if (currentLevel >= 5) "CYBER COMMANDER" else "VANGUARD SPECIALIST",
                  fontWeight = FontWeight.ExtraBold,
                  fontSize = 13.sp,
                  color = Color(0xFF0F172A),
                  letterSpacing = 0.5.sp
                )
                Surface(
                  shape = RoundedCornerShape(6.dp),
                  color = Color(0xFFFEF3C7),
                  border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFDE68A))
                ) {
                  Text(
                    "TIER ${((currentLevel + 1) / 2)}",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color(0xFFB45309),
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                  )
                }
              }

              val nextLvlXp = currentLevel * 300
              val curBase = (currentLevel - 1) * 300
              val prog = ((xp - curBase).toFloat() / 300f).coerceIn(0f, 1f)
              val toNext = maxOf(0, nextLvlXp - xp)

              Spacer(Modifier.height(4.dp))
              Text(
                "$xp XP • $toNext XP to Level ${currentLevel + 1}",
                fontSize = 11.sp,
                color = Color(0xFF64748B)
              )
              Spacer(Modifier.height(6.dp))
              LinearProgressIndicator(
                progress = { prog },
                color = primary,
                trackColor = Color(0xFFF1F5F9),
                modifier = Modifier
                  .fillMaxWidth()
                  .height(8.dp)
                  .clip(RoundedCornerShape(4.dp))
              )
            }
          }
        }

        Spacer(Modifier.height(10.dp))

        // 2. Structured Streak Counter with Weekly Day Indicators
        Surface(
          shape = RoundedCornerShape(16.dp),
          color = Color.White,
          shadowElevation = 2.dp,
          border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFFE2E8F0)),
          modifier = Modifier.fillMaxWidth()
        ) {
          Column(modifier = Modifier.padding(14.dp)) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Text("🔥", fontSize = 26.sp)
                Spacer(Modifier.width(8.dp))
                Column {
                  Text(
                    "$streakDays-DAY STREAK",
                    fontWeight = FontWeight.Black,
                    fontSize = 14.sp,
                    color = Color(0xFFDC2626)
                  )
                  Text(
                    "+20 XP multiplier active today",
                    fontSize = 11.sp,
                    color = Color(0xFF64748B),
                    fontWeight = FontWeight.SemiBold
                  )
                }
              }
              Surface(
                shape = RoundedCornerShape(8.dp),
                color = Color(0xFFFEF2F2),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFECACA))
              ) {
                Text(
                  "1.5X XP",
                  fontSize = 11.sp,
                  fontWeight = FontWeight.Black,
                  color = Color(0xFFDC2626),
                  modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
              }
            }

            Spacer(Modifier.height(10.dp))

            // 7-day row
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              listOf("M" to true, "T" to true, "W" to true, "T" to true, "F" to true, "S" to false, "S" to false)
                .forEach { (d, done) ->
                  Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(
                      modifier = Modifier
                        .size(28.dp)
                        .clip(CircleShape)
                        .background(if (done) Color(0xFFDC2626) else Color(0xFFF1F5F9))
                        .border(1.dp, if (done) Color(0xFFB91C1C) else Color(0xFFCBD5E1), CircleShape),
                      contentAlignment = Alignment.Center
                    ) {
                      Text(
                        if (done) "✓" else "•",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Black,
                        color = if (done) Color.White else Color(0xFF94A3B8)
                      )
                    }
                    Spacer(Modifier.height(3.dp))
                    Text(
                      d,
                      fontSize = 10.sp,
                      fontWeight = FontWeight.Bold,
                      color = if (done) Color(0xFF0F172A) else Color(0xFF94A3B8)
                    )
                  }
                }
            }
          }
        }

        Spacer(Modifier.height(10.dp))

        // 3. "Continue Where You Left Off" Card
        Surface(
          shape = RoundedCornerShape(16.dp),
          color = Color.White,
          shadowElevation = 2.dp,
          border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFFE2E8F0)),
          modifier = Modifier.fillMaxWidth().testTag("continue_card")
        ) {
          Column(modifier = Modifier.padding(16.dp)) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Surface(
                shape = RoundedCornerShape(6.dp),
                color = Color(0xFFEEF2FF)
              ) {
                Text(
                  "⚡ CONTINUE LEARNING",
                  fontSize = 10.sp,
                  fontWeight = FontWeight.Black,
                  color = primary,
                  letterSpacing = 0.4.sp,
                  modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                )
              }
              Text("⏱️ 6 min left", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF64748B))
            }

            Spacer(Modifier.height(8.dp))
            Text(
              "Quadratic Balance & Planetary Trajectory",
              fontSize = 16.sp,
              fontWeight = FontWeight.ExtraBold,
              color = Color(0xFF0F172A)
            )
            Text(
              "Math & Orbital Physics • Mission 3 of 5 • Step 4: Parabolic Apex",
              fontSize = 12.sp,
              color = Color(0xFF64748B)
            )

            Spacer(Modifier.height(10.dp))
            Row(
              verticalAlignment = Alignment.CenterVertically,
              modifier = Modifier.fillMaxWidth()
            ) {
              LinearProgressIndicator(
                progress = { 0.68f },
                color = Color(0xFF06B6D4),
                trackColor = Color(0xFFF1F5F9),
                modifier = Modifier
                  .weight(1f)
                  .height(8.dp)
                  .clip(RoundedCornerShape(4.dp))
              )
              Spacer(Modifier.width(10.dp))
              Text("68%", fontSize = 12.sp, fontWeight = FontWeight.Black, color = Color(0xFF06B6D4))
            }

            Spacer(Modifier.height(12.dp))
            Button(
              onClick = { addXpPoints(45, "⚡ Mission Resumed! +45 XP earned") },
              shape = RoundedCornerShape(12.dp),
              colors = ButtonDefaults.buttonColors(containerColor = primary),
              modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .testTag("resume_mission_button")
            ) {
              Text("RESUME MISSION ➔", fontWeight = FontWeight.Black, fontSize = 14.sp)
            }
          }
        }

        Spacer(Modifier.height(14.dp))

        // 4. Clear Section: Practice
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text(
            "TODAY'S MISSIONS",
            fontSize = 12.sp,
            fontWeight = FontWeight.Black,
            color = Color(0xFF64748B),
            letterSpacing = 0.8.sp
          )
          Text(
            "View Arena ➔",
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = primary,
            modifier = Modifier.clickable { activeTab = "practice" }
          )
        }

        Spacer(Modifier.height(6.dp))

        VanguardMissionCard(
          title = "Algebraic Fuel Balancer: Systems of Equations",
          category = "Math & Logic",
          xp = 75,
          progress = 0.65f,
          primary = primary
        )

        Spacer(Modifier.height(14.dp))

        // 5. Clear Section: Lightweight Scoped Class Leaderboard
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text(
            "SCOPED LEADERBOARD",
            fontSize = 12.sp,
            fontWeight = FontWeight.Black,
            color = Color(0xFF64748B),
            letterSpacing = 0.8.sp
          )
          Text(
            "Full Ranks ➔",
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = primary,
            modifier = Modifier.clickable { activeTab = "leaderboard" }
          )
        }

        Spacer(Modifier.height(6.dp))

        // Embedded Scoped Class Leaderboard Card
        Surface(
          shape = RoundedCornerShape(16.dp),
          color = Color.White,
          shadowElevation = 2.dp,
          border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFFE2E8F0)),
          modifier = Modifier.fillMaxWidth()
        ) {
          Column(modifier = Modifier.padding(14.dp)) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Column {
                Text(
                  if (scopeLeaderboard == "class") "Class 7-B • Sousse Middle School" else "Ages 10–13 • Tunisia Central",
                  fontWeight = FontWeight.ExtraBold,
                  fontSize = 13.sp,
                  color = Color(0xFF0F172A)
                )
                Text(
                  "Gold Division • 24 students enrolled",
                  fontSize = 11.sp,
                  color = Color(0xFF64748B)
                )
              }

              // Scope toggle pills
              Surface(
                shape = RoundedCornerShape(8.dp),
                color = Color(0xFFF1F5F9)
              ) {
                Row(modifier = Modifier.padding(2.dp)) {
                  Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = if (scopeLeaderboard == "class") Color.White else Color.Transparent,
                    modifier = Modifier.clickable { scopeLeaderboard = "class" }
                  ) {
                    Text(
                      "7-B",
                      fontSize = 10.sp,
                      fontWeight = FontWeight.ExtraBold,
                      color = if (scopeLeaderboard == "class") primary else Color(0xFF64748B),
                      modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                  }
                  Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = if (scopeLeaderboard == "age") Color.White else Color.Transparent,
                    modifier = Modifier.clickable { scopeLeaderboard = "age" }
                  ) {
                    Text(
                      "Ages 10–13",
                      fontSize = 10.sp,
                      fontWeight = FontWeight.ExtraBold,
                      color = if (scopeLeaderboard == "age") primary else Color(0xFF64748B),
                      modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                  }
                }
              }
            }

            Spacer(Modifier.height(10.dp))

            // Leaderboard Entries
            val entries = if (scopeLeaderboard == "class") {
              listOf(
                Triple("🥇 #1", "Yassine Khedira", "1,420 XP"),
                Triple("🥈 #2", "Amina Bouazizi", "1,380 XP"),
                Triple("🥉 #3", "Ryan Trabelsi", "1,290 XP"),
                Triple("⚡ #4", "You (Bassem)", "$xp XP")
              )
            } else {
              listOf(
                Triple("🥇 #1", "Leila S. (Tunis)", "1,890 XP"),
                Triple("🥈 #2", "Mehdi A. (Sfax)", "1,740 XP"),
                Triple("🥉 #3", "Yassine K. (Sousse)", "1,420 XP"),
                Triple("⚡ #7", "You (Bassem)", "$xp XP")
              )
            }

            entries.forEach { (rank, name, score) ->
              val isUser = name.contains("You")
              Surface(
                shape = RoundedCornerShape(10.dp),
                color = if (isUser) Color(0xFFEEF2FF) else Color(0xFFF8FAFC),
                border = if (isUser) androidx.compose.foundation.BorderStroke(1.5.dp, primary) else null,
                modifier = Modifier
                  .fillMaxWidth()
                  .padding(vertical = 3.dp)
              ) {
                Row(
                  modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                  verticalAlignment = Alignment.CenterVertically
                ) {
                  Text(rank, fontSize = 12.sp, fontWeight = FontWeight.Black, color = if (isUser) primary else Color(0xFF64748B))
                  Spacer(Modifier.width(10.dp))
                  Text(name, fontSize = 13.sp, fontWeight = if (isUser) FontWeight.ExtraBold else FontWeight.Bold, color = Color(0xFF1E293B), modifier = Modifier.weight(1f))
                  Text(score, fontSize = 12.sp, fontWeight = FontWeight.Black, color = if (isUser) primary else Color(0xFF0F172A))
                }
              }
            }
          }
        }
      }

      "practice" -> {
        Text("🎯 PRACTICE ARENA", fontWeight = FontWeight.Black, fontSize = 18.sp, color = Color(0xFF0F172A))
        Text("Structured skill tracks for ages 10–13", fontSize = 12.sp, color = Color(0xFF64748B))
        Spacer(Modifier.height(10.dp))

        VanguardMissionCard("Algebraic Fuel Balancer: Systems of Equations", "Math & Logic", 75, 0.65f, primary)
        VanguardMissionCard("Mediterranean Marine Ecosystems 3D", "Science Lab", 60, 0.25f, primary)
        VanguardMissionCard("Speed Vocabulary: Tech & Robotics", "Languages", 50, 0.90f, primary)
        VanguardMissionCard("Logic Circuits & Python Loops", "Coding", 80, 0.10f, primary)
      }

      "games" -> {
        Text("🎮 VANGUARD GAMES ARENA", fontWeight = FontWeight.Black, fontSize = 18.sp, color = Color(0xFF0F172A))
        Text("Speed challenges, math duels, and memory arenas", fontSize = 12.sp, color = Color(0xFF64748B))
        Spacer(Modifier.height(12.dp))

        listOf(
          Triple("Equation Dash", "Solve algebra equations before the timer runs out! ⚡", 50),
          Triple("Vocabulary Blitz", "English & French rapid synonym matching battle 📖", 45),
          Triple("Cyber Defense Duel", "Co-op logic defense against buggy algorithms 🛡️", 60)
        ).forEach { (game, desc, points) ->
          Surface(
            shape = RoundedCornerShape(14.dp),
            color = Color.White,
            border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFFE2E8F0)),
            modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
          ) {
            Column(modifier = Modifier.padding(14.dp)) {
              Text(game, fontWeight = FontWeight.ExtraBold, fontSize = 15.sp, color = Color(0xFF0F172A))
              Text(desc, fontSize = 12.sp, color = Color(0xFF64748B), modifier = Modifier.padding(vertical = 4.dp))
              Button(
                onClick = { addXpPoints(points, "🎮 Won $game! +$points XP added!") },
                shape = RoundedCornerShape(10.dp),
                colors = ButtonDefaults.buttonColors(containerColor = primary),
                modifier = Modifier.fillMaxWidth().height(42.dp)
              ) {
                Text("PLAY MATCH (+$points XP)", fontWeight = FontWeight.Black, fontSize = 12.sp)
              }
            }
          }
        }
      }

      "leaderboard" -> {
        Text("🏆 CLASS & LEAGUE STANDINGS", fontWeight = FontWeight.Black, fontSize = 18.sp, color = Color(0xFF0F172A))
        Text("Scoped to your class (7-B) and age group (10–13)", fontSize = 12.sp, color = Color(0xFF64748B))
        Spacer(Modifier.height(12.dp))

        Surface(
          shape = RoundedCornerShape(16.dp),
          color = Color.White,
          border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFFE2E8F0)),
          modifier = Modifier.fillMaxWidth()
        ) {
          Column(modifier = Modifier.padding(16.dp)) {
            Text("TUNISIA CENTRAL • GOLD LEAGUE", fontWeight = FontWeight.Black, fontSize = 13.sp, color = Color(0xFFB45309))
            Text("Top 5 promote to Diamond League in 2 days", fontSize = 11.sp, color = Color(0xFF78350F))
            Spacer(Modifier.height(10.dp))

            listOf(
              Triple("🥇 #1", "Yassine Khedira", "1,420 XP"),
              Triple("🥈 #2", "Amina Bouazizi", "1,380 XP"),
              Triple("🥉 #3", "Ryan Trabelsi", "1,290 XP"),
              Triple("⚡ #4", "You (Bassem)", "$xp XP"),
              Triple("5", "Nour Marzouki", "1,180 XP"),
              Triple("6", "Firas Jlassi", "1,090 XP")
            ).forEach { (r, n, s) ->
              val isUser = n.contains("You")
              Row(
                modifier = Modifier
                  .fillMaxWidth()
                  .padding(vertical = 6.dp)
                  .background(if (isUser) Color(0xFFEEF2FF) else Color.Transparent, RoundedCornerShape(8.dp))
                  .padding(horizontal = 8.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically
              ) {
                Text(r, fontWeight = FontWeight.Black, fontSize = 13.sp, color = if (isUser) primary else Color(0xFF64748B))
                Spacer(Modifier.width(10.dp))
                Text(n, fontWeight = if (isUser) FontWeight.Black else FontWeight.Bold, fontSize = 13.sp, color = Color(0xFF0F172A), modifier = Modifier.weight(1f))
                Text(s, fontWeight = FontWeight.Black, fontSize = 13.sp, color = if (isUser) primary else Color(0xFF64748B))
              }
            }
          }
        }
      }

      "profile" -> {
        Text("👤 CADET PROFILE", fontWeight = FontWeight.Black, fontSize = 18.sp, color = Color(0xFF0F172A))
        Text("Avatar customization, rank titles & badges", fontSize = 12.sp, color = Color(0xFF64748B))
        Spacer(Modifier.height(12.dp))

        Surface(
          shape = RoundedCornerShape(16.dp),
          color = Color.White,
          border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFFE2E8F0)),
          modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp)
        ) {
          Column(modifier = Modifier.padding(18.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
              modifier = Modifier
                .size(76.dp)
                .clip(CircleShape)
                .background(Color(0xFFEEF2FF))
                .border(3.dp, primary, CircleShape),
              contentAlignment = Alignment.Center
            ) {
              Text(if (currentLevel >= 5) "🦅" else "⚡", fontSize = 40.sp)
            }
            Spacer(Modifier.height(8.dp))
            Text("Cadet Bassem", fontWeight = FontWeight.Black, fontSize = 18.sp, color = Color(0xFF0F172A))
            Text(
              if (currentLevel >= 5) "CYBER COMMANDER • LEVEL $currentLevel" else "VANGUARD SPECIALIST • LEVEL $currentLevel",
              fontWeight = FontWeight.Bold,
              fontSize = 12.sp,
              color = primary
            )
            Text("Class 7-B • Sousse Academy Branch", fontSize = 12.sp, color = Color(0xFF64748B))
          }
        }

        // Unlocked Badges
        Text("UNLOCKED BADGES", fontSize = 12.sp, fontWeight = FontWeight.Black, color = Color(0xFF64748B))
        Spacer(Modifier.height(6.dp))
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween
        ) {
          listOf("⚡ Fast Solver", "🔥 5-Day Flame", "🛡️ Guild Guard", "🔭 Star Nav").forEach { badge ->
            Surface(
              shape = RoundedCornerShape(10.dp),
              color = Color(0xFFFEF3C7),
              border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFDE68A)),
              modifier = Modifier.weight(1f).padding(horizontal = 2.dp)
            ) {
              Text(
                badge,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFB45309),
                modifier = Modifier.padding(horizontal = 4.dp, vertical = 6.dp)
              )
            }
          }
        }
      }
    }

    Spacer(Modifier.height(18.dp))

    // --- BOTTOM TAB NAVIGATION (Home, Practice, Games, Leaderboard, Profile) ---
    Surface(
      shape = RoundedCornerShape(16.dp),
      color = Color.White,
      shadowElevation = 4.dp,
      border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFFE2E8F0)),
      modifier = Modifier.fillMaxWidth()
    ) {
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .padding(vertical = 8.dp, horizontal = 4.dp),
        horizontalArrangement = Arrangement.SpaceAround
      ) {
        listOf(
          Triple("home", "Home", "🏠"),
          Triple("practice", "Practice", "🎯"),
          Triple("games", "Games", "🎮"),
          Triple("leaderboard", "Ranks", "🏆"),
          Triple("profile", "Profile", "👤")
        ).forEach { (tabId, label, icon) ->
          val isSelected = activeTab == tabId
          Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
              .clickable { activeTab = tabId }
              .padding(horizontal = 8.dp, vertical = 4.dp)
              .testTag("tab_$tabId")
          ) {
            Surface(
              shape = RoundedCornerShape(12.dp),
              color = if (isSelected) Color(0xFFEEF2FF) else Color.Transparent,
              modifier = Modifier.padding(bottom = 2.dp)
            ) {
              Text(
                icon,
                fontSize = 20.sp,
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 2.dp)
              )
            }
            Text(
              label,
              fontSize = 10.sp,
              fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold,
              color = if (isSelected) primary else Color(0xFF64748B)
            )
          }
        }
      }
    }
  }
}

@Composable
fun VanguardMissionCard(title: String, category: String, xp: Int, progress: Float, primary: Color) {
  Surface(
    shape = RoundedCornerShape(16.dp),
    color = Color.White,
    shadowElevation = 2.dp,
    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0)),
    modifier = Modifier
      .fillMaxWidth()
      .padding(vertical = 5.dp)
  ) {
    Column(modifier = Modifier.padding(14.dp)) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
      ) {
        Surface(color = Color(0xFFEEF2FF), shape = RoundedCornerShape(6.dp)) {
          Text(
            category.uppercase(),
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = primary,
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
          )
        }
        Text("+$xp XP", fontSize = 12.sp, fontWeight = FontWeight.Black, color = Color(0xFFD97706))
      }
      Spacer(Modifier.height(8.dp))
      Text(title, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color(0xFF0F172A))
      Spacer(Modifier.height(8.dp))
      LinearProgressIndicator(
        progress = { progress },
        color = Color(0xFF06B6D4),
        trackColor = Color(0xFFE2E8F0),
        modifier = Modifier
          .fillMaxWidth()
          .height(6.dp)
          .clip(RoundedCornerShape(3.dp))
      )
    }
  }
}

data class ScholarExerciseItem(
  val id: String,
  val title: String,
  val subject: String,
  val durationMinutes: Int,
  val priority: String,
  val progress: Float
)

@Composable
fun BandCView(primary: Color, secondary: Color) {
  var activeTab by remember { mutableStateOf("home") }
  var themeMode by remember { mutableStateOf("system") }
  val isSystemDark = isSystemInDarkTheme()
  val isDark = when (themeMode) {
    "system" -> isSystemDark
    "dark" -> true
    else -> false
  }

  var showFocusDialog by remember { mutableStateOf(false) }
  var focusExerciseTitle by remember { mutableStateOf("Differential Equations & Exponential Systems") }
  var focusExerciseSubject by remember { mutableStateOf("Mathématiques (Baccalaureate)") }
  var focusMinutes by remember { mutableIntStateOf(25) }
  var studyPoints by remember { mutableIntStateOf(1480) }
  var toastMessage by remember { mutableStateOf<String?>(null) }

  // Academic theme palette (Club Africain Rebrand: near-black, pure white, cobalt blue, sparing red accent)
  val bgCol = if (isDark) Color(0xFF0B0D11) else Color(0xFFF8F9FA)
  val cardCol = if (isDark) Color(0xFF12151B) else Color(0xFFFFFFFF)
  val borderCol = if (isDark) Color(0xFF1E2430) else Color(0xFFE5E7EB)
  val textPrimary = if (isDark) Color(0xFFF1F5F9) else Color(0xFF12151B)
  val textMuted = if (isDark) Color(0xFF94A3B8) else Color(0xFF64748B)
  val accentCol = Color(0xFFD80027) // Sparing red accent
  val secondaryBlue = Color(0xFF1A56C4) // Cobalt blue

  val exercises = remember {
    listOf(
      ScholarExerciseItem("bac-1", "Differential Equations & Exponential Systems", "Mathématiques (Bac)", 25, "High", 0.40f),
      ScholarExerciseItem("bac-2", "RLC Oscillating Circuits & Resonance Curves", "Physique & Chimie", 20, "Recommended", 0.0f),
      ScholarExerciseItem("bac-3", "Autonomy, Justice & The Rule of Law", "Philosophie", 30, "Review", 0.75f),
      ScholarExerciseItem("bac-4", "Dynamic Programming & Matrix Optimization", "Informatique", 15, "New", 0.0f)
    )
  }

  Surface(
    modifier = Modifier
      .fillMaxWidth()
      .clip(RoundedCornerShape(16.dp))
      .border(1.dp, borderCol, RoundedCornerShape(16.dp)),
    color = bgCol
  ) {
    Column(modifier = Modifier.padding(14.dp)) {
      // 1. Header: Scholar Identity & Dark Mode Segmented Switcher
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Column(modifier = Modifier.weight(1f)) {
          Text(
            "VAMOS SCHOLARS • AGES 14–19",
            fontSize = 10.sp,
            fontWeight = FontWeight.ExtraBold,
            color = textMuted,
            letterSpacing = 1.sp
          )
          Text(
            "Youssef Mansouri",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = textPrimary
          )
        }

        // OS Dark / Light Mode Switcher
        Surface(
          shape = RoundedCornerShape(8.dp),
          color = if (isDark) Color(0xFF1F2937) else Color(0xFFF1F5F9),
          border = androidx.compose.foundation.BorderStroke(1.dp, borderCol)
        ) {
          Row(modifier = Modifier.padding(2.dp)) {
            // Auto
            Surface(
              shape = RoundedCornerShape(6.dp),
              color = if (themeMode == "system") (if (isDark) Color(0xFF374151) else Color.White) else Color.Transparent,
              modifier = Modifier
                .clickable { themeMode = "system" }
                .padding(horizontal = 6.dp, vertical = 4.dp)
            ) {
              Text(
                if (isSystemDark) "Auto 🌙" else "Auto ☀️",
                fontSize = 10.sp,
                fontWeight = if (themeMode == "system") FontWeight.Bold else FontWeight.Normal,
                color = if (themeMode == "system") textPrimary else textMuted
              )
            }
            // Light
            Surface(
              shape = RoundedCornerShape(6.dp),
              color = if (themeMode == "light") (if (isDark) Color(0xFF374151) else Color.White) else Color.Transparent,
              modifier = Modifier
                .clickable { themeMode = "light" }
                .padding(horizontal = 6.dp, vertical = 4.dp)
            ) {
              Text("☀️", fontSize = 10.sp)
            }
            // Dark
            Surface(
              shape = RoundedCornerShape(6.dp),
              color = if (themeMode == "dark") (if (isDark) Color(0xFF374151) else Color.White) else Color.Transparent,
              modifier = Modifier
                .clickable { themeMode = "dark" }
                .padding(horizontal = 6.dp, vertical = 4.dp)
            ) {
              Text("🌙", fontSize = 10.sp)
            }
          }
        }
      }

      if (toastMessage != null) {
        Spacer(Modifier.height(8.dp))
        Surface(
          shape = RoundedCornerShape(8.dp),
          color = if (isDark) Color(0xFF1E293B) else Color(0xFF0F172A),
          modifier = Modifier.fillMaxWidth()
        ) {
          Text(
            toastMessage ?: "",
            color = Color(0xFF38BDF8),
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
          )
        }
      }

      Spacer(Modifier.height(10.dp))

      // Tab Content Rendering
      when (activeTab) {
        "home" -> {
          // --- STATS DASHBOARD ---
          BandCScholarStatsDashboard(
            timeStudiedHours = 14.8f,
            timeTargetHours = 18.0f,
            accuracyPercent = 94.2f,
            streakDays = 18,
            isDark = isDark,
            cardCol = cardCol,
            borderCol = borderCol,
            textPrimary = textPrimary,
            textMuted = textMuted,
            accentCol = accentCol
          )

          Spacer(Modifier.height(10.dp))

          // --- QUICK FOCUS MODE BANNER ---
          Surface(
            shape = RoundedCornerShape(10.dp),
            color = cardCol,
            border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
            modifier = Modifier.fillMaxWidth()
          ) {
            Row(
              modifier = Modifier.padding(12.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              Row(
                modifier = Modifier.weight(1f),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
              ) {
                Text("⚡", fontSize = 20.sp)
                Column {
                  Text(
                    "Distraction-Free Focus Mode",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = textPrimary
                  )
                  Text(
                    "Mutes alerts, hides badges, countdown timer",
                    fontSize = 10.sp,
                    color = textMuted
                  )
                }
              }
              Button(
                onClick = {
                  focusExerciseTitle = "Differential Equations & Exponential Systems"
                  focusExerciseSubject = "Mathématiques (Baccalaureate)"
                  focusMinutes = 25
                  showFocusDialog = true
                },
                shape = RoundedCornerShape(6.dp),
                colors = ButtonDefaults.buttonColors(
                  containerColor = if (isDark) Color(0xFF0284C7) else Color(0xFF0F172A)
                ),
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                modifier = Modifier.height(36.dp)
              ) {
                Text("Start Focus", fontSize = 11.sp, fontWeight = FontWeight.Bold)
              }
            }
          }

          Spacer(Modifier.height(10.dp))

          // --- RECOMMENDED EXERCISES LIST ---
          Text(
            "RECOMMENDED EXERCISES (4 MODULES QUEUED)",
            fontSize = 10.sp,
            fontWeight = FontWeight.ExtraBold,
            color = textMuted,
            letterSpacing = 0.8.sp
          )
          Spacer(Modifier.height(6.dp))

          exercises.forEach { ex ->
            BandCExerciseCard(
              exercise = ex,
              isDark = isDark,
              cardCol = cardCol,
              borderCol = borderCol,
              textPrimary = textPrimary,
              textMuted = textMuted,
              accentCol = accentCol,
              onStartFocus = {
                focusExerciseTitle = ex.title
                focusExerciseSubject = ex.subject
                focusMinutes = ex.durationMinutes
                showFocusDialog = true
              },
              onStartNormal = {
                studyPoints += 50
                toastMessage = "Started \"${ex.title}\" (+50 study points logged)"
              }
            )
            Spacer(Modifier.height(6.dp))
          }
        }

        "practice" -> {
          Text("ACADEMIC PRACTICE MODULES", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = textPrimary)
          Text("Direct past-exam drills and timed marking rubrics", fontSize = 11.sp, color = textMuted)
          Spacer(Modifier.height(8.dp))
          exercises.forEach { ex ->
            BandCExerciseCard(
              exercise = ex,
              isDark = isDark,
              cardCol = cardCol,
              borderCol = borderCol,
              textPrimary = textPrimary,
              textMuted = textMuted,
              accentCol = accentCol,
              onStartFocus = {
                focusExerciseTitle = ex.title
                focusExerciseSubject = ex.subject
                focusMinutes = ex.durationMinutes
                showFocusDialog = true
              },
              onStartNormal = {
                studyPoints += 50
                toastMessage = "Started practice \"${ex.title}\""
              }
            )
            Spacer(Modifier.height(6.dp))
          }
        }

        "games" -> {
          Text("COGNITIVE & LOGIC DRILLS", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = textPrimary)
          Text("High-precision reasoning and mental arithmetic", fontSize = 11.sp, color = textMuted)
          Spacer(Modifier.height(8.dp))

          listOf(
            Triple("Mental Calculus & Rapid Approximations", "Mathématiques", 50),
            Triple("Formal Logic & Deductive Proofs", "Philosophie & Math", 60),
            Triple("Algorithm Debug Sprint", "Informatique", 75)
          ).forEach { (title, field, pts) ->
            Surface(
              shape = RoundedCornerShape(10.dp),
              color = cardCol,
              border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
              modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 4.dp)
            ) {
              Row(
                modifier = Modifier.padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
              ) {
                Column(modifier = Modifier.weight(1f)) {
                  Text(field.uppercase(), fontSize = 9.sp, fontWeight = FontWeight.Bold, color = accentCol)
                  Text(title, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                }
                Button(
                  onClick = {
                    studyPoints += pts
                    toastMessage = "Completed $title! +$pts points recorded."
                  },
                  shape = RoundedCornerShape(6.dp),
                  colors = ButtonDefaults.buttonColors(containerColor = if (isDark) Color(0xFF0284C7) else Color(0xFF0F172A)),
                  contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp),
                  modifier = Modifier.height(34.dp)
                ) {
                  Text("+$pts pts ➔", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
              }
            }
          }
        }

        "stats" -> {
          Text("PERFORMANCE ANALYTICS", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = textPrimary)
          Text("Telemetry, accuracy trends, and national exam readiness", fontSize = 11.sp, color = textMuted)
          Spacer(Modifier.height(8.dp))

          BandCScholarStatsDashboard(
            timeStudiedHours = 14.8f,
            timeTargetHours = 18.0f,
            accuracyPercent = 94.2f,
            streakDays = 18,
            isDark = isDark,
            cardCol = cardCol,
            borderCol = borderCol,
            textPrimary = textPrimary,
            textMuted = textMuted,
            accentCol = accentCol
          )

          Spacer(Modifier.height(8.dp))

          Surface(
            shape = RoundedCornerShape(10.dp),
            color = cardCol,
            border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
            modifier = Modifier.fillMaxWidth()
          ) {
            Column(modifier = Modifier.padding(14.dp)) {
              Text("BACCALAUREATE READINESS SCORE", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = textMuted)
              Text("84%", fontSize = 32.sp, fontWeight = FontWeight.ExtraBold, color = accentCol)
              Text(
                "Based on recent simulated Baccalaureate exams in Mathematics, Physics, and French synthesis.",
                fontSize = 11.sp,
                color = textMuted
              )
            }
          }
        }

        "profile" -> {
          Text("SCHOLAR DOSSIER", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = textPrimary)
          Text("Candidate registry and academic credentials", fontSize = 11.sp, color = textMuted)
          Spacer(Modifier.height(8.dp))

          Surface(
            shape = RoundedCornerShape(12.dp),
            color = cardCol,
            border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
            modifier = Modifier.fillMaxWidth()
          ) {
            Column(
              modifier = Modifier.padding(16.dp),
              horizontalAlignment = Alignment.CenterHorizontally
            ) {
              Surface(
                shape = CircleShape,
                color = if (isDark) Color(0xFF1E293B) else Color(0xFFF1F5F9),
                modifier = Modifier.size(54.dp)
              ) {
                Box(contentAlignment = Alignment.Center) {
                  Text("🏛️", fontSize = 26.sp)
                }
              }
              Spacer(Modifier.height(8.dp))
              Text("Youssef Mansouri", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = textPrimary)
              Text("Section Mathématiques & Informatique", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = accentCol)
              Text("Lycée Pilote de Sousse • Candidate #2024-TN-8419", fontSize = 11.sp, color = textMuted)

              Spacer(Modifier.height(12.dp))
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceAround
              ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                  Text("$studyPoints", fontSize = 16.sp, fontWeight = FontWeight.ExtraBold, color = textPrimary)
                  Text("STUDY PTS", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = textMuted)
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                  Text("18d", fontSize = 16.sp, fontWeight = FontWeight.ExtraBold, color = textPrimary)
                  Text("STREAK", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = textMuted)
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                  Text("Tier IV", fontSize = 16.sp, fontWeight = FontWeight.ExtraBold, color = textPrimary)
                  Text("FELLOW", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = textMuted)
                }
              }
            }
          }
        }
      }

      Spacer(Modifier.height(12.dp))

      // --- SUBTLE NON-CARTOONISH BOTTOM TAB NAVIGATION ---
      BandCScholarBottomNav(
        activeTab = activeTab,
        onSelectTab = { activeTab = it },
        isDark = isDark,
        cardCol = cardCol,
        borderCol = borderCol,
        textPrimary = textPrimary,
        textMuted = textMuted,
        accentCol = accentCol
      )
    }
  }

  // --- FOCUS MODE DIALOG ---
  if (showFocusDialog) {
    BandCFocusSessionDialog(
      exerciseTitle = focusExerciseTitle,
      subject = focusExerciseSubject,
      initialMinutes = focusMinutes,
      isDark = isDark,
      onDismiss = { showFocusDialog = false },
      onComplete = { mins ->
        studyPoints += mins * 5
        toastMessage = "🎯 Focus session complete! $mins min logged (+${mins * 5} pts)."
        showFocusDialog = false
      }
    )
  }
}

/**
 * Stats Dashboard (Time Studied, Accuracy Trends, Streak)
 */
@Composable
fun BandCScholarStatsDashboard(
  timeStudiedHours: Float,
  timeTargetHours: Float,
  accuracyPercent: Float,
  streakDays: Int,
  isDark: Boolean,
  cardCol: Color,
  borderCol: Color,
  textPrimary: Color,
  textMuted: Color,
  accentCol: Color
) {
  val dailyAccuracy = listOf(
    Pair("M", 92),
    Pair("T", 95),
    Pair("W", 96),
    Pair("T", 94),
    Pair("F", 98),
    Pair("S", 91),
    Pair("S", 94)
  )

  Surface(
    shape = RoundedCornerShape(12.dp),
    color = cardCol,
    border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
    modifier = Modifier.fillMaxWidth()
  ) {
    Column(modifier = Modifier.padding(14.dp)) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Text(
          "STUDY METRICS & TRENDS",
          fontSize = 10.sp,
          fontWeight = FontWeight.Bold,
          color = textMuted,
          letterSpacing = 0.8.sp
        )
        Text("Week 37", fontSize = 10.sp, color = textMuted)
      }

      Spacer(Modifier.height(10.dp))

      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
      ) {
        // Tile 1: Time Studied
        Surface(
          shape = RoundedCornerShape(8.dp),
          color = if (isDark) Color(0xFF0F172A) else Color(0xFFF8FAFC),
          border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
          modifier = Modifier.weight(1f)
        ) {
          Column(modifier = Modifier.padding(8.dp)) {
            Text("TIME STUDIED", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = textMuted)
            Spacer(Modifier.height(2.dp))
            Row(verticalAlignment = Alignment.Bottom) {
              Text("$timeStudiedHours", fontSize = 16.sp, fontWeight = FontWeight.ExtraBold, color = textPrimary)
              Text(" hrs", fontSize = 10.sp, color = textMuted)
            }
            Text("+2.4h vs last wk", fontSize = 9.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF10B981))
            Spacer(Modifier.height(4.dp))
            LinearProgressIndicator(
              progress = { (timeStudiedHours / timeTargetHours).coerceIn(0f, 1f) },
              color = accentCol,
              trackColor = if (isDark) Color(0xFF334155) else Color(0xFFE2E8F0),
              modifier = Modifier
                .fillMaxWidth()
                .height(3.dp)
                .clip(RoundedCornerShape(2.dp))
            )
            Text("Goal: ${timeTargetHours}h", fontSize = 8.sp, color = textMuted, modifier = Modifier.padding(top = 2.dp))
          }
        }

        // Tile 2: Accuracy
        Surface(
          shape = RoundedCornerShape(8.dp),
          color = if (isDark) Color(0xFF0F172A) else Color(0xFFF8FAFC),
          border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
          modifier = Modifier.weight(1f)
        ) {
          Column(modifier = Modifier.padding(8.dp)) {
            Text("ACCURACY", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = textMuted)
            Spacer(Modifier.height(2.dp))
            Row(verticalAlignment = Alignment.Bottom) {
              Text("$accuracyPercent", fontSize = 16.sp, fontWeight = FontWeight.ExtraBold, color = textPrimary)
              Text("%", fontSize = 10.sp, color = textMuted)
            }
            Text("+1.8% vs last wk", fontSize = 9.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF10B981))
            Spacer(Modifier.height(4.dp))

            // 7-day sparkline
            Row(
              modifier = Modifier
                .fillMaxWidth()
                .height(18.dp),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.Bottom
            ) {
              dailyAccuracy.forEachIndexed { i, (day, v) ->
                val barH = ((v - 80) / 20f * 16f).coerceIn(4f, 16f)
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                  Box(
                    modifier = Modifier
                      .width(4.dp)
                      .height(barH.dp)
                      .clip(RoundedCornerShape(1.dp))
                      .background(
                        if (i == dailyAccuracy.lastIndex) accentCol
                        else (if (isDark) Color(0xFF475569) else Color(0xFFCBD5E1))
                      )
                  )
                  Text(day, fontSize = 6.sp, color = textMuted)
                }
              }
            }
          }
        }

        // Tile 3: Streak
        Surface(
          shape = RoundedCornerShape(8.dp),
          color = if (isDark) Color(0xFF0F172A) else Color(0xFFF8FAFC),
          border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
          modifier = Modifier.weight(1f)
        ) {
          Column(modifier = Modifier.padding(8.dp)) {
            Text("STUDY STREAK", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = textMuted)
            Spacer(Modifier.height(2.dp))
            Row(verticalAlignment = Alignment.Bottom) {
              Text("$streakDays", fontSize = 16.sp, fontWeight = FontWeight.ExtraBold, color = textPrimary)
              Text(" days", fontSize = 10.sp, color = textMuted)
            }
            Text("Personal best", fontSize = 9.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFFF59E0B))
            Spacer(Modifier.height(6.dp))
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
              Text("🔥", fontSize = 12.sp)
              Text("Active today", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = textMuted)
            }
          }
        }
      }
    }
  }
}

/**
 * Exercise Item Card
 */
@Composable
fun BandCExerciseCard(
  exercise: ScholarExerciseItem,
  isDark: Boolean,
  cardCol: Color,
  borderCol: Color,
  textPrimary: Color,
  textMuted: Color,
  accentCol: Color,
  onStartFocus: () -> Unit,
  onStartNormal: () -> Unit
) {
  val priorityColor = when (exercise.priority) {
    "High" -> if (isDark) Color(0xFFF87171) else Color(0xFFDC2626)
    "Recommended" -> if (isDark) Color(0xFF60A5FA) else Color(0xFF2563EB)
    "Review" -> if (isDark) Color(0xFFFBBF24) else Color(0xFFD97706)
    else -> if (isDark) Color(0xFF34D399) else Color(0xFF059669)
  }

  Surface(
    shape = RoundedCornerShape(10.dp),
    color = cardCol,
    border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
    modifier = Modifier.fillMaxWidth()
  ) {
    Column(modifier = Modifier.padding(12.dp)) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
          Text(exercise.subject, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = textMuted)
          Surface(
            shape = RoundedCornerShape(4.dp),
            color = priorityColor.copy(alpha = 0.12f)
          ) {
            Text(
              exercise.priority.uppercase(),
              fontSize = 8.sp,
              fontWeight = FontWeight.ExtraBold,
              color = priorityColor,
              modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
            )
          }
        }
        Text("⏱ ${exercise.durationMinutes} min", fontSize = 10.sp, color = textMuted)
      }

      Spacer(Modifier.height(4.dp))
      Text(exercise.title, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = textPrimary)

      if (exercise.progress > 0) {
        Spacer(Modifier.height(6.dp))
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
          LinearProgressIndicator(
            progress = { exercise.progress },
            color = accentCol,
            trackColor = if (isDark) Color(0xFF334155) else Color(0xFFE2E8F0),
            modifier = Modifier
              .weight(1f)
              .height(3.dp)
              .clip(RoundedCornerShape(2.dp))
          )
          Text("${(exercise.progress * 100).toInt()}%", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = textMuted)
        }
      }

      Spacer(Modifier.height(8.dp))
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.End,
        verticalAlignment = Alignment.CenterVertically
      ) {
        OutlinedButton(
          onClick = onStartFocus,
          shape = RoundedCornerShape(6.dp),
          contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
          modifier = Modifier.height(32.dp)
        ) {
          Text("⚡ Focus Session", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = textPrimary)
        }
        Spacer(Modifier.width(6.dp))
        Button(
          onClick = onStartNormal,
          shape = RoundedCornerShape(6.dp),
          colors = ButtonDefaults.buttonColors(
            containerColor = if (isDark) Color(0xFF0284C7) else Color(0xFF0F172A)
          ),
          contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
          modifier = Modifier.height(32.dp)
        ) {
          Text("Start ➔", fontSize = 10.sp, fontWeight = FontWeight.Bold)
        }
      }
    }
  }
}

/**
 * Bottom Tab Navigation (Home, Practice, Games, Stats, Profile) with subtle, non-cartoonish icons
 */
@Composable
fun BandCScholarBottomNav(
  activeTab: String,
  onSelectTab: (String) -> Unit,
  isDark: Boolean,
  cardCol: Color,
  borderCol: Color,
  textPrimary: Color,
  textMuted: Color,
  accentCol: Color
) {
  val tabs = listOf(
    Triple("home", "Home", "⌂"),
    Triple("practice", "Practice", "◈"),
    Triple("games", "Logic", "⌘"),
    Triple("stats", "Stats", "▤"),
    Triple("profile", "Profile", "●")
  )

  Surface(
    shape = RoundedCornerShape(8.dp),
    color = cardCol,
    border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
    modifier = Modifier.fillMaxWidth()
  ) {
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(vertical = 4.dp),
      horizontalArrangement = Arrangement.SpaceAround
    ) {
      tabs.forEach { (id, label, glyph) ->
        val isSelected = activeTab == id
        Column(
          horizontalAlignment = Alignment.CenterHorizontally,
          modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .clickable { onSelectTab(id) }
            .padding(horizontal = 10.dp, vertical = 4.dp)
            .testTag("scholar_tab_$id")
        ) {
          Text(
            glyph,
            fontSize = 15.sp,
            fontWeight = if (isSelected) FontWeight.ExtraBold else FontWeight.Normal,
            color = if (isSelected) accentCol else textMuted
          )
          Text(
            label,
            fontSize = 9.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
            color = if (isSelected) accentCol else textMuted
          )
        }
      }
    }
  }
}

/**
 * Full-screen Focus Mode Dialog (Hides distractions, notifications, prominent timer, question & scratchpad)
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BandCFocusSessionDialog(
  exerciseTitle: String,
  subject: String,
  initialMinutes: Int,
  isDark: Boolean,
  onDismiss: () -> Unit,
  onComplete: (Int) -> Unit
) {
  var secondsLeft by remember { mutableIntStateOf(initialMinutes * 60) }
  var isRunning by remember { mutableStateOf(true) }
  var notes by remember { mutableStateOf("") }
  var selectedOption by remember { mutableIntStateOf(0) }

  val bg = if (isDark) Color(0xFF090D16) else Color(0xFFFAFAFA)
  val cardBg = if (isDark) Color(0xFF111827) else Color(0xFFFFFFFF)
  val borderCol = if (isDark) Color(0xFF1F2937) else Color(0xFFE5E7EB)
  val textPrimary = if (isDark) Color(0xFFF9FAFB) else Color(0xFF111827)
  val textMuted = if (isDark) Color(0xFF9CA3AF) else Color(0xFF6B7280)
  val accent = if (isDark) Color(0xFF38BDF8) else Color(0xFF0284C7)

  val mins = secondsLeft / 60
  val secs = secondsLeft % 60
  val timerString = String.format("%02d:%02d", mins, secs)

  AlertDialog(
    onDismissRequest = onDismiss,
    confirmButton = {},
    dismissButton = {},
    shape = RoundedCornerShape(16.dp),
    containerColor = bg,
    modifier = Modifier.fillMaxWidth(0.96f),
    text = {
      Column(
        modifier = Modifier
          .fillMaxWidth()
          .verticalScroll(rememberScrollState())
      ) {
        // Distraction-free top bar
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            Box(
              modifier = Modifier
                .size(8.dp)
                .clip(CircleShape)
                .background(if (isRunning) Color(0xFF10B981) else Color(0xFFF59E0B))
            )
            Text("FOCUS MODE ACTIVE", fontSize = 9.sp, fontWeight = FontWeight.ExtraBold, color = accent)
            Text("• 🔕 Muted", fontSize = 9.sp, color = textMuted)
          }
          TextButton(onClick = onDismiss, contentPadding = PaddingValues(0.dp)) {
            Text("Exit ✕", fontSize = 11.sp, color = textMuted)
          }
        }

        Spacer(Modifier.height(10.dp))

        // Prominent Minimalist Timer Card
        Surface(
          shape = RoundedCornerShape(12.dp),
          color = cardBg,
          border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
          modifier = Modifier.fillMaxWidth()
        ) {
          Column(
            modifier = Modifier.padding(14.dp),
            horizontalAlignment = Alignment.CenterHorizontally
          ) {
            Text("SESSION REMAINING", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = textMuted)
            Text(
              timerString,
              fontSize = 42.sp,
              fontWeight = FontWeight.ExtraBold,
              color = textPrimary,
              letterSpacing = (-1).sp
            )
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
              Button(
                onClick = { isRunning = !isRunning },
                shape = RoundedCornerShape(6.dp),
                colors = ButtonDefaults.buttonColors(containerColor = if (isRunning) Color(0xFFEF4444) else accent),
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                modifier = Modifier.height(32.dp)
              ) {
                Text(if (isRunning) "Pause" else "Resume", fontSize = 11.sp, fontWeight = FontWeight.Bold)
              }
              OutlinedButton(
                onClick = { secondsLeft += 300 },
                shape = RoundedCornerShape(6.dp),
                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                modifier = Modifier.height(32.dp)
              ) {
                Text("+5 min", fontSize = 11.sp, color = textPrimary)
              }
              OutlinedButton(
                onClick = {
                  isRunning = false
                  secondsLeft = initialMinutes * 60
                },
                shape = RoundedCornerShape(6.dp),
                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                modifier = Modifier.height(32.dp)
              ) {
                Text("Reset", fontSize = 11.sp, color = textMuted)
              }
            }
          }
        }

        Spacer(Modifier.height(10.dp))

        // Problem Statement Card
        Surface(
          shape = RoundedCornerShape(12.dp),
          color = cardBg,
          border = androidx.compose.foundation.BorderStroke(1.dp, borderCol),
          modifier = Modifier.fillMaxWidth()
        ) {
          Column(modifier = Modifier.padding(14.dp)) {
            Text(subject.uppercase(), fontSize = 9.sp, fontWeight = FontWeight.ExtraBold, color = accent)
            Text(exerciseTitle, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = textPrimary)
            Spacer(Modifier.height(6.dp))
            Text(
              "Problem 1: Solve the differential equation y' + 2y = 3 with y(0) = 2. Determine the steady-state limit as t → +∞.",
              fontSize = 12.sp,
              color = textPrimary,
              lineHeight = 18.sp
            )

            Spacer(Modifier.height(10.dp))

            listOf(
              "A) y(t) = C · e^(-2t) + 3/2",
              "B) y(t) = C · e^(2t) - 1/2",
              "C) y(t) = 2 · e^(-t) + C"
            ).forEachIndexed { idx, opt ->
              val isSelected = selectedOption == idx
              Surface(
                shape = RoundedCornerShape(6.dp),
                color = if (isSelected) accent.copy(alpha = 0.12f) else cardBg,
                border = androidx.compose.foundation.BorderStroke(1.dp, if (isSelected) accent else borderCol),
                modifier = Modifier
                  .fillMaxWidth()
                  .padding(vertical = 3.dp)
                  .clickable { selectedOption = idx }
              ) {
                Row(
                  modifier = Modifier.padding(8.dp),
                  verticalAlignment = Alignment.CenterVertically,
                  horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                  Box(
                    modifier = Modifier
                      .size(14.dp)
                      .clip(CircleShape)
                      .border(2.dp, if (isSelected) accent else borderCol, CircleShape)
                      .background(if (isSelected) accent else Color.Transparent)
                  )
                  Text(
                    opt,
                    fontSize = 11.sp,
                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                    color = textPrimary
                  )
                }
              }
            }

            Spacer(Modifier.height(8.dp))
            Text("SCHOLAR SCRATCHPAD", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = textMuted)
            OutlinedTextField(
              value = notes,
              onValueChange = { notes = it },
              placeholder = { Text("Derivations, integrals, and notes...", fontSize = 11.sp, color = textMuted) },
              modifier = Modifier
                .fillMaxWidth()
                .height(64.dp),
              textStyle = androidx.compose.ui.text.TextStyle(fontSize = 11.sp, color = textPrimary)
            )

            Spacer(Modifier.height(12.dp))
            Button(
              onClick = {
                val spent = kotlin.math.max(1, (initialMinutes * 60 - secondsLeft) / 60)
                onComplete(spent)
              },
              shape = RoundedCornerShape(8.dp),
              colors = ButtonDefaults.buttonColors(containerColor = accent),
              modifier = Modifier
                .fillMaxWidth()
                .height(42.dp)
            ) {
              Text("Submit Solution & Complete Session ➔", fontSize = 11.sp, fontWeight = FontWeight.Bold)
            }
          }
        }
      }
    }
  )
}

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

