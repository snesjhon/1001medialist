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
      albums: {
        Row: {
          id: string;
          title: string;
          artist: string;
          year: number;
          genre: string | null;
          cover_url: string | null;
          spotify_id: string | null;
          list_number: number;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          artist: string;
          year: number;
          genre?: string | null;
          cover_url?: string | null;
          spotify_id?: string | null;
          list_number: number;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          artist?: string;
          year?: number;
          genre?: string | null;
          cover_url?: string | null;
          spotify_id?: string | null;
          list_number?: number;
          description?: string | null;
          created_at?: string;
        };
      };
      movies: {
        Row: {
          id: string;
          title: string;
          director: string;
          year: number;
          genre: string | null;
          poster_url: string | null;
          tmdb_id: number | null;
          runtime: number | null;
          list_number: number;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          director: string;
          year: number;
          genre?: string | null;
          poster_url?: string | null;
          tmdb_id?: number | null;
          runtime?: number | null;
          list_number: number;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          director?: string;
          year?: number;
          genre?: string | null;
          poster_url?: string | null;
          tmdb_id?: number | null;
          runtime?: number | null;
          list_number?: number;
          description?: string | null;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          current_pair_number: number;
          display_name: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          current_pair_number?: number;
          display_name?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          current_pair_number?: number;
          display_name?: string | null;
        };
      };
      user_albums: {
        Row: {
          id: string;
          user_id: string;
          album_id: string;
          completed_at: string | null;
          rating: number | null;
          skipped: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          album_id: string;
          completed_at?: string | null;
          rating?: number | null;
          skipped?: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          album_id?: string;
          completed_at?: string | null;
          rating?: number | null;
          skipped?: boolean;
          notes?: string | null;
          created_at?: string;
        };
      };
      user_movies: {
        Row: {
          id: string;
          user_id: string;
          movie_id: string;
          completed_at: string | null;
          rating: number | null;
          skipped: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          movie_id: string;
          completed_at?: string | null;
          rating?: number | null;
          skipped?: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          movie_id?: string;
          completed_at?: string | null;
          rating?: number | null;
          skipped?: boolean;
          notes?: string | null;
          created_at?: string;
        };
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
  };
}
