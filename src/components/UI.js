// src/components/UI.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { COLORS, RADIUS, FONTS } from '../utils/theme';

export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export const MetricCard = ({ label, value, unit, color, style }) => (
  <View style={[styles.metricCard, style]}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={[styles.metricValue, color && { color }]}>
      {value}
      {unit ? <Text style={styles.metricUnit}> {unit}</Text> : null}
    </Text>
  </View>
);

export const Badge = ({ label, type = 'default' }) => {
  const badgeColors = {
    default: { bg: COLORS.accentDim, text: COLORS.accentLight },
    green: { bg: COLORS.tealDim, text: COLORS.teal },
    amber: { bg: COLORS.amberDim, text: COLORS.amber },
    red: { bg: COLORS.redDim, text: COLORS.red },
  };
  const { bg, text } = badgeColors[type] || badgeColors.default;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: text }]}>{label}</Text>
    </View>
  );
};

export const PrimaryButton = ({ label, onPress, style, disabled }) => (
  <TouchableOpacity
    style={[styles.primaryBtn, disabled && styles.disabledBtn, style]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.85}
  >
    <Text style={styles.primaryBtnText}>{label}</Text>
  </TouchableOpacity>
);

export const SecondaryButton = ({ label, onPress, style }) => (
  <TouchableOpacity style={[styles.secondaryBtn, style]} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.secondaryBtnText}>{label}</Text>
  </TouchableOpacity>
);

export const Input = ({ label, value, onChangeText, keyboardType, placeholder, style }) => (
  <View style={[styles.inputGroup, style]}>
    {label && <Text style={styles.inputLabel}>{label}</Text>}
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || 'default'}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textTertiary}
    />
  </View>
);

export const SectionTitle = ({ children, style }) => (
  <Text style={[styles.sectionTitle, style]}>{children}</Text>
);

export const Divider = () => <View style={styles.divider} />;

export const Avatar = ({ name, size = 44, fontSize = 16 }) => {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarText, { fontSize }]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  metricCard: {
    backgroundColor: COLORS.bgElevated,
    borderRadius: RADIUS.md,
    padding: 14,
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.5,
    ...FONTS.medium,
  },
  metricValue: {
    fontSize: 22,
    color: COLORS.textPrimary,
    ...FONTS.semibold,
  },
  metricUnit: {
    fontSize: 13,
    color: COLORS.textSecondary,
    ...FONTS.regular,
  },
  badge: {
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    ...FONTS.semibold,
    letterSpacing: 0.3,
  },
  primaryBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    paddingVertical: 15,
    alignItems: 'center',
  },
  disabledBtn: { opacity: 0.5 },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    ...FONTS.semibold,
  },
  secondaryBtn: {
    backgroundColor: COLORS.bgElevated,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.borderLight,
  },
  secondaryBtnText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    ...FONTS.medium,
  },
  inputGroup: { marginBottom: 14 },
  inputLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.3,
    ...FONTS.medium,
  },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    borderWidth: 0.5,
    borderColor: COLORS.borderLight,
    color: COLORS.textPrimary,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...FONTS.medium,
  },
  sectionTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    ...FONTS.semibold,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  divider: {
    height: 0.5,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  avatar: {
    backgroundColor: COLORS.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.accent,
    ...FONTS.semibold,
  },
});
