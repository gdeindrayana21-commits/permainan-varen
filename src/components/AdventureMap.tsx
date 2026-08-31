import React from 'react';
import { Lock, CheckCircle, Star, Sparkles, Play } from 'lucide-react';
import { KikoCharacter, PipiCharacter, TreasureChest } from './Characters';
import { sound } from '../utils/sound';

interface AdventureMapProps {
  unlockedLevel: number;
  completedLevels: number[];
  onSelectLevel: (levelId: number) => void;
  onOpenCertificate: () => void;
}

export const MAP_LEVELS = [
  {
    id: 1,
    title: 'HUTAN HURUF',
    subtitle: 'Mengenal Huruf & Bunyi',
    category: 'Membaca',
    themeColor: 'from-emerald-400 to-green-500',
    borderColor: 'border-emerald-600',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: '🌳',
    description: 'Bantu Kiko mencari huruf awal dari buah dan benda ceria!',
  },
  {
    id: 2,
    title: 'TAMAN MEMBACA',
    subtitle: 'Suku Kata & Membaca Kata',
    category: 'Membaca',
    themeColor: 'from-pink-400 to-rose-500',
    borderColor: 'border-rose-600',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
    icon: '📖',
    description: 'Gabungkan suku kata BO-LA, BU-KU bersama bunga-bunga cantik!',
  },
  {
    id: 3,
    title: 'SUNGAI CODING',
    subtitle: 'Arah & Urutan Perintah',
    category: 'Coding',
    themeColor: 'from-sky-400 to-blue-500',
    borderColor: 'border-blue-600',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    icon: '💻',
    description: 'Beri perintah arah jalan Kiko menuju bendera finish!',
  },
  {
    id: 4,
    title: 'GUA MISTERI',
    subtitle: 'Tantangan Huruf & Labirin',
    category: 'Membaca + Coding',
    themeColor: 'from-purple-400 to-indigo-500',
    borderColor: 'border-indigo-600',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    icon: '🕵️',
    description: 'Pilih pintu berhuruf rahasia dan ambil kunci emas di gua kristal!',
  },
  {
    id: 5,
    title: 'ISTANA HARTA KARUN',
    subtitle: 'Buka Peti Harta Karun!',
    category: 'Grand Finale',
    themeColor: 'from-amber-400 to-yellow-500',
    borderColor: 'border-amber-600',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: '🏰',
    description: 'Tiga tantangan emas untuk membuka peti harta karun istana!',
  },
];

export const AdventureMap: React.FC<AdventureMapProps> = ({
  unlockedLevel,
  completedLevels,
  onSelectLevel,
  onOpenCertificate,
}) => {
  const allCompleted = completedLevels.length >= 5;

  return (
    <div className="min-h-[calc(100vh-68px)] bg-gradient-to-b from-sky-200 via-amber-100 to-emerald-200 p-4 sm:p-8 flex flex-col items-center">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 bg-white/90 px-5 py-2 rounded-full border-3 border-amber-300 shadow-sm font-black text-amber-800 mb-2">
          <span>🗺️ PETA PETUALANGAN KIKO</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-800">
          Pilih Tempat Petualanganmu!
        </h2>
        <p className="text-base sm:text-lg font-bold text-slate-600 mt-1">
          Selesaikan setiap level untuk membuka jalan menuju Istana Harta Karun 🏆
        </p>
      </div>

      {/* Grand Completion Banner if all levels finished */}
      {allCompleted && (
        <div className="w-full max-w-3xl mb-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-4 border-amber-500 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏆</span>
            <div>
              <h3 className="font-black text-xl text-amber-950">SEMUA LEVEL BERHASIL DISELESAIKAN!</h3>
              <p className="font-bold text-sm text-amber-900">Kamu telah menjadi Petualang Super sejati!</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playSuccess();
              onOpenCertificate();
            }}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl border-b-4 border-emerald-700 active:translate-y-1 active:border-b-0 transition text-base shadow-md cursor-pointer whitespace-nowrap"
          >
            Lihat Sertifikatmu 🎓
          </button>
        </div>
      )}

      {/* Adventure Path Cards Grid */}
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative">
        {MAP_LEVELS.map((level) => {
          const isUnlocked = level.id <= unlockedLevel;
          const isCompleted = completedLevels.includes(level.id);
          const isCurrentTarget = level.id === unlockedLevel && !isCompleted;

          return (
            <div
              key={level.id}
              id={`map-level-card-${level.id}`}
              className={`relative rounded-3xl p-5 border-4 transition-all duration-300 shadow-lg flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white hover:-translate-y-1.5 cursor-pointer border-amber-300 hover:border-amber-400'
                  : 'bg-slate-100/80 border-slate-300 opacity-75 cursor-not-allowed'
              }`}
              onClick={() => {
                if (isUnlocked) {
                  sound.playPop();
                  onSelectLevel(level.id);
                } else {
                  sound.playTryAgain();
                  sound.speak('Level ini masih terkunci. Selesaikan level sebelumnya dulu ya!');
                }
              }}
            >
              {/* Top Row: Icon & Status */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${level.badgeColor}`}>
                    LEVEL {level.id} • {level.category}
                  </span>

                  {isCompleted ? (
                    <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-300 text-xs font-black">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Selesai!</span>
                    </div>
                  ) : isUnlocked ? (
                    <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full border border-amber-300 text-xs font-black animate-pulse">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Buka!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full border border-slate-300 text-xs font-black">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Terkunci</span>
                    </div>
                  )}
                </div>

                {/* Level Big Icon & Title */}
                <div className="flex items-center gap-3.5 mb-2">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner border-2 shrink-0 ${
                      isUnlocked
                        ? `bg-gradient-to-br ${level.themeColor} text-white ${level.borderColor}`
                        : 'bg-slate-200 border-slate-300 text-slate-400'
                    }`}
                  >
                    {level.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-800 leading-tight">
                      {level.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-slate-600">
                      {level.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-medium text-slate-600 mb-4 line-clamp-2">
                  {level.description}
                </p>
              </div>

              {/* Bottom Action / Indicator */}
              <div className="pt-2 border-t-2 border-slate-100 flex items-center justify-between">
                {isCurrentTarget && (
                  <div className="flex items-center gap-2">
                    <KikoCharacter mood="waving" size="sm" />
                    <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Kiko di sini!
                    </span>
                  </div>
                )}

                {isUnlocked ? (
                  <button
                    type="button"
                    className={`ml-auto px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-1.5 shadow-sm transition border-b-4 active:translate-y-1 active:border-b-0 cursor-pointer ${
                      isCompleted
                        ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 border-amber-600'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isCompleted ? 'Main Ulang' : 'Mulai Main!'}</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1 ml-auto">
                    <Lock className="w-3.5 h-3.5" /> Selesaikan level sebelumnya
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Little Footer with Companions */}
      <div className="mt-8 flex items-center gap-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-3xl border-3 border-amber-200 shadow-sm">
        <PipiCharacter size="sm" />
        <p className="text-sm font-black text-slate-700">
          “Pipi siap membantumu membaca peta! Pilih level yang terbuka ya!” 🐥✨
        </p>
      </div>
    </div>
  );
};
