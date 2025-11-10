import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  {
    to: '/home',
    label: 'Home',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
        <path d="M3 10.5 12 3l9 7.5v10.5a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    to: '/artist',
    label: 'Artist',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
        <path d="M12 13.5c3.59 0 6.5 2.91 6.5 6.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1c0-3.59 2.91-6.5 6.5-6.5zm0-10c2.9 0 5 2.35 5 5.25S14.9 14 12 14s-5-2.35-5-5.25S9.1 3.5 12 3.5z" />
      </svg>
    ),
  },
  {
    to: '/booking',
    label: 'Booking',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
        <path d="M5 4h14a2 2 0 0 1 2 2v13l-5-3-5 3-5-3-5 3V6a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
];

const Navbar: React.FC = () => (
  <nav className="fixed bottom-0 left-0 z-50 h-16 w-full bg-white shadow-inner">
    <div className="mx-auto flex h-full max-w-sm items-center justify-between px-6">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            [
              'flex flex-col items-center gap-1 text-xs font-medium transition-colors',
              isActive ? 'text-gray-900' : 'text-gray-400',
            ].join(' ')
          }
        >
          <span className="h-6 w-6">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default Navbar;
