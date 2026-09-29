// forntend/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux'; // 1. Import useDispatch

import { 
    useGetCurrentUserQuery, 
    useUpdateProfileMutation, 
    useLogoutUserMutation,
    authApi // 2. Import authApi service
} from '../../redux/services/authApi';
import Input from '../../Components/ui/Input';
import Button from '../../Components/ui/Button';

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch(); // 3. Initialize dispatch

    // RTK Query Hooks
    const { data, isLoading } = useGetCurrentUserQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

    // UI States
    const [activeTab, setActiveTab] = useState('profile');
    const [apiSuccess, setApiSuccess] = useState('');
    const [apiError, setApiError] = useState('');

    const user = data?.data;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // Form Populate on Data Arrival
    useEffect(() => {
        if (user) {
            reset({
                fullName: user.fullName || '',
                email: user.email || '',
            });
        }
    }, [user, reset]);

    // Profile Details Update Handler
    const onSubmit = async (formData) => {
        setApiSuccess('');
        setApiError('');
        try {
            await updateProfile(formData).unwrap();
            setApiSuccess('Profile details successfully updated!');
        } catch (err) {
            setApiError(err?.data?.message || 'Failed to update profile.');
        }
    };

    // Logout Handler (Cache Reset Fixed)
    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            
            // 4. Force Reset RTK Query Cache State for instant UI refresh
            dispatch(authApi.util.resetApiState());
            
            navigate('/login');
        } catch (error) {
            console.error('Profile Logout Failed:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Loading Profile Details...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-[89vw] mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Left Sidebar / Tabs */}
                <div className="w-full md:w-1/4 bg-white border border-gray-200 p-6 rounded shadow-sm self-start">
                    <div className="flex items-center space-x-3 pb-6 mb-6 border-b border-gray-100">
                        <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg uppercase relative">
                            {user?.username?.[0] || 'U'}
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-sm text-gray-900">{user?.fullName || user?.username}</h3>
                                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider ${user?.role === 'admin'
                                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                                    }`}>
                                    {user?.role || 'Customer'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('profile')}
                            className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded transition ${activeTab === 'profile'
                                ? 'bg-black text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Account Details
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('orders')}
                            className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded transition ${activeTab === 'orders'
                                ? 'bg-black text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            My Orders
                        </button>
                    </nav>

                    {/* Redesigned Clean Logout Block */}
                    <div className="pt-6 mt-6 border-t border-gray-100">
                        <Button
                            type="button"
                            variant="danger"
                            isLoading={isLoggingOut}
                            onClick={handleLogout}
                            className="w-full py-2! text-xs! flex items-center justify-center space-x-2"
                        >
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </Button>
                    </div>

                </div>

                {/* Right Content Area */}
                <div className="w-full md:w-3/4 bg-white border border-gray-200 p-6 md:p-8 rounded shadow-sm">
                    {activeTab === 'profile' && (
                        <div>
                            <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 mb-6 pb-2 border-b flex justify-between items-center">
                                <span>Edit Profile</span>
                                <span className="text-xs font-semibold text-gray-400 normal-case">
                                    Account Role: <strong className="uppercase text-black">{user?.role || 'Customer'}</strong>
                                </span>
                            </h2>

                            {apiSuccess && (
                                <div className="mb-4 text-xs font-semibold text-green-600 bg-green-50 p-3 rounded border border-green-200">
                                    {apiSuccess}
                                </div>
                            )}
                            {apiError && (
                                <div className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded border border-red-200">
                                    {apiError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
                                <Input
                                    label="Username"
                                    type="text"
                                    value={user?.username || ''}
                                    disabled
                                />

                                <Input
                                    label="User Role"
                                    type="text"
                                    value={user?.role?.toUpperCase() || 'CUSTOMER'}
                                    disabled
                                />

                                <Input
                                    label="Full Name"
                                    type="text"
                                    {...register('fullName', { required: 'Full name is required' })}
                                    error={errors.fullName?.message}
                                />

                                <Input
                                    label="Email Address"
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                    error={errors.email?.message}
                                />

                                <Button type="submit" isLoading={isUpdating} fullWidth={false} className="px-8">
                                    Save Changes
                                </Button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div>
                            <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 mb-6 pb-2 border-b">
                                Order History
                            </h2>
                            <p className="text-xs text-gray-500">
                                No orders placed yet. Products & Order system integrate hone ke baad yahan orders list honge.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Profile;