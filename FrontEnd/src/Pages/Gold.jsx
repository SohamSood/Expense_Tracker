import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../context/AuthContext";
import { Card, Button, Input } from "../Components/ui";
import { Loader2 } from "lucide-react";

export default function Gold() {
  const [livePrice, setLivePrice] = useState(null);
  const [portfolio, setPortfolio] = useState({ totalInvested: 0, totalGoldQuantity: 0, transactions: [] });
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Fetch portfolio on mount
    fetchPortfolio();

    // Connect to Socket.io
    const socket = io("http://localhost:5001/gold");

    socket.on("priceUpdate", (data) => {
      setLivePrice(data.price);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await api.get("/api/gold/portfolio");
      setPortfolio(res.data);
    } catch (err) {
      console.error("Failed to fetch gold portfolio", err);
    }
  };

  const handleBuyGold = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0 || !livePrice) return;

    setLoading(true);
    setErrorMsg("");
    try {
      await api.post("/api/gold/buy", {
        amountInvested: Number(amount),
        livePrice: livePrice,
      });
      setAmount("");
      fetchPortfolio(); // Refresh portfolio
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to buy gold");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-[var(--text-primary)]">Digital Gold</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-secondary)]">Live Gold Price</h2>
          {livePrice ? (
            <div className="text-4xl font-bold text-[var(--primary)]">
              ₹{livePrice} <span className="text-sm font-normal text-gray-500">/ gram</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <Loader2 className="animate-spin mr-2" /> Connecting to live feed...
            </div>
          )}

          <div className="mt-8">
            <h3 className="font-semibold mb-4 text-[var(--text-primary)]">Buy Digital Gold</h3>
            {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
            <form onSubmit={handleBuyGold} className="space-y-4">
              <Input
                label="Amount (₹)"
                type="number"
                min="1"
                placeholder="Enter amount to invest"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              {amount && livePrice && (
                <p className="text-sm text-gray-500">
                  You will get approximately {(Number(amount) / livePrice).toFixed(4)} grams
                </p>
              )}
              <Button type="submit" disabled={loading || !livePrice} className="w-full">
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Buy Now"}
              </Button>
            </form>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-secondary)]">Your Portfolio</h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
              <p className="text-sm text-gray-500">Total Invested</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">₹{portfolio.totalInvested.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
              <p className="text-sm text-gray-500">Total Gold</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{portfolio.totalGoldQuantity.toFixed(4)} g</p>
            </div>
          </div>

          <h3 className="font-semibold mb-4 text-[var(--text-primary)]">Recent Transactions</h3>
          {portfolio.transactions.length > 0 ? (
            <ul className="space-y-3">
              {portfolio.transactions.slice().reverse().map((tx) => (
                <li key={tx._id} className="flex justify-between items-center p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">Bought {tx.goldQuantity.toFixed(4)}g</p>
                    <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[var(--primary)]">₹{tx.amountInvested}</p>
                    <p className="text-xs text-gray-500">@ ₹{tx.priceAtPurchase}/g</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No transactions yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
