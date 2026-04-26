import React, { useState, useMemo, useCallback } from 'react';
import {
  Search, Filter, Download,
  ChevronLeft, ChevronRight,
  Eye, Trash2, FileText, X
} from 'lucide-react';
import { Card, Button, Badge, cn } from '../Components/ui';
import { useBills } from '../hooks/useBills';
import { useNavigate } from 'react-router-dom';

// ── Bill Detail Modal ──────────────────────────────────────────
function BillModal({ bill, onClose }) {
  if (!bill) return null;
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
      }}
    >
      <div
        className="modal-box"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)', borderRadius: '1rem', padding: '2rem',
          minWidth: '340px', maxWidth: '480px', width: '90%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Bill Details</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {[
            ['Category',  bill.type],
            ['Amount',    `₹${bill.amount}`],
            ['Date',      bill.date],
            ['Time',      bill.time || '—'],
            ['Status',    bill.status],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{label}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{value}</span>
            </div>
          ))}
          {bill.items?.length > 0 && (
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Items</p>
              {bill.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '0.25rem 0' }}>
                  <span>{item.name}</span><span>₹{item.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Export PDF (simple print) ────────────────────────────────────
function exportPDF(bills) {
  const rows = bills.map(b =>
    `<tr><td>${b.type}</td><td>₹${b.amount}</td><td>${b.date}</td><td>${b.time || ''}</td><td>${b.status}</td></tr>`
  ).join('');
  const html = `
    <html><head><title>Expenses</title>
    <style>body{font-family:sans-serif;padding:20px}h1{margin-bottom:12px}
    table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}
    th{background:#f5f5f5}</style></head>
    <body><h1>Expense Report</h1>
    <table><thead><tr><th>Category</th><th>Amount</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
    <tbody>${rows}</tbody></table></body></html>`;
  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  w.print();
}

// ── Main Component ────────────────────────────────────────────
export default function ViewBills() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm]   = useState('');
  const [filterType, setFilterType]   = useState('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const navigate = useNavigate();

  // Debounce search input
  const handleSearch = useCallback((val) => {
    setSearchTerm(val);
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(() => {
      setDebouncedSearch(val);
      setCurrentPage(1);
    }, 350);
  }, []);

  const { bills, loading, error, total, totalPages, totalAmount, deleteBill } =
    useBills({ page: currentPage, limit: 8, search: debouncedSearch, type: filterType });

  const handleDelete = async (bill) => {
    if (!window.confirm(`Delete "${bill.type}" (₹${bill.amount})?`)) return;
    try {
      await deleteBill(bill._id);
    } catch {
      alert('Failed to delete bill');
    }
  };

  if (loading && bills.length === 0) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Fetching your bills...</p>
      </div>
    );
  }

  return (
    <>
      {selectedBill && <BillModal bill={selectedBill} onClose={() => setSelectedBill(null)} />}

      <div className="view-bills-container">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Expenses Library</h1>
            <p className="page-subtitle">Manage and track all your recorded bills</p>
          </div>
          <div className="header-actions">
            <Button variant="outline" onClick={() => exportPDF(bills)}>
              <Download size={18} /> Export PDF
            </Button>
            <Button onClick={() => navigate('/add-bill')}>+ Add New Bill</Button>
          </div>
        </div>

        {/* Mini stats */}
        <div className="view-bills-stats">
          <Card className="stat-mini-card">
            <p className="label">Total Amount</p>
            <p className="value">₹{totalAmount.toLocaleString()}</p>
          </Card>
          <Card className="stat-mini-card">
            <p className="label">Total Bills</p>
            <p className="value">{total}</p>
          </Card>
          <Card className="stat-mini-card">
            <p className="label">Avg. Bill</p>
            <p className="value">₹{total ? Math.round(totalAmount / total) : 0}</p>
          </Card>
        </div>

        <Card className="table-card">
          {/* Filters */}
          <div className="table-filters">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by category or status..."
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <select
                className="filter-select"
                value={filterType}
                onChange={e => { setFilterType(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All Categories</option>
                <option value="food">Food</option>
                <option value="shopping">Shopping</option>
                <option value="travel">Travel</option>
                <option value="utilities">Utilities</option>
                <option value="transport">Transport</option>
                <option value="health">Health</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table className="ui-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-table-cell">
                      <FileText size={48} className="empty-icon" />
                      <p>No bills found.</p>
                    </td>
                  </tr>
                ) : (
                  bills.map(bill => (
                    <tr key={bill._id}>
                      <td>
                        <div className="type-cell">
                          <span className="type-name">{bill.type}</span>
                          {bill.items?.length > 0 && (
                            <span className="items-count">{bill.items.length} items</span>
                          )}
                        </div>
                      </td>
                      <td className="font-bold">₹{bill.amount}</td>
                      <td>
                        <Badge variant={bill.status?.toLowerCase() === 'paid' ? 'success' : 'warning'}>
                          {bill.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="date-cell">
                          <span className="date">{bill.date}</span>
                          <span className="time">{bill.time}</span>
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="action-btns">
                          <button className="icon-action" title="View" onClick={() => setSelectedBill(bill)}>
                            <Eye size={16} />
                          </button>
                          <button className="icon-action danger" title="Delete" onClick={() => handleDelete(bill)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="table-pagination">
              <span className="pagination-info">
                Page {currentPage} of {totalPages} ({total} bills)
              </span>
              <div className="pagination-controls">
                <Button
                  variant="outline" size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  <ChevronLeft size={16} /> Previous
                </Button>
                <div className="page-numbers">
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    const pg = i + 1;
                    return (
                      <button
                        key={pg}
                        className={cn('page-num', currentPage === pg && 'active')}
                        onClick={() => setCurrentPage(pg)}
                      >
                        {pg}
                      </button>
                    );
                  })}
                </div>
                <Button
                  variant="outline" size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
