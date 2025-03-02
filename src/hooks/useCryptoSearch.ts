import { useState } from 'react';
import { CryptoData } from '../types';
import { coinGeckoApi, handleApiError } from '../utils/api';

export const useCryptoSearch = () => {
  const [data, setData] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchCrypto = async (searchTerm: string) => {
    if (!searchTerm) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      // Recherche de l'ID de la crypto
      const searchResponse = await coinGeckoApi.get('/search', {
        params: { query: searchTerm }
      });

      if (searchResponse.data.coins.length === 0) {
        throw new Error('Cryptomonnaie non trouvée');
      }

      const coinId = searchResponse.data.coins[0].id;

      // Attente pour éviter le rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Récupération des détails
      const detailsResponse = await coinGeckoApi.get(`/coins/${coinId}`, {
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
      setData({
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
      setError(handleApiError(err));
      console.error('Erreur détaillée:', err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, searchCrypto };
};