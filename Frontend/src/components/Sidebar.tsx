import { Calendar, ImagePlus, Images, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './Logo';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const navItems = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'photo-generation', label: 'Photo Generation', icon: ImagePlus },
    { id: 'photo-storage', label: 'Photo Storage', icon: Images },
    { id: 'settings', label: 'Profile Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border bg-white flex justify-center">
        <Logo size="sm" />
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activePage === item.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onPageChange(item.id)}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-sm text-muted-foreground">Marketing Dashboard v1.0</p>
      </div>
    </div>
  );
}
