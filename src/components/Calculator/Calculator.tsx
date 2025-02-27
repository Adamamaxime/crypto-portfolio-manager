import React from 'react';
import { Calculator as CalculatorIcon, Save, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalculator } from './useCalculator';
import { SimulationForm } from './SimulationForm';
import { SimulationResults } from './SimulationResults';
import { SimulationHistory } from './SimulationHistory';

export function Calculator() {
  const {
    simulations,
    showHistory,
    currentSimulation,
    quantity,
    totalEntryFees,
    exitValue,
    totalExitFees,
    profit,
    profitPercentage,
    setShowHistory,
    setCurrentSimulation,
    saveSimulation,
    loadSimulation
  } = useCalculator();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <CalculatorIcon className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold">Simulateur de Trading</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={saveSimulation}
            className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="inline-flex items-center px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <History className="w-4 h-4 mr-2" />
            Historique
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showHistory ? (
          <SimulationHistory
            simulations={simulations}
            onLoadSimulation={loadSimulation}
          />
        ) : (
          <div className="space-y-6">
            <SimulationForm
              simulation={currentSimulation}
              onChange={setCurrentSimulation}
            />

            <SimulationResults
              quantity={quantity}
              totalEntryFees={totalEntryFees}
              exitValue={exitValue}
              totalExitFees={totalExitFees}
              profit={profit}
              profitPercentage={profitPercentage}
            />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}