import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { useIdeaBoard } from './useIdeaBoard';
import { IdeaForm } from './IdeaForm';
import { IdeaGrid } from './IdeaGrid';

export function IdeaBoard() {
  const {
    ideas,
    newIdea,
    setNewIdea,
    addIdea
  } = useIdeaBoard();

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

      <IdeaForm
        newIdea={newIdea}
        setNewIdea={setNewIdea}
        addIdea={addIdea}
      />

      <IdeaGrid ideas={ideas} />
    </motion.div>
  );
}