
// Define the project type
export interface Project {
  id: string;
  name: string;
  tmk: string;
  status: "draft" | "in_progress" | "submitted" | "approved" | "rejected";
  project_type: string;
  address: string;
  created_at: string;
  updated_at: string;
}

// Define the database type that matches Supabase schema
export interface ProjectData {
  id: string;
  name: string;
  tmk: string | null;
  status: string | null;
  address: string | null;
  created_at: string | null;
  updated_at: string | null;
  current_step: number | null;
  is_complete: boolean | null;
  property_owner: string | null;
  client_name: string | null;
  user_id: string;
}

// Helper for status display
export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "draft":
      return "bg-gray-200 text-gray-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "submitted":
      return "bg-amber-100 text-amber-800";
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
