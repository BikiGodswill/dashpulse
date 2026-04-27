'use client';

import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Download, Filter } from 'lucide-react';
import { generateTransactions } from '@/lib/seedData';
import { formatCurrency, exportCSV, statusColors, timeAgo, cn } from '@/lib/helpers';

const STATUSES = ['all', 'completed', 'pending', 'processing', 'failed'];

export default function TransactionsTable({ limit }) {
  const allTransactions = useMemo(() => generateTransactions(limit || 50), [limit]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    let data = [...allTransactions];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(t =>
        t.customer.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.plan.toLowerCase().includes(q)
      );
    }
    if (status !== 'all') data = data.filter(t => t.status === status);
    data.sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy];
      if (sortBy === 'date') { va = new Date(va); vb = new Date(vb); }
      if (sortDir === 'asc') return va > vb ? 1 : -1;
      return va < vb ? 1 : -1;
    });
    return data;
  }, [allTransactions, search, status, sortBy, sortDir]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  function toggleSort(col) {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
    setPage(1);
  }

  const SortBtn = ({ col, label }) => (
    <button onClick={() => toggleSort(col)}
      className="flex items-center gap-1 group transition-colors"
      style={{ color: sortBy === col ? '#00D4FF' : 'var(--text-muted)' }}>
      {label}
      <ArrowUpDown size={11} className="opacity-60 group-hover:opacity-100" />
    </button>
  );

  return (
    <div className="glass-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="heading-font text-sm" style={{ color: 'var(--text-primary)' }}>Transactions</h3>
        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search transactions…"
              className="input-field pl-8 h-8 text-xs"
            />
          </div>

          {/* Status filter */}
          <div className="flex p-0.5 rounded-lg gap-0.5 flex-wrap"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)' }}>
            {STATUSES.map(s => (
              <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                className="px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-all"
                style={status === s
                  ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF' }
                  : { color: 'var(--text-muted)' }
                }>
                {s}
              </button>
            ))}
          </div>

          {/* Export */}
          <button onClick={() => exportCSV(filtered, 'transactions')} className="btn-ghost h-8 text-xs gap-1.5">
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
              {[
                { col: 'id', label: 'ID' },
                { col: 'customer', label: 'Customer' },
                { col: 'plan', label: 'Plan' },
                { col: 'amount', label: 'Amount' },
                { col: 'status', label: 'Status' },
                { col: 'method', label: 'Method' },
                { col: 'date', label: 'Date' },
              ].map(({ col, label }) => (
                <th key={col} className="px-5 py-3 text-left font-medium">
                  <SortBtn col={col} label={label} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                  No transactions found
                </td>
              </tr>
            ) : paginated.map(t => (
              <tr key={t.id} className="border-b transition-colors cursor-pointer"
                style={{ borderColor: 'var(--border-subtle)' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                <td className="px-5 py-3.5 font-mono" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                  {t.id.slice(0, 10)}…
                </td>
                <td className="px-5 py-3.5 font-medium" style={{ color: 'var(--text-primary)' }}>
                  {t.customer}
                </td>
                <td className="px-5 py-3.5">
                  <span className="badge badge-info">{t.plan}</span>
                </td>
                <td className="px-5 py-3.5 metric-number font-medium" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(t.amount)}
                </td>
                <td className="px-5 py-3.5">
                  <span className={`badge ${statusColors[t.status] || 'badge-info'} capitalize`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-5 py-3.5" style={{ color: 'var(--text-secondary)' }}>{t.method}</td>
                <td className="px-5 py-3.5" style={{ color: 'var(--text-muted)' }}>{timeAgo(t.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t"
        style={{ borderColor: 'var(--border-subtle)' }}>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {filtered.length} results · Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="btn-ghost h-7 px-2.5 text-xs disabled:opacity-40">‹ Prev</button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const n = Math.min(Math.max(page - 2, 1) + i, totalPages);
            return (
              <button key={n} onClick={() => setPage(n)}
                className="h-7 w-7 rounded-lg text-xs font-medium transition-all"
                style={n === page
                  ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF' }
                  : { color: 'var(--text-muted)' }
                }>
                {n}
              </button>
            );
          })}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="btn-ghost h-7 px-2.5 text-xs disabled:opacity-40">Next ›</button>
        </div>
      </div>
    </div>
  );
}
