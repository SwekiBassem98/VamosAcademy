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

// Mastery levels directly matching Khan Academy pattern
enum class MasteryLevel(val label: String, val levelIndex: Int) {
  NOT_STARTED("Not started", 0),
  FAMILIAR("Familiar", 1),
  PROFICIENT("Proficient", 2),
  MASTERED("Mastered", 3);

  val color: Color
    get() = when (this) {
      NOT_STARTED -> Color(0xFF94A3B8)
      FAMILIAR -> Color(0xFFF59E0B)
      PROFICIENT -> Color(0xFF0284C7)
      MASTERED -> Color(0xFF10B981)
    }
}

data class KhanSkill(
  val id: String,
  val title: String,
  val mastery: MasteryLevel,
  val points: Int = 100
)

data class KhanUnit(
  val id: String,
  val title: String,
  val description: String,
  val skills: List<KhanSkill>
) {
  val masteryPercent: Int
    get() {
      if (skills.isEmpty()) return 0
      val totalPossible = skills.size * 3
      val currentTotal = skills.sumOf { it.mastery.levelIndex }
      return (currentTotal * 100) / totalPossible
    }
}

data class KhanSubject(
  val id: String,
  val title: String,
  val code: String,
  val icon: String,
  val units: List<KhanUnit>
)

// Shared mock curriculum reflecting real Tunisian middle & high school curricula
val sampleKhanSubjectsBandB = listOf(
  KhanSubject(
    id = "math_7b",
    title = "Mathématiques (7ème de Base)",
    code = "MATH-7",
    icon = "📐",
    units = listOf(
      KhanUnit(
        id = "u1_alg",
        title = "Unité 1 : Nombres relatifs et fractions",
        description = "Opérations, priorités opératoires et simplifications rationnelles.",
        skills = listOf(
          KhanSkill("s1", "Addition et soustraction de relatifs", MasteryLevel.MASTERED),
          KhanSkill("s2", "Multiplication de fractions rationnelles", MasteryLevel.PROFICIENT),
          KhanSkill("s3", "Priorités de calcul et parenthèses", MasteryLevel.FAMILIAR),
          KhanSkill("s4", "Résolution d'équations simples ax = b", MasteryLevel.NOT_STARTED)
        )
      ),
      KhanUnit(
        id = "u2_geom",
        title = "Unité 2 : Géométrie et Théorème de Pythagore",
        description = "Triangles rectangles, calculs de longueurs et racine carrée.",
        skills = listOf(
          KhanSkill("s5", "Identifier l'hypoténuse d'un triangle", MasteryLevel.MASTERED),
          KhanSkill("s6", "Calcul de la longueur d'un côté", MasteryLevel.PROFICIENT),
          KhanSkill("s7", "Réciproque du théorème de Pythagore", MasteryLevel.NOT_STARTED)
        )
      ),
      KhanUnit(
        id = "u3_data",
        title = "Unité 3 : Statistiques & Graphiques",
        description = "Effectifs, moyennes pondérées et diagrammes circulaires.",
        skills = listOf(
          KhanSkill("s8", "Calculer une moyenne pondérée", MasteryLevel.FAMILIAR),
          KhanSkill("s9", "Interprétation d'un diagramme en bâtons", MasteryLevel.NOT_STARTED)
        )
      )
    )
  ),
  KhanSubject(
    id = "sci_7b",
    title = "Sciences de la Vie et de la Terre",
    code = "SVT-7",
    icon = "🔬",
    units = listOf(
      KhanUnit(
        id = "u_svt1",
        title = "Unité 1 : Les écosystèmes méditerranéens",
        description = "Biodiversité littorale et chaînes trophiques en Tunisie.",
        skills = listOf(
          KhanSkill("s_svt1", "Producteurs primaires et photosynthèse", MasteryLevel.MASTERED),
          KhanSkill("s_svt2", "Réseaux trophiques et pyramides d'énergie", MasteryLevel.PROFICIENT),
          KhanSkill("s_svt3", "Impact de la désertification et régénération", MasteryLevel.FAMILIAR)
        )
      )
    )
  ),
  KhanSubject(
    id = "lang_7b",
    title = "Anglais & Français Académique",
    code = "LANG-7",
    icon = "📖",
    units = listOf(
      KhanUnit(
        id = "u_lang1",
        title = "Unité 1 : Grammaire et Syntaxe Complexe",
        description = "Subordonnées relatives, temps du passé et connecteurs logiques.",
        skills = listOf(
          KhanSkill("s_l1", "Past Continuous vs Past Simple", MasteryLevel.PROFICIENT),
          KhanSkill("s_l2", "Relative pronouns: who, which, whose", MasteryLevel.FAMILIAR),
          KhanSkill("s_l3", "Logical connectors: however, furthermore", MasteryLevel.NOT_STARTED)
        )
      )
    )
  )
)

val sampleKhanSubjectsBandC = listOf(
  KhanSubject(
    id = "math_bac",
    title = "Mathématiques (Baccalauréat Scientifique)",
    code = "MATH-BAC",
    icon = "∫",
    units = listOf(
      KhanUnit(
        id = "u_ana",
        title = "Unité 1 : Analyse Réelle & Équations Différentielles",
        description = "Limites, continuité, dérivabilité et équations différentielles linéaires.",
        skills = listOf(
          KhanSkill("s_c1", "Limites de formes indéterminées (Règle de L'Hôpital)", MasteryLevel.MASTERED),
          KhanSkill("s_c2", "Théorème des Valeurs Intermédiaires (TVI)", MasteryLevel.PROFICIENT),
          KhanSkill("s_c3", "Résolution de y' + ay = b avec condition initiale", MasteryLevel.PROFICIENT),
          KhanSkill("s_c4", "Intégration par parties et calcul de primitives", MasteryLevel.FAMILIAR)
        )
      ),
      KhanUnit(
        id = "u_cpx",
        title = "Unité 2 : Nombres Complexes & Trigonométrie",
        description = "Forme algébrique, exponentielle et applications géométriques.",
        skills = listOf(
          KhanSkill("s_c5", "Formule d'Euler et de Moivre", MasteryLevel.MASTERED),
          KhanSkill("s_c6", "Racines n-ièmes de l'unité", MasteryLevel.FAMILIAR),
          KhanSkill("s_c7", "Transformations complexes du plan (rotations, homothéties)", MasteryLevel.NOT_STARTED)
        )
      ),
      KhanUnit(
        id = "u_prob",
        title = "Unité 3 : Probabilités et Lois Continues",
        description = "Probabilités conditionnelles, loi binomiale et loi normale.",
        skills = listOf(
          KhanSkill("s_c8", "Formule de Bayes et arbres pondérés", MasteryLevel.PROFICIENT),
          KhanSkill("s_c9", "Loi normale centrée réduite et approximations", MasteryLevel.NOT_STARTED)
        )
      )
    )
  ),
  KhanSubject(
    id = "phys_bac",
    title = "Physique & Chimie Appliquée",
    code = "PHYS-BAC",
    icon = "⚛",
    units = listOf(
      KhanUnit(
        id = "u_phys1",
        title = "Unité 1 : Circuits Électriques RLC & Oscillations",
        description = "Régime transitoire, résonance d'intensité et équations différentielles du 2nd ordre.",
        skills = listOf(
          KhanSkill("s_p1", "Constante de temps tau dans un circuit RC", MasteryLevel.MASTERED),
          KhanSkill("s_p2", "Oscillations libres amorties dans un circuit RLC", MasteryLevel.PROFICIENT),
          KhanSkill("s_p3", "Calcul de la fréquence propre de résonance", MasteryLevel.FAMILIAR)
        )
      )
    )
  ),
  KhanSubject(
    id = "algo_bac",
    title = "Algorithmique & Structures de Données",
    code = "ALGO-BAC",
    icon = "⌨",
    units = listOf(
      KhanUnit(
        id = "u_algo1",
        title = "Unité 1 : Récursivité et Tri Avancé",
        description = "Tri fusion, tri rapide et analyse de complexité asymptotique O(n log n).",
        skills = listOf(
          KhanSkill("s_a1", "Tracé d'arbres d'appels récursifs", MasteryLevel.MASTERED),
          KhanSkill("s_a2", "Implémentation du partitionnement QuickSort", MasteryLevel.FAMILIAR),
          KhanSkill("s_a3", "Résolution de relations de récurrence (Master Theorem)", MasteryLevel.NOT_STARTED)
        )
      )
    )
  )
)

/**
 * 4-Segment Mastery Indicator matching Khan Academy visual standard
 * (Gray, Amber, Blue, Emerald)
 */
@Composable
fun KhanMasteryIndicator(mastery: MasteryLevel, modifier: Modifier = Modifier) {
  Row(
    modifier = modifier,
    horizontalArrangement = Arrangement.spacedBy(3.dp),
    verticalAlignment = Alignment.CenterVertically
  ) {
    for (i in 1..3) {
      val isFilled = mastery.levelIndex >= i
      val segmentColor = when {
        !isFilled -> Color(0xFFE2E8F0)
        mastery == MasteryLevel.FAMILIAR -> Color(0xFFF59E0B)
        mastery == MasteryLevel.PROFICIENT -> Color(0xFF0284C7)
        else -> Color(0xFF10B981)
      }
      Box(
        modifier = Modifier
          .width(12.dp)
          .height(5.dp)
          .clip(RoundedCornerShape(2.dp))
          .background(segmentColor)
      )
    }
    Spacer(Modifier.width(4.dp))
    Text(
      mastery.label,
      fontSize = 11.sp,
      fontWeight = FontWeight.SemiBold,
      color = mastery.color
    )
  }
}
