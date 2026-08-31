import React, { useState } from 'react';
import { Sparkles, BookOpen, Code, ArrowRight } from 'lucide-react';
import { KikoCharacter, PipiCharacter, TreasureChest } from './Characters';
import { sound } from '../utils/sound';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [isTravelling, setIsTravelling] = useState(false);

  const handleStart = () => {
    sound.playSuccess();
    sound.speak('Halo, Petualang Kecil! Ayo mulai petualangan bersama Kiko!');
    setIsTravelling(true);
    setTimeout(() => {
      onStart();
    }, 1200);
  };

  return (
    <div className="relative min-h-[calc(100vh-68px)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-sky-300 via-sky-100 to-amber-100 p-4 sm:p-8">
      {/* Decorative Sky Elements: Sun, Clouds, Rainbow */}
      <div className="absolute top-4 right-8 select-none pointer-events-none">
        {/* Smiling Sun */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-amber-400 border-4 border-amber-500 shadow-xl flex items-center justify-center animate-spin" style={{ animationDuration: '40s' }}>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-300 flex items-center justify-center">
            <span className="text-3xl sm:text-4xl">☀️</span>
          </div>
        </div>
      </div>

      {/* Floating Clouds */}
      <div className="absolute top-10 left-6 select-none opacity-90 pointer-events-none animate-pulse">
        <div className="bg-white px-6 py-3 rounded-full shadow-sm flex items-center gap-2 border-2 border-sky-200">
          <span className="text-3xl">☁️</span>
          <span className="font-extrabold text-sky-600 text-sm hidden sm:inline">Hari yang cerah!</span>
        </div>
      </div>
      <div className="absolute top-28 right-40 select-none opacity-80 pointer-events-none hidden md:block">
        <span className="text-5xl">☁️</span>
      </div>

      {/* Rainbow Arch Accent */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[600px] h-[160px] border-t-[24px] border-rose-400/50 rounded-t-full pointer-events-none" />
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[580px] h-[150px] border-t-[20px] border-amber-400/50 rounded-t-full pointer-events-none" />
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[560px] h-[140px] border-t-[16px] border-emerald-400/50 rounded-t-full pointer-events-none" />
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[540px] h-[130px] border-t-[12px] border-sky-400/50 rounded-t-full pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto w-full text-center flex-1 flex flex-col items-center justify-center my-4">
        {/* Title Header Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-400/90 text-amber-950 px-5 py-2 rounded-full font-black text-sm sm:text-base border-3 border-amber-500 shadow-md mb-4 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-900" />
          <span>MEDIA PEMBELAJARAN INTERAKTIF TK A</span>
          <Sparkles className="w-5 h-5 text-amber-900" />
        </div>

        {/* Big Game Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-800 tracking-tight drop-shadow-sm mb-3">
          🌟 <span className="text-amber-500">PETUALANGAN</span> <span className="text-sky-500">KIKO</span> 🌟
        </h1>
        <p className="text-lg sm:text-2xl font-bold text-slate-700 max-w-2xl mx-auto mb-6 leading-relaxed">
          “Ayo Belajar Coding dan Membaca Sambil Bertualang!”
        </p>

        {/* Adventure Introduction Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl max-w-2xl w-full mb-8 relative">
          <p className="text-xl sm:text-2xl font-extrabold text-amber-900 mb-2">
            “Halo, Petualang Kecil! 👋”
          </p>
          <p className="text-base sm:text-lg font-bold text-slate-700 mb-5">
            Kiko dan Pipi membutuhkan bantuanmu untuk menemukan <span className="text-amber-600 font-black">Harta Karun Istana</span>!
          </p>

          <p className="text-sm sm:text-base font-extrabold text-slate-600 uppercase tracking-wider mb-3">
            Kita akan menjelajahi 2 dunia ajaib:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
            <div className="flex items-center gap-3 bg-rose-50 border-3 border-rose-300 rounded-2xl p-3.5 text-left shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-rose-400 text-white flex items-center justify-center shrink-0 shadow-inner">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <span className="block font-black text-rose-800 text-base sm:text-lg">📚 DUNIA MEMBACA</span>
                <span className="text-xs sm:text-sm font-bold text-rose-600">Huruf, suku kata & kata</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-sky-50 border-3 border-sky-300 rounded-2xl p-3.5 text-left shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-sky-400 text-white flex items-center justify-center shrink-0 shadow-inner">
                <Code className="w-7 h-7" />
              </div>
              <div>
                <span className="block font-black text-sky-800 text-base sm:text-lg">💻 DUNIA CODING</span>
                <span className="text-xs sm:text-sm font-bold text-sky-600">Arah, langkah & algoritma</span>
              </div>
            </div>
          </div>
        </div>

        {/* Characters & Treasure Visual Row */}
        <div className="relative w-full max-w-2xl flex items-end justify-around my-2 px-4">
          {/* Kiko Bunny */}
          <div className={`transition-all duration-700 ${isTravelling ? 'translate-x-32 scale-110' : ''}`}>
            <KikoCharacter mood={isTravelling ? 'jumping' : 'happy'} size="lg" />
            <span className="block font-black text-sm text-sky-700 bg-white/80 px-2 py-0.5 rounded-full mt-1 border border-sky-200">
              🐰 Kiko si Kelinci
            </span>
          </div>

          {/* Golden Treasure Chest */}
          <div className="transition-all duration-500">
            <TreasureChest isOpen={false} size="lg" />
            <span className="block font-black text-sm text-amber-800 bg-white/80 px-2 py-0.5 rounded-full mt-1 border border-amber-200">
              🏆 Peti Harta Karun
            </span>
          </div>

          {/* Pipi Bird with Map */}
          <div className={`transition-all duration-700 ${isTravelling ? 'translate-x-12 scale-110' : ''}`}>
            <PipiCharacter size="md" />
            <span className="block font-black text-sm text-amber-700 bg-white/80 px-2 py-0.5 rounded-full mt-1 border border-amber-200">
              🐥 Pipi Bawa Peta
            </span>
          </div>
        </div>

        {/* Big Start Button */}
        <div className="mt-8">
          <button
            id="btn-mulai-petualangan"
            onClick={handleStart}
            disabled={isTravelling}
            className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white font-black text-xl sm:text-3xl rounded-3xl border-b-8 border-emerald-700 shadow-2xl active:translate-y-2 active:border-b-2 hover:scale-105 transition transform cursor-pointer"
          >
            <span>🟢 MULAI PETUALANGAN</span>
            <span className="text-3xl sm:text-4xl group-hover:translate-x-2 transition-transform">🚀</span>
          </button>
        </div>
      </div>

      {/* Bottom Scenery: Rolling Green Hills, Flowers & Road */}
      <div className="relative z-0 w-full mt-6">
        <div className="flex items-center justify-between text-2xl sm:text-4xl px-4 pointer-events-none">
          <span>🌸</span>
          <span>🌳</span>
          <span>🌺</span>
          <span>🌼</span>
          <span>🌲</span>
          <span>🌸</span>
        </div>
        {/* Dirt path to treasure */}
        <div className="w-full h-8 bg-amber-300 rounded-t-3xl border-t-4 border-amber-500 shadow-inner flex items-center justify-center">
          <span className="text-xs font-black text-amber-800 tracking-widest uppercase opacity-70">
            Jalan Menuju Harta Karun 🐾 🐾 🐾
          </span>
        </div>
      </div>
    </div>
  );
};
