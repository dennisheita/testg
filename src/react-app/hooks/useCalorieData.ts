import { useState, useEffect } from 'react';
import type { Food, ExtendedFoodEntry, UserGoal } from '@/shared/types';

export function useCalorieData(selectedDate: string) {
  const [entries, setEntries] = useState<ExtendedFoodEntry[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [userGoal, setUserGoal] = useState<UserGoal>({ daily_calorie_goal: 2000 } as UserGoal);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [entriesRes, foodsRes, goalsRes] = await Promise.all([
        fetch(`/api/entries/${selectedDate}`),
        fetch('/api/foods'),
        fetch('/api/goals')
      ]);

      const [entriesData, foodsData, goalsData] = await Promise.all([
        entriesRes.json(),
        foodsRes.json(),
        goalsRes.json()
      ]);

      setEntries(entriesData);
      setFoods(foodsData);
      setUserGoal(goalsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFoodEntry = async (foodId: number, servingSize: number, mealType?: string) => {
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          food_id: foodId,
          serving_size_grams: servingSize,
          meal_type: mealType,
          date_logged: selectedDate
        })
      });
      
      if (response.ok) {
        loadData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to add food entry:', error);
    }
  };

  const deleteFoodEntry = async (entryId: number) => {
    try {
      const response = await fetch(`/api/entries/${entryId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        loadData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to delete food entry:', error);
    }
  };

  const updateGoals = async (goals: Partial<UserGoal>) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goals)
      });
      
      if (response.ok) {
        loadData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to update goals:', error);
    }
  };

  // Calculate totals
  const totals = entries.reduce((acc, entry) => {
    const multiplier = entry.serving_size_grams / 100;
    return {
      calories: acc.calories + (entry.calories_per_100g * multiplier),
      protein: acc.protein + ((entry.protein_per_100g || 0) * multiplier),
      carbs: acc.carbs + ((entry.carbs_per_100g || 0) * multiplier),
      fat: acc.fat + ((entry.fat_per_100g || 0) * multiplier)
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return {
    entries,
    foods,
    userGoal,
    totals,
    loading,
    addFoodEntry,
    deleteFoodEntry,
    updateGoals,
    refreshData: loadData
  };
}
