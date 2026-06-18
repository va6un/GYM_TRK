// src/screens/SetupScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { COLORS, RADIUS, FONTS, SPLITS } from '../utils/theme';
import { Card, PrimaryButton, Input, Badge } from '../components/UI';
import { saveProfile } from '../utils/storage';

const STEPS = ['Profile', 'Body Stats', 'Training'];

export default function SetupScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [selectedSplit, setSelectedSplit] = useState(null);

  const bmi = weight && height
    ? (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1)
    : null;

  const bmiCategory = () => {
    if (!bmi) return null;
    const b = parseFloat(bmi);
    if (b < 18.5) return { label: 'Underweight', type: 'amber' };
    if (b < 25) return { label: 'Normal weight', type: 'green' };
    if (b < 30) return { label: 'Overweight', type: 'amber' };
    return { label: 'Obese', type: 'red' };
  };

  const bmiPct = () => {
    if (!bmi) return 0;
    const b = parseFloat(bmi);
    if (b < 18.5) return Math.min(18, (b / 18.5) * 18);
    if (b < 25) return 18 + ((b - 18.5) / 6.5) * 30;
    if (b < 30) return 48 + ((b - 25) / 5) * 28;
    return Math.min(94, 76 + ((b - 30) / 10) * 20);
  };

  const handleNext = () => {
    if (step === 0 && !name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }
    if (step === 1 && (!age || !weight || !height)) {
      Alert.alert('Required', 'Please fill in all body stats');
      return;
    }
    if (step < 2) setStep(step + 1);
  };

  const handleFinish = async () => {
    if (!selectedSplit) {
      Alert.alert('Required', 'Please choose a training split');
      return;
    }
    const split = SPLITS.find(s => s.id === selectedSplit);
    const profile = {
      name: name.trim(),
      gender,
      age: parseInt(age),
      weight: parseFloat(weight),
      height: parseFloat(height),
      bmi: parseFloat(bmi),
      splitId: selectedSplit,
      splitName: split.full,
      createdAt: new Date().toISOString(),
    };
    await saveProfile(profile);
    onComplete(profile);
  };

  const cat = bmiCategory();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>GymTracker</Text>
        <View style={styles.stepRow}>
          {STEPS.map((s, i) => (
            <View key={i} style={styles.stepItem}>
              <View style={[styles.stepDot, i <= step && styles.stepDotActive, i < step && styles.stepDotDone]}>
                {i < step ? (
                  <Text style={styles.stepCheck}>✓</Text>
                ) : (
                  <Text style={[styles.stepNum, i === step && styles.stepNumActive]}>{i + 1}</Text>
                )}
              </View>
              <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>{s}</Text>
              {i < STEPS.length - 1 && (
                <View style={[styles.stepLine, i < step && styles.stepLineDone]} />
              )}
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 0 && (
          <View>
            <Text style={styles.stepHeading}>Tell us about you</Text>
            <Text style={styles.stepSub}>Set up your profile to get started</Text>
            <Card style={{ marginTop: 20 }}>
              <Input
                label="YOUR NAME"
                value={name}
                onChangeText={setName}
                placeholder="e.g. Alex Menon"
              />
              <Text style={styles.genderLabel}>GENDER</Text>
              <View style={styles.genderRow}>
                {['Male', 'Female', 'Other'].map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
                    onPress={() => setGender(g)}
                  >
                    <Text style={[styles.genderBtnText, gender === g && styles.genderBtnTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={styles.stepHeading}>Body stats</Text>
            <Text style={styles.stepSub}>Used to calculate your BMI and tailor your plan</Text>
            <Card style={{ marginTop: 20 }}>
              <View style={styles.row}>
                <Input label="AGE" value={age} onChangeText={setAge} keyboardType="numeric" placeholder="26" style={{ flex: 1, marginRight: 10 }} />
                <Input label="WEIGHT (kg)" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder="75" style={{ flex: 1 }} />
              </View>
              <Input label="HEIGHT (cm)" value={height} onChangeText={setHeight} keyboardType="decimal-pad" placeholder="175" />
            </Card>

            {bmi && cat && (
              <Card>
                <View style={styles.bmiRow}>
                  <View>
                    <Text style={styles.bmiLabel}>BMI</Text>
                    <Text style={styles.bmiValue}>{bmi}</Text>
                  </View>
                  <Badge label={cat.label} type={cat.type} />
                </View>
                <View style={styles.bmiBarBg}>
                  <View style={styles.bmiBarGradient} />
                  <View style={[styles.bmiDot, { left: `${bmiPct()}%` }]} />
                </View>
                <View style={styles.bmiScaleRow}>
                  {['< 18.5', '18.5–24.9', '25–29.9', '≥ 30'].map(l => (
                    <Text key={l} style={styles.bmiScaleLabel}>{l}</Text>
                  ))}
                </View>
              </Card>
            )}
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.stepHeading}>Training split</Text>
            <Text style={styles.stepSub}>Choose your weekly workout structure</Text>
            {SPLITS.map(split => (
              <TouchableOpacity
                key={split.id}
                style={[styles.splitCard, selectedSplit === split.id && styles.splitCardActive]}
                onPress={() => setSelectedSplit(split.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.splitIcon}>{split.icon}</Text>
                <View style={styles.splitInfo}>
                  <Text style={styles.splitName}>{split.full}</Text>
                  <Text style={styles.splitDesc}>{split.desc}</Text>
                </View>
                <View style={[styles.splitRadio, selectedSplit === split.id && styles.splitRadioActive]}>
                  {selectedSplit === split.id && <View style={styles.splitRadioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.btnRow}>
          {step > 0 && (
            <TouchableOpacity style={styles.backBtn} onPress={() => setStep(step - 1)}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
          )}
          <PrimaryButton
            label={step < 2 ? 'Continue →' : 'Start Training →'}
            onPress={step < 2 ? handleNext : handleFinish}
            style={{ flex: 1 }}
          />
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 22,
    color: COLORS.textPrimary,
    ...FONTS.bold,
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center' },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  stepDotActive: { borderColor: COLORS.accent, backgroundColor: COLORS.accentDim },
  stepDotDone: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  stepNum: { fontSize: 12, color: COLORS.textSecondary, ...FONTS.medium },
  stepNumActive: { color: COLORS.accent },
  stepCheck: { fontSize: 12, color: '#fff', ...FONTS.bold },
  stepLabel: { fontSize: 11, color: COLORS.textSecondary, marginLeft: 6, ...FONTS.medium },
  stepLabelActive: { color: COLORS.accent },
  stepLine: { width: 24, height: 1, backgroundColor: COLORS.border, marginHorizontal: 6 },
  stepLineDone: { backgroundColor: COLORS.accent },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  stepHeading: { fontSize: 26, color: COLORS.textPrimary, ...FONTS.bold, letterSpacing: -0.5 },
  stepSub: { fontSize: 14, color: COLORS.textSecondary, marginTop: 6, ...FONTS.regular },
  row: { flexDirection: 'row' },
  genderLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 8, ...FONTS.medium, letterSpacing: 0.3 },
  genderRow: { flexDirection: 'row', gap: 8 },
  genderBtn: {
    flex: 1, paddingVertical: 10, borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgInput, borderWidth: 0.5, borderColor: COLORS.border,
    alignItems: 'center',
  },
  genderBtnActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  genderBtnText: { color: COLORS.textSecondary, fontSize: 14, ...FONTS.medium },
  genderBtnTextActive: { color: '#fff' },
  bmiRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  bmiLabel: { fontSize: 11, color: COLORS.textSecondary, ...FONTS.medium },
  bmiValue: { fontSize: 32, color: COLORS.textPrimary, ...FONTS.bold, marginTop: 2 },
  bmiBarBg: {
    height: 8, borderRadius: 4, backgroundColor: COLORS.bgInput, overflow: 'visible',
    marginVertical: 8, position: 'relative',
  },
  bmiBarGradient: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
    borderRadius: 4,
    backgroundColor: COLORS.teal,
  },
  bmiDot: {
    position: 'absolute', top: -4, width: 16, height: 16,
    borderRadius: 8, backgroundColor: COLORS.textPrimary,
    borderWidth: 2.5, borderColor: COLORS.accent,
    marginLeft: -8,
  },
  bmiScaleRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  bmiScaleLabel: { fontSize: 9, color: COLORS.textTertiary, ...FONTS.regular },
  splitCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 14, marginBottom: 10,
  },
  splitCardActive: { borderColor: COLORS.accent, borderWidth: 1.5, backgroundColor: COLORS.accentDim },
  splitIcon: { fontSize: 28, marginRight: 14 },
  splitInfo: { flex: 1 },
  splitName: { fontSize: 15, color: COLORS.textPrimary, ...FONTS.semibold },
  splitDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  splitRadio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.5, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  splitRadioActive: { borderColor: COLORS.accent },
  splitRadioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.accent },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 24 },
  backBtn: {
    paddingVertical: 15, paddingHorizontal: 20,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 0.5, borderColor: COLORS.borderLight,
    justifyContent: 'center',
  },
  backBtnText: { color: COLORS.textSecondary, fontSize: 15, ...FONTS.medium },
});
