import type { Difficulty } from '@/constants/difficulty';
import type { PlayerStatus, QuestionType } from '@/types/game';

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
          current_question_id: string | null;
          current_question_started_at: string | null;
          question_number: number;
          total_questions: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          difficulty: Difficulty;
          host_id: string;
          is_started?: boolean;
          molecule_id?: string | null;
          current_question_id?: string | null;
          current_question_started_at?: string | null;
          question_number?: number;
          total_questions?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          difficulty?: Difficulty;
          host_id?: string;
          is_started?: boolean;
          molecule_id?: string | null;
          current_question_id?: string | null;
          current_question_started_at?: string | null;
          question_number?: number;
          total_questions?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'games_molecule_id_fkey';
            columns: ['molecule_id'];
            isOneToOne: false;
            referencedRelation: 'molecules';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'games_current_question_id_fkey';
            columns: ['current_question_id'];
            isOneToOne: false;
            referencedRelation: 'questions';
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
      questions: {
        Row: {
          id: string;
          text: string;
          type: QuestionType;
          answer: string;
          options: Json | null;
          difficulty: Difficulty;
          created_at: string;
        };
        Insert: {
          id?: string;
          text: string;
          type: QuestionType;
          answer: string;
          options?: Json | null;
          difficulty: Difficulty;
          created_at?: string;
        };
        Update: {
          id?: string;
          text?: string;
          type?: QuestionType;
          answer?: string;
          options?: Json | null;
          difficulty?: Difficulty;
          created_at?: string;
        };
        Relationships: [];
      };
      answers: {
        Row: {
          id: string;
          team_id: string;
          game_id: string;
          question_id: string;
          selected_answer: string | null;
          is_correct: boolean;
          answered_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          game_id: string;
          question_id: string;
          selected_answer?: string | null;
          is_correct?: boolean;
          answered_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          game_id?: string;
          question_id?: string;
          selected_answer?: string | null;
          is_correct?: boolean;
          answered_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'answers_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'answers_game_id_fkey';
            columns: ['game_id'];
            isOneToOne: false;
            referencedRelation: 'games';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'answers_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions';
            referencedColumns: ['id'];
          }
        ];
      };
      inventory: {
        Row: {
          id: string;
          team_id: string;
          game_id: string;
          element: string;
          count: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          game_id: string;
          element: string;
          count?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          game_id?: string;
          element?: string;
          count?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'inventory_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'inventory_game_id_fkey';
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
export type Team = Database['public']['Tables']['teams']['Row'];
export type Molecule = Database['public']['Tables']['molecules']['Row'];
export type Question = Database['public']['Tables']['questions']['Row'];
export type Answer = Database['public']['Tables']['answers']['Row'];
export type Inventory = Database['public']['Tables']['inventory']['Row'];
