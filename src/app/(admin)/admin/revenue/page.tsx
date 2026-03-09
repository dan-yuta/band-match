'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Badge } from '@/components/ui';
import { storage } from '@/lib/storage';
import { mockUsers } from '@/data';
import { User } from '@/lib/types';
import { SUBSCRIPTION_PLANS } from '@/lib/constants';

export default function AdminRevenuePage() {
  const users: User[] = useMemo(() => storage.get<User[]>('users') || mockUsers, []);

  const proCount = users.filter((u) => u.subscription === 'pro').length;
  const totalRevenue = proCount * SUBSCRIPTION_PLANS.pro.price;

  // Mock monthly data
  const monthlyData = [
    { month: '2025/10', pro: 15, revenue: 15 * 500 },
    { month: '2025/11', pro: 22, revenue: 22 * 500 },
    { month: '2025/12', pro: 30, revenue: 30 * 500 },
    { month: '2026/01', pro: 38, revenue: 38 * 500 },
    { month: '2026/02', pro: 47, revenue: 47 * 500 },
    { month: '2026/03', pro: proCount, revenue: totalRevenue },
  ];

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">売上管理</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassCard className="text-center">
          <div className="text-sm text-text-muted mb-1">月間総売上</div>
          <div className="text-3xl font-bold gradient-text">¥{totalRevenue.toLocaleString()}</div>
        </GlassCard>
        <GlassCard className="text-center">
          <div className="text-sm text-text-muted mb-1">Pro売上</div>
          <div className="text-2xl font-bold text-primary-light">¥{totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-text-muted mt-1">{proCount}人 × ¥500</div>
        </GlassCard>
      </div>

      {/* Revenue Chart */}
      <GlassCard>
        <h3 className="font-bold mb-6">月間売上推移</h3>
        <div className="space-y-4">
          {monthlyData.map((data, i) => (
            <div key={data.month} className="flex items-center gap-4">
              <span className="w-16 text-sm text-text-muted flex-shrink-0">{data.month}</span>
              <div className="flex-1 flex gap-1 h-8">
                <motion.div
                  className="bg-gradient-to-r from-primary to-primary-light rounded-md flex items-center justify-center text-xs text-white font-medium"
                  initial={{ width: 0 }}
                  animate={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  style={{ minWidth: data.pro > 0 ? '30px' : '0' }}
                >
                  {data.pro > 5 && 'Pro'}
                </motion.div>
              </div>
              <span className="w-20 text-sm text-right font-medium">¥{(data.revenue / 1000).toFixed(0)}K</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border-light text-xs text-text-muted">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-primary" />
            Pro
          </div>
        </div>
      </GlassCard>

      {/* Monthly Details Table */}
      <GlassCard>
        <h3 className="font-bold mb-4">月別詳細</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-muted text-xs border-b border-border-light">
                <th className="text-left py-2 font-medium">月</th>
                <th className="text-right py-2 font-medium">Pro数</th>
                <th className="text-right py-2 font-medium">売上</th>
                <th className="text-right py-2 font-medium">前月比</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((data, i) => {
                const prev = i > 0 ? monthlyData[i - 1].revenue : 0;
                const growth = prev > 0 ? Math.round(((data.revenue - prev) / prev) * 100) : 0;
                return (
                  <tr key={data.month} className="border-b border-border-light/50">
                    <td className="py-2.5">{data.month}</td>
                    <td className="py-2.5 text-right">{data.pro}</td>
                    <td className="py-2.5 text-right font-medium">¥{data.revenue.toLocaleString()}</td>
                    <td className="py-2.5 text-right">
                      {i > 0 ? (
                        <Badge variant={growth >= 0 ? 'success' : 'warning'} size="sm">
                          {growth >= 0 ? '+' : ''}{growth}%
                        </Badge>
                      ) : (
                        <span className="text-text-muted">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
