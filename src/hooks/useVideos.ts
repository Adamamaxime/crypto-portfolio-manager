import { useState, useEffect } from 'react';
import { useSupabase } from './useSupabase';
import type { Video } from '../types';

export const useVideos = () => {
  const { getAll, create, update, remove } = useSupabase<Video>('videos');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await getAll();
      setVideos(data);
    } catch (error) {
      console.error('Erreur lors du chargement des vidéos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addVideo = async (newVideo: Omit<Video, 'id' | 'created_at'>) => {
    try {
      const createdVideo = await create(newVideo);
      setVideos(prev => [createdVideo, ...prev]);
      return createdVideo;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la vidéo:', error);
      throw error;
    }
  };

  const updateVideo = async (id: string, updates: Partial<Video>) => {
    try {
      const updatedVideo = await update(id, updates);
      setVideos(prev => prev.map(video => video.id === id ? updatedVideo : video));
      return updatedVideo;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la vidéo:', error);
      throw error;
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      await remove(id);
      setVideos(prev => prev.filter(video => video.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la vidéo:', error);
      throw error;
    }
  };

  return {
    videos,
    loading,
    addVideo,
    updateVideo,
    deleteVideo
  };
};