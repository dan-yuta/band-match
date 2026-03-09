'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { GlassCard, Card, Badge, Button, Avatar } from '@/components/ui';
import { mockPosts, mockEvents, mockBands, mockUsers } from '@/data';
import { mockPracticeLogs } from '@/data/mockPractice';
import { INSTRUMENTS, COPY_SONGS } from '@/lib/constants';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

function getInstrumentLabel(id: string): string {
  return INSTRUMENTS.find((i) => i.id === id)?.label ?? id;
}

function getUserName(userId: string): string {
  const found = mockUsers.find((u) => u.id === userId);
  return found?.nickname ?? found?.name ?? 'Unknown';
}

function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' });
}

const journeySteps = [
  { id: 1, label: 'プロフィール完成', icon: '1', href: '/profile' },
  { id: 2, label: '仲間を見つける', icon: '2', href: '/matching' },
  { id: 3, label: 'コピバンを結成', icon: '3', href: '/bands' },
  { id: 4, label: 'セットリストを決める', icon: '4', href: '/bands' },
  { id: 5, label: 'ライブに出る', icon: '5', href: '/events' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  const userBands = useMemo(() => {
    if (!user) return [];
    return mockBands.filter((band) =>
      band.members.some((m) => m.userId === user.id)
    );
  }, [user]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return mockEvents
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, []);

  // Determine current journey step
  const currentStep = useMemo(() => {
    if (!user) return 1;
    const hasProfile = user.instruments?.length > 0;
    const hasBand = userBands.length > 0;
    const hasSetlist = userBands.some((b) => b.setlist && b.setlist.length > 0);
    const hasUpcomingEvent = upcomingEvents.length > 0;

    if (hasUpcomingEvent) return 5;
    if (hasSetlist) return 4;
    if (hasBand) return 3;
    if (hasProfile) return 2;
    return 1;
  }, [user, userBands, upcomingEvents]);

  if (!user) return null;

  const streak = user.practiceStreak;
  const totalHours = Math.floor((streak?.totalMinutes || 0) / 60);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome */}
      <motion.div variants={item}>
        <GlassCard gradientBorder padding="lg">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} src={user.avatar} size="lg" online={user.isOnline} />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                おかえりなさい、{user.nickname || user.name}さん!
              </h1>
              <p className="text-text-secondary mt-1">
                コピバンを組んでライブに出よう
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Journey Progress - MAIN FEATURE */}
      <motion.div variants={item}>
        <GlassCard>
          <h2 className="text-lg font-semibold text-foreground mb-1">ライブ出演への道</h2>
          <p className="text-xs text-text-muted mb-5">あなたのステップ</p>
          <div className="relative">
            {/* Progress bar background */}
            <div className="absolute top-5 left-5 right-5 h-1 bg-surface-lighter rounded-full" />
            {/* Progress bar filled */}
            <div
              className="absolute top-5 left-5 h-1 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700"
              style={{ width: `${Math.max(0, ((currentStep - 1) / (journeySteps.length - 1)) * 100)}%`, maxWidth: 'calc(100% - 40px)' }}
            />
            {/* Steps */}
            <div className="relative flex justify-between">
              {journeySteps.map((step) => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                return (
                  <Link
                    key={step.id}
                    href={step.href}
                    className="flex flex-col items-center text-center group"
                    style={{ width: '18%' }}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all ${
                        isCompleted
                          ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/30'
                          : isCurrent
                          ? 'bg-gradient-to-br from-primary to-secondary text-white ring-4 ring-primary/20 shadow-lg shadow-primary/30'
                          : 'bg-surface-lighter text-text-muted'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span className={`text-[11px] leading-tight ${
                      isCurrent ? 'text-primary-light font-semibold' : isCompleted ? 'text-foreground' : 'text-text-muted'
                    } group-hover:text-primary-light transition-colors`}>
                      {step.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-lg font-semibold text-foreground mb-4">次のアクション</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/matching" className="col-span-2 md:col-span-1">
            <Button variant="primary" fullWidth className="h-auto py-5 flex-col gap-2">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span className="text-sm font-semibold">仲間を探す</span>
            </Button>
          </Link>
          <Link href="/bands">
            <Button variant="secondary" fullWidth className="h-auto py-5 flex-col gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="text-xs">コピバンを作る</span>
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="secondary" fullWidth className="h-auto py-5 flex-col gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">イベントを探す</span>
            </Button>
          </Link>
          <Link href="/practice">
            <Button variant="ghost" fullWidth className="h-auto py-5 flex-col gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs">練習を記録</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Your Bands Section */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">マイコピバン</h2>
          <Link href="/bands">
            <Button variant="ghost" size="sm">すべて見る</Button>
          </Link>
        </div>
        {userBands.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userBands.map((band) => {
              const memberInBand = band.members.find((m) => m.userId === user.id);
              const setlistCount = band.setlist?.length || 0;
              return (
                <Card key={band.id} padding="md" hover>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {band.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {band.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-text-muted">
                          {band.members.length}/{band.maxMembers}人
                        </span>
                        {memberInBand && (
                          <Badge
                            variant={memberInBand.role === 'leader' ? 'accent' : 'primary'}
                            size="sm"
                          >
                            {memberInBand.role === 'leader' ? 'リーダー' : 'メンバー'}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-text-muted">
                          セットリスト: {setlistCount}曲
                        </span>
                        {band.isRecruiting && (
                          <Badge variant="success" size="sm">募集中</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {memberInBand && (
                        <span className="text-[10px] text-text-muted">
                          {getInstrumentLabel(memberInBand.instrument)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {band.genre.map((g) => (
                      <Badge key={g} variant="default" size="sm">{g}</Badge>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <GlassCard>
            <div className="text-center py-6">
              <p className="text-3xl mb-3">🎸</p>
              <p className="text-sm text-text-muted mb-1">まだコピバンに参加していません</p>
              <p className="text-xs text-text-muted mb-4">仲間を見つけてコピバンを結成しよう!</p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/matching">
                  <Button variant="primary" size="sm">仲間を探す</Button>
                </Link>
                <Link href="/bands">
                  <Button variant="secondary" size="sm">コピバンを探す</Button>
                </Link>
              </div>
            </div>
          </GlassCard>
        )}
      </motion.div>

      {/* Upcoming Events */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">今後のイベント</h2>
          <Link href="/events">
            <Button variant="ghost" size="sm">すべて見る</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingEvents.map((event) => (
            <GlassCard key={event.id} padding="md">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-foreground line-clamp-1">
                    {event.title}
                  </h3>
                  {event.isBeginnerFriendly && (
                    <Badge variant="success" size="sm">初心者OK</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatEventDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="line-clamp-1">{event.venue}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>

      {/* Practice Streak & Friend Activity - compact bottom section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Compact Practice Streak */}
        <motion.div variants={item}>
          <Link href="/practice">
            <GlassCard className="hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🔥</div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {streak?.currentStreak || 0}日連続
                      <span className="text-text-muted font-normal mx-2">·</span>
                      累計{totalHours}h
                    </div>
                    <div className="text-xs text-text-muted">練習ストリーク</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">練習を記録</Button>
              </div>
            </GlassCard>
          </Link>
        </motion.div>

        {/* Stats summary */}
        <motion.div variants={item}>
          <GlassCard>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">12</div>
                  <div className="text-[10px] text-text-muted">マッチ</div>
                </div>
                <div className="w-px h-8 bg-border-light" />
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">{userBands.length}</div>
                  <div className="text-[10px] text-text-muted">コピバン</div>
                </div>
                <div className="w-px h-8 bg-border-light" />
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">{upcomingEvents.length}</div>
                  <div className="text-[10px] text-text-muted">イベント</div>
                </div>
              </div>
              <Link href="/ranking">
                <Button variant="ghost" size="sm">ランキング</Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Friend Activity (compact) */}
      <motion.div variants={item}>
        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">フレンドの活動</h2>
            <Link href="/community">
              <Button variant="ghost" size="sm">もっと見る</Button>
            </Link>
          </div>
          <div className="space-y-2">
            {(() => {
              const friendIds = user.friends || [];
              const friendLogs = mockPracticeLogs
                .filter(l => friendIds.includes(l.userId))
                .slice(0, 3);
              if (friendLogs.length === 0) {
                return <p className="text-sm text-text-muted text-center py-2">フレンドの活動はまだありません</p>;
              }
              return friendLogs.map(log => {
                const friendUser = mockUsers.find(u => u.id === log.userId);
                const song = COPY_SONGS.find(s => s.id === log.songId);
                return (
                  <div key={log.id} className="flex items-center gap-2 py-1.5 border-b border-border-light last:border-0">
                    <Avatar name={friendUser?.name || ''} size="sm" online={friendUser?.isOnline} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground">
                        <span className="font-medium">{friendUser?.nickname || friendUser?.name}</span>
                        {' · '}
                        <span className="text-primary-light">{song?.title || '練習'}</span>
                        {' '}{log.minutes}分
                      </p>
                    </div>
                    <span className="text-[10px] text-text-muted">{log.date}</span>
                  </div>
                );
              });
            })()}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
