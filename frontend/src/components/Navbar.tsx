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
  ArrowRight
} from 'lucide-react';
import { HistoryItem } from '../hooks/useHistory';
import { ThemeToggle } from './fx/ThemeToggle';
import { MenuOverlay } from './MenuOverlay';

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
  const [menuOverlayOpen, setMenuOverlayOpen] = useState(false);
  const [tabletHovered, setTabletHovered] = useState(false);

  // Navigation Links definition with numbers and bracket labels
  const navItems = [
    { id: 'landing', label: 'Home', bracketLabel: '[ Home ]', num: '01', shortLabel: 'Home', icon: Brain, desc: 'Overview & telemetry' },
    { id: 'predictor', label: 'Predictor', bracketLabel: '[ Predict ]', num: '02', shortLabel: 'Predict', icon: Sparkles, desc: 'Student lifestyle scoring' },
    { id: 'simulator', label: 'What-If Simulator', bracketLabel: '[ Simulator ]', num: '03', shortLabel: 'What-If', icon: Sliders, desc: 'Real-time habit adjustments' },
    { id: 'insights', label: 'Population Insights', bracketLabel: '[ Insights ]', num: '04', shortLabel: 'Insights', icon: BarChart3, desc: 'Distributions & correlations' },
    { id: 'model-card', label: 'Model Governance', bracketLabel: '[ Model ]', num: '05', shortLabel: 'Model', icon: FileCode2, desc: 'Benchmarks & architecture' },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  // Keyboard shortcut listener: 'T' toggles theme, 'M' toggles menu overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'm' || e.key === 'M') {
        setMenuOverlayOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* =========================================================================
          1. DESKTOP TOP FLOATING BAR (>= 768px)
          - Bracket Nav "[ Home ] [ Predict ] [ Insights ] [ Model ]"
          - "Menu +" Fullscreen Drawer Trigger
          - Theme Toggle & History Counter
          ========================================================================= */}
      <div className="hidden md:flex fixed top-4 right-6 z-40 items-center gap-2.5 backdrop-blur-2xl bg-card/85 border border-border-subtle px-3 py-1.5 rounded-2xl shadow-xl transition-all">
        {/* Bracket Navigation Links */}
        <div className="flex items-center gap-1 font-mono text-xs">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`px-2.5 py-1.5 rounded-lg transition-all tracking-wide ${
                  isActive
                    ? 'text-primary font-bold bg-primary/10 border border-primary/25 shadow-sm'
                    : 'text-content-muted hover:text-content-primary hover:bg-card-hover'
                }`}
                title={item.label}
              >
                {item.bracketLabel}
              </button>
            );
          })}
        </div>

        <div className="h-4 w-px bg-border-subtle" />

        {/* DashDigital "Menu +" Button */}
        <button
          onClick={() => setMenuOverlayOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-content-primary hover:text-primary hover:bg-card-hover transition-colors border border-border-subtle"
          title="Open Fullscreen Atlas"
        >
          <span>Menu +</span>
          <span className="text-[10px] text-primary">({navItems.length})</span>
        </button>

        {/* History Quick Trigger */}
        <button
          onClick={onOpenHistory}
          className="relative p-2 rounded-xl text-content-muted hover:text-content-primary hover:bg-card-hover transition-colors"
          title="Past Predictions"
          aria-label="View prediction history"
        >
          <History className="w-4 h-4" />
          {history.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
              {history.length}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>

      {/* =========================================================================
          2. DESKTOP & TABLET SIDEBAR (md:flex, hidden on mobile)
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5 shadow-md shadow-primary/20 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-base rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
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
                <p className="text-[10px] text-content-muted font-mono">01 // SIGNAL CORE</p>
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
                className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold transition-all min-h-[44px] group ${
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
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-accent shadow-md shadow-primary/25 z-0"
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
                    className="relative z-10 text-left overflow-hidden whitespace-nowrap flex-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="block truncate font-medium">{item.label}</span>
                      <span className={`text-[10px] font-mono ${isActive ? 'text-white/80' : 'text-primary/70'}`}>
                        {item.num}
                      </span>
                    </div>
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
          {(!isSidebarCollapsed || tabletHovered) && (
            <button
              onClick={() => handleNav('predictor')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/20 hover:opacity-95 transition-opacity min-h-[44px] font-mono"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>[ CHECK MY SCORE ]</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Connection Status */}
          <div className={`flex items-center ${(!isSidebarCollapsed || tabletHovered) ? 'justify-between' : 'flex-col gap-3'} pt-1`}>
            {(!isSidebarCollapsed || tabletHovered) && (
              <div
                title={backendOnline ? 'FastAPI model backend online' : 'FastAPI model backend connecting...'}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono bg-subtle border border-border-subtle w-full justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <span className="text-content-muted">
                    {backendOnline ? 'CORE ONLINE' : 'STANDBY'}
                  </span>
                </div>
                <span className="text-[9px] text-content-muted font-mono">PORT 8000</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* =========================================================================
          3. MOBILE TOP HEADER (< 768px, hidden on md+)
          ========================================================================= */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 backdrop-blur-xl bg-card/85 border-b border-border-subtle px-3 sm:px-4 flex items-center justify-between transition-colors">
        <button
          onClick={() => handleNav('landing')}
          className="flex items-center gap-2 group text-left focus:outline-none min-h-[44px]"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent p-0.5 shadow-sm shadow-primary/20 flex items-center justify-center">
            <div className="w-full h-full bg-base rounded-[6px] flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary" />
            </div>
          </div>
          <span className="font-display font-bold text-base tracking-tight text-content-primary">
            Mind<span className="text-primary">Scroll</span>
          </span>
          <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono">
            AI
          </span>
        </button>

        <div className="flex items-center gap-1">
          {/* Status Dot */}
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

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Hamburger / Menu Overlay Trigger */}
          <button
            onClick={() => setMenuOverlayOpen(true)}
            className="p-2.5 rounded-xl text-content-secondary hover:text-content-primary min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none"
            aria-label="Open fullscreen navigation menu"
          >
            <Menu className="w-5 h-5 text-primary" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          4. MOBILE BOTTOM TAB BAR (< 768px, fixed at bottom)
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
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-tab-glow"
                    className="absolute -top-[1px] w-8 h-[3px] rounded-full bg-gradient-to-r from-primary to-accent shadow-sm shadow-primary"
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

      {/* Full-screen DashDigital Menu Overlay */}
      <MenuOverlay
        isOpen={menuOverlayOpen}
        onClose={() => setMenuOverlayOpen(false)}
        currentPage={currentPage}
        onNavigate={handleNav}
        backendOnline={backendOnline}
      />
    </>
  );
};

export default Navbar;
