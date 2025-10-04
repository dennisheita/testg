import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useCalorieData } from '@/react-app/hooks/useCalorieData';
import FoodSearch from '@/react-app/components/FoodSearch';
import CalorieProgress from '@/react-app/components/CalorieProgress';
import FoodLog from '@/react-app/components/FoodLog';
import MacroBreakdown from '@/react-app/components/MacroBreakdown';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const {
    entries,
    userGoal,
    totals,
    loading,
    addFoodEntry,
    deleteFoodEntry
  } = useCalorieData(selectedDate);

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const changeDate = (direction: 'prev' | 'next') => {
    const date = new Date(selectedDate);
    if (direction === 'prev') {
      date.setDate(date.getDate() - 1);
    } else {
      date.setDate(date.getDate() + 1);
    }
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="animate-spin">
          <Loader2 className="w-10 h-10 text-green-600" />
        </div>
        <p className="mt-4 text-gray-600">Loading your nutrition data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">NT</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">NutriTrack</h1>
            </div>

            {/* Date Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => changeDate('prev')}
                className="p-2 hover:bg-green-50 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="font-medium text-gray-900">
                  {formatDate(selectedDate)}
                </span>
              </div>

              <button
                onClick={() => changeDate('next')}
                className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                disabled={selectedDate >= new Date().toISOString().split('T')[0]}
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Progress & Macros */}
          <div className="space-y-6">
            <CalorieProgress 
              consumed={totals.calories} 
              goal={userGoal.daily_calorie_goal || 2000} 
            />
            <MacroBreakdown 
              protein={totals.protein}
              carbs={totals.carbs}
              fat={totals.fat}
            />
          </div>

          {/* Middle Column - Food Log */}
          <div>
            <FoodLog 
              entries={entries}
              onDeleteEntry={deleteFoodEntry}
            />
          </div>

          {/* Right Column - Add Food */}
          <div>
            <FoodSearch onAddFood={addFoodEntry} />
          </div>
        </div>
      </main>
    </div>
  );
}
