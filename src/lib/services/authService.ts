/**
 * Authentication Service
 * Handles user authentication with Supabase
 */

import { supabase } from '../supabase';

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  language: 'es' | 'en';
  affiliateCode: string;
  credits: number;
  totalSpent: number;
}

/**
 * Sign up new user
 */
export async function signUp(
  email: string,
  password: string,
  fullName?: string
): Promise<{ data: UserProfile | null; error: string | null }> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      return { data: null, error: authError?.message || 'Failed to sign up' };
    }

    // Generate affiliate code
    const affiliateCode = `NEXORA-${authData.user.id.substring(0, 8).toUpperCase()}`;

    // Create profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        affiliate_code: affiliateCode,
        language: 'es',
        credits: 0,
        total_spent: 0,
      })
      .select()
      .single();

    if (profileError) {
      return { data: null, error: profileError.message };
    }

    return {
      data: {
        id: profileData.id,
        email: profileData.email,
        fullName: profileData.full_name,
        language: profileData.language as 'es' | 'en',
        affiliateCode: profileData.affiliate_code,
        credits: profileData.credits,
        totalSpent: parseFloat(profileData.total_spent || '0'),
      },
      error: null,
    };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to sign up' };
  }
}

/**
 * Sign in user
 */
export async function signIn(
  email: string,
  password: string
): Promise<{ data: UserProfile | null; error: string | null }> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return { data: null, error: authError?.message || 'Failed to sign in' };
    }

    // Get profile
    const profile = await getProfile(authData.user.id);
    return profile;
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to sign in' };
  }
}

/**
 * Sign out user
 */
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message || 'Failed to sign out' };
  }
}

/**
 * Get current user profile
 */
export async function getProfile(userId: string): Promise<{
  data: UserProfile | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return { data: null, error: error?.message || 'Profile not found' };
    }

    return {
      data: {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        language: data.language as 'es' | 'en',
        affiliateCode: data.affiliate_code,
        credits: data.credits,
        totalSpent: parseFloat(data.total_spent || '0'),
      },
      error: null,
    };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to get profile' };
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<{
  data: UserProfile | null;
  error: string | null;
}> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return { data: null, error: error?.message || 'Not authenticated' };
    }

    return await getProfile(user.id);
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to get current user' };
  }
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Pick<UserProfile, 'fullName' | 'language'>>
): Promise<{ data: UserProfile | null; error: string | null }> {
  try {
    const updateData: any = {};
    if (updates.fullName !== undefined) updateData.full_name = updates.fullName;
    if (updates.language !== undefined) updateData.language = updates.language;

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return {
      data: {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        language: data.language as 'es' | 'en',
        affiliateCode: data.affiliate_code,
        credits: data.credits,
        totalSpent: parseFloat(data.total_spent || '0'),
      },
      error: null,
    };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to update profile' };
  }
}

