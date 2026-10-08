import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Clock, ArrowRight } from 'lucide-react';
import { HistoryItem } from '../hooks/useHistory';
import { getBandDetails } from '../lib/utils';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClear,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Slide-over panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-base border-l border-border-subtle h-full shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-content-primary text-sm font-display">
                Prediction History ({history.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-card transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-16 text-content-muted text-xs">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No previous prediction history found.</p>
                <p className="text-[11px] mt-1 text-content-muted opacity-80">
                  Assessments you perform will be saved here in local storage.
                </p>
              </div>
            ) : (
              history.map((item) => {
                const band = getBandDetails(item.result.score);
                const dateStr = new Date(item.timestamp).toLocaleString(undefined, {
                  dateStyle: 'short',
                  timeStyle: 'short',
                });

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl glass-panel border border-border-subtle hover:border-primary/40 transition-all cursor-pointer group"
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-content-muted font-mono">{dateStr}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${band.badgeClass}`}
                      >
                        {item.result.band}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-extrabold font-display" style={{ color: band.color }}>
                          {item.result.score.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-content-muted ml-1">Score</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-primary group-hover:translate-x-1 transition-transform font-medium">
                        <span>Load</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="mt-2 text-[11px] text-content-secondary border-t border-border-subtle pt-2 flex justify-between">
                      <span>{item.input.Avg_Daily_Usage_Hours.toFixed(1)}h usage • {item.input.Sleep_Hours_Per_Night.toFixed(1)}h sleep</span>
                      <span className="text-content-muted">{item.input.Most_Used_Platform}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Clear All */}
          {history.length > 0 && (
            <div className="p-4 border-t border-border-subtle bg-subtle/50">
              <button
                onClick={onClear}
                className="w-full py-2.5 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All History</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
