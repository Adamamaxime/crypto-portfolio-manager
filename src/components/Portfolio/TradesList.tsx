import React from 'react';
import { Edit2, Trash2, Check } from 'lucide-react';
import type { Trade } from '../../types';

interface TradesListProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
  onExecute: (trade: Trade) => void;
}

export function TradesList({ trades, onEdit, onDelete, onExecute }: TradesListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crypto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix d'entrée</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plans de Sortie</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/L</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {trades.map(trade => {
            const value = trade.entryPrice * trade.quantity;
            const exitValue = trade.closedAt
              ? trade.closedAt.price * trade.quantity
              : trade.exitPlans[trade.exitPlans.length - 1]?.targetPrice * trade.quantity || value;
            const profit = exitValue - value;
            const profitPercentage = (profit / value) * 100;

            return (
              <tr key={trade.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{trade.coin}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${trade.entryPrice.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{trade.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${value.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-1">
                    {trade.exitPlans.map((plan, index) => (
                      <div key={plan.id} className="text-sm">
                        <span className="font-medium">Plan {index + 1}:</span>
                        <span className="ml-2">${plan.targetPrice} ({((plan.quantity / trade.quantity) * 100).toFixed(0)}%)</span>
                        {plan.status && (
                          <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            plan.status === 'executed' 
                              ? 'bg-green-100 text-green-800'
                              : plan.status === 'cancelled' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {plan.status}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    trade.status === 'open'
                      ? 'bg-blue-100 text-blue-800'
                      : trade.status === 'won'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {trade.status === 'open' ? 'En cours' :
                     trade.status === 'won' ? 'Gagné' : 'Perdu'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${profit.toFixed(2)} ({profitPercentage.toFixed(2)}%)
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    {trade.status === 'open' && (
                      <>
                        <button
                          onClick={() => onExecute(trade)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(trade)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onDelete(trade.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}