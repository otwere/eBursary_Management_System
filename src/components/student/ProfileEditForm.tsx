
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/auth";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Save, X } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(500, { message: "Bio must not exceed 500 characters." }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileEditFormProps {
  user: User;
  onSave: (values: ProfileFormValues) => void;
  onCancel: () => void;
}

export function ProfileEditForm({ user, onSave, onCancel }: ProfileEditFormProps) {
  const { toast } = useToast();
  
  // Default values from user data
  const defaultValues: Partial<ProfileFormValues> = {
    name: user.name || "",
    email: user.email || "",
    phone: "+1 (555) 123-4567", // This would come from user data in a real app
    address: "123 University Ave, College Town, ST 12345", // This would come from user data in a real app
    bio: "Computer Science student with interest in AI and machine learning.", // This would come from user data
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    onSave(data);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} className="focus-visible:ring-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your.email@example.com" {...field} className="focus-visible:ring-primary" />
                </FormControl>
                <FormDescription>
                  This email will be used for communications.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} className="focus-visible:ring-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Home Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Street Name, City, State, Zip" {...field} className="focus-visible:ring-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us a bit about yourself" 
                  className="resize-none focus-visible:ring-primary min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                A brief description that will be visible on your profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter className="pt-4 gap-2">
          <Button type="button" variant="outline" onClick={onCancel} className="gap-1">
            <X size={16} />
            Cancel
          </Button>
          <Button type="submit" className="gap-1">
            <Save size={16} />
            Save Changes
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
