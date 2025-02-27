import React from 'react';

interface PortfolioStatsProps {
  totalInvestment: number;
  currentValue: number;
  totalProfit: number;
  totalROI: number;
}

export function PortfolioStats({
  totalInvestment,
  currentValue,
  totalProfit,
  totalROI
}: PortfolioStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h3 className="text-sm font-medium text-gray-500">Investissement Total</h3>
        <p className="mt-2 text-2xl font-semibold">${totalInvestment.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h3 className="text-sm font-medium text-gray-500">Valeur Actuelle</h3>
        <p className="mt-2 text-2xl font-semibold">${currentValue.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h3 className="text-sm font-medium text-gray-500">Profit/Perte</h3>
        <p className={`mt-2 text-2xl font-semibold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ${totalProfit.toFixed(2)}
        </p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h3 className="text-sm font-medium text-gray-500">ROI Global</h3>
        <p className={`mt-2 text-2xl font-semibold ${totalROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {totalROI.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}