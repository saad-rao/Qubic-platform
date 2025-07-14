import { cn } from "@/lib/utils";
import { BarChart3, PlusCircle, Trophy, TrendingUp, Settings, HelpCircle } from "lucide-react";

type Section = 'dashboard' | 'contributions' | 'leaderboard' | 'analytics';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { id: 'dashboard' as Section, label: 'Dashboard', icon: BarChart3 },
  { id: 'contributions' as Section, label: 'Submit Contribution', icon: PlusCircle },
  { id: 'leaderboard' as Section, label: 'Leaderboard', icon: Trophy },
  { id: 'analytics' as Section, label: 'Your Analytics', icon: TrendingUp },
];

const bottomItems = [
  { id: 'settings' as Section, label: 'Settings', icon: Settings },
  { id: 'help' as Section, label: 'Help', icon: HelpCircle },
];

export default function Sidebar({ activeSection, onSectionChange, isOpen, onClose }: SidebarProps) {
  const handleItemClick = (sectionId: Section) => {
    onSectionChange(sectionId);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <aside className={cn(
      "fixed md:relative w-64 h-full bg-[#302A36] backdrop-blur-md border-r border-[#00D4FF]/20 sidebar-transition z-30",
      isOpen ? "" : "sidebar-hidden md:translate-x-0"
    )}>
      <nav className="p-6 space-y-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left",
                  isActive
                    ? "bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30"
                    : "hover:bg-gray-800/50 text-white"
                )}
              >
                <Icon className="h-5 w-5 text-[#2DE1F6] " />
                <span className="text-[#FFFFFF] text-[18px] font-semi-bold">{item.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="pt-4 border-t border-gray-700">
          <div className="space-y-2">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors text-left text-white"
                >
                  <Icon className="h-5 w-5 text-[#2DE1F6]" />
                  <span className="text-[#FFFFFF] text-[18px] font-semi-bold ">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}
