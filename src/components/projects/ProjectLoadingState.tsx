
import { Card, CardContent } from "@/components/ui/card";

export const ProjectLoadingState = () => {
  return (
    <div className="max-w-6xl mx-auto py-6">
      <Card>
        <CardContent className="pt-6 flex justify-center items-center min-h-[300px]">
          <div className="animate-pulse text-lg">Loading project data...</div>
        </CardContent>
      </Card>
    </div>
  );
};
