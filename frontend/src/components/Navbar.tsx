import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sliders,
  BarChart3,
  FileCode2,
  Sparkles,
  History,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  ArrowRight
} from 'lucide-react';
import { HistoryItem } from '../hooks/useHistory';
import { ThemeToggle } from './fx/ThemeToggle';
import { MagneticButton } from './fx/MagneticButton';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  history: HistoryItem[];
  onOpenHistory: () => void;
  backendOnline: boolean;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  history,
  onOpenHistory,
  backendOnline,
  isSidebarCollapsed = false,
  onToggleSidebar,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tabletHovered, setTabletHovered] = useState(false);

  // Navigation Links definition
  const navItems = [
    { id: 'landing', label: 'Home', shortLabel: 'Home', icon: Brain, desc: 'Overview & telemetry' },
    { id: 'predictor', label: 'Predictor', shortLabel: 'Predict', icon: Sparkles, desc: 'Student lifestyle scoring' },
    { id: 'simulator', label: 'What-If Simulator', shortLabel: 'What-If', icon: Sliders, desc: 'Real-time habit adjustments' },
    { id: 'insights', label: 'Population Insights', shortLabel: 'Insights', icon: BarChart3, desc: 'Distributions & correlations' },
    { id: 'model-card', label: 'Model Governance', shortLabel: 'Model', icon: FileCode2, desc: 'Benchmarks & architecture' },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  // Close mobile drawer when pressing ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* =========================================================================
          1. DESKTOP & TABLET SIDEBAR (md:flex, hidden on mobile)
          - Tablet (768px-1023px): Collapsed icon-only (w-20), expands on hover/tap
          - Desktop (1024px+): User toggleable (w-20 collapsed / w-64 expanded)
          ========================================================================= */}
      <aside
        onMouseEnter={() => setTabletHovered(true)}
        onMouseLeave={() => setTabletHovered(false)}
        className={`hidden md:flex fixed top-0 left-0 bottom-0 z-40 flex-col justify-between backdrop-blur-2xl bg-card/85 border-r border-border-subtle transition-all duration-300 ease-out select-none ${
          isSidebarCollapsed && !tabletHovered
            ? 'w-20'
            : 'w-64 shadow-2xl'
        }`}
      >
        {/* Top Header & Brand */}
        <div className="p-4 border-b border-border-subtle flex items-center justify-between">
          <button
            onClick={() => handleNav('landing')}
            className="flex items-center gap-3 text-left focus:outline-none group min-h-[44px]"
            title="MindScroll AI Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover p-0.5 shadow-md shadow-primary/20 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-base rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary group-hover:text-primary-hover transition-colors" />
              </div>
            </div>

            {(!isSidebarCollapsed || tabletHovered) && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-base tracking-tight text-content-primary">
                    Mind<span className="text-primary">Scroll</span>
                  </span>
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/25">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-content-muted">Wellness Predictor</p>
              </motion.div>
            )}
          </button>

          {/* Desktop Collapse / Expand Toggle Button (>= 1024px) */}
          {onToggleSidebar && (!isSidebarCollapsed || tabletHovered) && (
            <button
              onClick={onToggleSidebar}
              className="hidden lg:flex p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-card-hover transition-colors min-h-[36px] min-w-[36px] items-center justify-center"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label="Toggle sidebar collapse"
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const expanded = !isSidebarCollapsed || tabletHovered;

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-xs font-semibold transition-all min-h-[44px] group ${
                  isActive
                    ? 'text-white'
                    : 'text-content-secondary hover:text-content-primary hover:bg-card-hover'
                }`}
                title={!expanded ? item.label : undefined}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active Indicator Background */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-tab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary-hover shadow-md shadow-primary/25 z-0"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}

                <div className="relative z-10 shrink-0">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-content-secondary group-hover:text-primary transition-colors'}`} />
                </div>

                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    className="relative z-10 text-left overflow-hidden whitespace-nowrap"
                  >
                    <span className="block truncate">{item.label}</span>
                    <span className={`block text-[10px] font-normal truncate ${isActive ? 'text-white/80' : 'text-content-muted'}`}>
                      {item.desc}
                    </span>
                  </motion.div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-border-subtle space-y-2 bg-subtle/30">
          {/* Quick CTA button when expanded */}
          {(!isSidebarCollapsed || tabletHovered) && (
            <button
              onClick={() => handleNav('predictor')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-primary to-primary-hover text-white shadow-md shadow-primary/20 hover:opacity-95 transition-opacity min-h-[44px]"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Check Score</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Controls Bar: Theme Toggle, History, Status */}
          <div className={`flex items-center ${(!isSidebarCollapsed || tabletHovered) ? 'justify-between' : 'flex-col gap-3'} pt-1`}>
            {/* Showpiece Theme Toggle */}
            <ThemeToggle />

            {/* History Button */}
            <button
              onClick={onOpenHistory}
              className="relative p-2.5 rounded-xl text-content-secondary hover:text-content-primary hover:bg-card-hover border border-transparent hover:border-border-subtle transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Prediction History"
              aria-label="View prediction history"
            >
              <History className="w-4 h-4" />
              {history.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                  {history.length}
                </span>
              )}
            </button>

            {/* Status Dot */}
            {(!isSidebarCollapsed || tabletHovered) && (
              <div
                title={backendOnline ? 'FastAPI model backend online' : 'FastAPI model backend connecting...'}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono bg-subtle border border-border-subtle"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span className="text-content-muted">
                  {backendOnline ? 'Online' : 'Connecting'}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* =========================================================================
          2. MOBILE TOP HEADER (< 768px, hidden on md+)
          - Height: 56px (h-14)
          - Logo, History trigger, Theme Toggle (reachable in 1 tap), Hamburger menu
          ========================================================================= */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 backdrop-blur-xl bg-card/85 border-b border-border-subtle px-3 sm:px-4 flex items-center justify-between transition-colors">
        {/* Brand */}
        <button
          onClick={() => handleNav('landing')}
          className="flex items-center gap-2 group text-left focus:outline-none min-h-[44px]"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover p-0.5 shadow-sm shadow-primary/20 flex items-center justify-center">
            <div className="w-full h-full bg-base rounded-[6px] flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary" />
            </div>
          </div>
          <span className="font-display font-bold text-base tracking-tight text-content-primary">
            Mind<span className="text-primary">Scroll</span>
          </span>
          <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
            AI
          </span>
        </button>

        {/* Right Action Icons: Status Dot, History, Theme Toggle, Hamburger */}
        <div className="flex items-center gap-1">
          {/* Status Indicator Dot */}
          <div
            title={backendOnline ? 'Model server online' : 'Connecting...'}
            className="w-7 h-7 flex items-center justify-center"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </div>

          {/* History Icon */}
          <button
            onClick={onOpenHistory}
            className="relative p-2.5 rounded-xl text-content-secondary hover:text-content-primary min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none"
            aria-label="View history"
          >
            <History className="w-4 h-4" />
            {history.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-primary text-white text-[8px] font-bold flex items-center justify-center">
                {history.length}
              </span>
            )}
          </button>

          {/* 1-Tap Showpiece Theme Toggle */}
          <ThemeToggle />

          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-content-secondary hover:text-content-primary min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* =========================================================================
          3. MOBILE HAMBURGER SLIDE-OVER DRAWER
          ========================================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-Down Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden fixed top-14 left-0 right-0 z-50 bg-base/95 backdrop-blur-2xl border-b border-border-subtle p-4 shadow-2xl max-h-[calc(100dvh-3.5rem)] overflow-y-auto"
            >
              <div className="space-y-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-content-muted px-2">
                  Navigate Pages
                </span>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                        isActive
                          ? 'bg-primary text-white shadow-md shadow-primary/25'
                          : 'text-content-secondary hover:bg-card-hover hover:text-content-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div className="text-left">
                          <div>{item.label}</div>
                          <div className={`text-[11px] font-normal ${isActive ? 'text-white/80' : 'text-content-muted'}`}>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-70" />
                    </button>
                  );
                })}
              </div>

              {/* Extra Tools in Mobile Drawer */}
              <div className="pt-3 border-t border-border-subtle space-y-2">
                <button
                  onClick={() => {
                    handleNav('predictor');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-gradient-to-r from-primary to-primary-hover text-white text-sm shadow-lg shadow-primary/25 min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Mental Health Assessment</span>
                </button>

                <div className="p-3 rounded-xl bg-subtle/70 border border-border-subtle flex items-center justify-between text-xs text-content-secondary">
                  <span>Backend Server Status</span>
                  <span className={`font-mono font-semibold ${backendOnline ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {backendOnline ? '● Online (Port 8000)' : '● Connecting...'}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* =========================================================================
          4. MOBILE BOTTOM TAB BAR (< 768px, fixed at bottom)
          - 5 primary tabs with animated active pill and touch targets >= 44x44px
          - Safe-area inset padding at bottom for notched devices
          ========================================================================= */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl bg-base/90 border-t border-border-subtle shadow-2xl transition-colors pb-[max(0.35rem,env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-5 h-14 max-w-lg mx-auto px-1 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors focus:outline-none py-1 ${
                  isActive ? 'text-primary' : 'text-content-muted hover:text-content-primary'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Floating Active Pill Accent */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-tab-glow"
                    className="absolute -top-[1px] w-8 h-[3px] rounded-full bg-gradient-to-r from-primary to-primary-hover shadow-sm shadow-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}

                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-primary' : ''}`} />
                <span className={`text-[10px] font-semibold mt-0.5 tracking-tight ${isActive ? 'text-primary' : ''}`}>
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
