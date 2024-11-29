import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AiOutlineShoppingCart, AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16 space-x-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
          >
            <AiOutlineShoppingCart className="w-6 h-6" />
          </Link>

          {isAuthenticated ? (
            <>
              {/* User Menu */}
              <div className="relative inline-block text-left">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">
                    Welcome, {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
                    title="Logout"
                  >
                    <AiOutlineLogout className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-indigo-600 text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
