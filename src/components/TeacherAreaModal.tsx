import React, { useState } from 'react';
import { X, GraduationCap, Star, BookOpen, Code, Award, CheckCircle, RotateCcw, Printer } from 'lucide-react';
import { PlayerProfile } from '../types';
import { getRewardTitle } from './HeaderNav';
import { sound } from '../utils/sound';

interface TeacherAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  onResetProgress: () => void;
}

export const TeacherAreaModal: React.FC<TeacherAreaModalProps> = ({
  isOpen,
  onClose,
  profile,
  onResetProgress,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const reward = getRewardTitle(profile.stars);
  const completedCount = profile.completedLevels.length;
  const progressPercent = Math.round((completedCount / 5) * 100);

  // Derive Reading and Coding stars based on progress & points
  const readingStars = Math.min(5, Math.max(1, Math.ceil((profile.readingPoints / 13) * 5)));
  const codingStars = Math.min(5, Math.max(1, Math.ceil((profile.codingPoints / 13) * 5)));

  const handlePrint = () => {
    sound.playPop();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border-4 border-purple-400 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 px-6 py-4 text-white flex items-center justify-between border-b-4 border-purple-700">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">AREA GURU & ORANG TUA</h2>
              <p className="text-xs text-purple-100 font-bold">
                Laporan & Pemantauan Hasil Belajar Siswa TK A
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition active:scale-95 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Identity & Status Card */}
          <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{profile.avatar || '👧'}</span>
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase">Profil Siswa:</span>
                <h3 className="text-xl font-black text-slate-800">{profile.name || 'Petualang Cilik'}</h3>
                <span className="text-xs font-bold bg-purple-200 text-purple-900 px-2.5 py-0.5 rounded-full">
                  Kelas: {profile.grade}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 block">Status Pencapaian:</span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-black border ${reward.color}`}>
                <span>{reward.badge}</span>
                <span>{reward.title}</span>
              </span>
            </div>
          </div>

          {/* Progress Overview */}
          <div>
            <div className="flex items-center justify-between text-sm font-black mb-1.5">
              <span>PROGRESS LEVEL PETUALANGAN:</span>
              <span className="text-purple-700">{completedCount} / 5 Level ({progressPercent}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Skill Assessments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Reading Skills */}
            <div className="bg-rose-50 rounded-2xl p-4 border-2 border-rose-200">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-rose-600" />
                <h4 className="font-black text-rose-900">Kemampuan Membaca</h4>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      s <= readingStars
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
                <span className="text-xs font-black text-rose-700 ml-1.5">
                  ({readingStars}/5)
                </span>
              </div>
              <ul className="text-xs space-y-1 font-bold text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-600">✓</span> Mengenal alfabet awal (A-E)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-600">✓</span> Membaca suku kata (BA, BO-LA, BU-KU)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-600">✓</span> Menggabung kata sederhana
                </li>
              </ul>
            </div>

            {/* Coding Skills */}
            <div className="bg-sky-50 rounded-2xl p-4 border-2 border-sky-200">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-5 h-5 text-sky-600" />
                <h4 className="font-black text-sky-900">Kemampuan Coding</h4>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      s <= codingStars
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
                <span className="text-xs font-black text-sky-700 ml-1.5">
                  ({codingStars}/5)
                </span>
              </div>
              <ul className="text-xs space-y-1 font-bold text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-600">✓</span> Pemahaman arah (Atas, Bawah, Kiri, Kanan)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-600">✓</span> Urutan langkah algoritma visual
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-600">✓</span> Pemecahan masalah & labirin sungai
                </li>
              </ul>
            </div>
          </div>

          {/* Level Details Status Table */}
          <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-200">
            <h4 className="text-sm font-black text-slate-700 mb-3">
              DETAIL CAPAIAN PER LEVEL:
            </h4>
            <div className="space-y-2 text-xs font-bold">
              {[
                { id: 1, name: 'Hutan Huruf (Alfabet Buah & Benda)', cat: 'Membaca' },
                { id: 2, name: 'Taman Membaca (Suku Kata BO-LA, BU-KU)', cat: 'Membaca' },
                { id: 3, name: 'Sungai Coding (Arah, Sekuensial & Labirin)', cat: 'Coding' },
                { id: 4, name: 'Gua Misteri (Pintu B, Rantai Kata & Kunci)', cat: 'Membaca + Coding' },
                { id: 5, name: 'Istana Harta Karun (Tantangan Akhir & Peti)', cat: 'Grand Finale' },
              ].map((lvl) => {
                const isCompleted = profile.completedLevels.includes(lvl.id);
                const isUnlocked = lvl.id <= profile.unlockedLevel;

                return (
                  <div
                    key={lvl.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px]">
                        {lvl.id}
                      </span>
                      <span className="font-black text-slate-800">{lvl.name}</span>
                    </div>

                    <div>
                      {isCompleted ? (
                        <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-black flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Selesai
                        </span>
                      ) : isUnlocked ? (
                        <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-black">
                          Sedang Berjalan
                        </span>
                      ) : (
                        <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                          Terkunci
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset Confirmation or Trigger */}
          {showResetConfirm ? (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-center">
              <p className="text-sm font-black text-rose-900 mb-3">
                Yakin ingin mengulang dari awal? Seluruh bintang dan level yang terbuka akan direset.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    sound.playPop();
                    onResetProgress();
                    setShowResetConfirm(false);
                    onClose();
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs"
                >
                  Ya, Reset Sekarang
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-xs text-rose-600 hover:text-rose-700 font-black flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Belajar Anak
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Cetak Laporan Belajar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
