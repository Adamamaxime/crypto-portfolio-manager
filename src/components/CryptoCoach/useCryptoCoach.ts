import { useState } from 'react';
import type { Message, Video } from '../../types';

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    content: "Bonjour! Je suis votre assistant crypto. Comment puis-je vous aider aujourd'hui?",
    sender: 'bot',
    timestamp: new Date(),
    createdAt: new Date()
  }
];

const INITIAL_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Introduction au Trading Crypto',
    url: 'https://example.com/video1',
    description: 'Apprenez les bases du trading de cryptomonnaies',
    category: 'formation',
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'Analyse Technique Bitcoin',
    url: 'https://example.com/video2',
    description: 'Analyse hebdomadaire du Bitcoin',
    category: 'analyse',
    createdAt: new Date()
  }
];

export const useCryptoCoach = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: 'user',
        timestamp: new Date(),
        createdAt: new Date()
      };

      setMessages([...messages, userMessage]);

      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Je suis en cours de développement. Pour le moment, je ne peux que confirmer la réception de vos messages.",
          sender: 'bot',
          timestamp: new Date(),
          createdAt: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);

      setNewMessage('');
    }
  };

  const handleAddVideo = (newVideo: Video) => {
    setVideos([...videos, newVideo]);
  };

  const handleEditVideo = (updatedVideo: Video) => {
    setVideos(videos.map(video => video.id === updatedVideo.id ? updatedVideo : video));
    setEditingVideo(null);
  };

  const handleDeleteVideo = (videoId: string) => {
    setVideos(videos.filter(video => video.id !== videoId));
  };

  return {
    messages,
    newMessage,
    videos,
    showAddForm,
    editingVideo,
    handleSendMessage,
    setNewMessage,
    handleAddVideo,
    handleEditVideo,
    handleDeleteVideo,
    setShowAddForm,
    setEditingVideo
  };
};