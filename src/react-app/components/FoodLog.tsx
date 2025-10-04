import { Trash2, Clock } from 'lucide-react';
import type { ExtendedFoodEntry } from '@/shared/types';

interface FoodLogProps {
  entries: ExtendedFoodEntry[];
  onDeleteEntry: (id: number) => void;
}

export default function FoodLog({ entries, onDeleteEntry }: FoodLogProps) {
  const groupedEntries = entries.reduce((groups, entry) => {
    const mealType = entry.meal_type || 'Other';
    if (!groups[mealType]) {
      groups[mealType] = [];
    }
    groups[mealType].push(entry);
    return groups;
  }, {} as Record<string, ExtendedFoodEntry[]>);

  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack', 'Other'];
  const sortedMeals = mealOrder.filter(meal => groupedEntries[meal]);

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Log</h2>
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No food logged yet today.</p>
          <p className="text-sm">Start by searching for foods to add.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Log</h2>
      
      <div className="space-y-6">
        {sortedMeals.map((mealType) => (
          <div key={mealType}>
            <h3 className="text-lg font-medium text-gray-900 mb-3 capitalize">
              {mealType}
            </h3>
            <div className="space-y-3">
              {groupedEntries[mealType].map((entry) => {
                const multiplier = entry.serving_size_grams / 100;
                const calories = Math.round(entry.calories_per_100g * multiplier);
                const protein = entry.protein_per_100g ? Math.round((entry.protein_per_100g || 0) * multiplier) : null;
                
                return (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{entry.food_name}</div>
                      <div className="text-sm text-gray-600">
                        {entry.serving_size_grams}g • {calories} cal
                        {protein && ` • ${protein}g protein`}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
