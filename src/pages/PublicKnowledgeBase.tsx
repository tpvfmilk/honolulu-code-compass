
import { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { SearchBox } from "@/components/knowledge/SearchBox";
import { KnowledgeGrid } from "@/components/knowledge/KnowledgeGrid";
import { knowledgeBase } from "@/components/knowledge/KnowledgeData";
import { ChevronLeft } from "lucide-react";

const PublicKnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // Get all articles for search
  const allArticles = [
    ...knowledgeBase.guides,
    ...knowledgeBase.features,
    ...knowledgeBase.faqs,
    ...knowledgeBase.troubleshooting
  ];

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Knowledge Base</h1>
              <p className="text-muted-foreground">Find answers, guides, and tutorials for the Comply platform</p>
            </div>
            
            <div className="hidden sm:block">
              <Link to="/auth">
                <Button variant="outline" className="mr-2">Log in</Button>
              </Link>
              <Link to="/auth?signup=true">
                <Button>Sign up</Button>
              </Link>
            </div>
          </div>

          {/* Search box */}
          <SearchBox 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            allArticles={allArticles} 
          />

          {/* Knowledge base content in a two-column grid */}
          <KnowledgeGrid />
        </div>
      </div>
    </PublicLayout>
  );
};

export default PublicKnowledgeBase;
