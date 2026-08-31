import React, { useState } from 'react';
import { ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { KikoCharacter, PipiCharacter } from './Characters';
import { sound } from '../utils/sound';

interface IdentityScreenProps {
  initialName: string;
  initialGrade: string;
  initialAvatar: string;
  onSubmit: (name: string, grade: string, avatar: string) => void;
}

const PRESET_AVATARS = [
  { id: 'girl1', emoji: '👧', label: 'Anak Perempuan' },
  { id: 'boy1', emoji: '👦', label: 'Anak Laki-laki' },
  { id: 'bunny', emoji: '🐰', label: 'Teman Kelinci' },
  { id: 'bear', emoji: '🐻', label: 'Teman Beruang' },
  { id: 'cat', emoji: '🐱', label: 'Teman Kucing' },
];

const PRESET_NAMES = ['Alya', 'Budi', 'Siti', 'Kenzo', 'Rian', 'Nisa'];

export const IdentityScreen: React.FC<IdentityScreenProps> = ({
  initialName,
  initialGrade = 'TK A',
  initialAvatar = '👧',
  onSubmit,
}) => {
  const [name, setName] = useState(initialName || '');
  const [avatar, setAvatar] = useState(initialAvatar || '👧');
  const [grade] = useState('TK A');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Petualang Cilik';
    sound.playSuccess();
    sound.speak(`Halo ${finalName}! Selamat datang di TK A. Ayo buka peta petualangan!`);
    onSubmit(finalName, grade, avatar);
  };

  const handleSelectPreset = (presetName: string) => {
    sound.playPop();
    setName(presetName);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-gradient-to-b from-amber-100 via-yellow-50 to-emerald-100 p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white/95 rounded-3xl border-4 border-amber-300 shadow-2xl p-6 sm:p-8">
        {/* Top Header with Characters */}
        <div className="flex items-center justify-between mb-4">
          <KikoCharacter mood="waving" size="sm" />
          <div className="text-center flex-1 px-2">
            <span className="inline-block bg-amber-200 text-amber-900 px-4 py-1 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wide border border-amber-300">
              KENALAN DULU YUK!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
              Sebelum berpetualang, yuk kenalan! 🌟
            </h2>
          </div>
          <PipiCharacter size="sm" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Choice */}
          <div>
            <label className="block text-sm sm:text-base font-extrabold text-slate-700 mb-2">
              Pilih Karaktermu:
            </label>
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              {PRESET_AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  id={`btn-avatar-${av.id}`}
                  onClick={() => {
                    sound.playPop();
                    setAvatar(av.emoji);
                  }}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition border-4 ${
                    avatar === av.emoji
                      ? 'bg-amber-300 border-amber-500 scale-110 shadow-md'
                      : 'bg-slate-100 border-slate-200 hover:bg-amber-100'
                  }`}
                  title={av.label}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="kid-name-input" className="block text-base sm:text-lg font-black text-slate-800 mb-2">
              {avatar} Siapa Namamu?
            </label>
            <input
              id="kid-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ketik nama panggilanmu..."
              maxLength={25}
              className="w-full px-5 py-4 text-xl sm:text-2xl font-black text-slate-800 bg-amber-50/70 border-4 border-amber-300 rounded-2xl focus:outline-none focus:border-amber-500 focus:bg-white shadow-inner transition text-center"
              autoFocus
            />

            {/* Quick Name Presets for little hands */}
            <div className="mt-3">
              <span className="text-xs font-bold text-slate-500 block mb-1.5 text-center">
                Atau pilih contoh nama cepat:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {PRESET_NAMES.map((pn) => (
                  <button
                    key={pn}
                    type="button"
                    onClick={() => handleSelectPreset(pn)}
                    className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border border-yellow-300 rounded-xl font-bold text-sm transition active:scale-95"
                  >
                    {pn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grade Badge Field */}
          <div className="flex items-center justify-between bg-emerald-50 border-3 border-emerald-300 rounded-2xl p-3.5">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎒</span>
              <div>
                <span className="text-xs font-bold text-emerald-600 block">Kelas Petualang:</span>
                <span className="text-lg font-black text-emerald-800">{grade} (Usia 4–5 Tahun)</span>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-200 text-emerald-900 text-xs font-black rounded-full border border-emerald-400">
              SIAP BELAJAR
            </span>
          </div>

          {/* Big Continue Button */}
          <button
            type="submit"
            id="btn-lanjutkan-identitas"
            className="w-full py-4 sm:py-5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xl sm:text-2xl rounded-3xl border-b-6 border-emerald-800 shadow-xl active:translate-y-2 active:border-b-2 transition flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>LANJUTKAN</span>
            <ArrowRight className="w-7 h-7 animate-pulse" />
          </button>
        </form>
      </div>
    </div>
  );
};
