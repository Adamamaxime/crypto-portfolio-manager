import { useState, useEffect, useMemo } from 'react';
import { useSupabase } from './useSupabase';
import type { Trade } from '../types';

export const usePortfolio = () => {
  const { getAll, create, update, remove } = useSupabase<Trade>('trades');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [executingTrade, setExecutingTrade] = useState<Trade | null>(null);

  // Charger les trades au démarrage
  useEffect(() => {
    loadTrades();
  }, []);

  const loadTrades = async () => {
    try {
      setLoading(true);
      const data = await getAll();
      setTrades(data);
    } catch (error) {
      console.error('Erreur lors du chargement des trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrade = async (newTrade: Omit<Trade, 'id' | 'created_at'>) => {
    try {
      const createdTrade = await create(newTrade);
      setTrades(prev => [createdTrade, ...prev]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du trade:', error);
      throw error;
    }
  };

  const handleEditTrade = async (updatedTrade: Trade) => {
    try {
      const { id, ...updates } = updatedTrade;
      const result = await update(id, updates);
      setTrades(prev => prev.map(trade => trade.id === id ? result : trade));
      setEditingTrade(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du trade:', error);
      throw error;
    }
  };

  const handleDeleteTrade = async (tradeId: string) => {
    try {
      await remove(tradeId);
      setTrades(prev => prev.filter(trade => trade.id !== tradeId));
    } catch (error) {
      console.error('Erreur lors de la suppression du trade:', error);
      throw error;
    }
  };

  const handleExecutePlan = async (tradeId: string, planId: string, status: 'won' | 'lost', exitPrice: number) => {
    try {
      const trade = trades.find(t => t.id === tradeId);
      if (!trade) return;

      const updates = {
        status,
        selectedPlanId: planId,
        closedAt: {
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          price: exitPrice
        },
        exitPlans: trade.exitPlans.map(plan => ({
          ...plan,
          status: plan.id === planId ? 'executed' : 'cancelled'
        }))
      };

      const result = await update(tradeId, updates);
      setTrades(prev => prev.map(trade => trade.id === tradeId ? result : trade));
      setExecutingTrade(null);
    } catch (error) {
      console.error('Erreur lors de l\'exécution du plan:', error);
      throw error;
    }
  };

  // Calculs dérivés
  const {
    totalInvestment,
    currentValue,
    totalProfit,
    totalROI,
    chartData
  } = useMemo(() => {
    const totalInvestment = trades.reduce((sum, trade) => 
      sum + (trade.entryPrice * trade.quantity), 0);

    const currentValue = trades.reduce((sum, trade) => {
      if (trade.status === 'open') {
        const lastExitPlan = trade.exitPlans[trade.exitPlans.length - 1];
        const currentPrice = lastExitPlan ? lastExitPlan.targetPrice : trade.entryPrice;
        return sum + (currentPrice * trade.quantity);
      } else if (trade.closedAt) {
        return sum + (trade.closedAt.price * trade.quantity);
      }
      return sum;
    }, 0);

    const totalProfit = currentValue - totalInvestment;
    const totalROI = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;

    const chartData = trades
      .map(trade => {
        const value = trade.entryPrice * trade.quantity;
        const exitValue = trade.closedAt
          ? trade.closedAt.price * trade.quantity
          : trade.exitPlans[trade.exitPlans.length - 1]?.targetPrice * trade.quantity || value;
        
        return {
          name: trade.coin,
          date: `${trade.date} ${trade.time}`,
          investment: value,
          exitValue: exitValue,
          profit: exitValue - value,
          status: trade.status
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalInvestment,
      currentValue,
      totalProfit,
      totalROI,
      chartData
    };
  }, [trades]);

  return {
    trades,
    loading,
    showAddForm,
    editingTrade,
    executingTrade,
    totalInvestment,
    currentValue,
    totalProfit,
    totalROI,
    chartData,
    handleAddTrade,
    handleEditTrade,
    handleDeleteTrade,
    handleExecutePlan,
    setShowAddForm,
    setEditingTrade,
    setExecutingTrade,
  };
};