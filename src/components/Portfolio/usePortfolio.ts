import { useState, useEffect, useMemo } from 'react';
import { useSupabase } from '../../hooks/useSupabase';
import type { Trade } from '../../types';

export const usePortfolio = () => {
  const { getAll, create, update, remove } = useSupabase<Trade>('trades');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [executingTrade, setExecutingTrade] = useState<Trade | null>(null);

  useEffect(() => {
    loadTrades();
  }, []);

  const loadTrades = async () => {
    try {
      setLoading(true);
      const data = await getAll();
      setTrades(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrade = async (newTrade: Omit<Trade, 'id' | 'created_at'>) => {
    try {
      // Adapter les données pour correspondre au schéma de la base de données
      const tradeData = {
        coin: newTrade.coin,
        entry_price: newTrade.entryPrice,
        quantity: newTrade.quantity,
        fees: newTrade.fees,
        notes: newTrade.notes,
        status: newTrade.status,
        date: newTrade.date,
        time: newTrade.time,
        exit_plans: newTrade.exitPlans.map(plan => ({
          target_price: plan.targetPrice,
          quantity: plan.quantity,
          stop_loss: plan.stopLoss,
          notes: plan.notes,
          status: plan.status || 'pending'
        }))
      };

      const createdTrade = await create(tradeData);
      if (createdTrade) {
        setTrades(prev => [createdTrade, ...prev]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du trade:', error);
      throw error;
    }
  };

  const handleEditTrade = async (updatedTrade: Trade) => {
    try {
      const { id, ...updates } = updatedTrade;
      // Adapter les données pour correspondre au schéma de la base de données
      const tradeUpdates = {
        coin: updates.coin,
        entry_price: updates.entryPrice,
        quantity: updates.quantity,
        fees: updates.fees,
        notes: updates.notes,
        status: updates.status,
        date: updates.date,
        time: updates.time,
        exit_plans: updates.exitPlans.map(plan => ({
          target_price: plan.targetPrice,
          quantity: plan.quantity,
          stop_loss: plan.stopLoss,
          notes: plan.notes,
          status: plan.status || 'pending'
        }))
      };

      const result = await update(id, tradeUpdates);
      if (result) {
        setTrades(prev => prev.map(trade => trade.id === id ? result : trade));
      }
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
        selected_plan_id: planId,
        closed_at: {
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          price: exitPrice
        },
        exit_plans: trade.exitPlans.map(plan => ({
          target_price: plan.targetPrice,
          quantity: plan.quantity,
          stop_loss: plan.stopLoss,
          notes: plan.notes,
          status: plan.id === planId ? 'executed' : 'cancelled'
        }))
      };

      const result = await update(tradeId, updates);
      if (result) {
        setTrades(prev => prev.map(trade => trade.id === tradeId ? result : trade));
      }
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