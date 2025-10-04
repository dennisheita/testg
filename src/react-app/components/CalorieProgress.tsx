interface CalorieProgressProps {
  consumed: number;
  goal: number;
}

export default function CalorieProgress({ consumed, goal }: CalorieProgressProps) {
  const percentage = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {Math.round(consumed)}
        </div>
        <div className="text-gray-600">
          of {goal} calories
        </div>
      </div>

      {/* Progress Circle */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#10b981"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {Math.round(percentage)}%
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        {remaining > 0 ? (
          <div className="text-sm text-gray-600">
            {Math.round(remaining)} calories remaining
          </div>
        ) : (
          <div className="text-sm text-green-600 font-medium">
            Goal reached! 🎉
          </div>
        )}
      </div>
    </div>
  );
}
