'use client';
import { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const notifications = [
  { id: 1, type: 'success', title: 'Conciliação concluída', message: 'A conciliação diária foi concluída com sucesso. 1542 contas verificadas.', time: '10 min atrás', read: false },
  { id: 2, type: 'warning', title: 'Divergência detectada', message: '3 contas apresentaram divergência na última conciliação.', time: '1 hora atrás', read: false },
  { id: 3, type: 'info', title: 'Nova conta criada', message: 'João Silva criou uma nova conta corrente.', time: '2 horas atrás', read: true },
  { id: 4, type: 'success', title: 'Depósito recebido', message: 'Depósito de R$ 5.000,00 na conta #1 processado.', time: '3 horas atrás', read: true },
  { id: 5, type: 'warning', title: 'Tentativa de login', message: 'Tentativa de login falhou para o usuário admin.', time: '5 horas atrás', read: true },
];

const iconMap = { success: <CheckCircle size={20} className="text-accent-green" />, warning: <AlertTriangle size={20} className="text-amber-400" />, info: <Info size={20} className="text-accent-blue" /> };

export default function NotificacoesPage() {
  const [notifs, setNotifs] = useState(notifications);
  const unread = notifs.filter(n => !n.read).length;

  function markAllRead() {
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  }

  function removeNotif(id: number) {
    setNotifs(notifs.filter(n => n.id !== id));
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Notificações</h1>
          <p className="text-text-secondary mt-1">{unread} não lida(s)</p>
        </div>
        <button onClick={markAllRead} className="px-4 py-2 bg-accent-blue/20 text-accent-blue rounded-xl text-sm font-medium hover:bg-accent-blue/30 transition-all">
          Marcar todas como lidas
        </button>
      </div>

      <div className="space-y-3">
        {notifs.map(notif => (
          <div key={notif.id} className={`glass-strong rounded-2xl p-5 flex items-start gap-4 transition-all ${!notif.read ? 'border-l-4 border-l-accent-blue' : 'opacity-60'}`}>
            <div className="mt-1">{iconMap[notif.type as keyof typeof iconMap]}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white">{notif.title}</h3>
                {!notif.read && <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />}
              </div>
              <p className="text-text-secondary text-sm">{notif.message}</p>
              <span className="text-text-muted text-xs mt-2 block">{notif.time}</span>
            </div>
            <button onClick={() => removeNotif(notif.id)} className="text-text-muted hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
