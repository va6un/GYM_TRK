import { WORKOUT_DATABASE, MUSCLE_MAPPING } from './workoutDatabase';
import { loadCurrentSession, saveCurrentSession, loadCustomExercises } from './storage';

export const SPLITS = [
  {
    id: 'ppl',
    name: 'PPL — Push Pull Legs',
    dbKey: 'PPL',
    desc: '6-day split · Chest, Back & Legs focused',
    icon: 'refresh-cw',
    days: ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs', 'Rest'],
  },
  {
    id: 'bro',
    name: 'Bro Split',
    dbKey: 'Bro_Split',
    desc: '5-day split · One muscle group per day',
    icon: 'zap',
    days: ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Rest', 'Rest'],
  },
  {
    id: 'ul',
    name: 'Upper / Lower',
    dbKey: 'Upper_Lower',
    desc: '4-day split · Great for beginners',
    icon: 'layers',
    days: ['Upper_A', 'Lower_A', 'Rest', 'Upper_B', 'Lower_B', 'Rest', 'Rest'],
  },
  {
    id: 'full',
    name: 'Full Body',
    dbKey: 'Full_Body',
    desc: '3-day split · Efficient & balanced',
    icon: 'activity',
    days: ['Workout_A', 'Rest', 'Workout_B', 'Rest', 'Workout_A', 'Rest', 'Rest'],
  },
  {
    id: 'arnold',
    name: 'Arnold Split',
    dbKey: 'Arnold_Split',
    desc: '6-day split · Classic bodybuilding',
    icon: 'award',
    days: ['Chest_Back', 'Shoulders_Arms', 'Legs', 'Chest_Back', 'Shoulders_Arms', 'Legs', 'Rest'],
  },
];

const DEFAULT_REPS = '10-12';
const PRIMARY_REPS = '6-8';

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export async function getTodaySession(splitId, forceRefresh = false) {
  const splitData = SPLITS.find((s) => s.id === splitId);
  if (!splitData) return { label: 'Rest', exercises: [] };

  const dayIndex = new Date().getDay();
  const label = splitData.days[dayIndex] || 'Rest';
  if (label === 'Rest') return { label, exercises: [] };

  const todayStr = new Date().toISOString().split('T')[0];

  if (!forceRefresh) {
    const saved = await loadCurrentSession();
    if (saved && saved.date === todayStr && saved.splitId === splitId && saved.label === label) {
      return saved;
    }
  }

  // Generate new session
  let exercises = generateRandomSession(splitData.dbKey, label);
  
  // Merge custom exercises from profile
  const customPool = await loadCustomExercises();
  const dayCustoms = customPool?.filter(c => c.splitId === splitId && c.dayLabel === label) || [];
  if (dayCustoms.length > 0) {
    // Replace or prepend custom exercises
    exercises = [...dayCustoms.map(c => ({ name: c.name, sets: 3, reps: DEFAULT_REPS })), ...exercises];
    // dedupe by name
    const seen = new Set();
    exercises = exercises.filter(e => {
      if (seen.has(e.name)) return false;
      seen.add(e.name);
      return true;
    });
  }

  const session = {
    date: todayStr,
    splitId,
    label,
    exercises: exercises.map(ex => ({
      ...ex,
      muscle: MUSCLE_MAPPING[ex.name] || 'Other',
      weight: ex.defaultWeight || 0,
      notes: ''
    }))
  };

  await saveCurrentSession(session);
  return session;
}

function generateRandomSession(dbKey, dayLabel) {
  const splitPool = WORKOUT_DATABASE[dbKey];
  if (!splitPool) return [];

  const versionKey = Math.random() > 0.5 ? 'version_1' : 'version_2';
  const versionData = splitPool[versionKey];
  const dayData = versionData[dayLabel];

  let rawList = [];

  if (!dayData) {
    rawList = [];
  } else if (Array.isArray(dayData)) {
    rawList = dayData.map((name, i) => ({
      name,
      sets: i < 2 ? 4 : 3,
      reps: i < 2 ? PRIMARY_REPS : DEFAULT_REPS
    }));
  } else {
    const primary = (dayData.primary || []).map(name => ({ name, sets: 4, reps: PRIMARY_REPS }));
    const accessories = (dayData.accessories || []).map(name => ({ name, sets: 3, reps: DEFAULT_REPS }));
    
    rawList = [
      ...shuffleArray(primary).slice(0, 2),
      ...shuffleArray(accessories).slice(0, 4)
    ];
  }

  return rawList;
}

export function swapExercise(exerciseName, splitId, dayLabel) {
  const currentMuscle = MUSCLE_MAPPING[exerciseName];
  if (!currentMuscle) return null;

  // Find ALL exercises in the database that target this same muscle
  const alternatives = Object.keys(MUSCLE_MAPPING).filter(
    (name) => MUSCLE_MAPPING[name] === currentMuscle && name !== exerciseName
  );

  if (alternatives.length > 0) {
    const newName = getRandomItem(alternatives);
    return { 
      name: newName, 
      muscle: currentMuscle,
      sets: 3, 
      reps: DEFAULT_REPS 
    };
  }

  return null;
}
