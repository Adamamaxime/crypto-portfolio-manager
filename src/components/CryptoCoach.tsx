import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Video,
  BookOpen,
  Send,
  Plus,
  X,
  Edit2,
  Trash2,
} from "lucide-react";
import type { Message, Video as VideoType } from "../types";
import { supabase } from "../lib/supabase";

interface VideoFormProps {
  onClose: () => void;
  onSubmit: (video: VideoType) => void;
  initialVideo?: VideoType;
}

function VideoForm({ onClose, onSubmit, initialVideo }: VideoFormProps) {
  const [video, setVideo] = useState<VideoType>(
    initialVideo || {
      id: Date.now().toString(),
      title: "",
      url: "",
      description: "",
      category: "formation",
      date: new Date(),
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
            {initialVideo ? "Modifier la Vidéo" : "Nouvelle Vidéo"}
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
              Titre
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={video.title}
              onChange={(e) => setVideo({ ...video, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              URL de la vidéo
            </label>
            <input
              type="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={video.url}
              onChange={(e) => setVideo({ ...video, url: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              value={video.description}
              onChange={(e) =>
                setVideo({ ...video, description: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Catégorie
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={video.category}
              onChange={(e) =>
                setVideo({
                  ...video,
                  category: e.target.value as "formation" | "analyse",
                })
              }
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
              {initialVideo ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function CryptoCoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Bonjour! Je suis votre assistant crypto. Comment puis-je vous aider aujourd'hui?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);

  useEffect(() => {
      const fetchVideos = async () => {
        const { data: user, error: userError } = await supabase.auth.getUser();
  
        if (userError || !user?.user) {
          console.error("Error fetching user:", userError);
          return;
        }
  
        const userId = user.user.id;
  
        const { data, error } = await supabase
          .from("videos")
          .select("*")
          .eq("user_id", userId);
  
        if (error) {
          console.error("Error fetching simulations:", error);
        } else {
          setVideos(data || []);
        }
      };
  
      fetchVideos();
    }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages([...messages, userMessage]);

      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            "Je suis en cours de développement. Pour le moment, je ne peux que confirmer la réception de vos messages.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }, 1000);

      setNewMessage("");
    }
  };

  const handleAddVideo = async (newVideo: VideoType) => {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.user) {
      console.error("Error fetching user:", userError);
      return;
    }

    const userId = user.user.id;
    const newVideoData = {
      ...newVideo,
      user_id: userId,
    };

    const { data, error } = await supabase.from("videos").insert([newVideoData]);

    if (error) {
      console.error("Error saving video:", error);
    } else {
      console.log("Video saved:", data);
    }
  };

  const handleEditVideo = async (updatedVideo: VideoType) => {
    const { error } = await supabase
      .from("videos")
      .update(updatedVideo)
      .eq("id", updatedVideo.id);
  
    if (error) {
      console.error("Error updating video:", error);
      return;
    }
  
    setVideos(videos.map((video) => (video.id === updatedVideo.id ? updatedVideo : video)));
    setEditingVideo(null);
  };
  
  const handleDeleteVideo = async (videoId: string) => {
    const { error } = await supabase.from("videos").delete().eq("id", videoId);
  
    if (error) {
      console.error("Error deleting video:", error);
      return;
    }
  
    setVideos(videos.filter((video) => video.id !== videoId));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Section Chatbot */}
      <div className="lg:col-span-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden h-[600px] flex flex-col"
        >
          <div className="p-4 bg-indigo-600 text-white flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold">Assistant Crypto</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Posez votre question..."
                className="flex-1 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Envoyer
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section Vidéos */}
      <div>
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
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                <BookOpen className="w-4 h-4 inline mr-2" />
                Formations
              </h3>
              {videos
                .filter((video) => video.category === "formation")
                .map((video) => (
                  <div
                    key={video.id}
                    className="bg-gray-50 rounded-lg p-4 mb-3 hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-indigo-600">
                          {video.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {video.description}
                        </p>
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
                          onClick={() => setEditingVideo(video)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {video?.date}
                    </p>
                  </div>
                ))}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                <Video className="w-4 h-4 inline mr-2" />
                Analyses
              </h3>
              {videos
                .filter((video) => video.category === "analyse")
                .map((video) => (
                  <div
                    key={video.id}
                    className="bg-gray-50 rounded-lg p-4 mb-3 hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-indigo-600">
                          {video.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {video.description}
                        </p>
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
                          onClick={() => setEditingVideo(video)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {video?.date}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {(showAddForm || editingVideo) && (
          <VideoForm
            onClose={() => {
              setShowAddForm(false);
              setEditingVideo(null);
            }}
            onSubmit={editingVideo ? handleEditVideo : handleAddVideo}
            initialVideo={editingVideo || undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
