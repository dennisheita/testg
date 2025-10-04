interface MacroBreakdownProps {
  protein: number;
  carbs: number;
  fat: number;
}

export default function MacroBreakdown({ protein, carbs, fat }: MacroBreakdownProps) {
  const total = protein * 4 + carbs * 4 + fat * 9; // calories from macros
  
  const proteinPercentage = total > 0 ? (protein * 4 / total) * 100 : 0;
  const carbsPercentage = total > 0 ? (carbs * 4 / total) * 100 : 0;
  const fatPercentage = total > 0 ? (fat * 9 / total) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Macronutrients</h2>
      
      {total > 0 ? (
        <div className="space-y-4">
          {/* Visual breakdown bar */}
          <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500" 
              style={{ width: `${proteinPercentage}%` }}
              title={`Protein: ${proteinPercentage.toFixed(1)}%`}
            />
            <div 
              className="bg-yellow-500" 
              style={{ width: `${carbsPercentage}%` }}
              title={`Carbs: ${carbsPercentage.toFixed(1)}%`}
            />
            <div 
              className="bg-red-500" 
              style={{ width: `${fatPercentage}%` }}
              title={`Fat: ${fatPercentage.toFixed(1)}%`}
            />
          </div>

          {/* Detailed breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Protein</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{Math.round(protein)}g</div>
                <div className="text-xs text-gray-500">{Math.round(proteinPercentage)}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Carbs</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{Math.round(carbs)}g</div>
                <div className="text-xs text-gray-500">{Math.round(carbsPercentage)}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Fat</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{Math.round(fat)}g</div>
                <div className="text-xs text-gray-500">{Math.round(fatPercentage)}%</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          <p>No macronutrient data available</p>
          <p className="text-sm">Add some foods to see your macro breakdown</p>
        </div>
      )}
    </div>
  );
}
