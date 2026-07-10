'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Shield, Globe, Lock, User, Mail, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(''); setSuccess('');

    if (isLogin) {
      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        if (!response.ok) throw new Error('Usuário ou senha inválidos');
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        router.push('/dashboard');
      } catch (err) { setError(err instanceof Error ? err.message : 'Erro ao fazer login'); }
      finally { setIsLoading(false); }
    } else {
      if (!fullName || !username || !password) { setError('Preencha todos os campos!'); setIsLoading(false); return; }
      try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, email, username, password }),
        });
        if (!response.ok) throw new Error('Erro ao criar conta');
        setSuccess('✅ Conta criada com sucesso! Faça login.');
        setIsLogin(true);
        setUsername(''); setPassword('');
      } catch (err) { setError(err instanceof Error ? err.message : 'Erro ao cadastrar'); }
      finally { setIsLoading(false); }
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* FUNDO ANIMADO */}
      <div className="absolute inset-0 z-0">
        {/* Orbs decorativos */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent-blue/10 blur-[120px] animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent-purple/10 blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-accent-cyan/8 blur-[100px] animate-float" style={{ animationDelay: '6s' }} />
        
        {/* Grade sutil */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-6xl">
        
        {/* LADO ESQUERDO - TERRA 3D + INFO */}
        <div className="flex-1 flex flex-col items-center text-center animate-fade-in-left">
          {/* Planeta Terra */}
          <div className="relative mb-6" style={{ width: '280px', height: '280px' }}>
            {/* Anéis orbitais */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] rounded-full border border-accent-blue/10 animate-[spin_30s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] rounded-full border border-accent-purple/8 animate-[spin_40s_linear_infinite_reverse]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[145%] h-[145%] rounded-full border border-accent-cyan/6 animate-[spin_50s_linear_infinite]" style={{ transform: 'translate(-50%, -50%) rotate(15deg)' }} />
            
            {/* Esfera da Terra */}
            <div className="w-[280px] h-[280px] rounded-full bg-cover bg-center shadow-[0_0_80px_rgba(77,168,255,0.25),0_0_150px_rgba(34,211,238,0.1),inset_0_0_80px_rgba(0,0,0,0.5)] border border-white/10 animate-float"
              style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Blue_Marble_2002.png/800px-Blue_Marble_2002.png")', backgroundSize: 'cover' }} />
            
            {/* Atmosfera */}
            <div className="absolute top-[-2%] left-[-2%] w-[104%] h-[104%] rounded-full bg-[radial-gradient(circle_at_50%_50%,transparent_60%,rgba(77,168,255,0.15)_90%,rgba(77,168,255,0.3)_100%)] pointer-events-none" />
            
            {/* Pontos brilhantes na órbita */}
            <div className="absolute top-[5%] right-[10%] w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_10px_rgba(77,168,255,0.8)] animate-pulse" />
            <div className="absolute bottom-[15%] left-[5%] w-1.5 h-1.5 rounded-full bg-accent-purple shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[40%] right-[2%] w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          {/* Título */}
          <h1 className="text-5xl sm:text-6xl font-black gradient-text animate-text-glow mb-4">
            MiniBank
          </h1>
          <p className="text-text-secondary text-lg max-w-sm animate-fade-in-up delay-200">
            O banco digital completo. Controle financeiro, investimentos em cripto e ações, tudo em um só lugar.
          </p>
          
          {/* Badges de confiança */}
          <div className="flex items-center gap-6 mt-6 animate-fade-in-up delay-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Shield size={14} className="text-emerald-400" />
              </div>
              <span className="text-text-muted text-xs">Segurança Enterprise</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center">
                <Globe size={14} className="text-accent-blue" />
              </div>
              <span className="text-text-muted text-xs">Acesso Global</span>
            </div>
          </div>
        </div>

        {/* LADO DIREITO - FORMULÁRIO */}
        <div className="w-full max-w-md animate-fade-in-right delay-200">
          <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
            
            {/* Cabeçalho do formulário */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-accent-blue/10 border border-accent-blue/20 rounded-full px-4 py-1.5 mb-4">
                <Sparkles size={14} className="text-accent-blue animate-pulse" />
                <span className="text-accent-blue text-xs font-medium">MiniBank v3.0</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {isLogin ? 'Bem-vindo de volta' : 'Criar sua conta'}
              </h2>
              <p className="text-text-muted text-sm">
                {isLogin ? 'Acesse sua conta para continuar' : 'Comece sua jornada financeira'}
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                      placeholder="Nome completo"
                      className="w-full pl-12 pr-4 py-3.5 bg-bg-secondary/80 border border-white/10 rounded-2xl text-white placeholder-text-muted/50 focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/10 transition-all duration-300 text-sm" />
                  </div>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-bg-secondary/80 border border-white/10 rounded-2xl text-white placeholder-text-muted/50 focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/10 transition-all duration-300 text-sm" />
                  </div>
                </>
              )}
              
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="Usuário"
                  className="w-full pl-12 pr-4 py-3.5 bg-bg-secondary/80 border border-white/10 rounded-2xl text-white placeholder-text-muted/50 focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/10 transition-all duration-300 text-sm" />
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full pl-12 pr-12 py-3.5 bg-bg-secondary/80 border border-white/10 rounded-2xl text-white placeholder-text-muted/50 focus:border-accent-purple/50 focus:ring-2 focus:ring-accent-purple/10 transition-all duration-300 text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Mensagens */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-red-400 text-sm flex items-center gap-2 animate-scale-in">
                  <span className="text-lg">⚠️</span> {error}
                </div>
              )}
              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-3 text-emerald-400 text-sm flex items-center gap-2 animate-scale-in">
                  <span className="text-lg">✅</span> {success}
                </div>
              )}

              {/* Botão */}
              <button type="submit" disabled={isLoading}
                className="btn-premium w-full py-4 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan text-white font-bold text-base rounded-2xl hover:shadow-[0_10px_40px_rgba(77,168,255,0.3)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? 'Entrar' : 'Criar Conta'}</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Separador */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-bg-primary/80 text-text-muted text-xs">ou</span>
              </div>
            </div>

            {/* Toggle Login/Cadastro */}
            <div className="text-center">
              <button onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                className="text-text-muted hover:text-accent-blue transition-all duration-300 text-sm group">
                {isLogin ? (
                  <span>Não tem conta? <span className="text-accent-blue group-hover:underline font-medium">Cadastre-se gratuitamente</span></span>
                ) : (
                  <span>Já tem conta? <span className="text-accent-blue group-hover:underline font-medium">Faça login</span></span>
                )}
              </button>
            </div>

            {/* Demo credentials */}
            {isLogin && (
              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-text-muted text-[10px] text-center">
                  Demo: <span className="text-accent-blue font-medium">admin</span> / <span className="text-accent-purple font-medium">admin123</span>
                  {' • '}
                  <span className="text-accent-blue font-medium">cliente</span> / <span className="text-accent-purple font-medium">cliente123</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
