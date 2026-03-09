'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { GlassCard, Avatar, Badge } from '@/components/ui';
import { storage } from '@/lib/storage';
import { mockUsers } from '@/data/mockUsers';
import { INSTRUMENTS } from '@/lib/constants';
import { User } from '@/lib/types';

type RankingTab = 'friends' | 'all' | 'instrument';

export default function RankingPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<RankingTab>('friends');
  const [selectedInstrument, setSelectedInstrument] = useState('');

  const allUsers = storage.get<User[]>('users') || mockUsers;

  // Friend ranking
  const friendIds = user?.friends || [];
  const friendUsers = allUsers.filter(u => friendIds.includes(u.id) || u.id === user?.id);

  // Sort by weekly practice (use totalMinutes as proxy)
  const sortByPractice = (users: User[]) =>
    [...users].sort((a, b) => (b.practiceStreak?.totalMinutes || 0) - (a.practiceStreak?.totalMinutes || 0));

  const getRankedUsers = () => {
    switch (tab) {
      case 'friends':
        return sortByPractice(friendUsers);
      case 'all':
        return sortByPractice(allUsers.filter(u => !u.isAdmin));
      case 'instrument':
        return sortByPractice(
          allUsers.filter(u => !u.isAdmin && u.instruments.some(i => i.instrument === selectedInstrument))
        );
      default:
        return [];
    }
  };

  const rankedUsers = getRankedUsers();

  const tabs: { id: RankingTab; label: string }[] = [
    { id: 'friends', label: 'フレンド' },
    { id: 'all', label: '全体' },
    { id: 'instrument', label: '楽器別' },
  ];

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">ランキング</h1>
        <p className="text-text-muted text-sm mt-1">練習を続けてライブに備えよう</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-primary text-white' : 'bg-surface-light text-text-muted hover:bg-surface-lighter'
            }`}
          >
            {t.label}
            {t.id === 'all' && user?.subscription !== 'pro' && (
              <span className="ml-1 text-xs opacity-60">Pro</span>
            )}
          </button>
        ))}
      </div>

      {/* Instrument filter */}
      {tab === 'instrument' && (
        <select
          value={selectedInstrument}
          onChange={e => setSelectedInstrument(e.target.value)}
          className="w-full bg-surface-light border border-border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">楽器を選択</option>
          {INSTRUMENTS.map(i => (
            <option key={i.id} value={i.id}>{i.icon} {i.label}</option>
          ))}
        </select>
      )}

      {/* Pro restriction for 'all' tab */}
      {tab === 'all' && user?.subscription !== 'pro' && (
        <div className="bg-surface border border-primary/20 rounded-lg p-4 text-center">
          <p className="text-sm text-text-muted mb-2">全体ランキングはProプランで利用できます</p>
          <Badge variant="accent">Pro</Badge>
        </div>
      )}

      {/* Ranking list */}
      {!(tab === 'all' && user?.subscription !== 'pro') && (
        <div className="space-y-2">
          {rankedUsers.map((u, index) => {
            const isMe = u.id === user?.id;
            const totalHours = Math.floor((u.practiceStreak?.totalMinutes || 0) / 60);
            const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`;
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className={isMe ? 'border-primary' : ''}>
                  <div className="flex items-center gap-4">
                    <div className="text-2xl w-10 text-center font-bold">{rankIcon}</div>
                    <Avatar name={u.name} size="sm" online={u.isOnline} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm flex items-center gap-2">
                        {u.name}
                        {isMe && <Badge variant="primary" size="sm">あなた</Badge>}
                        {(u.practiceStreak?.currentStreak || 0) >= 7 && <span>🔥</span>}
                      </div>
                      <div className="text-xs text-text-muted">
                        {u.instruments[0]?.instrument && INSTRUMENTS.find(i => i.id === u.instruments[0].instrument)?.label}
                        {' · '}ストリーク {u.practiceStreak?.currentStreak || 0}日
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-light">{totalHours}h</div>
                      <div className="text-xs text-text-muted">累計</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
