import React from 'react';
import { Menu, Plus, Search, ShieldCheck } from 'lucide-react';
import { NAVIGATION_ITEMS } from './Sidebar';

export default function Navbar({ activeTab, setActiveTab, onOpenSidebar, searchQuery, setSearchQuery }) {
  const currentItem = NAVIGATION_ITEMS.find((item) => item.id === activeTab) || NAVIGATION_ITEMS[0];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{currentItem.label}</span>
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            Student Management & Academic Records Portal
          </p>
        </div>
      </div>

      {/* Right: Quick Search & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search Shortcut */}
        {activeTab !== 'search' && (
          <div className="relative hidden md:block w-48 lg:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Quick search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (activeTab !== 'search') setActiveTab('search');
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-indigo-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-800"
            />
          </div>
        )}

        {/* Database Status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden md:inline">API & DB Online</span>
          <span className="md:hidden">Live</span>
        </div>

        {/* "+ Add Student" Quick Action */}
        {activeTab !== 'add-student' && (
          <button
            onClick={() => setActiveTab('add-student')}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:bg-indigo-800 shadow-sm shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Add Student</span>
          </button>
        )}
      </div>
    </header>
  );
}
