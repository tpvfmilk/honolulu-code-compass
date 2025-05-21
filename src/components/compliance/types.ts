
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

// Types for compliance admin users
export interface ComplianceAdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
}

// Types for construction data
export interface ConstructionType {
  id: string;
  code: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OccupancyGroup {
  id: string;
  code: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Table stats for dashboard
export interface TableStats {
  table_name: string;
  record_count: number;
  last_updated?: string;
  icon?: ReactNode;
}
