import { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Image as ImageIcon,
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

function NavButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative group w-full">
      <button
        onClick={onClick}
        className={`
          relative w-full flex items-center justify-center h-10 rounded-lg transition-all duration-200
          ${active
            ? 'text-white rounded-xl'
            : 'text-white hover:text-white hover:bg-white/10'
          }
        `}
      >
        {active && (
          <motion.span
            layoutId="sidebar-active-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-6 rounded-r-full bg-white"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
        {children}
      </button>
      <Tooltip label={label} />
    </div>
  );
}

function Tooltip({ label }: { label: string }) {
  return (
    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-800 text-[12px] text-white font-medium rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 pointer-events-none shadow-xl border border-white/[0.08] z-50">
      {label}
      <span className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-800" />
    </div>
  );
}

export function ShellLayout({ children }: ShellLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const primaryNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-6 h-6" />, path: '/app/dashboard' },
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-6 h-6" />, path: '/app/chat' },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-6 h-6" />, path: '/app/calendar' },
    { id: 'photo-storage', label: 'Photos', icon: <ImageIcon className="w-6 h-6" />, path: '/app/photo-storage' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleLogoClick = () => {
    window.location.href = '/app/dashboard';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div
        className="max-w-[7rem] w-full hidden md:flex flex-col flex-shrink-0 bg-blue-600 relative z-10"
      >
        <div className="flex items-center justify-center h-[6rem]">
          <button
            onClick={handleLogoClick}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-opacity hover:opacity-80 active:scale-95"
          >
            <img src={logoIcon} alt="LumenIQ" className="w-7 h-7 object-contain" />
          </button>
        </div>

        <div className="mx-auto w-8 h-px bg-white" />

        <nav className="flex-1 flex flex-col items-center gap-1 pt-3 px-3">
          {primaryNav.map((item) => {
            const active = isActive(item.path);
            return (
              <NavButton
                key={item.id}
                active={active}
                label={item.label}
                onClick={() => handleNavClick(item.path)}
              >
                {item.icon}
              </NavButton>
            );
          })}
        </nav>

        <div className="flex flex-col items-center gap-1 px-2 pb-5">
          <NavButton
            active={isActive('/app/settings')}
            label="Settings"
            onClick={() => handleNavClick('/app/settings')}
          >
            <Settings className="w-6 h-6" />
          </NavButton>

          <div className="w-8 h-px bg-white my-1.5" />

          <div className="relative group w-full">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center h-10 rounded-lg text-white hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut className="w-6 h-6" />
            </button>
            <Tooltip label="Log out" />
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-blue-600 flex items-center justify-between px-4 z-50 border-b border-white/[0.06]">
        <button onClick={handleLogoClick} className="flex items-center gap-2.5">
          <img src={logoIcon} alt="LumenIQ" className="h-6 w-auto" />
          <span className="text-white text-[15px] font-outfit tracking-tight">LumenIQ</span>
        </button>
        <button
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-white hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Popout Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-[264px] bg-blue-600 z-50 flex flex-col"
            >
              <div className="h-14 flex items-center justify-between px-4 border-b border-white/[0.06]">
                <button onClick={handleLogoClick} className="flex items-center gap-2.5">
                  <img src={logoIcon} alt="LumenIQ" className="h-6 w-auto" />
                  <span className="text-white text-[15px] font-outfit tracking-tight">LumenIQ</span>
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-0.5 px-3 pt-4 overflow-y-auto">
                {primaryNav.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.path)}
                      className={`
                        relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200
                        ${active
                          ? 'bg-white/10 text-white'
                          : 'text-white hover:text-white hover:bg-white/20'
                        }
                      `}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-6 rounded-r-full bg-white" />
                      )}
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="px-3 pb-4 space-y-0.5">
                <div className="w-full h-px bg-white/[0.06] mb-2" />
                <button
                  onClick={() => handleNavClick('/app/settings')}
                  className={`
                    relative flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200
                    ${isActive('/app/settings')
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                    }
                  `}
                >
                  {isActive('/app/settings') && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-6 rounded-r-full bg-white" />
                  )}
                  <Settings className="w-6 h-6" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium text-white hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut className="w-6 h-6" />
                  <span>Log out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="md:pt-0 pt-14">
          <div className="p-5 md:p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
