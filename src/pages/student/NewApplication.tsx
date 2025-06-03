"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  BookOpen,
  Users,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  School,
  Upload,
  Info,
  GraduationCap,
  Landmark,
  BadgeHelp,
  X,
  Home,
  UserCircle,
  FileQuestion,
  FilePlus,
  FileX,
  ShieldCheck,
  Shield,
  CalendarClock,
  Hash,
  Copy,
  Download,
} from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/layout/DashboardLayout" // Missing import

// Enhanced validation schema with application number
const formSchema = z.object({
  applicationNumber: z.string().optional(),
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
  documents: z
    .object({
      idDocument: z.any().optional(),
      academicRecords: z.any().optional(),
      feeStructure: z.any().optional(),
      parentId: z.any().optional(),
      parentIncomeProof: z.any().optional(),
      guardianProof: z.any().optional(),
      orphanCertificate: z.any().optional(),
      proofOfFinancialNeed: z.any().optional(),
      additionalDocuments: z.any().optional(),
    })
    .optional(),

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
})

interface InstitutionType {
  type: "Secondary" | "TVET" | "University"
}

interface StudentApplicationFormProps {
  institutionType: InstitutionType["type"]
  institutionName: string
  onSave: (data: any, status: "draft" | "submitted") => void
  onCancel: () => void
  initialValues?: any
  currentStep?: string
  onStepChange?: (step: string) => void
  isSubmitting?: boolean
}

// Application Progress Component
const ApplicationProgress = ({ steps, currentStep, onChange, className }: any) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step: any, index: number) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-pointer transition-colors ${
              currentStep === step.id
                ? "bg-primary border-primary text-white"
                : steps.findIndex((s: any) => s.id === currentStep) > index
                  ? "bg-green-500 border-green-500 text-white"
                  : "bg-white border-gray-300 text-gray-500"
            }`}
            onClick={() => onChange(step.id)}
          >
            {steps.findIndex((s: any) => s.id === currentStep) > index ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              step.icon
            )}
          </div>
          <div className="ml-2 hidden md:block">
            <div className="text-sm font-medium">{step.label}</div>
            <div className="text-xs text-gray-500">{step.description}</div>
          </div>
          {index < steps.length - 1 && <div className="w-8 md:w-16 h-0.5 bg-gray-300 mx-2 md:mx-4" />}
        </div>
      ))}
    </div>
  )
}

// File Upload Component
const FileUpload = ({ label, onChange, accept, description, multiple = false }: any) => {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      onChange(selectedFile)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          id={`file-${label}`}
        />
        <label htmlFor={`file-${label}`} className="cursor-pointer">
          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">{file ? file.name : "Click to upload or drag and drop"}</p>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </label>
      </div>
    </div>
  )
}

// OTP Verification Component
const OTPVerification = ({ email, onVerify, onBack }: any) => {
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = async () => {
    setIsVerifying(true)
    // Simulate OTP verification
    setTimeout(() => {
      setIsVerifying(false)
      if (otp === "123456") {
        onVerify()
      } else {
        toast.error("Invalid OTP. Please try again.")
      }
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium">Verify Guardian Contact</h3>
        <p className="text-sm text-gray-600 mt-1">We've sent a verification code to {email}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Enter verification code</label>
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button onClick={handleVerify} disabled={otp.length !== 6 || isVerifying} className="flex-1">
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Generate Application Number
const generateApplicationNumber = (): string => {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, "0")
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `BUR${year}${month}${random}`
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
  const [activeStep, setActiveStep] = useState(currentStep)
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [guardianEmail, setGuardianEmail] = useState("")
  const [isOpenCollapsible, setIsOpenCollapsible] = useState(false)
  const [formProgress, setFormProgress] = useState(0)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [showHelpDialog, setShowHelpDialog] = useState(false)
  const [applicationNumber, setApplicationNumber] = useState<string>("")
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)

  // Define the steps with enhanced descriptions
  const steps = [
    {
      id: "academic",
      label: "Academic",
      icon: <BookOpen className="h-4 w-4" />,
      description: "Education details",
    },
    {
      id: "financial",
      label: "Financial",
      icon: <DollarSign className="h-4 w-4" />,
      description: "Fees & requests",
    },
    {
      id: "family",
      label: "Family",
      icon: <Users className="h-4 w-4" />,
      description: "Guardian details",
    },
    {
      id: "documents",
      label: "Documents",
      icon: <FileText className="h-4 w-4" />,
      description: "Required uploads",
    },
    {
      id: "review",
      label: "Review",
      icon: <CheckCircle className="h-4 w-4" />,
      description: "Submit application",
    },
  ]

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      applicationNumber: "",
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
  })

  const watchFamilyType = form.watch("familyType")
  const watchIsUnder18 = form.watch("isUnder18")

  // Generate application number on component mount
  useEffect(() => {
    if (!initialValues?.applicationNumber) {
      const newAppNumber = generateApplicationNumber()
      setApplicationNumber(newAppNumber)
      form.setValue("applicationNumber", newAppNumber)
    } else {
      setApplicationNumber(initialValues.applicationNumber)
    }
  }, [])

  // Calculate form progress
  useEffect(() => {
    const values = form.getValues()
    let fieldsCompleted = 0
    let totalFields = 0

    Object.keys(values).forEach((key) => {
      // Skip documents and optional fields for simple calculation
      if (
        key !== "documents" &&
        key !== "termsAccepted" &&
        !key.startsWith("second") &&
        !key.startsWith("guardian") &&
        key !== "isUnder18" &&
        key !== "otherScholarships" &&
        key !== "academicDate" &&
        key !== "educationalBackground" &&
        key !== "gpa" &&
        key !== "expectedGraduation" &&
        key !== "extracurricular" &&
        key !== "applicationNumber"
      ) {
        totalFields++
        // @ts-ignore
        if (values[key] && values[key].length > 0) {
          fieldsCompleted++
        }
      }
    })

    const docsValues = values.documents || {}
    // Add document fields to progress calculation
    Object.keys(docsValues).forEach((key) => {
      totalFields++

      if (docsValues[key]) {
        fieldsCompleted++
      }
    })

    // Calculate percentage
    const progressPercentage = Math.floor((fieldsCompleted / totalFields) * 100)
    setFormProgress(progressPercentage)
  }, [form, form.formState.dirtyFields])

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (form.formState.isDirty) {
        setAutoSaveStatus("saving")

        setTimeout(() => {
          const currentData = form.getValues()
          localStorage.setItem("bursary-form-draft", JSON.stringify(currentData))
          setAutoSaveStatus("saved")

          // Reset to idle after 2 seconds
          setTimeout(() => {
            setAutoSaveStatus("idle")
          }, 2000)
        }, 1000)
      }
    }, 30000) // Auto-save every 30 seconds if form is dirty

    return () => clearInterval(autoSaveInterval)
  }, [form, form.formState.isDirty])

  // Load saved draft from localStorage on initial mount
  useEffect(() => {
    if (!initialValues) {
      const savedDraft = localStorage.getItem("bursary-form-draft")
      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft)
          Object.keys(parsedDraft).forEach((key) => {
            form.setValue(key as any, parsedDraft[key])
          })
          toast.info("Draft application loaded", {
            description: "Your previous progress has been restored",
          })
        } catch (error) {
          console.error("Failed to parse saved draft", error)
        }
      }
    }
  }, [form, initialValues])

  const handleStepChange = (step: string) => {
    setActiveStep(step)
    if (onStepChange) {
      onStepChange(step)
    }
  }

  // Enhanced submission function
  function onSubmit(values: z.infer<typeof formSchema>, status: "draft" | "submitted") {
    // Check if guardian verification is required but not completed
    if (watchIsUnder18 && !form.getValues("guardianContactVerified") && status === "submitted") {
      toast.error("Guardian contact verification is required for students under 18")
      return
    }

    if (status === "submitted") {
      // Show submission confirmation dialog
      setShowSubmissionDialog(true)
      return
    }

    // For draft saves
    onSave(values, status)
  }

  // Handle final submission
  const handleFinalSubmission = async () => {
    const values = form.getValues()

    try {
      // Simulate submission process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear local storage after successful submission
      localStorage.removeItem("bursary-form-draft")

      setSubmissionSuccess(true)
      setShowSubmissionDialog(false)

      // Call the onSave callback
      onSave(values, "submitted")

      toast.success("Application submitted successfully!", {
        description: `Your application number is ${applicationNumber}`,
      })
    } catch (error) {
      toast.error("Submission failed. Please try again.")
      setShowSubmissionDialog(false)
    }
  }

  const yearOptions =
    institutionType === "Secondary"
      ? ["Form 1", "Form 2", "Form 3", "Form 4"]
      : institutionType === "TVET"
        ? ["Year 1", "Year 2", "Year 3"]
        : ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"]

  const goToNextStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === activeStep)
    if (currentIndex < steps.length - 1) {
      handleStepChange(steps[currentIndex + 1].id)
    }
  }

  const goToPreviousStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === activeStep)
    if (currentIndex > 0) {
      handleStepChange(steps[currentIndex - 1].id)
    }
  }

  const validateCurrentStep = async () => {
    let fieldsToValidate: string[] = []

    switch (activeStep) {
      case "academic":
        fieldsToValidate = ["institutionName", "courseOfStudy", "yearOfStudy"]
        break
      case "financial":
        fieldsToValidate = ["tuitionFee", "requestedAmount"]
        break
      case "family":
        fieldsToValidate = [
          "familyType",
          "isUnder18",
          "parentName",
          "relationship",
          "parentOccupation",
          "monthlyIncome",
          "dependents",
        ]
        // Add conditional validation based on family type
        if (watchFamilyType === "bothParents") {
          fieldsToValidate.push("secondParentName", "secondParentOccupation")
        } else if (
          watchIsUnder18 &&
          (watchFamilyType === "partialOrphan" || watchFamilyType === "totalOrphan" || watchFamilyType === "guardian")
        ) {
          fieldsToValidate.push("guardianName", "guardianRelationship", "guardianOccupation")
        }
        break
      case "documents":
        // For documents, we're not validating any specific form fields
        return true
      case "review":
        fieldsToValidate = ["personalStatement", "termsAccepted"]
        break
    }

    const result = await form.trigger(fieldsToValidate as any)
    return result
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (isValid) {
      goToNextStep()
    } else {
      toast.error("Please fix the errors before proceeding")
    }
  }

  const handleVerifyGuardian = () => {
    const guardianEmail = form.getValues("guardianName").toLowerCase().replace(/\s/g, "") + "@example.com"
    setGuardianEmail(guardianEmail)
    setShowOtpVerification(true)
  }

  const handleOtpVerified = () => {
    setShowOtpVerification(false)
    form.setValue("guardianContactVerified", true)
    toast.success("Guardian contact verified successfully!")
  }

  const handleOtpBack = () => {
    setShowOtpVerification(false)
  }

  const handleManualSave = () => {
    setAutoSaveStatus("saving")

    setTimeout(() => {
      const currentData = form.getValues()
      localStorage.setItem("bursary-form-draft", JSON.stringify(currentData))
      setAutoSaveStatus("saved")
      toast.success("Application progress saved")

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setAutoSaveStatus("idle")
      }, 2000)
    }, 800)
  }

  const copyApplicationNumber = () => {
    navigator.clipboard.writeText(applicationNumber)
    toast.success("Application number copied to clipboard")
  }

  return (
    <DashboardLayout title="New Application">
      <Card className="lg:mx-[-70px] shadow-none border-primary/10 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b relative">
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1 bg-white px-6"
              onClick={() => setShowHelpDialog(true)}
            >
              <BadgeHelp className="h-3.5 w-3.5 mr-3" />
              Help
            </Button>
            <Button variant="outline" size="sm" className="text-xs gap-1 bg-white px-6" onClick={handleManualSave}>
              <Save className="h-3.5 w-3.5 mr-3" />
              {autoSaveStatus === "saving" ? "Saving..." : autoSaveStatus === "saved" ? "Saved" : "Save"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-destructive gap-1 hover:bg-destructive/10 bg-white px-6"
              onClick={() => setShowExitDialog(true)}
            >
              <X className="h-3.5 w-3.5 mr-3" />
              Exit
            </Button>
          </div>

          <CardTitle className="text-blue-800 font-bold flex items-center gap-2 text-xl">
            <School className="h-5 w-5" />
            eBursary Application Form
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Complete all required fields for your Bursary Application.
          </CardDescription>

          {/* Application Number Display */}
          {applicationNumber && (
            <div className="mt-4 bg-white p-3 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Application Number:</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 font-mono">
                    {applicationNumber}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={copyApplicationNumber} className="text-xs">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Save this number for future reference. You'll need it to track your application status.
              </p>
            </div>
          )}

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
              <OTPVerification email={guardianEmail} onVerify={handleOtpVerified} onBack={handleOtpBack} />
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
                                <Input value={institutionType} disabled className="bg-gray-50" />
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

                        <div className="mt-6 flex justify-end">
                          <Button type="button" onClick={handleNext} className="bg-primary hover:bg-primary/90 px-10">
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
                                  <FormDescription>Leave blank if none</FormDescription>
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
                                  <FormDescription>Amount should not exceed your tuition fees</FormDescription>
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
                                    <FormLabel className="text-base">I am under 18 years old</FormLabel>
                                    <FormDescription>This requires guardian verification</FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                                        <FormLabel className="font-normal cursor-pointer">Both parents alive</FormLabel>
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
                          {watchIsUnder18 &&
                            (watchFamilyType === "totalOrphan" ||
                              watchFamilyType === "guardian" ||
                              watchFamilyType === "partialOrphan") && (
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
                                    Guardian contact verification is required for students under 18. Please fill in
                                    guardian details and click "Verify Guardian".
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
                                      Include any special circumstances or challenges that impact your financial
                                      situation
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
                            <p>
                              Please upload the following documents in PDF, JPG, or PNG format. Each file should be less
                              than 5MB.
                            </p>
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
                                <FileUpload
                                  label="ID/Birth Certificate*"
                                  onChange={(file: File) => {
                                    form.setValue("documents.idDocument", file)
                                  }}
                                  accept="image/*,application/pdf"
                                  description="National ID  or Birth Certificate"
                                />
                              </div>

                              <div>
                                <FileUpload
                                  label="Academic Records*"
                                  onChange={(file: File) => {
                                    form.setValue("documents.academicRecords", file)
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
                                <FileUpload
                                  label="Fee Structure*"
                                  onChange={(file: File) => {
                                    form.setValue("documents.feeStructure", file)
                                  }}
                                  accept="image/*,application/pdf"
                                  description="Current institution's official fee structure"
                                />
                              </div>

                              {watchFamilyType !== "totalOrphan" && (
                                <div>
                                  <FileUpload
                                    label="Parent ID | Guardian ID*"
                                    onChange={(file: File) => {
                                      form.setValue("documents.parentId", file)
                                    }}
                                    accept="image/*,application/pdf"
                                    description="Parent's | Guardian's National ID or Passport"
                                  />
                                </div>
                              )}

                              {watchFamilyType !== "totalOrphan" && (
                                <div>
                                  <FileUpload
                                    label="Proof of Income *"
                                    onChange={(file: File) => {
                                      form.setValue("documents.parentIncomeProof", file)
                                    }}
                                    accept="image/*,application/pdf"
                                    description="Payslip, Business Records(with Bank Statement), or affidavit for informal income"
                                  />
                                </div>
                              )}

                              <div>
                                <FileUpload
                                  label="Proof of Financial Need"
                                  onChange={(file: File) => {
                                    form.setValue("documents.proofOfFinancialNeed", file)
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
                              <h4 className="text-sm font-medium text-gray-600 mb-4">
                                {" "}
                                Partial | Total Orphan Status Documents
                              </h4>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <FileUpload
                                    label="Death Certificate(s) *"
                                    onChange={(file: File) => {
                                      form.setValue("documents.orphanCertificate", file)
                                    }}
                                    accept="image/*,application/pdf"
                                    description="Death certificate(s) | Burial Permit(s) of Parent(s) or letter from local authority"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {watchIsUnder18 && (watchFamilyType === "totalOrphan" || watchFamilyType === "guardian") && (
                            <div className="bg-white p-4 rounded border border-gray-200">
                              <h4 className="text-sm font-medium text-gray-600 mb-4">Guardian Documents</h4>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <FileUpload
                                    label="Guardian Proof *"
                                    onChange={(file: File) => {
                                      form.setValue("documents.guardianProof", file)
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
                              <FileUpload
                                label="Any Other Supporting Documents"
                                onChange={(file: File) => {
                                  form.setValue("documents.additionalDocuments", file)
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
                                      {form.getValues("familyType") === "partialOrphan" &&
                                        "Partial orphan (one parent)"}
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
                                  Provide a detailed explanation of your financial situation and why you should be
                                  considered for this bursary.
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
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>I agree to the terms and conditions of the bursary program *</FormLabel>
                                    <FormDescription>
                                      I have read and understood the eligibility criteria and terms of receiving the
                                      bursary.
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
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>I consent to the privacy policy *</FormLabel>
                                    <FormDescription>
                                      I agree that my personal information can be stored and processed for the purpose
                                      of my bursary application.
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
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Declaration of truthfulness *</FormLabel>
                                    <FormDescription>
                                      I declare that all the information provided in this application is true and
                                      accurate to the best of my knowledge. I understand that providing false
                                      information will result in disqualification.
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
                            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
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
          </>
        )}
      </Card>

      {/* Submission Confirmation Dialog */}
      <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Send className="h-5 w-5" />
              Submit Application?
            </DialogTitle>
            <DialogDescription>Are you ready to submit your bursary application?</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Application Number:</span>
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 font-mono">
                {applicationNumber}
              </Badge>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p>Please review the following before submitting:</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>All required information has been provided</li>
                <li>All required documents have been uploaded</li>
                <li>You have accepted all terms and conditions</li>
                <li>Once submitted, you cannot edit your application</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmissionDialog(false)}>
              Review Again
            </Button>
            <Button onClick={handleFinalSubmission} disabled={isSubmitting}>
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
                  Submit Now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={submissionSuccess} onOpenChange={setSubmissionSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Application Submitted Successfully!
            </DialogTitle>
            <DialogDescription>Your bursary application has been received and is being processed.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Your Application Number:</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 font-mono">
                  {applicationNumber}
                </Badge>
                <Button variant="ghost" size="sm" onClick={copyApplicationNumber} className="text-xs">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p className="font-medium">What happens next?</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>Your application will be reviewed by our committee</li>
                <li>You'll receive email updates on your application status</li>
                <li>The review process typically takes 2-4 weeks</li>
                <li>You can track your application status in your dashboard</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                setSubmissionSuccess(false)
                onCancel() // Navigate back to dashboard
              }}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="lg:max-w-2xl max-w-xl bg-gray-50">
          <DialogHeader className="border-l-4  border-l-orange-500 pl-2 border-b-2 h-14 rounded">
            <DialogTitle className="flex items-center gap-2 text-blue-800 mb-[-0.5rem] mt-1">
              <BadgeHelp className="h-5 w-5 text-blue-800" />
              Application Help
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Guidance for completing your Bursary Application
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">Application Process</h4>
              <p className="text-gray-600">
                Complete all five sections of the application. You can save your progress at any time and return later
                to complete it.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Required Documents</h4>
              <p className="text-gray-600">
                Prepare digital copies of your ID, academic records, fee structure, and proof of financial need before
                starting.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">After Submission</h4>
              <p className="text-gray-600">
                After submitting, your application will be reviewed by our committee. You can check the status in your
                dashboard.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Need Further Assistance?</h4>
              <p className="text-gray-600">
                Contact the bursary office at bursary@example.com or call 0733-432-224 during working hours.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowHelpDialog(false)}>Close</Button>
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
            <DialogDescription>Are you sure you want to exit the application form?</DialogDescription>
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
    </DashboardLayout>
  )
}

export default StudentApplicationForm
