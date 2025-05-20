
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, BookOpen, BookText, FileQuestion, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Import the newly created components
import { SearchBox } from "@/components/knowledge/SearchBox";
import { GuidesTab } from "@/components/knowledge/GuidesTab";
import { FeaturesTab } from "@/components/knowledge/FeaturesTab";
import { FaqsTab } from "@/components/knowledge/FaqsTab";
import { TroubleshootingTab } from "@/components/knowledge/TroubleshootingTab";
import { AdditionalSupport } from "@/components/knowledge/AdditionalSupport";
import { knowledgeBase, groupArticlesByCategory } from "@/components/knowledge/KnowledgeData";

type HelpProps = {
  onLogout: (() => void) | (() => Promise<void>);
};

const Help = ({ onLogout }: HelpProps) => {
  const [activeTab, setActiveTab] = useState("guides");
  const [searchQuery, setSearchQuery] = useState("");

  // Get all articles for search
  const allArticles = [
    ...knowledgeBase.guides,
    ...knowledgeBase.features,
    ...knowledgeBase.faqs,
    ...knowledgeBase.troubleshooting
  ];

  // Group articles by category for each tab
  const groupedGuides = groupArticlesByCategory(knowledgeBase.guides);
  const groupedFeatures = groupArticlesByCategory(knowledgeBase.features);
  const groupedFaqs = groupArticlesByCategory(knowledgeBase.faqs);
  const groupedTroubleshooting = groupArticlesByCategory(knowledgeBase.troubleshooting);

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

        {/* Main content tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="guides">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Guides</span>
            </TabsTrigger>
            <TabsTrigger value="features">
              <BookText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Feature Guides</span>
            </TabsTrigger>
            <TabsTrigger value="faqs">
              <FileQuestion className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">FAQs</span>
            </TabsTrigger>
            <TabsTrigger value="troubleshooting">
              <XCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Troubleshooting</span>
            </TabsTrigger>
          </TabsList>

          {/* Content for each tab */}
          <TabsContent value="guides" className="space-y-4">
            <GuidesTab groupedGuides={groupedGuides} />
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <FeaturesTab groupedFeatures={groupedFeatures} />
          </TabsContent>

          <TabsContent value="faqs" className="space-y-4">
            <FaqsTab groupedFaqs={groupedFaqs} />
          </TabsContent>

          <TabsContent value="troubleshooting" className="space-y-4">
            <TroubleshootingTab groupedTroubleshooting={groupedTroubleshooting} />
          </TabsContent>
        </Tabs>

        {/* Additional Support Section */}
        <AdditionalSupport />
      </div>
    </AppLayout>
  );
};

export default Help;
