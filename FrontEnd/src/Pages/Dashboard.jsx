import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Clock, 
  ArrowUpRight,
  Filter,
  Search as SearchIcon,
  MoreVertical
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Card, Button, Badge, cn } from '../Components/ui';
import { api } from '../utils/api';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const [recentBills, setRecentBills] = useState([]);
  const [stats, setStats] = useState({
    totalSum: 0,
    avgSpending: 0,
    monthCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [billsData, avgData] = await Promise.all([
          api.get('/bills/recent'),
          api.get('/average')
        ]);
        
        setRecentBills(billsData);
        
        // Calculate stats
        let totalSum = 0;
        let totalCount = 0;
        Object.values(avgData).forEach((month) => {
          totalSum += month.sum;
          totalCount += 1;
        });
        
        setStats({
          totalSum,
          avgSpending: totalCount ? totalSum / totalCount : 0,
          monthCount: totalCount
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
  ];

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      {/* Summary Cards */}
      <div className="summary-cards">
        <Card className="summary-card">
          <div className="card-header">
            <div className="icon-wrapper primary">
              <Wallet size={20} />
            </div>
            <Badge variant="success">+12%</Badge>
          </div>
          <div className="card-body">
            <p className="label">Total Spending</p>
            <h2 className="value">₹{stats.totalSum.toLocaleString()}</h2>
            <p className="sub-label">Across {stats.monthCount} months</p>
          </div>
        </Card>

        <Card className="summary-card">
          <div className="card-header">
            <div className="icon-wrapper success">
              <TrendingUp size={20} />
            </div>
            <Badge variant="primary">Stable</Badge>
          </div>
          <div className="card-body">
            <p className="label">Avg. Monthly</p>
            <h2 className="value">₹{stats.avgSpending.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h2>
            <p className="sub-label">On track with budget</p>
          </div>
        </Card>

        <Card className="summary-card">
          <div className="card-header">
            <div className="icon-wrapper warning">
              <Clock size={20} />
            </div>
            <Badge variant="warning">Alert</Badge>
          </div>
          <div className="card-body">
            <p className="label">Active Months</p>
            <h2 className="value">{stats.monthCount}</h2>
            <p className="sub-label">Data recorded</p>
          </div>
        </Card>
      </div>

      {/* Main Content Areas */}
      <div className="dashboard-main-grid">
        {/* Analytics Chart */}
        <Card className="chart-card">
          <div className="card-header-row">
            <div>
              <h3>Spending Analytics</h3>
              <p className="text-secondary">Your spending trend over time</p>
            </div>
            <div className="actions">
              <Button variant="outline" size="sm">
                <Filter size={16} /> Filter
              </Button>
            </div>
          </div>
          
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border-light)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--text-primary)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Categories / Wallets */}
        <Card className="wallets-card">
          <div className="card-header-row">
            <h3>My Wallets</h3>
            <Button variant="ghost" size="sm"><ArrowUpRight size={16} /></Button>
          </div>
          <div className="wallets-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="wallet-item">
                <div className="wallet-info">
                  <div className={cn("wallet-icon", i === 1 ? "primary" : i === 2 ? "success" : "warning")} />
                  <div>
                    <p className="wallet-name">Wallet 0{i}</p>
                    <p className="wallet-status">Active</p>
                  </div>
                </div>
                <div className="wallet-balance">
                  ₹{(20000 - i * 3000).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4" variant="outline">Manage Wallets</Button>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="activity-card">
        <div className="card-header-row">
          <h3>Recent activity</h3>
          <div className="search-input">
            <SearchIcon size={16} />
            <input type="text" placeholder="Search activities..." />
          </div>
        </div>

        <div className="activity-list">
          {recentBills.length === 0 ? (
            <div className="empty-state">No recent activities found.</div>
          ) : (
            recentBills.map((bill) => (
              <div key={bill.id} className="activity-item">
                <div className="activity-info">
                  <div className="activity-icon-container">
                    <Receipt size={18} />
                  </div>
                  <div>
                    <p className="activity-title">{bill.name || bill.type}</p>
                    <p className="activity-date">{new Date(bill.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="activity-meta">
                  <p className="activity-amount">₹{bill.amount}</p>
                  <Badge variant="success">Recorded</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
