import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OTPVerificationProps {
  email: string;
  phoneNumber?: string; // Make phoneNumber optional
  onVerify: () => void;
  onBack: () => void;
}

const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split("@");
  const maskedLocalPart = localPart.slice(0, 2) + "*".repeat(localPart.length - 2);
  return `${maskedLocalPart}@${domain}`;
};

const maskPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.slice(0, 2) + "*".repeat(phoneNumber.length - 4) + phoneNumber.slice(-2);
};

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  phoneNumber,
  onVerify,
  onBack,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isCountdownActive, setIsCountdownActive] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isCountdownActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsCountdownActive(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, isCountdownActive]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    // Only take the last character if user inputs multiple
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    
    // Move to next input if current field is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current field is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    
    // Check if pasted content is a number and has expected length
    if (/^\d+$/.test(pastedData) && pastedData.length <= 6) {
      const digits = pastedData.split("").slice(0, 6);
      const newOtp = [...otp];
      
      digits.forEach((digit, index) => {
        newOtp[index] = digit;
        if (inputRefs.current[index]) {
          inputRefs.current[index]!.value = digit;
        }
      });
      
      setOtp(newOtp);
      
      // Focus the next empty input or the last one
      const nextEmptyIndex = digits.length < 6 ? digits.length : 5;
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  const handleResendOTP = () => {
    setIsResending(true);
    
    // Mock OTP resend
    setTimeout(() => {
      setIsResending(false);
      setCountdown(60);
      setIsCountdownActive(true);
      toast.success("OTP has been resent to your email");
    }, 1000);
  };

  const handleVerify = () => {
    const otpValue = otp.join("");
    
    if (otpValue.length < 6) {
      toast.error("Please enter a complete 6-digit OTP");
      return;
    }
    
    // For demo purposes, let's verify with a hardcoded OTP (123456)
    if (otpValue === "123456") {
      toast.success("OTP verified successfully!");
      onVerify();
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">OTP Verification</h2>
        <p className="text-gray-500">
          We've sent a 6-digit code to {maskEmail(email)}
          {phoneNumber && ` and ${maskPhoneNumber(phoneNumber)}`}. Please enter it below to verify your account.
        </p>
      </div>

      <div className="flex justify-center gap-2 sm:gap-3 my-8">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <input
              key={index}
              type="text"
              ref={(el) => (inputRefs.current[index] = el)}
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              maxLength={1}
              inputMode="numeric"
              autoFocus={index === 0}
            />
          ))}
      </div>

      <div className="flex flex-col space-y-4">
        <Button 
          onClick={handleVerify}
          className="w-full"
        >
          Verify
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onBack}
          className="w-full"
        >
          Back
        </Button>
      </div>

      <div className="text-center text-sm">
        <p className="text-gray-500">
          Didn't receive the code?{" "}
          {isCountdownActive ? (
            <span>Request new code in {countdown}s</span>
          ) : (
            <button
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
