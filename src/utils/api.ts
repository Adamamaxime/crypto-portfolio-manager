import axios from 'axios';

// Configuration de base pour l'API CoinGecko
export const coinGeckoApi = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
  }
});

// Gestionnaire d'erreur global
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      return 'Trop de requêtes. Veuillez réessayer dans quelques minutes.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'La requête a pris trop de temps. Veuillez réessayer.';
    }
    return 'Erreur lors de la récupération des données. Veuillez réessayer.';
  }
  return 'Une erreur inattendue est survenue.';
};

// Formatage des nombres et dates
export const formatters = {
  number: (num: number): string => {
    return new Intl.NumberFormat('fr-FR').format(num);
  },
  
  currency: (num: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  },
  
  date: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  
  percentage: (num: number): string => {
    return `${num.toFixed(2)}%`;
  }
};