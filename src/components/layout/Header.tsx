import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, UserCircle, Brain, CreditCard, DollarSign, Search, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useTherapistStore } from '../../store/therapistStore';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { isTherapist, checkTherapistStatus } = useTherapistStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      checkTherapistStatus(user.id);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Generate navigation items based on user role
  const getNavItems = () => {
    if (!user) return [];
    
   const commonItems = [
      { label: 'Therapists', path: '/therapists' },
      { label: 'Resources', path: '/resources' },
      { label: 'Messages', path: '/messages' },
      { label: 'Payments', path: '/payment-history' },
    ];
    
    if (user.role === 'therapist') {
      return [
        { label: 'Doctor Dashboard', path: '/doctor-dashboard' },
        { label: 'Earnings', path: '/earnings' },
        ...commonItems,
      ];
    } else {
      return [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Journal', path: '/journal' },
        { label: 'AI Chat', path: '/ai-chat' },
        { label: 'Subscriptions', path: '/subscriptions' },
        ...commonItems,
      ];
    }
  };
  
  const navItems = getNavItems();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-gray-800 shadow-dark-sm border-b border-gray-700">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex items-center justify-center bg-white w-8 h-8 rounded-md text-gray-800 mr-3">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-xl  font-light text-white">Mindfull AI</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            {user && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2 flex items-center py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'text-white bg-gray-700'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Search and user section */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-gray-700 text-gray-300 placeholder-gray-400 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <button className="text-gray-300 hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <Link to="/profile" className="flex items-center text-gray-300 hover:text-white transition-colors">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={`${user.full_name}'s avatar`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.full_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="ml-2">{user.full_name}</span>
                  {user.role === 'therapist' && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-green-900/30 text-green-400 border border-green-600/30 rounded-full">
                      Therapist
                    </span>
                  )}
                </Link>
              </>
            )}
            
            {!user && (
              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-white bg-gray-700'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  onClick={closeMenu}
                >
                  <UserCircle className="w-5 h-5 mr-2" />
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};