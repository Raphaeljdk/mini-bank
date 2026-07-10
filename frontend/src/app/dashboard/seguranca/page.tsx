'use client';
import { useState } from 'react';
import { Shield, Key, Smartphone } from 'lucide-react';

export default function SegurancaPage() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  function enable2FA() {
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCode(generatedCode);
    setTwoFactor(true);
    setMessage('🔐 Código 2FA gerado: ' + generatedCode + ' (simulado)');
    setTimeout(() => setMessage(''), 10000);
  }

  return (
    <div className="animate-fade-in-up max-w-2xl">
      <h1 className="text-3xl font-bold gradient-text mb-6">Segurança</h1>
      {message && <div className="mb-4 px-4 py-3 bg-accent-blue/10 border border-accent-blue/30 rounded-xl text-accent-blue text-sm">{message}</div>}
      <div className="space-y-4">
        <div className="glass-strong rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3"><Shield size={24} className="text-accent-blue" /><div><p className="text-white font-medium">Autenticação em 2 Fatores</p><p className="text-text-muted text-sm">Adicione uma camada extra de segurança</p></div></div>
          <button onClick={enable2FA} className={`px-4 py-2 rounded-xl font-medium transition-all ${twoFactor ? 'bg-emerald-500/20 text-emerald-400' : 'bg-accent-blue/20 text-accent-blue hover:bg-accent-blue/30'}`}>
            {twoFactor ? '✅ Ativado' : 'Ativar'}
          </button>
        </div>
        <div className="glass-strong rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3"><Key size={24} className="text-accent-purple" /><div><p className="text-white font-medium">Alterar Senha</p><p className="text-text-muted text-sm">Última alteração: nunca</p></div></div>
          <button className="px-4 py-2 bg-accent-purple/20 text-accent-purple rounded-xl font-medium hover:bg-accent-purple/30 transition-all">Alterar</button>
        </div>
        <div className="glass-strong rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-3"><Smartphone size={24} className="text-accent-cyan" /><div><p className="text-white font-medium">Dispositivos Conectados</p><p className="text-text-muted text-sm">1 dispositivo ativo</p></div></div>
          <button className="px-4 py-2 bg-accent-cyan/20 text-accent-cyan rounded-xl font-medium hover:bg-accent-cyan/30 transition-all">Gerenciar</button>
        </div>
      </div>
    </div>
  );
}
