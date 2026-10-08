import React from 'react';
import { Brain, Heart, Shield, Cpu, BookOpen } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-border-subtle bg-card/90 backdrop-blur-xl mt-16 sm:mt-20 text-content-secondary text-xs transition-colors duration-300 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-base text-content-primary">MindScroll AI</span>
            </div>
            <p className="text-content-muted text-xs leading-relaxed">
              Predicting student lifestyle and social media mental health correlations via validated machine learning pipelines.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-content-muted">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              <span>Random Forest Regressor (R² = 0.864)</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="text-content-primary font-semibold text-xs uppercase tracking-wider">Features</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('predictor')} className="hover:text-primary transition-colors">
                  Score Predictor Wizard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('simulator')} className="hover:text-primary transition-colors">
                  What-If Habit Simulator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('insights')} className="hover:text-primary transition-colors">
                  Dataset Insights & Charts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('model-card')} className="hover:text-primary transition-colors">
                  Model Card & Benchmarks
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="text-content-primary font-semibold text-xs uppercase tracking-wider">Dataset & Tech</h4>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-content-muted" />
                <span>5,000 Student Survey Records</span>
              </li>
              <li>FastAPI + Scikit-Learn 1.9.1</li>
              <li>React 19 + Vite + TypeScript</li>
              <li>Framer Motion + Tailwind CSS</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="text-content-primary font-semibold text-xs uppercase tracking-wider">Ethics & Care</h4>
            <p className="text-[11px] text-content-muted leading-relaxed">
              This application is built strictly for scientific research, self-reflection, and academic insight.
              Correlation is not causation.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-amber-500 text-[11px]">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>Educational tool, not a medical diagnosis.</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-content-muted">
          <p>© {new Date().getFullYear()} MindScroll AI Research. Open source under MIT.</p>
          <div className="flex items-center gap-1 text-content-muted">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for student mental wellness</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
