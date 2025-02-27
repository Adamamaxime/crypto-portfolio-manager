import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Signal,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "../lib/supabase";

interface CryptoSignal {
  id: string;
  coin: string;
  type: "long" | "short";
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  description: string;
  risk: "low" | "medium" | "high";
  date: Date;
  status: "active" | "completed" | "cancelled";
}

interface SignalFormProps {
  onClose: () => void;
  onSubmit: (signal: CryptoSignal) => void;
  initialSignal?: CryptoSignal;
}

function SignalForm({ onClose, onSubmit, initialSignal }: SignalFormProps) {
  const [signal, setSignal] = useState<CryptoSignal>(
    initialSignal || {
      id: Date.now().toString(),
      coin: "",
      type: "long",
      entryPrice: 0,
      targetPrice: 0,
      stopLoss: 0,
      description: "",
      risk: "medium",
      status: "active",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(signal);
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
        className="bg-white rounded-xl shadow-xl max-w-lg w-full"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {initialSignal ? "Modifier le Signal" : "Nouveau Signal"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Crypto
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={signal.coin}
              onChange={(e) => setSignal({ ...signal, coin: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={signal.type}
                onChange={(e) =>
                  setSignal({
                    ...signal,
                    type: e.target.value as "long" | "short",
                  })
                }
              >
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Niveau de Risque
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={signal.risk}
                onChange={(e) =>
                  setSignal({
                    ...signal,
                    risk: e.target.value as "low" | "medium" | "high",
                  })
                }
              >
                <option value="low">Faible</option>
                <option value="medium">Moyen</option>
                <option value="high">Élevé</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prix d'Entrée
              </label>
              <input
                type="number"
                step="0.00000001"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={signal.entryPrice}
                onChange={(e) =>
                  setSignal({ ...signal, entryPrice: Number(e.target.value) })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Objectif
              </label>
              <input
                type="number"
                step="0.00000001"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={signal.targetPrice}
                onChange={(e) =>
                  setSignal({ ...signal, targetPrice: Number(e.target.value) })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stop Loss
              </label>
              <input
                type="number"
                step="0.00000001"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={signal.stopLoss}
                onChange={(e) =>
                  setSignal({ ...signal, stopLoss: Number(e.target.value) })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              value={signal.description}
              onChange={(e) =>
                setSignal({ ...signal, description: e.target.value })
              }
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
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
              {initialSignal ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function Signals() {
  const [signals, setSignals] = useState<CryptoSignal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSignal, setEditingSignal] = useState<CryptoSignal | null>(null);

  useEffect(() => {
    const fetchSignals = async () => {
      const { data: user, error: userError } = await supabase.auth.getUser();

      if (userError || !user?.user) {
        console.error("Error fetching user:", userError);
        return;
      }

      const userId = user.user.id;

      const { data, error } = await supabase
        .from("signals")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching signals:", error);
      } else {
        setSignals(data || []);
      }
    };

    fetchSignals();
  }, []);

  const handleAddSignal = async (newSignal: CryptoSignal) => {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.user) {
      console.error("Error fetching user:", userError);
      return;
    }

    const userId = user.user.id;
    const newSignalData = {
      ...newSignal,
      user_id: userId,
    };

    const { data, error } = await supabase
      .from("signals")
      .insert([newSignalData]);

    if (error) {
      console.error("Error saving signal:", error);
    } else {
      console.log("Signal saved:", data);
    }
  };

  const handleEditSignal = async (updatedSignal: CryptoSignal) => {
    const { error } = await supabase
      .from("signals")
      .update(updatedSignal)
      .eq("id", updatedSignal.id);

    if (error) {
      console.error("Error updating signal:", error);
      return;
    }

    setSignals(
      signals.map((signal) =>
        signal.id === updatedSignal.id ? updatedSignal : signal
      )
    );
    setEditingSignal(null);
  };

  const handleDeleteSignal = async (signalId: string) => {
    const { error } = await supabase
      .from("signals")
      .delete()
      .eq("id", signalId);

    if (error) {
      console.error("Error deleting signal:", error);
      return;
    }
    setSignals(signals.filter((signal) => signal.id !== signalId));
  };

  const handleStatusChange = async (
    signalId: string,
    status: "completed" | "cancelled"
  ) => {
    const { error } = await supabase
      .from("signals")
      .update({ status })
      .eq("id", signalId);

    if (error) {
      console.error("Error updating status:", error);
      return;
    }

    setSignals(
      signals.map((signal) =>
        signal.id === signalId ? { ...signal, status } : signal
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Signal className="w-6 h-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold">Signaux de Trading</h2>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Signal
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signals.map((signal) => (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-lg border p-4 ${
                  signal.status === "completed"
                    ? "border-green-200 bg-green-50"
                    : signal.status === "cancelled"
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{signal.coin}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        signal.type === "long"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {signal.type === "long" ? "Long" : "Short"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {signal.status === "active" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(signal.id, "completed")
                          }
                          className="text-green-600 hover:text-green-900"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(signal.id, "cancelled")
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingSignal(signal)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteSignal(signal.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Prix d'entrée:</span>
                    <span className="font-medium">${signal.entryPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Objectif:</span>
                    <span className="font-medium text-green-600">
                      ${signal.targetPrice}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Stop Loss:</span>
                    <span className="font-medium text-red-600">
                      ${signal.stopLoss}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {signal.description}
                </p>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{signal.created_at}</span>
                  <span className="flex items-center">
                    <AlertTriangle
                      className={`w-4 h-4 mr-1 ${
                        signal.risk === "low"
                          ? "text-green-500"
                          : signal.risk === "medium"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    />
                    Risque{" "}
                    {signal.risk === "low"
                      ? "Faible"
                      : signal.risk === "medium"
                      ? "Moyen"
                      : "Élevé"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(showAddForm || editingSignal) && (
          <SignalForm
            onClose={() => {
              setShowAddForm(false);
              setEditingSignal(null);
            }}
            onSubmit={editingSignal ? handleEditSignal : handleAddSignal}
            initialSignal={editingSignal || undefined}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
