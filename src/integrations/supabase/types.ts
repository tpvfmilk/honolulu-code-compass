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
      code_sections: {
        Row: {
          code_type: string
          created_at: string | null
          has_children: boolean | null
          id: string
          is_calculation_required: boolean | null
          jurisdiction: string
          parent_section_id: string | null
          plain_language_explanation: string | null
          section_number: string
          section_text: string
          section_title: string
          updated_at: string | null
          year: string
        }
        Insert: {
          code_type: string
          created_at?: string | null
          has_children?: boolean | null
          id?: string
          is_calculation_required?: boolean | null
          jurisdiction: string
          parent_section_id?: string | null
          plain_language_explanation?: string | null
          section_number: string
          section_text: string
          section_title: string
          updated_at?: string | null
          year: string
        }
        Update: {
          code_type?: string
          created_at?: string | null
          has_children?: boolean | null
          id?: string
          is_calculation_required?: boolean | null
          jurisdiction?: string
          parent_section_id?: string | null
          plain_language_explanation?: string | null
          section_number?: string
          section_text?: string
          section_title?: string
          updated_at?: string | null
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_sections_parent_section_id_fkey"
            columns: ["parent_section_id"]
            isOneToOne: false
            referencedRelation: "code_sections"
            referencedColumns: ["id"]
          },
        ]
      }
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
      exterior_wall_requirements: {
        Row: {
          construction_type_id: string | null
          created_at: string | null
          id: string
          max_opening_percent_with_sprinkler: number
          max_opening_percent_without_sprinkler: number
          max_separation_ft: number
          min_separation_ft: number
          notes: string | null
          occupancy_group_id: string | null
          rating_hours_with_sprinkler: number
          rating_hours_without_sprinkler: number
          reference: string
          updated_at: string | null
          zoning_district_id: string | null
        }
        Insert: {
          construction_type_id?: string | null
          created_at?: string | null
          id?: string
          max_opening_percent_with_sprinkler: number
          max_opening_percent_without_sprinkler: number
          max_separation_ft: number
          min_separation_ft: number
          notes?: string | null
          occupancy_group_id?: string | null
          rating_hours_with_sprinkler: number
          rating_hours_without_sprinkler: number
          reference: string
          updated_at?: string | null
          zoning_district_id?: string | null
        }
        Update: {
          construction_type_id?: string | null
          created_at?: string | null
          id?: string
          max_opening_percent_with_sprinkler?: number
          max_opening_percent_without_sprinkler?: number
          max_separation_ft?: number
          min_separation_ft?: number
          notes?: string | null
          occupancy_group_id?: string | null
          rating_hours_with_sprinkler?: number
          rating_hours_without_sprinkler?: number
          reference?: string
          updated_at?: string | null
          zoning_district_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exterior_wall_requirements_construction_type_id_fkey"
            columns: ["construction_type_id"]
            isOneToOne: false
            referencedRelation: "construction_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exterior_wall_requirements_occupancy_group_id_fkey"
            columns: ["occupancy_group_id"]
            isOneToOne: false
            referencedRelation: "occupancy_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exterior_wall_requirements_zoning_district_id_fkey"
            columns: ["zoning_district_id"]
            isOneToOne: false
            referencedRelation: "zoning_districts"
            referencedColumns: ["id"]
          },
        ]
      }
      exterior_wall_special_requirements: {
        Row: {
          created_at: string | null
          description: string
          id: string
          max_separation_ft: number
          min_separation_ft: number
          rating_requirement: string
          reference: string
          requirement_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          max_separation_ft: number
          min_separation_ft: number
          rating_requirement: string
          reference: string
          requirement_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          max_separation_ft?: number
          min_separation_ft?: number
          rating_requirement?: string
          reference?: string
          requirement_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
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
      frequently_referenced_codes: {
        Row: {
          code_section_id: string
          id: string
          reference_count: number | null
          updated_at: string | null
        }
        Insert: {
          code_section_id: string
          id?: string
          reference_count?: number | null
          updated_at?: string | null
        }
        Update: {
          code_section_id?: string
          id?: string
          reference_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "frequently_referenced_codes_code_section_id_fkey"
            columns: ["code_section_id"]
            isOneToOne: false
            referencedRelation: "code_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      height_area_limits: {
        Row: {
          base_allowable_area: number
          base_height_ft: number
          base_stories: number
          construction_type_id: string
          created_at: string | null
          id: string
          occupancy_group_id: string
          sprinkler_increase_allowed: boolean | null
          sprinklered_area: number | null
          sprinklered_height_ft: number | null
          sprinklered_stories: number | null
          updated_at: string | null
        }
        Insert: {
          base_allowable_area: number
          base_height_ft: number
          base_stories: number
          construction_type_id: string
          created_at?: string | null
          id?: string
          occupancy_group_id: string
          sprinkler_increase_allowed?: boolean | null
          sprinklered_area?: number | null
          sprinklered_height_ft?: number | null
          sprinklered_stories?: number | null
          updated_at?: string | null
        }
        Update: {
          base_allowable_area?: number
          base_height_ft?: number
          base_stories?: number
          construction_type_id?: string
          created_at?: string | null
          id?: string
          occupancy_group_id?: string
          sprinkler_increase_allowed?: boolean | null
          sprinklered_area?: number | null
          sprinklered_height_ft?: number | null
          sprinklered_stories?: number | null
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
      kb_admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          last_login: string | null
          password_hash: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          last_login?: string | null
          password_hash: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_login?: string | null
          password_hash?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      kb_articles: {
        Row: {
          category_id: string
          content: string
          created_at: string
          id: string
          last_updated: string
          published_at: string | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category_id: string
          content: string
          created_at?: string
          id?: string
          last_updated?: string
          published_at?: string | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category_id?: string
          content?: string
          created_at?: string
          id?: string
          last_updated?: string
          published_at?: string | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kb_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "kb_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_categories: {
        Row: {
          article_count: number | null
          created_at: string
          display_order: number
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          article_count?: number | null
          created_at?: string
          display_order: number
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          article_count?: number | null
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
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
      parking_requirements: {
        Row: {
          code_reference: string | null
          created_at: string | null
          id: string
          loading_ratio: string | null
          notes: string | null
          parking_ratio: string
          updated_at: string | null
          use_type: string
          zoning_district_id: string | null
        }
        Insert: {
          code_reference?: string | null
          created_at?: string | null
          id?: string
          loading_ratio?: string | null
          notes?: string | null
          parking_ratio: string
          updated_at?: string | null
          use_type: string
          zoning_district_id?: string | null
        }
        Update: {
          code_reference?: string | null
          created_at?: string | null
          id?: string
          loading_ratio?: string | null
          notes?: string | null
          parking_ratio?: string
          updated_at?: string | null
          use_type?: string
          zoning_district_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parking_requirements_zoning_district_id_fkey"
            columns: ["zoning_district_id"]
            isOneToOne: false
            referencedRelation: "zoning_districts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
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
          actual_ada_stalls: number | null
          actual_loading_spaces: number | null
          actual_standard_stalls: number | null
          address: string | null
          building_area_for_parking: number | null
          client_name: string | null
          created_at: string | null
          current_step: number | null
          id: string
          is_complete: boolean | null
          name: string
          parking_notes: string | null
          project_type: string | null
          property_owner: string | null
          status: string | null
          tmk: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_ada_stalls?: number | null
          actual_loading_spaces?: number | null
          actual_standard_stalls?: number | null
          address?: string | null
          building_area_for_parking?: number | null
          client_name?: string | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          is_complete?: boolean | null
          name: string
          parking_notes?: string | null
          project_type?: string | null
          property_owner?: string | null
          status?: string | null
          tmk?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_ada_stalls?: number | null
          actual_loading_spaces?: number | null
          actual_standard_stalls?: number | null
          address?: string | null
          building_area_for_parking?: number | null
          client_name?: string | null
          created_at?: string | null
          current_step?: number | null
          id?: string
          is_complete?: boolean | null
          name?: string
          parking_notes?: string | null
          project_type?: string | null
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
      user_bookmarked_codes: {
        Row: {
          code_section_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          code_section_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          code_section_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmarked_codes_code_section_id_fkey"
            columns: ["code_section_id"]
            isOneToOne: false
            referencedRelation: "code_sections"
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
      kb_admin_login: {
        Args: { admin_email: string; admin_password: string }
        Returns: Json
      }
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
