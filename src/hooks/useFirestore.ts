import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export const useFirestore = <T extends DocumentData>(collectionName: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (!auth.currentUser) {
        setData([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, collectionName),
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];

      setData(documents);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const add = async (newData: Omit<T, 'id' | 'userId' | 'createdAt'>) => {
    try {
      if (!auth.currentUser) throw new Error('User not authenticated');

      const docRef = await addDoc(collection(db, collectionName), {
        ...newData,
        userId: auth.currentUser.uid,
        createdAt: Timestamp.now()
      });

      const newItem = {
        id: docRef.id,
        ...newData,
        userId: auth.currentUser.uid,
        createdAt: new Date()
      } as T;

      setData(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const update = async (id: string, updates: Partial<T>) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });

      setData(prev => prev.map(item => 
        (item as any).id === id ? { ...item, ...updates } : item
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      setData(prev => prev.filter(item => (item as any).id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    add,
    update,
    remove,
    refresh: fetchData
  };
};