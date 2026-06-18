export const WORKOUT_DATABASE = {
  "PPL": {
    "version_1": {
      "Push": {
        "primary": [
          "Barbell Bench Press",
          "Standing Overhead Press",
          "Incline Dumbbell Press"
        ],
        "accessories": [
          "Cable Lateral Raise",
          "Pec Deck Fly",
          "Rope Triceps Pushdown",
          "Overhead Triceps Extension"
        ]
      },
      "Pull": {
        "primary": [
          "Weighted Pull-Up",
          "Barbell Row",
          "Chest Supported Row"
        ],
        "accessories": [
          "Face Pull",
          "Rear Delt Fly",
          "EZ Bar Curl",
          "Hammer Curl",
          "Wrist Curl"
        ]
      },
      "Legs": {
        "primary": [
          "Back Squat",
          "Romanian Deadlift",
          "Walking Lunge"
        ],
        "accessories": [
          "Leg Extension",
          "Leg Curl",
          "Standing Calf Raise",
          "Hanging Leg Raise"
        ]
      }
    },

    "version_2": {
      "Push": [
        "Machine Chest Press",
        "Seated Dumbbell Press",
        "Push-Up",
        "Cable Fly",
        "Lateral Raise",
        "Bench Dips"
      ],
      "Pull": [
        "Lat Pulldown",
        "Seated Cable Row",
        "Single Arm Dumbbell Row",
        "Reverse Pec Deck",
        "Cable Curl",
        "Farmer Carry"
      ],
      "Legs": [
        "Leg Press",
        "Bulgarian Split Squat",
        "Hip Thrust",
        "Seated Leg Curl",
        "Seated Calf Raise",
        "Cable Crunch"
      ]
    },

    "substitutions": {
      "Bench Press": ["Push-Up", "Machine Chest Press", "Dumbbell Press"],
      "Pull-Up": ["Lat Pulldown", "Assisted Pull-Up"],
      "Squat": ["Goblet Squat", "Leg Press", "Split Squat"],
      "Deadlift": ["Romanian Deadlift", "Back Extension"],
      "Overhead Press": ["Landmine Press", "Machine Shoulder Press"]
    }
  },

  "Bro_Split": {
    "version_1": {
      "Chest": [
        "Barbell Bench Press",
        "Incline Dumbbell Press",
        "Cable Fly",
        "Push-Up"
      ],
      "Back": [
        "Pull-Up",
        "Barbell Row",
        "Lat Pulldown",
        "Face Pull"
      ],
      "Shoulders": [
        "Overhead Press",
        "Lateral Raise",
        "Rear Delt Fly",
        "Upright Row"
      ],
      "Arms": [
        "EZ Curl",
        "Hammer Curl",
        "Skull Crusher",
        "Rope Pushdown"
      ],
      "Legs": [
        "Back Squat",
        "Romanian Deadlift",
        "Leg Press",
        "Leg Curl",
        "Calf Raise"
      ]
    },

    "version_2": {
      "Chest": [
        "Machine Chest Press",
        "Incline Machine Press",
        "Pec Deck"
      ],
      "Back": [
        "Chest Supported Row",
        "Pulldown",
        "Cable Row"
      ],
      "Shoulders": [
        "Machine Press",
        "Cable Lateral Raise",
        "Reverse Pec Deck"
      ],
      "Arms": [
        "Cable Curl",
        "Preacher Curl",
        "Overhead Extension",
        "Pushdown"
      ],
      "Legs": [
        "Hack Squat",
        "Hip Thrust",
        "Leg Extension",
        "Leg Curl",
        "Calf Raise"
      ]
    }
  },

  "Upper_Lower": {
    "version_1": {
      "Upper_A": [
        "Bench Press",
        "Pull-Up",
        "Overhead Press",
        "Barbell Row",
        "Lateral Raise",
        "EZ Curl",
        "Pushdown"
      ],
      "Lower_A": [
        "Back Squat",
        "Romanian Deadlift",
        "Leg Curl",
        "Standing Calf Raise",
        "Ab Wheel"
      ],
      "Upper_B": [
        "Incline Press",
        "Chest Supported Row",
        "Lat Pulldown",
        "Rear Delt Fly",
        "Hammer Curl",
        "Overhead Triceps Extension"
      ],
      "Lower_B": [
        "Front Squat",
        "Hip Thrust",
        "Walking Lunge",
        "Seated Calf Raise",
        "Cable Crunch"
      ]
    },

    "version_2": {
      "Upper_A": [
        "Machine Chest Press",
        "Cable Row",
        "Machine Shoulder Press",
        "Pulldown",
        "Lateral Raise"
      ],
      "Lower_A": [
        "Leg Press",
        "Leg Curl",
        "Split Squat",
        "Calf Raise"
      ],
      "Upper_B": [
        "Incline Machine Press",
        "Chest Supported Row",
        "Reverse Pec Deck",
        "Cable Curl",
        "Pushdown"
      ],
      "Lower_B": [
        "Hack Squat",
        "Hip Thrust",
        "Leg Extension",
        "Calf Raise"
      ]
    }
  },

  "Full_Body": {
    "version_1": {
      "Workout_A": [
        "Back Squat",
        "Bench Press",
        "Pull-Up",
        "Lateral Raise",
        "Leg Curl",
        "Plank"
      ],
      "Workout_B": [
        "Romanian Deadlift",
        "Overhead Press",
        "Barbell Row",
        "Calf Raise",
        "Hammer Curl",
        "Hanging Leg Raise"
      ]
    },

    "version_2": {
      "Workout_A": [
        "Goblet Squat",
        "Push-Up",
        "Cable Row",
        "Lateral Raise",
        "Dead Bug"
      ],
      "Workout_B": [
        "Split Squat",
        "Machine Press",
        "Lat Pulldown",
        "Calf Raise",
        "Cable Crunch"
      ]
    }
  },

  "Arnold_Split": {
    "version_1": {
      "Chest_Back": [
        "Bench Press",
        "Incline Press",
        "Pull-Up",
        "Barbell Row",
        "Cable Fly",
        "Straight Arm Pulldown"
      ],
      "Shoulders_Arms": [
        "Overhead Press",
        "Lateral Raise",
        "Rear Delt Fly",
        "EZ Curl",
        "Hammer Curl",
        "Skull Crusher",
        "Pushdown"
      ],
      "Legs": [
        "Back Squat",
        "Romanian Deadlift",
        "Leg Press",
        "Leg Curl",
        "Calf Raise",
        "Ab Wheel"
      ]
    },

    "version_2": {
      "Chest_Back": [
        "Machine Chest Press",
        "Incline Machine Press",
        "Lat Pulldown",
        "Cable Row",
        "Pec Deck"
      ],
      "Shoulders_Arms": [
        "Machine Shoulder Press",
        "Cable Lateral Raise",
        "Reverse Pec Deck",
        "Cable Curl",
        "Pushdown"
      ],
      "Legs": [
        "Hack Squat",
        "Hip Thrust",
        "Leg Extension",
        "Leg Curl",
        "Calf Raise"
      ]
    }
  },

  "muscle_coverage_check": {
    "Chest": ["Bench Press", "Incline Press", "Machine Press", "Push-Up", "Pec Deck", "Cable Fly"],
    "Back": ["Pull-Up", "Lat Pulldown", "Row", "Weighted Pull-Up", "Barbell Row", "Cable Row"],
    "Shoulders": ["Overhead Press", "Lateral Raise", "Rear Delt Fly", "Face Pull", "Shoulder Press"],
    "Biceps": ["EZ Bar Curl", "Hammer Curl", "Cable Curl", "Preacher Curl", "Barbell Curl"],
    "Triceps": ["Pushdown", "Extension", "Skull Crusher", "Dips", "Bench Dips"],
    "Quads": ["Squat", "Leg Press", "Lunge", "Split Squat", "Leg Extension"],
    "Hamstrings": ["Romanian Deadlift", "Leg Curl", "Deadlift"],
    "Glutes": ["Hip Thrust", "Bulgarian Split Squat"],
    "Calves": ["Calf Raise"],
    "Core": ["Leg Raise", "Ab Wheel", "Plank", "Cable Crunch", "Dead Bug"],
  }
};

export const MUSCLE_MAPPING = {
  // Chest
  "Barbell Bench Press": "Chest",
  "Machine Chest Press": "Chest",
  "Incline Dumbbell Press": "Chest",
  "Push-Up": "Chest",
  "Cable Fly": "Chest",
  "Pec Deck Fly": "Chest",
  "Pec Deck": "Chest",
  "Incline Machine Press": "Chest",
  "Bench Press": "Chest",
  "Incline Press": "Chest",
  "Flat Bench Press": "Chest",

  // Back
  "Weighted Pull-Up": "Back",
  "Pull-Up": "Back",
  "Lat Pulldown": "Back",
  "Pulldown": "Back",
  "Barbell Row": "Back",
  "Chest Supported Row": "Back",
  "Seated Cable Row": "Back",
  "Cable Row": "Back",
  "Single Arm Dumbbell Row": "Back",
  "Dumbbell Row": "Back",
  "Straight Arm Pulldown": "Back",

  // Shoulders
  "Standing Overhead Press": "Shoulders",
  "Seated Dumbbell Press": "Shoulders",
  "Overhead Press": "Shoulders",
  "Machine Shoulder Press": "Shoulders",
  "Machine Press": "Shoulders",
  "Lateral Raise": "Shoulders",
  "Cable Lateral Raise": "Shoulders",
  "Rear Delt Fly": "Shoulders",
  "Reverse Pec Deck": "Shoulders",
  "Face Pull": "Shoulders",
  "Upright Row": "Shoulders",
  "DB Lateral Raise": "Shoulders",
  "DB Front Raise": "Shoulders",
  "Shrugs": "Shoulders",

  // Arms
  "EZ Bar Curl": "Biceps",
  "Hammer Curl": "Biceps",
  "Cable Curl": "Biceps",
  "Preacher Curl": "Biceps",
  "Barbell Curl": "Biceps",
  "EZ Curl": "Biceps",
  "Incline DB Curl": "Biceps",
  "Wrist Curl": "Forearms",
  "Farmer Carry": "Forearms",
  "Rope Triceps Pushdown": "Triceps",
  "Overhead Triceps Extension": "Triceps",
  "Bench Dips": "Triceps",
  "Pushdown": "Triceps",
  "Skull Crusher": "Triceps",
  "Skullcrushers": "Triceps",
  "Tricep Pushdown": "Triceps",
  "Overhead Extension": "Triceps",
  "Dips": "Triceps",

  // Quads
  "Back Squat": "Quads",
  "Front Squat": "Quads",
  "Hack Squat": "Quads",
  "Leg Press": "Quads",
  "Bulgarian Split Squat": "Quads",
  "Walking Lunge": "Quads",
  "Split Squat": "Quads",
  "Leg Extension": "Quads",
  "Lunge": "Quads",
  "Goblet Squat": "Quads",

  // Hamstrings / Glutes
  "Romanian Deadlift": "Hamstrings",
  "Leg Curl": "Hamstrings",
  "Seated Leg Curl": "Hamstrings",
  "Hip Thrust": "Glutes",
  "Deadlift": "Hamstrings",
  "Rack Pull": "Hamstrings",

  // Calves
  "Standing Calf Raise": "Calves",
  "Seated Calf Raise": "Calves",
  "Calf Raise": "Calves",

  // Core
  "Hanging Leg Raise": "Core",
  "Ab Wheel": "Core",
  "Plank": "Core",
  "Cable Crunch": "Core",
  "Dead Bug": "Core",
  "Leg Raise": "Core",
};
