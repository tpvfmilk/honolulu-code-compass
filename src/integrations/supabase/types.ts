export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      construction_types: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      fire_separation_requirements: {
        Row: {
          created_at: string | null
          from_occupancy_id: string
          id: string
          required_rating_hours: number
          to_occupancy_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          from_occupancy_id: string
          id?: string
          required_rating_hours: number
          to_occupancy_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          from_occupancy_id?: string
          id?: string
          required_rating_hours?: number
          to_occupancy_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fire_separation_requirements_from_occupancy_id_fkey"
            columns: ["from_occupancy_id"]
            isOneToOne: false
            referencedRelation: "occupancy_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fire_separation_requirements_to_occupancy_id_fkey"
            columns: ["to_occupancy_id"]
            isOneToOne: false
            referencedRelation: "occupancy_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      height_area_limits: {
        Row: {
          base_allowable_area: number
          construction_type_id: string
          created_at: string | null
          id: string
          max_height_ft: number
          max_stories: number
          occupancy_group_id: string
          sprinkler_increase_allowed: boolean | null
          updated_at: string | null
        }
        Insert: {
          base_allowable_area: number
          construction_type_id: string
          created_at?: string | null
          id?: string
          max_height_ft: number
          max_stories: number
          occupancy_group_id: string
          sprinkler_increase_allowed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          base_allowable_area?: number
          construction_type_id?: string
          created_at?: string | null
          id?: string
          max_height_ft?: number
          max_stories?: number
          occupancy_group_id?: string
          sprinkler_increase_allowed?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "height_area_limits_construction_type_id_fkey"
            columns: ["construction_type_id"]
            isOneToOne: false
            referencedRelation: "construction_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "height_area_limits_occupancy_group_id_fkey"
            columns: ["occupancy_group_id"]
            isOneToOne: false
            referencedRelation: "occupancy_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      occupancy_groups: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_data: {
        Row: {
          created_at: string | null
          data: Json
          id: string
          project_id: string
          step_number: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          id?: string
          project_id: string
          step_number: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          project_id?: string
          step_number?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          address: string | null
          client_name: string | null
          created_at: string | null
          current_step: number | null
          id: string
          is_complete: boolean | null
          name: string
          property_owner: string | null
          status: string | null
          tmk: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          client_name?: string | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          is_complete?: boolean | null
          name: string
          property_owner?: string | null
          status?: string | null
          tmk?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          client_name?: string | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          is_complete?: boolean | null
          name?: string
          property_owner?: string | null
          status?: string | null
          tmk?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      space_types: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          occupancy_group_id: string
          occupant_load_factor: number
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          occupancy_group_id: string
          occupant_load_factor: number
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          occupancy_group_id?: string
          occupant_load_factor?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "space_types_occupancy_group_id_fkey"
            columns: ["occupancy_group_id"]
            isOneToOne: false
            referencedRelation: "occupancy_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_distance_limits: {
        Row: {
          created_at: string | null
          id: string
          max_common_path_ft: number
          max_dead_end_ft: number
          max_travel_distance_ft: number
          occupancy_group_id: string
          sprinklered: boolean
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_common_path_ft: number
          max_dead_end_ft: number
          max_travel_distance_ft: number
          occupancy_group_id: string
          sprinklered: boolean
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          max_common_path_ft?: number
          max_dead_end_ft?: number
          max_travel_distance_ft?: number
          occupancy_group_id?: string
          sprinklered?: boolean
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "travel_distance_limits_occupancy_group_id_fkey"
            columns: ["occupancy_group_id"]
            isOneToOne: false
            referencedRelation: "occupancy_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      zoning_districts: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          front_setback: number
          id: string
          max_building_height: number
          max_far: number | null
          max_lot_coverage: number
          max_stories: number | null
          min_lot_area: number
          name: string
          rear_setback: number
          side_setback: number
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          front_setback: number
          id?: string
          max_building_height: number
          max_far?: number | null
          max_lot_coverage: number
          max_stories?: number | null
          min_lot_area: number
          name: string
          rear_setback: number
          side_setback: number
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          front_setback?: number
          id?: string
          max_building_height?: number
          max_far?: number | null
          max_lot_coverage?: number
          max_stories?: number | null
          min_lot_area?: number
          name?: string
          rear_setback?: number
          side_setback?: number
          updated_at?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
