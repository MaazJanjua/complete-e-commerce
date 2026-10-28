// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { store } from './redux/store.js';

// import './index.css';
// import './styles/theme.css';

// // Core App Layout & Pages
// import App from './App.jsx';
// import Home from './Home.jsx';
// import Profile from './Pages/Profile/Profile.jsx';
// import Register from './Components/Register/Register.jsx';
// import Login from './Components/Login/Login.jsx';

// // Auth Guards
// import PublicRoute from './Components/auth/PublicRoute.jsx';
// import ProtectedRoute from './Components/auth/ProtectedRoute.jsx';
// import AdminRoute from './Components/auth/AdminRoute.jsx';

// // Admin Panel Layout & Pages (REAL IMPORTS)
// import AdminLayout from './Pages/Admin/AdminLayout.jsx';
// import CreateProduct from './Pages/Admin/CreateProducts.jsx'; // <-- Real Styled Form Import
// import ManageProducts from './Pages/Admin/ManageProduct.jsx';
// import Categories from './Pages/Admin/Categories.jsx';
// import AdminDashboard from './Pages/Admin/AdminDashboard.jsx'



// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//       {/* Storefront Routes (Storefront Navbar & Footer inside App) */}
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

//       {/* Admin Protected Routes (Isolated Admin Dashboard Layout) */}
//       <Route element={<AdminRoute />}>
//         <Route path="/admin" element={<AdminLayout />}>
//           <Route index element={<AdminDashboard />} />
//           <Route path="dashboard" element={<AdminDashboard />} />
//           <Route path="products" element={<ManageProducts />} />
//           <Route path="products/create" element={<CreateProduct />} />
//           <Route path='categories' element={<Categories />} />
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
//   </React.StrictMode>
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

// Admin Panel Layout & Pages
import AdminLayout from './Pages/Admin/AdminLayout.jsx';
import CreateProduct from './Pages/Admin/CreateProducts.jsx';
import ManageProducts from './Pages/Admin/ManageProduct.jsx';
import Categories from './Pages/Admin/Categories.jsx';
import AdminDashboard from './Pages/Admin/AdminDashboard.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Storefront Routes */}
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

      {/* Admin Protected Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="categories" element={<Categories />} />
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