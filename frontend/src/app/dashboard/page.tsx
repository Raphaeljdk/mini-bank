'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, ShieldCheck, Activity, Wallet, TrendingUp, TrendingDown, PieChart, AlertTriangle } from 'lucide-react';
import { PieChart as RePie, Pie, Cell, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [financeSummary, setFinanceSummary] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [evolution, setEvolution] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      fetchFinanceSummary(u.accountId);
      fetchTransactions(u.accountId);
      if (u.role === 'ADMIN' || u.role === 'GERENTE') fetchDashboard();
    }
    setLoading(false);
  }, []);

  async function fetchFinanceSummary(accountId: number) {
    try {
      const res = await fetch(`http://localhost:8080/api/finance/summary/${accountId}`);
      if (res.ok) setFinanceSummary(await res.json());
    } catch (e) {}
  }

  async function fetchTransactions(accountId: number) {
    try {
      const res = await fetch(`http://localhost:8080/api/finance/transactions/${accountId}`);
      if (res.ok) {
        const txs = await res.json();
        setTransactions(txs);
        const monthly: any = {};
        txs.forEach((tx: any) => {
          const month = new Date(tx.date).toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
          if (!monthly[month]) monthly[month] = { receitas: 0, despesas: 0 };
          if (tx.type === 'RECEITA') monthly[month].receitas += tx.amount;
          else monthly[month].despesas += tx.amount;
        });
        setEvolution(Object.entries(monthly).map(([month, data]: any) => ({
          month, receitas: data.receitas, despesas: data.despesas, saldo: data.receitas - data.despesas
        })).slice(-6));
      }
    } catch (e) {}
  }

  async function fetchDashboard() {
    try { const res = await fetch('http://localhost:8080/api/accounts/dashboard'); if (res.ok) setDashboardData(await res.json()); } catch (e) {}
  }

  const role = user?.role || 'CLIENTE';
  const isAdmin = role === 'ADMIN';
  const isGerente = role === 'GERENTE' || isAdmin;
  const isCliente = role === 'CLIENTE';

  function formatCurrency(v: number) { return v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'; }
  if (loading) return <div className="text-white text-center py-20">Carregando...</div>;

  // ALERTAS DE VENCIMENTO
  const hoje = new Date();
  const contasVencendo = transactions.filter((tx: any) => {
    if (!tx.dueDate || tx.status !== 'PENDENTE') return false;
    const dias = Math.ceil((new Date(tx.dueDate + 'T00:00:00').getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return dias <= 3 && dias >= 0;
  }).slice(0, 5);

  const pieData = financeSummary?.categories || [];
  const pieColors = ['#4da8ff', '#a855f7', '#22d3ee', '#34d399', '#fbbf24', '#f87171', '#fb923c', '#a78bfa'];

  return (
    <div className="animate-fade-in-up">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl blur-3xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div><h1 className="text-3xl font-bold gradient-text">{isCliente ? `Olá, ${user?.fullName || 'Cliente'}` : 'Dashboard'}</h1><p className="text-text-secondary mt-1 text-sm">{isCliente ? 'Seu controle financeiro' : 'Visão gerencial'}</p></div>
          <Badge className={`px-4 py-2 rounded-xl text-xs font-medium ${isAdmin ? 'bg-red-500/20 text-red-400' : isGerente ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>{isAdmin ? '🔑 Admin' : isGerente ? '👔 Gerente' : '👤 Cliente'}</Badge>
        </div>
      </div>

      {/* ALERTAS DE VENCIMENTO */}
      {contasVencendo.length > 0 && (
        <div className="glass-strong rounded-2xl p-5 mb-6 border border-amber-500/30 animate-scale-in">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={20} className="text-amber-400" />
            <h3 className="text-base font-semibold text-amber-400">⚠️ Contas a Vencer (Próximos 3 dias)</h3>
          </div>
          <div className="space-y-2">
            {contasVencendo.map((tx: any) => {
              const diasRestantes = Math.ceil((new Date(tx.dueDate + 'T00:00:00').getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={tx.id} className="flex items-center justify-between bg-bg-secondary/50 rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <AlertTriangle size={16} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{tx.description}</p>
                      <p className="text-text-muted text-xs">{tx.category} • Vence em {diasRestantes} dia(s)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-bold">{formatCurrency(tx.amount)}</p>
                    <p className="text-text-muted text-xs">{new Date(tx.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cards - Admin/Gerente */}
      {isGerente && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[{ title: 'Total Contas', value: dashboardData?.totalAccounts || 10, icon: Users, color: 'text-accent-blue', bg: 'bg-blue-500/10' },{ title: 'Transações', value: dashboardData?.totalTransactions || 0, icon: DollarSign, color: 'text-accent-purple', bg: 'bg-purple-500/10' },{ title: 'Conciliação', value: 'OK', icon: ShieldCheck, color: 'text-accent-green', bg: 'bg-emerald-500/10' },{ title: 'Status', value: 'Online', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' }].map((card, i) => { const Icon = card.icon; return (<Card key={i} className="glass card-3d"><CardHeader className="flex flex-row items-center justify-between pb-1"><CardTitle className="text-xs font-medium text-text-secondary">{card.title}</CardTitle><div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center`}><Icon size={18} className={card.color} /></div></CardHeader><CardContent><p className="text-xl font-bold text-white">{card.value}</p></CardContent></Card>); })}
        </div>
      )}

      {/* Cards - Cliente */}
      {isCliente && financeSummary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[{ title: 'Receitas', value: formatCurrency(financeSummary.totalReceitas), icon: TrendingUp, color: 'text-accent-green', bg: 'bg-emerald-500/10' },{ title: 'Despesas', value: formatCurrency(financeSummary.totalDespesas), icon: TrendingDown, color: 'text-accent-red', bg: 'bg-red-500/10' },{ title: 'Saldo', value: formatCurrency(financeSummary.saldo), icon: Wallet, color: 'text-accent-blue', bg: 'bg-blue-500/10' },{ title: 'Economia', value: financeSummary.totalReceitas > 0 ? ((financeSummary.saldo / financeSummary.totalReceitas) * 100).toFixed(1) + '%' : '0%', icon: PieChart, color: 'text-accent-purple', bg: 'bg-purple-500/10' }].map((card, i) => { const Icon = card.icon; return (<Card key={i} className="glass card-3d"><CardHeader className="flex flex-row items-center justify-between pb-1"><CardTitle className="text-xs font-medium text-text-secondary">{card.title}</CardTitle><div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center`}><Icon size={18} className={card.color} /></div></CardHeader><CardContent><p className="text-xl font-bold text-white">{card.value}</p></CardContent></Card>); })}
        </div>
      )}

      {/* Gráfico de Evolução */}
      {evolution.length > 0 && (
        <div className="glass-strong rounded-2xl p-5 mb-6">
          <h3 className="text-base font-semibold text-white mb-3">📈 Evolução do Saldo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={evolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#8080b0" fontSize={11} />
              <YAxis stroke="#8080b0" fontSize={11} tickFormatter={(v) => `${(v/1000)}k`} />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a3e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} formatter={(v: number) => formatCurrency(v)} />
              <Area type="monotone" dataKey="saldo" stroke="#22d3ee" fill="url(#areaGradient)" strokeWidth={3} />
              <defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} /><stop offset="100%" stopColor="#22d3ee" stopOpacity={0} /></linearGradient></defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de Despesas */}
      {isCliente && pieData.length > 0 && (
        <div className="glass-strong rounded-2xl p-5">
          <h3 className="text-base font-semibold text-white mb-3">📊 Despesas por Categoria</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RePie><Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={4} dataKey="amount" nameKey="category">{pieData.map((_: any, i: number) => (<Cell key={`cell-${i}`} fill={pieColors[i % pieColors.length]} />))}</Pie><Tooltip contentStyle={{ backgroundColor: '#1a1a3e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} formatter={(v: number) => formatCurrency(v)} /><Legend wrapperStyle={{ color: '#c0c0e0', fontSize: '11px' }} /></RePie>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
