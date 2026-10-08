import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { HistoryDrawer } from './components/HistoryDrawer';

import { LandingPage } from './pages/LandingPage';
import { PredictorWizard } from './pages/PredictorWizard';
import { ResultPage } from './pages/ResultPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { InsightsPage } from './pages/InsightsPage';
import { ModelCardPage } from './pages/ModelCardPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { Preloader } from './components/fx/Preloader';
import { AuroraBackground } from './components/fx/AuroraBackground';
import { ParticleField } from './components/fx/ParticleField';
import { NoiseOverlay } from './components/fx/NoiseOverlay';
import { CustomCursor } from './components/fx/CustomCursor';
import { useLenis } from './hooks/useLenis';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { useHistory, HistoryItem } from './hooks/useHistory';
import { api } from './lib/api';
import {
  PredictRequest,
  PredictResponse,
  DatasetOptionsResponse
} from './types/api';

function MainApp() {
  useLenis(); // Smooth Lenis scrolling
  const { toggleTheme } = useTheme();
  const { history, addHistoryItem, clearHistory } = useHistory();

  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Backend & Dataset Options state
  const [options, setOptions] = useState<DatasetOptionsResponse | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);

  // Active prediction state
  const [currentInput, setCurrentInput] = useState<PredictRequest | null>(null);
  const [currentResult, setCurrentResult] = useState<PredictResponse | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // Keyboard shortcut listener: 'T' toggles theme
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 't' || e.key === 'T') {
        toggleTheme();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  const addToast = (
    title: string,
    description?: string,
    type: 'success' | 'warning' | 'error' | 'info' = 'info'
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadOptions = async () => {
    setLoadingOptions(true);
    try {
      const res = await api.getOptions();
      setOptions(res);
      setBackendOnline(true);
    } catch (err: any) {
      setBackendOnline(false);
      console.error('Options error:', err);
      addToast(
        'Connection Warning',
        'Could not reach MindScroll AI backend. Some features may be offline.',
        'warning'
      );
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  const handlePredict = async (data: PredictRequest) => {
    setIsPredicting(true);
    try {
      const result = await api.predict(data);
      setCurrentInput(data);
      setCurrentResult(result);
      addHistoryItem(data, result);
      setCurrentPage('result');
      addToast(
        'Assessment Generated',
        `Predicted score: ${result.score.toFixed(2)} (${result.band})`,
        'success'
      );
    } catch (err: any) {
      addToast('Prediction Failed', err.message || 'Error occurred during inference.', 'error');
    } finally {
      setIsPredicting(false);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentInput(item.input);
    setCurrentResult(item.result);
    setCurrentPage('result');
    addToast('Historical Record Loaded', `Score: ${item.result.score.toFixed(2)}`, 'info');
  };

  const defaultSimulatorInput: PredictRequest = currentInput || {
    Age: 21,
    Gender: 'Female',
    Country: 'USA',
    Academic_Level: 'Undergraduate',
    Most_Used_Platform: 'Instagram',
    Purpose_Of_Use: 'Entertainment',
    Avg_Daily_Usage_Hours: 5.5,
    Daily_Unlocks: 80,
    Study_Hours: 4.0,
    Physical_Activity_Hours: 1.0,
    Sleep_Hours_Per_Night: 6.5,
    Stress_Level: 'Medium',
  };

  return (
    <div
      className={`min-h-[100dvh] flex flex-col bg-base text-content-primary relative transition-all duration-300 ${
        isSidebarCollapsed ? 'md:pl-20' : 'md:pl-20 lg:pl-64'
      } pt-14 md:pt-0 pb-[calc(4.2rem+env(safe-area-inset-bottom))] md:pb-0`}
    >
      {/* 0-100% Preloader (runs once per session, respects reduced motion) */}
      <Preloader onComplete={() => setPreloaderComplete(true)} />

      {/* Background Visual Effects */}
      <AuroraBackground />
      <ParticleField />
      <NoiseOverlay />
      <CustomCursor />

      {/* Multi-tier Responsive Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        history={history}
        onOpenHistory={() => setHistoryDrawerOpen(true)}
        backendOnline={backendOnline}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Routed Page Content (capped at max-w-[1600px] for 4K / Ultrawide displays) */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto relative z-10 px-3 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {currentPage === 'landing' && (
              <LandingPage
                onStartPredictor={() => setCurrentPage('predictor')}
                onNavigate={setCurrentPage}
              />
            )}

            {currentPage === 'predictor' && (
              <PredictorWizard
                options={options}
                loadingOptions={loadingOptions}
                onPredict={handlePredict}
                isPredicting={isPredicting}
                initialValues={currentInput}
                onRetryOptions={loadOptions}
              />
            )}

            {currentPage === 'result' && currentResult && currentInput && (
              <ResultPage
                result={currentResult}
                input={currentInput}
                onSimulate={() => setCurrentPage('simulator')}
                onReset={() => setCurrentPage('predictor')}
                onToast={addToast}
              />
            )}

            {currentPage === 'simulator' && (
              <SimulatorPage
                baselineInput={defaultSimulatorInput}
                onNavigate={setCurrentPage}
              />
            )}

            {currentPage === 'insights' && (
              <InsightsPage options={options} />
            )}

            {currentPage === 'model-card' && (
              <ModelCardPage />
            )}

            {/* If result is accessed with no active prediction */}
            {currentPage === 'result' && (!currentResult || !currentInput) && (
              <div className="max-w-md mx-auto py-24 text-center px-4">
                <h3 className="text-xl font-bold font-display text-content-primary mb-2">No Active Assessment</h3>
                <p className="text-xs text-content-muted mb-6">Please run a prediction first or select a historical record.</p>
                <button
                  onClick={() => setCurrentPage('predictor')}
                  className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-xs shadow-lg shadow-primary/25"
                >
                  Start Assessment
                </button>
              </div>
            )}

            {![
              'landing',
              'predictor',
              'result',
              'simulator',
              'insights',
              'model-card',
            ].includes(currentPage) && (
              <NotFoundPage onNavigate={setCurrentPage} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={setCurrentPage} currentPage={currentPage} />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        history={history}
        onClear={clearHistory}
        onSelect={handleSelectHistory}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

export default App;
