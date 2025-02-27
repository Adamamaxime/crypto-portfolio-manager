import React from 'react';

interface SimulationResultsProps {
  quantity: number;
  totalEntryFees: number;
  exitValue: number;
  totalExitFees: number;
  profit: number;
  profitPercentage: number;
}

export function SimulationResults({
  quantity,
  totalEntryFees,
  exitValue,
  totalExitFees,
  profit,
  profitPercentage
}: SimulationResultsProps) {
  return (
    <div className="mt-6 bg-gray-50 rounded-lg p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-500">Quantité</p>
          <p className="text-lg font-semibold">{quantity.toFixed(8)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Frais totaux</p>
          <p className="text-lg font-semibold">${(totalEntryFees + totalExitFees).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Profit/Perte</p>
          <p className={`text-lg font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${profit.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">ROI</p>
          <p className={`text-lg font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {profitPercentage.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}