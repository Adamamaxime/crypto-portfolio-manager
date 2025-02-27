import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

export const useSupabase = <T extends { id: string }>(tableName: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);

  const getAll = async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as T[];
    } catch (err) {
      const pgError = err as PostgrestError;
      setError(pgError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as T;
    } catch (err) {
      const pgError = err as PostgrestError;
      setError(pgError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const create = async (newData: Omit<T, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error('Non authentifié');

      // Ajouter automatiquement le user_id
      const dataWithUserId = {
        ...newData,
        user_id: session.session.user.id
      };

      const { data, error } = await supabase
        .from(tableName)
        .insert([dataWithUserId])
        .select()
        .single();

      if (error) throw error;
      return data as T;
    } catch (err) {
      const pgError = err as PostgrestError;
      setError(pgError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, updates: Partial<T>) => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as T;
    } catch (err) {
      const pgError = err as PostgrestError;
      setError(pgError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error('Non authentifié');

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      const pgError = err as PostgrestError;
      setError(pgError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    remove
  };
};