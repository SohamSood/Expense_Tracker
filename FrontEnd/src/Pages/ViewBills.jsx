import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Eye,
  Trash2,
  FileText
} from 'lucide-react';
import { Card, Button, Badge, Input, cn } from '../Components/ui';
import { useBills } from '../hooks/useBills';

export default function ViewBills() {
  const { bills, loading, error } = useBills();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      const matchesSearch = 
        bill.id?.toString().includes(searchTerm) || 
        bill.type?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || bill.type?.toLowerCase() === filterType.toLowerCase();
      
      return matchesSearch && matchesType;
    });
  }, [bills, searchTerm, filterType]);

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = useMemo(() => {
    const total = filteredBills.reduce((sum, b) => sum + Number(b.amount || 0), 0);
    const count = filteredBills.length;
    return { total, count };
  }, [filteredBills]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Fetching your bills...</p>
      </div>
    );
  }

  return (
    <div className="view-bills-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Expenses Library</h1>
          <p className="page-subtitle">Manage and track all your recorded bills</p>
        </div>
        <div className="header-actions">
          <Button variant="outline"><Download size={18} /> Export PDF</Button>
          <Button><PlusCircle size={18} /> Add New Bill</Button>
        </div>
      </div>

      <div className="view-bills-stats">
        <Card className="stat-mini-card">
          <p className="label">Total Amount</p>
          <p className="value">₹{stats.total.toLocaleString()}</p>
        </Card>
        <Card className="stat-mini-card">
          <p className="label">Total Bills</p>
          <p className="value">{stats.count}</p>
        </Card>
        <Card className="stat-mini-card">
          <p className="label">Avg. Bill</p>
          <p className="value">₹{stats.count ? (stats.total / stats.count).toFixed(0) : 0}</p>
        </Card>
      </div>

      <Card className="table-card">
        <div className="table-filters">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by ID or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <select 
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="food">Food</option>
              <option value="shopping">Shopping</option>
              <option value="travel">Travel</option>
              <option value="utilities">Utilities</option>
            </select>
            <Button variant="outline" size="sm"><Filter size={16} /></Button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="ui-table">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date & Time</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBills.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-table-cell">
                    <FileText size={48} className="empty-icon" />
                    <p>No bills found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                paginatedBills.map((bill) => (
                  <tr key={bill.id}>
                    <td className="font-mono text-sm">#{bill.id}</td>
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
                        <button className="icon-action"><Eye size={16} /></button>
                        <button className="icon-action danger"><Trash2 size={16} /></button>
                        <button className="icon-action"><MoreHorizontal size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="table-pagination">
            <span className="pagination-info">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBills.length)} of {filteredBills.length}
            </span>
            <div className="pagination-controls">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft size={16} /> Previous
              </Button>
              <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    className={cn('page-num', currentPage === i + 1 && 'active')}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
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
  );
}

function PlusCircle({ size }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
  );
}
