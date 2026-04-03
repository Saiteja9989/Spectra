import { useDarkMode } from './DarkModeContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, type = 'info', children, onConfirm, onReject }) => {
  const { darkMode } = useDarkMode();
  if (!isOpen) return null;

  const config = {
    success: {
      icon: CheckCircle,
      iconClass: 'text-emerald-400',
      accent: 'from-emerald-500/20 to-emerald-600/5',
      border: 'border-emerald-500/20',
      btn: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/30',
    },
    error: {
      icon: AlertCircle,
      iconClass: 'text-red-400',
      accent: 'from-red-500/20 to-red-600/5',
      border: 'border-red-500/20',
      btn: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/30',
    },
    warning: {
      icon: AlertCircle,
      iconClass: 'text-amber-400',
      accent: 'from-amber-500/20 to-amber-600/5',
      border: 'border-amber-500/20',
      btn: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/30',
    },
    info: {
      icon: Info,
      iconClass: 'text-indigo-400',
      accent: 'from-indigo-500/20 to-indigo-600/5',
      border: 'border-indigo-500/20',
      btn: 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-indigo-500/30',
    },
  };

  const c = config[type] || config.info;
  const Icon = c.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 glass" onClick={() => { onClose(); onReject?.(); }} />

      {/* Card */}
      <div className={`relative w-full max-w-md rounded-2xl border overflow-hidden shadow-2xl animate-float ${
        darkMode ? `bg-gray-900 ${c.border}` : `bg-white ${c.border}`
      }`} style={{ animation: 'none', transform: 'none' }}>
        {/* Top gradient strip */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${c.accent}`} />

        {/* Header */}
        <div className={`flex items-center gap-3 px-5 pt-5 pb-4 border-b ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.accent} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${c.iconClass}`} />
          </div>
          <h3 className={`font-semibold text-base flex-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <button
            onClick={() => { onClose(); onReject?.(); }}
            className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/8 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className={`px-5 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {children}
        </div>

        {/* Actions */}
        {onConfirm && (
          <div className={`flex gap-2 px-5 pb-5 pt-1`}>
            <button
              onClick={() => { onClose(); onReject?.(); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                darkMode ? 'border-white/10 text-gray-300 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${c.btn}`}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
