'use client';

import { useState } from 'react';
import { GripVertical, Plus, X, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/helpers';
import toast from 'react-hot-toast';

const ALL_WIDGETS = [
  { id: 'revenue', label: 'Revenue Chart', size: 'large', category: 'Finance' },
  { id: 'users', label: 'Users Chart', size: 'large', category: 'Audience' },
  { id: 'engagement', label: 'Engagement Metrics', size: 'medium', category: 'Performance' },
  { id: 'income', label: 'Income Breakdown', size: 'medium', category: 'Finance' },
  { id: 'activity', label: 'Live Activity Feed', size: 'medium', category: 'Activity' },
  { id: 'geo', label: 'Geographic Data', size: 'medium', category: 'Audience' },
  { id: 'transactions', label: 'Recent Transactions', size: 'large', category: 'Finance' },
  { id: 'topPages', label: 'Top Pages', size: 'small', category: 'Performance' },
];

export default function WidgetGrid({ activeWidgets, onToggleWidget, onResetLayout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  function handleDragStart(e, id) {
    setDragging(id);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e, id) {
    e.preventDefault();
    if (id !== dragging) setDropTarget(id);
  }

  function handleDrop(e, targetId) {
    e.preventDefault();
    if (dragging && targetId && dragging !== targetId) {
      toast.success(`Widget repositioned`);
    }
    setDragging(null);
    setDropTarget(null);
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="btn-ghost text-xs gap-1.5"
        >
          <Plus size={14} /> Widgets
        </button>
        <button onClick={onResetLayout} className="btn-ghost text-xs gap-1.5">
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Widget picker modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={e => e.target === e.currentTarget && setIsOpen(false)}
        >
          <div className="glass-card w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b"
              style={{ borderColor: 'var(--border-subtle)' }}>
              <h3 className="heading-font text-sm" style={{ color: 'var(--text-primary)' }}>
                Customize Widgets
              </h3>
              <button onClick={() => setIsOpen(false)} className="btn-ghost h-7 w-7 p-0 justify-center">
                <X size={14} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-2 max-h-80 overflow-y-auto">
              {ALL_WIDGETS.map(w => {
                const isActive = activeWidgets.includes(w.id);
                return (
                  <div key={w.id}
                    className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200"
                    style={{
                      background: isActive ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isActive ? 'rgba(0,212,255,0.2)' : 'var(--border-subtle)'}`,
                    }}
                    onClick={() => onToggleWidget(w.id)}
                  >
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{w.label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{w.category} · {w.size}</p>
                    </div>
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                      isActive ? 'text-cyan-500' : 'text-gray-500'
                    )} style={{ background: isActive ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)' }}>
                      {isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-4 border-t flex justify-end" style={{ borderColor: 'var(--border-subtle)' }}>
              <button onClick={() => setIsOpen(false)} className="btn-primary text-xs">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
