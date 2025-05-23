import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Calendar, Upload, File, FileText, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const documentSchema = z.object({
  name: z.string().min(2, { message: "Document name must be at least 2 characters." }),
  type: z.enum([
    "transcript", 
    "id", 
    "certificate", 
    "verification", 
    "financial", 
    "recommendation", 
    "other"
  ]),
  description: z.string().max(200, { message: "Description must not exceed 200 characters." }).optional(),
  issuedBy: z.string().optional(),
  expiryDate: z.date().optional(),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

interface DocumentUploadFormProps {
  onUpload: (values: DocumentFormValues, file: File | null) => void;
  onCancel: () => void;
}

export function DocumentUploadForm({ onUpload, onCancel }: DocumentUploadFormProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: "",
      type: "transcript",
      description: "",
      issuedBy: "",
    },
    mode: "onChange",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError(null);
    
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File size exceeds 5MB limit");
        setSelectedFile(null);
        return;
      }
      
      // Validate file type (PDF, images, doc)
      const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!acceptedTypes.includes(file.type)) {
        setFileError("File type not supported. Please upload PDF, image, or Word document");
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
    }
  };

  function onSubmit(data: DocumentFormValues) {
    if (!selectedFile) {
      setFileError("Please select a file to upload");
      return;
    }
    
    onUpload(data, selectedFile);
    
    toast({
      title: "Document uploaded",
      description: "Your document has been successfully uploaded.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-4xl mx-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Academic Transcript 2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="transcript">Academic Transcript</SelectItem>
                  <SelectItem value="id">ID Document</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="verification">Verification Document</SelectItem>
                  <SelectItem value="financial">Financial Document</SelectItem>
                  <SelectItem value="recommendation">Recommendation Letter</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="issuedBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issued By</FormLabel>
              <FormControl>
                <Input placeholder="e.g., University Registration Office" {...field} />
              </FormControl>
              <FormDescription>
                The institution or office that issued this document
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiry Date (if applicable)</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : undefined;
                      field.onChange(date);
                    }}
                  />
                </FormControl>
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <FormDescription>
                Leave blank if the document has no expiry date
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
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief description of the document" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel>File Upload</FormLabel>
          <div className="border border-dashed rounded-md p-4 bg-muted/30">
            <div className="flex flex-col items-center justify-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Drag and drop your file here or click to browse</p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, images, and Word documents (max 5MB)
              </p>
              <Input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Button 
                type="button"
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Select File
              </Button>
            </div>
            
            {selectedFile && (
              <div className="mt-4 p-3 border rounded-md bg-blue-50">
                <div className="flex items-center gap-2">
                  {selectedFile.type.includes("pdf") ? (
                    <File className="h-5 w-5 text-blue-500" />
                  ) : selectedFile.type.includes("image") ? (
                    <File className="h-5 w-5 text-green-500" />
                  ) : (
                    <FileText className="h-5 w-5 text-purple-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
            
            {fileError && (
              <div className={cn(
                "mt-2 p-2 rounded-md flex items-start gap-2",
                "bg-destructive/10 text-sm text-destructive"
              )}>
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{fileError}</span>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Upload Document</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
