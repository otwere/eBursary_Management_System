
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
      toast.success("Password reset instructions sent to your email");
    }, 1500);
  };
  
  return (
    <AuthLayout 
      title="Reset your password" 
      subtitle="Enter your email and we'll send you instructions to reset your password"
      type="forgot-password"
    >
      <div className="flex flex-col space-y-6 w-full lg:w-[400px]">
        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md">
                  <Mail className="h-4 w-4 text-gray-500" />
                </span>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-l-none"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send reset instructions"}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">Email sent!</h3>
              <p className="mt-2 text-green-700">
                Check your email inbox for link to reset your password.
              </p>
            </div>
            
            <Button
              type="button"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Back to login
            </Button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
