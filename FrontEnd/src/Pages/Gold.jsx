import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../utils/api";
import { Card, Button, Input, Badge, cn } from "../Components/ui";
import { Loader2, TrendingUp, TrendingDown, History, ShoppingCart, Tag } from "lucide-react";

export default function Gold() {
  const [livePrice, setLivePrice] = useState(null);
  const [prevPrice, setPrevPrice] = useState(null);
  const [portfolio, setPortfolio] = useState({ totalInvested: 0, totalGoldQuantity: 0, transactions: [] });
  const [buyAmount, setBuyAmount] = useState("");
  const [sellQuantity, setSellQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("buy"); // "buy" or "sell"

  useEffect(() => {
    fetchPortfolio();

    const socket = io("http://localhost:5001/gold");

    socket.on("priceUpdate", (data) => {
      setLivePrice((prev) => {
        setPrevPrice(prev);
        return data.price;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchPortfolio = async () => {
    try {
      const data = await api.get("/gold/portfolio");
      setPortfolio(data);
    } catch (err) {
      console.error("Failed to fetch gold portfolio", err);
    }
  };

  const handleBuyGold = async (e) => {
    e.preventDefault();
    if (!buyAmount || buyAmount <= 0 || !livePrice) return;

    setLoading(true);
    setErrorMsg("");
    try {
      await api.post("/gold/buy", {
        amountInvested: Number(buyAmount),
        livePrice: livePrice,
      });
      setBuyAmount("");
      fetchPortfolio();
      alert("Gold purchased successfully!");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to buy gold");
    } finally {
      setLoading(false);
    }
  };

  const handleSellGold = async (e) => {
    e.preventDefault();
    if (!sellQuantity || sellQuantity <= 0 || !livePrice) return;

    setLoading(true);
    setErrorMsg("");
    try {
      await api.post("/gold/sell", {
        goldQuantity: Number(sellQuantity),
        livePrice: livePrice,
      });
      setSellQuantity("");
      fetchPortfolio();
      alert("Gold sold successfully!");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to sell gold");
    } finally {
      setLoading(false);
    }
  };

  const isPriceUp = livePrice && prevPrice ? livePrice >= prevPrice : true;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Digital Gold</h1>
          <p className="text-[var(--text-secondary)]">Invest in 24K pure digital gold safely</p>
        </div>
        {livePrice && (
          <Card className="flex items-center gap-4 py-2 px-4 border-l-4 border-yellow-500 bg-yellow-50/10">
            <div className={cn("p-2 rounded-full", isPriceUp ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>
              {isPriceUp ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Live Market Price</p>
              <p className="text-2xl font-black text-yellow-600">₹{livePrice.toLocaleString()} <span className="text-sm font-normal text-gray-400">/ g</span></p>
            </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trading Section */}
        <Card className="lg:col-span-1 p-0 overflow-hidden flex flex-col">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("buy")}
              className={cn("flex-1 py-4 font-bold transition-all", activeTab === "buy" ? "bg-yellow-500 text-white" : "hover:bg-gray-50 text-gray-500")}
            >
              BUY
            </button>
            <button
              onClick={() => setActiveTab("sell")}
              className={cn("flex-1 py-4 font-bold transition-all", activeTab === "sell" ? "bg-yellow-600 text-white" : "hover:bg-gray-50 text-gray-500")}
            >
              SELL
            </button>
          </div>

          <div className="p-6">
            {errorMsg && <Badge variant="danger" className="w-full mb-4 justify-center py-2">{errorMsg}</Badge>}
            
            {activeTab === "buy" ? (
              <form onSubmit={handleBuyGold} className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart size={18} className="text-yellow-600" />
                  <h3 className="font-bold text-lg">Invest in Gold</h3>
                </div>
                <Input
                  label="Enter Amount (₹)"
                  type="number"
                  min="1"
                  placeholder="Min. ₹1"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  required
                />
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 border border-dashed border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Live Price</span>
                    <span className="font-semibold">₹{livePrice || '---'}/g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Quantity</span>
                    <span className="font-bold text-yellow-600">
                      {buyAmount && livePrice ? (Number(buyAmount) / livePrice).toFixed(4) : "0.0000"} g
                    </span>
                  </div>
                </div>
                <Button type="submit" disabled={loading || !livePrice} className="w-full bg-yellow-500 hover:bg-yellow-600 h-12 text-lg">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : "Complete Purchase"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSellGold} className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={18} className="text-yellow-600" />
                  <h3 className="font-bold text-lg">Sell Your Gold</h3>
                </div>
                <Input
                  label="Quantity to Sell (grams)"
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  max={portfolio.totalGoldQuantity}
                  placeholder={`Max: ${portfolio.totalGoldQuantity.toFixed(4)}g`}
                  value={sellQuantity}
                  onChange={(e) => setSellQuantity(e.target.value)}
                  required
                />
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 border border-dashed border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">You Receive</span>
                    <span className="font-bold text-green-600">
                      ₹{sellQuantity && livePrice ? (Number(sellQuantity) * livePrice).toLocaleString(undefined, {minimumFractionDigits: 2}) : "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Available Balance</span>
                    <span className="text-gray-400">{portfolio.totalGoldQuantity.toFixed(4)} g</span>
                  </div>
                </div>
                <Button type="submit" disabled={loading || !livePrice || portfolio.totalGoldQuantity <= 0} className="w-full bg-yellow-600 hover:bg-yellow-700 h-12 text-lg">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : "Confirm Sale"}
                </Button>
              </form>
            )}
          </div>
        </Card>

        {/* Portfolio Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-lg">
              <p className="text-yellow-100 text-sm font-medium">Total Portfolio Value</p>
              <h2 className="text-3xl font-black mt-1">₹{(portfolio.totalGoldQuantity * (livePrice || 0)).toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
              <div className="mt-4 flex items-center gap-2 text-yellow-100 text-xs">
                <Badge className="bg-white/20 text-white border-0">{portfolio.totalGoldQuantity.toFixed(4)} g owned</Badge>
              </div>
            </Card>
            <Card className="p-6 bg-white border-2 border-yellow-100">
              <p className="text-gray-500 text-sm font-medium">Total Investment</p>
              <h2 className="text-3xl font-black mt-1 text-gray-900">₹{portfolio.totalInvested.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant={ (portfolio.totalGoldQuantity * (livePrice || 0)) >= portfolio.totalInvested ? "success" : "danger" }>
                  { (portfolio.totalGoldQuantity * (livePrice || 0)) >= portfolio.totalInvested ? "+" : "" }
                  { livePrice ? ( ( (portfolio.totalGoldQuantity * livePrice) - portfolio.totalInvested ) / (portfolio.totalInvested || 1) * 100).toFixed(2) : "0.00" }% P&L
                </Badge>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <History size={20} className="text-yellow-600" />
              <h3 className="text-xl font-bold">Transaction History</h3>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {portfolio.transactions.length > 0 ? (
                portfolio.transactions.slice().reverse().map((tx) => {
                  const isSale = tx.goldQuantity < 0;
                  return (
                    <div key={tx._id} className={cn("flex justify-between items-center p-4 rounded-xl border transition-all hover:shadow-md", isSale ? "border-red-100 bg-red-50/30" : "border-green-100 bg-green-50/30")}>
                      <div className="flex items-center gap-4">
                        <div className={cn("p-2 rounded-lg", isSale ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600")}>
                          {isSale ? <Tag size={20} /> : <ShoppingCart size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{isSale ? "Sold" : "Bought"} {Math.abs(tx.goldQuantity).toFixed(4)} g</p>
                          <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn("font-black text-lg", isSale ? "text-red-600" : "text-green-600")}>
                          {isSale ? "+" : "-"} ₹{Math.abs(tx.amountInvested).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">@ ₹{tx.priceAtPurchase}/g</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-2xl">
                  <History size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Your gold vault is empty. Start investing today!</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
