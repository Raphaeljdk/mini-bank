'use client';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, MoreHorizontal } from 'lucide-react';

interface Account {
  id: string; owner: string; document: string; balance: number;
  status: 'ACTIVE' | 'BLOCKED' | 'CLOSED'; createdAt: string;
}

const mockAccounts: Account[] = [
  { id: '1', owner: 'João Silva', document: '123.456.789-00', balance: 15420.50, status: 'ACTIVE', createdAt: '2024-01-15' },
  { id: '2', owner: 'Maria Oliveira', document: '987.654.321-00', balance: 8750.00, status: 'ACTIVE', createdAt: '2024-02-20' },
  { id: '3', owner: 'Pedro Santos', document: '456.789.123-00', balance: 0.00, status: 'BLOCKED', createdAt: '2024-03-10' },
  { id: '4', owner: 'Ana Costa', document: '789.123.456-00', balance: 3200.75, status: 'ACTIVE', createdAt: '2024-04-05' },
  { id: '5', owner: 'Carlos Lima', document: '321.654.987-00', balance: 50000.00, status: 'CLOSED', createdAt: '2024-05-12' },
];

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/20 text-emerald-400',
  BLOCKED: 'bg-amber-500/20 text-amber-400',
  CLOSED: 'bg-red-500/20 text-red-400',
};

const statusLabels: Record<string, string> = {
  ACTIVE: 'Ativa', BLOCKED: 'Bloqueada', CLOSED: 'Encerrada',
};

export default function ContasPage() {
  const [accounts, setAccounts] = useState(mockAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewAccount, setShowNewAccount] = useState(false);
  const [newOwner, setNewOwner] = useState('');
  const [newDocument, setNewDocument] = useState('');
  const [message, setMessage] = useState('');

  const filtered = accounts.filter(a =>
    a.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.document.includes(searchTerm)
  );

  function addAccount() {
    if (!newOwner || !newDocument) {
      setMessage('Preencha todos os campos!');
      return;
    }
    const newAccount: Account = {
      id: String(accounts.length + 1),
      owner: newOwner,
      document: newDocument,
      balance: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAccounts([...accounts, newAccount]);
    setNewOwner('');
    setNewDocument('');
    setShowNewAccount(false);
    setMessage('✅ Conta criada com sucesso!');
    setTimeout(() => setMessage(''), 3000);
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Contas</h1>
          <p className="text-text-secondary mt-1">Gerencie as contas bancárias</p>
        </div>
        <button onClick={() => setShowNewAccount(!showNewAccount)} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold rounded-xl hover:shadow-lg transition-all">
          <Plus size={20} /> Nova Conta
        </button>
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${message.includes('✅') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {message}
        </div>
      )}

      {showNewAccount && (
        <div className="glass-strong rounded-2xl p-6 mb-6 animate-scale-in">
          <h3 className="text-lg font-bold text-white mb-4">Nova Conta</h3>
          <div className="flex gap-3 flex-wrap">
            <input placeholder="Nome do titular" value={newOwner} onChange={e => setNewOwner(e.target.value)} className="px-4 py-2.5 bg-bg-secondary border border-border-medium rounded-xl text-white flex-1 min-w-[200px]" />
            <input placeholder="CPF" value={newDocument} onChange={e => setNewDocument(e.target.value)} className="px-4 py-2.5 bg-bg-secondary border border-border-medium rounded-xl text-white w-48" />
            <button onClick={addAccount} className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-xl">Criar</button>
          </div>
        </div>
      )}

      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border-subtle">
          <div className="relative w-72">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary border border-border-medium rounded-xl text-white" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-3 px-4 text-text-muted font-medium">ID</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Titular</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">CPF</th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">Saldo</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Status</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Abertura</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(account => (
                <tr key={account.id} className="border-b border-border-subtle/50 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-text-muted font-mono text-sm">#{account.id}</td>
                  <td className="py-4 px-4 text-white font-medium">{account.owner}</td>
                  <td className="py-4 px-4 text-text-secondary">{account.document}</td>
                  <td className="py-4 px-4 text-right text-white font-mono font-bold">
                    {account.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={statusColors[account.status]}>{statusLabels[account.status]}</Badge>
                  </td>
                  <td className="py-4 px-4 text-text-secondary">{account.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border-subtle text-text-muted text-sm">
          {filtered.length} conta(s) encontrada(s)
        </div>
      </div>
    </div>
  );
}
