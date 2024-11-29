import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  AiOutlineHome,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineShopping,
  AiOutlineDashboard,
  AiOutlinePlusCircle,
  AiOutlineSetting,
  AiOutlineHeart,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineStar,
  AiOutlinePhone,
  AiOutlineLaptop,
  AiOutlineCamera,
  AiOutlineGift
} from 'react-icons/ai';
import { BiCategoryAlt } from 'react-icons/bi';
import { GiClothes, GiRunningShoe } from 'react-icons/gi';

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isAuthenticated, isSeller, user } = useAuth();
  const location = useLocation();
  const [showCategories, setShowCategories] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const categories = [
    { title: 'Electronics', icon: <AiOutlineLaptop />, path: '/category/electronics' },
    { title: 'Clothing', icon: <GiClothes />, path: '/category/clothing' },
    { title: 'Phones', icon: <AiOutlinePhone />, path: '/category/phones' },
    { title: 'Cameras', icon: <AiOutlineCamera />, path: '/category/cameras' },
    { title: 'Shoes', icon: <GiRunningShoe />, path: '/category/shoes' },
    { title: 'Gifts', icon: <AiOutlineGift />, path: '/category/gifts' },
  ];

  const menuItems = [
    {
      title: 'Home',
      path: '/',
      icon: <AiOutlineHome className="w-6 h-6" />,
      showAlways: true
    },
    {
      title: 'All Products',
      path: '/products',
      icon: <AiOutlineShopping className="w-6 h-6" />,
      showAlways: true
    },
    {
      title: 'Categories',
      icon: <BiCategoryAlt className="w-6 h-6" />,
      isCategory: true,
      showAlways: true
    },
    {
      title: 'Cart',
      path: '/cart',
      icon: <AiOutlineShoppingCart className="w-6 h-6" />,
      showAlways: true
    },
    {
      title: 'Wishlist',
      path: '/wishlist',
      icon: <AiOutlineHeart className="w-6 h-6" />,
      requireAuth: true
    },
    {
      title: 'Reviews',
      path: '/reviews',
      icon: <AiOutlineStar className="w-6 h-6" />,
      requireAuth: true
    },
    {
      title: 'Add Product',
      path: '/add-product',
      icon: <AiOutlinePlusCircle className="w-6 h-6" />,
      sellerOnly: true
    },
    {
      title: 'Dashboard',
      path: '/seller-dashboard',
      icon: <AiOutlineDashboard className="w-6 h-6" />,
      sellerOnly: true
    },
    {
      title: 'Profile',
      path: '/profile',
      icon: <AiOutlineUser className="w-6 h-6" />,
      requireAuth: true
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: <AiOutlineSetting className="w-6 h-6" />,
      requireAuth: true
    }
  ];

  const MenuItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    
    if (item.isCategory) {
      return (
        <div className="relative">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className={`w-full flex items-center space-x-4 px-6 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors duration-200 ${
              showCategories ? 'bg-indigo-50 text-indigo-600' : ''
            }`}
          >
            {item.icon}
            {isOpen && <span className="text-sm font-medium">{item.title}</span>}
          </button>
          {showCategories && (
            <div className="ml-4 mt-2 space-y-2">
              {categories.map((category, idx) => (
                <Link
                  key={idx}
                  to={category.path}
                  className="flex items-center space-x-4 px-6 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors duration-200"
                >
                  {category.icon}
                  {isOpen && <span className="text-sm">{category.title}</span>}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <Link
        to={item.path}
        className={`flex items-center space-x-4 px-6 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors duration-200 ${
          isActive ? 'bg-indigo-50 text-indigo-600' : ''
        }`}
      >
        {item.icon}
        {isOpen && <span className="text-sm font-medium">{item.title}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
      >
        {isMobileOpen ? (
          <AiOutlineClose className="w-6 h-6" />
        ) : (
          <AiOutlineMenu className="w-6 h-6" />
        )}
      </button>

      {/* Toggle Button for Desktop */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden lg:block fixed bottom-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-100"
      >
        {isOpen ? (
          <AiOutlineLeft className="w-6 h-6" />
        ) : (
          <AiOutlineRight className="w-6 h-6" />
        )}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-white shadow-xl transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 
          ${isOpen ? 'w-64' : 'w-20'}
          overflow-y-auto`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center space-x-2">
          <img
            src="/logo.png"
            alt="E-Shop Logo"
            className="w-8 h-8"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/32';
            }}
          />
          {isOpen && <span className="text-xl font-bold text-gray-800">E-Shop</span>}
        </div>

        {/* Menu Items */}
        <nav className="px-3 py-4 space-y-2">
          {menuItems.map((item, index) => {
            if (
              item.showAlways ||
              (isAuthenticated && item.requireAuth) ||
              (isSeller && item.sellerOnly)
            ) {
              return <MenuItem key={index} item={item} />;
            }
            return null;
          })}
        </nav>

        {/* User Info */}
        {isAuthenticated && user && isOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <AiOutlineUser className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default SideMenu;
