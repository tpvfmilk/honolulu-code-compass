
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { HeightAreaLimitData, HeightAreaLimitRecord } from "../types";
import { fetchConstructionTypes, fetchOccupancyGroups, createHeightAreaLimit, updateHeightAreaLimit } from "@/services/dataService";

// Define form validation schema
const formSchema = z.object({
  constructionTypeId: z.string({
    required_error: "Construction type is required.",
  }),
  occupancyGroupId: z.string({
    required_error: "Occupancy group is required.",
  }),
  maxHeight: z.coerce
    .number()
    .min(0, "Height must be a positive number."),
  maxStories: z.coerce
    .number()
    .min(0, "Stories must be a positive number."),
  maxAreaPerFloor: z.coerce
    .number()
    .min(0, "Area must be a positive number."),
  sprinkleredHeight: z.coerce
    .number()
    .min(0, "Sprinklered height must be a positive number.")
    .optional(),
  sprinkleredStories: z.coerce
    .number()
    .min(0, "Sprinklered stories must be a positive number.")
    .optional(),
  sprinkleredArea: z.coerce
    .number()
    .min(0, "Sprinklered area must be a positive number.")
    .optional(),
  sprinklersAllowed: z.boolean().default(true),
  notes: z.string().optional(),
});

interface HeightAreaFormProps {
  onClose: () => void;
  initialData?: HeightAreaLimitRecord;
  onSave: (record: HeightAreaLimitRecord) => void;
}

export const HeightAreaForm = ({ onClose, initialData, onSave }: HeightAreaFormProps) => {
  const [constructionTypes, setConstructionTypes] = useState<Record<string, string>>({});
  const [occupancyGroups, setOccupancyGroups] = useState<Record<string, string>>({});
  const [constructionTypeList, setConstructionTypeList] = useState<{ id: string; code: string }[]>([]);
  const [occupancyGroupList, setOccupancyGroupList] = useState<{ id: string; code: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData 
      ? {
          constructionTypeId: Object.entries(constructionTypes).find(([id, code]) => code === initialData.constructionType)?.[0] || "",
          occupancyGroupId: Object.entries(occupancyGroups).find(([id, code]) => code === initialData.occupancyGroup)?.[0] || "",
          maxHeight: initialData.maxHeight,
          maxStories: initialData.maxStories,
          maxAreaPerFloor: initialData.maxAreaPerFloor,
          sprinkleredHeight: initialData.sprinkleredHeight,
          sprinkleredStories: initialData.sprinkleredStories,
          sprinkleredArea: initialData.sprinkleredArea,
          sprinklersAllowed: initialData.sprinklersAllowed,
          notes: initialData.notes,
        }
      : {
          constructionTypeId: "",
          occupancyGroupId: "",
          maxHeight: 0,
          maxStories: 0,
          maxAreaPerFloor: 0,
          sprinkleredHeight: undefined,
          sprinkleredStories: undefined,
          sprinkleredArea: undefined,
          sprinklersAllowed: true,
          notes: "",
        },
  });

  // Load construction types and occupancy groups
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch construction types and occupancy groups
        const types = await fetchConstructionTypes();
        const groups = await fetchOccupancyGroups();
        
        // Create maps for easy lookup
        const typeMap: Record<string, string> = {};
        const groupMap: Record<string, string> = {};
        
        types.forEach(type => {
          typeMap[type.id] = type.code;
        });
        
        groups.forEach(group => {
          groupMap[group.id] = group.code;
        });
        
        setConstructionTypes(typeMap);
        setOccupancyGroups(groupMap);
        setConstructionTypeList(types.map(t => ({ id: t.id, code: t.code })));
        setOccupancyGroupList(groups.map(g => ({ id: g.id, code: g.code })));

        // If we have initial data, set the form values
        if (initialData) {
          const constructionTypeId = Object.entries(typeMap).find(
            ([id, code]) => code === initialData.constructionType
          )?.[0];
          
          const occupancyGroupId = Object.entries(groupMap).find(
            ([id, code]) => code === initialData.occupancyGroup
          )?.[0];

          if (constructionTypeId && occupancyGroupId) {
            form.setValue('constructionTypeId', constructionTypeId);
            form.setValue('occupancyGroupId', occupancyGroupId);
          }
        }
      } catch (error) {
        console.error("Error loading reference data:", error);
        toast.error("Failed to load reference data");
      }
    };
    
    loadData();
  }, [form, initialData]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      // Convert form data to the format expected by the database
      const heightAreaData: HeightAreaLimitData = {
        id: initialData?.id || "",
        construction_type_id: values.constructionTypeId,
        occupancy_group_id: values.occupancyGroupId,
        base_height_ft: values.maxHeight,
        base_stories: values.maxStories,
        base_allowable_area: values.maxAreaPerFloor,
        sprinklered_height_ft: values.sprinkleredHeight,
        sprinklered_stories: values.sprinkleredStories,
        sprinklered_area: values.sprinkleredArea,
        sprinkler_increase_allowed: values.sprinklersAllowed,
      };
      
      let result: HeightAreaLimitData | null;
      if (initialData) {
        // Update existing record
        result = await updateHeightAreaLimit(heightAreaData);
      } else {
        // Create new record
        result = await createHeightAreaLimit(heightAreaData);
      }
      
      if (result) {
        // Format the result data to match the UI record format
        const formattedData: HeightAreaLimitRecord = {
          id: result.id,
          constructionType: constructionTypes[result.construction_type_id] || "",
          occupancyGroup: occupancyGroups[result.occupancy_group_id] || "",
          maxHeight: result.base_height_ft,
          maxStories: result.base_stories,
          maxAreaPerFloor: result.base_allowable_area,
          sprinkleredHeight: result.sprinklered_height_ft,
          sprinkleredStories: result.sprinklered_stories,
          sprinkleredArea: result.sprinklered_area,
          sprinklersAllowed: result.sprinkler_increase_allowed === true,
          ibcTableReference: "Tables 504.3, 504.4, 506.2",
          notes: values.notes || ""
        };
        
        toast.success(`${initialData ? 'Updated' : 'Added'} height and area record`);
        onSave(formattedData);
        onClose();
      }
    } catch (error) {
      console.error("Error saving height and area data:", error);
      toast.error(`Failed to ${initialData ? 'update' : 'add'} height and area record`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialData ? 'Edit' : 'Add'} Height & Area Record</DialogTitle>
        <DialogDescription>
          Enter height and area limitations for the specified construction type and occupancy group.
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="constructionTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Construction Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select construction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {constructionTypeList.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.code}
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
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Base Values (No Sprinklers)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="maxHeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Height (ft)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maxStories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Stories</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maxAreaPerFloor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Area per Floor (sq ft)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Sprinklered Values</h3>
              <FormField
                control={form.control}
                name="sprinklersAllowed"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormLabel className="text-sm text-muted-foreground">Sprinklers Allowed</FormLabel>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="sprinkleredHeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sprinklered Height (ft)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0"
                        value={field.value || ''} 
                        disabled={!form.getValues().sprinklersAllowed} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sprinkleredStories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sprinklered Stories</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0" 
                        value={field.value || ''} 
                        disabled={!form.getValues().sprinklersAllowed} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sprinkleredArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sprinklered Area (sq ft)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0" 
                        value={field.value || ''} 
                        disabled={!form.getValues().sprinklersAllowed} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
