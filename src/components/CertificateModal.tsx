import React from 'react';
import { X, Printer, Award, Download, Sparkles } from 'lucide-react';
import { PlayerProfile } from '../types';
import { KikoCharacter, PipiCharacter } from './Characters';
import { sound } from '../utils/sound';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  if (!isOpen) return null;

  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    sound.playPop();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border-4 border-amber-400 shadow-2xl max-w-3xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 my-auto">
        {/* Top Controls Bar (Hidden during print) */}
        <div className="bg-amber-100 px-6 py-3 border-b-2 border-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-black text-sm sm:text-base">
            <Award className="w-5 h-5 text-amber-600" />
            <span>SERTIFIKAT KELULUSAN PETUALANGAN KIKO</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              id="btn-cetak-sertifikat"
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Cetak Sertifikat
            </button>
            <button
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-amber-200 hover:bg-amber-300 flex items-center justify-center text-amber-900 transition active:scale-95 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area (Print target) */}
        <div className="p-4 sm:p-8 bg-amber-50/50 flex justify-center">
          <div
            id="certificate-print-area"
            className="w-full max-w-2xl bg-gradient-to-b from-amber-50 via-yellow-50/30 to-amber-50 rounded-2xl border-8 border-double border-amber-400 p-6 sm:p-10 shadow-lg text-center relative"
          >
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-3 text-2xl select-none">🌟</div>
            <div className="absolute top-2 right-3 text-2xl select-none">🌟</div>
            <div className="absolute bottom-2 left-3 text-2xl select-none">🌟</div>
            <div className="absolute bottom-2 right-3 text-2xl select-none">🌟</div>

            {/* Top Ribbon & Header */}
            <div className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 px-6 py-1.5 rounded-full font-black text-xs sm:text-sm tracking-widest uppercase mb-3 shadow-sm border border-amber-500">
              <Sparkles className="w-4 h-4" /> TK A EDUKASI INTERAKTIF <Sparkles className="w-4 h-4" />
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-amber-600 tracking-wide uppercase mb-1">
              🏆 SERTIFIKAT PETUALANG KECIL 🏆
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-500 tracking-wider uppercase mb-5">
              Sertifikat Keberhasilan Belajar Coding & Membaca
            </p>

            <p className="text-xs sm:text-sm font-extrabold text-slate-600 uppercase tracking-wide">
              Diberikan kepada:
            </p>

            {/* Child's Name */}
            <div className="my-2 py-1 border-b-4 border-amber-400 inline-block px-8">
              <span className="text-3xl sm:text-5xl font-black text-slate-900 tracking-normal font-sans">
                {profile.name || 'Petualang Cilik'}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-600 mb-4">
              Siswa Kelas: <span className="font-black text-amber-700">{profile.grade}</span>
            </p>

            <p className="text-sm sm:text-base font-bold text-slate-700 max-w-lg mx-auto leading-relaxed mb-4">
              Karena telah berhasil menyelesaikan seluruh rangkaian level dalam:
              <br />
              <span className="text-lg sm:text-xl font-black text-amber-600 block mt-1">
                🌟 PETUALANGAN KIKO 🌟
              </span>
              <span className="font-extrabold text-slate-600 text-xs sm:text-sm">
                (Belajar Mengenal Huruf, Membaca Suku Kata & Dasar Coding Anak)
              </span>
            </p>

            {/* Predicate Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 px-6 py-2 rounded-2xl font-black text-base sm:text-lg border-2 border-amber-500 shadow-md mb-6">
              <Award className="w-6 h-6 text-amber-900 fill-amber-300" />
              <span>⭐ PETUALANG SUPER ⭐</span>
            </div>

            {/* Companions & Signatures Row */}
            <div className="pt-4 border-t-2 border-amber-200 flex items-end justify-between px-2 sm:px-6">
              {/* Kiko & Pipi Mascot */}
              <div className="flex items-center gap-2">
                <KikoCharacter mood="cheering" size="sm" />
                <div className="text-left">
                  <span className="text-xs font-black text-slate-800 block">Kiko si Kelinci</span>
                  <span className="text-[10px] text-slate-500 font-bold">Sahabat Petualang</span>
                </div>
              </div>

              {/* Date & Signature */}
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500">Tanggal: {today}</p>
                <div className="mt-4 border-t-2 border-slate-400 pt-1 w-32 inline-block">
                  <span className="text-xs font-black text-slate-700 block">Guru / Orang Tua</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white p-4 border-t-2 border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">
            Total Bintang: {profile.stars} ⭐ • 5/5 Level Selesai
          </span>

          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-amber-950 font-black rounded-xl border-b-4 border-amber-600 shadow-md active:translate-y-1 active:border-b-0 cursor-pointer flex items-center gap-2 text-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Sertifikat Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
