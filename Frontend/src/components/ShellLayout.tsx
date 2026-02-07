import { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  Image as ImageIcon, 
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from './photos/whiteLogo.png';

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
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-6 h-6" />,
      path: '/app/dashboard'
    },
    {
      id: 'ai-generation',
      label: 'AI Generation',
      icon: <Sparkles className="w-6 h-6" />,
      path: '/app/ai-generation'
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarExpanded ? 240 : 80 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="gradient-blue-dark relative flex flex-col shadow-xl z-50"
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-center px-4 border-b border-sidebar-border">
          <AnimatePresence mode="wait">
            {isSidebarExpanded ? (
              <motion.img
                key="full-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={logoImage}
                alt="LumenIQ"
                className="h-10 w-auto"
              />
            ) : (
              <motion.div
                key="icon-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center"
              >
                <span className="text-sidebar-primary-foreground font-bold text-lg">L</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group ${
                isActive(item.path)
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Icon */}
              <div className="flex-shrink-0 flex items-center justify-center">
                {item.icon}
              </div>

              {/* Label */}
              <AnimatePresence>
                {isSidebarExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Active indicator */}
              {isActive(item.path) && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Expand/Collapse Toggle */}
        <div className="p-3 border-t border-sidebar-border">
          <motion.button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="w-full flex items-center justify-center gap-3 px-3 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSidebarExpanded ? (
              <>
                <X className="w-6 h-6" />
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm"
                >
                  Collapse
                </motion.span>
              </>
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {/* Logout Button */}
        <div className="p-3 border-t border-sidebar-border">
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-3 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-6 h-6" />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm"
            >
              Logout
            </motion.span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="h-20 bg-card border-b border-border px-6 flex items-center justify-between shadow-sm">
          <h1 className="text-2xl font-semibold text-foreground">
            {navItems.find(item => isActive(item.path))?.label || 'Dashboard'}
          </h1>
          
          <div className="flex items-center gap-4">
            {/* User avatar placeholder */}
            <div className="w-10 h-10 rounded-full gradient-blue-accent flex items-center justify-center text-white font-semibold">
              U
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}