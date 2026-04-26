import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import { Card, Button, Input, Badge, cn } from "../Components/ui";
import { Loader2, TrendingUp, Wallet, Calendar, Percent, Trash2, PieChart } from "lucide-react";

export default function FD() {
  const [formData, setFormData] = useState({
    principal: "",
    rate: "",
    timeYears: "",
    frequency: "1", 
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedFDs, setSavedFDs] = useState([]);
  const [fdsLoading, setFdsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchFDs();
  }, []);

  const fetchFDs = async () => {
    try {
      setFdsLoading(true);
      const data = await api.get("/fd");
      setSavedFDs(data);
    } catch (err) {
      console.error("Failed to fetch FDs", err);
    } finally {
      setFdsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const data = await api.post("/fd/calculate", {
        principal: Number(formData.principal),
        rate: Number(formData.rate),
        timeYears: Number(formData.timeYears),
        frequency: Number(formData.frequency),
      });
      setResult(data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to calculate FD returns");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFD = async () => {
    if (!result) return;
    try {
      setLoading(true);
      await api.post("/fd/save", result);
      setResult(null);
      setFormData({ principal: "", rate: "", timeYears: "", frequency: "1" });
      fetchFDs();
      alert("FD recorded successfully!");
    } catch (err) {
      alert("Failed to save FD record");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFD = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`/fd/${id}`);
      fetchFDs();
    } catch (err) {
      alert("Failed to delete record");
    }
  };

  const getFreqLabel = (f) => {
    const map = { 1: "Annually", 2: "Semi-Annually", 4: "Quarterly", 12: "Monthly" };
    return map[f] || "Unknown";
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Fixed Deposits</h1>
        <p className="text-[var(--text-secondary)]">Plan your savings and track your investments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Calculator Form */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart size={20} className="text-[var(--primary)]" />
            <h2 className="text-xl font-bold">Return Calculator</h2>
          </div>
          
          {errorMsg && <Badge variant="danger" className="w-full mb-4 justify-center py-2">{errorMsg}</Badge>}
          
          <form onSubmit={handleCalculate} className="space-y-4">
            <Input
              label="Principal Amount (₹)"
              type="number"
              name="principal"
              min="1"
              placeholder="e.g. 1,00,000"
              value={formData.principal}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Interest Rate (%)"
                type="number"
                name="rate"
                step="0.01"
                min="0.1"
                placeholder="e.g. 7.5"
                value={formData.rate}
                onChange={handleChange}
                required
              />
              <Input
                label="Period (Years)"
                type="number"
                name="timeYears"
                step="0.1"
                min="0.1"
                placeholder="e.g. 5"
                value={formData.timeYears}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Compounding Frequency</label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border bg-[var(--background)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] transition-all outline-none"
                required
              >
                <option value="1">Annually</option>
                <option value="2">Semi-Annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
              </select>
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-6 h-12 text-lg">
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Calculate Returns"}
            </Button>
          </form>
        </Card>

        {/* Result Card */}
        <div className="flex flex-col gap-4">
          {result ? (
            <Card className="p-6 h-full flex flex-col justify-between border-2 border-[var(--primary)] bg-[var(--primary)] bg-opacity-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp size={120} />
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-[var(--text-secondary)] mb-6">Maturity Summary</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-[var(--border)] pb-2">
                    <span className="text-gray-500 text-sm">Principal Amount</span>
                    <span className="text-xl font-bold">₹{result.principal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-[var(--border)] pb-2">
                    <span className="text-gray-500 text-sm">Estimated Interest</span>
                    <span className="text-xl font-bold text-green-600">+₹{result.interestEarned.toLocaleString()}</span>
                  </div>
                  <div className="mt-8">
                    <p className="text-gray-500 text-sm mb-1">Maturity Amount</p>
                    <p className="text-4xl font-black text-[var(--primary)]">₹{result.maturityAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button onClick={handleSaveFD} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
                  Save to My FDs
                </Button>
                <Button variant="outline" onClick={() => setResult(null)} className="flex-1">
                  Discard
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-8 h-full flex flex-col items-center justify-center text-center text-gray-400 border-2 border-dashed">
              <Wallet size={64} className="mb-4 opacity-20" />
              <p className="max-w-[250px]">Enter details on the left to see your estimated maturity returns</p>
            </Card>
          )}
        </div>
      </div>

      {/* Saved FDs List */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-[var(--primary)]" />
          <h2 className="text-2xl font-bold">My Fixed Deposits</h2>
        </div>

        {fdsLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-400" /></div>
        ) : savedFDs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedFDs.map((fd) => (
              <Card key={fd._id} className="p-5 hover:shadow-xl transition-all border-l-4 border-[var(--primary)]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-2xl font-black text-[var(--text-primary)]">₹{fd.principal.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Invested on {new Date(fd.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteFD(fd._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-6">
                  <div className="flex items-center gap-2">
                    <Percent size={14} className="text-blue-500" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Rate</p>
                      <p className="text-sm font-bold">{fd.rate}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-purple-500" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Tenure</p>
                      <p className="text-sm font-bold">{fd.timeYears} Yrs</p>
                    </div>
                  </div>
                  <div className="col-span-2 bg-gray-50 p-3 rounded-lg border border-dashed">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Maturity Amount</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-black text-green-600">₹{fd.maturityAmount.toLocaleString()}</span>
                      <Badge className="bg-blue-100 text-blue-600 border-0">{getFreqLabel(fd.frequency)}</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
            <p className="text-gray-400">You haven't saved any FD records yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
