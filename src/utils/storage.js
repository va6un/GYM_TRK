import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  PROFILE: '@gymtracker:profile',
  LOGS: '@gymtracker:logs',
  CURRENT_SESSION: '@gymtracker:current_session',
  CUSTOM_EXERCISES: '@gymtracker:custom_exercises',
};

export async function saveProfile(profile) {
  await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export async function loadProfile() {
  const raw = await AsyncStorage.getItem(KEYS.PROFILE);
  return raw ? JSON.parse(raw) : null;
}

export async function saveLogs(logs) {
  await AsyncStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
}

export async function loadLogs() {
  const raw = await AsyncStorage.getItem(KEYS.LOGS);
  return raw ? JSON.parse(raw) : [];
}

export async function appendLog(session) {
  const existing = await loadLogs();
  const updated = [session, ...existing];
  await saveLogs(updated);
  return updated;
}

export async function saveCurrentSession(session) {
  await AsyncStorage.setItem(KEYS.CURRENT_SESSION, JSON.stringify(session));
}

export async function loadCurrentSession() {
  const raw = await AsyncStorage.getItem(KEYS.CURRENT_SESSION);
  return raw ? JSON.parse(raw) : null;
}

export async function clearCurrentSession() {
  await AsyncStorage.removeItem(KEYS.CURRENT_SESSION);
}

export async function saveCustomExercises(items) {
  await AsyncStorage.setItem(KEYS.CUSTOM_EXERCISES, JSON.stringify(items));
}

export async function loadCustomExercises() {
  const raw = await AsyncStorage.getItem(KEYS.CUSTOM_EXERCISES);
  return raw ? JSON.parse(raw) : [];
}

export async function exportAllDataAsCSV() {
  const [profile, logs] = await Promise.all([loadProfile(), loadLogs()]);
  const profileLines = [
    'PROFILE',
    `Name,${profile?.name || ''}`,
    `Age,${profile?.age || ''}`,
    `Gender,${profile?.gender || ''}`,
    `Weight (kg),${profile?.weight || ''}`,
    `Height (cm),${profile?.height || ''}`,
    `BMI,${profile ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : ''}`,
    `Split,${profile?.split || ''}`,
    '',
    'WORKOUT LOGS',
    'Date,Session,Exercise,Sets,Reps,Weight (kg),Notes',
  ];
  const exerciseLines = logs.flatMap((session) =>
    (session.exercises || []).map((ex) =>
      `${session.date},${session.label},${ex.name},${ex.sets},${ex.reps},${ex.weight},"${ex.notes || ''}"`
    )
  );
  return [...profileLines, ...exerciseLines].join('\n');
}

export async function exportProgressCSV() {
  const logs = await loadLogs();
  const header = 'Date,Session,Exercise,Weight (kg)';
  const rows = logs.flatMap((session) =>
    (session.exercises || []).map(
      (ex) => `${session.date},${session.label},${ex.name},${ex.weight}`
    )
  );
  return [header, ...rows].join('\n');
}
