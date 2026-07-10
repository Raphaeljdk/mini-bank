'use client';
import { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';

export default function SimuladorPage() {
  const [valor, setValor] = useState('1000');
  const [meses, setMeses] = useState('12');
  const [resultado, setResultado] = useState<any>(null);

  function simular() {
    const v = parseFloat(valor);
    const m = parseInt(meses);
    const taxaMensal = 0.008; // 0.8% ao mês
    let montante = v;
    const projecoes = [];
    for (let i = 1; i <= m; i++) {
      montante = montante * (1 + taxaMensal);
      projecoes.push({ mes: i, valor: parseFloat(montante.toFixed(2)) });
    }
    setResultado({ projecoes, total: montante.toFixed(2), lucro: (montante - v).toFixed(2) });
  }

  return (
    <div className="animate-fade-in-up max-w-2xl">
      <h1 className="text-3xl font-bold gradient-text mb-6">🧮 Simulador de Investimentos</h1>
      <div className="glass-strong rounded-2xl p-6 space-y-4">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1"><label className="text-text-muted text-xs mb-1 block">Valor Inicial R$</label><input type="number" value={valor} onChange={e => setValor(e.target.value)} className="w-full px-4 py-2.5 bg-bg-secondary border border-border-medium rounded-xl text-white" /></div>
          <div className="flex-1"><label className="text-text-muted text-xs mb-1 block">Meses</label><input type="number" value={meses} onChange={e => setMeses(e.target.value)} className="w-full px-4 py-2.5 bg-bg-secondary border border-border-medium rounded-xl text-white" /></div>
        </div>
        <button onClick={simular} className="w-full py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold rounded-xl">Simular</button>
        {resultado && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-xl p-4 text-center"><p className="text-text-muted text-sm">Valor Final</p><p className="text-2xl font-bold text-accent-green">{formatCurrency(Number(resultado.total))}</p></div>
              <div className="glass rounded-xl p-4 text-center"><p className="text-text-muted text-sm">Lucro</p><p className="text-2xl font-bold text-accent-blue">{formatCurrency(Number(resultado.lucro))}</p></div>
            </div>
            <div className="glass rounded-xl p-4 max-h-48 overflow-y-auto">
              {resultado.projecoes.map((p: any) => (
                <div key={p.mes} className="flex justify-between text-sm py-1 border-b border-border-subtle/30">
                  <span className="text-text-secondary">Mês {p.mes}</span>
                  <span className="text-white font-medium">{formatCurrency(p.valor)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatCurrency(v: number) { return v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'; }
