import React from 'react';

const Header: React.FC = () => (
  <header className="fixed top-0 left-0 z-50 flex h-14 w-full items-center justify-center bg-white shadow-sm">
    <div className="flex w-full max-w-sm items-center px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
          DY
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-base font-semibold text-gray-900">DYVE</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
            concerts
          </span>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
