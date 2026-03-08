'use client';

import { Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div />
      <button className="relative p-2 rounded-lg text-[#515151] hover:text-[#25A3FE] hover:bg-gray-100 transition-colors">
        <Bell className="w-5 h-5" />
      </button>
    </header>
  );
}
