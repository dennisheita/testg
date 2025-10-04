import z from "zod";

export const FoodSchema = z.object({
  id: z.number(),
  name: z.string(),
  calories_per_100g: z.number(),
  protein_per_100g: z.number().nullable(),
  carbs_per_100g: z.number().nullable(),
  fat_per_100g: z.number().nullable(),
  brand: z.string().nullable(),
  barcode: z.string().nullable(),
});

export const FoodEntrySchema = z.object({
  id: z.number(),
  user_id: z.string(),
  food_id: z.number(),
  serving_size_grams: z.number(),
  meal_type: z.string().nullable(),
  date_logged: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ExtendedFoodEntrySchema = FoodEntrySchema.extend({
  food_name: z.string(),
  calories_per_100g: z.number(),
  protein_per_100g: z.number().nullable(),
  carbs_per_100g: z.number().nullable(),
  fat_per_100g: z.number().nullable(),
});

export const UserGoalSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  daily_calorie_goal: z.number().nullable(),
  daily_protein_goal: z.number().nullable(),
  daily_carbs_goal: z.number().nullable(),
  daily_fat_goal: z.number().nullable(),
  is_active: z.boolean(),
});

export const CreateFoodEntrySchema = z.object({
  food_id: z.number(),
  serving_size_grams: z.number().positive(),
  meal_type: z.string().optional(),
  date_logged: z.string(),
});

export const UpdateUserGoalSchema = z.object({
  daily_calorie_goal: z.number().positive().optional(),
  daily_protein_goal: z.number().positive().optional(),
  daily_carbs_goal: z.number().positive().optional(),
  daily_fat_goal: z.number().positive().optional(),
});

export type Food = z.infer<typeof FoodSchema>;
export type FoodEntry = z.infer<typeof FoodEntrySchema>;
export type ExtendedFoodEntry = z.infer<typeof ExtendedFoodEntrySchema>;
export type UserGoal = z.infer<typeof UserGoalSchema>;
export type CreateFoodEntry = z.infer<typeof CreateFoodEntrySchema>;
export type UpdateUserGoal = z.infer<typeof UpdateUserGoalSchema>;
