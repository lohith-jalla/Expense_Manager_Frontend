import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate=useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
    console.log('Logout clicked');
  };

  // Helper function to check if current route is active
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const isLoggedInUser = () => {
    const token = localStorage.getItem("jwtToken");
    return token !== null && token !== "";
  };

  // Helper function to get link classes
  const getLinkClasses = (path) => {
    const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    const activeClasses = "bg-indigo-100 text-indigo-700";
    const inactiveClasses = "text-gray-600 hover:text-indigo-600";
    
    return `${baseClasses} ${isActiveRoute(path) ? activeClasses : inactiveClasses}`;
  };

  const getMobileLinkClasses = (path) => {
    const baseClasses = "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200";
    const activeClasses = "bg-indigo-100 text-indigo-700";
    const inactiveClasses = "text-gray-600 hover:text-indigo-600";
    
    return `${baseClasses} ${isActiveRoute(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">ExpenseTracker</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isLoggedInUser() ? (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/dashboard"
                className={getLinkClasses('/dashboard')}
              >
                Dashboard
              </Link>
              <Link
                to="/expenses"
                className={getLinkClasses('/expenses')}
              >
                Expenses
              </Link>
              <Link
                to="/add-expense"
                className={getLinkClasses('/add-expense')}
              >
                Add Expense
              </Link>
              <Link
                to="/recurring"
                className={getLinkClasses('/recurring')}
              >
                Recurring
              </Link>
              <Link
                to="/add-recurring"
                className={getLinkClasses('/add-recurring')}
              >
                Add Recurring
              </Link>
              <Link
                to="/settings"
                className={getLinkClasses('/settings')}
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className={getLinkClasses('/login')}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition duration-150 ease-in-out"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
              {isLoggedInUser() ? (
                <>
                  <Link
                    to="/dashboard"
                    className={getMobileLinkClasses('/dashboard')}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/expenses"
                    className={getMobileLinkClasses('/expenses')}
                    onClick={() => setIsOpen(false)}
                  >
                    Expenses
                  </Link>
                  <Link
                    to="/add-expense"
                    className={getMobileLinkClasses('/add-expense')}
                    onClick={() => setIsOpen(false)}
                  >
                    Add Expense
                  </Link>
                  <Link
                    to="/recurring"
                    className={getMobileLinkClasses('/recurring')}
                    onClick={() => setIsOpen(false)}
                  >
                    Recurring
                  </Link>
                  <Link
                    to="/add-recurring"
                    className={getMobileLinkClasses('/add-recurring')}
                    onClick={() => setIsOpen(false)}
                  >
                    Add Recurring
                  </Link>
                  <Link
                    to="/settings"
                    className={getMobileLinkClasses('/settings')}
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 mt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={getMobileLinkClasses('/login')}
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 mt-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
