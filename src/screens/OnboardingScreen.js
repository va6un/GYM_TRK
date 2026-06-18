import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font } from '../theme';
import { saveProfile } from '../utils/storage';
import { SPLITS } from '../utils/workoutData';

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0); // 0=profile, 1=split
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [split, setSplit] = useState('ppl');

  const bmi = weight && height
    ? (parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1)
    : null;

  const bmiCategory = bmi
    ? bmi < 18.5 ? { label: 'Underweight', color: colors.amber }
      : bmi < 25 ? { label: 'Normal', color: colors.green }
      : bmi < 30 ? { label: 'Overweight', color: colors.amber }
      : { label: 'Obese', color: colors.red }
    : null;

  async function handleFinish() {
    if (!name || !age || !weight || !height) {
      Alert.alert('Missing info', 'Please fill in all fields.');
      return;
    }
    const profile = { name, age: parseInt(age), gender, weight: parseFloat(weight), height: parseFloat(height), split };
    await saveProfile(profile);
    onComplete(profile);
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {step === 0 ? (
          <ScrollView contentContainerStyle={s.scroll}>
            <View style={s.header}>
              <Text style={s.appName}>GymTracker</Text>
              <Text style={s.tagline}>Let's set up your profile</Text>
            </View>

            <View style={s.card}>
              <Text style={s.label}>Your name</Text>
              <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Alex Menon" placeholderTextColor={colors.textTertiary} />
            </View>

            <View style={s.card}>
              <Text style={s.label}>Gender</Text>
              <View style={s.genderRow}>
                {['Male', 'Female', 'Other'].map((g) => (
                  <TouchableOpacity key={g} style={[s.genderBtn, gender === g && s.genderActive]} onPress={() => setGender(g)}>
                    <Text style={[s.genderText, gender === g && s.genderTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={s.row}>
              <View style={[s.card, { flex: 1, marginRight: spacing.sm }]}>
                <Text style={s.label}>Age</Text>
                <TextInput style={s.bigInput} value={age} onChangeText={setAge} keyboardType="numeric" placeholder="26" placeholderTextColor={colors.textTertiary} />
              </View>
              <View style={[s.card, { flex: 1, marginLeft: spacing.sm }]}>
                <Text style={s.label}>Weight (kg)</Text>
                <TextInput style={s.bigInput} value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder="75" placeholderTextColor={colors.textTertiary} />
              </View>
            </View>

            <View style={s.card}>
              <Text style={s.label}>Height (cm)</Text>
              <TextInput style={s.bigInput} value={height} onChangeText={setHeight} keyboardType="decimal-pad" placeholder="175" placeholderTextColor={colors.textTertiary} />
            </View>

            {bmi && (
              <View style={[s.card, { borderColor: bmiCategory.color, borderWidth: 1 }]}>
                <Text style={s.label}>Your BMI</Text>
                <View style={s.bmiRow}>
                  <Text style={[s.bmiVal, { color: bmiCategory.color }]}>{bmi}</Text>
                  <View style={[s.badge, { backgroundColor: bmiCategory.color + '22' }]}>
                    <Text style={[s.badgeText, { color: bmiCategory.color }]}>{bmiCategory.label}</Text>
                  </View>
                </View>
                <View style={s.bmiBar}>
                  <View style={[s.bmiSegment, { backgroundColor: colors.teal }]} />
                  <View style={[s.bmiSegment, { backgroundColor: colors.green }]} />
                  <View style={[s.bmiSegment, { backgroundColor: colors.amber }]} />
                  <View style={[s.bmiSegment, { backgroundColor: colors.red }]} />
                  <View style={[s.bmiDot, { left: `${Math.min(94, Math.max(4, ((bmi - 10) / 30) * 100))}%`, backgroundColor: bmiCategory.color }]} />
                </View>
                <View style={s.bmiLabels}>
                  <Text style={s.bmiLabelText}>Under</Text>
                  <Text style={s.bmiLabelText}>Normal</Text>
                  <Text style={s.bmiLabelText}>Over</Text>
                  <Text style={s.bmiLabelText}>Obese</Text>
                </View>
              </View>
            )}

            <TouchableOpacity style={s.primaryBtn} onPress={() => {
              if (!name || !age || !weight || !height) { Alert.alert('Missing info', 'Please fill in all fields.'); return; }
              setStep(1);
            }}>
              <Text style={s.primaryBtnText}>Choose training split</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={s.scroll}>
            <TouchableOpacity onPress={() => setStep(0)} style={s.backBtn}>
              <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
              <Text style={s.backText}>Back</Text>
            </TouchableOpacity>
            <Text style={s.sectionTitle}>Choose your split</Text>
            <Text style={s.sectionSub}>You can change this later in settings</Text>

            {SPLITS.map((sp) => (
              <TouchableOpacity key={sp.id} style={[s.splitCard, split === sp.id && s.splitActive]} onPress={() => setSplit(sp.id)}>
                <View style={s.splitLeft}>
                  <Text style={s.splitName}>{sp.name}</Text>
                  <Text style={s.splitDesc}>{sp.desc}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                    {sp.days.slice(0, 7).map((d, i) => (
                      <View key={i} style={[s.dayPill, d === 'Rest' && s.dayPillRest]}>
                        <Text style={[s.dayPillText, d === 'Rest' && s.dayPillTextRest]}>{d === 'Rest' ? '🛌' : d.slice(0, 3)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                {split === sp.id && <Ionicons name="checkmark-circle" size={24} color={colors.accent} />}
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={s.primaryBtn} onPress={handleFinish}>
              <Text style={s.primaryBtnText}>Start tracking</Text>
              <Ionicons name="barbell-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg0 },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  header: { marginBottom: spacing.xl, marginTop: spacing.md },
  appName: { fontSize: font.xxxl, fontWeight: '700', color: colors.accent, letterSpacing: -1 },
  tagline: { fontSize: font.md, color: colors.textSecondary, marginTop: 4 },
  card: { backgroundColor: colors.bg2, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 0.5, borderColor: colors.border },
  label: { fontSize: font.xs, color: colors.textTertiary, marginBottom: spacing.sm, letterSpacing: 0.5, textTransform: 'uppercase' },
  input: { fontSize: font.md, color: colors.textPrimary, padding: 0 },
  bigInput: { fontSize: font.xxl, fontWeight: '600', color: colors.textPrimary, padding: 0 },
  genderRow: { flexDirection: 'row', gap: spacing.sm },
  genderBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.md, backgroundColor: colors.bg3, alignItems: 'center', borderWidth: 0.5, borderColor: colors.border },
  genderActive: { backgroundColor: colors.accentBg, borderColor: colors.accent },
  genderText: { color: colors.textSecondary, fontSize: font.sm, fontWeight: '500' },
  genderTextActive: { color: colors.accent },
  row: { flexDirection: 'row', marginBottom: spacing.md },
  bmiRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  bmiVal: { fontSize: font.xxl, fontWeight: '700' },
  badge: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.full },
  badgeText: { fontSize: font.sm, fontWeight: '600' },
  bmiBar: { height: 8, borderRadius: 4, flexDirection: 'row', overflow: 'hidden', position: 'relative', marginBottom: 8 },
  bmiSegment: { flex: 1 },
  bmiDot: { position: 'absolute', top: -4, width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: colors.bg2, marginLeft: -8 },
  bmiLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  bmiLabelText: { fontSize: 10, color: colors.textTertiary },
  primaryBtn: { backgroundColor: colors.accent, borderRadius: radius.lg, padding: spacing.lg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  primaryBtnText: { fontSize: font.md, fontWeight: '600', color: '#fff' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  backText: { color: colors.textSecondary, fontSize: font.md },
  sectionTitle: { fontSize: font.xl, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  sectionSub: { fontSize: font.sm, color: colors.textSecondary, marginBottom: spacing.xl },
  splitCard: { backgroundColor: colors.bg2, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 0.5, borderColor: colors.border, flexDirection: 'row', alignItems: 'center' },
  splitActive: { borderColor: colors.accent, backgroundColor: colors.accentBg },
  splitLeft: { flex: 1 },
  splitName: { fontSize: font.md, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  splitDesc: { fontSize: font.sm, color: colors.textSecondary },
  dayPill: { backgroundColor: colors.accent + '33', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.full },
  dayPillRest: { backgroundColor: colors.bg3 },
  dayPillText: { fontSize: 10, color: colors.accent, fontWeight: '600' },
  dayPillTextRest: { color: colors.textTertiary },
});
