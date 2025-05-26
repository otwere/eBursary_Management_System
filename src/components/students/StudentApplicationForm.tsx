import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FileUpload } from "@/components/students/FileUpload";
import { ApplicationProgress } from "@/components/students/ApplicationProgress";
import OTPVerification from "@/components/auth/OtpVerification";
import { InstitutionType } from "@/types/auth";
import { 
  ArrowLeft, ArrowRight, Save, Send, BookOpen, Users, DollarSign, 
  FileText, FileCheck, CheckCircle, AlertCircle, School, Briefcase, 
  Upload, Info, GraduationCap, Calendar, Landmark, BadgeHelp, X,
  Home, UserCircle, Clock, Phone, Mail, Building, Coins, BanknoteIcon,
  FileQuestion, FilePlus, FileX, ShieldCheck, Shield, CalendarClock
} from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// More comprehensive validation schema
const formSchema = z.object({
  institutionName: z.string().min(2, {
    message: "Institution name must be at least 2 characters.",
  }),
  courseOfStudy: z.string().min(2, {
    message: "Course of study must be at least 2 characters.",
  }),
  yearOfStudy: z.string().min(1, {
    message: "Year of study is required.",
  }),
  tuitionFee: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Tuition fee must be a positive number.",
  }),
  otherScholarships: z.string().optional(),
  requestedAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Requested amount must be a positive number.",
  }),
  
  // Enhanced family validation
  parentName: z.string().min(2, {
    message: "Parent/Guardian name must be at least 2 characters.",
  }),
  relationship: z.string().min(2, {
    message: "Relationship must be at least 2 characters.",
  }),
  parentOccupation: z.string().min(2, {
    message: "Occupation must be at least 2 characters.",
  }),
  monthlyIncome: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Monthly income must be a number.",
  }),
  dependents: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Number of dependents must be a number.",
  }),
  familyType: z.enum(["bothParents", "partialOrphan", "totalOrphan", "guardian"]),
  isUnder18: z.boolean().default(false),
  secondParentName: z.string().optional(),
  secondParentOccupation: z.string().optional(),
  secondParentContact: z.string().optional(),
  parentEmail: z.string().email("Invalid email address").optional(),
  parentPhone: z.string().optional(),
  homeAddress: z.string().optional(),
  countyOfResidence: z.string().optional(),
  familySituation: z.string().optional(),
  guardianName: z.string().optional(),
  guardianRelationship: z.string().optional(),
  guardianOccupation: z.string().optional(),
  guardianEmail: z.string().email("Invalid email address").optional(),
  guardianPhone: z.string().optional(),
  guardianContactVerified: z.boolean().default(false),
  
  // Enhanced documents validation
  documents: z.object({
    idDocument: z.any().optional(),
    academicRecords: z.any().optional(),
    feeStructure: z.any().optional(),
    parentId: z.any().optional(),
    parentIncomeProof: z.any().optional(),
    guardianProof: z.any().optional(),
    orphanCertificate: z.any().optional(),
    proofOfFinancialNeed: z.any().optional(),
    additionalDocuments: z.any().optional(),
  }).optional(),
  
  // Enhanced review section
  personalStatement: z.string().min(100, {
    message: "Personal statement must be at least 100 characters.",
  }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
  privacyAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the privacy policy.",
  }),
  declarationAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the declaration of truthfulness.",
  }),
  academicDate: z.string().optional(),
  registrationNumber: z.string().optional(),
  educationalBackground: z.string().optional(),
  gpa: z.string().optional(),
  expectedGraduation: z.string().optional(),
  extracurricular: z.string().optional(),
});

interface StudentApplicationFormProps {
  institutionType: InstitutionType;
  institutionName: string;
  onSave: (data: any, status: "draft" | "submitted") => void;
  onCancel: () => void;
  initialValues?: any;
  currentStep?: string;
  onStepChange?: (step: string) => void;
  isSubmitting?: boolean;
}

const StudentApplicationForm: React.FC<StudentApplicationFormProps> = ({
  institutionType,
  institutionName,
  onSave,
  onCancel,
  initialValues,
  currentStep = "academic",
  onStepChange,
  isSubmitting = false,
}) => {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [guardianEmail, setGuardianEmail] = useState("");
  const [isOpenCollapsible, setIsOpenCollapsible] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  
  // Define the steps with enhanced descriptions
  const steps = [
    { 
      id: "academic", 
      label: "Academic", 
      icon: <BookOpen className="h-4 w-4" />,
      description: "Education details" 
    },
    { 
      id: "financial", 
      label: "Financial", 
      icon: <DollarSign className="h-4 w-4" />,
      description: "Fees & requests" 
    },
    { 
      id: "family", 
      label: "Family", 
      icon: <Users className="h-4 w-4" />,
      description: "Guardian details" 
    },
    { 
      id: "documents", 
      label: "Documents", 
      icon: <FileText className="h-4 w-4" />,
      description: "Required uploads" 
    },
    { 
      id: "review", 
      label: "Review", 
      icon: <CheckCircle className="h-4 w-4" />,
      description: "Submit application" 
    },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      institutionName: institutionName || "",
      courseOfStudy: "",
      yearOfStudy: "",
      tuitionFee: "",
      otherScholarships: "",
      requestedAmount: "",
      parentName: "",
      relationship: "",
      parentOccupation: "",
      monthlyIncome: "",
      dependents: "",
      familyType: "bothParents",
      isUnder18: false,
      secondParentName: "",
      secondParentOccupation: "",
      secondParentContact: "",
      parentEmail: "",
      parentPhone: "",
      homeAddress: "",
      countyOfResidence: "",
      familySituation: "",
      guardianName: "",
      guardianRelationship: "",
      guardianOccupation: "",
      guardianEmail: "",
      guardianPhone: "",
      guardianContactVerified: false,
      documents: {},
      personalStatement: "",
      termsAccepted: false,
      privacyAccepted: false,
      declarationAccepted: false,
      academicDate: "",
      registrationNumber: "",
      educationalBackground: "",
      gpa: "",
      expectedGraduation: "",
      extracurricular: "",
    },
  });

  const watchFamilyType = form.watch("familyType");
  const watchIsUnder18 = form.watch("isUnder18");

  // Calculate form progress
  useEffect(() => {
    const values = form.getValues();
    let fieldsCompleted = 0;
    let totalFields = 0;
    
    Object.keys(values).forEach(key => {
      // Skip documents and optional fields for simple calculation
      if (key !== 'documents' && key !== 'termsAccepted' && 
          !key.startsWith('second') && !key.startsWith('guardian') && 
          key !== 'isUnder18' && key !== 'otherScholarships' &&
          key !== 'academicDate' && key !== 'educationalBackground' && 
          key !== 'gpa' && key !== 'expectedGraduation' && 
          key !== 'extracurricular') {
        totalFields++;
        // @ts-ignore
        if (values[key] && values[key].length > 0) {
          fieldsCompleted++;
        }
      }
    });
    
    const docsValues = values.documents || {};
    // Add document fields to progress calculation
    Object.keys(docsValues).forEach(key => {
      totalFields++;
      // @ts-ignore
      if (docsValues[key]) {
        fieldsCompleted++;
      }
    });
    
    // Calculate percentage
    const progressPercentage = Math.floor((fieldsCompleted / totalFields) * 100);
    setFormProgress(progressPercentage);
  }, [form.formState.dirtyFields]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (form.formState.isDirty) {
        setAutoSaveStatus("saving");
        
        setTimeout(() => {
          const currentData = form.getValues();
          localStorage.setItem('bursary-form-draft', JSON.stringify(currentData));
          setAutoSaveStatus("saved");
          
          // Reset to idle after 2 seconds
          setTimeout(() => {
            setAutoSaveStatus("idle");
          }, 2000);
        }, 1000);
      }
    }, 30000); // Auto-save every 30 seconds if form is dirty
    
    return () => clearInterval(autoSaveInterval);
  }, [form.formState.isDirty]);

  // Load saved draft from localStorage on initial mount
  useEffect(() => {
    if (!initialValues) {
      const savedDraft = localStorage.getItem('bursary-form-draft');
      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          Object.keys(parsedDraft).forEach(key => {
            form.setValue(key as any, parsedDraft[key]);
          });
          toast.info("Draft application loaded", {
            description: "Your previous progress has been restored"
          });
        } catch (error) {
          console.error("Failed to parse saved draft", error);
        }
      }
    }
  }, []);

  const handleStepChange = (step: string) => {
    setActiveStep(step);
    if (onStepChange) {
      onStepChange(step);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>, status: "draft" | "submitted") {
    // Check if guardian verification is required but not completed
    if (watchIsUnder18 && !form.getValues("guardianContactVerified") && status === "submitted") {
      toast.error("Guardian contact verification is required for students under 18");
      return;
    }
    
    // Clear local storage after successful submission
    if (status === "submitted") {
      localStorage.removeItem('bursary-form-draft');
    }
    
    onSave(values, status);
  }

  const yearOptions = institutionType === "Secondary" 
    ? ["Form 1", "Form 2", "Form 3", "Form 4"] 
    : institutionType === "TVET" 
      ? ["Year 1", "Year 2", "Year 3"] 
      : ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];
      
  const goToNextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === activeStep);
    if (currentIndex < steps.length - 1) {
      handleStepChange(steps[currentIndex + 1].id);
    }
  };
  
  const goToPreviousStep = () => {
    const currentIndex = steps.findIndex(step => step.id === activeStep);
    if (currentIndex > 0) {
      handleStepChange(steps[currentIndex - 1].id);
    }
  };
  
  const validateCurrentStep = async () => {
    let fieldsToValidate: string[] = [];
    
    switch (activeStep) {
      case 'academic':
        fieldsToValidate = ['institutionName', 'courseOfStudy', 'yearOfStudy'];
        break;
      case 'financial':
        fieldsToValidate = ['tuitionFee', 'requestedAmount'];
        break;
      case 'family':
        fieldsToValidate = ['familyType', 'isUnder18', 'parentName', 'relationship', 'parentOccupation', 'monthlyIncome', 'dependents'];
        // Add conditional validation based on family type
        if (watchFamilyType === 'bothParents') {
          fieldsToValidate.push('secondParentName', 'secondParentOccupation');
        } else if (watchIsUnder18 && (watchFamilyType === 'partialOrphan' || watchFamilyType === 'totalOrphan' || watchFamilyType === 'guardian')) {
          fieldsToValidate.push('guardianName', 'guardianRelationship', 'guardianOccupation');
        }
        break;
      case 'documents':
        // For documents, we're not validating any specific form fields
        return true;
      case 'review':
        fieldsToValidate = ['personalStatement', 'termsAccepted'];
        break;
    }
    
    const result = await form.trigger(fieldsToValidate as any);
    return result;
  };
  
  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      goToNextStep();
    } else {
      toast.error("Please fix the errors before proceeding");
    }
  };

  const handleVerifyGuardian = () => {
    const guardianEmail = form.getValues("guardianName").toLowerCase().replace(/\s/g, '') + '@example.com';
    setGuardianEmail(guardianEmail);
    setShowOtpVerification(true);
  };

  const handleOtpVerified = () => {
    setShowOtpVerification(false);
    form.setValue("guardianContactVerified", true);
    toast.success("Guardian contact verified successfully!");
  };

  const handleOtpBack = () => {
    setShowOtpVerification(false);
  };

  const handleManualSave = () => {
    setAutoSaveStatus("saving");
    
    setTimeout(() => {
      const currentData = form.getValues();
      localStorage.setItem('bursary-form-draft', JSON.stringify(currentData));
      setAutoSaveStatus("saved");
      toast.success("Application progress saved");
      
      // Reset to idle after 2 seconds
      setTimeout(() => {
        setAutoSaveStatus("idle");
      }, 2000);
    }, 800);
  };

  return (
    <>
      <Card className="max-w-4xl mx-auto shadow-md border-primary/10 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b relative">
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs gap-1 bg-white"
              onClick={() => setShowHelpDialog(true)}
            >
              <BadgeHelp className="h-3.5 w-3.5" />
              Help
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs gap-1 bg-white" 
              onClick={handleManualSave}
            >
              <Save className="h-3.5 w-3.5" />
              {autoSaveStatus === "saving" 
                ? "Saving..."
                : autoSaveStatus === "saved"
                ? "Saved"
                : "Save"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs text-destructive gap-1 hover:bg-destructive/10 bg-white" 
              onClick={() => setShowExitDialog(true)}
            >
              <X className="h-3.5 w-3.5" />
              Exit
            </Button>
          </div>
          
          <CardTitle className="text-primary-600 flex items-center gap-2">
            <School className="h-5 w-5" />
            Bursary Application Form
          </CardTitle>
          <CardDescription className="text-gray-600">
            Complete all required fields for your Bursary Application. Your progress is automatically saved.
          </CardDescription>

          {/* Progress bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Application progress</span>
              <span>{formProgress}% complete</span>
            </div>
            <Progress value={formProgress} className="h-2" />
          </div>
        </CardHeader>

        {showOtpVerification ? (
          <CardContent className="pt-6">
            <div className="bg-blue-50 p-4 rounded border border-blue-100">
              <OTPVerification 
                email={guardianEmail}
                onVerify={handleOtpVerified}
                onBack={handleOtpBack}
              />
            </div>
          </CardContent>
        ) : (
          <>
            <CardContent className="pt-6">
              {/* Step indicator */}
              <ApplicationProgress 
                steps={steps} 
                currentStep={activeStep} 
                onChange={handleStepChange}
                className="mb-6"
              />
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit((values) => onSubmit(values, "submitted"))}>
                  <Tabs value={activeStep} onValueChange={handleStepChange} className="w-full">
                    <TabsContent value="academic" className="mt-0">
                      <div className="bg-blue-50/50 p-4 rounded border border-blue-100">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-primary-500" />
                          Academic Information
                        </h3>
                        
                        <div className="bg-white p-4 rounded border border-gray-200 mb-6">
                          <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                            <Landmark className="h-4 w-4 text-gray-500" />
                            Institution Details
                          </h4>
                          <div className="grid gap-4 md:grid-cols-2">
                            <FormItem>
                              <FormLabel>Institution Type</FormLabel>
                              <FormControl>
                                <Input 
                                  value={institutionType} 
                                  disabled
                                  className="bg-gray-50"
                                />
                              </FormControl>
                            </FormItem>

                            <FormField
                              control={form.control}
                              name="institutionName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Institution Name *</FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field}
                                      value={institutionName || field.value}
                                      disabled={!!institutionName}
                                      className={institutionName ? "bg-gray-50" : ""}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="registrationNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Registration/Student Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your student ID" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="academicDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Academic Year</FormLabel>
                                  <FormControl>
                                    <Input type="text" placeholder="e.g. 2025-2026" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded border border-gray-200 mb-6">
                          <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-gray-500" />
                            Course Details
                          </h4>
                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="courseOfStudy"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Course of Study *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your course or program" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="yearOfStudy"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Year of Study *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select your year of study" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {yearOptions.map((year) => (
                                        <SelectItem key={year} value={year}>
                                          {year}
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
                              name="expectedGraduation"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Expected Graduation</FormLabel>
                                  <FormControl>
                                    <Input type="text" placeholder="e.g. December 2027" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="gpa"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current GPA/Grade Average</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. 3.5 or B+" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Collapsible 
                          open={isOpenCollapsible} 
                          onOpenChange={setIsOpenCollapsible}
                          className="bg-white p-4 rounded border border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              Additional Academic Information
                            </h4>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm">
                                {isOpenCollapsible ? "Hide" : "Show"}
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent className="mt-4 space-y-4 animate-accordion-down">
                            <FormField
                              control={form.control}
                              name="educationalBackground"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Educational Background</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Briefly describe your previous educational background..."
                                      className="min-h-[100px] resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Include any notable academic achievements or previous institutions attended.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="extracurricular"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Extracurricular Activities & Leadership Roles</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="List any clubs, sports, volunteer work, or leadership positions..."
                                      className="min-h-[100px] resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    This information helps us understand your broader contributions and character.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CollapsibleContent>
                        </Collapsible>
                        
                        <div className="mt-6 flex justify-end">
                          <Button type="button" onClick={handleNext} className="bg-primary hover:bg-primary/90">
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="financial" className="mt-0">
                      <div className="bg-blue-50/50 p-4 rounded border border-blue-100">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-primary-500" />
                          Financial Information
                        </h3>
                        
                        <div className="bg-white p-4 rounded border border-gray-200 mb-6">
                          <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            Education Costs
                          </h4>
                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="tuitionFee"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Total Tuition Fee (KES) *</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <span className="absolute left-3 top-2.5 text-gray-500">KES</span>
                                      <Input type="number" className="pl-10" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="otherScholarships"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Other Scholarships/Funding (KES)</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <span className="absolute left-3 top-2.5 text-gray-500">KES</span>
                                      <Input type="number" className="pl-10" placeholder="0" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormDescription>
                                    Leave blank if none
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="requestedAmount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Requested Amount (KES) *</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <span className="absolute left-3 top-2.5 text-gray-500">KES</span>
                                      <Input type="number" className="pl-10" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormDescription>
                                    Amount should not exceed your tuition fees
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 p-4 rounded border border-yellow-200 flex items-start gap-3 mb-6">
                          <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-yellow-800">
                            <p className="font-medium mb-1">Important Financial Guidelines</p>
                            <ul className="list-disc ml-4 space-y-1">
                              <li>The maximum bursary amount per student is KES 70,000 per Academic Year</li>
                              <li>All financial information provided must be verifiable through documentation</li>
                              <li>False declarations will result in immediate disqualification</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex justify-between">
                          <Button type="button" variant="outline" onClick={goToPreviousStep}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                          </Button>
                          <Button type="button" onClick={handleNext} className="bg-primary hover:bg-primary/90">
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="family" className="mt-0">
                      <div className="bg-blue-50/50 p-4 rounded border border-blue-100">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary-500" />
                          Family Information
                        </h3>

                        <div className="grid gap-4">
                          <div className="bg-white p-4 rounded border border-gray-200">
                            <FormField
                              control={form.control}
                              name="isUnder18"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                      I am under 18 years old
                                    </FormLabel>
                                    <FormDescription>
                                      This requires guardian verification
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

                          <div className="bg-white p-4 rounded border border-gray-200">
                            <FormField
                              control={form.control}
                              name="familyType"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel>Family Situation *</FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                      <FormItem className="flex items-center space-x-3 space-y-0 border p-3 rounded hover:bg-gray-50">
                                        <FormControl>
                                          <RadioGroupItem value="bothParents" />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                          Both parents alive
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0 border p-3 rounded hover:bg-gray-50">
                                        <FormControl>
                                          <RadioGroupItem value="partialOrphan" />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                          Partial orphan (one parent)
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0 border p-3 rounded hover:bg-gray-50">
                                        <FormControl>
                                          <RadioGroupItem value="totalOrphan" />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                          Total orphan (no parents)
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0 border p-3 rounded hover:bg-gray-50">
                                        <FormControl>
                                          <RadioGroupItem value="guardian" />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                          Under guardian care
                                        </FormLabel>
                                      </FormItem>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Parent Information */}
                          {watchFamilyType !== "totalOrphan" && (
                            <div className="bg-white p-4 rounded border border-gray-200">
                              <h4 className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
                                <UserCircle className="h-4 w-4 text-gray-500" />
                                Parent Information
                              </h4>
                              
                              <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                  control={form.control}
                                  name="parentName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>
                                        {watchFamilyType === "partialOrphan" 
                                          ? "Living Parent's Name *" 
                                          : "Father's Name *"}
                                      </FormLabel>
                                      <FormControl>
                                        <Input placeholder="Enter full name" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="relationship"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Relationship *</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g. Father, Mother" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="parentOccupation"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Occupation *</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g. Teacher, Farmer" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="monthlyIncome"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Monthly Income (KES) *</FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <span className="absolute left-3 top-2.5 text-gray-500">KES</span>
                                          <Input type="number" className="pl-10" {...field} />
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="parentPhone"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Phone Number</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g. +254712345678" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="parentEmail"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Email Address</FormLabel>
                                      <FormControl>
                                        <Input type="email" placeholder="example@example.com" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* Second Parent Information */}
                          {watchFamilyType === "bothParents" && (
                            <div className="bg-white p-4 rounded border border-gray-200">
                              <h4 className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
                                <UserCircle className="h-4 w-4 text-gray-500" />
                                Mother's Information
                              </h4>
                              
                              <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                  control={form.control}
                                  name="secondParentName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Mother's Name *</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Enter full name" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="secondParentOccupation"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Occupation *</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g. Teacher, Farmer" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="secondParentContact"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Phone Number</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g. +254712345678" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* Guardian Information */}
                          {(watchIsUnder18 && 
                            (watchFamilyType === "totalOrphan" || 
                             watchFamilyType === "guardian" || 
                             watchFamilyType === "partialOrphan")) && (
                            <div className="bg-white p-4 rounded border border-gray-200">
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-gray-500" />
                                  Guardian Information
                                </h4>
                                
                                {form.watch("guardianName") && !form.watch("guardianContactVerified") && (
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    onClick={handleVerifyGuardian}
                                    className="text-xs"
                                  >
                                    <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                                    Verify Guardian
                                  </Button>
                                )}
                                
                                {form.watch("guardianContactVerified") && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                    <CheckCircle className="mr-1 h-3.5 w-3.5" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                  control={form.control}
                                  name="guardianName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Guardian's Name *</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Enter full name" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="guardianRelationship"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Relationship to You *</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g. Aunt, Uncle, Grandparent" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="guardianOccupation"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Occupation *</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g. Teacher, Farmer" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="guardianPhone"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Phone Number *</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g. +254712345678" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="guardianEmail"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Email Address</FormLabel>
                                      <FormControl>
                                        <Input type="email" placeholder="example@example.com" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              {!form.watch("guardianContactVerified") && (
                                <div className="mt-4 bg-yellow-50 p-3 rounded border border-yellow-200 text-sm text-yellow-800">
                                  <AlertCircle className="inline-block mr-2 h-4 w-4 text-yellow-600" />
                                  Guardian contact verification is required for students under 18. Please fill in guardian details and click "Verify Guardian".
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Family Address and Dependents */}
                          <div className="bg-white p-4 rounded border border-gray-200">
                            <h4 className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
                              <Home className="h-4 w-4 text-gray-500" />
                              Family Address & Dependents
                            </h4>
                            
                            <div className="grid gap-4 md:grid-cols-2">
                              <FormField
                                control={form.control}
                                name="homeAddress"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Home Address</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Enter your permanent home address"
                                        className="min-h-[70px]"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name="countyOfResidence"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>County of Residence</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g. Nairobi, Mombasa" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="dependents"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Number of Dependents in Family *</FormLabel>
                                      <FormControl>
                                        <Input type="number" min="0" {...field} />
                                      </FormControl>
                                      <FormDescription>
                                        Include yourself and all siblings who depend on family income
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <FormField
                                control={form.control}
                                name="familySituation"
                                render={({ field }) => (
                                  <FormItem className="md:col-span-2">
                                    <FormLabel>Additional Family Information</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Provide any additional information about your family situation that is relevant to your application..."
                                        className="min-h-[100px]"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Include any special circumstances or challenges that impact your financial situation
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex justify-between">
                          <Button type="button" variant="outline" onClick={goToPreviousStep}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                          </Button>
                          <Button type="button" onClick={handleNext} className="bg-primary hover:bg-primary/90">
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="documents" className="mt-0">
                      <div className="bg-blue-50/50 p-4 rounded border border-blue-100">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary-500" />
                          Required Documents
                        </h3>
                        
                        <div className="bg-white p-4 rounded border border-gray-200 mb-6">
                          <h4 className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
                            <Upload className="h-4 w-4 text-gray-500" />
                            Document Upload Guidelines
                          </h4>
                          
                          <div className="text-sm text-gray-700 space-y-2">
                            <p>Please upload the following documents in PDF, JPG, or PNG format. Each file should be less than 5MB.</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Documents marked with an asterisk (*) are required</li>
                              <li>Ensure all documents are clear and legible</li>
                              <li>Official documents must be stamped or signed by the relevant authorities</li>
                              <li>All uploaded documents will be verified during the review process</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          {/* Personal Documents */}
                          <div className="bg-white p-4 rounded border border-gray-200">
                            <h4 className="text-sm font-medium text-gray-600 mb-4">Personal Documents</h4>
                            
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <FormLabel className="block mb-2">ID/Birth Certificate *</FormLabel>
                                <FileUpload
                                  label="ID/Birth Certificate"
                                  onChange={(file) => {
                                    form.setValue("documents.idDocument", file);
                                  }}
                                  accept="image/*,application/pdf"
                                  description="National ID, birth certificate, or passport"
                                />
                              </div>
                              
                              <div>
                                <FormLabel className="block mb-2">Academic Records *</FormLabel>
                                <FileUpload
                                  label="Academic Records"
                                  onChange={(file) => {
                                    form.setValue("documents.academicRecords", file);
                                  }}
                                  accept="image/*,application/pdf"
                                  description="Recent academic transcripts or report cards"
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Financial Documents */}
                          <div className="bg-white p-4 rounded border border-gray-200">
                            <h4 className="text-sm font-medium text-gray-600 mb-4">Financial Documents</h4>
                            
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <FormLabel className="block mb-2">Fee Structure *</FormLabel>
                                <FileUpload
                                  label="Fee Structure"
                                  onChange={(file) => {
                                    form.setValue("documents.feeStructure", file);
                                  }}
                                  accept="image/*,application/pdf"
                                  description="Current institution's official fee structure"
                                />
                              </div>
                              
                              {watchFamilyType !== "totalOrphan" && (
                                <div>
                                  <FormLabel className="block mb-2">Parent ID/Documents *</FormLabel>
                                  <FileUpload
                                    label="Parent ID"
                                    onChange={(file) => {
                                      form.setValue("documents.parentId", file);
                                    }}
                                    accept="image/*,application/pdf"
                                    description="Parent's national ID or passport"
                                  />
                                </div>
                              )}
                              
                              {watchFamilyType !== "totalOrphan" && (
                                <div>
                                  <FormLabel className="block mb-2">Proof of Income *</FormLabel>
                                  <FileUpload
                                    label="Income Proof"
                                    onChange={(file) => {
                                      form.setValue("documents.parentIncomeProof", file);
                                    }}
                                    accept="image/*,application/pdf"
                                    description="Payslip, business records, or affidavit for informal income"
                                  />
                                </div>
                              )}
                              
                              <div>
                                <FormLabel className="block mb-2">Proof of Financial Need</FormLabel>
                                <FileUpload
                                  label="Financial Need"
                                  onChange={(file) => {
                                    form.setValue("documents.proofOfFinancialNeed", file);
                                  }}
                                  accept="image/*,application/pdf"
                                  description="Any documents showing financial hardship"
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Conditional Documents */}
                          {(watchFamilyType === "partialOrphan" || watchFamilyType === "totalOrphan") && (
                            <div className="bg-white p-4 rounded border border-gray-200">
                              <h4 className="text-sm font-medium text-gray-600 mb-4">Orphan Status Documents</h4>
                              
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <FormLabel className="block mb-2">Death Certificate(s) *</FormLabel>
                                  <FileUpload
                                    label="Death Certificate"
                                    onChange={(file) => {
                                      form.setValue("documents.orphanCertificate", file);
                                    }}
                                    accept="image/*,application/pdf"
                                    description="Death certificate(s) of parent(s) or letter from local authority"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {(watchIsUnder18 && (watchFamilyType === "totalOrphan" || watchFamilyType === "guardian")) && (
                            <div className="bg-white p-4 rounded border border-gray-200">
                              <h4 className="text-sm font-medium text-gray-600 mb-4">Guardian Documents</h4>
                              
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <FormLabel className="block mb-2">Guardian Proof *</FormLabel>
                                  <FileUpload
                                    label="Guardian Proof"
                                    onChange={(file) => {
                                      form.setValue("documents.guardianProof", file);
                                    }}
                                    accept="image/*,application/pdf"
                                    description="Legal guardianship documents or affidavit"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Additional Documents */}
                          <div className="bg-white p-4 rounded border border-gray-200">
                            <h4 className="text-sm font-medium text-gray-600 mb-4">Additional Documents</h4>
                            
                            <div>
                              <FormLabel className="block mb-2">Any Other Supporting Documents</FormLabel>
                              <FileUpload
                                label="Additional Documents"
                                onChange={(file) => {
                                  form.setValue("documents.additionalDocuments", file);
                                }}
                                accept="image/*,application/pdf"
                                description="Any additional documents to support your application"
                                multiple
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex justify-between">
                          <Button type="button" variant="outline" onClick={goToPreviousStep}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                          </Button>
                          <Button type="button" onClick={handleNext} className="bg-primary hover:bg-primary/90">
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="review" className="mt-0">
                      <div className="bg-blue-50/50 p-4 rounded border border-blue-100">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-primary-500" />
                          Review & Submit
                        </h3>
                        
                        <div className="bg-white p-4 rounded border border-gray-200 mb-6">
                          <h4 className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            Application Summary
                          </h4>
                          
                          <div className="space-y-6">
                            {/* Academic Summary */}
                            <div>
                              <h5 className="text-sm font-semibold flex items-center gap-2 mb-2 text-primary-600">
                                <GraduationCap className="h-4 w-4" />
                                Academic Information
                              </h5>
                              <Table>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="font-medium w-1/3">Institution</TableCell>
                                    <TableCell>{form.getValues("institutionName") || institutionName}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">Course of Study</TableCell>
                                    <TableCell>{form.getValues("courseOfStudy") || "Not provided"}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">Year of Study</TableCell>
                                    <TableCell>{form.getValues("yearOfStudy") || "Not provided"}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                            
                            {/* Financial Summary */}
                            <div>
                              <h5 className="text-sm font-semibold flex items-center gap-2 mb-2 text-primary-600">
                                <DollarSign className="h-4 w-4" />
                                Financial Information
                              </h5>
                              <Table>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="font-medium w-1/3">Tuition Fee</TableCell>
                                    <TableCell>KES {form.getValues("tuitionFee") || "0"}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">Other Funding</TableCell>
                                    <TableCell>KES {form.getValues("otherScholarships") || "0"}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">Requested Amount</TableCell>
                                    <TableCell className="font-semibold text-primary-600">
                                      KES {form.getValues("requestedAmount") || "0"}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                            
                            {/* Family Summary */}
                            <div>
                              <h5 className="text-sm font-semibold flex items-center gap-2 mb-2 text-primary-600">
                                <Users className="h-4 w-4" />
                                Family Information
                              </h5>
                              <Table>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="font-medium w-1/3">Family Situation</TableCell>
                                    <TableCell>
                                      {form.getValues("familyType") === "bothParents" && "Both parents alive"}
                                      {form.getValues("familyType") === "partialOrphan" && "Partial orphan (one parent)"}
                                      {form.getValues("familyType") === "totalOrphan" && "Total orphan (no parents)"}
                                      {form.getValues("familyType") === "guardian" && "Under guardian care"}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">Number of Dependents</TableCell>
                                    <TableCell>{form.getValues("dependents") || "Not provided"}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">Monthly Family Income</TableCell>
                                    <TableCell>KES {form.getValues("monthlyIncome") || "Not provided"}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                            
                            {/* Documents Summary */}
                            <div>
                              <h5 className="text-sm font-semibold flex items-center gap-2 mb-2 text-primary-600">
                                <FileText className="h-4 w-4" />
                                Documents Uploaded
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="flex items-center gap-2 p-2 rounded border">
                                  {form.getValues("documents.idDocument") ? (
                                    <FilePlus className="text-green-500 h-4 w-4" />
                                  ) : (
                                    <FileX className="text-red-500 h-4 w-4" />
                                  )}
                                  <span className="text-sm">ID/Birth Certificate</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded border">
                                  {form.getValues("documents.academicRecords") ? (
                                    <FilePlus className="text-green-500 h-4 w-4" />
                                  ) : (
                                    <FileX className="text-red-500 h-4 w-4" />
                                  )}
                                  <span className="text-sm">Academic Records</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded border">
                                  {form.getValues("documents.feeStructure") ? (
                                    <FilePlus className="text-green-500 h-4 w-4" />
                                  ) : (
                                    <FileX className="text-red-500 h-4 w-4" />
                                  )}
                                  <span className="text-sm">Fee Structure</span>
                                </div>
                                {watchFamilyType !== "totalOrphan" && (
                                  <div className="flex items-center gap-2 p-2 rounded border">
                                    {form.getValues("documents.parentIncomeProof") ? (
                                      <FilePlus className="text-green-500 h-4 w-4" />
                                    ) : (
                                      <FileX className="text-red-500 h-4 w-4" />
                                    )}
                                    <span className="text-sm">Proof of Income</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded border border-gray-200 mb-6">
                          <h4 className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
                            <FileQuestion className="h-4 w-4 text-gray-500" />
                            Personal Statement
                          </h4>
                          
                          <FormField
                            control={form.control}
                            name="personalStatement"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    placeholder="Please explain why you need this bursary and how it will help you achieve your academic and career goals..."
                                    className="min-h-[150px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Provide a detailed explanation of your financial situation and why you should be considered for this bursary.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="bg-white p-4 rounded border border-gray-200 mb-6">
                          <h4 className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-gray-500" />
                            Terms & Declaration
                          </h4>
                          
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="termsAccepted"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>
                                      I agree to the terms and conditions of the bursary program *
                                    </FormLabel>
                                    <FormDescription>
                                      I have read and understood the eligibility criteria and terms of receiving the bursary.
                                    </FormDescription>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="privacyAccepted"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>
                                      I consent to the privacy policy *
                                    </FormLabel>
                                    <FormDescription>
                                      I agree that my personal information can be stored and processed for the purpose of my bursary application.
                                    </FormDescription>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="declarationAccepted"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>
                                      Declaration of truthfulness *
                                    </FormLabel>
                                    <FormDescription>
                                      I declare that all the information provided in this application is true and accurate to the best of my knowledge. I understand that providing false information will result in disqualification.
                                    </FormDescription>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-6 flex justify-between">
                          <Button type="button" variant="outline" onClick={goToPreviousStep}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                          </Button>
                          <div className="space-x-3">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => onSubmit(form.getValues(), "draft")}
                              disabled={isSubmitting}
                            >
                              <Save className="mr-2 h-4 w-4" />
                              Save as Draft
                            </Button>
                            <Button 
                              type="submit"
                              disabled={isSubmitting}
                              className="bg-primary hover:bg-primary/90"
                            >
                              {isSubmitting ? (
                                <>
                                  <span className="animate-spin mr-2">
                                    <CalendarClock className="h-4 w-4" />
                                  </span>
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <Send className="mr-2 h-4 w-4" />
                                  Submit Application
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="border-t bg-gray-50 gap-2 p-3 justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleManualSave}
                disabled={isSubmitting}
              >
                <Save className="mr-1 h-3.5 w-3.5" />
                Save Progress
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
      
      {/* Help Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BadgeHelp className="h-5 w-5" />
              Application Help
            </DialogTitle>
            <DialogDescription>
              Guidance for completing your bursary application
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">Application Process</h4>
              <p className="text-gray-600">
                Complete all five sections of the application. You can save your progress at any time and return later to complete it.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Required Documents</h4>
              <p className="text-gray-600">
                Prepare digital copies of your ID, academic records, fee structure, and proof of financial need before starting.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">After Submission</h4>
              <p className="text-gray-600">
                After submitting, your application will be reviewed by our committee. You can check the status in your dashboard.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Need Further Assistance?</h4>
              <p className="text-gray-600">
                Contact the bursary office at bursary@example.com or call 07XX-XXX-XXX during working hours.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowHelpDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Exit Application?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to exit the application form?
            </DialogDescription>
          </DialogHeader>
          
          <p className="text-sm text-gray-600">
            Your progress has been saved automatically, but any unsaved changes in the current section may be lost.
          </p>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Continue Editing
            </Button>
            <Button variant="destructive" onClick={onCancel}>
              Exit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudentApplicationForm;
