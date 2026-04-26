import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Clock, 
  Receipt, 
  Coins, 
  PiggyBank,
  ArrowRight,
  PlusCircle,
  Activity
} from 'lucide-react';
import { Card, Button, Badge, cn } from '../Components/ui';
import { api } from '../utils/api';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [liveGoldPrice, setLiveGoldPrice] = useState(6000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    
    // Connect to gold socket for live net-worth updates
    const socket = io("http://localhost:5001/gold");
    socket.on("priceUpdate", (d) => setLiveGoldPrice(d.price));
    
    return () => socket.disconnect();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/summary');
      setData(res);
    } catch (err) {
      console.error('Failed to fetch dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="spinner border-t-blue-600" />
        <p className="text-gray-500 font-medium">Assembling your financial command center...</p>
      </div>
    );
  }

  const { summary, activities } = data;
  
  // Calculate real-time gold value and net worth
  const currentGoldValue = summary.totalGoldQuantity * liveGoldPrice;
  const netWorth = (currentGoldValue + summary.totalFDMaturity) - summary.totalExpenses;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)]">Financial Overview</h1>
          <p className="text-[var(--text-secondary)]">Track your spending, savings, and investments in real-time</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/add-bill')} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
            <PlusCircle size={18} className="mr-2" /> Add Expense
          </Button>
        </div>
      </div>

      {/* Main Net Worth Card */}
      <Card className="p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-0 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
          <Wallet size={200} />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2 text-indigo-300 font-bold tracking-widest text-xs uppercase">
            <Activity size={14} /> Live Net Worth Estimate
          </div>
          <div>
            <h2 className="text-5xl font-black tracking-tighter">
              ₹{netWorth.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <Badge className="bg-green-500/20 text-green-400 border-0 flex items-center gap-1">
                <TrendingUp size={12} /> Healthy Portfolio
              </Badge>
              <span className="text-indigo-300/60 text-sm">Includes Gold & FD Maturity</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Expenses */}
        <Card className="p-6 hover:shadow-lg transition-all border-l-4 border-red-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><Receipt size={24} /></div>
            <button onClick={() => navigate('/view-bills')} className="text-gray-400 hover:text-red-500 transition-colors"><ArrowRight size={20} /></button>
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Expenses</p>
          <h3 className="text-2xl font-black text-gray-900">₹{summary.totalExpenses.toLocaleString()}</h3>
          <div className="mt-3 flex items-center text-xs text-red-500 font-bold">
            <TrendingUp size={12} className="mr-1" /> Money Outflow
          </div>
        </Card>

        {/* Gold */}
        <Card className="p-6 hover:shadow-lg transition-all border-l-4 border-yellow-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl"><Coins size={24} /></div>
            <button onClick={() => navigate('/gold')} className="text-gray-400 hover:text-yellow-500 transition-colors"><ArrowRight size={20} /></button>
          </div>
          <p className="text-gray-500 text-sm font-medium">Gold Assets (Live)</p>
          <h3 className="text-2xl font-black text-gray-900">₹{currentGoldValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
          <div className="mt-3 flex items-center text-xs text-yellow-600 font-bold">
            <Badge className="bg-yellow-100 text-yellow-700 border-0">{summary.totalGoldQuantity.toFixed(4)}g owned</Badge>
          </div>
        </Card>

        {/* FDs */}
        <Card className="p-6 hover:shadow-lg transition-all border-l-4 border-green-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><PiggyBank size={24} /></div>
            <button onClick={() => navigate('/fd')} className="text-gray-400 hover:text-green-500 transition-colors"><ArrowRight size={20} /></button>
          </div>
          <p className="text-gray-500 text-sm font-medium">FD Maturity Value</p>
          <h3 className="text-2xl font-black text-gray-900">₹{summary.totalFDMaturity.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
          <div className="mt-3 flex items-center text-xs text-green-600 font-bold">
            <Badge className="bg-green-100 text-green-700 border-0">Safe Savings</Badge>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Feed */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-indigo-600" />
              <h3 className="text-xl font-bold">Recent Activity</h3>
            </div>
            <Badge variant="secondary">Combined Feed</Badge>
          </div>
          
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((act, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-lg",
                      act.category === 'expense' ? "bg-red-50 text-red-600" :
                      act.category === 'gold' ? "bg-yellow-50 text-yellow-600" : "bg-green-50 text-green-600"
                    )}>
                      {act.category === 'expense' ? <Receipt size={18} /> :
                       act.category === 'gold' ? <Coins size={18} /> : <PiggyBank size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{act.title}</p>
                      <p className="text-xs text-gray-400">{new Date(act.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={cn(
                    "font-black",
                    act.category === 'expense' ? "text-red-500" : "text-green-600"
                  )}>
                    {act.category === 'expense' ? "-" : "+"} ₹{act.amount.toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Activity size={48} className="mx-auto mb-4 opacity-10" />
                <p>No recent activity detected.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Breakdown / Insights */}
        <Card className="p-6 flex flex-col">
          <h3 className="text-xl font-bold mb-6">Asset Allocation</h3>
          <div className="flex-1 flex flex-col justify-center space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-600">Savings (FDs)</span>
                <span className="font-bold">{((summary.totalFDMaturity / (currentGoldValue + summary.totalFDMaturity || 1)) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-1000" 
                  style={{ width: `${(summary.totalFDMaturity / (currentGoldValue + summary.totalFDMaturity || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-600">Investments (Gold)</span>
                <span className="font-bold">{((currentGoldValue / (currentGoldValue + summary.totalFDMaturity || 1)) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 transition-all duration-1000" 
                  style={{ width: `${(currentGoldValue / (currentGoldValue + summary.totalFDMaturity || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-indigo-50 p-6 rounded-2xl mt-4">
              <p className="text-indigo-900 font-bold text-sm mb-2">Smart Tip 💡</p>
              <p className="text-indigo-700 text-xs leading-relaxed">
                {summary.totalExpenses > (summary.totalFDMaturity + currentGoldValue) * 0.2 ? 
                  "Your expenses are a bit high relative to your assets. Consider reviewing your subscription bills." :
                  "Your asset-to-expense ratio looks great! Keep up the disciplined investing habits."}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
