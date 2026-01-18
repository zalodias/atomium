import type { Difficulty } from '@/constants/difficulty';
import type { PlayerStatus } from '@/types/game';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          id: string;
          code: string;
          difficulty: Difficulty;
          host_id: string;
          is_started: boolean;
          molecule_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          difficulty: Difficulty;
          host_id: string;
          is_started?: boolean;
          molecule_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          difficulty?: Difficulty;
          host_id?: string;
          is_started?: boolean;
          molecule_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'games_molecule_id_fkey';
            columns: ['molecule_id'];
            isOneToOne: false;
            referencedRelation: 'molecules';
            referencedColumns: ['id'];
          }
        ];
      };
      molecules: {
        Row: {
          id: string;
          name: string;
          formula: string;
          description: string;
          composition: Json;
          structure: Json;
          difficulty: Difficulty;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          formula: string;
          description: string;
          composition: Json;
          structure: Json;
          difficulty: Difficulty;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          formula?: string;
          description?: string;
          composition?: Json;
          structure?: Json;
          difficulty?: Difficulty;
          created_at?: string;
        };
        Relationships: [];
      };
      teams: {
        Row: {
          id: string;
          game_id: string;
          name: string;
          status: PlayerStatus;
          is_host: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          name: string;
          status?: PlayerStatus;
          is_host?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          name?: string;
          status?: PlayerStatus;
          is_host?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'teams_game_id_fkey';
            columns: ['game_id'];
            isOneToOne: false;
            referencedRelation: 'games';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Game = Database['public']['Tables']['games']['Row'];
export type TeamRow = Database['public']['Tables']['teams']['Row'];
export type MoleculeRow = Database['public']['Tables']['molecules']['Row'];
