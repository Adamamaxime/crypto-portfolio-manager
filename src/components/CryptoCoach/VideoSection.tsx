import React from 'react';
import { motion } from 'framer-motion';
import { Video, Plus, Edit2, Trash2 } from 'lucide-react';
import type { Video as VideoType } from '../../types';

interface VideoSectionProps {
  videos: VideoType[];
  onAddClick: () => void;
  onEditVideo: (video: VideoType) => void;
  onDeleteVideo: (id: string) => void;
}

export function VideoSection({ videos, onAddClick, onEditVideo, onDeleteVideo }: VideoSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Video className="w-5 h-5 text-indigo-600 mr-2" />
          <h2 className="text-lg font-semibold">Vidéos & Formations</h2>
        </div>
        <button
          onClick={onAddClick}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </button>
      </div>

      <div className="space-y-6">
        {['formation', 'analyse'].map((category) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-gray-500 mb-3 capitalize">
              {category}s
            </h3>
            {videos
              .filter((video) => video.category === category)
              .map((video) => (
                <div
                  key={video.id}
                  className="bg-gray-50 rounded-lg p-4 mb-3 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-indigo-600">{video.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-500 hover:text-indigo-600 mt-2 inline-block"
                      >
                        Voir la vidéo
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditVideo(video)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteVideo(video.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {video.createdAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}