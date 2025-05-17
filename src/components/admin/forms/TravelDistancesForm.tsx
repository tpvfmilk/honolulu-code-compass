
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { fetchOccupancyGroups } from "@/services/dataService";

// Define form validation schema
const formSchema = z.object({
  occupancyGroupId: z.string({
    required_error: "Occupancy group is required.",
  }),
  sprinklered: z.boolean(),
  maxTravelDistance: z.coerce
    .number()
    .min(0, "Travel distance must be a positive number."),
  maxCommonPath: z.coerce
    .number()
    .min(0, "Common path must be a positive number."),
  maxDeadEnd: z.coerce
    .number()
    .min(0, "Dead end must be a positive number."),
});

interface TravelDistance {
  id: string;
  occupancyGroup: string;
  sprinklered: boolean;
  maxTravelDistance: number;
  maxCommonPath: number;
  maxDeadEnd: number;
}

interface TravelDistancesFormProps {
  onClose: () => void;
  initialData?: TravelDistance;
  onSave: (record: TravelDistance) => void;
}

export const TravelDistancesForm = ({ onClose, initialData, onSave }: TravelDistancesFormProps) => {
  const [occupancyGroupList, setOccupancyGroupList] = useState<{ id: string; code: string }[]>([]);
  const [occupancyGroups, setOccupancyGroups] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData 
      ? {
          occupancyGroupId: Object.entries(occupancyGroups).find(([id, code]) => code === initialData.occupancyGroup)?.[0] || "",
          sprinklered: initialData.sprinklered,
          maxTravelDistance: initialData.maxTravelDistance,
          maxCommonPath: initialData.maxCommonPath,
          maxDeadEnd: initialData.maxDeadEnd,
        }
      : {
          occupancyGroupId: "",
          sprinklered: false,
          maxTravelDistance: 0,
          maxCommonPath: 0,
          maxDeadEnd: 0,
        },
  });

  // Load occupancy groups
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch occupancy groups
        const groups = await fetchOccupancyGroups();
        
        // Create map for easy lookup
        const groupMap: Record<string, string> = {};
        groups.forEach(group => {
          groupMap[group.id] = group.code;
        });
        
        setOccupancyGroups(groupMap);
        setOccupancyGroupList(groups.map(g => ({ id: g.id, code: g.code })));

        // If we have initial data, set the form values
        if (initialData) {
          const occupancyGroupId = Object.entries(groupMap).find(
            ([id, code]) => code === initialData.occupancyGroup
          )?.[0];
          
          if (occupancyGroupId) {
            form.setValue('occupancyGroupId', occupancyGroupId);
          }
        }
      } catch (error) {
        console.error("Error loading occupancy groups:", error);
        toast.error("Failed to load occupancy groups");
      }
    };
    
    loadData();
  }, [form, initialData]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      // Create the record from form values
      const travelDistanceRecord: TravelDistance = {
        id: initialData?.id || crypto.randomUUID(),
        occupancyGroup: occupancyGroups[values.occupancyGroupId] || "Unknown",
        sprinklered: values.sprinklered,
        maxTravelDistance: values.maxTravelDistance,
        maxCommonPath: values.maxCommonPath,
        maxDeadEnd: values.maxDeadEnd,
      };
      
      // In a real implementation, this would save to the database
      // For now, just pass the record to the parent component
      toast.success(`${initialData ? 'Updated' : 'Added'} travel distance record`);
      onSave(travelDistanceRecord);
      onClose();
    } catch (error) {
      console.error("Error saving travel distance data:", error);
      toast.error(`Failed to ${initialData ? 'update' : 'add'} travel distance record`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialData ? 'Edit' : 'Add'} Travel Distance Record</DialogTitle>
        <DialogDescription>
          Enter maximum travel distances for egress by occupancy group and sprinkler status.
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="occupancyGroupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupancy Group</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select occupancy group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {occupancyGroupList.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sprinklered"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Sprinklered</FormLabel>
                    <FormDescription>
                      Is the building sprinklered?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Distance Limits (ft)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="maxTravelDistance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Travel Distance</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maxCommonPath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Common Path</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maxDeadEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Dead End Corridor</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : initialData ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
