package com.example

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
 * Clean, content-forward exercise modal directly inspired by Khan Academy:
 * Minimal chrome, generous whitespace, clear single primary action, immediate pedagogical feedback.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KhanExerciseDialog(
  skillTitle: String,
  unitTitle: String,
  primaryColor: Color,
  isBandB: Boolean,
  onDismiss: () -> Unit,
  onMasteryEarned: (Boolean) -> Unit
) {
  var selectedChoice by remember { mutableIntStateOf(-1) }
  var hasChecked by remember { mutableStateOf(false) }
  val isCorrect = selectedChoice == 1 // Choice B is the correct answer

  val choices = remember(skillTitle) {
    if (isBandB) {
      listOf(
        "A) x = 7",
        "B) x = 5",
        "C) x = 12",
        "D) x = -5"
      )
    } else {
      listOf(
        "A) y(t) = C · e^(2t) + 3/2",
        "B) y(t) = 1/2 · e^(-2t) + 3/2",
        "C) y(t) = 2 · e^(-t) + 1",
        "D) y(t) = C · e^(-t) + 3"
      )
    }
  }

  val problemStatement = remember(skillTitle) {
    if (isBandB) {
      "Résous l'équation suivante dans l'ensemble des entiers relatifs :\n\n3x - 4 = 11\n\nQuelle est la valeur de x ?"
    } else {
      "Résous l'équation différentielle linéaire du premier ordre avec condition initiale :\n\ny' + 2y = 3,  avec y(0) = 2\n\nTrouve l'unique solution pour t ≥ 0 :"
    }
  }

  AlertDialog(
    onDismissRequest = onDismiss,
    confirmButton = {},
    dismissButton = {},
    shape = RoundedCornerShape(18.dp),
    containerColor = Color.White,
    modifier = Modifier.fillMaxWidth(0.96f),
    text = {
      Column(
        modifier = Modifier
          .fillMaxWidth()
          .verticalScroll(rememberScrollState())
          .padding(top = 4.dp)
      ) {
        // Minimal top chrome
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Column {
            Text(
              unitTitle.uppercase(),
              fontSize = 10.sp,
              fontWeight = FontWeight.Black,
              color = Color(0xFF64748B),
              letterSpacing = 0.5.sp
            )
            Text(
              skillTitle,
              fontSize = 15.sp,
              fontWeight = FontWeight.Bold,
              color = Color(0xFF0F172A)
            )
          }
          IconButton(
            onClick = onDismiss,
            modifier = Modifier.size(32.dp).testTag("close_exercise_dialog")
          ) {
            Text("✕", fontSize = 16.sp, color = Color(0xFF64748B), fontWeight = FontWeight.Bold)
          }
        }

        Divider(
          color = Color(0xFFF1F5F9),
          thickness = 1.dp,
          modifier = Modifier.padding(vertical = 12.dp)
        )

        // Problem Box (Content-forward with generous whitespace)
        Surface(
          shape = RoundedCornerShape(12.dp),
          color = Color(0xFFF8FAFC),
          border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0)),
          modifier = Modifier.fillMaxWidth()
        ) {
          Column(modifier = Modifier.padding(18.dp)) {
            Text(
              "QUESTION 1 SUR 1",
              fontSize = 10.sp,
              fontWeight = FontWeight.Black,
              color = primaryColor,
              letterSpacing = 0.8.sp
            )
            Spacer(Modifier.height(8.dp))
            Text(
              problemStatement,
              fontSize = 14.sp,
              fontWeight = FontWeight.Medium,
              color = Color(0xFF1E293B),
              lineHeight = 22.sp
            )
          }
        }

        Spacer(Modifier.height(16.dp))

        // Multiple-choice options
        choices.forEachIndexed { index, text ->
          val isSelected = selectedChoice == index
          val borderCol = when {
            hasChecked && index == 1 -> Color(0xFF10B981) // correct
            hasChecked && isSelected && !isCorrect -> Color(0xFFEF4444) // wrong
            isSelected -> primaryColor
            else -> Color(0xFFE2E8F0)
          }
          val bgCol = when {
            hasChecked && index == 1 -> Color(0xFFECFDF5)
            hasChecked && isSelected && !isCorrect -> Color(0xFFFEF2F2)
            isSelected -> primaryColor.copy(alpha = 0.08f)
            else -> Color.White
          }

          Surface(
            shape = RoundedCornerShape(12.dp),
            color = bgCol,
            border = androidx.compose.foundation.BorderStroke(1.5.dp, borderCol),
            modifier = Modifier
              .fillMaxWidth()
              .padding(vertical = 4.dp)
              .clickable(enabled = !hasChecked) { selectedChoice = index }
              .testTag("exercise_choice_$index")
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp),
              verticalAlignment = Alignment.CenterVertically
            ) {
              Box(
                modifier = Modifier
                  .size(20.dp)
                  .clip(CircleShape)
                  .border(2.dp, borderCol, CircleShape)
                  .background(if (isSelected) primaryColor else Color.Transparent),
                contentAlignment = Alignment.Center
              ) {
                if (isSelected && !hasChecked) {
                  Box(Modifier.size(8.dp).clip(CircleShape).background(Color.White))
                }
              }
              Spacer(Modifier.width(12.dp))
              Text(
                text,
                fontSize = 13.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                color = Color(0xFF1E293B)
              )
            }
          }
        }

        // Pedagogical feedback notice
        if (hasChecked) {
          Spacer(Modifier.height(12.dp))
          Surface(
            shape = RoundedCornerShape(10.dp),
            color = if (isCorrect) Color(0xFFECFDF5) else Color(0xFFFEF2F2),
            border = androidx.compose.foundation.BorderStroke(
              1.dp,
              if (isCorrect) Color(0xFFA7F3D0) else Color(0xFFFECACA)
            ),
            modifier = Modifier.fillMaxWidth()
          ) {
            Column(modifier = Modifier.padding(12.dp)) {
              Text(
                if (isCorrect) "✓ Exact ! Compétence maîtrisée" else "Pas tout à fait. Analysons l'étape :",
                fontWeight = FontWeight.Bold,
                fontSize = 13.sp,
                color = if (isCorrect) Color(0xFF047857) else Color(0xFFB91C1C)
              )
              Spacer(Modifier.height(4.dp))
              Text(
                if (isCorrect) {
                  if (isBandB) "En ajoutant 4 aux deux membres, 3x = 15, donc x = 5. Excellent raisonnement !"
                  else "Solution homogène yh = C·e^(-2t) et solution particulière constante yp = 3/2. Avec y(0)=2, C = 1/2."
                } else {
                  if (isBandB) "N'oublie pas de vérifier chaque membre : 3(5) - 4 = 15 - 4 = 11. Réessaie !"
                  else "Vérifie la constante C : pour t=0, C + 3/2 = 2 implique C = 1/2."
                },
                fontSize = 12.sp,
                color = if (isCorrect) Color(0xFF065F46) else Color(0xFF991B1B),
                lineHeight = 16.sp
              )
            }
          }
        }

        Spacer(Modifier.height(18.dp))

        // Single primary action button per screen
        Button(
          onClick = {
            if (!hasChecked) {
              if (selectedChoice != -1) {
                hasChecked = true
              }
            } else {
              onMasteryEarned(isCorrect)
            }
          },
          enabled = selectedChoice != -1,
          shape = RoundedCornerShape(10.dp),
          colors = ButtonDefaults.buttonColors(containerColor = primaryColor),
          modifier = Modifier
            .fillMaxWidth()
            .height(46.dp)
            .testTag("primary_exercise_action_btn")
        ) {
          Text(
            if (!hasChecked) "Vérifier la réponse" else "Continuer ➔",
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White
          )
        }
      }
    }
  )
}
