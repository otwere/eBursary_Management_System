import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const success = await login(email, password);

      if (success) {
        toast({
          title: "Success!",
          description: "You have successfully logged in.",
        });

        // Check the stored user to navigate to the correct dashboard
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          navigate(`/${user.role}`);
        } else {
          navigate("/student");
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Enter your credentials below to access your eBursary account."
      type="login"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Email address</Label>
          <div className="mt-2">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="role@ebursary.co.ke"
            />
          </div>
        </div>

        <div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Button
                variant="link"
                className="p-0 text-xs"
                type="button"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot your password?
              </Button>
            </div>
            <div className="mt-2">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white/90 px-2 text-gray-500">Demo Accounts</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm text-center">
          <div className="p-2 border rounded">
            <p className="font-medium">Student :</p>
            <p>Email : student@ebursary.co.ke</p>
          </div>
          <div className="p-2 border rounded">
            <p className="font-medium">Application Review Officer (ARO):</p>
            <p>Email : aro@ebursary.co.ke</p>
          </div>
          <div className="p-2 border rounded">
            <p className="font-medium">Funds Manager (FAO):</p>
            <p>Email : fao@ebursary.co.ke</p>
          </div>
          <div className="p-2 border rounded">
            <p className="font-medium">Funds Disbursement Officer (FAO):</p>
            <p>Email : fdo@ebursary.co.ke</p>
          </div>
          <div className="p-2 border rounded">
            <p className="font-medium">Super Admin:</p>
            <p>Email : admin@ebursary.co.ke</p>
          </div>

          <p className="text-xs text-gray-500">All demo accounts use "Password" as password</p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;