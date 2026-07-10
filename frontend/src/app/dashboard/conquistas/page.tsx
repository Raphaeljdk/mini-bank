'use client';
import { useEffect, useState } from 'react';
import { Award, Star, Zap, Target, PiggyBank, TrendingUp, Shield, Crown } from 'lucide-react';

const badges = [
  { id: 'first_login', name: 'Primeiro Acesso', icon: Star, description: 'Fez login pela primeira vez', color: 'text-amber-400', earned: true },
  { id: 'first_transaction', name: 'Primeira Transação', icon: Zap, description: 'Adicionou uma receita ou despesa', color: 'text-accent-blue', earned: false },
  { id: 'save_1000', name: 'Poupador Iniciante', icon: PiggyBank, description: 'Economizou R$ 1.000,00', color: 'text-accent-green', earned: false },
  { id: 'investor', name: 'Investidor', icon: TrendingUp, description: 'Comprou seu primeiro ativo', color: 'text-accent-purple', earned: false },
  { id: 'goal_reached', name: 'Meta Batida', icon: Target, description: 'Atingiu uma meta financeira', color: 'text-accent-cyan', earned: false },
  { id: 'security', name: 'Segurança Máxima', icon: Shield, description: 'Ativou autenticação 2FA', color: 'text-emerald-400', earned: false },
  { id: 'premium', name: 'Premium', icon: Crown, description: 'Todas as conquistas desbloqueadas', color: 'text-amber-400', earned: false },
];

export default function ConquistasPage() {
  const earned = badges.filter(b => b.earned).length;

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-bold gradient-text mb-2">🏆 Conquistas</h1>
      <p className="text-text-secondary mb-6">{earned} de {badges.length} conquistas desbloqueadas</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge, i) => {
          const Icon = badge.icon;
          return (
            <div key={i} className={`glass-strong rounded-2xl p-5 flex items-center gap-4 transition-all ${badge.earned ? 'border border-accent-blue/30' : 'opacity-40 grayscale'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${badge.earned ? 'bg-accent-blue/20' : 'bg-bg-tertiary'}`}>
                <Icon size={24} className={badge.earned ? badge.color : 'text-text-muted'} />
              </div>
              <div>
                <p className="text-white font-medium">{badge.name}</p>
                <p className="text-text-muted text-sm">{badge.description}</p>
              </div>
              {badge.earned && <Award size={20} className="text-amber-400 ml-auto" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
