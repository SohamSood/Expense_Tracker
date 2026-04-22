import React, { useState } from "react";
import { api } from "../context/AuthContext";
import { Card, Button, Input } from "../Components/ui";
import { Loader2, TrendingUp } from "lucide-react";

export default function FD() {
  const [formData, setFormData] = useState({
    principal: "",
    rate: "",
    timeYears: "",
    frequency: "1", // Annual compounding by default
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
      const res = await api.post("/api/fd/calculate", {
        principal: Number(formData.principal),
        rate: Number(formData.rate),
        timeYears: Number(formData.timeYears),
        frequency: Number(formData.frequency),
      });
      setResult(res.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to calculate FD returns");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-[var(--text-primary)]">Fixed Deposit Calculator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-[var(--text-secondary)]">Enter Details</h2>
          {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
          <form onSubmit={handleCalculate} className="space-y-4">
            <Input
              label="Principal Amount (₹)"
              type="number"
              name="principal"
              min="1000"
              placeholder="e.g. 100000"
              value={formData.principal}
              onChange={handleChange}
              required
            />
            <Input
              label="Interest Rate (%)"
              type="number"
              name="rate"
              step="0.1"
              min="1"
              placeholder="e.g. 7.5"
              value={formData.rate}
              onChange={handleChange}
              required
            />
            <Input
              label="Time Period (Years)"
              type="number"
              name="timeYears"
              step="0.5"
              min="0.5"
              placeholder="e.g. 3"
              value={formData.timeYears}
              onChange={handleChange}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                Compounding Frequency
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="input-field bg-[var(--background)] border-[var(--border)] text-[var(--text-primary)] p-3 rounded-lg w-full"
                required
              >
                <option value="1">Annually</option>
                <option value="2">Semi-Annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
              </select>
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-6">
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Calculate Returns"}
            </Button>
          </form>
        </Card>

        {result && (
          <Card className="p-6 flex flex-col justify-center items-center text-center bg-gradient-to-br from-[var(--background)] to-[var(--surface)]">
            <div className="w-16 h-16 bg-[var(--primary)] bg-opacity-20 rounded-full flex items-center justify-center mb-6">
              <TrendingUp className="text-[var(--primary)]" size={32} />
            </div>
            
            <h2 className="text-xl font-semibold mb-8 text-[var(--text-secondary)]">Estimated Returns</h2>
            
            <div className="space-y-6 w-full max-w-sm">
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-4">
                <span className="text-gray-500">Total Investment</span>
                <span className="font-semibold text-[var(--text-primary)] text-lg">₹{result.principal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-4">
                <span className="text-gray-500">Total Interest</span>
                <span className="font-semibold text-green-500 text-lg">+₹{result.interestEarned.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-medium text-[var(--text-secondary)]">Maturity Amount</span>
                <span className="text-2xl font-bold text-[var(--primary)]">₹{result.maturityAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
