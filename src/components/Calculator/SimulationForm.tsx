import React from 'react';
import { DollarSign, Percent } from 'lucide-react';
import type { Simulation } from '../../types';

interface SimulationFormProps {
  simulation: Simulation;
  onChange: (simulation: Simulation) => void;
}

export function SimulationForm({ simulation, onChange }: SimulationFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom de la crypto</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={simulation.network_fees}
            onChange={(e) => onChange({ ...simulation, network_fees: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Montant investi</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={simulation.investment}
              onChange={(e) => onChange({ ...simulation, investment: Number(e.target.value) })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Prix d'entrée</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={simulation.entryPrice}
              onChange={(e) => onChange({ ...simulation, entryPrice: Number(e.target.value) })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Prix de sortie</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={simulation.exitPrice}
              onChange={(e) => onChange({ ...simulation, exitPrice: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Frais d'achat (%)</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Percent className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              step="0.01"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={simulation.entryFees}
              onChange={(e) => onChange({ ...simulation, entryFees: Number(e.target.value) })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Frais de vente (%)</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Percent className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              step="0.01"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={simulation.exitFees}
              onChange={(e) => onChange({ ...simulation, exitFees: Number(e.target.value) })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Frais réseau</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              step="0.01"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={simulation.networkFees}
              onChange={(e) => onChange({ ...simulation, networkFees: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
          value={simulation.notes}
          onChange={(e) => onChange({ ...simulation, notes: e.target.value })}
        />
      </div>
    </div>
  );
}