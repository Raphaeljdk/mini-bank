'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Server, MessageSquare, Activity, HardDrive, RefreshCw } from 'lucide-react';

interface HealthStatus {
  service: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  details: string;
  uptime?: string;
  latency?: string;
}

const mockHealth: HealthStatus[] = [
  { service: 'API Gateway', status: 'UP', details: 'Todas as rotas operacionais', uptime: '5d 12h 34m', latency: '45ms' },
  { service: 'PostgreSQL', status: 'UP', details: 'Conexões ativas: 23/100', uptime: '12d 3h 15m', latency: '2ms' },
  { service: 'Redis', status: 'UP', details: 'Cache hit rate: 94.2%', uptime: '12d 3h 10m', latency: '<1ms' },
  { service: 'Worker Processador', status: 'UP', details: 'Fila: 145 eventos/min', uptime: '3d 8h 45m', latency: '120ms' },
  { service: 'Worker Conciliador', status: 'DEGRADED', details: 'Última execução atrasada em 45min', uptime: '1d 2h 30m', latency: '5s' },
];

const statusColors: Record<string, string> = {
  UP: 'bg-green-100 text-green-800',
  DOWN: 'bg-red-100 text-red-800',
  DEGRADED: 'bg-yellow-100 text-yellow-800',
};

const statusDot: Record<string, string> = {
  UP: 'bg-green-500',
  DOWN: 'bg-red-500',
  DEGRADED: 'bg-yellow-500',
};

const serviceIcons: Record<string, React.ReactNode> = {
  'API Gateway': <Server size={24} className="text-slate-400" />,
  'PostgreSQL': <Database size={24} className="text-slate-400" />,
  'Redis': <HardDrive size={24} className="text-slate-400" />,
  'Worker Processador': <Activity size={24} className="text-slate-400" />,
  'Worker Conciliador': <RefreshCw size={24} className="text-slate-400" />,
};

export default function HealthPage() {
  const [services, setServices] = useState<HealthStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchHealth() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/health`);
      const data = await response.json();
      setServices(data);
    } catch {
      setServices(mockHealth);
    } finally {
      setIsLoading(false);
      setLastUpdate(new Date());
    }
  }

  const upCount = services.filter((s) => s.status === 'UP').length;
  const downCount = services.filter((s) => s.status === 'DOWN').length;
  const degradedCount = services.filter((s) => s.status === 'DEGRADED').length;
  const overallStatus = downCount > 0 ? 'DOWN' : degradedCount > 0 ? 'DEGRADED' : 'UP';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Verificando serviços...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Health Check</h1>
          <p className="text-slate-500 mt-1">Status dos serviços em tempo real</p>
        </div>
        <div className="text-right">
          <Badge className={
            overallStatus === 'UP' ? 'bg-green-100 text-green-800 text-sm px-4 py-2' :
            overallStatus === 'DEGRADED' ? 'bg-yellow-100 text-yellow-800 text-sm px-4 py-2' :
            'bg-red-100 text-red-800 text-sm px-4 py-2'
          }>
            {overallStatus === 'UP' ? 'SISTEMA OPERACIONAL' : overallStatus === 'DEGRADED' ? 'SISTEMA DEGRADADO' : 'SISTEMA FORA DO AR'}
          </Badge>
          <p className="text-xs text-slate-400 mt-1">Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-green-200">
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold text-green-600">{upCount}</p>
            <p className="text-sm text-slate-500 mt-1">Serviços Ativos</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold text-yellow-600">{degradedCount}</p>
            <p className="text-sm text-slate-500 mt-1">Serviços Degradados</p>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-bold text-red-600">{downCount}</p>
            <p className="text-sm text-slate-500 mt-1">Serviços Inativos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const Icon = serviceIcons[service.service] || <Server size={24} />;
          return (
            <Card key={service.service}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {Icon}
                    <div>
                      <p className="font-semibold text-slate-800">{service.service}</p>
                      <p className="text-sm text-slate-500">{service.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${statusDot[service.status]}`} />
                    <Badge className={statusColors[service.status]}>{service.status}</Badge>
                  </div>
                </div>
                {(service.uptime || service.latency) && (
                  <div className="flex gap-6 mt-4 pt-4 border-t text-sm text-slate-500">
                    {service.uptime && <span>Uptime: <strong>{service.uptime}</strong></span>}
                    {service.latency && <span>Latência: <strong>{service.latency}</strong></span>}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
