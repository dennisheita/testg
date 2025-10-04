import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { CreateFoodEntrySchema, UpdateUserGoalSchema } from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

// Search foods endpoint
app.get('/api/foods/search', async (c) => {
  const query = c.req.query('q');
  if (!query || query.length < 2) {
    return c.json([]);
  }

  const db = c.env.DB;
  const foods = await db.prepare(`
    SELECT * FROM foods 
    WHERE name LIKE ? 
    ORDER BY name ASC 
    LIMIT 20
  `).bind(`%${query}%`).all();

  return c.json(foods.results);
});

// Get all foods endpoint
app.get('/api/foods', async (c) => {
  const db = c.env.DB;
  const foods = await db.prepare(`
    SELECT * FROM foods 
    ORDER BY name ASC
  `).all();

  return c.json(foods.results);
});

// Get food entries for a date
app.get('/api/entries/:date', async (c) => {
  const date = c.req.param('date');
  const userId = 'user123'; // TODO: Get from auth

  const db = c.env.DB;
  const entries = await db.prepare(`
    SELECT 
      fe.*,
      f.name as food_name,
      f.calories_per_100g,
      f.protein_per_100g,
      f.carbs_per_100g,
      f.fat_per_100g
    FROM food_entries fe
    JOIN foods f ON fe.food_id = f.id
    WHERE fe.user_id = ? AND fe.date_logged = ?
    ORDER BY fe.created_at DESC
  `).bind(userId, date).all();

  return c.json(entries.results);
});

// Create food entry
app.post('/api/entries', zValidator('json', CreateFoodEntrySchema), async (c) => {
  const data = c.req.valid('json');
  const userId = 'user123'; // TODO: Get from auth

  const db = c.env.DB;
  const result = await db.prepare(`
    INSERT INTO food_entries (user_id, food_id, serving_size_grams, meal_type, date_logged)
    VALUES (?, ?, ?, ?, ?)
  `).bind(userId, data.food_id, data.serving_size_grams, data.meal_type || null, data.date_logged).run();

  return c.json({ id: result.meta.last_row_id, success: true });
});

// Delete food entry
app.delete('/api/entries/:id', async (c) => {
  const entryId = c.req.param('id');
  const userId = 'user123'; // TODO: Get from auth

  const db = c.env.DB;
  await db.prepare(`
    DELETE FROM food_entries 
    WHERE id = ? AND user_id = ?
  `).bind(entryId, userId).run();

  return c.json({ success: true });
});

// Get user goals
app.get('/api/goals', async (c) => {
  const userId = 'user123'; // TODO: Get from auth

  const db = c.env.DB;
  const goal = await db.prepare(`
    SELECT * FROM user_goals 
    WHERE user_id = ? AND is_active = 1
    ORDER BY created_at DESC
    LIMIT 1
  `).bind(userId).first();

  return c.json(goal || { daily_calorie_goal: 2000 });
});

// Update user goals
app.put('/api/goals', zValidator('json', UpdateUserGoalSchema), async (c) => {
  const data = c.req.valid('json');
  const userId = 'user123'; // TODO: Get from auth

  const db = c.env.DB;
  
  // Deactivate old goals
  await db.prepare(`
    UPDATE user_goals SET is_active = 0 WHERE user_id = ?
  `).bind(userId).run();

  // Create new goal
  await db.prepare(`
    INSERT INTO user_goals (user_id, daily_calorie_goal, daily_protein_goal, daily_carbs_goal, daily_fat_goal)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    userId, 
    data.daily_calorie_goal || null,
    data.daily_protein_goal || null,
    data.daily_carbs_goal || null,
    data.daily_fat_goal || null
  ).run();

  return c.json({ success: true });
});

export default app;
