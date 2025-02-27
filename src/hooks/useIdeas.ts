import { useState, useEffect } from 'react';
import { useSupabase } from './useSupabase';
import type { IdeaNote } from '../types';

export const useIdeas = () => {
  const { getAll, create, update, remove } = useSupabase<IdeaNote>('ideas');
  const [ideas, setIdeas] = useState<IdeaNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      setLoading(true);
      const data = await getAll();
      setIdeas(data);
    } catch (error) {
      console.error('Erreur lors du chargement des idées:', error);
    } finally {
      setLoading(false);
    }
  };

  const addIdea = async (newIdea: Omit<IdeaNote, 'id' | 'created_at'>) => {
    try {
      const createdIdea = await create(newIdea);
      setIdeas(prev => [createdIdea, ...prev]);
      return createdIdea;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'idée:', error);
      throw error;
    }
  };

  const updateIdea = async (id: string, updates: Partial<IdeaNote>) => {
    try {
      const updatedIdea = await update(id, updates);
      setIdeas(prev => prev.map(idea => idea.id === id ? updatedIdea : idea));
      return updatedIdea;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'idée:', error);
      throw error;
    }
  };

  const deleteIdea = async (id: string) => {
    try {
      await remove(id);
      setIdeas(prev => prev.filter(idea => idea.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'idée:', error);
      throw error;
    }
  };

  return {
    ideas,
    loading,
    addIdea,
    updateIdea,
    deleteIdea
  };
};