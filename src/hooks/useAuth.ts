import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou mot de passe incorrect');
        }
        throw error;
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, phone: string) => {
    try {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          throw new Error('Un compte existe déjà avec cet email');
        }
        throw signUpError;
      }

      if (data.user) {
        // Créer le profil utilisateur
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email,
              name,
              phone
            }
          ]);

        if (profileError) {
          console.error('Erreur lors de la création du profil:', profileError);
          throw new Error('Erreur lors de la création du profil utilisateur');
        }
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };
};