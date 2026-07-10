'use client';
import { useEffect, useState } from 'react';
import { User, Mail, Shield, Camera } from 'lucide-react';

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) { const u = JSON.parse(stored); setUser(u); setName(u.fullName || ''); }
  }, []);

  function handleSave() {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      u.fullName = name;
      localStorage.setItem('user', JSON.stringify(u));
      setMessage('✅ Perfil atualizado!');
      setTimeout(() => setMessage(''), 3000);
    }
  }

  return (
    <div className="animate-fade-in-up max-w-2xl">
      <h1 className="text-3xl font-bold gradient-text mb-6">Meu Perfil</h1>
      {message && <div className="mb-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm">{message}</div>}
      <div className="glass-strong rounded-2xl p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full flex items-center justify-center relative">
            <User size={40} className="text-white" />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-bg-primary rounded-full flex items-center justify-center border border-border-medium"><Camera size={14} /></button>
          </div>
          <div><h2 className="text-2xl font-bold text-white">{user?.fullName || 'Usuário'}</h2><p className="text-text-secondary">{user?.role || 'CLIENTE'}</p></div>
        </div>
        <div className="space-y-4">
          <div><label className="text-text-muted text-xs mb-1 block">Nome Completo</label><div className="flex items-center gap-2 bg-bg-secondary border border-border-medium rounded-xl px-4"><User size={18} className="text-text-muted" /><input value={name} onChange={e => setName(e.target.value)} className="flex-1 py-3 bg-transparent text-white outline-none" /></div></div>
          <div><label className="text-text-muted text-xs mb-1 block">Email</label><div className="flex items-center gap-2 bg-bg-secondary border border-border-medium rounded-xl px-4"><Mail size={18} className="text-text-muted" /><input value={user?.email || 'usuario@minibank.com'} readOnly className="flex-1 py-3 bg-transparent text-white outline-none opacity-60" /></div></div>
          <div><label className="text-text-muted text-xs mb-1 block">Nível de Acesso</label><div className="flex items-center gap-2 bg-bg-secondary border border-border-medium rounded-xl px-4"><Shield size={18} className="text-amber-400" /><span className="py-3 text-white">{user?.role || 'CLIENTE'}</span></div></div>
          <button onClick={handleSave} className="w-full py-3 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold rounded-xl hover:shadow-lg transition-all mt-4">Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
}
