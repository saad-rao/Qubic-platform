import { cn } from "@/lib/utils";
import { BarChart3, PlusCircle, Trophy, TrendingUp, Settings, HelpCircle } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

type Section = 'dashboard' | 'contributions' | 'leaderboard' | 'analytics';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeSection, onSectionChange, isOpen, onClose }: SidebarProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const navItems = [
    { id: 'dashboard' as Section, label: t('dashboard'), icon: BarChart3 },
    { id: 'contributions' as Section, label: t('submit.contribution'), icon: PlusCircle },
    { id: 'leaderboard' as Section, label: t('leaderboard'), icon: Trophy },
    { id: 'analytics' as Section, label: t('your.analytics'), icon: TrendingUp },
  ];

  const bottomItems = [
    { id: 'settings' as Section, label: t('settings'), icon: Settings },
    { id: 'help' as Section, label: t('help'), icon: HelpCircle },
  ];

  const handleItemClick = (sectionId: Section) => {
    onSectionChange(sectionId);
  };

  return (
    <aside
      className={cn(
        "w-64 h-full",
        theme === "light"
          ? "bg-[#FEF8E8] text-[#302A36] border-r border-[#302A36]/20"
          : "bg-[#302A36] text-white border-r border-[#00D4FF]/20"
      )}
    >
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
                  "w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left transform hover:scale-[1.02] font-heading",
                  isActive
                    ? theme === "light"
                      ? "bg-[#00D4FF]/20 text-[#302A36] border border-[#00D4FF]/30 shadow-md"
                      : "bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30"
                    : theme === "light"
                      ? "hover:bg-[#302A36]/10 text-[#302A36] hover:shadow-sm"
                      : "hover:bg-gray-800/50 text-white"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-colors duration-200",
                  isActive
                    ? theme === "light" ? "text-[#302A36]" : "text-[#00D4FF]"
                    : theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
                )} />
                <span className={cn(
                  "text-lg font-semi-bold transition-colors duration-200",
                  isActive
                    ? theme === "light" ? "text-[#302A36]" : "text-[#00D4FF]"
                    : theme === "light" ? "text-[#302A36]" : "text-[#FFFFFF]"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        
        <div className={cn(
          "pt-4 border-t",
          theme === "light" ? "border-[#302A36]/20" : "border-gray-700"
        )}>
          <div className="space-y-2">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left transform hover:scale-[1.02] font-heading",
                    theme === "light"
                      ? "hover:bg-[#302A36]/10 text-[#302A36] hover:shadow-sm"
                      : "hover:bg-gray-800/50 text-white"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    theme === "light" ? "text-[#302A36]" : "text-[#D0FF5F]"
                  )} />
                  <span className={cn(
                    "text-lg font-semi-bold transition-colors duration-200",
                    theme === "light" ? "text-[#302A36]" : "text-[#FFFFFF]"
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}
