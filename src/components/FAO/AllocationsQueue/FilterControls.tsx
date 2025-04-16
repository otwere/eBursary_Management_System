
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Filter, SlidersHorizontal, Download, ChevronDown } from "lucide-react";

interface FilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedInstitution: string;
  setSelectedInstitution: (institution: string) => void;
  selectedEducationLevel: string;
  setSelectedEducationLevel: (level: string) => void;
  selectedFundCategory: string;
  setSelectedFundCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (direction: "asc" | "desc") => void;
  institutions: string[];
  educationLevels: string[];
  fundCategories: string[];
}

const FilterControls: React.FC<FilterControlsProps> = ({
  searchQuery,
  setSearchQuery,
  selectedInstitution,
  setSelectedInstitution,
  selectedEducationLevel,
  setSelectedEducationLevel,
  selectedFundCategory,
  setSelectedFundCategory,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  institutions,
  educationLevels,
  fundCategories,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search applications..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Institution</Label>
              <Select
                value={selectedInstitution}
                onValueChange={setSelectedInstitution}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by institution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Institutions</SelectItem>
                  {institutions.map((institution) => (
                    <SelectItem key={institution} value={institution}>
                      {institution}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Education Level</Label>
              <Select
                value={selectedEducationLevel}
                onValueChange={setSelectedEducationLevel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {educationLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Fund Category</Label>
              <Select
                value={selectedFundCategory}
                onValueChange={setSelectedFundCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by fund category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {fundCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Sort
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applicationDate">Application Date</SelectItem>
                  <SelectItem value="requestedAmount">Requested Amount</SelectItem>
                  <SelectItem value="studentName">Student Name</SelectItem>
                  <SelectItem value="institutionName">Institution</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Direction</Label>
              <Select
                value={sortDirection}
                onValueChange={(value) => setSortDirection(value as "asc" | "desc")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Button variant="outline">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
  );
};

export default FilterControls;
