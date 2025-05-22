
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AcademicRecord } from "@/types/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";

// Define the schema for form validation
const academicRecordSchema = z.object({
  term: z.string().min(1, { message: "Please select a term." }),
  year: z.string().min(1, { message: "Please enter a year." }),
  gpa: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  status: z.enum(["completed", "in-progress", "upcoming"]),
  credits: z.string().transform(val => parseInt(val || "0")),
  totalCredits: z.string().transform(val => parseInt(val || "18")),
});

// Define the form values type for the inputs (all strings)
type AcademicRecordFormInputs = {
  term: string;
  year: string;
  gpa: string;
  status: "completed" | "in-progress" | "upcoming";
  credits: string;
  totalCredits: string;
};

interface AcademicRecordFormProps {
  record?: AcademicRecord;
  onSave: (values: AcademicRecord) => void;
  onCancel: () => void;
}

export function AcademicRecordForm({ record, onSave, onCancel }: AcademicRecordFormProps) {
  const { toast } = useToast();
  const isEditing = !!record;
  
  // Define form values with strings for all values as form inputs work with strings
  const defaultValues: AcademicRecordFormInputs = {
    term: record?.term || "",
    year: record?.year || new Date().getFullYear().toString(),
    gpa: record?.gpa !== undefined ? record.gpa.toString() : "",
    status: record?.status || "in-progress",
    credits: record?.credits !== undefined ? record.credits.toString() : "0",
    totalCredits: record?.totalCredits !== undefined ? record.totalCredits.toString() : "18",
  };

  // Use the new type with the form
  const form = useForm<AcademicRecordFormInputs>({
    resolver: zodResolver(academicRecordSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: AcademicRecordFormInputs) {
    // Convert string values to numbers for the AcademicRecord type
    const formattedRecord: AcademicRecord = {
      term: data.term,
      year: data.year,
      status: data.status,
      credits: parseInt(data.credits),
      totalCredits: parseInt(data.totalCredits),
    };
    
    // Only add gpa if it has a value
    if (data.gpa) {
      formattedRecord.gpa = parseFloat(data.gpa);
    }
    
    onSave(formattedRecord);
    
    toast({
      title: isEditing ? "Record updated" : "Record added",
      description: isEditing 
        ? "Your academic record has been updated successfully."
        : "A new academic record has been added successfully.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="term"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Term</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1st semester">1st semester</SelectItem>
                    <SelectItem value="2nd semester">2nd semester</SelectItem>
                    <SelectItem value="3rd semester">3rd semester</SelectItem>
                    <SelectItem value="4th semester">4th semester</SelectItem>
                    <SelectItem value="5th semester">5th semester</SelectItem>                                      
                    <SelectItem value="6th semester">6th semester</SelectItem>                                      
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gpa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GPA (out of 4.0)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" min="0" max="4.0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="credits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credits Earned</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="totalCredits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Credits Possible</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{isEditing ? "Update Record" : "Add Record"}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
