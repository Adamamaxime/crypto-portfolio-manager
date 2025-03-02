import { useState, useEffect } from 'react';
import { useSupabase } from './useSupabase';
import type { CryptoSignal } from '../types';

export const useSignals = () => {
  const { getAll, create, update, remove } = useSupabase<CryptoSignal>('signals');
  const [signals, setSignals] = useState<CryptoSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSignals();
  }, []);

  const loadSignals = async () => {
    try {
      setLoading(true);
      const data = await getAll();
      setSignals(data);
    } catch (error) {
      console.error('Erreur lors du chargement des signaux:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSignal = async (newSignal: Omit<CryptoSignal, 'id' | 'created_at'>) => {
    try {
      const createdSignal = await create(newSignal);
      setSignals(prev => [createdSignal, ...prev]);
      return createdSignal;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du signal:', error);
      throw error;
    }
  };

  const updateSignal = async (id: string, updates: Partial<CryptoSignal>) => {
    try {
      const updatedSignal = await update(id, updates);
      setSignals(prev => prev.map(signal => signal.id === id ? updatedSignal : signal));
      return updatedSignal;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du signal:', error);
      throw error;
    }
  };

  const deleteSignal = async (id: string) => {
    try {
      await remove(id);
      setSignals(prev => prev.filter(signal => signal.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du signal:', error);
      throw error;
    }
  };

  return {
    signals,
    loading,
    addSignal,
    updateSignal,
    deleteSignal
  };
};