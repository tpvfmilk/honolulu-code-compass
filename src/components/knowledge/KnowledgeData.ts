
import { Book, BookOpen, BookText, FileQuestion, XCircle } from "lucide-react";
import { KnowledgeBaseData } from "./types";

// Mock knowledge base articles by category
export const knowledgeBase: KnowledgeBaseData = {
  guides: [
    {
      id: "g1",
      title: "Getting Started with Comply",
      description: "Learn how to set up your first project",
      icon: BookOpen,
      category: "Getting Started"
    },
    {
      id: "g2",
      title: "Understanding Building Classifications",
      description: "A guide to IBC building classifications",
      icon: BookText,
      category: "Core Concepts"
    },
    {
      id: "g3",
      title: "Navigating Zoning Requirements",
      description: "How to use the zoning compliance tools",
      icon: Book,
      category: "Feature Guides"
    }
  ],
  features: [
    {
      id: "f1",
      title: "Setting Up Project Details",
      description: "Complete guide to project information setup",
      icon: BookText,
      category: "Projects"
    },
    {
      id: "f2",
      title: "Occupancy Calculations",
      description: "How to calculate occupant loads and requirements",
      icon: BookText,
      category: "Calculations"
    },
    {
      id: "f3",
      title: "Fire Safety Compliance",
      description: "Using fire safety features effectively",
      icon: BookText,
      category: "Compliance"
    },
    {
      id: "f4",
      title: "Zoning Analysis",
      description: "How to perform zoning analysis",
      icon: BookText,
      category: "Zoning"
    }
  ],
  faqs: [
    {
      id: "q1",
      title: "What is the Comply platform?",
      description: "Our platform helps architects and engineers generate accurate building code compliance sheets",
      icon: FileQuestion,
      category: "General"
    },
    {
      id: "q2",
      title: "Which jurisdictions are supported?",
      description: "Currently, we fully support the City & County of Honolulu",
      icon: FileQuestion,
      category: "Coverage"
    },
    {
      id: "q3",
      title: "How do I create a new project?",
      description: "Navigate to the Projects page and click the \"Create New Project\" button",
      icon: FileQuestion,
      category: "Projects"
    },
    {
      id: "q4",
      title: "Can I use this for renovation projects?",
      description: "The platform supports both new construction and renovation projects",
      icon: FileQuestion,
      category: "Projects"
    },
    {
      id: "q5",
      title: "How do I input zoning information?",
      description: "In Step 2 of the project wizard, select your zoning district from the dropdown menu",
      icon: FileQuestion,
      category: "Zoning"
    },
    {
      id: "q6",
      title: "How are occupant loads calculated?",
      description: "The platform automatically calculates occupant loads based on IBC Table 1004.5",
      icon: FileQuestion,
      category: "Calculations"
    },
    {
      id: "q7",
      title: "What code versions are supported?",
      description: "Comply currently supports the 2018 International Building Code (IBC) with Hawaii amendments",
      icon: FileQuestion,
      category: "Coverage"
    },
    {
      id: "q8",
      title: "How do I export my compliance documents?",
      description: "Go to the Review step and click \"Generate PDF\" to create a permit-ready compliance sheet",
      icon: FileQuestion,
      category: "Documents"
    }
  ],
  troubleshooting: [
    {
      id: "t1",
      title: "Project Won't Save",
      description: "Solutions for when your project doesn't save properly",
      icon: XCircle,
      category: "Projects"
    },
    {
      id: "t2",
      title: "Calculation Errors",
      description: "Fixing common calculation issues and discrepancies",
      icon: XCircle,
      category: "Calculations"
    },
    {
      id: "t3",
      title: "PDF Generation Problems",
      description: "Troubleshooting PDF generation issues",
      icon: XCircle,
      category: "Documents"
    }
  ]
};

// Helper function to group articles by category
export const groupArticlesByCategory = (articles: any[]) => {
  const groupedArticles: Record<string, any[]> = {};
  
  articles.forEach(article => {
    if (!groupedArticles[article.category]) {
      groupedArticles[article.category] = [];
    }
    groupedArticles[article.category].push(article);
  });
  
  return groupedArticles;
};
