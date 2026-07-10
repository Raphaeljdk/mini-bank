'use client';
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function RelatoriosPage() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      fetch(`http://localhost:8080/api/finance/transactions/${u.accountId}`)
        .then(r => r.json()).then(txs => {
          const meses: any = {};
          const nomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
          txs.forEach((tx: any) => {
            const mes = new Date(tx.date).getMonth();
            if (!meses[mes]) meses[mes] = { mes: nomes[mes], receitas: 0, despesas: 0 };
            if (tx.type === 'RECEITA') meses[mes].receitas += tx.amount;
            else meses[mes].despesas += tx.amount;
          });
          setData(Object.values(meses));
        });
    }
  }, []);

  function formatCurrency(v: number) { return v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'; }

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-bold gradient-text mb-6">📊 Relatórios</h1>
      <div className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Comparativo Receitas vs Despesas (Anual)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="mes" stroke="#8080b0" fontSize={12} />
            <YAxis stroke="#8080b0" fontSize={12} tickFormatter={(v) => `${(v/1000)}k`} />
            <Tooltip contentStyle={{ backgroundColor: '#1a1a3e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} formatter={(v: number) => formatCurrency(v)} />
            <Legend wrapperStyle={{ color: '#c0c0e0' }} />
            <Bar dataKey="receitas" name="Receitas" fill="#34d399" radius={[8, 8, 0, 0]} />
            <Bar dataKey="despesas" name="Despesas" fill="#f87171" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
