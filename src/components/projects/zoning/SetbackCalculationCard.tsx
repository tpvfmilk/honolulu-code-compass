
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

type SetbacksProps = {
  setbacks: {
    front: number;
    side: number;
    rear: number;
    streetSide?: number;
  } | null;
  isCornerLot: boolean;
};

export const SetbackCalculationCard = ({ setbacks, isCornerLot }: SetbacksProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  if (!setbacks) return null;
  
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Setback Requirements</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-4">
          <div className="relative h-44 border border-dashed border-muted-foreground bg-muted/20 rounded-lg">
            {/* Visual Building Envelope Diagram */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Inner rectangle representing building area */}
              <div className="w-3/5 h-3/5 bg-primary/10 border border-primary relative">
                <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                  Front: {setbacks.front}′
                </div>
                <div className="absolute top-1/2 -right-7 transform -translate-y-1/2 text-xs text-muted-foreground">
                  Side: {setbacks.side}′
                </div>
                <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                  Rear: {setbacks.rear}′
                </div>
                <div className="absolute top-1/2 -left-7 transform -translate-y-1/2 text-xs text-muted-foreground">
                  Side: {setbacks.side}′
                </div>
                {isCornerLot && setbacks.streetSide && (
                  <div className="absolute top-1/2 -left-12 transform -translate-y-1/2 text-xs text-primary">
                    Street Side: {setbacks.streetSide}′
                  </div>
                )}
              </div>
            </div>
            
            {/* Label for the lot */}
            <div className="absolute bottom-1 right-2 text-xs text-muted-foreground">
              Property Line
            </div>
            
            {/* Label for building area */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-xs text-primary font-medium">
              Building Area
            </div>
            
            {isCornerLot && (
              <div className="absolute top-1 left-1 bg-primary/20 px-2 py-1 rounded text-xs">
                Corner Lot
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between py-1 border-b">
            <span className="text-sm">Front Setback</span>
            <span className="font-medium flex items-center">
              {setbacks.front} feet
              <div className="ml-2 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
            </span>
          </div>
          
          <div className="flex justify-between py-1 border-b">
            <span className="text-sm">Side Setbacks</span>
            <span className="font-medium flex items-center">
              {setbacks.side} feet minimum
              <div className="ml-2 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
            </span>
          </div>
          
          <div className="flex justify-between py-1 border-b">
            <span className="text-sm">Rear Setback</span>
            <span className="font-medium flex items-center">
              {setbacks.rear} feet
              <div className="ml-2 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
            </span>
          </div>
          
          {isCornerLot && setbacks.streetSide && (
            <div className="flex justify-between py-1 border-b">
              <span className="text-sm">Corner Side Setback</span>
              <span className="font-medium flex items-center">
                {setbacks.streetSide} feet
                <div className="ml-2 w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
              </span>
            </div>
          )}
        </div>
        
        <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen} className="mt-4">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm gap-2 text-muted-foreground">
              <ChevronDown className={`h-4 w-4 transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`} />
              Show Calculation Details
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="rounded-md bg-muted p-3 text-xs space-y-2">
              <p><strong>Code Reference:</strong> Honolulu LUO Chapter 21, Article 3</p>
              <p><strong>Measurement:</strong> Setbacks are measured from property line to structure</p>
              <p><strong>Special Conditions:</strong> Non-conforming lots may qualify for reduced setbacks</p>
              <p><strong>Projections:</strong> Certain features (eaves, steps) may project into setbacks</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
