import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { usePortfolio } from './usePortfolio';
import { PortfolioStats } from './PortfolioStats';
import { PortfolioChart } from './PortfolioChart';
import { TradesList } from './TradesList';
import { AddTradeForm } from './AddTradeForm';
import { ExecutePlanModal } from './ExecutePlanModal';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function Portfolio() {
  const {
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
  } = usePortfolio();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <PortfolioStats
        totalInvestment={totalInvestment}
        currentValue={currentValue}
        totalProfit={totalProfit}
        totalROI={totalROI}
      />

      <PortfolioChart data={chartData} />

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Positions Actuelles alh</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Position
            </button>
          </div>
        </div>

        <TradesList
          trades={trades}
          onEdit={setEditingTrade}
          onDelete={handleDeleteTrade}
          onExecute={setExecutingTrade}
        />
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