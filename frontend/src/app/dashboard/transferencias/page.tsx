'use client';
import { useEffect, useState } from 'react';
import { Send, ArrowRight, CheckCircle } from 'lucide-react';

export default function TransferenciasPage() {
  const [user, setUser] = useState<any>(null);
  const [toDocument, setToDocument] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  async function handlePix() {
    if (!toDocument || !amount) { setMessage('❌ Preencha todos os campos!'); return; }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/transfer/pix', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromAccountId: user.accountId, toDocument, amount: parseFloat(amount), description })
      });
      const data = await res.json();
      if (data.error) setMessage('❌ ' + data.error);
      else setMessage(`✅ PIX de ${formatCurrency(parseFloat(amount))} enviado para ${data.to}!`);
      setToDocument(''); setAmount(''); setDescription('');
    } catch (e) { setMessage('❌ Erro ao realizar PIX'); }
    setLoading(false);
    setTimeout(() => setMessage(''), 4000);
  }

  function formatCurrency(v: number) { return v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'; }

  return (
    <div className="animate-fade-in-up max-w-lg">
      <h1 className="text-3xl font-bold gradient-text mb-6">💸 Transferência PIX</h1>
      {message && <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${message.includes('✅') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>{message}</div>}
      <div className="glass-strong rounded-2xl p-6 space-y-4">
        <div><label className="text-text-muted text-xs mb-1 block">CPF do Destinatário</label><input value={toDocument} onChange={e => setToDocument(e.target.value)} placeholder="000.000.000-00" className="w-full px-4 py-3 bg-bg-secondary border border-border-medium rounded-xl text-white text-lg" /></div>
        <div><label className="text-text-muted text-xs mb-1 block">Valor R$</label><input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0,00" className="w-full px-4 py-3 bg-bg-secondary border border-border-medium rounded-xl text-white text-lg" /></div>
        <div><label className="text-text-muted text-xs mb-1 block">Descrição (opcional)</label><input value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Pagamento aluguel" className="w-full px-4 py-3 bg-bg-secondary border border-border-medium rounded-xl text-white" /></div>
        <button onClick={handlePix} disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold text-lg rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
          <Send size={20} /> {loading ? 'Enviando...' : 'Enviar PIX'}
        </button>
      </div>
    </div>
  );
}
