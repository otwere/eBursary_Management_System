
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();

  useEffect(() => {
    // Safe redirection with better null checks
    if (authState?.isAuthenticated && authState?.user?.role) {
      // If user is authenticated and role exists, redirect to their dashboard
      navigate(`/${authState.user.role}`);
    } else {
      // Otherwise redirect to login
      navigate("/login");
    }
  }, [authState, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em]" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2 text-sm text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
