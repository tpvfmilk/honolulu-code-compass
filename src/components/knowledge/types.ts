
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
