import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
  where
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import type { Message } from '../types';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const newMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];
        setMessages(newMessages);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const sendMessage = async (content: string) => {
    try {
      if (!auth.currentUser) throw new Error('User not authenticated');

      const docRef = await addDoc(collection(db, 'messages'), {
        content,
        userId: auth.currentUser.uid,
        sender: 'user',
        timestamp: Timestamp.now(),
        createdAt: Timestamp.now()
      });

      return {
        id: docRef.id,
        content,
        userId: auth.currentUser.uid,
        sender: 'user' as const,
        timestamp: new Date(),
        createdAt: new Date()
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      if (!auth.currentUser) throw new Error('User not authenticated');

      const messageRef = doc(db, 'messages', id);
      await deleteDoc(messageRef);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    deleteMessage
  };
};