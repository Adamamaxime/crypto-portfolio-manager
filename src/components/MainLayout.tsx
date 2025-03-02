import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Calculator as CalculatorIcon, Lightbulb, MessageSquare, Signal, Info, Users, Calendar, LogOut } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { Portfolio } from './Portfolio';
import { Calculator } from './Calculator';
import { IdeaBoard } from './IdeaBoard';
import { CryptoCoach } from './CryptoCoach';
import { Signals } from './Signals';
import { CryptoInfo } from './CryptoInfo';
import { useNavigate } from 'react-router-dom';

export function MainLayout() {
  const { signOut, user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [showCommunityChat, setShowCommunityChat] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    { id: 'portfolio', label: 'Portfolio', icon: LayoutGrid },
    { id: 'calculator', label: 'Simulateur', icon: CalculatorIcon },
    { id: 'ideas', label: 'Idées', icon: Lightbulb },
    { id: 'coach', label: 'Coach', icon: MessageSquare },
    { id: 'signals', label: 'Signaux', icon: Signal },
    { id: 'info', label: 'Infos Crypto', icon: Info },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'portfolio':
        return <Portfolio />;
      case 'calculator':
        return <Calculator />;
      case 'ideas':
        return <IdeaBoard />;
      case 'coach':
        return <CryptoCoach />;
      case 'signals':
        return <Signals />;
      case 'info':
        return <CryptoInfo />;
      default:
        return <Portfolio />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/community')}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              Chat Communauté
            </motion.button>
            {user && (
              <span className="text-gray-600">
                Bienvenue, {user.displayName || 'Utilisateur'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <motion.a
              href="https://calendly.com/msformation/ia?month=2025-02"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Contact
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={signOut}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Déconnexion
            </motion.button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg mb-6">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}