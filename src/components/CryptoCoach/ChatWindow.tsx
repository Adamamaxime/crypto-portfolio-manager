import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';
import type { Message } from '../../types';

interface ChatWindowProps {
  messages: Message[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
}

export function ChatWindow({ messages, newMessage, setNewMessage, onSendMessage }: ChatWindowProps) {
  return (
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
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
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
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            placeholder="Posez votre question..."
            className="flex-1 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={onSendMessage}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <Send className="w-4 h-4 mr-2" />
            Envoyer
          </button>
        </div>
      </div>
    </motion.div>
  );
}