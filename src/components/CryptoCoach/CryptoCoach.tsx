import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useCryptoCoach } from './useCryptoCoach';
import { ChatWindow } from './ChatWindow';
import { VideoSection } from './VideoSection';
import { VideoForm } from './VideoForm';

export function CryptoCoach() {
  const {
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
  } = useCryptoCoach();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ChatWindow
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={handleSendMessage}
        />
      </div>

      <div>
        <VideoSection
          videos={videos}
          onAddClick={() => setShowAddForm(true)}
          onEditVideo={setEditingVideo}
          onDeleteVideo={handleDeleteVideo}
        />
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