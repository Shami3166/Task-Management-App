import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RegisterForm from "../components/RegisterForm";

const Register: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-emerald-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-green-600 bg-clip-text text-transparent mb-2">
            TaskFlow
          </h1>
          <p className="text-muted-foreground">Join us and start organizing</p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
