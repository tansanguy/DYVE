import { Home, Search, Users, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Events', path: '/events' },
  { icon: Users, label: 'Networking', path: '/networking' },
  { icon: User, label: 'MyPage', path: '/mypage' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-screen-sm items-center justify-around px-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className="flex flex-1 flex-col items-center justify-center gap-1"
            >
              <Icon size={22} className={isActive ? 'text-[#FF3B5C]' : 'text-gray-600'} />
              <span className={`text-xs font-bold ${isActive ? 'text-[#FF3B5C]' : 'text-gray-600'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
