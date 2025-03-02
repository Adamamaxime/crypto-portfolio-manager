import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Video } from '../../types';

interface VideoFormProps {
  onClose: () => void;
  onSubmit: (video: Video) => void;
  initialVideo?: Video;
}

export function VideoForm({ onClose, onSubmit, initialVideo }: VideoFormProps) {
  const [video, setVideo] = useState<Video>(
    initialVideo || {
      id: Date.now().toString(),
      title: '',
      url: '',
      description: '',
      category: 'formation',
      createdAt: new Date()
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(video);
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
            {initialVideo ? 'Modifier la Vidéo' : 'Nouvelle Vidéo'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={video.title}
              onChange={(e) => setVideo({ ...video, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">URL de la vidéo</label>
            <input
              type="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={video.url}
              onChange={(e) => setVideo({ ...video, url: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              value={video.description}
              onChange={(e) => setVideo({ ...video, description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Catégorie</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={video.category}
              onChange={(e) => setVideo({ ...video, category: e.target.value as 'formation' | 'analyse' })}
            >
              <option value="formation">Formation</option>
              <option value="analyse">Analyse</option>
            </select>
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
              {initialVideo ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}