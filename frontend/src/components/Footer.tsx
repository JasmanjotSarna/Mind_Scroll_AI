import React from 'react';
import { Brain, Heart, Shield, Cpu, BookOpen, ArrowUp, ArrowRight, GitBranch } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  currentPage?: string;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, currentPage = 'landing' }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getNextDestination = () => {
    switch (currentPage) {
      case 'landing':
        return { id: 'predictor', title: 'Predictor Wizard', num: '02', desc: 'Calculate your personalized mental health score.' };
      case 'predictor':
        return { id: 'simulator', title: 'What-If Habit Simulator', num: '03', desc: 'Test how habit shifts directly improve score.' };
      case 'simulator':
        return { id: 'insights', title: 'Population Insights', num: '04', desc: 'Explore 5,000 student behavioral distributions.' };
      case 'insights':
        return { id: 'model-card', title: 'Model Governance Card', num: '05', desc: 'Inspect cross-validation, MAE, and limits.' };
      default:
        return { id: 'landing', title: 'Home Overview', num: '01', desc: 'Return to the central habit resonance story.' };
    }
  };

  const nextDest = getNextDestination();

  return (
    <footer className="w-full border-t border-border-subtle bg-card/95 backdrop-blur-2xl mt-16 sm:mt-24 text-content-secondary text-xs transition-colors duration-300 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-12">
      {/* DashDigital "Next Page" Editorial Preview Banner */}
      <div className="w-full border-b border-border-subtle bg-subtle/40 hover:bg-subtle/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <button
            onClick={() => {
              onNavigate(nextDest.id);
              scrollToTop();
            }}
            className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between text-left group gap-4"
          >
            <div>
              <span className="font-mono text-xs text-primary font-bold uppercase tracking-widest block mb-1">
                NEXT DESTINATION // [{nextDest.num}]
              </span>
              <h3 className="text-2xl sm:text-4xl font-display font-extrabold text-content-primary group-hover:text-primary transition-colors flex items-center gap-3">
                <span>{nextDest.title}</span>
                <ArrowRight className="w-6 h-6 text-primary group-hover:translate-x-2 transition-transform" />
              </h3>
              <p className="text-xs sm:text-sm text-content-muted mt-1 font-sans">
                {nextDest.desc}
              </p>
            </div>

            <div className="hidden sm:inline-flex px-5 py-3 rounded-2xl border border-primary/30 font-mono text-xs text-primary font-bold group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
              [ LAUNCH NEXT SECTION → ]
            </div>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Model Status */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-base text-content-primary tracking-tight">MindScroll AI</span>
            </div>
            <p className="text-content-muted text-xs leading-relaxed font-sans">
              "The scroll leaves a mark." Transforming passive social media routines into calibrated mental health indicators through empirical machine learning.
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-primary">
              <Cpu className="w-3.5 h-3.5" />
              <span>RF ENSEMBLE (R² = 0.864)</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-primary font-bold text-xs uppercase tracking-wider">Experiences</h4>
            <ul className="space-y-2 font-mono text-xs">
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-primary transition-colors">
                  [ 01 // Home ]
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('predictor')} className="hover:text-primary transition-colors">
                  [ 02 // Predictor ]
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('simulator')} className="hover:text-primary transition-colors">
                  [ 03 // Simulator ]
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('insights')} className="hover:text-primary transition-colors">
                  [ 04 // Insights ]
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('model-card')} className="hover:text-primary transition-colors">
                  [ 05 // Model Card ]
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Research Architecture */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-primary font-bold text-xs uppercase tracking-wider">Dataset & Stack</h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-1.5 font-sans">
                <BookOpen className="w-3.5 h-3.5 text-content-muted" />
                <span>5,000 Student Records</span>
              </li>
              <li className="font-mono text-content-muted">FastAPI + Scikit-Learn 1.9.1</li>
              <li className="font-mono text-content-muted">React 19 + Three.js + Vite</li>
              <li className="font-mono text-content-muted">Framer Motion + Tailwind CSS</li>
            </ul>
          </div>

          {/* Col 4: Ethics & Source Code */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-primary font-bold text-xs uppercase tracking-wider">Research & Code</h4>
            <p className="text-[11px] text-content-muted leading-relaxed font-sans">
              Educational research platform. For clinical crises, please consult qualified healthcare professionals or crisis lines.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://github.com/JasmanjotSarna/Mind_Scroll_AI"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs text-content-primary hover:text-primary transition-colors"
              >
                <GitBranch className="w-4 h-4" />
                <span>[ GITHUB REPOSITORY ]</span>
              </a>
              <div className="flex items-center gap-1.5 text-amber-500 text-[11px]">
                <Shield className="w-3.5 h-3.5 shrink-0" />
                <span>Non-clinical research artifact.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top Control */}
        <div className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-content-muted">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} MINDSCROLL AI</span>
            <span>·</span>
            <span>THE SCROLL LEAVES A MARK</span>
          </div>

          {/* Back to Top Control */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-subtle bg-subtle/50 hover:bg-card hover:text-primary transition-colors text-content-secondary"
            title="Scroll to top of page"
          >
            <span>[ BACK TO TOP ]</span>
            <ArrowUp className="w-3.5 h-3.5 text-primary" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
