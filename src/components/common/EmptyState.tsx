
import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => {
  return (
    <div className={`text-center py-12 px-4 bg-gray-50 rounded-lg border ${className}`}>
      {icon && (
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-100">
          {icon}
        </div>
      )}
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && (
        <div className="mt-6">
          <Button onClick={action.onClick}>{action.label}</Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
