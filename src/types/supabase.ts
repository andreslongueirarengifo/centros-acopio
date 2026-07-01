export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      catalog_items: {
        Row: {
          active: boolean
          category: Database["public"]["Enums"]["item_category"]
          created_at: string
          description: string | null
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          category: Database["public"]["Enums"]["item_category"]
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          category?: Database["public"]["Enums"]["item_category"]
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      center_items: {
        Row: {
          approximate_quantity: string | null
          center_id: string
          item_id: string
          notes: string | null
          status: Database["public"]["Enums"]["item_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          approximate_quantity?: string | null
          center_id: string
          item_id: string
          notes?: string | null
          status: Database["public"]["Enums"]["item_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          approximate_quantity?: string | null
          center_id?: string
          item_id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["item_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "center_items_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "center_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "catalog_items"
            referencedColumns: ["id"]
          },
        ]
      }
      center_items_log: {
        Row: {
          center_id: string
          id: number
          item_id: string
          new_status: Database["public"]["Enums"]["item_status"]
          previous_status: Database["public"]["Enums"]["item_status"] | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          center_id: string
          id?: number
          item_id: string
          new_status: Database["public"]["Enums"]["item_status"]
          previous_status?: Database["public"]["Enums"]["item_status"] | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          center_id?: string
          id?: number
          item_id?: string
          new_status?: Database["public"]["Enums"]["item_status"]
          previous_status?: Database["public"]["Enums"]["item_status"] | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      centers: {
        Row: {
          active: boolean
          address: string
          city: string
          created_at: string
          description: string | null
          id: string
          location: unknown
          manager_email: string | null
          manager_user_id: string | null
          name: string
          opening_hours: string | null
          postal_code: string | null
          public_email: string | null
          public_phone: string | null
          slug: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          active?: boolean
          address: string
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          location: unknown
          manager_email?: string | null
          manager_user_id?: string | null
          name: string
          opening_hours?: string | null
          postal_code?: string | null
          public_email?: string | null
          public_phone?: string | null
          slug: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          active?: boolean
          address?: string
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          location?: unknown
          manager_email?: string | null
          manager_user_id?: string | null
          name?: string
          opening_hours?: string | null
          postal_code?: string | null
          public_email?: string | null
          public_phone?: string | null
          slug?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          center_id: string
          id: string
          recipients_count: number
          sent_at: string
          sent_by: string | null
          subject: string
        }
        Insert: {
          body: string
          center_id: string
          id?: string
          recipients_count?: number
          sent_at?: string
          sent_by?: string | null
          subject: string
        }
        Update: {
          body?: string
          center_id?: string
          id?: string
          recipients_count?: number
          sent_at?: string
          sent_by?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "centers"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          center_id: string
          created_at: string
          email: string
          id: string
          last_email_sent_at: string | null
          unsubscribe_token: string
          unsubscribed_at: string | null
          verification_token: string
          verified_at: string | null
        }
        Insert: {
          center_id: string
          created_at?: string
          email: string
          id?: string
          last_email_sent_at?: string | null
          unsubscribe_token?: string
          unsubscribed_at?: string | null
          verification_token?: string
          verified_at?: string | null
        }
        Update: {
          center_id?: string
          created_at?: string
          email?: string
          id?: string
          last_email_sent_at?: string | null
          unsubscribe_token?: string
          unsubscribed_at?: string | null
          verification_token?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "centers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      center_subscriber_count: {
        Args: { p_center_id: string }
        Returns: number
      }
      get_active_centers_with_coords: {
        Args: never
        Returns: {
          address: string
          city: string
          description: string
          id: string
          lat: number
          lng: number
          name: string
          opening_hours: string
          postal_code: string
          public_phone: string
          slug: string
          updated_at: string
          verified: boolean
        }[]
      }
      get_center_by_slug: {
        Args: { slug_input: string }
        Returns: {
          active: boolean
          address: string
          city: string
          created_at: string
          description: string
          id: string
          lat: number
          lng: number
          manager_email: string
          manager_user_id: string
          name: string
          opening_hours: string
          postal_code: string
          public_email: string
          public_phone: string
          slug: string
          updated_at: string
          verified: boolean
        }[]
      }
      nearby_centers: {
        Args: { lat: number; lng: number; radius_meters?: number }
        Returns: {
          address: string
          distance_meters: number
          id: string
          lat: number
          lng: number
          name: string
        }[]
      }
      slugify: { Args: { input: string }; Returns: string }
    }
    Enums: {
      item_category:
        | "water"
        | "food"
        | "personal_hygiene"
        | "household_cleaning"
        | "baby"
        | "medical"
        | "clothing"
        | "bedding"
        | "shelter"
        | "other"
      item_status: "needed" | "sufficient" | "surplus"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      item_category: [
        "water",
        "food",
        "personal_hygiene",
        "household_cleaning",
        "baby",
        "medical",
        "clothing",
        "bedding",
        "shelter",
        "other",
      ],
      item_status: ["needed", "sufficient", "surplus"],
    },
  },
} as const
