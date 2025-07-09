import { supabase } from '@/lib/supabase';

export interface RegistrationData {
  name: string;
  email?: string;
}

export interface RegistrationResponse {
  success: boolean;
  error?: string;
  data?: any;
}

export class RegistrationService {
  static async registerUser(data: RegistrationData): Promise<RegistrationResponse> {
    try {
      const { data: result, error } = await supabase
        .from('user_registrations')
        .insert({
          name: data.name.trim(),
          email: data.email?.trim() || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Registration error:', error);
        return {
          success: false,
          error: 'Failed to register. Please try again.',
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      console.error('Registration service error:', err);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_registrations')
        .select('id')
        .eq('email', email.trim())
        .limit(1);

      if (error) {
        console.error('Email check error:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (err) {
      console.error('Email check service error:', err);
      return false;
    }
  }

  static async getRegistrationStats(): Promise<{ total: number; withEmail: number } | null> {
    try {
      const { data: totalData, error: totalError } = await supabase
        .from('user_registrations')
        .select('id', { count: 'exact' });

      const { data: emailData, error: emailError } = await supabase
        .from('user_registrations')
        .select('id', { count: 'exact' })
        .not('email', 'is', null);

      if (totalError || emailError) {
        console.error('Stats error:', totalError || emailError);
        return null;
      }

      return {
        total: totalData?.length || 0,
        withEmail: emailData?.length || 0,
      };
    } catch (err) {
      console.error('Stats service error:', err);
      return null;
    }
  }
}