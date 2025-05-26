
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload, X, CheckCircle, AlertCircle } from "lucide-react";

interface FileUploadProps {
  label: string;
  description?: string;
  onChange: (file: File | null) => void;
  required?: boolean;
  accept?: string;
  value?: File | null;
  error?: string;
  id?: string; // Added id prop
  onFileChange?: (file: File | null) => void; // Added for backward compatibility
  acceptedFileTypes?: string[]; // Added for backward compatibility
  maxSizeMB?: number; // Added for backward compatibility
  multiple?: boolean; // Added for backward compatibility
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  description,
  onChange,
  required = false,
  accept = ".pdf,.jpg,.jpeg,.png",
  value,
  error,
  id,
  onFileChange,
  acceptedFileTypes,
  maxSizeMB,
  multiple = false
}) => {
  const [file, setFile] = useState<File | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Use acceptedFileTypes to form accept string if provided
  const acceptString = acceptedFileTypes ? acceptedFileTypes.join(',') : accept;

  React.useEffect(() => {
    if (value && value !== file) {
      setFile(value);
    }
  }, [value]);

  React.useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (selectedFile) {
      // Check file size if maxSizeMB is provided
      if (maxSizeMB && selectedFile.size > maxSizeMB * 1024 * 1024) {
        // Handle file too large error
        if (error) {
          console.error(`File too large. Maximum size is ${maxSizeMB}MB`);
        }
        return;
      }
      
      setUploading(true);
      setProgress(0);
      
      // Simulate upload progress for demo purposes
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 10;
          if (next >= 100) {
            clearInterval(interval);
            setUploading(false);
            setFile(selectedFile);
            
            // Call both onChange and onFileChange for compatibility
            onChange(selectedFile);
            if (onFileChange) onFileChange(selectedFile);
            
            return 100;
          }
          return next;
        });
      }, 200);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    onChange(null);
    if (onFileChange) onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const inputId = id || `file-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </div>
        {file && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleRemoveFile}
            className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4 mr-1" /> Remove
          </Button>
        )}
      </div>
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      {error && (
        <div className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}
      
      {!file ? (
        <div className="grid w-full items-center">
          <Input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={acceptString}
            onChange={handleFileChange}
            className="hidden"
            multiple={multiple}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed border-2 p-4 flex flex-col items-center justify-center gap-2 hover:bg-primary-50 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-6 w-6 text-primary-400" />
            <span className="font-normal text-muted-foreground">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-muted-foreground">
              {acceptString.split(',').join(', ')}
            </span>
          </Button>
        </div>
      ) : uploading ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary-600 font-medium">{file.name}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      ) : (
        <div className="rounded border overflow-hidden">
          <div className="flex items-center p-3 bg-primary-50 gap-3 border-b">
            <FileText className="h-5 w-5 text-primary-500" />
            <span className="text-sm font-medium flex-1 truncate">{file.name}</span>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          
          {previewUrl && (
            <div className="max-h-40 overflow-hidden flex justify-center bg-gray-100 border-b">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-40 max-w-full object-contain" 
              />
            </div>
          )}
          
          <div className="p-2 text-xs text-gray-500 flex items-center gap-1">
            <span>{(file.size / 1024).toFixed(1)} KB</span>
            <span className="px-1">•</span>
            <span>{file.type || "Unknown type"}</span>
          </div>
        </div>
      )}
    </div>
  );
};
