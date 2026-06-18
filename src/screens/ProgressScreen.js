import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, font } from '../theme';
import { loadLogs } from '../utils/storage';
import { shareProgressData, shareAllData } from '../utils/export';

const W = Dimensions.get('window').width - 48;

export default function ProgressScreen() {
  const [logs, setLogs] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exporting, setExporting] = useState(false);

  useFocusEffect(useCallback(() => { fetchLogs(); }, []));

  async function fetchLogs() {
    const l = await loadLogs();
    setLogs(l);
  }

  // Build per-exercise weight history
  const exerciseMap = {};
  [...logs].reverse().forEach((session) => {
    (session.exercises || []).forEach((ex) => {
      if (!exerciseMap[ex.name]) exerciseMap[ex.name] = [];
      exerciseMap[ex.name].push({ date: session.date, weight: ex.weight });
    });
  });

  const exercises = Object.keys(exerciseMap);
  const sel = selectedExercise || exercises[0];
  const chartData = sel ? exerciseMap[sel]?.slice(-8) : [];

  // Weekly volume
  const weeklyVolume = (() => {
    const weeks = {};
    logs.forEach((session) => {
      const d = new Date(session.date);
      const weekStart = new Date(d); weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().split('T')[0];
      if (!weeks[key]) weeks[key] = 0;
      (session.exercises || []).forEach((ex) => { weeks[key] += (parseFloat(ex.weight) || 0) * ex.sets; });
    });
    return Object.entries(weeks).slice(-6).map(([k, v]) => ({ week: k.slice(5), volume: Math.round(v) }));
  })();

  async function handleExport(type) {
    setExporting(true);
    try {
      if (type === 'all') await shareAllData();
      else await shareProgressData();
    } catch (e) {
      Alert.alert('Export failed', e.message);
    }
    setExporting(false);
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={s.header}>
          <Text style={s.title}>Progress</Text>
          <View style={s.exportRow}>
            <TouchableOpacity style={s.exportBtn} onPress={() => handleExport('progress')} disabled={exporting}>
              {exporting ? <ActivityIndicator size="small" color={colors.accent} /> : <Ionicons name="download-outline" size={16} color={colors.accent} />}
              <Text style={s.exportText}>CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.exportBtn} onPress={() => handleExport('all')} disabled={exporting}>
              <Ionicons name="share-outline" size={16} color={colors.green} />
              <Text style={[s.exportText, { color: colors.green }]}>All data</Text>
            </TouchableOpacity>
          </View>
        </View>

        {logs.length === 0 ? (
          <View style={s.emptyState}>
            <Text style={{ fontSize: 48 }}>📊</Text>
            <Text style={s.emptyTitle}>No data yet</Text>
            <Text style={s.emptySub}>Log your first workout to start tracking progress</Text>
          </View>
        ) : (
          <>
            {/* Summary cards */}
            <View style={s.statsRow}>
              <View style={s.statCard}>
                <Text style={s.statVal}>{logs.length}</Text>
                <Text style={s.statLabel}>Sessions</Text>
              </View>
              <View style={s.statCard}>
                <Text style={[s.statVal, { color: colors.green }]}>{logs.flatMap((l) => l.exercises?.filter((e) => e.isPR) || []).length}</Text>
                <Text style={s.statLabel}>Total PRs</Text>
              </View>
              <View style={s.statCard}>
                <Text style={[s.statVal, { color: colors.amber }]}>{exercises.length}</Text>
                <Text style={s.statLabel}>Exercises</Text>
              </View>
            </View>

            {/* Strength chart */}
            {sel && chartData.length >= 2 && (
              <View style={s.card}>
                <Text style={s.cardLabel}>STRENGTH TREND</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
                  {exercises.map((ex) => (
                    <TouchableOpacity key={ex} style={[s.exPill, sel === ex && s.exPillActive]} onPress={() => setSelectedExercise(ex)}>
                      <Text style={[s.exPillText, sel === ex && s.exPillTextActive]}>{ex}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <LineChart
                  data={{
                    labels: chartData.map((d) => d.date.slice(5)),
                    datasets: [{ data: chartData.map((d) => d.weight || 0) }],
                  }}
                  width={W}
                  height={180}
                  chartConfig={{
                    backgroundColor: colors.bg2,
                    backgroundGradientFrom: colors.bg2,
                    backgroundGradientTo: colors.bg2,
                    decimalPlaces: 1,
                    color: () => colors.accent,
                    labelColor: () => colors.textTertiary,
                    propsForDots: { r: '5', strokeWidth: '2', stroke: colors.accent },
                  }}
                  bezier
                  style={{ borderRadius: radius.md }}
                  withInnerLines={false}
                />
                <View style={s.chartFooter}>
                  <Text style={s.chartStat}>Start: <Text style={{ color: colors.textPrimary }}>{chartData[0]?.weight} kg</Text></Text>
                  <Text style={s.chartStat}>Now: <Text style={{ color: colors.green }}>{chartData[chartData.length - 1]?.weight} kg</Text></Text>
                  <Text style={s.chartStat}>Gain: <Text style={{ color: colors.green }}>+{(chartData[chartData.length - 1]?.weight - chartData[0]?.weight).toFixed(1)} kg</Text></Text>
                </View>
              </View>
            )}

            {/* Weekly volume */}
            {weeklyVolume.length > 0 && (
              <View style={s.card}>
                <Text style={s.cardLabel}>WEEKLY VOLUME (kg × sets)</Text>
                {weeklyVolume.map((w, i) => {
                  const max = Math.max(...weeklyVolume.map((x) => x.volume));
                  const pct = max > 0 ? w.volume / max : 0;
                  return (
                    <View key={i} style={s.volumeRow}>
                      <Text style={s.weekLabel}>Wk {w.week}</Text>
                      <View style={s.barTrack}>
                        <View style={[s.barFill, { width: `${pct * 100}%` }]} />
                      </View>
                      <Text style={s.volVal}>{w.volume.toLocaleString()}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Per-exercise PRs */}
            <View style={s.card}>
              <Text style={s.cardLabel}>PERSONAL BESTS</Text>
              {exercises.slice(0, 10).map((ex) => {
                const history = exerciseMap[ex];
                const best = Math.max(...history.map((h) => h.weight));
                const first = history[0]?.weight || 0;
                const pct = first > 0 ? (((best - first) / first) * 100).toFixed(0) : 0;
                return (
                  <View key={ex} style={s.prRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.prName}>{ex}</Text>
                      <Text style={s.prSub}>{history.length} sessions</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={s.prWeight}>{best} kg</Text>
                      {pct > 0 && <Text style={s.prChange}>↑ {pct}%</Text>}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Session history */}
            <View style={s.card}>
              <Text style={s.cardLabel}>SESSION HISTORY</Text>
              {logs.slice(0, 10).map((session, i) => (
                <View key={i} style={[s.histRow, i < Math.min(logs.length, 10) - 1 && s.histBorder]}>
                  <View style={s.histDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.histLabel}>{session.label}</Text>
                    <Text style={s.histDate}>{new Date(session.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={s.histCount}>{session.exercises?.length || 0} exercises</Text>
                    {session.exercises?.some((e) => e.isPR) && (
                      <Text style={s.prBadge}>🏆 PR</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg },
  title: { fontSize: font.xl, fontWeight: '700', color: colors.textPrimary },
  exportRow: { flexDirection: 'row', gap: spacing.sm },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.bg2, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 0.5, borderColor: colors.border },
  exportText: { fontSize: font.sm, color: colors.accent, fontWeight: '600' },
  emptyState: { alignItems: 'center', padding: spacing.xxl, gap: spacing.md },
  emptyTitle: { fontSize: font.xl, fontWeight: '700', color: colors.textPrimary },
  emptySub: { fontSize: font.md, color: colors.textSecondary, textAlign: 'center' },
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.md },
  statCard: { flex: 1, backgroundColor: colors.bg2, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', borderWidth: 0.5, borderColor: colors.border },
  statVal: { fontSize: font.xl, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 2 },
  card: { marginHorizontal: spacing.lg, backgroundColor: colors.bg2, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 0.5, borderColor: colors.border },
  cardLabel: { fontSize: font.xs, color: colors.textTertiary, letterSpacing: 0.8, marginBottom: spacing.md, fontWeight: '600' },
  exPill: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.full, backgroundColor: colors.bg3, marginRight: spacing.sm, borderWidth: 0.5, borderColor: colors.border },
  exPillActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  exPillText: { fontSize: font.sm, color: colors.textSecondary, fontWeight: '500' },
  exPillTextActive: { color: colors.accent },
  chartFooter: { flexDirection: 'row', justifyContent: 'space-around', marginTop: spacing.md },
  chartStat: { fontSize: font.sm, color: colors.textSecondary },
  volumeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  weekLabel: { fontSize: 11, color: colors.textSecondary, width: 50 },
  barTrack: { flex: 1, height: 8, backgroundColor: colors.bg3, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 4 },
  volVal: { fontSize: 11, color: colors.textPrimary, width: 55, textAlign: 'right' },
  prRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  prName: { fontSize: font.sm, fontWeight: '500', color: colors.textPrimary },
  prSub: { fontSize: font.xs, color: colors.textTertiary, marginTop: 2 },
  prWeight: { fontSize: font.md, fontWeight: '700', color: colors.accent },
  prChange: { fontSize: font.xs, color: colors.green, marginTop: 2 },
  histRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.md },
  histBorder: { borderBottomWidth: 0.5, borderBottomColor: colors.border },
  histDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  histLabel: { fontSize: font.sm, fontWeight: '500', color: colors.textPrimary },
  histDate: { fontSize: font.xs, color: colors.textSecondary, marginTop: 2 },
  histCount: { fontSize: font.xs, color: colors.textTertiary },
  prBadge: { fontSize: font.xs, marginTop: 2 },
});
