
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
import { FireRatingRecord } from "../types";
import { fetchConstructionTypes } from "@/services/dataService";

// Define form validation schema
const formSchema = z.object({
  constructionTypeId: z.string({
    required_error: "Construction type is required.",
  }),
  structuralFrame: z.coerce
    .number()
    .min(0, "Hours must be a non-negative number."),
  bearingWallsExterior: z.coerce
    .number()
    .min(0, "Hours must be a non-negative number."),
  bearingWallsInterior: z.coerce
    .number()
    .min(0, "Hours must be a non-negative number."),
  nonbearingPartitions: z.coerce
    .number()
    .min(0, "Hours must be a non-negative number."),
  floorConstruction: z.coerce
    .number()
    .min(0, "Hours must be a non-negative number."),
  roofConstruction: z.coerce
    .number()
    .min(0, "Hours must be a non-negative number."),
});

interface FireRatingsFormProps {
  onClose: () => void;
  initialData?: FireRatingRecord;
  onSave: (record: FireRatingRecord) => void;
}

export const FireRatingsForm = ({ onClose, initialData, onSave }: FireRatingsFormProps) => {
  const [constructionTypeList, setConstructionTypeList] = useState<{ id: string; code: string }[]>([]);
  const [constructionTypes, setConstructionTypes] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData 
      ? {
          constructionTypeId: Object.entries(constructionTypes).find(([id, code]) => code === initialData.constructionType)?.[0] || "",
          structuralFrame: initialData.structuralFrame,
          bearingWallsExterior: initialData.bearingWallsExterior,
          bearingWallsInterior: initialData.bearingWallsInterior,
          nonbearingPartitions: initialData.nonbearingPartitions,
          floorConstruction: initialData.floorConstruction,
          roofConstruction: initialData.roofConstruction,
        }
      : {
          constructionTypeId: "",
          structuralFrame: 0,
          bearingWallsExterior: 0,
          bearingWallsInterior: 0,
          nonbearingPartitions: 0,
          floorConstruction: 0,
          roofConstruction: 0,
        },
  });

  // Load construction types
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch construction types
        const types = await fetchConstructionTypes();
        
        // Create map for easy lookup
        const typeMap: Record<string, string> = {};
        types.forEach(type => {
          typeMap[type.id] = type.code;
        });
        
        setConstructionTypes(typeMap);
        setConstructionTypeList(types.map(t => ({ id: t.id, code: t.code })));

        // If we have initial data, set the form values
        if (initialData) {
          const constructionTypeId = Object.entries(typeMap).find(
            ([id, code]) => code === initialData.constructionType
          )?.[0];
          
          if (constructionTypeId) {
            form.setValue('constructionTypeId', constructionTypeId);
          }
        }
      } catch (error) {
        console.error("Error loading construction types:", error);
        toast.error("Failed to load construction types");
      }
    };
    
    loadData();
  }, [form, initialData]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      // Create the record from form values
      const fireRatingRecord: FireRatingRecord = {
        id: initialData?.id || crypto.randomUUID(),
        constructionType: constructionTypes[values.constructionTypeId] || "Unknown",
        structuralFrame: values.structuralFrame,
        bearingWallsExterior: values.bearingWallsExterior,
        bearingWallsInterior: values.bearingWallsInterior,
        nonbearingPartitions: values.nonbearingPartitions,
        floorConstruction: values.floorConstruction,
        roofConstruction: values.roofConstruction,
        ibcTableReference: "Table 601"
      };
      
      // In a real implementation, this would save to the database
      // For now, just pass the record to the parent component
      toast.success(`${initialData ? 'Updated' : 'Added'} fire rating record`);
      onSave(fireRatingRecord);
      onClose();
    } catch (error) {
      console.error("Error saving fire rating data:", error);
      toast.error(`Failed to ${initialData ? 'update' : 'add'} fire rating record`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialData ? 'Edit' : 'Add'} Fire Rating Record</DialogTitle>
        <DialogDescription>
          Enter fire resistance ratings for building elements by construction type.
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Fire Resistance Ratings (hours)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="structuralFrame"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Structural Frame</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="0.5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bearingWallsExterior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bearing Walls (Exterior)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="0.5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bearingWallsInterior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bearing Walls (Interior)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="0.5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nonbearingPartitions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nonbearing Partitions</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="0.5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="floorConstruction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor Construction</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="0.5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="roofConstruction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roof Construction</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="0.5" />
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
