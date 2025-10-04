import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import type { Food } from '@/shared/types';

interface FoodSearchProps {
  onAddFood: (foodId: number, servingSize: number, mealType?: string) => void;
}

export default function FoodSearch({ onAddFood }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [servingSize, setServingSize] = useState('100');
  const [mealType, setMealType] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.length >= 2) {
      searchFoods();
    } else {
      setResults([]);
    }
  }, [query]);

  const searchFoods = async () => {
    setIsSearching(true);
    try {
      const response = await fetch(`/api/foods/search?q=${encodeURIComponent(query)}`);
      const foods = await response.json();
      setResults(foods);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFood = () => {
    if (selectedFood && servingSize) {
      onAddFood(selectedFood.id, parseFloat(servingSize), mealType || undefined);
      setSelectedFood(null);
      setServingSize('100');
      setMealType('');
      setQuery('');
      setResults([]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Food</h2>
      
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for foods..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="text-center py-4 text-gray-500">Searching...</div>
        )}
        
        {results.length > 0 && !selectedFood && (
          <div className="max-h-60 overflow-y-auto space-y-2">
            {results.map((food) => (
              <button
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors"
              >
                <div className="font-medium text-gray-900">{food.name}</div>
                <div className="text-sm text-gray-500">
                  {food.calories_per_100g} cal per 100g
                  {food.brand && ` • ${food.brand}`}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Selected Food Entry */}
        {selectedFood && (
          <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{selectedFood.name}</h3>
                <p className="text-sm text-gray-600">
                  {selectedFood.calories_per_100g} cal per 100g
                </p>
              </div>
              <button
                onClick={() => setSelectedFood(null)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serving Size (grams)
                </label>
                <input
                  type="number"
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Type (optional)
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select meal</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            </div>

            {servingSize && (
              <div className="text-sm text-gray-600 bg-white p-3 rounded-md">
                <div className="font-medium">Nutrition for {servingSize}g:</div>
                <div>Calories: {Math.round((selectedFood.calories_per_100g * parseFloat(servingSize)) / 100)}</div>
                {selectedFood.protein_per_100g && (
                  <div>Protein: {Math.round(((selectedFood.protein_per_100g || 0) * parseFloat(servingSize)) / 100)}g</div>
                )}
              </div>
            )}

            <button
              onClick={handleAddFood}
              disabled={!servingSize}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add to Log
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
