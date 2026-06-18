import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { exportAllDataAsCSV, exportProgressCSV } from './storage';

export async function shareAllData() {
  const csv = await exportAllDataAsCSV();
  const path = FileSystem.documentDirectory + 'gymtracker_export.csv';
  await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: 'Export Gym Data' });
}

export async function shareProgressData() {
  const csv = await exportProgressCSV();
  const path = FileSystem.documentDirectory + 'gymtracker_progress.csv';
  await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: 'Export Progress' });
}
