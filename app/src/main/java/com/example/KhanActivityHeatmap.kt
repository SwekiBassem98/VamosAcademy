package com.example

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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

data class ActivityHeatmapDay(
  val dateLabel: String,
  val minutes: Int,
  val level: Int // 0 (empty), 1 (light), 2 (medium), 3 (deep)
)

/**
 * Generates 28 days of practice heatmap data
 */
fun generatePast28DaysActivity(totalDaysActive: Int = 18): List<ActivityHeatmapDay> {
  val pattern = listOf(
    1, 2, 0, 3, 2, 1, 0,
    2, 3, 1, 0, 2, 3, 1,
    0, 2, 3, 3, 2, 0, 1,
    2, 3, 2, 3, 3, 1, 3
  )
  return pattern.mapIndexed { idx, level ->
    val mins = when (level) {
      0 -> 0
      1 -> 15
      2 -> 35
      else -> 60
    }
    ActivityHeatmapDay("J${idx + 1}", mins, level)
  }
}

/**
 * Khan Academy Activity Heatmap Calendar
 */
@Composable
fun KhanActivityHeatmap(
  isDark: Boolean,
  primaryAccent: Color,
  modifier: Modifier = Modifier
) {
  val activityDays = remember { generatePast28DaysActivity() }
  val totalMinutes = remember { activityDays.sumOf { it.minutes } }
  val activeDaysCount = remember { activityDays.count { it.level > 0 } }

  val bgCard = if (isDark) Color(0xFF1E293B) else Color.White
  val borderColor = if (isDark) Color(0xFF334155) else Color(0xFFE2E8F0)
  val textPrimary = if (isDark) Color(0xFFF8FAFC) else Color(0xFF0F172A)
  val textMuted = if (isDark) Color(0xFF94A3B8) else Color(0xFF64748B)

  val emptyBoxColor = if (isDark) Color(0xFF0F172A) else Color(0xFFF1F5F9)
  val level1Color = primaryAccent.copy(alpha = 0.35f)
  val level2Color = primaryAccent.copy(alpha = 0.70f)
  val level3Color = primaryAccent

  Surface(
    shape = RoundedCornerShape(12.dp),
    color = bgCard,
    border = androidx.compose.foundation.BorderStroke(1.dp, borderColor),
    modifier = modifier.fillMaxWidth()
  ) {
    Column(modifier = Modifier.padding(14.dp)) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Column {
          Text(
            "CALENDRIER D'ACTIVITÉ",
            fontSize = 11.sp,
            fontWeight = FontWeight.Black,
            color = textMuted,
            letterSpacing = 0.6.sp
          )
          Text(
            "Historique des 4 dernières semaines",
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold,
            color = textPrimary
          )
        }
        Surface(
          shape = RoundedCornerShape(8.dp),
          color = primaryAccent.copy(alpha = 0.12f)
        ) {
          Text(
            "$activeDaysCount / 28 jours actifs",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = primaryAccent,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
          )
        }
      }

      Spacer(Modifier.height(12.dp))

      // 4 rows x 7 columns grid
      Column(
        verticalArrangement = Arrangement.spacedBy(4.dp),
        modifier = Modifier.fillMaxWidth()
      ) {
        for (week in 0..3) {
          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
          ) {
            for (day in 0..6) {
              val item = activityDays[week * 7 + day]
              val boxCol = when (item.level) {
                0 -> emptyBoxColor
                1 -> level1Color
                2 -> level2Color
                else -> level3Color
              }
              Box(
                modifier = Modifier
                  .size(24.dp)
                  .clip(RoundedCornerShape(4.dp))
                  .background(boxCol)
                  .border(0.5.dp, borderColor, RoundedCornerShape(4.dp))
              )
            }
          }
        }
      }

      Spacer(Modifier.height(10.dp))

      // Heatmap legend & total summary
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Text(
          "Temps total d'étude : ${totalMinutes / 60}h ${totalMinutes % 60}m",
          fontSize = 11.sp,
          color = textMuted,
          fontWeight = FontWeight.Medium
        )

        Row(
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.spacedBy(3.dp)
        ) {
          Text("Moins", fontSize = 9.sp, color = textMuted)
          Box(Modifier.size(10.dp).clip(RoundedCornerShape(2.dp)).background(emptyBoxColor))
          Box(Modifier.size(10.dp).clip(RoundedCornerShape(2.dp)).background(level1Color))
          Box(Modifier.size(10.dp).clip(RoundedCornerShape(2.dp)).background(level2Color))
          Box(Modifier.size(10.dp).clip(RoundedCornerShape(2.dp)).background(level3Color))
          Text("Plus", fontSize = 9.sp, color = textMuted)
        }
      }
    }
  }
}
