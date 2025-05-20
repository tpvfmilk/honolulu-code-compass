
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Book, BookOpen, FileQuestion, XCircle, BookText, Search, Bookmark } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Link } from "react-router-dom";

type HelpProps = {
  onLogout: (() => void) | (() => Promise<void>);
};

const Help = ({ onLogout }: HelpProps) => {
  const [activeTab, setActiveTab] = useState("guides");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock knowledge base articles by category
  const knowledgeBase = {
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

  // Filter articles based on search query
  const filterArticles = (articles: any[]) => {
    if (!searchQuery) return articles;
    
    return articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get all articles for search
  const allArticles = [
    ...knowledgeBase.guides,
    ...knowledgeBase.features,
    ...knowledgeBase.faqs,
    ...knowledgeBase.troubleshooting
  ];

  // Group articles by category for each tab
  const groupArticlesByCategory = (articles: any[]) => {
    const groupedArticles: Record<string, any[]> = {};
    
    articles.forEach(article => {
      if (!groupedArticles[article.category]) {
        groupedArticles[article.category] = [];
      }
      groupedArticles[article.category].push(article);
    });
    
    return groupedArticles;
  };

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
        <div className="relative">
          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              placeholder="Search knowledge base..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
              icon={<Search className="h-4 w-4" />}
            />
            {searchQuery && (
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Search Results">
                  {filterArticles(allArticles).map((article) => (
                    <CommandItem 
                      key={article.id}
                      onSelect={() => {
                        // For now, just clear search as we don't have article detail pages
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-2"
                    >
                      <article.icon className="h-4 w-4" />
                      <span>{article.title}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{article.category}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </div>

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

          {/* Guides Tab Content */}
          <TabsContent value="guides" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(groupedGuides).map(([category, articles]) => (
                <Card key={category} className="col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" /> 
                      {category}
                    </CardTitle>
                    <CardDescription>
                      {category === "Getting Started" 
                        ? "Begin your journey with Comply" 
                        : category === "Core Concepts" 
                          ? "Learn the fundamental concepts"
                          : "Detailed guides for specific features"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {articles.map(article => (
                        <li key={article.id} className="flex items-start py-2 hover:bg-muted px-2 rounded-md transition-colors">
                          <article.icon className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                          <div>
                            <h4 className="font-medium">{article.title}</h4>
                            <p className="text-sm text-muted-foreground">{article.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Feature Guides Tab Content */}
          <TabsContent value="features" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(groupedFeatures).map(([category, articles]) => (
                <Card key={category} className="col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookText className="h-5 w-5 mr-2" /> 
                      {category}
                    </CardTitle>
                    <CardDescription>
                      Detailed guides for {category.toLowerCase()} features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {articles.map(article => (
                        <li key={article.id} className="flex items-start py-2 hover:bg-muted px-2 rounded-md transition-colors">
                          <article.icon className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                          <div>
                            <h4 className="font-medium">{article.title}</h4>
                            <p className="text-sm text-muted-foreground">{article.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FAQs Tab Content */}
          <TabsContent value="faqs" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(groupedFaqs).map(([category, articles]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileQuestion className="h-5 w-5 mr-2" /> 
                      {category} FAQs
                    </CardTitle>
                    <CardDescription>
                      Frequently asked questions about {category.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {articles.map(article => (
                        <div key={article.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                          <h4 className="font-medium">{article.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{article.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Troubleshooting Tab Content */}
          <TabsContent value="troubleshooting" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(groupedTroubleshooting).map(([category, articles]) => (
                <Card key={category} className="col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <XCircle className="h-5 w-5 mr-2" /> 
                      {category} Issues
                    </CardTitle>
                    <CardDescription>
                      Solutions for common problems
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {articles.map(article => (
                        <li key={article.id} className="flex items-start py-2 hover:bg-muted px-2 rounded-md transition-colors">
                          <article.icon className="h-5 w-5 mr-2 mt-0.5 text-destructive" />
                          <div>
                            <h4 className="font-medium">{article.title}</h4>
                            <p className="text-sm text-muted-foreground">{article.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Additional Support Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Additional Support?</CardTitle>
            <CardDescription>Can't find what you're looking for? Contact our support team.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-sm text-muted-foreground">support@hibuildingcode.com</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Phone Support</h3>
                <p className="text-sm text-muted-foreground">(808) 555-1234</p>
                <p className="text-xs text-muted-foreground">Monday-Friday, 8:00am-5:00pm HST</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Office Address</h3>
                <p className="text-sm text-muted-foreground">123 Ala Moana Blvd, Honolulu, HI 96813</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Help;
