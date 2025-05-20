
import { LucideIcon } from "lucide-react";

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

export interface KBCategory {
  id: string;
  name: string;
  article_count: number;
  display_order: number;
}

export interface KBArticle {
  id: string;
  title: string;
  content: string;
  category_id: string;
  published_at: string | null;
  last_updated: string;
  view_count: number;
}

export interface KBAdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
}

export interface FeedbackItem {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}
