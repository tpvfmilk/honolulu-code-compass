
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { fetchOccupancyGroups } from "@/services/dataService";

// Define form validation schema
const formSchema = z.object({
  fromOccupancyId: z.string({
    required_error: "From occupancy is required.",
  }),
  toOccupancyId: z.string({
    required_error: "To occupancy is required.",
  }),
  ratingHours: z.coerce
    .number()
    .min(0, "Rating hours must be a positive number."),
});

interface OccupancySeparation {
  id: string;
  fromOccupancy: string;
  toOccupancy: string;
  ratingHours: number;
}

interface OccupancySeparationsFormProps {
  onClose: () => void;
  initialData?: OccupancySeparation;
  onSave: (record: OccupancySeparation) => void;
}

export const OccupancySeparationsForm = ({ onClose, initialData, onSave }: OccupancySeparationsFormProps) => {
  const [occupancyGroupList, setOccupancyGroupList] = useState<{ id: string; code: string }[]>([]);
  const [occupancyGroups, setOccupancyGroups] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData 
      ? {
          fromOccupancyId: Object.entries(occupancyGroups).find(([id, code]) => code === initialData.fromOccupancy)?.[0] || "",
          toOccupancyId: Object.entries(occupancyGroups).find(([id, code]) => code === initialData.toOccupancy)?.[0] || "",
          ratingHours: initialData.ratingHours,
        }
      : {
          fromOccupancyId: "",
          toOccupancyId: "",
          ratingHours: 0,
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
          const fromOccupancyId = Object.entries(groupMap).find(
            ([id, code]) => code === initialData.fromOccupancy
          )?.[0];
          
          const toOccupancyId = Object.entries(groupMap).find(
            ([id, code]) => code === initialData.toOccupancy
          )?.[0];
          
          if (fromOccupancyId && toOccupancyId) {
            form.setValue('fromOccupancyId', fromOccupancyId);
            form.setValue('toOccupancyId', toOccupancyId);
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
      const separationRecord: OccupancySeparation = {
        id: initialData?.id || crypto.randomUUID(),
        fromOccupancy: occupancyGroups[values.fromOccupancyId] || "Unknown",
        toOccupancy: occupancyGroups[values.toOccupancyId] || "Unknown",
        ratingHours: values.ratingHours,
      };
      
      // In a real implementation, this would save to the database
      // For now, just pass the record to the parent component
      toast.success(`${initialData ? 'Updated' : 'Added'} occupancy separation record`);
      onSave(separationRecord);
      onClose();
    } catch (error) {
      console.error("Error saving occupancy separation data:", error);
      toast.error(`Failed to ${initialData ? 'update' : 'add'} occupancy separation record`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialData ? 'Edit' : 'Add'} Occupancy Separation Record</DialogTitle>
        <DialogDescription>
          Enter required fire separation rating between different occupancy groups.
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fromOccupancyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Occupancy</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select from occupancy" />
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
              name="toOccupancyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Occupancy</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select to occupancy" />
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
          </div>

          <FormField
            control={form.control}
            name="ratingHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Required Rating (hours)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="0" step="0.5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
