'use client';
import { useState } from 'react';
import { Settings, Moon, Sun, Globe, Lock, Bell, User } from 'lucide-react';

export default function ConfiguracoesPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('pt-BR');
  const [name, setName] = useState('Administrador');
  const [email, setEmail] = useState('admin@minibank.com');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="animate-fade-in-up max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
        <p className="text-text-secondary mt-1">Gerencie suas preferências</p>
      </div>

      {saved && (
        <div className="mb-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm">
          ✅ Configurações salvas com sucesso!
        </div>
      )}

      <div className="space-y-6">
        {/* Perfil */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4"><User size={20} className="text-accent-blue" /><h2 className="text-lg font-bold text-white">Perfil</h2></div>
          <div className="space-y-4">
            <div><label className="text-text-secondary text-sm block mb-1">Nome</label><input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 bg-bg-secondary border border-border-medium rounded-xl text-white" /></div>
            <div><label className="text-text-secondary text-sm block mb-1">Email</label><input value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-bg-secondary border border-border-medium rounded-xl text-white" /></div>
          </div>
        </div>

        {/* Aparência */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4"><Moon size={20} className="text-accent-purple" /><h2 className="text-lg font-bold text-white">Aparência</h2></div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Modo escuro</span>
            <button onClick={() => setDarkMode(!darkMode)} className={`w-14 h-7 rounded-full transition-all ${darkMode ? 'bg-accent-blue' : 'bg-border-medium'}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-all m-1 ${darkMode ? 'translate-x-7' : ''}`} />
            </button>
          </div>
        </div>

        {/* Notificações */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4"><Bell size={20} className="text-amber-400" /><h2 className="text-lg font-bold text-white">Notificações</h2></div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Receber notificações</span>
            <button onClick={() => setNotifications(!notifications)} className={`w-14 h-7 rounded-full transition-all ${notifications ? 'bg-accent-green' : 'bg-border-medium'}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-all m-1 ${notifications ? 'translate-x-7' : ''}`} />
            </button>
          </div>
        </div>

        {/* Idioma */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4"><Globe size={20} className="text-accent-cyan" /><h2 className="text-lg font-bold text-white">Idioma</h2></div>
          <select value={language} onChange={e => setLanguage(e.target.value)} className="px-4 py-2.5 bg-bg-secondary border border-border-medium rounded-xl text-white">
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>

        <button onClick={handleSave} className="w-full py-4 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg">
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}
