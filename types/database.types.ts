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
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      lead_magnet_downloads: {
        Row: {
          downloaded_at: string
          id: string
          lead_magnet_id: string
          subscriber_id: string
        }
        Insert: {
          downloaded_at?: string
          id?: string
          lead_magnet_id: string
          subscriber_id: string
        }
        Update: {
          downloaded_at?: string
          id?: string
          lead_magnet_id?: string
          subscriber_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_magnet_downloads_lead_magnet_id_fkey"
            columns: ["lead_magnet_id"]
            isOneToOne: false
            referencedRelation: "lead_magnets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_magnet_downloads_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          }
        ]
      }
      lead_magnets: {
        Row: {
          button_text: string | null
          content_type: string
          created_at: string
          description: string
          download_count: number | null
          file_url: string
          id: string
          is_active: boolean | null
          name: string
          slug: string
          success_message: string | null
          updated_at: string
        }
        Insert: {
          button_text?: string | null
          content_type: string
          created_at?: string
          description: string
          download_count?: number | null
          file_url: string
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          success_message?: string | null
          updated_at?: string
        }
        Update: {
          button_text?: string | null
          content_type?: string
          created_at?: string
          description?: string
          download_count?: number | null
          file_url?: string
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          success_message?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          bucket_id: string
          content_type: string | null
          created_at: string
          file_name: string
          file_path: string
          id: string
          size: number | null
          updated_at: string
        }
        Insert: {
          bucket_id: string
          content_type?: string | null
          created_at?: string
          file_name: string
          file_path: string
          id?: string
          size?: number | null
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          content_type?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          id?: string
          size?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      post_feedback: {
        Row: {
          created_at: string
          feedback_type: string
          id: string
          post_id: string
          session_id: string | null
        }
        Insert: {
          created_at?: string
          feedback_type: string
          id?: string
          post_id: string
          session_id?: string | null
        }
        Update: {
          created_at?: string
          feedback_type?: string
          id?: string
          post_id?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_feedback_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      post_views: {
        Row: {
          city: string | null
          country: string | null
          device_type: string | null
          id: string
          post_id: string | null
          referrer: string | null
          session_id: string
          viewed_at: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          device_type?: string | null
          id?: string
          post_id?: string | null
          referrer?: string | null
          session_id: string
          viewed_at?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          device_type?: string | null
          id?: string
          post_id?: string | null
          referrer?: string | null
          session_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          author_name: string | null
          canonical_url: string | null
          category_id: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_premium: boolean | null
          language: string | null
          lead_magnet_id: string | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          published_at: string | null
          schema_markup: Json | null
          slug: string
          status: string
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_name?: string | null
          canonical_url?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_premium?: boolean | null
          language?: string | null
          lead_magnet_id?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          published_at?: string | null
          schema_markup?: Json | null
          slug: string
          status?: string
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_name?: string | null
          canonical_url?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_premium?: boolean | null
          language?: string | null
          lead_magnet_id?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          published_at?: string | null
          schema_markup?: Json | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_lead_magnet_id_fkey"
            columns: ["lead_magnet_id"]
            isOneToOne: false
            referencedRelation: "lead_magnets"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string | null
          subscription_status: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_articles: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_articles_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_articles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      search_analytics: {
        Row: {
          id: string
          results_count: number | null
          search_term: string
          searched_at: string | null
          session_id: string | null
        }
        Insert: {
          id?: string
          results_count?: number | null
          search_term: string
          searched_at?: string | null
          session_id?: string | null
        }
        Update: {
          id?: string
          results_count?: number | null
          search_term?: string
          searched_at?: string | null
          session_id?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          consent_given: boolean | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          source: string | null
          source_post_id: string | null
          status: string | null
        }
        Insert: {
          consent_given?: boolean | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          source?: string | null
          source_post_id?: string | null
          status?: string | null
        }
        Update: {
          consent_given?: boolean | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          source?: string | null
          source_post_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscribers_source_post_id_fkey"
            columns: ["source_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
