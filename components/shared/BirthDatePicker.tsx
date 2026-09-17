import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText.tsx';
import { useTheme } from '../../theme/ThemeProvider.tsx';
import {
  calculateAgeFromBirthDate,
  resolveAgeBandSafe,
  isParentContactRequired,
  isValidStudentAge,
} from '../../lib/themeResolver.ts';

interface BirthDatePickerProps {
  value: string; // 'YYYY-MM-DD'
  onChange: (birthDateStr: string, computedAge: number) => void;
  style?: object;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function BirthDatePicker({ value, onChange, style }: BirthDatePickerProps) {
  const { theme } = useTheme();

  // Parse existing date or fallback
  const parsedDate = new Date(value || '2016-09-01');
  const validParsed = !isNaN(parsedDate.getTime()) ? parsedDate : new Date('2016-09-01');

  const [selectedYear, setSelectedYear] = useState<number>(validParsed.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(validParsed.getMonth() + 1); // 1-12
  const [selectedDay, setSelectedDay] = useState<number>(validParsed.getDate());

  const currentYear = new Date().getFullYear();
  // Valid student ages: 6 to 19 => years between (currentYear - 19) and (currentYear - 6)
  const years: number[] = [];
  for (let y = currentYear - 6; y >= currentYear - 19; y--) {
    years.push(y);
  }

  // Days in selected month/year
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const days: number[] = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Compute date string and age
  const formatIsoDate = (y: number, m: number, d: number) => {
    const mm = String(m).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const currentDateString = formatIsoDate(selectedYear, selectedMonth, Math.min(selectedDay, daysInMonth));
  const computedAge = calculateAgeFromBirthDate(currentDateString);
  const band = resolveAgeBandSafe(computedAge);
  const needsParent = isParentContactRequired(computedAge);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    const newDateStr = formatIsoDate(year, selectedMonth, Math.min(selectedDay, daysInMonth));
    onChange(newDateStr, calculateAgeFromBirthDate(newDateStr));
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    const maxDays = new Date(selectedYear, month, 0).getDate();
    const clampedDay = Math.min(selectedDay, maxDays);
    setSelectedDay(clampedDay);
    const newDateStr = formatIsoDate(selectedYear, month, clampedDay);
    onChange(newDateStr, calculateAgeFromBirthDate(newDateStr));
  };

  const handleDayChange = (day: number) => {
    setSelectedDay(day);
    const newDateStr = formatIsoDate(selectedYear, selectedMonth, day);
    onChange(newDateStr, calculateAgeFromBirthDate(newDateStr));
  };

  // Preset quick-pick for demo convenience
  const applyPreset = (targetAge: number) => {
    const yr = currentYear - targetAge;
    const mo = 9; // September
    const dy = 1;
    setSelectedYear(yr);
    setSelectedMonth(mo);
    setSelectedDay(dy);
    const dateStr = formatIsoDate(yr, mo, dy);
    onChange(dateStr, targetAge);
  };

  const bandBadges = {
    BAND_A: { name: 'Band A • The Explorers (Ages 6–9)', color: '#FF6B4A', icon: '🎨' },
    BAND_B: { name: 'Band B • The Adventurers (Ages 10–13)', color: '#4F46E5', icon: '⚡' },
    BAND_C: { name: 'Band C • The Scholars (Ages 14–19)', color: '#0F172A', icon: '🎓' },
  };

  const currentBadge = bandBadges[band];

  return (
    <View style={[styles.container, style]}>
      <ThemedText variant="label" style={{ color: theme.colors.textMuted, marginBottom: 6 }}>
        STUDENT BIRTHDATE
      </ThemedText>

      {/* Date display & Computed Age summary pill */}
      <View style={[styles.summaryBox, { backgroundColor: theme.colors.surface, borderColor: currentBadge.color }]}>
        <View style={styles.summaryHeader}>
          <ThemedText variant="bodyBold" style={{ color: theme.colors.text }}>
            📅 {currentDateString}
          </ThemedText>
          <View style={[styles.ageBadge, { backgroundColor: currentBadge.color }]}>
            <ThemedText variant="label" style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
              {computedAge} YEARS OLD
            </ThemedText>
          </View>
        </View>

        <View style={styles.bandBanner}>
          <ThemedText variant="caption" style={{ color: currentBadge.color, fontWeight: '700' }}>
            {currentBadge.icon} Assigned to {currentBadge.name}
          </ThemedText>
        </View>

        {needsParent && (
          <View style={styles.childSafetyWarning}>
            <ThemedText variant="caption" style={{ color: '#D97706', fontWeight: '600' }}>
              🛡️ Child Safety Notice: Age is under 13. Parent/Guardian contact details are required below.
            </ThemedText>
          </View>
        )}
      </View>

      {/* Quick age preset buttons */}
      <View style={styles.presetRow}>
        <ThemedText variant="caption" style={{ color: theme.colors.textMuted, marginRight: 6, alignSelf: 'center' }}>
          Quick:
        </ThemedText>
        <TouchableOpacity
          style={[styles.presetBtn, computedAge === 7 && styles.presetBtnActive]}
          onPress={() => applyPreset(7)}
        >
          <ThemedText variant="caption" style={{ color: computedAge === 7 ? '#FFF' : theme.colors.text }}>
            Age 7 (Band A)
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.presetBtn, computedAge === 11 && styles.presetBtnActive]}
          onPress={() => applyPreset(11)}
        >
          <ThemedText variant="caption" style={{ color: computedAge === 11 ? '#FFF' : theme.colors.text }}>
            Age 11 (Band B)
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.presetBtn, computedAge === 16 && styles.presetBtnActive]}
          onPress={() => applyPreset(16)}
        >
          <ThemedText variant="caption" style={{ color: computedAge === 16 ? '#FFF' : theme.colors.text }}>
            Age 16 (Band C)
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Selectors for Year, Month, Day */}
      <ThemedText variant="caption" style={{ color: theme.colors.textMuted, marginTop: 10, marginBottom: 4 }}>
        Select Year:
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSelector}>
        {years.map((y) => {
          const isSelected = y === selectedYear;
          return (
            <TouchableOpacity
              key={y}
              onPress={() => handleYearChange(y)}
              style={[
                styles.selectorPill,
                { borderColor: theme.colors.outline },
                isSelected && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
              ]}
            >
              <ThemedText
                variant="label"
                style={{ color: isSelected ? '#FFFFFF' : theme.colors.text, fontWeight: isSelected ? '700' : '500' }}
              >
                {y}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ThemedText variant="caption" style={{ color: theme.colors.textMuted, marginTop: 8, marginBottom: 4 }}>
        Select Month:
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSelector}>
        {MONTH_NAMES.map((name, idx) => {
          const monthNum = idx + 1;
          const isSelected = monthNum === selectedMonth;
          return (
            <TouchableOpacity
              key={name}
              onPress={() => handleMonthChange(monthNum)}
              style={[
                styles.selectorPill,
                { borderColor: theme.colors.outline },
                isSelected && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
              ]}
            >
              <ThemedText
                variant="label"
                style={{ color: isSelected ? '#FFFFFF' : theme.colors.text, fontWeight: isSelected ? '700' : '500' }}
              >
                {name.slice(0, 3)}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ThemedText variant="caption" style={{ color: theme.colors.textMuted, marginTop: 8, marginBottom: 4 }}>
        Select Day:
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSelector}>
        {days.map((d) => {
          const isSelected = d === selectedDay;
          return (
            <TouchableOpacity
              key={d}
              onPress={() => handleDayChange(d)}
              style={[
                styles.selectorPill,
                styles.dayPill,
                { borderColor: theme.colors.outline },
                isSelected && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
              ]}
            >
              <ThemedText
                variant="label"
                style={{ color: isSelected ? '#FFFFFF' : theme.colors.text, fontWeight: isSelected ? '700' : '500' }}
              >
                {d}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  summaryBox: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 2,
    marginBottom: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bandBanner: {
    marginTop: 6,
  },
  childSafetyWarning: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
  },
  presetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 6,
  },
  presetBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  presetBtnActive: {
    backgroundColor: '#4F46E5',
  },
  scrollSelector: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  selectorPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 6,
    backgroundColor: '#F8FAFC',
  },
  dayPill: {
    minWidth: 36,
    alignItems: 'center',
  },
});
