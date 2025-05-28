
import React from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  type?: "login" | "register" | "forgot-password";
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  type = "login" 
}) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-8 bg-white/90">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-2xl font-bold text-primary-600">
            eBursary Management System
          </h1>
          <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight  text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-center text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          {children}

          <div className="mt-6 text-center text-sm">
            {type === "login" && (
              <>
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  Register
                </Link>
              </>
            )}
            {type === "register" && (
              <>
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign in
                </Link>
              </>
            )}
            {type === "forgot-password" && (
              <>
                Remember your password?{" "}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  Back to login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Image/Banner */}
      <div className="hidden lg:flex flex-1 relative bg-primary-500 overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 z-10">
          <h2 className="text-3xl font-bold mb-4">Welcome to eBursary Portal </h2>
          <p className="text-lg text-center max-w-md">
            The Integrated Platform for  students to Apply for Bursary & Scholarship Opportunities,
            streamlining the Application , Approval & Disbursement Process.
          </p>
          <div className="mt-12 bg-white/10 backdrop-blur-sm p-4 rounded border border-white/20">
            <p className="text-xl font-medium mb-2">Empowering Education Through Support</p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Easy Application Process
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Track Application Status
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Transparent Fund Approval and Allocation
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Secure and Reliable Platform
              </li>
            </ul>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700/90 to-primary-500/80"></div>
        <div className="absolute inset-0">
          <svg className="opacity-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,224C672,235,768,213,864,186.7C960,160,1056,128,1152,122.7C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          <svg className="opacity-10 absolute bottom-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" d="M0,32L48,53.3C96,75,192,117,288,133.3C384,149,480,139,576,144C672,149,768,171,864,176C960,181,1056,171,1152,144C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
