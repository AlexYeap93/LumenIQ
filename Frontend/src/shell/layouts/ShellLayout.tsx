import { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  MessageSquare,
  Calendar,
  Image as ImageIcon, 
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '../../components/photos/LumenIQ Logo.png';
import logoIcon from '../../components/photos/whiteLogo.png';

interface ShellLayoutProps {
  children: ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
}

export function ShellLayout({ children }: ShellLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    {
      id: 'chat',
      label: 'Chat',
      icon: <MessageSquare className="w-6 h-6" />,
      path: '/app/dashboard'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <Calendar className="w-6 h-6" />,
      path: '/app/calendar'
    },
    {
      id: 'photo-storage',
      label: 'Photo Storage',
      icon: <ImageIcon className="w-6 h-6" />,
      path: '/app/photo-storage'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-6 h-6" />,
      path: '/app/settings'
    }
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setIsSidebarExpanded(false);
    }
  };

  const handleLogout = () => {
    // In production, this would clear auth state and redirect
    navigate('/login');
  };

  const handleLogoClick = () => {
    window.location.href = '/app/dashboard';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen gradient-blue-light overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarExpanded ? 240 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col bg-gradient-to-br from-blue-500 via-blue-800 to-blue-900 shadow-xl relative z-10"
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          <AnimatePresence mode="wait">
            {isSidebarExpanded ? (
              <motion.img
                key="logo-full"
                src={logoIcon}
                alt="LumenIQ"
                className="h-12 w-auto cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={handleLogoClick}
              />
            ) : (
              <motion.button
                key="logo-icon"
                onClick={handleLogoClick}
                className="flex items-center justify-center hover:scale-110 transition-transform p-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <img src={logoIcon} alt="LumenIQ" className="h-20 w-auto object-contain" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto bg">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <AnimatePresence>
                {isSidebarExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="px-3 pb-4">
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex-shrink-0">
              <LogOut className="w-6 h-6" />
            </div>
            <AnimatePresence>
              {isSidebarExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Expand/Collapse Toggle */}
        <button
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center text-primary hover:scale-110 transition-transform"
        >
          {isSidebarExpanded ? (
            <X className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
        </button>
      </motion.aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 gradient-blue-dark flex items-center justify-between px-4 z-50 shadow-lg">
        <img 
          src={logoImage} 
          alt="LumenIQ" 
          className="h-8 w-auto cursor-pointer" 
          onClick={handleLogoClick}
        />
        <button
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="text-white p-2"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarExpanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarExpanded(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-64 gradient-blue-dark z-50 flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
                <img 
                  src={logoImage} 
                  alt="LumenIQ" 
                  className="h-8 w-auto cursor-pointer" 
                  onClick={handleLogoClick}
                />
                <button
                  onClick={() => setIsSidebarExpanded(false)}
                  className="text-white p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.path)
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="px-3 pb-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all"
                >
                  <LogOut className="w-6 h-6" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="md:pt-0 pt-16">
          <div className="p-6 md:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}