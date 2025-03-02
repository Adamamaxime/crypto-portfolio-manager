import { useState } from 'react';
import type { IdeaNote } from '../../types';

const COLORS = [
  'bg-yellow-100', 'bg-green-100', 'bg-blue-100', 'bg-red-100', 
  'bg-purple-100', 'bg-indigo-100', 'bg-pink-100', 'bg-orange-100',
  'bg-teal-100'
];

const INITIAL_IDEAS: IdeaNote[] = [
  { id: '1', content: "Acheter à la rumeur, vendre à la nouvelle", color: 'bg-yellow-100', position: { x: 0, y: 0 }, createdAt: new Date() },
  { id: '2', content: "La partie la plus difficile est de vendre", color: 'bg-green-100', position: { x: 0, y: 0 }, createdAt: new Date() },
  { id: '3', content: "Ne pas céder au FOMO pendant les hausses", color: 'bg-blue-100', position: { x: 0, y: 0 }, createdAt: new Date() },
  { id: '4', content: "Toujours utiliser des stop loss", color: 'bg-red-100', position: { x: 0, y: 0 }, createdAt: new Date() },
  { id: '5', content: "DCA est meilleur que le timing du marché", color: 'bg-purple-100', position: { x: 0, y: 0 }, createdAt: new Date() },
  { id: '6', content: "Ne jamais investir plus que ce qu'on peut perdre", color: 'bg-indigo-100', position: { x: 0, y: 0 }, createdAt: new Date() },
  { id: '7', content: "La patience est la clé du succès", color: 'bg-pink-100', position: { x: 0, y: 0 }, createdAt: new Date() },
  { id: '8', content: "Diversifier son portefeuille", color: 'bg-orange-100', position: { x: 0, y: 0 }, createdAt: new Date() },
  { id: '9', content: "DYOR - Fais tes propres recherches", color: 'bg-teal-100', position: { x: 0, y: 0 }, createdAt: new Date() },
  { id: '10', content: "Les émotions sont l'ennemi du trader", color: 'bg-yellow-100', position: { x: 0, y: 0 }, createdAt: new Date() },
  { id: '11', content: "Surveiller les tendances du marché", color: 'bg-green-100', position: { x: 0, y: 0 }, createdAt: new Date() },
  { id: '12', content: "Garder un journal de trading", color: 'bg-blue-100', position: { x: 0, y: 0 }, createdAt: new Date() }
];

export const useIdeaBoard = () => {
  const [ideas, setIdeas] = useState<IdeaNote[]>(INITIAL_IDEAS);
  const [newIdea, setNewIdea] = useState('');

  const addIdea = () => {
    if (newIdea.trim()) {
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      setIdeas([
        ...ideas,
        {
          id: Date.now().toString(),
          content: newIdea,
          color: randomColor,
          position: { x: 0, y: 0 },
          createdAt: new Date()
        }
      ]);
      setNewIdea('');
    }
  };

  return {
    ideas,
    newIdea,
    setNewIdea,
    addIdea
  };
};