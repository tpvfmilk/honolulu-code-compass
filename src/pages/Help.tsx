
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SearchBox } from "@/components/knowledge/SearchBox";
import { KnowledgeGrid } from "@/components/knowledge/KnowledgeGrid";
import { knowledgeBase, groupArticlesByCategory } from "@/components/knowledge/KnowledgeData";

type HelpProps = {
  onLogout: (() => void) | (() => Promise<void>);
};

const Help = ({ onLogout }: HelpProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Get all articles for search
  const allArticles = [
    ...knowledgeBase.guides,
    ...knowledgeBase.features,
    ...knowledgeBase.faqs,
    ...knowledgeBase.troubleshooting
  ];

  return (
    <AppLayout onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Knowledge Base</h1>
            <p className="text-muted-foreground">Find answers, guides, and tutorials for the Comply platform</p>
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
    </AppLayout>
  );
};

export default Help;
