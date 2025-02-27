import { useSupabase } from './useSupabase';
import type { Trade } from '../types';

export const useTrades = () => {
  return useSupabase<Trade>('trades');
};