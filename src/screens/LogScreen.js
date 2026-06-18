import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font } from '../theme';
import { appendLog, loadLogs } from '../utils/storage';
import { getTodaySession, swapExercise } from '../utils/workoutData';

export default function LogScreen({ navigation, route, profile }) {
  const passedSession = route?.params?.session;
  const today = passedSession || getTodaySession(profile?.split || 'ppl');

  const [exercises, setExercises] = useState(
    today.exercises.map((ex) => ({ ...ex, weight: String(ex.defaultWeight || ex.weight || 0), notes: '' }))
  );
  const [saving, setSaving] = useState(false);

  function updateWeight(i, val) {
    setExercises((prev) => { const next = [...prev]; next[i] = { ...next[i], weight: val }; return next; });
  }
  function updateNotes(i, val) {
    setExercises((prev) => { const next = [...prev]; next[i] = { ...next[i], notes: val }; return next; });
  }
  function incrementWeight(i, delta) {
    setExercises((prev) => {
      const next = [...prev];
      const cur = parseFloat(next[i].weight) || 0;
      next[i] = { ...next[i], weight: String(Math.max(0, cur + delta)) };
      return next;
    });
  }

  function handleSwap(i) {
    const ex = exercises[i];
    const newEx = swapExercise(ex.name, profile?.split || 'ppl', today.label);
    if (newEx) {
      setExercises((prev) => {
        const next = [...prev];
        next[i] = { ...newEx, weight: '0', notes: '' };
        return next;
      });
    } else {
      Alert.alert('No alternatives found', 'Try choosing a different exercise to swap.');
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const allLogs = await loadLogs();
      const session = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        label: today.label,
        exercises: exercises.map((ex) => {
          const prev = allLogs.find((l) => l.exercises?.find((e) => e.name === ex.name));
          const prevEx = prev?.exercises?.find((e) => e.name === ex.name);
          const prevWeight = prevEx ? parseFloat(prevEx.weight) : 0;
          const curWeight = parseFloat(ex.weight) || 0;
          return { name: ex.name, sets: ex.sets, reps: ex.reps, weight: curWeight, notes: ex.notes, isPR: curWeight > prevWeight };
        }),
      };
      await appendLog(session);
      Alert.alert('Session saved! 💪', `${exercises.length} exercises logged.`, [
        { text: 'View progress', onPress: () => navigation.navigate('Progress') },
        { text: 'Done', style: 'cancel' },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Could not save session.');
    }
    setSaving(false);
  }

  if (today.label === 'Rest') {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.restContainer}>
          <Text style={{ fontSize: 64 }}>🛌</Text>
          <Text style={s.restTitle}>Rest day</Text>
          <Text style={s.restSub}>Recovery is where gains happen. Come back tomorrow!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={s.header}>
          <View>
            <Text style={s.sessionLabel}>{today.label}</Text>
            <Text style={s.dateText}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</Text>
          </View>
          <View style={[s.badge, { backgroundColor: colors.accentBg }]}>
            <Text style={[s.badgeText, { color: colors.accent }]}>{exercises.length} exercises</Text>
          </View>
        </View>

        <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 100 }}>
          {exercises.map((ex, i) => (
            <View key={i} style={s.exCard}>
              <View style={s.exHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={s.exMuscle}>{ex.muscle?.toUpperCase() || 'COMPOUND'}</Text>
                  <Text style={s.exName}>{ex.name}</Text>
                  <Text style={s.exMeta}>{ex.sets} sets · {ex.reps} reps</Text>
                </View>
                <TouchableOpacity style={s.swapBtn} onPress={() => handleSwap(i)}>
                  <Ionicons name="swap-horizontal" size={18} color={colors.accent} />
                </TouchableOpacity>
              </View>
              <View style={s.weightRow}>
                <TouchableOpacity style={s.adjBtn} onPress={() => incrementWeight(i, -2.5)}>
                  <Ionicons name="remove" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
                <View style={s.weightInput}>
                  <TextInput
                    style={s.weightText}
                    value={ex.weight}
                    onChangeText={(v) => updateWeight(i, v)}
                    keyboardType="decimal-pad"
                    selectTextOnFocus
                  />
                  <Text style={s.weightUnit}>kg</Text>
                </View>
                <TouchableOpacity style={s.adjBtn} onPress={() => incrementWeight(i, 2.5)}>
                  <Ionicons name="add" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={s.notesInput}
                value={ex.notes}
                onChangeText={(v) => updateNotes(i, v)}
                placeholder="Notes (optional, e.g. felt strong today)"
                placeholderTextColor={colors.textTertiary}
                multiline
              />
            </View>
          ))}
        </ScrollView>

        <View style={s.footer}>
          <TouchableOpacity style={[s.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
            <Ionicons name="checkmark-done" size={20} color="#fff" />
            <Text style={s.saveBtnText}>{saving ? 'Saving…' : 'Save session'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  sessionLabel: { fontSize: font.xl, fontWeight: '700', color: colors.textPrimary },
  dateText: { fontSize: font.sm, color: colors.textSecondary, marginTop: 2 },
  badge: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.full },
  badgeText: { fontSize: font.sm, fontWeight: '600' },
  scroll: { flex: 1, padding: spacing.lg },
  exCard: { backgroundColor: colors.bg2, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 0.5, borderColor: colors.border },
  exHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg },
  exMuscle: { fontSize: 9, color: colors.accent, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  exName: { fontSize: font.md, fontWeight: '600', color: colors.textPrimary },
  exMeta: { fontSize: font.sm, color: colors.textSecondary, marginTop: 2 },
  swapBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bg3, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: colors.border },
  weightRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  adjBtn: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.bg3, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: colors.border },
  weightInput: { flex: 1, backgroundColor: colors.bg3, borderRadius: radius.md, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: colors.border },
  weightText: { fontSize: font.xxl, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', minWidth: 60 },
  weightUnit: { fontSize: font.md, color: colors.textSecondary, marginLeft: 6 },
  notesInput: { backgroundColor: colors.bg3, borderRadius: radius.md, padding: spacing.md, fontSize: font.sm, color: colors.textPrimary, borderWidth: 0.5, borderColor: colors.border, minHeight: 40 },
  footer: { padding: spacing.lg, borderTopWidth: 0.5, borderTopColor: colors.border, backgroundColor: colors.bg0 },
  saveBtn: { backgroundColor: colors.accent, borderRadius: radius.lg, padding: spacing.lg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.sm },
  saveBtnText: { fontSize: font.md, fontWeight: '600', color: '#fff' },
  restContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl, gap: spacing.lg },
  restTitle: { fontSize: font.xxl, fontWeight: '700', color: colors.textPrimary },
  restSub: { fontSize: font.md, color: colors.textSecondary, textAlign: 'center' },
});
