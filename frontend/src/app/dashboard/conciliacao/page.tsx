'use client';
import { useState } from 'react';
import { ShieldCheck, ShieldX, ShieldAlert, Clock, TrendingUp } from 'lucide-react';

const reports = [
  { id: '1', date: '2024-06-21T00:00:00', totalAccounts: 1542, matchedAccounts: 1542, divergedAccounts: 0, totalDivergence: 0, status: 'OK' },
  { id: '2', date: '2024-06-20T00:00:00', totalAccounts: 1538, matchedAccounts: 1535, divergedAccounts: 3, totalDivergence: 1250.75, status: 'DIVERGED' },
  { id: '3', date: '2024-06-19T00:00:00', totalAccounts: 1530, matchedAccounts: 1530, divergedAccounts: 0, totalDivergence: 0, status: 'OK' },
  { id: '4', date: '2024-06-18T00:00:00', totalAccounts: 1525, matchedAccounts: 1525, divergedAccounts: 0, totalDivergence: 0, status: 'OK' },
  { id: '5', date: '2024-06-17T00:00:00', totalAccounts: 1520, matchedAccounts: 1518, divergedAccounts: 2, totalDivergence: 450.00, status: 'DIVERGED' },
  { id: '6', date: '2024-06-21T14:30:00', totalAccounts: 1545, matchedAccounts: 0, divergedAccounts: 0, totalDivergence: 0, status: 'RUNNING' },
];

const statusConfig = {
  OK: { label: 'Conciliado', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-400' },
  DIVERGED: { label: 'Divergente', icon: ShieldX, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', badge: 'bg-red-500/20 text-red-400' },
  RUNNING: { label: 'Em execução', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', badge: 'bg-blue-500/20 text-blue-400' },
};

export default function ConciliacaoPage() {
  const okCount = reports.filter(r => r.status === 'OK').length;
  const divergedCount = reports.filter(r => r.status === 'DIVERGED').length;
  const totalDivergence = reports.reduce((s, r) => s + r.totalDivergence, 0);
  const lastReport = reports[0];

  function formatCurrency(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
  function formatDate(d: string) { return new Date(d).toLocaleDateString('pt-BR'); }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Conciliação</h1>
        <p className="text-text-secondary mt-1 text-sm">Relatórios de conciliação do livro-razão</p>
      </div>

      {/* Cards de status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`glass-strong rounded-2xl p-4 ${statusConfig[lastReport.status as keyof typeof statusConfig].border} border`}>
          <div className="flex items-center gap-2 mb-2">
            {(() => { const Icon = statusConfig[lastReport.status as keyof typeof statusConfig].icon; return <Icon size={20} className={statusConfig[lastReport.status as keyof typeof statusConfig].color} />; })()}
            <span className="text-text-secondary text-xs">Último Status</span>
          </div>
          <p className={`text-lg font-bold ${statusConfig[lastReport.status as keyof typeof statusConfig].color}`}>
            {statusConfig[lastReport.status as keyof typeof statusConfig].label}
          </p>
        </div>

        <div className="glass-strong rounded-2xl p-4 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2"><ShieldCheck size={20} className="text-emerald-400" /><span className="text-text-secondary text-xs">Conciliados (OK)</span></div>
          <p className="text-lg font-bold text-emerald-400">{okCount}</p>
          <span className="text-text-muted text-xs">últimos 7 dias</span>
        </div>

        <div className="glass-strong rounded-2xl p-4 border border-red-500/20">
          <div className="flex items-center gap-2 mb-2"><ShieldX size={20} className="text-red-400" /><span className="text-text-secondary text-xs">Divergentes</span></div>
          <p className="text-lg font-bold text-red-400">{divergedCount}</p>
          <span className="text-text-muted text-xs">últimos 7 dias</span>
        </div>

        <div className="glass-strong rounded-2xl p-4 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-2"><TrendingUp size={20} className="text-amber-400" /><span className="text-text-secondary text-xs">Divergência Total</span></div>
          <p className="text-lg font-bold text-amber-400">{formatCurrency(totalDivergence)}</p>
          <span className="text-text-muted text-xs">valor acumulado</span>
        </div>
      </div>

      {/* Tabela */}
      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border-subtle">
          <h2 className="font-semibold text-white">Histórico de Conciliações</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left py-3 px-4 text-text-muted text-xs font-medium">Data</th>
                <th className="text-left py-3 px-4 text-text-muted text-xs font-medium">Status</th>
                <th className="text-right py-3 px-4 text-text-muted text-xs font-medium">Total Contas</th>
                <th className="text-right py-3 px-4 text-text-muted text-xs font-medium">Conciliadas</th>
                <th className="text-right py-3 px-4 text-text-muted text-xs font-medium">Divergentes</th>
                <th className="text-right py-3 px-4 text-text-muted text-xs font-medium">Divergência</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => {
                const config = statusConfig[report.status as keyof typeof statusConfig];
                const Icon = config.icon;
                return (
                  <tr key={report.id} className="border-b border-border-subtle/30 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-text-secondary text-sm">{formatDate(report.date)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium ${config.badge}`}>
                        <Icon size={14} />{config.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-white text-sm">{report.totalAccounts.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-emerald-400 text-sm font-medium">{report.matchedAccounts.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-sm">
                      {report.divergedAccounts > 0 ? <span className="text-red-400 font-medium">{report.divergedAccounts}</span> : <span className="text-text-muted">0</span>}
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-mono">
                      {report.totalDivergence > 0 ? <span className="text-red-400">{formatCurrency(report.totalDivergence)}</span> : <span className="text-text-muted">R$ 0,00</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
