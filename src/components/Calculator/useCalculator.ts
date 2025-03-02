import { useState, useMemo, useEffect } from 'react';
import { useSimulations } from '../../hooks/useSimulations';
import type { Simulation } from '../../types';

const initialSimulation: Simulation = {
  id: '',
  coin: '',
  entry_price: 0,
  investment: 0,
  entry_fees: 0.1,
  exit_fees: 0.1,
  network_fees: 0,
  exit_price: 0,
  entryDate: new Date().toISOString().split('T')[0],
  exitDate: new Date().toISOString().split('T')[0],
  entryTime: '00:00',
  exitTime: '00:00',
  notes: '',
  createdAt: new Date()
};

export const useCalculator = () => {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const { loadSimulations, saveSimulation } = useSimulations();
  const [showHistory, setShowHistory] = useState(false);
  const [currentSimulation, setCurrentSimulation] = useState<Simulation>({
    ...initialSimulation,
    id: Date.now().toString()
  });

  useEffect(() => {
    loadSimulations();
  }, []);

  const {
    quantity,
    totalEntryFees,
    exitValue,
    totalExitFees,
    profit,
    profitPercentage
  } = useMemo(() => {
    const quantity = currentSimulation.investment / currentSimulation.entry_price;
    const totalEntryFees = (currentSimulation.investment * currentSimulation.entry_fees) / 100 + currentSimulation.network_fees;
    const exitValue = quantity * currentSimulation.exit_price;
    const totalExitFees = (exitValue * currentSimulation.exit_fees) / 100 + currentSimulation.network_fees;
    const profit = exitValue - currentSimulation.investment - totalEntryFees - totalExitFees;
    const profitPercentage = (profit / currentSimulation.investment) * 100;

    return {
      quantity,
      totalEntryFees,
      exitValue,
      totalExitFees,
      profit,
      profitPercentage
    };
  }, [currentSimulation]);

  const handleSaveSimulation = async () => {
    try {
      await saveSimulation(currentSimulation);
      // Recharger les simulations après la sauvegarde
      await loadSimulations();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const loadSimulation = (simulation: Simulation) => {
    setCurrentSimulation(simulation);
    setShowHistory(false);
  };

  return {
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
    saveSimulation: handleSaveSimulation,
    loadSimulation
  };
};