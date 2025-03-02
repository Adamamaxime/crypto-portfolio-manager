// Types communs réutilisables
export type Status = 'open' | 'won' | 'lost';
export type Category = 'formation' | 'analyse';
export type Risk = 'low' | 'medium' | 'high';
export type SignalType = 'long' | 'short';

// Interfaces de base
interface BaseEntity {
  id: string;
  createdAt: Date;
}

interface TimestampedEntity extends BaseEntity {
  date: string;
  time: string;
}

// Interfaces métier
export interface Trade extends TimestampedEntity {
  coin: string;
  entryPrice: number;
  quantity: number;
  fees: number;
  exitPlans: ExitPlan[];
  notes: string;
  status: Status;
  selectedPlanId?: string;
  closedAt?: {
    date: string;
    time: string;
    price: number;
  };
}

export interface ExitPlan extends BaseEntity {
  targetPrice: number;
  quantity: number;
  stopLoss: number;
  notes: string;
  status?: 'pending' | 'executed' | 'cancelled';
}

export interface IdeaNote extends BaseEntity {
  content: string;
  color: string;
  position: { x: number; y: number };
}

export interface Simulation extends TimestampedEntity {
  coin: string;
  entry_price: number;
  investment: number;
  entry_fees: number;
  exit_fees: number;
  network_fees: number;
  exit_price: number;
  notes: string;
}

export interface Message extends BaseEntity {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface Video extends BaseEntity {
  title: string;
  url: string;
  description: string;
  category: Category;
}

export interface CryptoSignal extends BaseEntity {
  coin: string;
  type: SignalType;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  description: string;
  risk: Risk;
  status: 'active' | 'completed' | 'cancelled';
}

// Types pour l'API CryptoInfo
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  description: { en: string };
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  last_updated: string;
  links: CryptoLinks;
}

interface CryptoLinks {
  homepage: string[];
  blockchain_site: string[];
  subreddit_url: string;
  twitter_screen_name: string;
  telegram_channel_identifier: string;
  chat_url: string[];
  announcement_url: string[];
  official_forum_url: string[];
}