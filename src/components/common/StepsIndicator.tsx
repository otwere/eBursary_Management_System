
import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: number;
  name: string;
  status: "complete" | "current" | "upcoming";
}

interface StepsIndicatorProps {
  steps: Step[];
  className?: string;
}

const StepsIndicator: React.FC<StepsIndicatorProps> = ({ steps, className }) => {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.id}
            className={cn(
              stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
              "relative"
            )}
          >
            {step.status === "complete" ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-primary-600" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 hover:bg-primary-800">
                  <Check className="h-5 w-5 text-white" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : step.status === "current" ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-600 bg-white"
                  aria-current="step"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-primary-600"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400">
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            )}

            <div className="mt-2">
              <span className="text-xs font-medium text-gray-500">
                {step.name}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default StepsIndicator;
