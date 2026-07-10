'use client';
import { useEffect, useState } from 'react';
import { Target, TrendingUp } from 'lucide-react';

export default function MetasPage() {
  const [user, setUser] = useState<any>(null);
  const [meta, setMeta] = useState(0);
  const [atual, setAtual] = useState(0);
  const [inputMeta, setInputMeta] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      const saved = localStorage.getItem('meta_' + u.accountId);
      if (saved) setMeta(Number(saved));
      fetch(`http://localhost:8080/api/finance/summary/${u.accountId}`).then(r => r.json()).then(d => setAtual(d.saldo || 0));
    }
  }, []);

  function salvarMeta() {
    const valor = Number(inputMeta);
    setMeta(valor);
    localStorage.setItem('meta_' + user?.accountId, String(valor));
    setInputMeta('');
  }

  const progress = meta > 0 ? Math.min((atual / meta) * 100, 100) : 0;

  return (
    <div className="animate-fade-in-up max-w-2xl">
      <h1 className="text-3xl font-bold gradient-text mb-6">Metas Financeiras</h1>
      <div className="glass-strong rounded-2xl p-8 text-center">
        <Target size={48} className="text-accent-blue mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{meta > 0 ? `Meta: ${formatCurrency(meta)}` : 'Defina sua meta'}</h2>
        <p className="text-text-secondary mb-6">Atual: {formatCurrency(atual)}</p>
        {meta > 0 && (
          <div className="mb-6">
            <div className="w-full bg-bg-secondary rounded-full h-6 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-text-muted text-sm mt-2">{progress.toFixed(1)}% concluído</p>
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <input type="number" value={inputMeta} onChange={e => setInputMeta(e.target.value)} placeholder="R$ 10.000,00" className="px-4 py-2.5 bg-bg-secondary border border-border-medium rounded-xl text-white w-48" />
          <button onClick={salvarMeta} className="px-6 py-2.5 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold rounded-xl">Definir Meta</button>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(v: number) { return v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'; }
