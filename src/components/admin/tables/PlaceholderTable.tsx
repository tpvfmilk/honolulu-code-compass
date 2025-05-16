
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholderTableProps {
  title: string;
  description: string;
}

export const PlaceholderTable = ({ title, description }: PlaceholderTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground py-8 text-center">
          This data management section will be implemented soon.
        </p>
      </CardContent>
    </Card>
  );
};
