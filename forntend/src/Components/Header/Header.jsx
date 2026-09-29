import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import Logo from '../ui/Logo';
import { useGetCurrentUserQuery, useLogoutUserMutation } from '../../redux/services/authApi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // RTK Query hooks for Auth state
  const { data, isLoading } = useGetCurrentUserQuery();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

  const user = data?.data; // Express Api response structure

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      setIsMenuOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Base navigation links (Common for everyone)
  const baseNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'T-Shirt', path: '/Shirts' },
    { name: 'Trousers', path: '/trousers' },
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
                    `px-3 py-2 text-base font-bold rounded-lg transition-all duration-200 
                    ${isActive
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
              ) : !user ? (
                /* Not Logged In -> Show Login & Signup */
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `px-3 py-2 text-base font-bold rounded-lg transition-all duration-200 
                      ${isActive ? 'text-black bg-blue-50' : 'text-[#090909] hover:text-blue-600 hover:bg-gray-50'}`
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `px-3 py-2 text-base font-bold rounded-lg transition-all duration-200 
                      ${isActive ? 'text-black bg-blue-50' : 'text-[#090909] hover:text-blue-600 hover:bg-gray-50'}`
                    }
                  >
                    Signup
                  </NavLink>
                </>
              ) : null}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Search icon */}
              <button
                className="p-2 text-[#090909] hover:bg-gray-100 rounded-full transition-all duration-200"
                aria-label="Search"
              >
                <FaSearch className="w-4 h-4" />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2 text-[#090909] hover:bg-gray-100 rounded-full transition-all duration-200 relative"
                aria-label="Shopping cart"
              >
                <FaShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  3
                </span>
              </Link>

              {/* Profile / Logout Actions */}
              {user && (
                <div className="flex items-center space-x-2 border-l pl-3 ml-1">
                  <Link
                    to="/account"
                    className="p-2 text-[#090909] hover:bg-gray-100 rounded-full transition-all duration-200"
                    title={`Logged in as ${user.username || user.fullName}`}
                  >
                    <FaUser className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center space-x-1 text-xs text-red-600 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-md hover:bg-red-600 hover:text-white transition-all font-semibold"
                    title="Logout"
                  >
                    <FaSignOutAlt />
                    <span>{isLoggingOut ? '...' : 'Logout'}</span>
                  </button>
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
        className={`md:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden
          ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 py-3 space-y-1">
          {baseNavLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 text-base font-medium rounded-lg transition-all duration-200
                ${isActive ? 'text-black bg-blue-50 font-bold' : 'text-[#090909] hover:bg-gray-50'}`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {!user && (
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

          {/* Mobile Actions */}
          <div className="flex items-center space-x-2 pt-3 mt-2 border-t border-gray-100">
            <Link
              to="/cart"
              className="flex-1 flex items-center justify-center px-4 py-2 text-[#090909] hover:bg-gray-50 rounded-lg relative"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaShoppingCart className="w-4 h-4 mr-2" />
              <span>Cart (3)</span>
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center px-4 py-2 text-red-600 bg-red-50 rounded-lg font-medium"
              >
                <FaSignOutAlt className="mr-2" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex-1 flex items-center justify-center px-4 py-2 text-[#090909] hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUser className="w-4 h-4 mr-2" />
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