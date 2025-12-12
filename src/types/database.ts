export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          stripe_customer_id: string | null
          subscription_status: 'trialing' | 'active' | 'canceled' | 'past_due' | null
          subscription_tier: 'starter' | 'pro' | 'team' | null
          trial_ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          stripe_customer_id?: string | null
          subscription_status?: 'trialing' | 'active' | 'canceled' | 'past_due' | null
          subscription_tier?: 'starter' | 'pro' | 'team' | null
          trial_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          stripe_customer_id?: string | null
          subscription_status?: 'trialing' | 'active' | 'canceled' | 'past_due' | null
          subscription_tier?: 'starter' | 'pro' | 'team' | null
          trial_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          client_name: string | null
          address: string | null
          status: 'active' | 'completed' | 'on_hold'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          client_name?: string | null
          address?: string | null
          status?: 'active' | 'completed' | 'on_hold'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          client_name?: string | null
          address?: string | null
          status?: 'active' | 'completed' | 'on_hold'
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          name: string
          email: string | null
          phone: string | null
          company: string | null
          role: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          name?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rfis: {
        Row: {
          id: string
          user_id: string
          project_id: string
          rfi_number: number
          subject: string
          question: string
          answer: string | null
          status: 'open' | 'pending' | 'answered' | 'closed'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to_id: string | null
          due_date: string | null
          answered_at: string | null
          closed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          rfi_number?: number
          subject: string
          question: string
          answer?: string | null
          status?: 'open' | 'pending' | 'answered' | 'closed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to_id?: string | null
          due_date?: string | null
          answered_at?: string | null
          closed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          rfi_number?: number
          subject?: string
          question?: string
          answer?: string | null
          status?: 'open' | 'pending' | 'answered' | 'closed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to_id?: string | null
          due_date?: string | null
          answered_at?: string | null
          closed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rfi_attachments: {
        Row: {
          id: string
          rfi_id: string
          file_name: string
          file_url: string
          file_type: string
          file_size: number
          created_at: string
        }
        Insert: {
          id?: string
          rfi_id: string
          file_name: string
          file_url: string
          file_type: string
          file_size: number
          created_at?: string
        }
        Update: {
          id?: string
          rfi_id?: string
          file_name?: string
          file_url?: string
          file_type?: string
          file_size?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Contact = Database['public']['Tables']['contacts']['Row']
export type RFI = Database['public']['Tables']['rfis']['Row']
export type RFIAttachment = Database['public']['Tables']['rfi_attachments']['Row']


