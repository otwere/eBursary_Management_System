import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { StudentDocument, DocumentStatus } from "@/types/auth";
import { AlertCircle, Check, X, FileText, Download, Eye, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface DocumentItem {
  id: string;
  name: string;
  required: boolean;
  submitted: boolean;
}

interface DocumentVerificationChecklistProps {
  applicationId: string;
  documents: StudentDocument[];
  requiredDocuments: DocumentItem[];
  onVerifyDocuments: (results: {
    applicationId: string;
    verifiedDocuments: Array<{ id: string; status: DocumentStatus }>;
  }) => void;
  onRequestDocuments: (missingDocuments: string[]) => void;
}

const DocumentVerificationChecklist: React.FC<DocumentVerificationChecklistProps> = ({
  applicationId,
  documents,
  requiredDocuments,
  onVerifyDocuments,
  onRequestDocuments
}) => {
  // Create a map from submitted documents
  const submittedDocumentsMap = documents.reduce((map, doc) => {
    map.set(doc.id, doc);
    return map;
  }, new Map<string, StudentDocument>());

  // Map required documents to include verification status
  const [verificationStatus, setVerificationStatus] = useState<
    Array<{ id: string; isVerified: boolean; isRejected: boolean; status: DocumentStatus }>
  >(
    requiredDocuments.map(req => {
      const doc = submittedDocumentsMap.get(req.id);
      return {
        id: req.id,
        isVerified: doc?.status === 'approved' || doc?.status === 'verified',
        isRejected: doc?.status === 'rejected',
        status: doc?.status || 'pending'
      };
    })
  );

  // Track missing documents
  const missingDocuments = requiredDocuments
    .filter(req => req.required && !submittedDocumentsMap.has(req.id))
    .map(doc => doc.name);

  // Handle viewing document
  const handleViewDocument = (documentUrl: string) => {
    // Check if running in a browser environment
    if (typeof window !== 'undefined' && window.document) {
      window.open(documentUrl, '_blank');
    }
  };

  // Handle downloading document
  const handleDownloadDocument = (document: StudentDocument) => {
    if (typeof window !== 'undefined' && window.document) {
      const link = window.document.createElement('a');
      link.href = document.url;
      link.download = document.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      toast.success(`${document.name} downloaded successfully`);
    }
  };

  // Toggle document verification
  const handleToggleVerification = (id: string, type: 'verify' | 'reject') => {
    setVerificationStatus(prev =>
      prev.map(doc => {
        if (doc.id === id) {
          if (type === 'verify') {
            return {
              ...doc,
              isVerified: !doc.isVerified,
              isRejected: false,
              status: !doc.isVerified ? 'verified' : 'pending'
            };
          } else {
            return {
              ...doc,
              isRejected: !doc.isRejected,
              isVerified: false,
              status: !doc.isRejected ? 'rejected' : 'pending'
            };
          }
        }
        return doc;
      })
    );
  };

  // Submit verification results
  const handleSubmitVerification = () => {
    const verifiedDocuments = verificationStatus.map(doc => ({
      id: doc.id,
      status: doc.status
    }));

    onVerifyDocuments({
      applicationId,
      verifiedDocuments
    });
  };

  // Request missing documents
  const handleRequestMissing = () => {
    onRequestDocuments(missingDocuments.map(name => name));
  };

  return (
    <div className="space-y-6">
      {/* Missing Documents Alert */}
      {missingDocuments.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Missing Required Documents</h3>
                <p className="text-sm text-amber-700 mt-1">
                  The following required documents are missing:
                </p>
                <ul className="list-disc list-inside mt-2 text-sm space-y-1 text-amber-700">
                  {missingDocuments.map((doc, index) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-amber-100 border-amber-200 text-amber-800 hover:bg-amber-200"
              onClick={handleRequestMissing}
            >
              Request Missing Documents
            </Button>
          </div>
        </div>
      )}

      {/* Document Verification Table */}
      <div className="overflow-x-auto rounded border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium text-sm">Document</th>
              <th className="text-center p-3 font-medium text-sm">Required</th>
              <th className="text-center p-3 font-medium text-sm">Status</th>
              <th className="text-center p-3 font-medium text-sm">Actions</th>
              <th className="text-right p-3 font-medium text-sm">Verify</th>
            </tr>
          </thead>
          <tbody>
            {requiredDocuments.map((doc, index) => {
              const submittedDoc = submittedDocumentsMap.get(doc.id);
              const verifyStatus = verificationStatus.find(v => v.id === doc.id);
              
              return (
                <tr key={index} className="border-t hover:bg-muted/50">
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span>{doc.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    {doc.required ? (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Required</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">Optional</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {submittedDoc ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        verifyStatus?.isVerified
                          ? "bg-green-100 text-green-700"
                          : verifyStatus?.isRejected
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {verifyStatus?.isVerified
                          ? "Verified"
                          : verifyStatus?.isRejected
                          ? "Rejected"
                          : "Pending"}
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">Not Submitted</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {submittedDoc && (
                      <div className="flex justify-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-blue-600"
                          onClick={() => handleViewDocument(submittedDoc.url)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-blue-600"
                          onClick={() => handleDownloadDocument(submittedDoc)}
                        >
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {submittedDoc && (
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`h-7 px-2 ${
                            verifyStatus?.isVerified
                              ? "bg-green-100 border-green-200 text-green-700 hover:bg-green-200"
                              : ""
                          }`}
                          onClick={() => handleToggleVerification(doc.id, 'verify')}
                        >
                          <Check className={`h-3.5 w-3.5 ${verifyStatus?.isVerified ? "text-green-700" : "text-gray-400"} mr-1`} />
                          {verifyStatus?.isVerified ? "Verified" : "Verify"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`h-7 px-2 ${
                            verifyStatus?.isRejected
                              ? "bg-red-100 border-red-200 text-red-700 hover:bg-red-200"
                              : ""
                          }`}
                          onClick={() => handleToggleVerification(doc.id, 'reject')}
                        >
                          <X className={`h-3.5 w-3.5 ${verifyStatus?.isRejected ? "text-red-700" : "text-gray-400"} mr-1`} />
                          {verifyStatus?.isRejected ? "Rejected" : "Reject"}
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={() => {
            // Reset verification status
            setVerificationStatus(
              requiredDocuments.map(req => {
                const doc = submittedDocumentsMap.get(req.id);
                return {
                  id: req.id,
                  isVerified: false,
                  isRejected: false,
                  status: doc?.status || 'pending'
                };
              })
            );
          }}
        >
          Reset
        </Button>
        <Button onClick={handleSubmitVerification}>
          Complete Verification
        </Button>
      </div>
    </div>
  );
};

export default DocumentVerificationChecklist;
