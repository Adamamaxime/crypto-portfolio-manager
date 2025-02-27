import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Plus, Trash2, Edit2, TrendingUp, DollarSign, Percent, X, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { Trade, ExitPlan } from '../types';
import { supabase } from '../lib/supabase';

interface AddTradeFormProps {
  onClose: () => void;
  onSubmit: (trade: Trade) => void;
  initialTrade?: Trade;
}

interface ExecutePlanModalProps {
  trade: Trade;
  onClose: () => void;
  onExecute: (tradeId: string, planId: string, status: 'won' | 'lost', exitPrice: number) => void;
}

function AddTradeForm({ onClose, onSubmit, initialTrade }: AddTradeFormProps) {
  const [trade, setTrade] = useState<Trade>(
    initialTrade || {
      id: Date.now().toString(),
      coin: '',
      entryPrice: 0,
      quantity: 0,
      fees: 0,
      exitPlans: [],
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      notes: '',
      status: 'open'
    }
  );

  const [newPlan, setNewPlan] = useState<Partial<ExitPlan>>({
    targetPrice: 0,
    quantity: 0,
    stopLoss: 0,
    notes: ''
  });

  const addExitPlan = () => {
    if (newPlan.targetPrice && newPlan.quantity) {
      setTrade({
        ...trade,
        exitPlans: [
          ...trade.exitPlans,
          {
            id: Date.now().toString(),
            targetPrice: newPlan.targetPrice || 0,
            quantity: newPlan.quantity || 0,
            stopLoss: newPlan.stopLoss || 0,
            notes: newPlan.notes || '',
            status: 'pending'
          }
        ]
      });
      setNewPlan({ targetPrice: 0, quantity: 0, stopLoss: 0, notes: '' });
    }
  };

  const removeExitPlan = (planId: string) => {
    setTrade({
      ...trade,
      exitPlans: trade.exitPlans.filter(plan => plan.id !== planId)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(trade);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {initialTrade ? 'Modifier la Position' : 'Nouvelle Position'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Crypto</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={trade.coin}
                onChange={e => setTrade({ ...trade, coin: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prix d'entrée</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.00000001"
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={trade.entryPrice}
                  onChange={e => setTrade({ ...trade, entryPrice: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantité</label>
              <input
                type="number"
                step="0.00000001"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={trade.quantity}
                onChange={e => setTrade({ ...trade, quantity: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Frais (%)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Percent className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={trade.fees}
                  onChange={e => setTrade({ ...trade, fees: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={trade.date}
                onChange={e => setTrade({ ...trade, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Heure</label>
              <input
                type="time"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={trade.time}
                onChange={e => setTrade({ ...trade, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-4">Plans de Sortie</h3>
            
            <div className="space-y-4">
              {trade.exitPlans.map((plan, index) => (
                <div key={plan.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prix Cible</label>
                      <div className="text-sm">${plan.targetPrice}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quantité</label>
                      <div className="text-sm">{plan.quantity} ({((plan.quantity / trade.quantity) * 100).toFixed(0)}%)</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stop Loss</label>
                      <div className="text-sm">${plan.stopLoss}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExitPlan(plan.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prix Cible</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      step="0.00000001"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={newPlan.targetPrice}
                      onChange={e => setNewPlan({ ...newPlan, targetPrice: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantité</label>
                  <input
                    type="number"
                    step="0.00000001"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={newPlan.quantity}
                    onChange={e => setNewPlan({ ...newPlan, quantity: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stop Loss</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      step="0.00000001"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={newPlan.stopLoss}
                      onChange={e => setNewPlan({ ...newPlan, stopLoss: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addExitPlan}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter Plan
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
              value={trade.notes}
              onChange={e => setTrade({ ...trade, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {initialTrade ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function ExecutePlanModal({ trade, onClose, onExecute }: ExecutePlanModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [status, setStatus] = useState<'won' | 'lost'>('won');
  const [exitPrice, setExitPrice] = useState<number>(0);

  const handleExecute = () => {
    if (selectedPlanId) {
      onExecute(trade.id, selectedPlanId, status, exitPrice);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Exécuter un Plan de Sortie</h2>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner un Plan
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
            >
              <option value="">Choisir un plan...</option>
              {trade.exitPlans.map((plan, index) => (
                <option key={plan.id} value={plan.id}>
                  Plan {index + 1}: ${plan.targetPrice} ({((plan.quantity / trade.quantity) * 100).toFixed(0)}%)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix de Sortie
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.00000001"
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={exitPrice}
                onChange={(e) => setExitPrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Résultat
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStatus('won')}
                className={`flex-1 inline-flex justify-center items-center px-4 py-2 border rounded-md text-sm font-medium
                  ${status === 'won'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Gagné
              </button>
              <button
                type="button"
                onClick={() => setStatus('lost')}
                className={`flex-1 inline-flex justify-center items-center px-4 py-2 border rounded-md text-sm font-medium
                  ${status === 'lost'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                Perdu
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleExecute}
            disabled={!selectedPlanId || exitPrice <= 0}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Exécuter
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Portfolio() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [executingTrade, setExecutingTrade] = useState<Trade | null>(null);

  useEffect(() => {
    const fetchTrades = async () => {
      const { data: user, error: userError } = await supabase.auth.getUser();
      
            if (userError || !user?.user) {
              console.error("Error fetching user:", userError);
              return;
            }
      
            const userId = user.user.id;

      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId);
  
      if (tradesError) {
        console.error('Error fetching trades:', tradesError);
        return;
      }
  
      const { data: exitPlansData, error: exitPlansError } = await supabase
        .from('exit_plans')
        .select('*');
  
      if (exitPlansError) {
        console.error('Error fetching exit plans:', exitPlansError);
        return;
      }
  
      const tradesWithPlans = tradesData.map(trade => ({
        ...trade,
        exitPlans: exitPlansData.filter(plan => plan.trade_id === trade.id)
      }));
  
      setTrades(tradesWithPlans);
    };
  
    fetchTrades();
  }, []);

  const totalInvestment = trades.reduce((sum, trade) => sum + (trade.entryPrice * trade.quantity), 0);
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

  const chartData = trades.map(trade => {
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
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleAddTrade = async (newTrade: Trade) => {
    const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError || !user?.user) {
          console.error("Error fetching user:", userError);
          return;
        }
    
        const userId = user.user.id;

    const { data: tradeData, error: tradeError } = await supabase
      .from('trades')
      .insert([
        {
          user_id: userId,
          coin: newTrade.coin,
          entryPrice: newTrade.entryPrice,
          quantity: newTrade.quantity,
          fees: newTrade.fees,
          date: newTrade.date,
          time: newTrade.time,
          notes: newTrade.notes,
          status: newTrade.status
        }
      ])
      .select();
  
    if (tradeError) {
      console.error('Error adding trade:', tradeError);
      return;
    }
  
    const tradeId = tradeData[0].id;
  
    if (newTrade.exitPlans.length > 0) {
      const { error: exitPlanError } = await supabase
        .from('exit_plans')
        .insert(
          newTrade.exitPlans.map(plan => ({
            id: Date.now().toString(),
            trade_id: tradeId,
            targetPrice: plan.targetPrice,
            quantity: plan.quantity,
            stopLoss: plan.stopLoss,
            notes: plan.notes,
            status: plan.status
          }))
        );
  
      if (exitPlanError) {
        console.error('Error adding exit plans:', exitPlanError);
      }
    }
  
    setTrades([...trades, newTrade]);
  };

  const handleEditTrade = async (updatedTrade: Trade) => {
    const { error: tradeError } = await supabase
      .from('trades')
      .update({
        coin: updatedTrade.coin,
        entryPrice: updatedTrade.entryPrice,
        quantity: updatedTrade.quantity,
        fees: updatedTrade.fees,
        date: updatedTrade.date,
        time: updatedTrade.time,
        notes: updatedTrade.notes,
        status: updatedTrade.status
      })
      .eq('id', updatedTrade.id);
  
    if (tradeError) {
      console.error('Error updating trade:', tradeError);
      return;
    }
  
    // Delete existing exit plans for this trade
    const { error: deleteError } = await supabase
      .from('exit_plans')
      .delete()
      .eq('trade_id', updatedTrade.id);
  
    if (deleteError) {
      console.error('Error deleting exit plans:', deleteError);
    }
  
    // Insert new exit plans
    if (updatedTrade.exitPlans.length > 0) {
      const { error: exitPlanError } = await supabase
        .from('exit_plans')
        .insert(
          updatedTrade.exitPlans.map(plan => ({
            id: Date.now().toString(),
            trade_id: updatedTrade.id,
            targetPrice: plan.targetPrice,
            quantity: plan.quantity,
            stopLoss: plan.stopLoss,
            notes: plan.notes,
            status: plan.status
          }))
        );
  
      if (exitPlanError) {
        console.error('Error adding exit plans:', exitPlanError);
      }
    }
  
    setTrades(trades.map(trade => trade.id === updatedTrade.id ? updatedTrade : trade));
    setEditingTrade(null);
  };

  const handleDeleteTrade = async (tradeId: string) => {
    const { error: tradeError } = await supabase
      .from('trades')
      .delete()
      .eq('id', tradeId);
  
    if (tradeError) {
      console.error('Error deleting trade:', tradeError);
      return;
    }
  
    const { error: exitPlanError } = await supabase
      .from('exit_plans')
      .delete()
      .eq('trade_id', tradeId);
  
    if (exitPlanError) {
      console.error('Error deleting exit plans:', exitPlanError);
    }
  
    setTrades(trades.filter(trade => trade.id !== tradeId));
  };

  const handleExecutePlan = async (tradeId: string, planId: string, status: 'won' | 'lost', exitPrice: number) => {
    const { error: tradeError } = await supabase
      .from('trades')
      .update({
        status,
        closed_at: {
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          price: exitPrice
        }
      })
      .eq('id', tradeId);
  
    if (tradeError) {
      console.error('Error updating trade:', tradeError);
      return;
    }
  
    const { error: exitPlanError } = await supabase
      .from('exit_plans')
      .update({
        status: 'executed'
      })
      .eq('id', planId);
  
    if (exitPlanError) {
      console.error('Error updating exit plan:', exitPlanError);
    }
  
    setTrades(trades.map(trade => {
      if (trade.id === tradeId) {
        return {
          ...trade,
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
      }
      return trade;
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
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

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Performance du Portfolio</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleString('fr-FR')}
                formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
              />
              <Area
                type="monotone"
                dataKey="investment"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorInvestment)"
                name="Investissement"
              />
              <Area
                type="monotone"
                dataKey="exitValue"
                stroke={(data: any) => data.status === 'won' ? '#22c55e' : '#ef4444'}
                fillOpacity={1}
                fill={(data: any) => `url(#color${data.status === 'won' ? 'Profit' : 'Loss'})`}
                name="Valeur de Sortie"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Positions Actuelles</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Position
            </button>
          </div>
        </div>
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
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{trade.coin}</div>
                      </div>
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
                                  : plan.status === 'cancelle d' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
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
                              onClick={() => setExecutingTrade(trade)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingTrade(trade)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteTrade(trade.id)}
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
      </div>

      <AnimatePresence>
        {(showAddForm || editingTrade) && (
          <AddTradeForm
            onClose={() => {
              setShowAddForm(false);
              setEditingTrade(null);
            }}
            onSubmit={editingTrade ? handleEditTrade : handleAddTrade}
            initialTrade={editingTrade || undefined}
          />
        )}
        {executingTrade && (
          <ExecutePlanModal
            trade={executingTrade}
            onClose={() => setExecutingTrade(null)}
            onExecute={handleExecutePlan}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}