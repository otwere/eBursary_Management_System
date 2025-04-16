
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentName: string;
  documentType: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  documentUrl,
  documentName,
  documentType,
}) => {
  const [scale, setScale] = useState(1);
  
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };
  
  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };
  
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = documentUrl;
    link.download = documentName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const renderDocument = () => {
    const fileExtension = documentName.split('.').pop()?.toLowerCase() || '';
    
    if (documentType === "image" || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
      return (
        <div className="flex justify-center">
          <img 
            src={documentUrl} 
            alt={documentName}
            style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
            className="max-w-full max-h-[70vh] object-contain transition-transform duration-200"
          />
        </div>
      );
    } else if (documentType === "pdf" || fileExtension === 'pdf') {
      return (
        <iframe 
          src={`${documentUrl}#view=FitH`}
          title={documentName}
          className="w-full h-[70vh] border-0"
        />
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-[40vh]">
          <div className="p-8 bg-gray-100 rounded-lg mb-4">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <p className="text-gray-700">Preview not available for this file type</p>
          <Button onClick={handleDownload} className="mt-4">
            <Download className="mr-2 h-4 w-4" />
            Download to view
          </Button>
        </div>
      );
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="truncate max-w-[80%]">{documentName}</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={zoomOut} className="h-8 w-8">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={zoomIn} className="h-8 w-8">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-2 bg-gray-50 rounded-md overflow-auto">
          {renderDocument()}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
