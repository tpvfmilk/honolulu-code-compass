
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LoadFactorRecord } from "../types";
import { fetchOccupancyGroups } from "@/services/dataService";

// Define form validation schema
const formSchema = z.object({
  occupancyGroupId: z.string({
    required_error: "Occupancy group is required.",
  }),
  spaceType: z.string().min(1, "Space type is required."),
  loadFactor: z.coerce
    .number()
    .min(0, "Load factor must be a positive number."),
  description: z.string().optional(),
});

interface LoadFactorsFormProps {
  onClose: () => void;
  initialData?: LoadFactorRecord;
  onSave: (record: LoadFactorRecord) => void;
}

export const LoadFactorsForm = ({ onClose, initialData, onSave }: LoadFactorsFormProps) => {
  const [occupancyGroupList, setOccupancyGroupList] = useState<{ id: string; code: string }[]>([]);
  const [occupancyGroups, setOccupancyGroups] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData 
      ? {
          occupancyGroupId: Object.entries(occupancyGroups).find(([id, code]) => code === initialData.occupancyGroup)?.[0] || "",
          spaceType: initialData.spaceType,
          loadFactor: initialData.loadFactor,
          description: initialData.description,
        }
      : {
          occupancyGroupId: "",
          spaceType: "",
          loadFactor: 0,
          description: "",
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
      const loadFactorRecord: LoadFactorRecord = {
        id: initialData?.id || crypto.randomUUID(),
        occupancyGroup: occupancyGroups[values.occupancyGroupId] || "Unknown",
        spaceType: values.spaceType,
        loadFactor: values.loadFactor,
        description: values.description || "",
        ibcTableReference: "Table 1004.5"
      };
      
      // In a real implementation, this would save to the database
      // For now, just pass the record to the parent component
      toast.success(`${initialData ? 'Updated' : 'Added'} load factor record`);
      onSave(loadFactorRecord);
      onClose();
    } catch (error) {
      console.error("Error saving load factor data:", error);
      toast.error(`Failed to ${initialData ? 'update' : 'add'} load factor record`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialData ? 'Edit' : 'Add'} Occupant Load Factor</DialogTitle>
        <DialogDescription>
          Enter space occupancy load factors for calculating maximum occupant loads.
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
              name="spaceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Space Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="loadFactor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Load Factor (sq ft per person)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="0" />
                </FormControl>
                <FormDescription>
                  Enter 0 for areas that don't use square footage (like fixed seating).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} />
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
