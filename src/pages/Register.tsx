import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import AuthLayout from "@/components/layout/AuthLayout";
import OTPVerification from "@/components/auth/OtpVerification";
import { User, Mail, BookOpen, School, ArrowRight } from "lucide-react";

// Temporary static institution data
const INSTITUTION_TYPES = ["Secondary", "TVET", "College", "University"];
const INSTITUTIONS: Record<string, string[]> = {
  Secondary: ["High School A", "High School B", "High School C"],
  TVET: ["TVET Institute 1", "TVET Institute 2"],
  College: ["College X", "College Y", "College Z"],
  University: [
    "University of Technology",
    "National University",
    "Metropolitan University",
  ],
};

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
    role: z.enum(["student", "ARO", "FAO", "FDO", "superadmin"]),
    institutionType: z.string().optional(),
    institutionName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    if (data.role === "student") return !!data.institutionType;
    return true;
  }, {
    message: "Institution type is required for students.",
    path: ["institutionType"],
  })
  .refine((data) => {
    if (data.role === "student") return !!data.institutionName;
    return true;
  }, {
    message: "Institution name is required for students.",
    path: ["institutionName"],
  });

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
    },
  });

  const watchRole = form.watch("role");
  const watchInstitutionType = form.watch("institutionType");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const validInstitutions = INSTITUTIONS[watchInstitutionType as keyof typeof INSTITUTIONS] || [];

    if (watchRole === "student" && !validInstitutions.includes(values.institutionName || "")) {
      form.setError("institutionName", {
        type: "manual",
        message: "Institution not found. Please select a valid one.",
      });
      return;
    }

    setIsRegistering(true);

    try {
      setFormData(values);
      setRegistrationStep("otp");
      toast.success("Verification code sent to your email");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleVerification = async () => {
    if (!formData) return;
    setIsRegistering(true);

    try {
      const result = await register(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
        formData.institutionType,
        formData.institutionName
      );

      if (result) {
        toast.success("Registration successful!");
        navigate(`/${formData.role}`);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleBackToForm = () => {
    setRegistrationStep("form");
  };

  return (
    <AuthLayout title="Create your account" type="register">
      <div className="flex flex-row-reverse">
        {registrationStep === "form" ? (
          <div className="w-full lg:w-[400px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md">
                            <User className="h-4 w-4 text-gray-500" />
                          </span>
                          <Input placeholder="Enter your full name" className="rounded-l-none" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md">
                            <Mail className="h-4 w-4 text-gray-500" />
                          </span>
                          <Input type="email" placeholder="Enter your email" className="rounded-l-none" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Create a password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role Selection */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Register as</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          {/* <SelectItem value="ARO">Application Review Officer</SelectItem>
                          <SelectItem value="FAO">Fund Allocation Officer</SelectItem>
                          <SelectItem value="FDO">Fund Disbursement Officer</SelectItem>
                          <SelectItem value="superadmin">Administrator</SelectItem> */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Institution Section (for Students only) */}
                {watchRole === "student" && (
                  <>
                    {/* Institution Type */}
                    <FormField
                      control={form.control}
                      name="institutionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution Type</FormLabel>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md">
                              <BookOpen className="h-4 w-4 text-gray-500" />
                            </span>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full rounded-l-none">
                                  <SelectValue placeholder="Select institution type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {INSTITUTION_TYPES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Institution Name with dynamic search */}
                    {watchInstitutionType && (
                      <FormField
                        control={form.control}
                        name="institutionName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution Name</FormLabel>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md">
                                <School className="h-4 w-4 text-gray-500" />
                              </span>
                              <FormControl>
                                <>
                                  <Input
                                    placeholder="Enter your institution name"
                                    className="rounded-l-none"
                                    list="institution-list"
                                    {...field}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      field.onChange(val);
                                      const options =
                                        INSTITUTIONS[watchInstitutionType as keyof typeof INSTITUTIONS] || [];
                                      if (!options.includes(val)) {
                                        form.setError("institutionName", {
                                          type: "manual",
                                          message: "Institution not found. Please select a valid one.",
                                        });
                                      } else {
                                        form.clearErrors("institutionName");
                                      }
                                    }}
                                  />
                                  <datalist id="institution-list">
                                    {(INSTITUTIONS[watchInstitutionType as keyof typeof INSTITUTIONS] || []).map(
                                      (name) => (
                                        <option key={name} value={name} />
                                      )
                                    )}
                                  </datalist>
                                </>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={isRegistering}
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <div className="w-full lg:w-[400px]">
            <OTPVerification
              email={formData?.email || ""}
              onVerify={handleVerification}
              onBack={handleBackToForm}
            />
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default Register;
