// src/pages/CodeReferenceLibrary.tsx
import { FC, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Bookmark, BookmarkPlus, Search, Info, Calculator, Copy, ExternalLink } from "lucide-react";

// Define our code section interface
interface CodeSection {
  id: string;
  code_type: string;
  jurisdiction: string;
  year: string;
  section_number: string;
  section_title: string;
  section_text: string;
  plain_language_explanation?: string;
  parent_section_id?: string;
  has_children: boolean;
  is_calculation_required: boolean;
}

// Define the frequently referenced code interface
interface FrequentlyReferencedCode {
  id: string;
  code_section_id: string;
  section_number: string;
  section_title: string;
  code_type: string;
  reference_count: number;
}

interface CodeReferenceLibraryProps {
  onLogout: () => Promise<void>;
}

const CodeReferenceLibrary: FC<CodeReferenceLibraryProps> = ({ onLogout }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [codeType, setCodeType] = useState("zoning");
  const [jurisdiction, setJurisdiction] = useState("honolulu");
  const [year, setYear] = useState("2023");
  const [codeSections, setCodeSections] = useState<CodeSection[]>([]);
  const [frequentlyReferenced, setFrequentlyReferenced] = useState<FrequentlyReferencedCode[]>([]);
  const [bookmarkedCodes, setBookmarkedCodes] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState<CodeSection | null>(null);
  
  // Fetch code data on component mount and when filters change
  useEffect(() => {
    const fetchCodeData = async () => {
      setIsLoading(true);
      try {
        // This would be replaced with your actual database queries
        // For now, let's simulate data fetching with mock data
        
        // In real implementation, you'd query your database:
        // const { data, error } = await supabase
        //   .from("code_sections")
        //   .select("*")
        //   .eq("code_type", codeType)
        //   .eq("jurisdiction", jurisdiction)
        //   .eq("year", year)
        //   .is("parent_section_id", null);
        
        // Simulated data for now:
        const mockCodeSections: CodeSection[] = [
          {
            id: "1",
            code_type: "zoning",
            jurisdiction: "honolulu",
            year: "2023",
            section_number: "21-3.50",
            section_title: "Residential Districts",
            section_text: "The purpose of the residential district is to allow for residential uses, by limiting non-residential uses in order to protect and preserve residential areas for residential uses.",
            plain_language_explanation: "This section describes what can be built in residential zones and what uses are allowed.",
            has_children: true,
            is_calculation_required: false
          },
          {
            id: "2",
            code_type: "zoning",
            jurisdiction: "honolulu",
            year: "2023",
            section_number: "21-3.70",
            section_title: "Commercial Districts",
            section_text: "The purpose of the commercial districts is to provide areas for commercial uses, including business and retail services, offices, and other related activities.",
            plain_language_explanation: "This section outlines what can be built in commercial zones and what businesses are allowed.",
            has_children: true,
            is_calculation_required: false
          },
          {
            id: "3",
            code_type: "building",
            jurisdiction: "honolulu",
            year: "2023",
            section_number: "1004.5",
            section_title: "Occupant Load Factors",
            section_text: "The occupant load permitted in any building, or portion thereof, is permitted to be determined by dividing the floor area assigned to that use by the occupant load factor...",
            plain_language_explanation: "This determines how many people can legally occupy a space based on its square footage and use.",
            has_children: false,
            is_calculation_required: true
          }
        ];

        const mockFrequentlyCited: FrequentlyReferencedCode[] = [
          {
            id: "fr1",
            code_section_id: "3",
            section_number: "1004.5",
            section_title: "Occupant Load Factors",
            code_type: "building",
            reference_count: 245
          },
          {
            id: "fr2",
            code_section_id: "1",
            section_number: "21-3.50",
            section_title: "Residential Districts",
            code_type: "zoning",
            reference_count: 198
          }
        ];
        
        setCodeSections(mockCodeSections.filter(section => section.code_type === codeType));
        setFrequentlyReferenced(mockFrequentlyCited);
        
        // Set current section to first one if none selected
        if (!currentSection && mockCodeSections.length > 0) {
          setCurrentSection(mockCodeSections[0]);
        }
      } catch (error) {
        console.error("Error fetching code data:", error);
        toast({
          title: "Error",
          description: "Failed to load code references. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCodeData();
  }, [codeType, jurisdiction, year, toast]);

  // Handle search function
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // In a real implementation, you would query your database
    toast({
      title: "Searching",
      description: `Searching for "${searchQuery}" in the code library...`,
    });
    
    // Simulated search functionality
    setTimeout(() => {
      // This is where you'd process search results
      toast({
        title: "Search Results",
        description: `Found results for "${searchQuery}"`,
      });
    }, 500);
  };

  // Toggle section expansion
  const toggleSectionExpansion = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Toggle bookmark for a code section
  const toggleBookmark = (sectionId: string) => {
    setBookmarkedCodes(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
    
    toast({
      title: bookmarkedCodes.includes(sectionId) ? "Bookmark Removed" : "Bookmark Added",
      description: bookmarkedCodes.includes(sectionId)
        ? "Code section removed from your bookmarks"
        : "Code section added to your bookmarks",
    });
  };

  // View a specific code section
  const viewCodeSection = (section: CodeSection) => {
    setCurrentSection(section);
    
    // In a real app, you might log this view or increment a counter
    // This would help populate the "frequently referenced" section
  };

  // Copy section citation to clipboard
  const copyCitation = (section: CodeSection) => {
    const citation = `${section.jurisdiction.toUpperCase()} ${section.code_type.toUpperCase()} ${section.section_number}: ${section.section_title} (${section.year})`;
    navigator.clipboard.writeText(citation);
    
    toast({
      title: "Citation Copied",
      description: "Code citation copied to clipboard",
    });
  };

  return (
    <AppLayout onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-primary">Code Reference Library</h1>
          <p className="text-muted-foreground">
            Search, browse, and reference building and zoning codes for Hawaii
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by code number, keyword, or phrase..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div>
            <Select value={codeType} onValueChange={setCodeType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Code Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zoning">Zoning Code</SelectItem>
                <SelectItem value="building">Building Code</SelectItem>
                <SelectItem value="fire">Fire Code</SelectItem>
                <SelectItem value="accessibility">Accessibility</SelectItem>
                <SelectItem value="energy">Energy Code</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={jurisdiction} onValueChange={setJurisdiction}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Jurisdiction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="honolulu">Honolulu</SelectItem>
                <SelectItem value="hawaii">Hawaii County</SelectItem>
                <SelectItem value="maui">Maui County</SelectItem>
                <SelectItem value="kauai">Kauai County</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2017">2017</SelectItem>
                <SelectItem value="2014">2014</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Browse Codes</CardTitle>
                <CardDescription>
                  {codeType === "zoning" 
                    ? "Honolulu Land Use Ordinance (LUO)" 
                    : codeType === "building" 
                      ? "International Building Code with Hawaii Amendments"
                      : "Building Codes"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="sections" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sections">Sections</TabsTrigger>
                    <TabsTrigger value="bookmarks">My Bookmarks</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="sections" className="mt-4">
                    {isLoading ? (
                      <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <div
                            key={index}
                            className="h-12 bg-gray-100 animate-pulse rounded-md"
                          ></div>
                        ))}
                      </div>
                    ) : (
                      <ScrollArea className="h-[400px] pr-4">
                        <Accordion
                          type="multiple"
                          value={expandedSections}
                          onValueChange={setExpandedSections}
                          className="w-full"
                        >
                          {codeSections.map((section) => (
                            <AccordionItem key={section.id} value={section.id}>
                              <AccordionTrigger className="hover:bg-muted/50 px-2 rounded-sm text-sm">
                                <div className="flex items-center justify-between w-full pr-2">
                                  <div className="text-left">
                                    <span className="font-mono text-muted-foreground mr-2">
                                      {section.section_number}
                                    </span>
                                    <span>{section.section_title}</span>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="pl-6 border-l-2 border-muted mt-2 mb-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-sm"
                                    onClick={() => viewCodeSection(section)}
                                  >
                                    View Section
                                  </Button>
                                  
                                  {/* Child sections would go here */}
                                  {section.has_children && (
                                    <div className="pt-2 space-y-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start text-sm"
                                      >
                                        <span className="font-mono text-muted-foreground mr-2">
                                          {section.section_number}.1
                                        </span>
                                        Subsection Example
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start text-sm"
                                      >
                                        <span className="font-mono text-muted-foreground mr-2">
                                          {section.section_number}.2
                                        </span>
                                        Another Subsection
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </ScrollArea>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="bookmarks" className="mt-4">
                    {bookmarkedCodes.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Bookmark className="mx-auto h-10 w-10 mb-2 opacity-30" />
                        <p>No bookmarked code sections yet</p>
                        <p className="text-sm">
                          Bookmark important sections for quick reference
                        </p>
                      </div>
                    ) : (
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-2">
                          {bookmarkedCodes.map((id) => {
                            const section = codeSections.find(s => s.id === id);
                            if (!section) return null;
                            
                            return (
                              <Button
                                key={id}
                                variant="ghost"
                                className="w-full justify-start text-sm"
                                onClick={() => viewCodeSection(section)}
                              >
                                <span className="font-mono text-muted-foreground mr-2">
                                  {section.section_number}
                                </span>
                                {section.section_title}
                              </Button>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="w-full">
                  <h3 className="text-sm font-medium mb-2">Frequently Referenced</h3>
                  <div className="space-y-1">
                    {frequentlyReferenced.map((item) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-sm"
                        onClick={() => {
                          const section = codeSections.find(s => s.id === item.code_section_id);
                          if (section) viewCodeSection(section);
                        }}
                      >
                        <span className="font-mono text-muted-foreground mr-2">
                          {item.section_number}
                        </span>
                        {item.section_title}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column - Code Display */}
          <div className="lg:col-span-2">
            {currentSection ? (
              <Card>
                <CardHeader className="pb-3 flex flex-row items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle>
                        <span className="font-mono">{currentSection.section_number}</span> {currentSection.section_title}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleBookmark(currentSection.id)}
                      >
                        {bookmarkedCodes.includes(currentSection.id) ? (
                          <Bookmark className="h-4 w-4 fill-current" />
                        ) : (
                          <BookmarkPlus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <CardDescription>
                      {jurisdiction.charAt(0).toUpperCase() + jurisdiction.slice(1)} {codeType.charAt(0).toUpperCase() + codeType.slice(1)} Code ({year})
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyCitation(currentSection)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {currentSection.is_calculation_required && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => {
                          toast({
                            title: "Calculator",
                            description: "Calculation helper would open here",
                          });
                        }}
                      >
                        <Calculator className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Code Text */}
                    <div className="bg-muted/30 p-4 rounded-md border">
                      <p className="whitespace-pre-line text-sm">
                        {currentSection.section_text}
                      </p>
                    </div>
                    
                    {/* Plain Language Explanation */}
                    {currentSection.plain_language_explanation && (
                      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                        <div className="flex items-start gap-2">
                          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-700 mb-1">
                              Plain Language Explanation
                            </h4>
                            <p className="text-sm text-blue-900">
                              {currentSection.plain_language_explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Related Sections */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Related Sections</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="flex gap-1 items-center">
                          <span>Example Related Section</span>
                          <ExternalLink className="h-3 w-3" />
                        </Badge>
                        <Badge variant="outline" className="flex gap-1 items-center">
                          <span>Another Related Section</span>
                          <ExternalLink className="h-3 w-3" />
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Calculation Helper Prompt - if applicable */}
                    {currentSection.is_calculation_required && (
                      <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                        <div className="flex items-start gap-2">
                          <Calculator className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-amber-700 mb-1">
                              Calculation Required
                            </h4>
                            <p className="text-sm text-amber-900">
                              This code section requires calculations. Use our calculation helper to ensure accuracy.
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2 bg-white"
                              onClick={() => {
                                toast({
                                  title: "Calculator",
                                  description: "Calculation helper would open here",
                                });
                              }}
                            >
                              Open Calculator
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Info className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Select a Code Section
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Choose a section from the navigation panel on the left, or search for specific code requirements using the search bar above.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CodeReferenceLibrary;
