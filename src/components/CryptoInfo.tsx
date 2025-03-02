import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, DollarSign, BarChart2, Globe, Clock, AlertCircle, Languages } from 'lucide-react';
import axios from 'axios';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  description: { en: string };
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    telegram_channel_identifier: string;
    subreddit_url: string;
  };
}

// Créer une instance axios avec une configuration de base
const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
  }
});

export function CryptoInfo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedDescription, setTranslatedDescription] = useState('');

  const searchCrypto = async () => {
    if (!searchTerm) return;

    setLoading(true);
    setError('');
    setCryptoData(null);
    setTranslatedDescription('');
    setIsTranslated(false);

    try {
      // Première requête pour chercher l'ID de la crypto
      const searchResponse = await api.get('/search', {
        params: { query: searchTerm }
      });

      if (searchResponse.data.coins.length === 0) {
        setError('Cryptomonnaie non trouvée');
        return;
      }

      const coinId = searchResponse.data.coins[0].id;

      // Attendre 1 seconde entre les requêtes pour éviter le rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Deuxième requête pour obtenir les détails complets
      const detailsResponse = await api.get(`/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false
        }
      });

      const marketData = detailsResponse.data.market_data;
      setCryptoData({
        ...detailsResponse.data,
        current_price: marketData.current_price.usd,
        market_cap: marketData.market_cap.usd,
        market_cap_rank: marketData.market_cap_rank,
        total_volume: marketData.total_volume.usd,
        price_change_24h: marketData.price_change_24h,
        price_change_percentage_24h: marketData.price_change_percentage_24h,
        ath: marketData.ath.usd,
        ath_change_percentage: marketData.ath_change_percentage.usd,
        ath_date: marketData.ath_date.usd,
        atl: marketData.atl.usd,
        atl_change_percentage: marketData.atl_change_percentage.usd,
        atl_date: marketData.atl_date.usd,
        circulating_supply: marketData.circulating_supply,
        total_supply: marketData.total_supply,
        max_supply: marketData.max_supply,
        last_updated: marketData.last_updated,
      });

    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          setError('Trop de requêtes. Veuillez réessayer dans quelques minutes.');
        } else if (err.code === 'ECONNABORTED') {
          setError('La requête a pris trop de temps. Veuillez réessayer.');
        } else {
          setError('Erreur lors de la récupération des données. Veuillez réessayer.');
        }
      } else {
        setError('Une erreur inattendue est survenue.');
      }
      console.error('Erreur détaillée:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!cryptoData?.description.en) return;
    
    // Ici, vous connecterez votre API de traduction
    setIsTranslated(true);
    // Pour l'instant, on affiche juste un message d'attente
    setTranslatedDescription("La traduction sera disponible une fois l'API de traduction connectée.");
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchCrypto()}
              placeholder="Rechercher une cryptomonnaie..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button
            onClick={searchCrypto}
            disabled={loading}
            className={`px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
              loading 
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-indigo-700 hover:to-purple-700'
            }`}
          >
            <Search className="w-5 h-5" />
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-12"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-center gap-2 text-red-600"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}

          {cryptoData && !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* En-tête */}
              <div className="flex items-center gap-4">
                <img src={cryptoData.image} alt={cryptoData.name} className="w-16 h-16 rounded-full" />
                <div>
                  <h2 className="text-2xl font-bold">{cryptoData.name}</h2>
                  <p className="text-gray-600 uppercase">{cryptoData.symbol}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-bold">${cryptoData.current_price.toFixed(2)}</p>
                  <p className={`flex items-center gap-1 ${
                    cryptoData.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {cryptoData.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(cryptoData.price_change_percentage_24h).toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Statistiques principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <BarChart2 className="w-5 h-5" />
                    <span>Rang Market Cap</span>
                  </div>
                  <p className="text-xl font-semibold">#{cryptoData.market_cap_rank}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Capitalisation</span>
                  </div>
                  <p className="text-xl font-semibold">${formatNumber(cryptoData.market_cap)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Globe className="w-5 h-5" />
                    <span>Volume 24h</span>
                  </div>
                  <p className="text-xl font-semibold">${formatNumber(cryptoData.total_volume)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Clock className="w-5 h-5" />
                    <span>Dernière mise à jour</span>
                  </div>
                  <p className="text-sm font-semibold">{formatDate(cryptoData.last_updated)}</p>
                </div>
              </div>

              {/* Records historiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-green-800">Plus Haut Historique (ATH)</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Prix</span>
                      <span className="font-semibold">${cryptoData.ath.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Variation</span>
                      <span className={`font-semibold ${
                        cryptoData.ath_change_percentage >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {cryptoData.ath_change_percentage.toFixed(2)}%
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-semibold">{formatDate(cryptoData.ath_date)}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-red-800">Plus Bas Historique (ATL)</h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Prix</span>
                      <span className="font-semibold">${cryptoData.atl.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Variation</span>
                      <span className={`font-semibold ${
                        cryptoData.atl_change_percentage >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {cryptoData.atl_change_percentage.toFixed(2)}%
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-semibold">{formatDate(cryptoData.atl_date)}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations sur l'offre */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Informations sur l'Offre</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-600">Offre en Circulation</p>
                    <p className="text-xl font-semibold">{formatNumber(cryptoData.circulating_supply)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Offre Totale</p>
                    <p className="text-xl font-semibold">
                      {cryptoData.total_supply ? formatNumber(cryptoData.total_supply) : '∞'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Offre Maximum</p>
                    <p className="text-xl font-semibold">
                      {cryptoData.max_supply ? formatNumber(cryptoData.max_supply) : '∞'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description du Projet */}
              {cryptoData.description?.en && (
                <div className="bg-white border border-gray-200 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Description du Projet</h3>
                    <button
                      onClick={handleTranslate}
                      disabled={isTranslated}
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isTranslated
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                      }`}
                    >
                      <Languages className="w-4 h-4 mr-2" />
                      Traduire en Français
                    </button>
                  </div>
                  
                  <div className="prose max-w-none">
                    {isTranslated ? (
                      <p className="text-gray-600">{translatedDescription}</p>
                    ) : (
                      <p className="text-gray-600">{cryptoData.description.en}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Liens Utiles */}
              {cryptoData.links && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Liens Utiles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cryptoData.links.homepage[0] && (
                      <a
                        href={cryptoData.links.homepage[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                      >
                        <Globe className="w-4 h-4" />
                        Site Officiel
                      </a>
                    )}
                    {cryptoData.links.blockchain_site[0] && (
                      <a
                        href={cryptoData.links.blockchain_site[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                      >
                        <BarChart2 className="w-4 h-4" />
                        Explorer
                      </a>
                    )}
                    {cryptoData.links.subreddit_url && (
                      <a
                        href={cryptoData.links.subreddit_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                      >
                        Reddit
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}