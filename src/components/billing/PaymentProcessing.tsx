'use client';

import {
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Download,
  Globe,
  Percent,
  Receipt,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type PaymentMethod = 'stripe' | 'paypal' | 'card' | 'bank';
type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'disputed';
type RefundReason = 'customer_request' | 'duplicate' | 'fraudulent' | 'other';

type Transaction = {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  customerEmail: string;
  customerName: string;
  description: string;
  createdAt: string;
  refundedAt?: string;
  refundAmount?: number;
  tax?: number;
  invoiceUrl?: string;
};

type TaxConfig = {
  region: string;
  rate: number;
  name: string;
  enabled: boolean;
};

type PaymentProcessingProps = {
  variant?: 'full' | 'compact' | 'widget';
  onRefund?: (transactionId: string, amount: number, reason: RefundReason) => void;
  onExportInvoice?: (transactionId: string) => void;
  className?: string;
};

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: 'txn_1',
    amount: 2500,
    currency: 'USD',
    status: 'completed',
    method: 'stripe',
    customerEmail: 'john@example.com',
    customerName: 'John Doe',
    description: 'Pro Plan - Monthly',
    createdAt: '2024-01-12T10:30:00Z',
    tax: 250,
    invoiceUrl: 'https://stripe.com/invoice/1234',
  },
  {
    id: 'txn_2',
    amount: 9900,
    currency: 'USD',
    status: 'completed',
    method: 'paypal',
    customerEmail: 'jane@company.com',
    customerName: 'Jane Smith',
    description: 'Team Plan - Annual',
    createdAt: '2024-01-11T15:45:00Z',
    tax: 990,
  },
  {
    id: 'txn_3',
    amount: 2500,
    currency: 'USD',
    status: 'refunded',
    method: 'stripe',
    customerEmail: 'mike@test.com',
    customerName: 'Mike Johnson',
    description: 'Pro Plan - Monthly',
    createdAt: '2024-01-10T09:00:00Z',
    refundedAt: '2024-01-11T12:00:00Z',
    refundAmount: 2500,
  },
  {
    id: 'txn_4',
    amount: 4900,
    currency: 'USD',
    status: 'pending',
    method: 'bank',
    customerEmail: 'sarah@enterprise.com',
    customerName: 'Sarah Williams',
    description: 'Enterprise Setup',
    createdAt: '2024-01-12T08:00:00Z',
  },
  {
    id: 'txn_5',
    amount: 1500,
    currency: 'USD',
    status: 'failed',
    method: 'card',
    customerEmail: 'bob@email.com',
    customerName: 'Bob Brown',
    description: 'Pro Plan - Monthly',
    createdAt: '2024-01-12T06:30:00Z',
  },
];

const mockTaxConfigs: TaxConfig[] = [
  { region: 'US-CA', rate: 7.25, name: 'California Sales Tax', enabled: true },
  { region: 'US-NY', rate: 8.0, name: 'New York Sales Tax', enabled: true },
  { region: 'EU', rate: 20.0, name: 'EU VAT', enabled: true },
  { region: 'UK', rate: 20.0, name: 'UK VAT', enabled: true },
  { region: 'AU', rate: 10.0, name: 'Australian GST', enabled: false },
];

const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100);
};

export default function PaymentProcessing({
  variant = 'full',
  onRefund,
  onExportInvoice,
  className = '',
}: PaymentProcessingProps) {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [taxConfigs, setTaxConfigs] = useState<TaxConfig[]>(mockTaxConfigs);
  const [activeTab, setActiveTab] = useState<'transactions' | 'refunds' | 'taxes'>('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState<RefundReason>('customer_request');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRefund = useCallback(async () => {
    if (!selectedTransaction || !refundAmount) {
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    onRefund?.(selectedTransaction.id, Number.parseFloat(refundAmount) * 100, refundReason);
    setIsProcessing(false);
    setShowRefundModal(false);
    setSelectedTransaction(null);
    setRefundAmount('');
  }, [selectedTransaction, refundAmount, refundReason, onRefund]);

  const handleTaxToggle = useCallback((region: string) => {
    setTaxConfigs(prev => prev.map(config =>
      config.region === region ? { ...config, enabled: !config.enabled } : config,
    ));
  }, []);

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = txn.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      || txn.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
      || txn.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'failed': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'refunded': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
      case 'disputed': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'stripe': return '💳';
      case 'paypal': return '🅿️';
      case 'card': return '💳';
      case 'bank': return '🏦';
      default: return '💰';
    }
  };

  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunded = transactions
    .filter(t => t.status === 'refunded')
    .reduce((sum, t) => sum + (t.refundAmount || 0), 0);

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-2 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Revenue</span>
        </div>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue, 'USD')}</p>
        <p className="text-xs text-gray-500">
          {transactions.filter(t => t.status === 'completed').length}
          {' '}
          transactions
        </p>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Recent Payments</h3>
          <span className="text-sm font-medium text-green-600">{formatCurrency(totalRevenue, 'USD')}</span>
        </div>
        <div className="space-y-2">
          {transactions.slice(0, 3).map(txn => (
            <div key={txn.id} className="flex items-center justify-between rounded bg-gray-50 p-2 dark:bg-gray-700/50">
              <div className="flex items-center gap-2">
                <span>{getMethodIcon(txn.method)}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{txn.customerName}</p>
                  <p className="text-xs text-gray-500">{txn.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(txn.amount, txn.currency)}</p>
                <span className={`rounded px-1.5 py-0.5 text-xs ${getStatusColor(txn.status)}`}>{txn.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl bg-white shadow-lg dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Processing</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage transactions, refunds, and taxes</p>
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
            <Receipt className="h-4 w-4" />
            Export Report
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-sm text-green-600 dark:text-green-400">Total Revenue</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{formatCurrency(totalRevenue, 'USD')}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Refunded</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRefunded, 'USD')}</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-sm text-blue-600 dark:text-blue-400">Transactions</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{transactions.length}</p>
          </div>
          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {transactions.filter(t => t.status === 'pending').length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex px-6">
          {(['transactions', 'refunds', 'taxes'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="p-6">
          {/* Filters */}
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-9 text-sm dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as PaymentStatus | 'all')}
              className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Transaction List */}
          <div className="space-y-2">
            {filteredTransactions.map(txn => (
              <div
                key={txn.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/50"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{getMethodIcon(txn.method)}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white">{txn.customerName}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${getStatusColor(txn.status)}`}>
                        {txn.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{txn.customerEmail}</p>
                    <p className="text-xs text-gray-400">
                      {txn.description}
                      {' '}
                      •
                      {' '}
                      {new Date(txn.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(txn.amount, txn.currency)}</p>
                    {txn.tax && (
                      <p className="text-xs text-gray-500">
                        Tax:
                        {formatCurrency(txn.tax, txn.currency)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {txn.invoiceUrl && (
                      <button
                        onClick={() => onExportInvoice?.(txn.id)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-white hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                    {txn.status === 'completed' && (
                      <button
                        onClick={() => {
                          setSelectedTransaction(txn);
                          setShowRefundModal(true);
                        }}
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refunds Tab */}
      {activeTab === 'refunds' && (
        <div className="p-6">
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Recent Refunds</h3>
          <div className="space-y-4">
            {transactions.filter(t => t.status === 'refunded').map(txn => (
              <div key={txn.id} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{txn.customerName}</p>
                    <p className="text-sm text-gray-500">{txn.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600 dark:text-red-400">
                      -
                      {formatCurrency(txn.refundAmount || 0, txn.currency)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Refunded on
                      {' '}
                      {txn.refundedAt ? new Date(txn.refundedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {transactions.filter(t => t.status === 'refunded').length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <RefreshCw className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>No refunds to display</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Taxes Tab */}
      {activeTab === 'taxes' && (
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Tax Configuration</h3>
            <button className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700">
              <Percent className="h-4 w-4" />
              Add Tax Rate
            </button>
          </div>
          <div className="space-y-3">
            {taxConfigs.map(config => (
              <div
                key={config.region}
                className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                  config.enabled
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Globe className={`h-5 w-5 ${config.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{config.name}</p>
                    <p className="text-sm text-gray-500">
                      {config.region}
                      {' '}
                      •
                      {' '}
                      {config.rate}
                      %
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={() => handleTaxToggle(config.region)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-green-600 peer-focus:ring-4 peer-focus:ring-green-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-green-800" />
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Tax Automation</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Taxes are automatically calculated based on customer location. Configure rates above to enable or disable collection for specific regions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl dark:bg-gray-800">
            <div className="border-b border-gray-200 p-6 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Process Refund</h3>
              <p className="text-sm text-gray-500">
                Refund for
                {selectedTransaction.customerName}
              </p>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Original Amount</label>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Refund Amount ($)</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={e => setRefundAmount(e.target.value)}
                  max={selectedTransaction.amount / 100}
                  step="0.01"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter refund amount"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Reason</label>
                <select
                  value={refundReason}
                  onChange={e => setRefundReason(e.target.value as RefundReason)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="customer_request">Customer Request</option>
                  <option value="duplicate">Duplicate Charge</option>
                  <option value="fraudulent">Fraudulent</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 p-6 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setSelectedTransaction(null);
                }}
                className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                disabled={!refundAmount || isProcessing}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowLeft className="h-4 w-4" />}
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export type { PaymentMethod, PaymentProcessingProps, PaymentStatus, RefundReason, TaxConfig, Transaction };
