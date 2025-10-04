
CREATE TABLE foods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  calories_per_100g INTEGER NOT NULL,
  protein_per_100g REAL,
  carbs_per_100g REAL,
  fat_per_100g REAL,
  brand TEXT,
  barcode TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE food_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  food_id INTEGER NOT NULL,
  serving_size_grams REAL NOT NULL,
  meal_type TEXT,
  date_logged DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  daily_calorie_goal INTEGER,
  daily_protein_goal REAL,
  daily_carbs_goal REAL,
  daily_fat_goal REAL,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_foods_name ON foods(name);
CREATE INDEX idx_food_entries_user_date ON food_entries(user_id, date_logged);
CREATE INDEX idx_user_goals_user_active ON user_goals(user_id, is_active);
