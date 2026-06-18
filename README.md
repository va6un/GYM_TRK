# 💪 GYMTRK — React Native / Expo App

A mobile gym progress tracker built with Expo. Tracks workouts, weight progression, BMI, and exports your data as CSV.

---

## Features

- **Profile setup** — Name, age, gender, weight, height, live BMI with category indicator
- **5 training splits** — PPL, Bro Split, Upper/Lower, Full Body, Arnold Split
- **Daily recommendations** — Auto-selects today's session based on your split and day of week
- **Workout logging** — Log weight per exercise with +/−2.5 kg controls and optional notes
- **Automatic PR detection** — Flags when you beat your previous weight on any lift
- **Weekly progress chart** — Line chart showing strength gains over last 8 sessions
- **Weekly volume bars** — Visual total volume (kg × sets) per week
- **Personal bests** — Per-exercise best weight with % gain since first session
- **Session history** — Timeline of all logged workouts
- **Local storage** — All data stored on-device via AsyncStorage (no account needed)
- **CSV export** — Share progress or full data as .csv to email, WhatsApp, Google Drive, etc.

---

## Setup & Run

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (iOS or Android)

### Install & Start

```bash
cd GymTracker
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone. The app will load instantly.

### Build for production (standalone APK/IPA)

```bash
# Install EAS CLI
npm install -g eas-cli
eas login

# Configure (first time)
eas build:configure

# Build Android APK
eas build --platform android --profile preview

# Build iOS (requires Apple Developer account)
eas build --platform ios
```

---

## Project Structure

```
GymTracker/
├── App.js                        # Root: navigation + auth flow
├── app.json                      # Expo config
├── src/
│   ├── screens/
│   │   ├── OnboardingScreen.js   # Profile setup + split selection
│   │   ├── HomeScreen.js         # Dashboard: today's session, week strip, stats
│   │   ├── LogScreen.js          # Log workout weights, sets, notes
│   │   ├── ProgressScreen.js     # Charts, PRs, history, export
│   │   └── ProfileScreen.js      # Edit profile, BMI, change split, export
│   ├── utils/
│   │   ├── storage.js            # AsyncStorage CRUD + CSV builders
│   │   ├── export.js             # File write + native share sheet
│   │   └── workoutData.js        # Exercise library for all 5 splits
│   └── theme/
│       └── index.js              # Colors, spacing, typography tokens
└── README.md
```

---

## Data Storage

All data lives on-device using `@react-native-async-storage/async-storage`:

| Key | Contents |
|-----|----------|
| `@gymtrk:profile` | Name, age, gender, weight, height, split |
| `@gymtrk:logs` | Array of session objects with exercises + weights |

**No server. No account. Your data stays on your phone.**

### Exported CSV format

**Progress export** (`gymtrk_progress.csv`):
```
Date,Session,Exercise,Weight (kg)
2025-06-10,Push A,Bench Press,80
2025-06-10,Push A,Overhead Press,52.5
...
```

**Full export** (`gymtrk_export.csv`):
```
PROFILE
Name,Alex Menon
Age,26
...

WORKOUT LOGS
Date,Session,Exercise,Sets,Reps,Weight (kg),Notes
2025-06-10,Push A,Bench Press,4,6-8,80,""
...
```

---

## Extending the App

- **Add an exercise** → Edit `EXERCISE_LIBRARY` in `src/utils/workoutData.js`
- **Add a split** → Add to the `SPLITS` array and `EXERCISE_LIBRARY` in the same file
- **Change theme** → Edit `src/theme/index.js`
- **Add cloud sync** → Replace AsyncStorage calls in `storage.js` with Supabase/Firebase

---

## Author

- **VARUN M V** ([@va6un](https://github.com/va6un))
- _Powered by human-AI synergy._

