import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { getCurrentUser, signIn, signUp, signOut, updateProfile, type UserProfile } from '../services/authService';
import { logger } from '../utils/logger';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data } = await getCurrentUser();
          setUser(data);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data, error } = await getCurrentUser();
      if (!error && data) {
        setUser(data);
      }
    } catch (error) {
      logger.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await signUp(email, password, fullName);
    if (!error && data) {
      setUser(data);
    }
    return { data, error };
  };

  const handleSignIn = async (email: string, password: string) => {
    const { data, error } = await signIn(email, password);
    if (!error && data) {
      setUser(data);
    }
    return { data, error };
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      setUser(null);
    }
    return { error };
  };

  const handleUpdateProfile = async (updates: Partial<Pick<UserProfile, 'fullName' | 'language'>>) => {
    if (!user) return { data: null, error: 'Not authenticated' };
    const { data, error } = await updateProfile(user.id, updates);
    if (!error && data) {
      setUser(data);
    }
    return { data, error };
  };

  return {
    user,
    loading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
  };
}

