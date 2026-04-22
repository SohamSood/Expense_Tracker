import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Clock, 
  ArrowUpRight,
  MoreVertical
} from 'lucide-react';
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
          api.get('/bills/average')
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

      {/* Recent Activity */}
      <Card className="activity-card" style={{ marginTop: '2rem' }}>
        <div className="card-header-row">
          <h3>Recent activity</h3>
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
