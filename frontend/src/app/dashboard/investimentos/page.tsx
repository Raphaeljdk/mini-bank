'use client';
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Bitcoin, Briefcase, Wallet, AlertTriangle } from 'lucide-react';

const cryptosData = [
  { symbol: 'BTC', name: 'Bitcoin', price: 285000.00, change24h: 2.35 },
  { symbol: 'ETH', name: 'Ethereum', price: 15800.00, change24h: -1.20 },
  { symbol: 'BNB', name: 'Binance Coin', price: 2100.00, change24h: 0.85 },
  { symbol: 'SOL', name: 'Solana', price: 680.00, change24h: 5.40 },
  { symbol: 'ADA', name: 'Cardano', price: 3.20, change24h: -0.50 },
  { symbol: 'XRP', name: 'Ripple', price: 4.80, change24h: 1.75 },
];

const stocksData = [
  { symbol: 'PETR4', name: 'Petrobras PN', price: 42.50, change24h: 1.20, sector: 'Petroleo' },
  { symbol: 'VALE3', name: 'Vale', price: 68.30, change24h: -0.80, sector: 'Mineracao' },
  { symbol: 'ITUB4', name: 'Itau Unibanco', price: 35.20, change24h: 0.45, sector: 'Financeiro' },
  { symbol: 'ABEV3', name: 'Ambev', price: 15.80, change24h: -0.25, sector: 'Bebidas' },
  { symbol: 'WEGE3', name: 'WEG', price: 52.40, change24h: 2.10, sector: 'Industria' },
  { symbol: 'RENT3', name: 'Localiza', price: 72.60, change24h: 1.80, sector: 'Aluguel' },
];

export default function InvestimentosPage() {
  const [user, setUser] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState<'crypto' | 'stocks' | 'portfolio'>('portfolio');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [buyAsset, setBuyAsset] = useState<any>(null);
  const [buyQuantity, setBuyQuantity] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      fetchBalance(u);
      fetchPortfolio(u.username);
    }
  }, []);

  async function fetchBalance(u: any) {
    try {
      const res = await fetch(`http://localhost:8080/api/finance/summary/${u.accountId}`);
      if (res.ok) { const data = await res.json(); setBalance(data.saldo || 0); }
    } catch (e) {}
  }

  async function fetchPortfolio(username: string) {
    try {
      const res = await fetch(`http://localhost:8080/api/investments/portfolio/${username}`);
      if (res.ok) setPortfolio(await res.json());
    } catch (e) {}
  }

  function formatCurrency(v: number) { return v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'; }

  function showMessage(msg: string, type: 'success' | 'error') {
    setMessage(msg); setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  }

  async function handleBuy() {
    if (!buyAsset || !buyQuantity || parseFloat(buyQuantity) <= 0) {
      showMessage('❌ Selecione um ativo e uma quantidade válida!', 'error');
      return;
    }

    const qty = parseFloat(buyQuantity);
    const totalCost = buyAsset.price * qty;

    if (balance < totalCost) {
      showMessage(`❌ Saldo insuficiente! Tem ${formatCurrency(balance)}. Custo: ${formatCurrency(totalCost)}`, 'error');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/investments/buy', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username, accountId: user.accountId,
          type: activeTab === 'crypto' ? 'CRYPTO' : 'STOCK',
          symbol: buyAsset.symbol, quantity: qty
        })
      });
      const data = await res.json();
      if (data.error) {
        showMessage('❌ ' + data.error, 'error');
      } else {
        showMessage(`✅ ${data.message}`, 'success');
        setBuyAsset(null); setBuyQuantity('');
        fetchBalance(user);
        fetchPortfolio(user.username);
      }
    } catch (e) {
      showMessage('❌ Erro ao comprar', 'error');
    }
  }

  const totalInvested = portfolio.reduce((s, a) => s + (a.purchasePrice * a.quantity), 0);
  const totalCurrent = portfolio.reduce((s, a) => s + (a.currentPrice * a.quantity), 0);
  const totalProfit = totalCurrent - totalInvested;
  const profitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  const tabs = [
    { id: 'portfolio' as const, label: 'Minha Carteira', icon: Wallet },
    { id: 'crypto' as const, label: 'Criptomoedas', icon: Bitcoin },
    { id: 'stocks' as const, label: 'Ações', icon: Briefcase },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl blur-3xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Investimentos</h1>
            <p className="text-text-secondary mt-2 text-lg">Criptomoedas e Ações</p>
          </div>
          <div className="glass-strong rounded-2xl px-4 py-3">
            <p className="text-text-muted text-xs">Saldo Disponível</p>
            <p className="text-xl font-bold text-white">{formatCurrency(balance)}</p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${messageType === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {messageType === 'error' && <AlertTriangle size={16} />}{message}
        </div>
      )}

      {/* Modal de Compra */}
      {buyAsset && (
        <div className="glass-strong rounded-2xl p-6 mb-6 animate-scale-in border border-accent-blue/30">
          <h3 className="text-lg font-bold text-white mb-4">Comprar {buyAsset.symbol}</h3>
          <p className="text-text-secondary mb-2">{buyAsset.name} — Preço unitário: {formatCurrency(buyAsset.price)}</p>
          <div className="flex gap-3 items-end flex-wrap">
            <div>
              <label className="text-text-muted text-xs mb-1 block">Quantidade</label>
              <input type="number" step="0.0001" min="0.0001" value={buyQuantity} onChange={e => setBuyQuantity(e.target.value)}
                placeholder="0.1" className="px-4 py-2.5 bg-bg-secondary border border-border-medium rounded-xl text-white w-40" />
            </div>
            <div className="glass-strong rounded-xl px-4 py-2.5">
              <span className="text-text-muted text-xs">Total: </span>
              <span className="text-white font-bold">{formatCurrency(buyAsset.price * (parseFloat(buyQuantity) || 0))}</span>
            </div>
            <button onClick={handleBuy} className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-xl">Confirmar Compra</button>
            <button onClick={() => { setBuyAsset(null); setBuyQuantity(''); }} className="px-4 py-2.5 glass text-text-secondary rounded-xl">Cancelar</button>
          </div>
        </div>
      )}

      {/* Carteira */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6 animate-scale-in">
          {portfolio.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-strong rounded-2xl p-5"><p className="text-text-muted text-sm">Total Investido</p><p className="text-2xl font-bold text-white">{formatCurrency(totalInvested)}</p></div>
              <div className="glass-strong rounded-2xl p-5"><p className="text-text-muted text-sm">Valor Atual</p><p className="text-2xl font-bold text-white">{formatCurrency(totalCurrent)}</p></div>
              <div className="glass-strong rounded-2xl p-5"><p className="text-text-muted text-sm">Lucro</p><p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>{formatCurrency(totalProfit)}</p></div>
              <div className="glass-strong rounded-2xl p-5"><p className="text-text-muted text-sm">Rentabilidade</p><p className={`text-2xl font-bold ${profitPercent >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>{profitPercent.toFixed(2)}%</p></div>
            </div>
          )}

          <div className="glass-strong rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Seus Ativos</h3>
            {portfolio.length === 0 ? (
              <div className="text-center py-10"><Wallet size={48} className="text-text-muted mx-auto mb-4" /><p className="text-text-secondary">Nenhum investimento ainda</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-border-subtle"><th className="text-left py-3 text-text-muted">Ativo</th><th className="text-left py-3 text-text-muted">Tipo</th><th className="text-right py-3 text-text-muted">Qtd</th><th className="text-right py-3 text-text-muted">Preço Médio</th><th className="text-right py-3 text-text-muted">Atual</th><th className="text-right py-3 text-text-muted">Lucro</th></tr></thead>
                  <tbody>
                    {portfolio.map((a, i) => {
                      const profit = (a.currentPrice - a.purchasePrice) * a.quantity;
                      return (
                        <tr key={i} className="border-b border-border-subtle/30 hover:bg-white/5">
                          <td className="py-4"><p className="text-white font-medium">{a.assetName}</p></td>
                          <td className="py-4"><span className={`px-2 py-1 rounded-lg text-xs font-medium ${a.assetType === 'CRYPTO' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>{a.assetType}</span></td>
                          <td className="py-4 text-right text-white">{Number(a.quantity).toFixed(4)}</td>
                          <td className="py-4 text-right text-white">{formatCurrency(a.purchasePrice)}</td>
                          <td className="py-4 text-right text-white">{formatCurrency(a.currentPrice)}</td>
                          <td className="py-4 text-right font-medium text-accent-green">{formatCurrency(profit)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Criptomoedas */}
      {activeTab === 'crypto' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-scale-in">
          {cryptosData.map((c, i) => (
            <div key={i} className="glass card-3d rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3"><div><p className="text-white font-bold text-lg">{c.symbol}</p><p className="text-text-muted text-sm">{c.name}</p></div><Bitcoin size={28} className="text-amber-400" /></div>
              <p className="text-2xl font-bold text-white">{formatCurrency(c.price)}</p>
              <div className={`flex items-center gap-1 mt-2 ${c.change24h >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>{c.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}<span className="font-medium">{c.change24h}% 24h</span></div>
              <button onClick={() => { setBuyAsset(c); setBuyQuantity('0.1'); }}
                className="w-full mt-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl text-sm hover:shadow-lg transition-all">Comprar</button>
            </div>
          ))}
        </div>
      )}

      {/* Ações */}
      {activeTab === 'stocks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-scale-in">
          {stocksData.map((s, i) => (
            <div key={i} className="glass card-3d rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3"><div><p className="text-white font-bold text-lg">{s.symbol}</p><p className="text-text-muted text-sm">{s.name}</p></div><span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs">{s.sector}</span></div>
              <p className="text-2xl font-bold text-white">{formatCurrency(s.price)}</p>
              <div className={`flex items-center gap-1 mt-2 ${s.change24h >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>{s.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}<span className="font-medium">{s.change24h}% 24h</span></div>
              <button onClick={() => { setBuyAsset(s); setBuyQuantity('1'); }}
                className="w-full mt-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl text-sm hover:shadow-lg transition-all">Comprar</button>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mt-8 flex-wrap">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg' : 'glass text-text-secondary hover:text-white'}`}>
              <Icon size={18} />{tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
