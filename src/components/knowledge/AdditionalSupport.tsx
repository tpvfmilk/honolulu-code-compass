
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const AdditionalSupport = () => {
  return (
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
  );
};
