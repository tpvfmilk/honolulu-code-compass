
import { LucideIcon } from "lucide-react";

// Define admin user type
export interface KBAdminUser {
  id: string;
  email: string;
  role: string;
}

// Define article type
export interface KBArticle {
  id: string;
  title: string;
  content: string;
  category_id: string;
  created_at: string;
  updated_at: string; // Fix: Adding missing property
  view_count?: number;
  published_at?: string;
  category?: {
    name: string;
  };
}

// Define category type
export interface KBCategory {
  id: string;
  name: string;
  display_order: number;
  article_count?: number;
  created_at?: string;
  updated_at?: string;
}

// Update feedback type to include status and notes
export interface Feedback {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  status?: string; // Add status property
  notes?: string;  // Add notes property
}

// For the knowledge base components
export interface ArticleType {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
}

export interface KnowledgeBaseData {
  guides: ArticleType[];
  features: ArticleType[];
  faqs: ArticleType[];
  troubleshooting: ArticleType[];
}
