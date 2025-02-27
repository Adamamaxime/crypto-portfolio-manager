import { useState } from 'react';
import { useSupabase } from './useSupabase';
import type { Simulation } from '../types';

export const useSimulations = () => {
  const { create, getAll } = useSupabase<Simulation>('simulations');
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSimulations = async () => {
    try {
      setLoading(true);
      const data = await getAll();
      setSimulations(data || []);
    } catch (err) {
      setError('Erreur lors du chargement des simulations');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSimulation = async (simulation: Omit<Simulation, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      // Adapter les noms des champs pour correspondre à l'interface Simulation
      const simulationData = {
        coin: simulation.coin,
        entry_price: simulation.entry_price,
        investment: simulation.investment,
        entry_fees: simulation.entry_fees,
        exit_fees: simulation.exit_fees,
        network_fees: simulation.network_fees,
        exit_price: simulation.exit_price,
        notes: simulation.notes,
        date: simulation.entryDate,
        time: simulation.entryTime
      };

      const savedSimulation = await create(simulationData);

      setSimulations(prev => [savedSimulation, ...prev]);
      return savedSimulation;
    } catch (err) {
      setError('Erreur lors de la sauvegarde de la simulation');
      console.error('Erreur:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    simulations,
    loading,
    error,
    loadSimulations,
    saveSimulation
  };
};