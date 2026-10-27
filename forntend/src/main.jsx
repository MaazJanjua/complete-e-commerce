// // import React, { StrictMode } from 'react'
// // import { createRoot } from 'react-dom/client'
// // // import RouterDom from ''
// // import './index.css'
// // import App from './App.jsx'
// // import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

// // import PublicRoute from './Components/auth/PublicRoute.jsx'
// // import ProtectedRoute from './Components/auth/ProtectedRoute.jsx'
// // import Profile from './Pages/Profile/Profile.jsx'

// // import { store } from './redux/store.js'
// // // THEME IMPORT
// // import './styles/theme.css'

// // // pages imports 
// // import Home from './Home.jsx'
// // import { Provider } from 'react-redux'
// // import Register from './Components/Register/Register.jsx'
// // import Login from './Components/Login/Login.jsx'


// // // const router = createBrowserRouter(
// // //   createRoutesFromElements(
// // //     <Route path="/" element={<App />}>
// // //       <Route index element={<Home />} />

// // //       <Route path="register" element={<Register />} />
// // //       <Route path='login' element={<Login />} />
// // //     </Route>
// // //   )
// // // )
// // const router = createBrowserRouter(
// //   createRoutesFromElements(
// //     <Route path="/" element={<App />}>

// //       {/* Home Public Page */}
// //       <Route index element={<Home />} />

// //       {/* Routes only for users who are NOT logged in/Guest Users */}
// //       <Route element={<PublicRoute />}>
// //         <Route path="register" element={<Register />} />
// //         <Route path="login" element={<Login />} />
// //       </Route> 


// //       {/* Routes ONLY for Logged In Users */}
// //       <Route element={<ProtectedRoute />}>
// //         <Route path="account" element={<Profile />} />
// //       </Route>

// //     </Route>
// //   )
// // );




// // createRoot(document.getElementById('root')).render(
// //   <React.StrictMode>
// //     <Provider store={store}>
// //       {/* <UserContextProvider> */}
// //       <RouterProvider router={router} />
// //     </Provider>
// //     {/* </UserContextProvider> */}
// //   </React.StrictMode>,
// // )



// import React from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
// import { Provider } from 'react-redux'
// import { store } from './redux/store.js'

// // THEME IMPORT
// import './styles/theme.css'

// // Auth Protection Guards
// import PublicRoute from './Components/auth/PublicRoute.jsx'
// import ProtectedRoute from './Components/auth/ProtectedRoute.jsx'
// import AdminRoute from './Components/auth/AdminRoute.jsx' // <-- 1. Import AdminRoute

// // Pages & Components Imports
// import Home from './Home.jsx'
// import Profile from './Pages/Profile/Profile.jsx'
// import Register from './Components/Register/Register.jsx'
// import Login from './Components/Login/Login.jsx'

// // Admin Panel Imports
// import AdminLayout from './Pages/Admin/AdminLayout.jsx'
// // <-- 2. Import AdminLayout

// // Temporary Placeholder Admin Views
// const AdminDashboard = () => <div className="text-xl font-bold">Admin Dashboard</div>;
// const CreateProduct = () => <div className="text-xl font-bold">Create Product Form</div>;

// // const router = createBrowserRouter(
// //   createRoutesFromElements(
// //     <Route path="/" element={<App />}>

// //       {/* Home Public Page */}
// //       <Route index element={<Home />} />

// //       {/* Routes only for users who are NOT logged in / Guest Users */}
// //       <Route element={<PublicRoute />}>
// //         <Route path="register" element={<Register />} />
// //         <Route path="login" element={<Login />} />
// //       </Route> 

// //       {/* Routes ONLY for Logged In Normal Users */}
// //       <Route element={<ProtectedRoute />}>
// //         <Route path="account" element={<Profile />} />
// //       </Route>

// //       {/* Protected Admin Routes (Only accessible if role === 'admin') */}
// //       {/* <Route element={<AdminRoute />}> */}
// //         <Route path="admin" element={<AdminLayout />}>
// //           <Route index element={<AdminDashboard />} />
// //           <Route path="dashboard" element={<AdminDashboard />} />
// //           <Route path="products/create" element={<CreateProduct />} />
// //         </Route>
// //       {/* </Route> */}

// //     </Route>
// //   )
// // );

// // main.jsx
// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//       {/* Storefront Routes (Navbar & Footer included in App) */}
//       <Route path="/" element={<App />}>
//         <Route index element={<Home />} />

//         {/* Guest Only Routes */}
//         <Route element={<PublicRoute />}>
//           <Route path="register" element={<Register />} />
//           <Route path="login" element={<Login />} />
//         </Route>

//         {/* User Protected Routes */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="account" element={<Profile />} />
//         </Route>
//       </Route>

//       {/* Admin Protected Routes (No Storefront Navbar) */}
//       <Route element={<AdminRoute />}>
//         <Route path="/admin" element={<AdminLayout />}>
//           <Route index element={<AdminDashboard />} />
//           <Route path="dashboard" element={<AdminDashboard />} />
//           <Route path="products/create" element={<CreateProduct />} />
//         </Route>
//       </Route>
//     </>
//   )
// );

// createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <RouterProvider router={router} />
//     </Provider>
//   </React.StrictMode>,
// );



import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';

import './index.css';
import './styles/theme.css';

// Core App Layout & Pages
import App from './App.jsx';
import Home from './Home.jsx';
import Profile from './Pages/Profile/Profile.jsx';
import Register from './Components/Register/Register.jsx';
import Login from './Components/Login/Login.jsx';

// Auth Guards
import PublicRoute from './Components/auth/PublicRoute.jsx';
import ProtectedRoute from './Components/auth/ProtectedRoute.jsx';
import AdminRoute from './Components/auth/AdminRoute.jsx';

// Admin Panel Layout & Pages (REAL IMPORTS)
import AdminLayout from './Pages/Admin/AdminLayout.jsx';
import CreateProduct from './Pages/Admin/CreateProducts.jsx'; // <-- Real Styled Form Import
import ManageProducts from './Pages/Admin/ManageProduct.jsx';
import Categories from './Pages/Admin/Categories.jsx';

// Temporary Placeholder for Admin Dashboard until Dashboard page is built
const AdminDashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard View</h1>
  </div>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Storefront Routes (Storefront Navbar & Footer inside App) */}
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />

        {/* Guest Only Routes */}
        <Route element={<PublicRoute />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* User Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="account" element={<Profile />} />
        </Route>
      </Route>

      {/* Admin Protected Routes (Isolated Admin Dashboard Layout) */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path='categories' element={<Categories />} />
        </Route>
      </Route>
    </>
  )
);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);