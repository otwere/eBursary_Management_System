import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { mockDeadlines } from "@/data/mockData";
import { ApplicationDeadline, InstitutionType } from "@/types/auth";
import { CalendarIcon, Clock, Plus, Pencil, Trash2, CalendarDays, Download, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CSVLink } from "react-csv";

const deadlineFormSchema = z.object({
  institutionType: z.enum(["Secondary", "TVET", "College", "University"] as const, {
    required_error: "Institution type is required",
  }),
  closingDate: z.date({
    required_error: "Closing date is required",
  }),
  academicYear: z.string()
    .min(4, {
      message: "Academic Year must be at least 4 characters.",
    })
    .regex(/^\d{4}-\d{4}$/, {
      message: "Academic Year must be in format YYYY-YYYY",
    }),
  description: z.string().max(500, {
    message: "Description cannot exceed 500 characters",
  }).optional(),
  isActive: z.boolean().default(true),
  notifyStudents: z.boolean().default(true),
});

type DeadlineFormValues = z.infer<typeof deadlineFormSchema>;

const DeadlineManagement: React.FC = () => {
  const navigate = useNavigate();
  const [deadlines, setDeadlines] = useState<ApplicationDeadline[]>(mockDeadlines.map(d => ({
    ...d,
    institutionType: d.institutionType as InstitutionType
  })));
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<ApplicationDeadline | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeadlines, setSelectedDeadlines] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [expiryFilter, setExpiryFilter] = useState<"all" | "active" | "expired">("all");

  const form = useForm<DeadlineFormValues>({
    resolver: zodResolver(deadlineFormSchema),
    defaultValues: {
      academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      isActive: true,
      notifyStudents: true,
    },
  });

  const checkDuplicateDeadline = useCallback((institutionType: InstitutionType, academicYear: string, excludeId?: string) => {
    return deadlines.some(d => 
      d.institutionType === institutionType && 
      d.academicYear === academicYear &&
      d.id !== excludeId
    );
  }, [deadlines]);

  const onSubmit = (data: DeadlineFormValues) => {
    // Check for duplicate deadlines (only for new entries or when academic year/institution changes)
    if (!editingDeadline || 
        (editingDeadline.academicYear !== data.academicYear) || 
        (editingDeadline.institutionType !== data.institutionType)) {
      if (checkDuplicateDeadline(data.institutionType, data.academicYear, editingDeadline?.id)) {
        toast.error("A deadline already exists for this institution type and academic year");
        return;
      }
    }

    const formattedData = {
      ...data,
      closingDate: data.closingDate.toISOString(),
      institutionType: data.institutionType,
      isActive: data.isActive,
      academicYear: data.academicYear,
      openingDate: new Date().toISOString()
    };

    if (editingDeadline) {
      setDeadlines(deadlines.map(d => 
        d.id === editingDeadline.id 
          ? { ...d, ...formattedData } 
          : d
      ));
      toast.success("Deadline updated successfully");
    } else {
      const newDeadline: ApplicationDeadline = {
        id: `Deadline-${new Date().getTime()}`,
        institutionType: formattedData.institutionType,
        closingDate: formattedData.closingDate,
        isActive: formattedData.isActive,
        academicYear: formattedData.academicYear,
        description: formattedData.description || "",
        openingDate: formattedData.openingDate
      };
      setDeadlines([...deadlines, newDeadline]);
      
      if (data.notifyStudents) {
        toast.success("New deadline created successfully. Students will be notified.");
      } else {
        toast.success("New deadline created successfully");
      }
    }
    
    setIsCreateDialogOpen(false);
    setEditingDeadline(null);
    form.reset();
  };

  const handleEditDeadline = (deadline: ApplicationDeadline) => {
    setEditingDeadline(deadline);
    form.reset({
      institutionType: deadline.institutionType,
      closingDate: new Date(deadline.closingDate),
      academicYear: deadline.academicYear,
      description: deadline.description || "",
      isActive: deadline.isActive,
      notifyStudents: true,
    });
    setIsCreateDialogOpen(true);
  };

  const handleDeleteDeadline = (id: string) => {
    setDeadlines(deadlines.filter(d => d.id !== id));
    setSelectedDeadlines(selectedDeadlines.filter(d => d !== id));
    toast.success("Deadline deleted successfully");
  };

  const handleBulkDelete = () => {
    setDeadlines(deadlines.filter(d => !selectedDeadlines.includes(d.id)));
    setSelectedDeadlines([]);
    toast.success(`${selectedDeadlines.length} deadlines deleted successfully`);
  };

  const handleExtendDeadline = (id: string, days: number) => {
    setDeadlines(deadlines.map(d => {
      if (d.id === id) {
        const currentDate = new Date(d.closingDate);
        currentDate.setDate(currentDate.getDate() + days);
        return {
          ...d,
          closingDate: currentDate.toISOString(),
        };
      }
      return d;
    }));
    toast.success(`Deadline extended by ${days} days`);
  };

  const handleToggleStatus = (id: string) => {
    setDeadlines(deadlines.map(d => {
      if (d.id === id) {
        return {
          ...d,
          isActive: !d.isActive,
        };
      }
      return d;
    }));
    
    const deadline = deadlines.find(d => d.id === id);
    if (deadline) {
      toast.success(`${deadline.institutionType} deadline ${deadline.isActive ? 'deactivated' : 'activated'}`);
    }
  };

  const handleBulkStatusChange = (status: boolean) => {
    setDeadlines(deadlines.map(d => 
      selectedDeadlines.includes(d.id) ? { ...d, isActive: status } : d
    ));
    toast.success(`${selectedDeadlines.length} deadlines ${status ? 'activated' : 'deactivated'}`);
  };

  const toggleSelectDeadline = (id: string) => {
    setSelectedDeadlines(prev => 
      prev.includes(id) 
        ? prev.filter(d => d !== id) 
        : [...prev, id]
    );
  };

  const toggleSelectAllDeadlines = () => {
    if (selectedDeadlines.length === filteredDeadlines.length) {
      setSelectedDeadlines([]);
    } else {
      setSelectedDeadlines(filteredDeadlines.map(d => d.id));
    }
  };

  const getTimeRemaining = (closingDate: string) => {
    const deadline = new Date(closingDate);
    const now = new Date();
    const timeRemaining = deadline.getTime() - now.getTime();
    
    if (timeRemaining <= 0) {
      return "Expired";
    }
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };

  const extensionOptions = [1, 3, 7, 14, 30];

  const filteredDeadlines = useMemo(() => {
    return deadlines.filter(d => {
      // Search term filter
      const matchesSearch = 
        d.institutionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.academicYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "active" && d.isActive) || 
        (statusFilter === "inactive" && !d.isActive);
      
      // Expiry filter
      const isExpired = new Date(d.closingDate) <= new Date();
      const matchesExpiry = 
        expiryFilter === "all" || 
        (expiryFilter === "active" && !isExpired) || 
        (expiryFilter === "expired" && isExpired);
      
      return matchesSearch && matchesStatus && matchesExpiry;
    });
  }, [deadlines, searchTerm, statusFilter, expiryFilter]);

  const exportData = useMemo(() => {
    return filteredDeadlines.map(d => ({
      "Institution Type": d.institutionType,
      "Academic Year": d.academicYear,
      "Opening Date": format(new Date(d.openingDate), "PPP p"),
      "Closing Date": format(new Date(d.closingDate), "PPP p"),
      "Status": d.isActive ? "Active" : "Inactive",
      "Time Remaining": getTimeRemaining(d.closingDate),
      "Description": d.description || "",
    }));
  }, [filteredDeadlines]);

  return (
    <DashboardLayout title="Application Deadline Management">
      <div className="space-y-6 lg:-mx-[85px] mt-[-3.5rem]">
        <div className="flex justify-between items-center border-l-4 border-l-amber-500 pl-2 h-[4.5rem] border-b-2">
          <div className="-mt-4">
            <h1 className="text-xl text-blue-800 font-bold mb-[-0.25rem]">Application Deadlines</h1>
            <p className="text-muted-foreground text-sm">
              Manage Opening and Closing Dates for Bursary Applications
            </p>
          </div>
          <Button 
            onClick={() => {
              form.reset({
                institutionType: "Secondary",
                closingDate: addDays(new Date(), 14),
                academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
                description: "",
                isActive: true,
                notifyStudents: true,
              });
              setEditingDeadline(null);
              setIsCreateDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Deadline
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 pb-2 border-l-4 border-l-red-500 rounded-s-sm border-b-2 mb-6">
            <CardTitle className="text-xl font-bold text-primary-800">Manage Deadlines</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative w-full md:w-64">
                <Input
                  placeholder="Search deadlines"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <CSVLink 
                data={exportData} 
                filename="deadlines-export.csv"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </CSVLink>
            </div>
          </CardHeader>

          {showFilters && (
            <div className="px-6 pb-4 border-b">
              <div className="flex flex-wrap gap-4">
                <div>
                  <Label className="block mb-2">Status</Label>
                  <Select value={statusFilter} onValueChange={(v: "all" | "active" | "inactive") => setStatusFilter(v)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="block mb-2">Expiry</Label>
                  <Select value={expiryFilter} onValueChange={(v: "all" | "active" | "expired") => setExpiryFilter(v)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by expiry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Deadlines</SelectItem>
                      <SelectItem value="active">Active (Not Expired)</SelectItem>
                      <SelectItem value="expired">Expired Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {selectedDeadlines.length > 0 && (
            <div className="px-6 py-3 bg-gray-100 border-b flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedDeadlines.length} deadline(s) selected
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkStatusChange(true)}
                >
                  Activate
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkStatusChange(false)}
                >
                  Deactivate
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}

          <CardContent>
            <div className="rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedDeadlines.length === filteredDeadlines.length && filteredDeadlines.length > 0}
                        onCheckedChange={toggleSelectAllDeadlines}
                      />
                    </TableHead>
                    <TableHead>Institution Type</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Closing Date</TableHead>
                    <TableHead>Time Remaining</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeadlines.length > 0 ? (
                    filteredDeadlines.map((deadline) => {
                      const closingDate = new Date(deadline.closingDate);
                      const isExpired = closingDate <= new Date();
                      
                      return (
                        <TableRow key={deadline.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedDeadlines.includes(deadline.id)}
                              onCheckedChange={() => toggleSelectDeadline(deadline.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {deadline.institutionType}
                            </div>
                            {deadline.description && (
                              <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {deadline.description}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{deadline.academicYear}</TableCell>
                          <TableCell>
                            {format(new Date(deadline.closingDate), "PPP p")}
                          </TableCell>
                          <TableCell>
                            <Badge variant={isExpired ? "destructive" : "outline"}
                              className={!isExpired ? "bg-blue-50" : ""}
                            >
                              <Clock className="mr-1 h-3 w-3" />
                              {getTimeRemaining(deadline.closingDate)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={deadline.isActive}
                              onCheckedChange={() => handleToggleStatus(deadline.id)}
                              disabled={isExpired}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEditDeadline(deadline)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              
                              {!isExpired && (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <CalendarDays className="mr-1 h-4 w-4" />
                                      Extend
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-2">
                                    <div className="space-y-2">
                                      <h4 className="text-xs">Extend Deadline</h4>
                                      <div className="flex gap-2 flex-wrap">
                                        {extensionOptions.map((days) => (
                                          <Button
                                            key={days}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleExtendDeadline(deadline.id, days)}
                                          >
                                            {days} {days === 1 ? "day" : "days"}
                                          </Button>
                                        ))}
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )}
                              
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteDeadline(deadline.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        {searchTerm || statusFilter !== "all" || expiryFilter !== "all"
                          ? "No deadlines match your criteria" 
                          : "No deadlines have been created yet"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="lg:max-w-5xl sm:max-w-3xl bg-gray-50">
            <DialogHeader className="border-l-4 border-l-amber-500 pl-2 h-14 border-b-2">
              <DialogTitle className="mb-[-0.6rem] text-blue-800 text-lg font-bold">
                {editingDeadline ? "Edit Deadline" : "Create New Deadline"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {editingDeadline 
                  ? "Update the Application Deadline Details" 
                  : "Set up a new Application Deadline for Students"}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="institutionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution Type *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select institution type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Secondary">Secondary School</SelectItem>
                            <SelectItem value="TVET">TVET Institution</SelectItem>
                            <SelectItem value="College">College</SelectItem>
                            <SelectItem value="University">University</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="academicYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Year *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 2025-2026" {...field} />
                        </FormControl>
                        <FormDescription>
                          Format: YYYY-YYYY
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="closingDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Application Closing Date & Time *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP p")
                              ) : (
                                <span>Pick a date and time</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                const currentDate = field.value || new Date();
                                date.setHours(currentDate.getHours());
                                date.setMinutes(currentDate.getMinutes());
                                field.onChange(date);
                              }
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                          <div className="p-3 border-t border-border">
                            <div className="flex justify-between items-center">
                              <Label>Time:</Label>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="time"
                                  className="w-32"
                                  value={field.value ? format(field.value, "HH:mm") : ""}
                                  onChange={(e) => {
                                    const [hours, minutes] = e.target.value.split(":");
                                    const newDate = new Date(field.value || new Date());
                                    newDate.setHours(parseInt(hours));
                                    newDate.setMinutes(parseInt(minutes));
                                    field.onChange(newDate);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional information about this application cycle"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Max 500 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded border p-3 shadow-none">
                        <div className="space-y-0.5">
                          <FormLabel>Active Status</FormLabel>
                          <FormDescription>
                            Make this deadline visible to students
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
                  
                  <FormField
                    control={form.control}
                    name="notifyStudents"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded border p-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Notify eligible students
                          </FormLabel>
                          <FormDescription>
                            Send notification to eligible students about this deadline
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">
                    {editingDeadline ? "Update Deadline" : "Create Deadline"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default DeadlineManagement;