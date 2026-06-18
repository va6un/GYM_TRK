import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font } from '../theme';
import { loadLogs } from '../utils/storage';
import { getTodaySession, SPLITS } from '../utils/workoutData';
import { useFocusEffect } from '@react-navigation/native';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HomeScreen({ navigation, profile }) {
  const [logs, setLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [today, setToday] = useState({ label: 'Rest', exercises: [] });
  const splitData = SPLITS.find((s) => s.id === (profile?.split || 'ppl'));
  const todayIdx = new Date().getDay();

  useFocusEffect(useCallback(() => {
    fetchLogs();
    fetchToday();
  }, [profile?.split]));

  async function fetchLogs() {
    const l = await loadLogs();
    setLogs(l);
  }

  async function fetchToday(force = false) {
    const t = await getTodaySession(profile?.split || 'ppl', force);
    setToday(t);
  }

  const weekLogs = {};
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - todayIdx);
  logs.forEach((log) => {
    const d = new Date(log.date);
    if (d >= startOfWeek) {
      weekLogs[new Date(log.date).getDay()] = log.label;
    }
  });

  const streak = (() => {
    let s = 0;
    const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
    let prev = new Date(); prev.setHours(0,0,0,0);
    for (const log of sorted) {
      const d = new Date(log.date); d.setHours(0,0,0,0);
      const diff = (prev - d) / 86400000;
      if (diff <= 1) { s++; prev = d; } else break;
    }
    return s;
  })();

  const recentPRs = logs
    .flatMap((l) => (l.exercises || []).filter((e) => e.isPR).map((e) => ({ ...e, date: l.date })))
    .slice(0, 3);

  const firstName = (profile?.name || 'Athlete').split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await Promise.all([fetchLogs(), fetchToday()]); setRefreshing(false); }} tintColor={colors.accent} />}>
        <View style={s.topBar}>
          <View>
            <Text style={s.greeting}>{greeting}, {firstName} 👋</Text>
            <Text style={s.sub}>{DAYS[todayIdx]} · {splitData?.days[todayIdx] || 'Rest Day'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{(profile?.name || 'A').charAt(0).toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statVal}>{streak}</Text>
            <Text style={s.statLabel}>Day streak 🔥</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statVal}>{logs.length}</Text>
            <Text style={s.statLabel}>Total sessions</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statVal}>{recentPRs.length}</Text>
            <Text style={s.statLabel}>PRs this week</Text>
          </View>
        </View>

        {/* Weekly strip */}
        <View style={s.weekCard}>
          <Text style={s.cardLabel}>THIS WEEK</Text>
          <View style={s.weekRow}>
            {DAYS.map((d, i) => {
              const dayLabel = splitData?.days[i] || 'Rest';
              const isDone = !!weekLogs[i];
              const isToday = i === todayIdx;
              const isRest = dayLabel === 'Rest';
              return (
                <View key={i} style={[s.dayCircle, isToday && s.dayToday, isDone && s.dayDone]}>
                  <Text style={[s.dayLetter, isToday && s.dayLetterToday, isDone && s.dayLetterDone]}>{d[0]}</Text>
                  {isDone ? <Ionicons name="checkmark" size={10} color="#fff" /> : isRest ? <Text style={{ fontSize: 9 }}>🛌</Text> : <Text style={[s.dayTag, isToday && { color: colors.accent }]}>{dayLabel.slice(0, 2)}</Text>}
                </View>
              );
            })}
          </View>
        </View>

        {/* Today's recommendation */}
        {today.label !== 'Rest' ? (
          <TouchableOpacity style={s.todayCard} onPress={() => navigation.navigate('Log', { session: today })}>
            <View style={s.todayTop}>
              <View style={{ flex: 1 }}>
                <View style={s.labelRow}>
                  <Text style={s.todayEye}>TODAY'S SESSION</Text>
                  <TouchableOpacity onPress={() => fetchToday(true)} style={s.shuffleBtn}>
                    <Ionicons name="shuffle" size={14} color={colors.accent} />
                    <Text style={s.shuffleText}>Shuffle</Text>
                  </TouchableOpacity>
                </View>
                <Text style={s.todayTitle}>{today.label.split('_').join(' ')}</Text>
                <Text style={s.todaySub}>{today.exercises.length} exercises · ~{today.exercises.length * 10} min</Text>
              </View>
              <View style={s.startBtn}>
                <Ionicons name="play" size={18} color="#fff" />
              </View>
            </View>
            <View style={s.exercisePreview}>
              {today.exercises.slice(0, 3).map((ex, i) => (
                <View key={i} style={s.previewRow}>
                  <View style={s.previewDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.previewText}>{ex.name}</Text>
                    <Text style={s.previewMuscle}>{ex.muscle || 'Compound'}</Text>
                  </View>
                  <Text style={s.previewMeta}>{ex.sets}×{ex.reps}</Text>
                </View>
              ))}
              {today.exercises.length > 3 && (
                <Text style={s.moreText}>+{today.exercises.length - 3} more exercises →</Text>
              )}
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[s.todayCard, { borderColor: colors.border }]}>
            <Text style={s.todayEye}>TODAY</Text>
            <Text style={s.todayTitle}>Rest Day 🛌</Text>
            <Text style={s.todaySub}>Recovery is part of the program. See you tomorrow!</Text>
          </View>
        )}

        {/* Recent PRs */}
        {recentPRs.length > 0 && (
          <View style={s.card}>
            <Text style={s.cardLabel}>RECENT PRs 🏆</Text>
            {recentPRs.map((pr, i) => (
              <View key={i} style={[s.prRow, i < recentPRs.length - 1 && s.prBorder]}>
                <Text style={s.prName}>{pr.name}</Text>
                <Text style={s.prWeight}>{pr.weight} kg</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg0 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, paddingBottom: spacing.md },
  greeting: { fontSize: font.lg, fontWeight: '700', color: colors.textPrimary },
  sub: { fontSize: font.sm, color: colors.textSecondary, marginTop: 2 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accentBg, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: colors.accent },
  avatarText: { color: colors.accent, fontWeight: '700', fontSize: font.md },
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.md },
  statCard: { flex: 1, backgroundColor: colors.bg2, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', borderWidth: 0.5, borderColor: colors.border },
  statVal: { fontSize: font.xl, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 2, textAlign: 'center' },
  weekCard: { marginHorizontal: spacing.lg, backgroundColor: colors.bg2, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 0.5, borderColor: colors.border },
  cardLabel: { fontSize: font.xs, color: colors.textTertiary, letterSpacing: 0.8, marginBottom: spacing.md, fontWeight: '600' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCircle: { width: 40, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: colors.bg3, gap: 2 },
  dayToday: { backgroundColor: colors.accentBg, borderWidth: 1.5, borderColor: colors.accent },
  dayDone: { backgroundColor: colors.accent },
  dayLetter: { fontSize: 11, fontWeight: '600', color: colors.textTertiary },
  dayLetterToday: { color: colors.accent },
  dayLetterDone: { color: '#fff' },
  dayTag: { fontSize: 9, color: colors.textTertiary, fontWeight: '500' },
  todayCard: { marginHorizontal: spacing.lg, backgroundColor: colors.accentBg, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1.5, borderColor: colors.accentDim },
  todayTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  todayEye: { fontSize: font.xs, color: colors.accent, fontWeight: '600', letterSpacing: 0.8, marginBottom: 4 },
  todayTitle: { fontSize: font.xl, fontWeight: '700', color: colors.textPrimary },
  todaySub: { fontSize: font.sm, color: colors.textSecondary, marginTop: 2 },
  startBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center' },
  exercisePreview: { gap: 6 },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  previewDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  previewText: { fontSize: font.sm, color: colors.textPrimary },
  previewMuscle: { fontSize: 10, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5 },
  previewMeta: { fontSize: font.sm, color: colors.textTertiary },
  moreText: { fontSize: font.sm, color: colors.accent, marginTop: 4, fontWeight: '500' },
  card: { marginHorizontal: spacing.lg, backgroundColor: colors.bg2, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 0.5, borderColor: colors.border },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: 4 },
  shuffleBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg3, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, gap: 4 },
  shuffleText: { fontSize: 10, color: colors.accent, fontWeight: '600' },
  prRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  prBorder: { borderBottomWidth: 0.5, borderBottomColor: colors.border },
  prName: { fontSize: font.md, color: colors.textPrimary, fontWeight: '500' },
  prWeight: { fontSize: font.md, color: colors.green, fontWeight: '600' },
});
