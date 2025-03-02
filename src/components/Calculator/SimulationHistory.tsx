import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Simulation } from '../../types';
import { supabase } from '../../lib/supabase';

interface SimulationHistoryProps {
  simulations: Simulation[];
  onLoadSimulation: (simulation: Simulation) => void;
}

export function SimulationHistory({ simulations, onLoadSimulation }: SimulationHistoryProps) {
  const formatDateTime = (date: string, time: string) => {
    return `${date} ${time}`;
  };

  return (
    <motion.div
      key="history"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold mb-4">Simulations enregistrées</h3>
      {simulations.map((sim) => (
        <motion.div
          key={sim.id}
          className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={() => onLoadSimulation(sim)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{sim.coin}</h4>
              <p className="text-sm text-gray-600">
                Investissement: ${sim.investment} | Prix d'entrée: ${sim.entryPrice}
              </p>
              <p className="text-xs text-gray-500">
                Entrée: {formatDateTime(sim.entryDate, sim.entryTime)}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${(sim.exitPrice * (sim.investment / sim.entryPrice)) - sim.investment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${((sim.exitPrice * (sim.investment / sim.entryPrice)) - sim.investment).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                Sortie: {formatDateTime(sim.exitDate, sim.exitTime)}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}