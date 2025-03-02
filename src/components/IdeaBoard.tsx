import React, { useEffect, useState } from "react";
import { motion, Reorder } from "framer-motion";
import { Lightbulb, Plus, Trash } from "lucide-react";
import type { IdeaNote } from "../types";
import { supabase } from "../lib/supabase";

const COLORS = [
  "bg-yellow-100",
  "bg-green-100",
  "bg-blue-100",
  "bg-red-100",
  "bg-purple-100",
  "bg-indigo-100",
  "bg-pink-100",
  "bg-orange-100",
  "bg-teal-100",
];

export function IdeaBoard() {
  const [ideas, setIdeas] = useState<IdeaNote[]>([]);
  const [newIdea, setNewIdea] = useState("");

  useEffect(() => {
    const fetchIdeas = async () => {
      const { data: user, error: userError } = await supabase.auth.getUser();

      if (userError || !user?.user) {
        console.error("Error fetching user:", userError);
        return;
      }

      const userId = user.user.id;

      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching simulations:", error);
      } else {
        setIdeas(data || []);
      }
    };

    fetchIdeas();
  }, []);

  const addIdea = async () => {
    if (newIdea.trim()) {
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user) {
        console.error("Error fetching user:", userError);
        return;
      }

      const userId = user.user.id;
      const newIdeaData = {
        id: Date.now().toString(),
        content: newIdea,
        color: randomColor,
        user_id: userId,
      };

      const { data, error } = await supabase
        .from("ideas")
        .insert([newIdeaData]);

      if (error) {
        console.error("Error saving idea:", error);
      } else {
        console.log("Idea saved:", data);
        setNewIdea("");
        setIdeas([...ideas, newIdeaData]);
      }
    } else {
      alert("Veuillez saisir un contenu pour votre idée.");
    }
  };

  const deleteIdeas = async (id) => {
    const { error } = await supabase.from("ideas").delete().eq("id", id);
    if (error) {
      console.error("Error deleting simulation:", error.message);
    } else {
      console.log("Simulation deleted successfully");
      setIdeas((prev) => prev.filter((sim) => sim.id !== id));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg min-h-[600px]"
    >
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold">Idées de Trading Crypto</h2>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            placeholder="Ajouter une nouvelle idée..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            onKeyPress={(e) => e.key === "Enter" && addIdea()}
          />
          <button
            onClick={addIdea}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {ideas.map((idea) => (
          <motion.div
            key={idea.id}
            whileHover={{ scale: 1.05, rotate: 0 }}
            initial={{ rotate: Math.random() * 6 - 3 }}
            className={`${idea.color} p-4 rounded-lg shadow-md transform transition-transform cursor-pointer hover:shadow-lg flex justify-between`}
          >
            <p className="text-gray-800 font-medium">{idea.content}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteIdeas(idea.id);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash size={18} />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
