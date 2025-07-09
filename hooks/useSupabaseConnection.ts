import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useSupabaseConnection() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      // Test the connection by making a simple query
      const { data, error } = await supabase
        .from('user_registrations')
        .select('count')
        .limit(1);

      if (error) {
        console.error('Supabase connection error:', error);
        setError(error.message);
        setIsConnected(false);
      } else {
        setIsConnected(true);
        setError(null);
      }
    } catch (err) {
      console.error('Connection test failed:', err);
      setError('Failed to connect to database');
      setIsConnected(false);
    }
  };

  return { isConnected, error, checkConnection };
}