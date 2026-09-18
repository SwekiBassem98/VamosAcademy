package com.example

import androidx.compose.animation.AnimatedVisibility
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
 * Subject -> Unit -> Skill hierarchy card with accordion expansion and visible mastery indicators
 */
@Composable
fun KhanSubjectHierarchyCard(
  subject: KhanSubject,
  primaryColor: Color,
  isBandB: Boolean,
  onStartSkillPractice: (KhanUnit, KhanSkill) -> Unit
) {
  var expandedUnitId by remember { mutableStateOf<String?>(subject.units.firstOrNull()?.id) }

  Surface(
    shape = RoundedCornerShape(14.dp),
    color = Color.White,
    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0)),
    shadowElevation = 1.dp,
    modifier = Modifier
      .fillMaxWidth()
      .padding(vertical = 6.dp)
  ) {
    Column(modifier = Modifier.padding(14.dp)) {
      // Course header
      Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
      ) {
        Surface(
          shape = RoundedCornerShape(8.dp),
          color = primaryColor.copy(alpha = 0.1f),
          modifier = Modifier.size(38.dp)
        ) {
          Box(contentAlignment = Alignment.Center) {
            Text(subject.icon, fontSize = 20.sp)
          }
        }
        Spacer(Modifier.width(10.dp))
        Column(modifier = Modifier.weight(1f)) {
          Text(
            subject.code,
            fontSize = 10.sp,
            fontWeight = FontWeight.Black,
            color = primaryColor,
            letterSpacing = 0.6.sp
          )
          Text(
            subject.title,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF0F172A)
          )
        }
        Text(
          "${subject.units.size} unités",
          fontSize = 11.sp,
          color = Color(0xFF64748B),
          fontWeight = FontWeight.Medium
        )
      }

      Spacer(Modifier.height(10.dp))

      // Units list
      subject.units.forEach { unit ->
        val isExpanded = expandedUnitId == unit.id

        Surface(
          shape = RoundedCornerShape(10.dp),
          color = if (isExpanded) Color(0xFFF8FAFC) else Color.White,
          border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (isExpanded) Color(0xFFCBD5E1) else Color(0xFFF1F5F9)
          ),
          modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .clickable { expandedUnitId = if (isExpanded) null else unit.id }
        ) {
          Column(modifier = Modifier.padding(12.dp)) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Column(modifier = Modifier.weight(1f)) {
                Text(
                  unit.title,
                  fontWeight = FontWeight.Bold,
                  fontSize = 13.sp,
                  color = Color(0xFF1E293B)
                )
                Text(
                  unit.description,
                  fontSize = 11.sp,
                  color = Color(0xFF64748B),
                  maxLines = if (isExpanded) Int.MAX_VALUE else 1
                )
              }
              Spacer(Modifier.width(8.dp))
              Column(horizontalAlignment = Alignment.End) {
                Text(
                  "${unit.masteryPercent}% maîtrise",
                  fontSize = 10.sp,
                  fontWeight = FontWeight.Bold,
                  color = if (unit.masteryPercent >= 70) Color(0xFF10B981) else primaryColor
                )
                Text(
                  if (isExpanded) "▲" else "▼",
                  fontSize = 10.sp,
                  color = Color(0xFF94A3B8)
                )
              }
            }

            // Skills accordion list
            AnimatedVisibility(visible = isExpanded) {
              Column(modifier = Modifier.padding(top = 10.dp)) {
                Divider(color = Color(0xFFE2E8F0), thickness = 0.8.dp)
                Spacer(Modifier.height(8.dp))

                unit.skills.forEach { skill ->
                  Row(
                    modifier = Modifier
                      .fillMaxWidth()
                      .padding(vertical = 5.dp)
                      .clip(RoundedCornerShape(8.dp))
                      .clickable { onStartSkillPractice(unit, skill) }
                      .background(Color.White)
                      .border(0.8.dp, Color(0xFFE2E8F0), RoundedCornerShape(8.dp))
                      .padding(horizontal = 10.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                  ) {
                    Column(modifier = Modifier.weight(1f)) {
                      Text(
                        skill.title,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF1E293B)
                      )
                      Spacer(Modifier.height(2.dp))
                      KhanMasteryIndicator(mastery = skill.mastery)
                    }

                    Surface(
                      shape = RoundedCornerShape(6.dp),
                      color = primaryColor.copy(alpha = 0.08f),
                      modifier = Modifier.padding(start = 6.dp)
                    ) {
                      Text(
                        "Pratiquer ➔",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = primaryColor,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                      )
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
