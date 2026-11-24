// src/Components/auth/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetCurrentUserQuery } from '../../redux/services/authApi';

const AdminRoute = () => {
    // 1. Fetch live user data via RTK Query
    const { data, isLoading: isApiLoading } = useGetCurrentUserQuery();
    
    // 2. Redux state as fallback
    const authState = useSelector((state) => state.auth);
    
    // Combine user references
    const currentUser = data?.data || authState?.user;

    // Loading State: Wait jab tak user fetch ho raha hai
    if (isApiLoading || authState?.isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    // Role verification
    const isAdmin = currentUser?.role === 'admin';

    return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;