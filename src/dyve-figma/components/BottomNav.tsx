import { Home, Search, Users, User } from 'lucide-react';
import { Screen } from '../App';

interface BottomNavProps {
  navigate: (screen: Screen) => void;
  currentScreen: Screen;
}

export default function BottomNav({ navigate, currentScreen }: BottomNavProps) {
  const navItems = [
    { icon: Home, label: 'Home', screen: 'home' as Screen },
    { icon: Search, label: 'Events', screen: 'explore' as Screen },
    { icon: Users, label: 'Networking', screen: 'suggest' as Screen },
    { icon: User, label: 'MyPage', screen: 'myPage' as Screen },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 z-50">
      <div className="max-w-[393px] mx-auto flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => navigate(item.screen)}
              className="flex flex-col items-center justify-center gap-1 flex-1"
            >
              <Icon 
                size={22} 
                className={isActive ? 'text-[#FF3B5C]' : 'text-gray-600'}
              />
              <span className={`text-xs font-bold ${isActive ? 'text-[#FF3B5C]' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}