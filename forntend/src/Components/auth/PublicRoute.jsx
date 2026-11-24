// src/components/auth/PublicRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useGetCurrentUserQuery } from '../../redux/services/authApi';

const PublicRoute = () => {
  const { data, isLoading } = useGetCurrentUserQuery();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  // Agar user authenticated hai (success response aya hai), toh Home Redirect kar do
  if (data?.data) {
    return <Navigate to="/" replace />;
  }

  // Agar user logged in nahi hai, toh Register/Login Form show hone do
  return <Outlet />;
};

export default PublicRoute;