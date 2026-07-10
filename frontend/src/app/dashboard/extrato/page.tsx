'use client';
import { useEffect, useState } from 'react';
import { Search, ArrowUpCircle, ArrowDownCircle, Download, Calendar, Clock, Hash, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ExtratoPage() {
  const [user, setUser] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('TODOS');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) { const u = JSON.parse(stored); setUser(u); fetchTransactions(u); }
  }, []);

  useEffect(() => {
    let filtered = entries;
    if (searchTerm) filtered = filtered.filter((e: any) => e.description?.toLowerCase().includes(searchTerm.toLowerCase()) || e.category?.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterType !== 'TODOS') filtered = filtered.filter((e: any) => e.type === filterType);
    if (startDate) filtered = filtered.filter((e: any) => new Date(e.date) >= new Date(startDate));
    if (endDate) filtered = filtered.filter((e: any) => new Date(e.date) <= new Date(endDate + 'T23:59:59'));
    setFilteredEntries(filtered);
  }, [searchTerm, filterType, startDate, endDate, entries]);

  async function fetchTransactions(u: any) {
    try {
      // Buscar transações REAIS do controlador financeiro
      const res = await fetch(`http://localhost:8080/api/finance/transactions/${u.accountId}`);
      if (res.ok) {
        const data = await res.json();
        // Mapear para o formato do extrato
        const mapped = data.map((tx: any) => ({
          eventId: `TX-${tx.id}`,
          type: tx.type === 'RECEITA' ? 'CREDIT' : 'DEBIT',
          amount: tx.amount,
          description: tx.description,
          category: tx.category,
          timestamp: tx.date,
          status: tx.status,
          dueDate: tx.dueDate
        }));
        setEntries(mapped);
        setFilteredEntries(mapped);
      }
    } catch (e) {
      console.log('Erro ao carregar transações');
    }
    setLoading(false);
  }

  const totalCredit = filteredEntries.filter((e: any) => e.type === 'CREDIT').reduce((s: number, e: any) => s + e.amount, 0);
  const totalDebit = filteredEntries.filter((e: any) => e.type === 'DEBIT').reduce((s: number, e: any) => s + e.amount, 0);
  const saldo = totalCredit - totalDebit;

  function exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text('Extrato Financeiro - MiniBank', 14, 22);
    doc.setFontSize(10); doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);
    doc.text(`Usuário: ${user?.fullName || 'N/A'}`, 14, 36);
    autoTable(doc, {
      head: [['ID', 'Tipo', 'Categoria', 'Descrição', 'Valor', 'Data', 'Status']],
      body: filteredEntries.map((e: any) => [e.eventId, e.type === 'CREDIT' ? 'RECEITA' : 'DESPESA', e.category, e.description, formatCurrency(e.amount), formatDate(e.timestamp), e.status]),
      startY: 42, styles: { fontSize: 7 }, headStyles: { fillColor: [30, 30, 60] }
    });
    doc.save(`extrato-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  function formatCurrency(v: number) { return v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'; }
  function formatDate(d: string) { return d ? new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''; }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="h-10 w-48 shimmer rounded-xl" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (<div key={i} className="h-28 shimmer rounded-2xl" />))}
        </div>
        {[...Array(5)].map((_, i) => (<div key={i} className="h-14 shimmer rounded-xl" />))}
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* HEADER */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-3xl blur-3xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text animate-text-glow">Extrato Financeiro</h1>
            <p className="text-text-secondary mt-1">Suas receitas e despesas reais</p>
          </div>
          <button onClick={exportPDF} className="btn-premium flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold rounded-xl hover:shadow-xl transition-all animate-glow-pulse">
            <Download size={18} /> Exportar PDF
          </button>
        </div>
      </div>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Receitas', value: formatCurrency(totalCredit), icon: ArrowUpCircle, color: 'text-emerald-400', border: 'border-emerald-500/20', delay: '' },
          { label: 'Despesas', value: formatCurrency(totalDebit), icon: ArrowDownCircle, color: 'text-red-400', border: 'border-red-500/20', delay: 'delay-100' },
          { label: 'Saldo', value: formatCurrency(saldo), icon: Calendar, color: saldo >= 0 ? 'text-accent-blue' : 'text-red-400', border: saldo >= 0 ? 'border-blue-500/20' : 'border-red-500/20', delay: 'delay-200' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`glass-strong rounded-2xl p-5 border ${card.border} card-3d animate-card-entrance ${card.delay}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-bg-secondary/50"><Icon size={22} className={card.color} /></div>
                <span className="text-text-secondary text-sm font-medium">{card.label}</span>
              </div>
              <p className={`text-3xl font-extrabold ${card.color} animate-number`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* FILTROS */}
      <div className="glass-strong rounded-2xl overflow-hidden mb-6 animate-fade-in-up delay-200">
        <div className="p-4 border-b border-border-subtle flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {['TODOS', 'CREDIT', 'DEBIT'].map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${filterType === t ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg scale-105' : 'glass text-text-secondary hover:text-white hover:scale-105'}`}>
                {t === 'TODOS' ? 'Todos' : t === 'CREDIT' ? 'Receitas' : 'Despesas'}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-text-muted" />
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-3 py-2 bg-bg-secondary border border-border-medium rounded-xl text-white text-sm" />
            </div>
            <span className="text-text-muted">até</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-3 py-2 bg-bg-secondary border border-border-medium rounded-xl text-white text-sm" />
            <div className="relative w-48">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary border border-border-medium rounded-xl text-white text-sm focus:ring-2 focus:ring-accent-blue/30 transition-all" />
            </div>
          </div>
        </div>

        {/* TABELA */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-secondary/30">
                <th className="text-left py-4 px-5 text-text-muted text-xs font-semibold uppercase tracking-wider"><Hash size={14} className="inline mr-1" />ID</th>
                <th className="text-left py-4 px-5 text-text-muted text-xs font-semibold uppercase tracking-wider">Tipo</th>
                <th className="text-left py-4 px-5 text-text-muted text-xs font-semibold uppercase tracking-wider">Categoria</th>
                <th className="text-left py-4 px-5 text-text-muted text-xs font-semibold uppercase tracking-wider"><FileText size={14} className="inline mr-1" />Descrição</th>
                <th className="text-right py-4 px-5 text-text-muted text-xs font-semibold uppercase tracking-wider">Valor</th>
                <th className="text-left py-4 px-5 text-text-muted text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-5 text-text-muted text-xs font-semibold uppercase tracking-wider"><Clock size={14} className="inline mr-1" />Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-text-muted">
                  <FileText size={48} className="mx-auto mb-3 opacity-30" />
                  <p className="text-lg">Nenhuma transação encontrada</p>
                  <p className="text-sm">Adicione receitas e despesas em Finanças</p>
                </td></tr>
              ) : (
                filteredEntries.map((e: any, i: number) => (
                  <tr key={i} className="border-b border-border-subtle/20 hover:bg-accent-blue/5 transition-all duration-200">
                    <td className="py-4 px-5">
                      <span className="text-xs font-mono text-text-muted bg-bg-secondary px-2.5 py-1.5 rounded-lg border border-border-subtle">{e.eventId}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide ${e.type === 'CREDIT' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'}`}>
                        {e.type === 'CREDIT' ? 'RECEITA' : 'DESPESA'}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-text-secondary text-sm">{e.category}</td>
                    <td className="py-4 px-5 text-white font-medium">{e.description}</td>
                    <td className={`py-4 px-5 text-right font-bold font-mono text-lg ${e.type === 'CREDIT' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {e.type === 'CREDIT' ? '+' : '-'}{formatCurrency(e.amount)}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        e.status === 'PAGO' || e.status === 'RECEBIDO' ? 'bg-emerald-500/15 text-emerald-400' :
                        e.status === 'PENDENTE' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-red-500/15 text-red-400'
                      }`}>{e.status}</span>
                    </td>
                    <td className="py-4 px-5 text-text-secondary text-sm">{formatDate(e.timestamp)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border-subtle flex justify-between items-center text-text-muted text-sm bg-bg-secondary/20">
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />{filteredEntries.length} transação(ões)</span>
          <span className="text-xs opacity-60">📊 Dados reais do seu controlador financeiro</span>
        </div>
      </div>
    </div>
  );
}
