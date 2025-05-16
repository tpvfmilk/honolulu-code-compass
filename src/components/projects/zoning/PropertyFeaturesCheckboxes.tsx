
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

type PropertyFeaturesCheckboxesProps = {
  isCornerLot: boolean;
  isHistoric: boolean;
  isSMA: boolean;
  onCornerLotChange: (checked: boolean) => void;
  onHistoricChange: (checked: boolean) => void;
  onSMAChange: (checked: boolean) => void;
};

export const PropertyFeaturesCheckboxes = ({
  isCornerLot,
  isHistoric,
  isSMA,
  onCornerLotChange,
  onHistoricChange,
  onSMAChange
}: PropertyFeaturesCheckboxesProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium mb-2">Property Features:</h3>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="cornerLot" 
          checked={isCornerLot} 
          onCheckedChange={(checked) => onCornerLotChange(checked as boolean)}
        />
        <Label 
          htmlFor="cornerLot" 
          className="text-sm font-normal cursor-pointer"
        >
          Corner Lot
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                type="button" 
                onClick={(e) => e.preventDefault()}
                className="text-muted-foreground hover:text-foreground"
              >
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>A corner lot is located at the intersection of two streets and has additional setback requirements.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="historic" 
          checked={isHistoric} 
          onCheckedChange={(checked) => onHistoricChange(checked as boolean)}
        />
        <Label 
          htmlFor="historic" 
          className="text-sm font-normal cursor-pointer"
        >
          Historic District
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                type="button" 
                onClick={(e) => e.preventDefault()}
                className="text-muted-foreground hover:text-foreground"
              >
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Properties in historic districts may have special design requirements and review processes.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="sma" 
          checked={isSMA} 
          onCheckedChange={(checked) => onSMAChange(checked as boolean)}
        />
        <Label 
          htmlFor="sma" 
          className="text-sm font-normal cursor-pointer"
        >
          Special Management Area (SMA)
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                type="button" 
                onClick={(e) => e.preventDefault()}
                className="text-muted-foreground hover:text-foreground"
              >
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>The Special Management Area (SMA) applies to coastal zones and requires additional permits and environmental review.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
