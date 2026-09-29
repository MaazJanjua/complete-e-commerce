// forntend/src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useGetCurrentUserQuery } from '../../redux/services/authApi';

const ProtectedRoute = () => {
    const { data, isLoading } = useGetCurrentUserQuery();

    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Verifying Session...
                </p>
            </div>
        );
    }

    // Agar user logged in NAHI hai, toh Login page par bhej do
    if (!data?.data) {
        return <Navigate to="/login" replace />;
    }

    // User logged in hai, protected component access karne do
    return <Outlet />;
};

export default ProtectedRoute;