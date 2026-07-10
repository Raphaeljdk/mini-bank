export interface Account {
  id: string;
  owner: string;
  balance: number;
  status: 'ACTIVE' | 'BLOCKED' | 'CLOSED';
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  accountId: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  timestamp: string;
  eventId: string;
}

export interface ReconciliationReport {
  id: string;
  date: string;
  totalAccounts: number;
  matchedAccounts: number;
  divergedAccounts: number;
  totalDivergence: number;
  status: 'OK' | 'DIVERGED' | 'RUNNING';
}

export interface HealthStatus {
  service: string;
  status: 'UP' | 'DOWN';
  details: string;
}
