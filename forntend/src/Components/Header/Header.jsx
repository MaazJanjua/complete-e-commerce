// import React, { useState } from 'react';
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
// import Logo from '../ui/Logo';
// import { useGetCurrentUserQuery, useLogoutUserMutation, authApi } from '../../redux/services/authApi';
// import Button from '../ui/Button';
// import { useDispatch, useSelector } from 'react-redux';

// const Header = () => {
//   // 1. Redux Auth State
//   const authState = useSelector((state) => state.auth);
//   const reduxUser = authState?.user;

//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // 2. RTK Query hooks for Auth state
//   const { data, isLoading } = useGetCurrentUserQuery();
//   const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

//   // Single Source of Truth for User & Derived Authentication Status
//   const currentUser = data?.data || reduxUser;
//   const isAuthenticated = Boolean(currentUser);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleLogout = async () => {
//     try {
//       await logoutUser().unwrap();

//       // Clear RTK Query cache so header updates immediately
//       dispatch(authApi.util.resetApiState());

//       setIsMenuOpen(false);
//       navigate('/');
//     } catch (err) {
//       console.error('Logout failed:', err);
//     }
//   };

//   // Base navigation links
//   const baseNavLinks = [
//     { name: 'Home', path: '/' },
//     { name: 'T-Shirt', path: '/Shirts' },
//     { name: 'Trousers', path: '/trousers' },
//     { name: 'About', path: '/about' },
//     { name: 'Contact', path: '/contact' },
//   ];

//   return (
//     <header className="bg-white shadow-md sticky top-0 z-50 w-full">
//       <div className="max-w-[89vw] mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16 md:h-20">

//           {/* Logo */}
//           <Link
//             to="/"
//             className="shrink-0 flex items-center space-x-2"
//             aria-label="Homepage"
//           >
//             <Logo />
//           </Link>

//           <div className="flex items-center space-x-4">

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main navigation">
//               {baseNavLinks.map((link) => (
//                 <NavLink
//                   key={link.name}
//                   to={link.path}
//                   className={({ isActive }) =>
//                     `px-3 py-2 text-base font-bold rounded-lg transition-all duration-200 ${
//                       isActive
//                         ? 'text-black bg-blue-50'
//                         : 'text-[#090909] hover:text-blue-600 hover:bg-gray-50'
//                     }`
//                   }
//                 >
//                   {link.name}
//                 </NavLink>
//               ))}

//               {/* DYNAMIC AUTH LINKS FOR DESKTOP */}
//               {isLoading ? (
//                 <span className="text-xs text-gray-400 px-2">Loading...</span>
//               ) : !isAuthenticated ? (
//                 /* Not Logged In -> Show Login & Signup */
//                 <>
//                   <NavLink
//                     to="/login"
//                     className={({ isActive }) =>
//                       `px-3 py-2 text-base font-bold rounded-lg transition-all duration-200 ${
//                         isActive ? 'text-black bg-blue-50' : 'text-[#090909] hover:text-blue-600 hover:bg-gray-50'
//                       }`
//                     }
//                   >
//                     Login
//                   </NavLink>
//                   <NavLink
//                     to="/register"
//                     className={({ isActive }) =>
//                       `px-3 py-2 text-base font-bold rounded-lg transition-all duration-200 ${
//                         isActive ? 'text-black bg-blue-50' : 'text-[#090909] hover:text-blue-600 hover:bg-gray-50'
//                       }`
//                     }
//                   >
//                     Signup
//                   </NavLink>
//                 </>
//               ) : null}
//             </nav>

//             {/* Admin Quick Action Button (Desktop) */}
//             {currentUser?.role === 'admin' && (
//               <div className="hidden md:flex items-center">
//                 <Link
//                   to="/admin/dashboard"
//                   className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider hover:bg-gray-800 transition-all"
//                 >
//                   Admin Dashboard
//                 </Link>
//               </div>
//             )}

//             {/* Desktop Actions */}
//             <div className="hidden md:flex items-center space-x-3">
//               {/* Search icon */}
//               <button
//                 className="p-2 text-[#090909] hover:bg-gray-100 rounded-full transition-all duration-200"
//                 aria-label="Search"
//               >
//                 <FaSearch className="w-4 h-4" />
//               </button>

//               {/* Cart */}
//               <Link
//                 to="/cart"
//                 className="p-2 text-[#090909] hover:bg-gray-100 rounded-full transition-all duration-200 relative"
//                 aria-label="Shopping cart"
//               >
//                 <FaShoppingCart className="w-5 h-5" />
//                 <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
//                   3
//                 </span>
//               </Link>

//               {/* Profile / Logout Actions */}
//               {isAuthenticated && (
//                 <div className="flex items-center space-x-2 border-l pl-3 ml-1">
//                   <Link
//                     to="/account"
//                     className="p-2 text-[#090909] hover:bg-gray-100 rounded-full transition-all duration-200"
//                     title={`Logged in as ${currentUser.username || currentUser.fullName || 'User'}`}
//                   >
//                     <FaUser className="w-4 h-4" />
//                   </Link>

//                   <Button
//                     type="button"
//                     variant="danger"
//                     isLoading={isLoggingOut}
//                     onClick={handleLogout}
//                     className="w-auto py-1.5! px-3! text-xs! flex items-center justify-center space-x-1"
//                   >
//                     <FaSignOutAlt />
//                     <span>Logout</span>
//                   </Button>
//                 </div>
//               )}
//             </div>

//             {/* Mobile Menu Toggle Button */}
//             <button
//               onClick={toggleMenu}
//               className="md:hidden p-2 rounded-lg text-[#090909] hover:bg-gray-50 transition-all duration-200"
//               aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
//             >
//               {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Drawer Navigation */}
//       <div
//         className={`md:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${
//           isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//         }`}
//       >
//         <div className="px-4 py-3 space-y-1">
//           {baseNavLinks.map((link) => (
//             <NavLink
//               key={link.name}
//               to={link.path}
//               onClick={() => setIsMenuOpen(false)}
//               className={({ isActive }) =>
//                 `block px-4 py-2.5 text-base font-medium rounded-lg transition-all duration-200 ${
//                   isActive ? 'text-black bg-blue-50 font-bold' : 'text-[#090909] hover:bg-gray-50'
//                 }`
//               }
//             >
//               {link.name}
//             </NavLink>
//           ))}

//           {/* Admin Dashboard Link for Mobile Drawer */}
//           {currentUser?.role === 'admin' && (
//             <Link
//               to="/admin/dashboard"
//               onClick={() => setIsMenuOpen(false)}
//               className="block px-4 py-2.5 text-base font-bold text-white bg-black rounded-lg text-center my-1"
//             >
//               Admin Dashboard
//             </Link>
//           )}

//           {!isAuthenticated && (
//             <>
//               <NavLink
//                 to="/login"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="block px-4 py-2.5 text-base font-medium text-[#090909] hover:bg-gray-50 rounded-lg"
//               >
//                 Login
//               </NavLink>
//               <NavLink
//                 to="/register"
//                 onClick={() => setIsMenuOpen(false)}
//                 className="block px-4 py-2.5 text-base font-medium text-[#090909] hover:bg-gray-50 rounded-lg"
//               >
//                 Signup
//               </NavLink>
//             </>
//           )}

//           {/* Mobile Actions */}
//           <div className="flex items-center space-x-2 pt-3 mt-2 border-t border-gray-100">
//             <Link
//               to="/cart"
//               className="flex-1 flex items-center justify-center px-4 py-2 text-[#090909] hover:bg-gray-50 rounded-lg relative"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               <FaShoppingCart className="w-4 h-4 mr-2" />
//               <span>Cart (3)</span>
//             </Link>

//             {isAuthenticated ? (
//               <button
//                 onClick={handleLogout}
//                 disabled={isLoggingOut}
//                 className="flex-1 flex items-center justify-center px-4 py-2 text-red-600 bg-red-50 rounded-lg font-medium"
//               >
//                 <FaSignOutAlt className="mr-2" />
//                 <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
//               </button>
//             ) : (
//               <Link
//                 to="/login"
//                 className="flex-1 flex items-center justify-center px-4 py-2 text-[#090909] hover:bg-gray-50 rounded-lg"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 <FaUser className="w-4 h-4 mr-2" />
//                 <span>Account</span>
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;











import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaHeart,
  FaBoxOpen
} from 'react-icons/fa';
import Logo from '../ui/Logo';
import { useGetCurrentUserQuery, useLogoutUserMutation, authApi } from '../../redux/services/authApi';
import { useGetCartQuery, useGetWishlistQuery, productApi } from '../../redux/services/productApi';
import Button from '../ui/Button';
import { useDispatch, useSelector } from 'react-redux';

const Header = () => {
  // 1. Redux Auth State
  // const authState = useSelector((state) => state.auth);
  // const reduxUser = authState?.user;
  const reduxUser = useSelector((state) => state.auth?.user);


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 2. RTK Query hooks for Auth state
  const { data, isLoading } = useGetCurrentUserQuery();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

  const currentUser = data?.data || reduxUser;
  const isAuthenticated = Boolean(currentUser);

  // 3. Live Cart & Wishlist Counts (Only fetch when authenticated)
  const { data: cartData } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });

  const cartItems = cartData?.data?.items || [];
  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const wishlistCount = wishlistData?.data?.products?.length || 0;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();

      // Clear both Auth and Shop/Cart RTK Query caches immediately
      dispatch(authApi.util.resetApiState());
      dispatch(productApi.util.resetApiState());

      setIsMenuOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Base navigation links (Aligned with /category/:slug routes)
  const baseNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'T-Shirt', path: '/category/t-shirts' },
    { name: 'Trousers', path: '/category/trousers' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-[89vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 flex items-center space-x-2"
            aria-label="Homepage"
          >
            <Logo />
          </Link>

          <div className="flex items-center space-x-4">

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main navigation">
              {baseNavLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 text-base font-bold rounded-lg transition-all duration-200 ${isActive
                      ? 'text-black bg-blue-50'
                      : 'text-[#090909] hover:text-blue-600 hover:bg-gray-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {/* DYNAMIC AUTH LINKS FOR DESKTOP */}
              {isLoading ? (
                <span className="text-xs text-gray-400 px-2">Loading...</span>
              ) : !isAuthenticated ? (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `px-3 py-2 text-base font-bold rounded-lg transition-all duration-200 ${isActive ? 'text-black bg-blue-50' : 'text-[#090909] hover:text-blue-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `px-3 py-2 text-base font-bold rounded-lg transition-all duration-200 ${isActive ? 'text-black bg-blue-50' : 'text-[#090909] hover:text-blue-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    Signup
                  </NavLink>
                </>
              ) : null}
            </nav>

            {/* Admin Quick Action Button (Desktop) */}
            {currentUser?.role === 'admin' && (
              <div className="hidden md:flex items-center">
                <Link
                  to="/admin/dashboard"
                  className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider hover:bg-gray-800 transition-all"
                >
                  Admin Dashboard
                </Link>
              </div>
            )}

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Search icon */}
              <button
                className="p-2 text-[#090909] hover:bg-gray-100 rounded-full transition-all duration-200"
                aria-label="Search"
              >
                <FaSearch className="w-4 h-4" />
              </button>

              {/* Wishlist Icon + Live Badge */}
              <Link
                to="/wishlist"
                className="p-2 text-[#090909] hover:bg-gray-100 rounded-full transition-all duration-200 relative"
                aria-label="Wishlist"
                title="My Wishlist"
              >
                <FaHeart className="w-4 h-4" />
                {isAuthenticated && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon + Live Badge */}
              <Link
                to="/cart"
                className="p-2 text-[#090909] hover:bg-gray-100 rounded-full transition-all duration-200 relative"
                aria-label="Shopping cart"
                title="Shopping Cart"
              >
                <FaShoppingCart className="w-5 h-5" />
                {isAuthenticated && totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {totalCartCount}
                  </span>
                )}
              </Link>

              {/* Orders, Profile & Logout Actions */}
              {isAuthenticated && (
                <div className="flex items-center space-x-2 border-l pl-3 ml-1">
                  <Link
                    to="/orders"
                    className="p-2 text-[#090909] hover:bg-gray-100 rounded-full transition-all duration-200"
                    title="My Orders & Tracking"
                  >
                    <FaBoxOpen className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/account"
                    className="p-2 text-[#090909] hover:bg-gray-100 rounded-full transition-all duration-200"
                    title={`Logged in as ${currentUser.username || currentUser.fullName || 'User'}`}
                  >
                    <FaUser className="w-4 h-4" />
                  </Link>

                  <Button
                    type="button"
                    variant="danger"
                    isLoading={isLoggingOut}
                    onClick={handleLogout}
                    className="w-auto py-1.5! px-3! text-xs! flex items-center justify-center space-x-1"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-[#090909] hover:bg-gray-50 transition-all duration-200"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <div
        className={`md:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-4 py-3 space-y-1">
          {baseNavLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 text-base font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-black bg-blue-50 font-bold' : 'text-[#090909] hover:bg-gray-50'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* Logged-in User Quick Links (Mobile) */}
          {isAuthenticated && (
            <>
              <NavLink
                to="/orders"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-base font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-black bg-blue-50 font-bold' : 'text-[#090909] hover:bg-gray-50'
                  }`
                }
              >
                My Orders & Tracking
              </NavLink>
              <NavLink
                to="/account"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-base font-medium rounded-lg transition-all duration-200 ${isActive ? 'text-black bg-blue-50 font-bold' : 'text-[#090909] hover:bg-gray-50'
                  }`
                }
              >
                My Profile
              </NavLink>
            </>
          )}

          {/* Admin Dashboard Link for Mobile Drawer */}
          {currentUser?.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2.5 text-base font-bold text-white bg-black rounded-lg text-center my-1"
            >
              Admin Dashboard
            </Link>
          )}

          {!isAuthenticated && (
            <>
              <NavLink
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2.5 text-base font-medium text-[#090909] hover:bg-gray-50 rounded-lg"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2.5 text-base font-medium text-[#090909] hover:bg-gray-50 rounded-lg"
              >
                Signup
              </NavLink>
            </>
          )}

          {/* Mobile Bottom Actions: Wishlist, Cart & Logout */}
          <div className="flex items-center space-x-2 pt-3 mt-2 border-t border-gray-100">
            <Link
              to="/wishlist"
              className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-bold text-[#090909] bg-gray-50 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaHeart className="w-3.5 h-3.5 mr-1.5 text-red-600" />
              <span>Wishlist ({isAuthenticated ? wishlistCount : 0})</span>
            </Link>

            <Link
              to="/cart"
              className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-bold text-[#090909] bg-gray-50 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaShoppingCart className="w-3.5 h-3.5 mr-1.5" />
              <span>Cart ({isAuthenticated ? totalCartCount : 0})</span>
            </Link>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 flex items-center justify-center px-3 py-2 text-xs text-red-600 bg-red-50 rounded-lg font-bold"
              >
                <FaSignOutAlt className="mr-1.5" />
                <span>{isLoggingOut ? '...' : 'Logout'}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-bold text-[#090909] bg-gray-50 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUser className="w-3.5 h-3.5 mr-1.5" />
                <span>Account</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;