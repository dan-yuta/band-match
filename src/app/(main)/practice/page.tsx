'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { GlassCard, Button, Badge } from '@/components/ui';
import { COPY_SONGS, BADGES } from '@/lib/constants';
import { mockPracticeLogs } from '@/data/mockPractice';

export default function PracticePage() {
  const { user } = useAuth();
  const [selectedSong, setSelectedSong] = useState('');
  const [minutes, setMinutes] = useState(30);
  const [note, setNote] = useState('');

  // Get user's practice logs
  const userLogs = mockPracticeLogs.filter(l => l.userId === user?.id);
  const recentLogs = userLogs.slice(0, 10);

  // Practice stats
  const streak = user?.practiceStreak;
  const totalHours = Math.floor((streak?.totalMinutes || 0) / 60);
  const totalMins = (streak?.totalMinutes || 0) % 60;

  // Songs the user is working on
  const userSongs = [...(user?.wantToPlaySongs || []), ...(user?.canPlaySongs || [])];
  const songOptions = COPY_SONGS.filter(s => userSongs.includes(s.id));
  const allSongs = COPY_SONGS;

  // Weekly data (mock: last 7 days)
  const weekDays = ['月', '火', '水', '木', '金', '土', '日'];

  const handleLogPractice = () => {
    // Mock: just show it was logged
    alert(`練習を記録しました！\n曲: ${COPY_SONGS.find(s => s.id === selectedSong)?.title || '自由練習'}\n時間: ${minutes}分`);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Live Goal Banner */}
      <Link href="/bands">
        <GlassCard className="border-primary/30 hover:border-primary/50 transition-all cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎤</span>
              <div>
                <p className="text-sm font-semibold text-foreground">練習はライブに出るための準備!</p>
                <p className="text-xs text-text-muted">バンドのセットリストを確認して、本番に備えよう</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </GlassCard>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold gradient-text">練習トラッカー</h1>
        <p className="text-text-muted text-sm mt-1">毎日の練習を記録して、ライブ本番に備えよう</p>
      </div>

      {/* Streak & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard>
          <div className="text-center">
            <div className="text-4xl font-bold">{streak?.currentStreak || 0}</div>
            <div className="text-sm text-text-muted mt-1">🔥 連続ストリーク</div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="text-center">
            <div className="text-4xl font-bold">{totalHours}<span className="text-lg text-text-muted">h</span>{totalMins}<span className="text-lg text-text-muted">m</span></div>
            <div className="text-sm text-text-muted mt-1">⏱ 累計練習時間</div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="text-center">
            <div className="text-4xl font-bold">{streak?.longestStreak || 0}</div>
            <div className="text-sm text-text-muted mt-1">🏆 最長ストリーク</div>
          </div>
        </GlassCard>
      </div>

      {/* Weekly Progress */}
      <GlassCard>
        <h2 className="text-lg font-bold mb-4">今週の練習</h2>
        <div className="flex justify-between items-end gap-2">
          {weekDays.map((day, i) => {
            const practiced = i < 5; // mock: practiced Mon-Fri
            const mins = practiced ? 20 + Math.floor(Math.random() * 40) : 0;
            return (
              <div key={day} className="flex-1 text-center">
                <div className="relative h-24 bg-surface-light rounded-lg overflow-hidden mb-2">
                  <motion.div
                    className={`absolute bottom-0 w-full rounded-lg ${practiced ? 'bg-gradient-to-t from-primary to-primary-light' : 'bg-surface-lighter'}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${practiced ? Math.max(20, mins) : 5}%` }}
                    transition={{ delay: i * 0.1 }}
                  />
                </div>
                <div className="text-xs text-text-muted">{day}</div>
                {practiced && <div className="text-xs text-primary-light">{mins}分</div>}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-text-muted">週間目標: {streak?.weeklyGoalDays || 3}日 × {streak?.weeklyGoalMinutes || 30}分</span>
          <Badge variant="primary">5 / {streak?.weeklyGoalDays || 3}日達成</Badge>
        </div>
      </GlassCard>

      {/* Log Practice */}
      <GlassCard>
        <h2 className="text-lg font-bold mb-4">練習を記録</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-muted mb-2">曲を選択</label>
            <select
              value={selectedSong}
              onChange={e => setSelectedSong(e.target.value)}
              className="w-full bg-surface-light border border-border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">自由練習（曲なし）</option>
              {songOptions.length > 0 && (
                <optgroup label="あなたの曲">
                  {songOptions.map(s => (
                    <option key={s.id} value={s.id}>{s.title} - {s.artist}</option>
                  ))}
                </optgroup>
              )}
              <optgroup label="すべての曲">
                {allSongs.filter(s => !userSongs.includes(s.id)).map(s => (
                  <option key={s.id} value={s.id}>{s.title} - {s.artist}</option>
                ))}
              </optgroup>
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-2">練習時間（分）</label>
            <div className="flex items-center gap-3">
              {[15, 30, 45, 60, 90].map(m => (
                <button
                  key={m}
                  onClick={() => setMinutes(m)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    minutes === m ? 'bg-primary text-white' : 'bg-surface-light text-text-muted hover:bg-surface-lighter'
                  }`}
                >
                  {m}分
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-2">メモ（任意）</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="イントロ部分を重点的に練習した"
              className="w-full bg-surface-light border border-border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <Button variant="primary" className="w-full" onClick={handleLogPractice}>
            練習を記録する
          </Button>
        </div>
      </GlassCard>

      {/* Badges */}
      <GlassCard>
        <h2 className="text-lg font-bold mb-4">獲得バッジ</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {BADGES.map(badge => {
            const earned = user?.badges?.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`text-center p-3 rounded-xl border ${
                  earned ? 'border-primary bg-surface-light' : 'border-border opacity-30'
                }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="text-xs font-medium">{badge.name}</div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Recent Practice History */}
      <GlassCard>
        <h2 className="text-lg font-bold mb-4">最近の練習</h2>
        <div className="space-y-3">
          {recentLogs.length > 0 ? recentLogs.map(log => {
            const song = COPY_SONGS.find(s => s.id === log.songId);
            return (
              <div key={log.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <div className="text-sm font-medium">{song?.title || '自由練習'}</div>
                  <div className="text-xs text-text-muted">{song?.artist} · {log.note}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-primary-light">{log.minutes}分</div>
                  <div className="text-xs text-text-muted">{log.date}</div>
                </div>
              </div>
            );
          }) : (
            <p className="text-sm text-text-muted text-center py-4">まだ練習記録がありません</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
