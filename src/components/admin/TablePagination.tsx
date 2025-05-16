
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface TablePaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
}

export const TablePagination = ({ currentPage, totalItems, itemsPerPage, setCurrentPage }: TablePaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return (
    <div className="mt-4 flex justify-between items-center">
      <p className="text-sm text-muted-foreground">
        Showing {Math.min(itemsPerPage, totalItems)} of {totalItems} records
      </p>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>{currentPage}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
