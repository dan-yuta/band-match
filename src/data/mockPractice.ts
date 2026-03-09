import { PracticeLog, AppNotification } from '@/lib/types';

export const mockPracticeLogs: PracticeLog[] = [
  // user-1 (田中) - active, 12-day streak
  { id: 'pl-001', userId: 'user-1', songId: 'song-02', minutes: 45, note: '天体観測のイントロを重点的に練習', date: '2026-03-09' },
  { id: 'pl-002', userId: 'user-1', songId: 'song-01', minutes: 30, note: 'リライトのギターソロ部分', date: '2026-03-08' },
  { id: 'pl-003', userId: 'user-1', songId: 'song-02', minutes: 40, note: '天体観測サビのコード進行', date: '2026-03-07' },
  { id: 'pl-004', userId: 'user-1', songId: 'song-16', minutes: 25, note: 'ないものねだりのイントロ', date: '2026-03-06' },
  { id: 'pl-005', userId: 'user-1', songId: 'song-05', minutes: 35, note: '前前前世のストローク練習', date: '2026-03-05' },
  { id: 'pl-006', userId: 'user-1', songId: 'song-02', minutes: 50, note: '天体観測を通しで演奏', date: '2026-03-04' },
  { id: 'pl-007', userId: 'user-1', songId: 'song-15', minutes: 20, note: '小さな恋のうたの復習', date: '2026-03-03' },

  // user-2 (鈴木) - 7-day streak
  { id: 'pl-008', userId: 'user-2', songId: 'song-07', minutes: 35, note: '青と夏のドラムパターン練習', date: '2026-03-09' },
  { id: 'pl-009', userId: 'user-2', songId: 'song-06', minutes: 40, note: 'Pretenderのフィルイン練習', date: '2026-03-08' },
  { id: 'pl-010', userId: 'user-2', songId: 'song-18', minutes: 30, note: 'そばかすのリズムパターン', date: '2026-03-07' },
  { id: 'pl-011', userId: 'user-2', songId: 'song-15', minutes: 25, note: '小さな恋のうたの基本ビート', date: '2026-03-06' },
  { id: 'pl-012', userId: 'user-2', songId: 'song-07', minutes: 45, note: '青と夏のサビ部分を重点的に', date: '2026-03-05' },

  // user-3 (山本) - 15-day streak, very active
  { id: 'pl-013', userId: 'user-3', songId: 'song-01', minutes: 60, note: 'リライトのベースラインを完璧に', date: '2026-03-09' },
  { id: 'pl-014', userId: 'user-3', songId: 'song-09', minutes: 45, note: 'Missingのベースパート練習', date: '2026-03-08' },
  { id: 'pl-015', userId: 'user-3', songId: 'song-11', minutes: 50, note: 'RIVERのベースライン', date: '2026-03-07' },
  { id: 'pl-016', userId: 'user-3', songId: 'song-10', minutes: 40, note: 'Ride on Shooting Starのベース', date: '2026-03-06' },
  { id: 'pl-017', userId: 'user-3', songId: 'song-16', minutes: 55, note: 'ないものねだりベースパート', date: '2026-03-05' },
  { id: 'pl-018', userId: 'user-3', songId: 'song-01', minutes: 45, note: 'リライト通し練習', date: '2026-03-04' },
  { id: 'pl-019', userId: 'user-3', songId: 'song-15', minutes: 30, note: '小さな恋のうたベース復習', date: '2026-03-03' },

  // user-4 (佐藤) - 5-day streak
  { id: 'pl-020', userId: 'user-4', songId: 'song-06', minutes: 30, note: 'Pretenderの高音パート練習', date: '2026-03-09' },
  { id: 'pl-021', userId: 'user-4', songId: 'song-07', minutes: 35, note: '青と夏のサビの声量調整', date: '2026-03-08' },
  { id: 'pl-022', userId: 'user-4', songId: 'song-03', minutes: 25, note: '高嶺の花子さんの練習', date: '2026-03-07' },
  { id: 'pl-023', userId: 'user-4', songId: 'song-20', minutes: 40, note: '残酷な天使のテーゼ歌い込み', date: '2026-03-06' },

  // user-5 (渡辺) - 8-day streak
  { id: 'pl-024', userId: 'user-5', songId: 'song-08', minutes: 55, note: '白日のピアノソロ練習', date: '2026-03-08' },
  { id: 'pl-025', userId: 'user-5', songId: 'song-06', minutes: 40, note: 'Pretenderのキーボードパート', date: '2026-03-07' },
  { id: 'pl-026', userId: 'user-5', songId: 'song-17', minutes: 50, note: '丸の内サディスティックのピアノ', date: '2026-03-06' },
  { id: 'pl-027', userId: 'user-5', songId: 'song-07', minutes: 35, note: '青と夏のシンセパート', date: '2026-03-05' },

  // user-6 (伊藤) - 10-day streak
  { id: 'pl-028', userId: 'user-6', songId: 'song-04', minutes: 60, note: 'Wherever you areのドラムパート完成度UP', date: '2026-03-09' },
  { id: 'pl-029', userId: 'user-6', songId: 'song-12', minutes: 45, note: 'ともにのパンクビート練習', date: '2026-03-08' },
  { id: 'pl-030', userId: 'user-6', songId: 'song-11', minutes: 50, note: 'RIVERのツインペダル練習', date: '2026-03-07' },
  { id: 'pl-031', userId: 'user-6', songId: 'song-13', minutes: 40, note: '恋しくてのドラムパターン', date: '2026-03-06' },
  { id: 'pl-032', userId: 'user-6', songId: 'song-15', minutes: 35, note: '小さな恋のうたの通し', date: '2026-03-05' },

  // user-7 (小林) - 3-day streak
  { id: 'pl-033', userId: 'user-7', songId: 'song-03', minutes: 30, note: '高嶺の花子さんの弾き語り', date: '2026-03-09' },
  { id: 'pl-034', userId: 'user-7', songId: 'song-14', minutes: 25, note: 'AM11:00のコード練習', date: '2026-03-08' },
  { id: 'pl-035', userId: 'user-7', songId: 'song-18', minutes: 35, note: 'そばかすのギターリフ', date: '2026-03-07' },

  // user-8 (中村) - 2-day streak
  { id: 'pl-036', userId: 'user-8', songId: 'song-19', minutes: 20, note: 'Don\'t say "lazy"のベースライン練習', date: '2026-03-09' },
  { id: 'pl-037', userId: 'user-8', songId: 'song-20', minutes: 25, note: '残テのベースパート', date: '2026-03-08' },

  // user-9 (高橋) - streak broken, last practice 3/5
  { id: 'pl-038', userId: 'user-9', songId: 'song-09', minutes: 90, note: 'Missingの完璧な再現を目指して', date: '2026-03-05' },
  { id: 'pl-039', userId: 'user-9', songId: 'song-01', minutes: 60, note: 'リライトのギターソロ', date: '2026-03-04' },
  { id: 'pl-040', userId: 'user-9', songId: 'song-11', minutes: 75, note: 'RIVERの通し練習', date: '2026-03-03' },

  // user-10 (加藤) - 14-day streak
  { id: 'pl-041', userId: 'user-10', songId: 'song-17', minutes: 45, note: '丸の内サディスティックのバイオリンアレンジ', date: '2026-03-09' },
  { id: 'pl-042', userId: 'user-10', songId: 'song-18', minutes: 40, note: 'そばかすのバイオリンパート', date: '2026-03-08' },
  { id: 'pl-043', userId: 'user-10', songId: 'song-08', minutes: 50, note: '白日のストリングスアレンジ', date: '2026-03-07' },
  { id: 'pl-044', userId: 'user-10', songId: 'song-10', minutes: 35, note: 'Ride on Shooting Starのバイオリン', date: '2026-03-06' },

  // user-11 (吉田) - 1-day streak
  { id: 'pl-045', userId: 'user-11', songId: 'song-08', minutes: 30, note: '白日のサックスソロ', date: '2026-03-09' },

  // user-12 (松本) - 6-day streak
  { id: 'pl-046', userId: 'user-12', songId: 'song-03', minutes: 35, note: '高嶺の花子さんのボーカル', date: '2026-03-09' },
  { id: 'pl-047', userId: 'user-12', songId: 'song-05', minutes: 30, note: '前前前世の歌い込み', date: '2026-03-08' },
  { id: 'pl-048', userId: 'user-12', songId: 'song-02', minutes: 25, note: '天体観測のボーカル練習', date: '2026-03-07' },
  { id: 'pl-049', userId: 'user-12', songId: 'song-14', minutes: 30, note: 'AM11:00の歌唱', date: '2026-03-06' },

  // admin-1 - 25-day streak, very active
  { id: 'pl-050', userId: 'admin-1', songId: 'song-01', minutes: 60, note: 'リライト完璧に弾く練習', date: '2026-03-09' },
  { id: 'pl-051', userId: 'admin-1', songId: 'song-08', minutes: 55, note: '白日のギターアレンジ', date: '2026-03-08' },
  { id: 'pl-052', userId: 'admin-1', songId: 'song-17', minutes: 50, note: '丸の内サディスティックのギター', date: '2026-03-07' },
  { id: 'pl-053', userId: 'admin-1', songId: 'song-02', minutes: 45, note: '天体観測ギター通し', date: '2026-03-06' },

  // user-16 (小川) - 9-day streak
  { id: 'pl-054', userId: 'user-16', songId: 'song-14', minutes: 40, note: 'AM11:00のホーンアレンジ', date: '2026-03-09' },
  { id: 'pl-055', userId: 'user-16', songId: 'song-15', minutes: 35, note: '小さな恋のうたのトランペット', date: '2026-03-08' },
  { id: 'pl-056', userId: 'user-16', songId: 'song-13', minutes: 30, note: '恋しくてのホーンパート', date: '2026-03-07' },

  // user-17 (林) - 11-day streak
  { id: 'pl-057', userId: 'user-17', songId: 'song-20', minutes: 45, note: '残酷な天使のテーゼのキーボード', date: '2026-03-09' },
  { id: 'pl-058', userId: 'user-17', songId: 'song-19', minutes: 40, note: 'Don\'t say "lazy"のキーボード', date: '2026-03-08' },
  { id: 'pl-059', userId: 'user-17', songId: 'song-05', minutes: 35, note: '前前前世のピアノパート', date: '2026-03-07' },
  { id: 'pl-060', userId: 'user-17', songId: 'song-02', minutes: 30, note: '天体観測のキーボードアレンジ', date: '2026-03-06' },

  // user-15 (森田) - 1-day streak, newer user
  { id: 'pl-061', userId: 'user-15', songId: 'song-15', minutes: 15, note: '小さな恋のうたのパワーコード', date: '2026-03-09' },

  // Older practice logs (various users)
  { id: 'pl-062', userId: 'user-1', songId: 'song-02', minutes: 30, note: '天体観測のAメロ', date: '2026-02-28' },
  { id: 'pl-063', userId: 'user-3', songId: 'song-01', minutes: 45, note: 'リライトのベースライン反復', date: '2026-02-27' },
  { id: 'pl-064', userId: 'user-6', songId: 'song-04', minutes: 55, note: 'Wherever you areのドラム通し', date: '2026-02-26' },
  { id: 'pl-065', userId: 'user-10', songId: 'song-17', minutes: 40, note: '丸の内サディスティック通し', date: '2026-02-25' },
  { id: 'pl-066', userId: 'user-4', songId: 'song-06', minutes: 30, note: 'Pretenderのブレス練習', date: '2026-02-24' },
  { id: 'pl-067', userId: 'user-5', songId: 'song-08', minutes: 50, note: '白日のイントロ部分', date: '2026-02-23' },
  { id: 'pl-068', userId: 'user-9', songId: 'song-09', minutes: 80, note: 'Missingギターソロ追い込み', date: '2026-02-22' },
  { id: 'pl-069', userId: 'user-2', songId: 'song-07', minutes: 25, note: '青と夏の基本ビート', date: '2026-02-21' },
  { id: 'pl-070', userId: 'user-12', songId: 'song-03', minutes: 20, note: '高嶺の花子さんの音程確認', date: '2026-02-20' },
  { id: 'pl-071', userId: 'user-17', songId: 'song-20', minutes: 35, note: '残テのキーボードソロ', date: '2026-02-19' },
  { id: 'pl-072', userId: 'user-8', songId: 'song-19', minutes: 15, note: 'Don\'t say "lazy"のベースイントロ', date: '2026-02-18' },
  { id: 'pl-073', userId: 'user-16', songId: 'song-14', minutes: 45, note: 'AM11:00トランペットソロ', date: '2026-02-17' },
  { id: 'pl-074', userId: 'user-7', songId: 'song-03', minutes: 30, note: '高嶺の花子さんのアルペジオ', date: '2026-02-16' },
  { id: 'pl-075', userId: 'admin-1', songId: 'song-01', minutes: 65, note: 'リライト全パート確認', date: '2026-02-15' },
  { id: 'pl-076', userId: 'user-13', songId: 'song-05', minutes: 40, note: '前前前世のDJアレンジ', date: '2026-02-28' },
  { id: 'pl-077', userId: 'user-14', songId: 'song-06', minutes: 50, note: 'Pretenderのピアノパート', date: '2026-03-02' },
  { id: 'pl-078', userId: 'user-11', songId: 'song-06', minutes: 35, note: 'Pretenderのサックスアレンジ', date: '2026-03-01' },
  { id: 'pl-079', userId: 'user-1', songId: 'song-01', minutes: 25, note: 'リライトのイントロリフ', date: '2026-02-14' },
  { id: 'pl-080', userId: 'user-3', songId: 'song-11', minutes: 40, note: 'RIVERのベースライン速弾き', date: '2026-02-13' },
  { id: 'pl-081', userId: 'user-6', songId: 'song-12', minutes: 35, note: 'ともにのドラムフィル', date: '2026-02-12' },
  { id: 'pl-082', userId: 'user-10', songId: 'song-18', minutes: 30, note: 'そばかすのバイオリン', date: '2026-02-11' },
  { id: 'pl-083', userId: 'user-9', songId: 'song-10', minutes: 70, note: 'Ride on Shooting Starギター通し', date: '2026-02-10' },
  { id: 'pl-084', userId: 'user-5', songId: 'song-06', minutes: 45, note: 'Pretenderのキーボード完コピ', date: '2026-02-09' },
  { id: 'pl-085', userId: 'user-4', songId: 'song-14', minutes: 20, note: 'AM11:00のボーカル', date: '2026-02-08' },
];

export const mockNotifications: AppNotification[] = [
  { id: 'notif-01', userId: 'user-1', type: 'friend_practiced', title: 'フレンドが練習しました', message: '鈴木さんが「青と夏」を35分練習しました', read: false, createdAt: '2026-03-09T18:30:00' },
  { id: 'notif-02', userId: 'user-1', type: 'streak_warning', title: 'ストリーク危機！', message: 'あと3時間でストリークが途切れます！', read: false, createdAt: '2026-03-09T21:00:00' },
  { id: 'notif-03', userId: 'user-1', type: 'rank_change', title: 'ランキング変動', message: '山本さんに抜かれました！現在3位', read: true, createdAt: '2026-03-08T12:00:00' },
  { id: 'notif-04', userId: 'user-1', type: 'milestone', title: 'おめでとう！🎉', message: '累計練習時間が70時間を突破しました！', read: true, createdAt: '2026-03-07T20:00:00' },
  { id: 'notif-05', userId: 'user-1', type: 'practice_reminder', title: '練習の時間です！', message: '今日の練習まだだよ！12日連続ストリーク継続中🔥', read: true, createdAt: '2026-03-06T18:00:00' },
  { id: 'notif-06', userId: 'user-2', type: 'friend_practiced', title: 'フレンドが練習しました', message: '田中さんが「天体観測」を45分練習しました', read: false, createdAt: '2026-03-09T17:00:00' },
  { id: 'notif-07', userId: 'user-2', type: 'milestone', title: 'おめでとう！🎉', message: '7日連続ストリーク達成！バッジを獲得しました', read: false, createdAt: '2026-03-09T08:30:00' },
  { id: 'notif-08', userId: 'user-3', type: 'rank_change', title: 'ランキングUP！', message: '週間ランキングで2位に浮上しました！', read: false, createdAt: '2026-03-09T10:00:00' },
  { id: 'notif-09', userId: 'user-3', type: 'friend_practiced', title: 'フレンドが練習しました', message: '伊藤さんが「Wherever you are」を60分練習しました', read: true, createdAt: '2026-03-09T15:00:00' },
  { id: 'notif-10', userId: 'user-9', type: 'slacking', title: '最近練習してない？', message: '4日間練習していません。5分だけでもやろう！', read: false, createdAt: '2026-03-09T18:00:00' },
  { id: 'notif-11', userId: 'user-9', type: 'streak_warning', title: 'ストリークが途切れました', message: '30日連続のストリークが途切れました…また始めよう！', read: true, createdAt: '2026-03-06T23:59:00' },
  { id: 'notif-12', userId: 'user-13', type: 'slacking', title: '最近練習してない？', message: '8日間練習していません。5分だけでもやろう！', read: false, createdAt: '2026-03-09T12:00:00' },
  { id: 'notif-13', userId: 'user-14', type: 'slacking', title: '最近練習してない？', message: '5日間練習していません。5分だけでもやろう！', read: false, createdAt: '2026-03-09T12:00:00' },
  { id: 'notif-14', userId: 'admin-1', type: 'milestone', title: 'おめでとう！🎉', message: '25日連続ストリーク達成！すごい！', read: true, createdAt: '2026-03-09T10:00:00' },
  { id: 'notif-15', userId: 'user-10', type: 'friend_practiced', title: 'フレンドが練習しました', message: '管理者さんが「リライト」を60分練習しました', read: false, createdAt: '2026-03-09T16:00:00' },
  { id: 'notif-16', userId: 'user-17', type: 'band_reminder', title: 'バンド練習リマインダー', message: '今週土曜日にバンド練習があります。準備しよう！', read: false, createdAt: '2026-03-09T09:00:00' },
];
