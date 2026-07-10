'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, ShieldCheck, Activity, LogOut, ChevronRight, Banknote, Bell, Settings, Sparkles, TrendingUp, Wallet, Target, Award, Calculator, Key, Send, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const role = user?.role || 'CLIENTE';
  const isAdmin = role === 'ADMIN';
  const isGerente = role === 'GERENTE' || isAdmin;

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true, badge: null },
    { href: '/dashboard/financas', label: 'Finanças', icon: Wallet, show: true, badge: null },
    { href: '/dashboard/transferencias', label: 'Transferências', icon: Send, show: true, badge: 'NOVO' },
    { href: '/dashboard/investimentos', label: 'Investimentos', icon: TrendingUp, show: true, badge: null },
    { href: '/dashboard/extrato', label: 'Extrato', icon: FileText, show: true, badge: null },
    { href: '/dashboard/relatorios', label: 'Relatórios', icon: Activity, show: true, badge: null },
    { href: '/dashboard/simulador', label: 'Simulador', icon: Calculator, show: true, badge: null },
    { href: '/dashboard/metas', label: 'Metas', icon: Target, show: true, badge: null },
    { href: '/dashboard/conquistas', label: 'Conquistas', icon: Award, show: true, badge: null },
    { href: '/dashboard/seguranca', label: 'Segurança', icon: Key, show: true, badge: null },
    { href: '/dashboard/contas', label: 'Contas', icon: Users, show: isGerente, badge: 'ADMIN' },
    { href: '/dashboard/conciliacao', label: 'Conciliação', icon: ShieldCheck, show: isGerente, badge: null },
    { href: '/dashboard/health', label: 'Health Check', icon: Activity, show: isAdmin, badge: 'DEV' },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary text-white min-h-screen p-4 flex flex-col border-r border-border-subtle overflow-y-auto relative">
      {/* Efeito de luz no topo */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-accent-blue/5 to-transparent pointer-events-none" />
      
      {/* LOGO */}
      <div className="mb-6 px-2 relative z-10">
        <div className="flex items-center gap-3 animate-fade-in-left">
          <div className="w-11 h-11 bg-gradient-to-br from-accent-blue via-accent-purple to-accent-cyan rounded-xl flex items-center justify-center animate-float shadow-lg shadow-accent-blue/30 relative">
            <Banknote size={22} className="text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-amber rounded-full flex items-center justify-center animate-pulse"><Star size={8} className="text-black" /></div>
          </div>
          <div>
            <h1 className="text-lg font-extrabold gradient-text">MiniBank</h1>
            <p className="text-text-muted text-[10px] uppercase tracking-widest">{isAdmin ? 'Admin' : isGerente ? 'Gerente' : 'Cliente'}</p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 space-y-0.5 relative z-10">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-3 mb-3">Menu Principal</p>
        <ul className="space-y-0.5">
          {menuItems.filter(item => item.show).map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isHovered = hovered === item.href;
            return (
              <li key={item.href} className={`animate-fade-in-left`} style={{ animationDelay: `${index * 0.05}s` }}>
                <Link href={item.href}
                  onMouseEnter={() => setHovered(item.href)}
                  onMouseLeave={() => setHovered(null)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm relative overflow-hidden group ${
                    isActive 
                      ? 'bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 text-white border border-accent-blue/40 shadow-lg shadow-accent-blue/10' 
                      : 'text-text-secondary hover:bg-bg-tertiary/40 hover:text-white border border-transparent'
                  }`}>
                  {/* Efeito hover glow */}
                  {isHovered && !isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 to-transparent animate-pulse" />
                  )}
                  <Icon size={17} className={`transition-all duration-300 ${isActive ? 'text-accent-blue' : 'text-text-muted group-hover:text-text-secondary'} ${isActive && 'animate-float'}`} />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.badge === 'NOVO' ? 'bg-accent-green/20 text-accent-green animate-pulse' : item.badge === 'ADMIN' ? 'bg-amber-500/20 text-amber-400' : 'bg-accent-purple/20 text-accent-purple'}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight size={14} className="text-accent-blue animate-fade-in-right" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* RODAPÉ */}
      <div className="pt-3 border-t border-border-subtle space-y-1 mt-3 relative z-10">
        <Link href="/dashboard/notificacoes" className={`flex items-center gap-2.5 px-3 py-2.5 w-full rounded-xl text-sm transition-all ${pathname === '/dashboard/notificacoes' ? 'bg-accent-blue/15 text-white' : 'text-text-secondary hover:text-white hover:bg-bg-tertiary/40'}`}>
          <Bell size={17} /> Notificações
          <span className="ml-auto w-5 h-5 bg-accent-red rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse">3</span>
        </Link>
        <Link href="/dashboard/configuracoes" className={`flex items-center gap-2.5 px-3 py-2.5 w-full rounded-xl text-sm transition-all ${pathname === '/dashboard/configuracoes' ? 'bg-accent-blue/15 text-white' : 'text-text-secondary hover:text-white hover:bg-bg-tertiary/40'}`}>
          <Settings size={17} /> Configurações
        </Link>
        <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login'; }}
          className="flex items-center gap-2.5 px-3 py-2.5 w-full text-accent-red/60 hover:text-accent-red hover:bg-accent-red/8 rounded-xl text-sm transition-all">
          <LogOut size={17} /> Sair
        </button>
      </div>

      {/* VERSÃO */}
      <div className="mt-3 pt-3 border-t border-border-subtle px-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-accent-purple animate-pulse" />
            <p className="text-[10px] text-text-muted tracking-wider">v3.0 PRO</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span className="text-[9px] text-text-muted">online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
