import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import RouterDom from ''
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

import PublicRoute from './Components/auth/PublicRoute.jsx'
import ProtectedRoute from './Components/auth/ProtectedRoute.jsx'
import Profile from './Pages/Profile/Profile.jsx'

import { store } from './redux/store.js'
// THEME IMPORT
import './styles/theme.css'

// pages imports 
import Home from './Home.jsx'
import { Provider } from 'react-redux'
import Register from './Components/Register/Register.jsx'
import Login from './Components/Login/Login.jsx'


// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<App />}>
//       <Route index element={<Home />} />

//       <Route path="register" element={<Register />} />
//       <Route path='login' element={<Login />} />
//     </Route>
//   )
// )
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>

      {/* Home Public Page */}
      <Route index element={<Home />} />

      {/* Routes only for users who are NOT logged in/Guest Users */}
      <Route element={<PublicRoute />}>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route> 


      {/* Routes ONLY for Logged In Users */}
      <Route element={<ProtectedRoute />}>
        <Route path="account" element={<Profile />} />
      </Route>

    </Route>
  )
);




createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <UserContextProvider> */}
      <RouterProvider router={router} />
    </Provider>
    {/* </UserContextProvider> */}
  </React.StrictMode>,
)
