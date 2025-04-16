
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Book, GraduationCap, School } from "lucide-react";

export type EducationLevel = "primary" | "secondary" | "college" | "university";

interface EducationLevelToggleProps {
  selectedLevel: EducationLevel;
  onSelectLevel: (value: EducationLevel) => void;
}

const EducationLevelToggle: React.FC<EducationLevelToggleProps> = ({
  selectedLevel,
  onSelectLevel,
}) => {
  const handleValueChange = (value: string) => {
    if (value) {
      onSelectLevel(value as EducationLevel);
    }
  };

  return (
    <div className="mb-4">
      <label className="text-sm font-medium mb-2 block">Education Level</label>
      <ToggleGroup
        type="single"
        value={selectedLevel}
        onValueChange={handleValueChange}
        className="justify-start"
      >
        <ToggleGroupItem value="primary" aria-label="Primary Education">
          <School className="h-4 w-4 mr-2" />
          Primary
        </ToggleGroupItem>
        <ToggleGroupItem value="secondary" aria-label="Secondary Education">
          <Book className="h-4 w-4 mr-2" />
          Secondary
        </ToggleGroupItem>
        <ToggleGroupItem value="college" aria-label="College Education">
          <Book className="h-4 w-4 mr-2" />
          College
        </ToggleGroupItem>
        <ToggleGroupItem value="university" aria-label="University Education">
          <GraduationCap className="h-4 w-4 mr-2" />
          University
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default EducationLevelToggle;
