import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font } from '../theme';
import { saveProfile, saveCustomExercises, loadCustomExercises } from '../utils/storage';
import { SPLITS, MUSCLE_MAPPING } from '../utils/workoutData';
import { shareAllData } from '../utils/export';

export default function ProfileScreen({ profile, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const [customItems, setCustomItems] = useState([]);
  const [newExName, setNewExName] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  React.useEffect(() => {
    loadCustomExercises().then(setCustomItems);
  }, []);

  const bmi = form.weight && form.height
    ? (form.weight / ((form.height / 100) ** 2)).toFixed(1) : '—';
  const bmiCat = bmi !== '—'
    ? bmi < 18.5 ? { label: 'Underweight', color: colors.amber }
      : bmi < 25 ? { label: 'Normal', color: colors.green }
      : bmi < 30 ? { label: 'Overweight', color: colors.amber }
      : { label: 'Obese', color: colors.red }
    : null;

  async function handleSave() {
    await saveProfile(form);
    await saveCustomExercises(customItems);
    onUpdate(form);
    setEditing(false);
    Alert.alert('Saved!', 'Your profile and custom exercises have been updated.');
  }

  function addCustomExercise() {
    if (!newExName || !selectedDay) return;
    const newItem = {
      id: Date.now().toString(),
      name: newExName,
      dayLabel: selectedDay,
      splitId: form.split || profile?.split
    };
    setCustomItems([...customItems, newItem]);
    setNewExName('');
  }

  function removeCustomExercise(id) {
    setCustomItems(customItems.filter(i => i.id !== id));
  }

  const splitData = SPLITS.find((s) => s.id === (form.split || profile?.split));

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={s.header}>
          <Text style={s.title}>Profile</Text>
          <TouchableOpacity onPress={() => editing ? handleSave() : setEditing(true)} style={s.editBtn}>
            <Ionicons name={editing ? 'checkmark' : 'pencil'} size={16} color={colors.accent} />
            <Text style={s.editText}>{editing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar + name */}
        <View style={s.avatarSection}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{(profile?.name || 'A').charAt(0).toUpperCase()}</Text>
          </View>
          {editing ? (
            <TextInput style={s.nameInput} value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Your name" placeholderTextColor={colors.textTertiary} />
          ) : (
            <Text style={s.name}>{profile?.name}</Text>
          )}
          <Text style={s.splitBadge}>{splitData?.name || 'PPL'}</Text>
        </View>

        {/* BMI card */}
        <View style={[s.card, bmiCat && { borderColor: bmiCat.color, borderWidth: 1 }]}>
          <Text style={s.cardLabel}>BMI</Text>
          <View style={s.bmiRow}>
            <Text style={[s.bmiVal, bmiCat && { color: bmiCat.color }]}>{bmi}</Text>
            {bmiCat && <View style={[s.bmiPill, { backgroundColor: bmiCat.color + '22' }]}>
              <Text style={[s.bmiPillText, { color: bmiCat.color }]}>{bmiCat.label}</Text>
            </View>}
          </View>
        </View>

        {/* Body stats */}
        <View style={s.card}>
          <Text style={s.cardLabel}>BODY STATS</Text>
          {[
            { label: 'Age', key: 'age', unit: 'yrs', type: 'numeric' },
            { label: 'Weight', key: 'weight', unit: 'kg', type: 'decimal-pad' },
            { label: 'Height', key: 'height', unit: 'cm', type: 'decimal-pad' },
          ].map(({ label, key, unit, type }) => (
            <View key={key} style={s.statRow}>
              <Text style={s.statKey}>{label}</Text>
              {editing ? (
                <View style={s.inputRow}>
                  <TextInput style={s.inlineInput} value={String(form[key] || '')} onChangeText={(v) => setForm((f) => ({ ...f, [key]: v }))} keyboardType={type} selectTextOnFocus />
                  <Text style={s.unit}>{unit}</Text>
                </View>
              ) : (
                <Text style={s.statVal}>{form[key]} {unit}</Text>
              )}
            </View>
          ))}
          <View style={s.statRow}>
            <Text style={s.statKey}>Gender</Text>
            {editing ? (
              <View style={s.genderRow}>
                {['Male', 'Female', 'Other'].map((g) => (
                  <TouchableOpacity key={g} style={[s.genderBtn, form.gender === g && s.genderActive]} onPress={() => setForm((f) => ({ ...f, gender: g }))}>
                    <Text style={[s.genderText, form.gender === g && s.genderTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={s.statVal}>{form.gender}</Text>
            )}
          </View>
        </View>

        {/* Training split */}
        <View style={s.card}>
          <Text style={s.cardLabel}>TRAINING SPLIT</Text>
          {editing ? (
            SPLITS.map((sp) => (
              <TouchableOpacity key={sp.id} style={[s.splitOption, form.split === sp.id && s.splitActive]} onPress={() => setForm((f) => ({ ...f, split: sp.id }))}>
                <Text style={[s.splitName, form.split === sp.id && { color: colors.accent }]}>{sp.name}</Text>
                <Text style={s.splitDesc}>{sp.desc}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View>
              <Text style={s.splitVal}>{splitData?.name}</Text>
              <Text style={s.splitValDesc}>{splitData?.desc}</Text>
            </View>
          )}
        </View>

        {/* Custom Exercises */}
        <View style={s.card}>
          <Text style={s.cardLabel}>PERSONAL EXERCISE SETS</Text>
          <Text style={s.helpText}>Add exercises you want to prioritize in your {splitData?.name} split.</Text>
          
          <View style={s.customList}>
            {customItems.filter(i => i.splitId === (form.split || profile?.split)).map(item => (
              <View key={item.id} style={s.customItem}>
                <View style={{ flex: 1 }}>
                  <Text style={s.customName}>{item.name}</Text>
                  <Text style={s.customMeta}>{item.dayLabel} day</Text>
                </View>
                <TouchableOpacity onPress={() => removeCustomExercise(item.id)}>
                  <Ionicons name="trash-outline" size={18} color={colors.red} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {editing && (
            <View style={s.addForm}>
              <TextInput 
                style={s.formInput} 
                placeholder="Exercise Name (e.g. Weighted Pushups)" 
                placeholderTextColor={colors.textTertiary}
                value={newExName}
                onChangeText={setNewExName}
              />
              <View style={s.dayPicker}>
                {splitData?.days.filter(d => d !== 'Rest').map((day, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    style={[s.dayBtn, selectedDay === day && s.dayBtnActive]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text style={[s.dayBtnText, selectedDay === day && s.dayBtnTextActive]}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={s.addBtn} onPress={addCustomExercise}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={s.addBtnText}>Add to program</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Export */}
        <View style={s.card}>
          <Text style={s.cardLabel}>DATA & EXPORT</Text>
          <TouchableOpacity style={s.exportRow} onPress={() => shareAllData()}>
            <Ionicons name="download-outline" size={20} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={s.exportTitle}>Export all data</Text>
              <Text style={s.exportSub}>CSV with profile + all workout logs</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {editing && (
          <TouchableOpacity style={s.cancelBtn} onPress={() => { setForm({ ...profile }); setEditing(false); }}>
            <Text style={s.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg },
  title: { fontSize: font.xl, fontWeight: '700', color: colors.textPrimary },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.accentBg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full },
  editText: { fontSize: font.sm, color: colors.accent, fontWeight: '600' },
  avatarSection: { alignItems: 'center', paddingVertical: spacing.xl },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.accentBg, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.accent, marginBottom: spacing.md },
  avatarText: { fontSize: font.xxl, fontWeight: '700', color: colors.accent },
  name: { fontSize: font.xl, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  nameInput: { fontSize: font.xl, fontWeight: '700', color: colors.textPrimary, borderBottomWidth: 1, borderBottomColor: colors.accent, marginBottom: 4, textAlign: 'center', minWidth: 160 },
  splitBadge: { fontSize: font.sm, color: colors.accent, backgroundColor: colors.accentBg, paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.full },
  bmiRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: 4 },
  bmiVal: { fontSize: font.xxxl, fontWeight: '700', color: colors.textPrimary },
  bmiPill: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.full },
  bmiPillText: { fontSize: font.sm, fontWeight: '600' },
  card: { marginHorizontal: spacing.lg, backgroundColor: colors.bg2, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 0.5, borderColor: colors.border },
  cardLabel: { fontSize: font.xs, color: colors.textTertiary, letterSpacing: 0.8, marginBottom: spacing.md, fontWeight: '600' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  statKey: { fontSize: font.sm, color: colors.textSecondary },
  statVal: { fontSize: font.md, fontWeight: '500', color: colors.textPrimary },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  inlineInput: { fontSize: font.md, fontWeight: '500', color: colors.accent, borderBottomWidth: 1, borderBottomColor: colors.accent, minWidth: 50, textAlign: 'right' },
  unit: { fontSize: font.sm, color: colors.textSecondary },
  genderRow: { flexDirection: 'row', gap: spacing.sm },
  genderBtn: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.full, backgroundColor: colors.bg3, borderWidth: 0.5, borderColor: colors.border },
  genderActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  genderText: { fontSize: font.sm, color: colors.textSecondary },
  genderTextActive: { color: colors.accent, fontWeight: '600' },
  splitOption: { padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.bg3, marginBottom: spacing.sm, borderWidth: 0.5, borderColor: colors.border },
  splitActive: { borderColor: colors.accent, backgroundColor: colors.accentBg },
  splitName: { fontSize: font.sm, fontWeight: '600', color: colors.textPrimary },
  splitDesc: { fontSize: font.xs, color: colors.textSecondary, marginTop: 2 },
  splitVal: { fontSize: font.md, fontWeight: '600', color: colors.textPrimary },
  splitValDesc: { fontSize: font.sm, color: colors.textSecondary, marginTop: 2 },
  exportRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  exportTitle: { fontSize: font.md, fontWeight: '500', color: colors.textPrimary },
  exportSub: { fontSize: font.sm, color: colors.textSecondary, marginTop: 2 },
  helpText: { fontSize: font.xs, color: colors.textTertiary, marginBottom: spacing.md },
  customList: { gap: spacing.sm, marginBottom: spacing.md },
  customItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg3, padding: spacing.md, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.border },
  customName: { fontSize: font.sm, fontWeight: '600', color: colors.textPrimary },
  customMeta: { fontSize: 10, color: colors.accent, marginTop: 2 },
  addForm: { marginTop: spacing.md, gap: spacing.md, borderTopWidth: 0.5, borderTopColor: colors.border, paddingTop: spacing.md },
  formInput: { backgroundColor: colors.bg3, padding: spacing.md, borderRadius: radius.md, fontSize: font.sm, color: colors.textPrimary },
  dayPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dayBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.full, backgroundColor: colors.bg3, borderWidth: 0.5, borderColor: colors.border },
  dayBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  dayBtnText: { fontSize: 11, color: colors.textSecondary },
  dayBtnTextActive: { color: '#fff', fontWeight: '600' },
  addBtn: { backgroundColor: colors.accent, padding: spacing.md, borderRadius: radius.md, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 },
  addBtnText: { color: '#fff', fontSize: font.sm, fontWeight: '600' },
  cancelBtn: { marginHorizontal: spacing.lg, padding: spacing.lg, alignItems: 'center' },
  cancelText: { fontSize: font.md, color: colors.red },
});
