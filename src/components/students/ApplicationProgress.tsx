
import React from "react";
import { cn } from "@/lib/utils";
import { BookOpen, DollarSign, Users, FileText, CheckCircle } from "lucide-react";

interface Step {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

interface ApplicationProgressProps {
  steps: Step[];
  currentStep: string;
  onChange: (stepId: string) => void;
  className?: string;
}

export const ApplicationProgress: React.FC<ApplicationProgressProps> = ({
  steps,
  currentStep,
  onChange,
  className
}) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="hidden md:flex justify-between mb-8">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = steps.findIndex(s => s.id === currentStep) > steps.findIndex(s => s.id === step.id);
          
          return (
            <div key={step.id} className="relative flex flex-col items-center w-full">
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "absolute top-5 left-1/2 w-full h-[2px]", 
                    isCompleted ? "bg-primary-500" : "bg-gray-200"
                  )}
                />
              )}
              
              {/* Circle with icon */}
              <button
                onClick={() => onChange(step.id)}
                className={cn(
                  "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                  isActive
                    ? "bg-white border-primary-500 text-primary-500"
                    : isCompleted
                    ? "bg-primary-500 border-primary-500 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                )}
              >
                {step.icon}
              </button>
              
              {/* Step label */}
              <span 
                className={cn(
                  "mt-2 text-sm font-medium", 
                  isActive ? "text-primary-700" : isCompleted ? "text-primary-600" : "text-gray-500"
                )}
              >
                {step.label}
              </span>

              {/* Step description */}
              {step.description && (
                <span className="text-xs text-gray-500 text-center mt-1 max-w-[120px]">
                  {step.description}
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Mobile version */}
      <div className="md:hidden flex overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = steps.findIndex(s => s.id === currentStep) > steps.findIndex(s => s.id === step.id);
          
          return (
            <div key={step.id} className="flex-shrink-0 flex flex-col items-center mr-6 last:mr-0">
              <button
                onClick={() => onChange(step.id)}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                  isActive
                    ? "bg-white border-primary-500 text-primary-500"
                    : isCompleted
                    ? "bg-primary-500 border-primary-500 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                )}
              >
                {step.icon}
              </button>
              
              <span 
                className={cn(
                  "mt-2 text-xs font-medium whitespace-nowrap", 
                  isActive ? "text-primary-700" : isCompleted ? "text-primary-600" : "text-gray-500"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
