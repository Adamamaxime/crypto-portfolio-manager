import React from 'react';
import { motion } from 'framer-motion';
import type { IdeaNote } from '../../types';

interface IdeaGridProps {
  ideas: IdeaNote[];
}

export function IdeaGrid({ ideas }: IdeaGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {ideas.map((idea) => (
        <motion.div
          key={idea.id}
          whileHover={{ scale: 1.05, rotate: 0 }}
          initial={{ rotate: Math.random() * 6 - 3 }}
          className={`${idea.color} p-4 rounded-lg shadow-md transform transition-transform cursor-pointer hover:shadow-lg`}
        >
          <p className="text-gray-800 font-medium">{idea.content}</p>
        </motion.div>
      ))}
    </div>
  );
}