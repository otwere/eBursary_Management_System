import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Edit, 
  FileText, 
  Mail, 
  MapPin, 
  Phone, 
  School, 
  Download,
  Eye,
  Plus,
  Upload,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import OrphanStatusCard from "@/components/student/OrphanStatusCard";
import { AcademicRecord } from "@/types/auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { AcademicRecordForm } from "@/components/student/AcademicRecordForm";
import { DocumentUploadForm } from "@/components/student/DocumentUploadForm";
import AcademicRecordsCard from "@/components/student/AcademicRecordsCard";

const StudentProfile = () => {
  const { authState } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Define user for easier access (with fallback to empty object if null)
  const user = authState.user || { 
    name: "", 
    email: "", 
    phoneNumber: "",
    studentId: "",
    institutionName: "",
    orphanStatus: {
      id: 'default-id',
      studentId: 'default-student',
      orphanType: "single",
      verified: false,
      guardianType: "both-parents"
    }
  };
  
  // Handle editing profile info
  const handleEditProfile = () => {
    // Show edit form in a dialog
    // This would normally open a dialog with ProfileEditForm
    toast({
      title: "Edit Profile",
      description: "Profile editing functionality is coming soon.",
    });
  };

  // Mock handlers for academic records
  const handleSaveAcademicRecord = (record: AcademicRecord) => {
    toast({
      title: "Record Saved",
      description: "Academic record has been saved successfully.",
    });
  };
  
  const handleCancelAcademicRecord = () => {
    // Cancel form
  };
  
  // Mock handler for document upload
  const handleUploadDocument = (data: any) => {
    toast({
      title: "Document Uploaded",
      description: "Your document has been uploaded successfully.",
    });
  };
  
  const handleCancelUpload = () => {
    // Cancel upload
  };

  // Go back to student dashboard
  const handleGoBack = () => {
    navigate('/student');
  };

  // Sample academic records for demo
  const sampleRecords: AcademicRecord[] = [
    {
      term: "Fall",
      year: "2023",
      gpa: 3.7,
      status: "completed",
      credits: 15,
      totalCredits: 15
    },
    {
      term: "Spring",
      year: "2024",
      gpa: 3.8,
      status: "in-progress",
      credits: 12,
      totalCredits: 18
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1" 
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Student Profile</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Profile info */}
        <div className="md:col-span-1">
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={handleEditProfile}>
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col items-center mb-4">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="https://github.com/shadcn.png" alt={user.name || "Student"} />
                  <AvatarFallback>{user.name?.charAt(0) || "S"}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{user.name || "Student Name"}</h2>
                <p className="text-sm text-muted-foreground">Student ID: {user.studentId || "N/A"}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{user.email || "email@example.com"}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{user.phoneNumber || "+254 733 443 224"}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Nairobi, Kenya</span>
                </div>
                <div className="flex items-center">
                  <School className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{user.institutionName || "University of Nairobi"}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">BSc. Computer Science</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orphan Status Card */}
          <OrphanStatusCard orphanStatus={user.orphanStatus} />
        </div>
        
        {/* Right column - Tabs for different sections */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="academic">Academic</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
              
                <CardContent>
                  <TabsContent value="profile" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Profile Summary</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        This information will be displayed publicly so be careful what you share.
                      </p>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium">Nationality</h4>
                            <p className="text-sm">Kenyan</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">National ID / Passport</h4>
                            <p className="text-sm">********123</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Gender</h4>
                            <p className="text-sm">Male</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Date of Birth</h4>
                            <p className="text-sm">12 Jan 2000</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium">Primary Phone</h4>
                            <p className="text-sm">+254 123 456 789</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Secondary Phone</h4>
                            <p className="text-sm">+254 987 654 321</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Email Address</h4>
                            <p className="text-sm">{user.email || "email@example.com"}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Postal Address</h4>
                            <p className="text-sm">P.O. Box 123, Nairobi</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Next of Kin</h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium">Full Name</h4>
                            <p className="text-sm">Jane Doe</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Relationship</h4>
                            <p className="text-sm">Mother</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Phone Number</h4>
                            <p className="text-sm">+254 111 222 333</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Address</h4>
                            <p className="text-sm">Nairobi, Kenya</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="academic" className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Academic Records</h3>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Record
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Academic Record</DialogTitle>
                              <DialogDescription>
                                Add details of your academic performance for the term.
                              </DialogDescription>
                            </DialogHeader>
                            <AcademicRecordForm 
                              onSave={handleSaveAcademicRecord} 
                              onCancel={handleCancelAcademicRecord}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <AcademicRecordsCard 
                        studentId={user.studentId || ""}
                        institutionName={user.institutionName || ""}
                        institutionType="University"
                        program="Computer Science"
                        startDate="2022-09-01"
                        expectedGraduation="2025-12-15"
                        currentYear={3}
                        totalYears={4}
                        semester="2nd Semester"
                        records={sampleRecords}
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Current Program</h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium">Institution</h4>
                            <p className="text-sm">{user.institutionName || "University of Nairobi"}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Program</h4>
                            <p className="text-sm">BSc. Computer Science</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Year of Study</h4>
                            <p className="text-sm">3rd Year</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Expected Graduation</h4>
                            <p className="text-sm">Dec 2025</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Previous Education</h3>
                      <div className="bg-muted p-4 rounded-lg mb-4">
                        <div className="flex justify-between mb-2">
                          <h4 className="text-sm font-medium">Secondary School</h4>
                          <Badge>2016 - 2019</Badge>
                        </div>
                        <p className="text-sm">Alliance High School</p>
                        <p className="text-sm text-muted-foreground">Kenya Certificate of Secondary Education (KCSE)</p>
                        <p className="text-sm font-medium mt-1">Grade: A (81.2 points)</p>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <h4 className="text-sm font-medium">Primary School</h4>
                          <Badge>2008 - 2015</Badge>
                        </div>
                        <p className="text-sm">St. Mary's Primary School</p>
                        <p className="text-sm text-muted-foreground">Kenya Certificate of Primary Education (KCPE)</p>
                        <p className="text-sm font-medium mt-1">Marks: 410/500</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="documents" className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">My Documents</h3>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Document
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Upload Document</DialogTitle>
                              <DialogDescription>
                                Upload important documents related to your application or personal records.
                              </DialogDescription>
                            </DialogHeader>
                            <DocumentUploadForm 
                              onUpload={handleUploadDocument}
                              onCancel={handleCancelUpload}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Document Type</TableHead>
                                <TableHead>Date Uploaded</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-blue-500" />
                                  <span>National ID</span>
                                </TableCell>
                                <TableCell>12 Jan 2023</TableCell>
                                <TableCell>
                                  <Badge className="bg-green-500">Verified</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end space-x-1">
                                    <Button variant="ghost" size="icon">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-blue-500" />
                                  <span>Birth Certificate</span>
                                </TableCell>
                                <TableCell>10 Jan 2023</TableCell>
                                <TableCell>
                                  <Badge className="bg-green-500">Verified</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end space-x-1">
                                    <Button variant="ghost" size="icon">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-orange-500" />
                                  <span>Academic Transcript</span>
                                </TableCell>
                                <TableCell>15 Feb 2023</TableCell>
                                <TableCell>
                                  <Badge className="bg-orange-500">Pending</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end space-x-1">
                                    <Button variant="ghost" size="icon">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-blue-500" />
                                  <span>Fee Structure</span>
                                </TableCell>
                                <TableCell>20 Jan 2023</TableCell>
                                <TableCell>
                                  <Badge className="bg-green-500">Verified</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end space-x-1">
                                    <Button variant="ghost" size="icon">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="security" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-sm font-medium">Change Password</h4>
                              <p className="text-xs text-muted-foreground">Update your account password</p>
                            </div>
                            <Button variant="outline" size="sm">Change</Button>
                          </div>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                              <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                            </div>
                            <Button variant="outline" size="sm">Enable</Button>
                          </div>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-sm font-medium">Account Recovery</h4>
                              <p className="text-xs text-muted-foreground">Setup recovery options</p>
                            </div>
                            <Button variant="outline" size="sm">Setup</Button>
                          </div>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-sm font-medium">Login History</h4>
                              <p className="text-xs text-muted-foreground">View recent login activity</p>
                            </div>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
