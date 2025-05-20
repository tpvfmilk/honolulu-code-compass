
import { Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { ArticleType } from "./types";

interface SearchBoxProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  allArticles: ArticleType[];
}

export const SearchBox = ({ searchQuery, setSearchQuery, allArticles }: SearchBoxProps) => {
  // Filter articles based on search query
  const filterArticles = (articles: ArticleType[]) => {
    if (!searchQuery) return [];
    
    return articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="relative">
      <Command className="rounded-lg border shadow-md">
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 mr-2 shrink-0 opacity-50" />
          <CommandInput 
            placeholder="Search knowledge base..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="flex h-10 w-full rounded-md bg-transparent py-3 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
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
  );
};
