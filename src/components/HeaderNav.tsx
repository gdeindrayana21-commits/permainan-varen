import React from 'react';
import { Home, Map, Volume2, VolumeX, Award, GraduationCap } from 'lucide-react';
import { ScreenType, PlayerProfile } from '../types';
import { sound } from '../utils/sound';

interface HeaderNavProps {
  currentScreen: ScreenType;
  currentLevelId?: number;
  profile: PlayerProfile;
  onNavigate: (screen: ScreenType, levelId?: number) => void;
  onToggleSound: () => void;
  onOpenTeacherArea: () => void;
  onOpenCertificate: () => void;
}

export const getRewardTitle = (stars: number): { title: string; badge: string; color: string } => {
  if (stars >= 16) {
    return { title: 'MASTER PETUALANG', badge: '🏆', color: 'bg-amber-400 text-amber-950 border-amber-500' };
  }
  if (stars >= 11) {
    return { title: 'Petualang Super', badge: '⭐', color: 'bg-purple-400 text-purple-950 border-purple-500' };
  }
  if (stars >= 6) {
    return { title: 'Petualang Pintar', badge: '🌟', color: 'bg-blue-400 text-blue-950 border-blue-500' };
  }
  return { title: 'Petualang Hebat', badge: '🌱', color: 'bg-emerald-400 text-emerald-950 border-emerald-500' };
};

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentScreen,
  currentLevelId,
  profile,
  onNavigate,
  onToggleSound,
  onOpenTeacherArea,
  onOpenCertificate,
}) => {
  const reward = getRewardTitle(profile.stars);
  const completedCount = profile.completedLevels.length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-4 border-amber-200 px-3 py-2.5 sm:px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Navigation Buttons */}
        <div className="flex items-center gap-2">
          {currentScreen !== 'welcome' && (
            <button
              id="btn-nav-home"
              onClick={() => {
                sound.playPop();
                onNavigate('welcome');
              }}
              title="Beranda Utama"
              className="flex items-center gap-1 px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl border-b-4 border-rose-700 active:translate-y-1 active:border-b-0 transition text-sm sm:text-base shadow-sm"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Beranda</span>
            </button>
          )}

          {currentScreen !== 'welcome' && currentScreen !== 'identity' && currentScreen !== 'map' && (
            <button
              id="btn-nav-map"
              onClick={() => {
                sound.playPop();
                onNavigate('map');
              }}
              title="Peta Petualangan"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-2xl border-b-4 border-amber-600 active:translate-y-1 active:border-b-0 transition text-sm sm:text-base shadow-sm"
            >
              <Map className="w-5 h-5 text-amber-900" />
              <span>Peta</span>
            </button>
          )}

          {/* Level Progress Indicator */}
          {currentScreen === 'level' && currentLevelId && (
            <div className="hidden md:flex items-center gap-2 bg-emerald-100 border-2 border-emerald-300 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-black text-emerald-800">
              <span>PETUALANGAN: {completedCount} / 5</span>
              <div className="w-20 bg-emerald-200 rounded-full h-3.5 overflow-hidden border border-emerald-400">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${(completedCount / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Center: Kid Name / Status (if known) */}
        {profile.name && (
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xl">👧</span>
            <span className="font-extrabold text-slate-700 text-base">
              Halo, <span className="text-amber-600 underline decoration-wavy">{profile.name}</span> ({profile.grade})
            </span>
          </div>
        )}

        {/* Right: Stars, Sound, Teacher Area & Certificate */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Star Counter Pill */}
          <div
            id="nav-stars-display"
            className="flex items-center gap-1.5 bg-amber-50 border-2 border-amber-400 px-3 py-1.5 rounded-2xl shadow-inner font-extrabold text-amber-900 text-sm sm:text-base cursor-default"
            title={`Bintang Terkumpul: ${profile.stars} (${reward.title})`}
          >
            <span className="text-xl animate-pulse">⭐</span>
            <span className="text-amber-600 text-lg font-black">{profile.stars}</span>
            <span className={`hidden sm:inline-block text-xs px-2 py-0.5 rounded-full font-bold border ${reward.color}`}>
              {reward.badge} {reward.title}
            </span>
          </div>

          {/* Sound Toggle Button */}
          <button
            id="btn-nav-sound-toggle"
            onClick={() => {
              onToggleSound();
              sound.playPop();
            }}
            title={profile.soundEnabled ? 'Suara Aktif (Klik untuk matikan)' : 'Suara Mati (Klik untuk nyalakan)'}
            className={`p-2 rounded-2xl font-bold transition border-b-4 active:translate-y-1 active:border-b-0 shadow-sm ${
              profile.soundEnabled
                ? 'bg-sky-400 hover:bg-sky-500 text-white border-sky-600'
                : 'bg-slate-300 hover:bg-slate-400 text-slate-700 border-slate-500'
            }`}
          >
            {profile.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Certificate shortcut if finished or has stars */}
          {completedCount >= 5 && (
            <button
              id="btn-nav-certificate"
              onClick={() => {
                sound.playPop();
                onOpenCertificate();
              }}
              title="Lihat Sertifikat Kelulusan"
              className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-amber-950 font-black rounded-2xl border-b-4 border-amber-600 active:translate-y-1 active:border-b-0 transition text-sm shadow-sm"
            >
              <Award className="w-5 h-5 text-amber-900" />
              <span className="hidden md:inline">Sertifikat</span>
            </button>
          )}

          {/* Teacher / Parent Portal */}
          <button
            id="btn-nav-teacher"
            onClick={() => {
              sound.playPop();
              onOpenTeacherArea();
            }}
            title="Area Guru & Orang Tua"
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-2xl border-b-4 border-purple-700 active:translate-y-1 active:border-b-0 transition text-sm shadow-sm"
          >
            <GraduationCap className="w-5 h-5" />
            <span className="hidden sm:inline">Area Guru</span>
          </button>
        </div>
      </div>
    </header>
  );
};
