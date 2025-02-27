import React, { useEffect, useState } from 'react';
import { Calculator as CalculatorIcon, DollarSign, Percent, Save, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Simulation } from '../types';
import { supabase } from '../lib/supabase';

export function Calculator() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentSimulation, setCurrentSimulation] = useState<Simulation>({
    id: '',
    coin: '',
    entryPrice: 0,
    investment: 0,
    entryFees: 0.1,
    exitFees: 0.1,
    networkFees: 0,
    exitPrice: 0,
    entryDate: new Date().toISOString().split('T')[0],
    exitDate: new Date().toISOString().split('T')[0],
    entryTime: '00:00',
    exitTime: '00:00',
    notes: ''
  });
  
    useEffect(() => {
      const fetchSimulations = async () => {
        const { data: user, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user?.user) {
          console.error("Error fetching user:", userError);
          return;
        }
  
        const userId = user.user.id;
  
        const { data, error } = await supabase
          .from("simulations")
          .select("*")
          .eq("user_id", userId);
  
        if (error) {
          console.error("Error fetching simulations:", error);
        } else {
          setSimulations(data || []);
        }
      };
  
      fetchSimulations();
    }, []);

  const quantity = currentSimulation.investment / currentSimulation.entryPrice;
  const totalEntryFees = (currentSimulation.investment * currentSimulation.entryFees) / 100 + currentSimulation.networkFees;
  const exitValue = quantity * currentSimulation.exitPrice;
  const totalExitFees = (exitValue * currentSimulation.exitFees) / 100 + currentSimulation.networkFees;
  const profit = exitValue - currentSimulation.investment - totalEntryFees - totalExitFees;
  const profitPercentage = (profit / currentSimulation.investment) * 100;

  const saveSimulation = async () => {
    if (!currentSimulation.coin || !currentSimulation.entryPrice || !currentSimulation.investment || !currentSimulation.entryFees || !currentSimulation.exitFees || !currentSimulation.networkFees || !currentSimulation.exitPrice || !currentSimulation.notes) {
      alert("Please fill all required fields");
      return;
    }

    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.user) {
      console.error("Error fetching user:", userError);
      return;
    }

    const newSimulation = {
      ...currentSimulation,
      id: Date.now().toString(),
      user_id: user.user.id,
    };
  
    const { data, error } = await supabase
      .from("simulations")
      .insert([newSimulation]);
  
    if (error) {
      console.error("Error saving simulation:", error);
    } else {
      console.log("Simulation saved:", data);
      setCurrentSimulation({
        id: '',
        coin: '',
        entryPrice: 0,
        investment: 0,
        entryFees: 0.1,
        exitFees: 0.1,
        networkFees: 0,
        exitPrice: 0,
        entryDate: new Date().toISOString().split('T')[0],
        exitDate: new Date().toISOString().split('T')[0],
        entryTime: '00:00',
        exitTime: '00:00',
        notes: ''
      });
    }
  };

  const loadSimulation = (simulation: Simulation) => {
    setCurrentSimulation(simulation);
    setShowHistory(false);
  };

  const formatDateTime = (date: string, time: string) => {
    return `${date} ${time}`;
  };

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
            onClick={() => saveSimulation()}
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
                onClick={() => loadSimulation(sim)}
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
        ) : (
          <motion.div
            key="simulator"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom de la crypto</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={currentSimulation.coin}
                  onChange={(e) => setCurrentSimulation({ ...currentSimulation, coin: e.target.value })}
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
                    value={currentSimulation.investment}
                    onChange={(e) => setCurrentSimulation({ ...currentSimulation, investment: Number(e.target.value) })}
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
                    value={currentSimulation.entryPrice}
                    onChange={(e) => setCurrentSimulation({ ...currentSimulation, entryPrice: Number(e.target.value) })}
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
                    value={currentSimulation.exitPrice}
                    onChange={(e) => setCurrentSimulation({ ...currentSimulation, exitPrice: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date d'achat</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={currentSimulation.entryDate}
                    onChange={(e) => setCurrentSimulation({ ...currentSimulation, entryDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Heure d'achat</label>
                  <input
                    type="time"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={currentSimulation.entryTime}
                    onChange={(e) => setCurrentSimulation({ ...currentSimulation, entryTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de vente</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={currentSimulation.exitDate}
                    onChange={(e) => setCurrentSimulation({ ...currentSimulation, exitDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Heure de vente</label>
                  <input
                    type="time"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={currentSimulation.exitTime}
                    onChange={(e) => setCurrentSimulation({ ...currentSimulation, exitTime: e.target.value })}
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
                    value={currentSimulation.entryFees}
                    onChange={(e) => setCurrentSimulation({ ...currentSimulation, entryFees: Number(e.target.value) })}
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
                    value={currentSimulation.exitFees}
                    onChange={(e) => setCurrentSimulation({ ...currentSimulation, exitFees: Number(e.target.value) })}
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
                    value={currentSimulation.networkFees}
                    onChange={(e) => setCurrentSimulation({ ...currentSimulation, networkFees: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
                value={currentSimulation.notes}
                onChange={(e) => setCurrentSimulation({ ...currentSimulation, notes: e.target.value })}
              />
            </div>

            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Quantité</p>
                  <p className="text-lg font-semibold">{quantity.toFixed(8)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Frais totaux</p>
                  <p className="text-lg font-semibold">${(totalEntryFees + totalExitFees).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Profit/Perte</p>
                  <p className={`text-lg font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${profit.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ROI</p>
                  <p className={`text-lg font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {profitPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}