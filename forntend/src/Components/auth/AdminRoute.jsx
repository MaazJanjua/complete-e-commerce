// // import React from 'react'
// // import { useSelector } from 'react-redux'

// // const AdminRoute = () => {

// //     //Redux auth state se user info fetch kerna 
// //     const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth)

// //     if (isLoading) {
// //         return (
// //             <div className='min-h-screen flex items-center justify-center bg-gray-50'>
// //                 <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black'>

// //                 </div>
// //             </div>
// //         )
// //     }


// //     //Role-based Access Check (Database Role:"admin"
// //     const isAmin = isAuthenticated && user?.role === 'admin'

// //     return isAmin ? <Outlet /> : <Navigate to="/login" replace />
// // }

// // export default AdminRoute;



// // src/Components/auth/AdminRoute.jsx
// // import React from 'react';
// // import { Navigate, Outlet } from 'react-router-dom';
// // import { useSelector } from 'react-redux';

// // const AdminRoute = () => {
// //     // Safe extraction with default empty object fallback
// //     const authState = useSelector((state) => state?.auth) || {};
// //     const { user, isAuthenticated, isLoading } = authState;

// //     // Loading State
// //     if (isLoading) {
// //         return (
// //             <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //                 <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
// //             </div>
// //         );
// //     }

// //     // Admin Access Check
// //     const isAdmin = Boolean(isAuthenticated && user?.role === 'admin');

// //     return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
// // };

// // export default AdminRoute;

// // src/Components/auth/AdminRoute.jsx
// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom'; // <-- Corrected import
// import { useSelector } from 'react-redux';

// const AdminRoute = () => {
//     // const authState = useSelector((state) => state?.auth) || {};

//     // ✅ Sahi
//     const authState = useSelector((state) => state.auth);
//     const user = authState?.user;
//     const isAuthenticated = authState?.isAuthenticated;
//     const isLoading = authState?.isLoading;

//     // const { user, isAuthenticated, isLoading } = authState;

//     if (isLoading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
//             </div>
//         );
//     }

//     // Role Check
//     const isAdmin = Boolean(isAuthenticated && user?.role === 'admin');

//     return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default AdminRoute;



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