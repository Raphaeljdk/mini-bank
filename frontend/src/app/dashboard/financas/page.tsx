'use client';
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Plus, Trash2, PieChart, CheckCircle, Clock, Calendar } from 'lucide-react';
import { PieChart as RePie, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CATEGORIAS = ['Salario', 'Freelance', 'Investimento', 'Aluguel', 'Alimentacao', 'Transporte', 'Lazer', 'Contas', 'Saude', 'Educacao', 'Outros'];
const STATUS_OPTIONS = ['PENDENTE', 'PAGO', 'RECEBIDO', 'ATRASADO'];

export default function FinancasPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({ totalReceitas: 0, totalDespesas: 0, saldo: 0, categories: [] });
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState('DESPESA');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Aluguel');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('PENDENTE');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('TODOS');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      fetchData(u.accountId);
    }
  }, []);

  async function fetchData(accountId: number) {
    try {
      const [txRes, sumRes] = await Promise.all([
        fetch(`http://localhost:8080/api/finance/transactions/${accountId}`),
        fetch(`http://localhost:8080/api/finance/summary/${accountId}`)
      ]);
      if (txRes.ok) setTransactions(await txRes.json());
      if (sumRes.ok) setSummary(await sumRes.json());
    } catch (e) {}
  }

  async function handleAddTransaction() {
    if (!amount || !description) {
      setMessage('❌ Preencha valor e descrição!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        accountId: Number(user.accountId), type, amount: Number(parseFloat(amount).toFixed(2)),
        category, description, status
      };
      if (dueDate) payload.dueDate = dueDate;

      const res = await fetch('http://localhost:8080/api/finance/transaction', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMessage('✅ Transação adicionada!');
        setAmount(''); setDescription(''); setDueDate('');
        setShowForm(false);
        fetchData(user.accountId);
      }
    } catch (e) {}
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleUpdateStatus(id: number, newStatus: string) {
    await fetch(`http://localhost:8080/api/finance/transaction/${id}/status`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus })
    });
    fetchData(user.accountId);
  }

  async function handleDelete(id: number) {
    await fetch(`http://localhost:8080/api/finance/transaction/${id}`, { method: 'DELETE' });
    fetchData(user.accountId);
  }

  function formatCurrency(v: number) { return v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'; }
  function formatDate(d: string) { return d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : ''; }

  const statusColors: Record<string, string> = {
    PENDENTE: 'bg-amber-500/20 text-amber-400', PAGO: 'bg-emerald-500/20 text-emerald-400',
    RECEBIDO: 'bg-blue-500/20 text-blue-400', ATRASADO: 'bg-red-500/20 text-red-400'
  };

  const filtered = filter === 'TODOS' ? transactions : transactions.filter((t: any) => t.status === filter);
  const pieData = summary?.categories || [];
  const pieColors = ['#4da8ff', '#a855f7', '#22d3ee', '#34d399', '#fbbf24', '#f87171', '#fb923c', '#a78bfa', '#60a5fa', '#f472b6'];

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">💰 Controlador Financeiro</h1>
          <p className="text-text-secondary text-sm mt-1">Organize suas contas a pagar e receber</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold rounded-xl hover:shadow-lg transition-all">
          <Plus size={20} /> {showForm ? 'Fechar' : 'Nova Conta'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${message.includes('✅') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>{message}</div>
      )}

      {/* Cards Resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { title: 'A Receber', value: formatCurrency(summary.totalReceitas), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { title: 'A Pagar', value: formatCurrency(summary.totalDespesas), icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/10' },
          { title: 'Saldo Previsto', value: formatCurrency(summary.saldo), icon: Wallet, color: 'text-accent-blue', bg: 'bg-blue-500/10' },
          { title: 'Total Lançamentos', value: transactions.length, icon: PieChart, color: 'text-accent-purple', bg: 'bg-purple-500/10' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="glass-strong rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2"><Icon size={20} className={card.color} /><span className="text-text-secondary text-xs">{card.title}</span></div>
              <p className="text-xl font-bold text-white">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="glass-strong rounded-2xl p-6 mb-6 animate-scale-in">
          <h3 className="text-lg font-bold text-white mb-4">Novo Lançamento</h3>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-text-muted text-xs mb-1 block">Tipo</label>
              <select value={type} onChange={e => setType(e.target.value)} className="px-4 py-2.5 bg-bg-secondary border border-border-medium rounded-xl text-white">
                <option value="DESPESA">📝 A Pagar</option>
                <option value="RECEITA">💰 A Receber</option>
              </select>
            </div>
            <div>
              <label className="text-text-muted text-xs mb-1 block">Valor R$</label>
              <input type="number" step="0.01" placeholder="0,00" value={amount} onChange={e => setAmount(e.target.value)}
                className="px-4 py-2.5 bg-bg-secondary border border-border-medium rounded-xl text-white w-36" />
            </div>
            <div>
              <label className="text-text-muted text-xs mb-1 block">Categoria</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-2.5 bg-bg-secondary border border-border-medium rounded-xl text-white">
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-text-muted text-xs mb-1 block">Vencimento</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="px-4 py-2.5 bg-bg-secondary border border-border-medium rounded-xl text-white" />
            </div>
            <div>
              <label className="text-text-muted text-xs mb-1 block">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="px-4 py-2.5 bg-bg-secondary border border-border-medium rounded-xl text-white">
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-text-muted text-xs mb-1 block">Descrição</label>
              <input type="text" placeholder="Ex: Aluguel apartamento" value={description} onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-bg-secondary border border-border-medium rounded-xl text-white" />
            </div>
            <button onClick={handleAddTransaction} disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      )}

      {/* Filtros de Status */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['TODOS', 'PENDENTE', 'PAGO', 'RECEBIDO', 'ATRASADO'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === s ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white' : 'glass text-text-secondary hover:text-white'}`}>
            {s === 'TODOS' ? 'Todos' : s}
          </button>
        ))}
      </div>

      {/* Gráfico + Lista */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-strong rounded-2xl p-5">
          <h3 className="text-base font-semibold text-white mb-3">📊 Despesas por Categoria</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <RePie>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={4} dataKey="amount" nameKey="category">
                  {pieData.map((_: any, index: number) => (<Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a3e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} formatter={(value: number) => formatCurrency(value)} />
                <Legend wrapperStyle={{ color: '#c0c0e0', fontSize: '11px' }} />
              </RePie>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-text-muted">Adicione contas para ver o gráfico</div>
          )}
        </div>

        <div className="glass-strong rounded-2xl p-5">
          <h3 className="text-base font-semibold text-white mb-3">📋 Lançamentos</h3>
          <div className="space-y-2 max-h-[350px] overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-text-muted text-center py-8">Nenhum lançamento</p>
            ) : (
              filtered.slice(0, 15).map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between bg-bg-secondary/50 rounded-xl p-3 hover:bg-bg-tertiary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tx.type === 'RECEITA' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                      {tx.type === 'RECEITA' ? <TrendingUp size={16} className="text-emerald-400" /> : <TrendingDown size={16} className="text-red-400" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-medium">{tx.description}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-lg ${statusColors[tx.status]}`}>{tx.status}</span>
                      </div>
                      <p className="text-text-muted text-xs">{tx.category}{tx.dueDate ? ` • Vence: ${formatDate(tx.dueDate)}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${tx.type === 'RECEITA' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.type === 'RECEITA' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                    {tx.status === 'PENDENTE' && (
                      <button onClick={() => handleUpdateStatus(tx.id, tx.type === 'RECEITA' ? 'RECEBIDO' : 'PAGO')}
                        className="text-text-muted hover:text-emerald-400 transition-colors" title="Marcar como pago/recebido">
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(tx.id)} className="text-text-muted hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
