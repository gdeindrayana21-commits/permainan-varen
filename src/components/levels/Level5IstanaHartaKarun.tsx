import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, ArrowUp, Star, Award, Check } from 'lucide-react';
import { KikoCharacter, PipiCharacter, TreasureChest, SpeechBubble } from '../Characters';
import { sound } from '../../utils/sound';

interface Level5Props {
  onCompleteLevel: (levelId: number, starsEarned: number, readingPoints: number, codingPoints: number) => void;
  onOpenCertificate: () => void;
  onBackToMap: () => void;
}

type ChallengeStage = 1 | 2 | 3 | 4; // 1: Huruf, 2: Membaca, 3: Coding arah kunci, 4: Harta Karun Terbuka!

export const Level5IstanaHartaKarun: React.FC<Level5Props> = ({
  onCompleteLevel,
  onOpenCertificate,
  onBackToMap,
}) => {
  const [challenge, setChallenge] = useState<ChallengeStage>(1);
  const [isChestOpen, setIsChestOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [codeSequence, setCodeSequence] = useState<Array<'UP' | 'RIGHT'>>([]);
  const [feedback, setFeedback] = useState<{ status: 'idle' | 'correct' | 'retry'; message: string }>({
    status: 'idle',
    message: '',
  });

  // Confetti continuous burst effect for celebration
  const triggerGrandCelebration = () => {
    const end = Date.now() + 3000;
    const colors = ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#fbbf24'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // Challenge 1: Recognize Castle Letter 'H' for Harta
  const handleChallenge1Letter = (letter: string) => {
    sound.playPop();
    setSelectedLetter(letter);

    if (letter === 'H') {
      sound.playSuccess();
      sound.speak('Hebat! Huruf H untuk Harta Karun!');
      setFeedback({ status: 'correct', message: '🎉 HEBAT! Huruf H untuk Harta Karun!' });
      try {
        confetti({ particleCount: 35, spread: 50 });
      } catch {
        // fallback
      }

      setTimeout(() => {
        setChallenge(2);
        setSelectedLetter(null);
        setFeedback({ status: 'idle', message: '' });
      }, 1400);
    } else {
      sound.playTryAgain();
      sound.speak('Coba lagi! Cari huruf H ya!');
      setFeedback({ status: 'retry', message: 'Coba lagi! Cari huruf H 😊' });
      setTimeout(() => {
        setSelectedLetter(null);
        setFeedback({ status: 'idle', message: '' });
      }, 1500);
    }
  };

  // Challenge 2: Read word "HARTA"
  const handleChallenge2Word = (word: string) => {
    sound.playPop();
    setSelectedWord(word);

    if (word === 'HARTA') {
      sound.playSuccess();
      sound.speak('Luar biasa! Kata HARTA berhasil dibaca!');
      setFeedback({ status: 'correct', message: '🎉 BENAR! Kata HARTA!' });
      try {
        confetti({ particleCount: 40, spread: 60 });
      } catch {
        // fallback
      }

      setTimeout(() => {
        setChallenge(3);
        setSelectedWord(null);
        setFeedback({ status: 'idle', message: '' });
      }, 1400);
    } else {
      sound.playTryAgain();
      sound.speak('Coba lagi! Kata HARTA yang cocok dengan peti emas!');
      setFeedback({ status: 'retry', message: 'Coba lagi! Kata HARTA 😊' });
      setTimeout(() => {
        setSelectedWord(null);
        setFeedback({ status: 'idle', message: '' });
      }, 1500);
    }
  };

  // Challenge 3: Insert 3 Key directions [ RIGHT, UP, RIGHT ]
  const handleAddDirection = (dir: 'UP' | 'RIGHT') => {
    if (codeSequence.length >= 3) return;
    sound.playPop();
    const newSeq = [...codeSequence, dir];
    setCodeSequence(newSeq);

    // Target sequence: RIGHT, UP, RIGHT
    if (newSeq.length === 3) {
      if (newSeq[0] === 'RIGHT' && newSeq[1] === 'UP' && newSeq[2] === 'RIGHT') {
        // Correct lock combination!
        sound.playTreasureOpen();
        sound.speak('Selamat, Petualang Kecil! Peti Harta Karun terbuka!');
        setIsChestOpen(true);
        setChallenge(4);
        triggerGrandCelebration();
        onCompleteLevel(5, 10, 5, 5);
      } else {
        sound.playTryAgain();
        sound.speak('Ayo coba urutan kunci yang lain: Kanan, Atas, Kanan!');
        setFeedback({ status: 'retry', message: 'Kombinasi kunci: Kanan ➡️, Atas ⬆️, Kanan ➡️ 😊' });
        setTimeout(() => {
          setCodeSequence([]);
          setFeedback({ status: 'idle', message: '' });
        }, 2000);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-gradient-to-b from-amber-200 via-yellow-100 to-amber-200 p-4 sm:p-8 flex flex-col items-center justify-between">
      {/* Castle Grand Header */}
      <div className="w-full max-w-2xl flex items-center justify-between bg-white/95 backdrop-blur-sm border-4 border-amber-400 rounded-3xl px-5 py-3 shadow-md mb-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl sm:text-4xl">🏰</span>
          <div>
            <span className="text-xs font-black text-amber-600 uppercase tracking-wide">
              LEVEL 5 • GRAND FINALE
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-800">ISTANA HARTA KARUN</h2>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-amber-100 px-3.5 py-1.5 rounded-2xl border-2 border-amber-300 text-xs sm:text-sm font-black text-amber-900">
          <span>Tantangan {Math.min(challenge, 3)} / 3</span>
        </div>
      </div>

      {/* ============================================================
          CHALLENGES 1, 2, 3 OR FINAL GRAND CELEBRATION
         ============================================================ */}
      {challenge < 4 ? (
        <div className="w-full max-w-2xl bg-white/95 rounded-3xl border-4 border-amber-400 shadow-2xl p-6 sm:p-8 text-center flex-1 flex flex-col justify-between my-2">
          {/* Companions & Speech */}
          <div className="flex items-start justify-center gap-3 mb-3">
            <KikoCharacter mood={feedback.status === 'correct' ? 'jumping' : 'happy'} size="md" />
            <div className="flex-1 text-left">
              <SpeechBubble
                speaker="kiko"
                text="Kita sudah hampir sampai! Selesaikan 3 tantangan untuk membuka peti harta karun!"
              />
            </div>
            <PipiCharacter size="sm" />
          </div>

          {/* Treasure Chest in Middle */}
          <div className="flex flex-col items-center justify-center my-2">
            <TreasureChest isOpen={false} size="lg" />
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 mt-2">
              🔒 Terkunci dengan 3 Segel Magis
            </span>
          </div>

          {/* Feedback bar */}
          <div className="min-h-10 flex items-center justify-center my-1">
            {feedback.status === 'correct' && (
              <div className="inline-flex items-center gap-2 bg-emerald-100 border-2 border-emerald-400 text-emerald-900 px-6 py-2 rounded-full font-black text-base sm:text-lg animate-bounce">
                <span>{feedback.message}</span>
              </div>
            )}
            {feedback.status === 'retry' && (
              <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-400 text-amber-900 px-6 py-2 rounded-full font-black text-base">
                <span>{feedback.message}</span>
              </div>
            )}
          </div>

          {/* TANTANGAN 1: HURUF MAGIS ISTANA 'H' */}
          {challenge === 1 && (
            <div className="my-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-4">
                Tantangan 1: Pilih huruf awal dari <span className="text-amber-600 underline">HARTA</span>!
              </h3>

              <div className="grid grid-cols-3 gap-3 sm:gap-6">
                {['H', 'M', 'T'].map((letter) => {
                  const isSelected = selectedLetter === letter;
                  const isCorrect = feedback.status === 'correct' && letter === 'H';

                  return (
                    <button
                      key={letter}
                      id={`btn-final-letter-${letter}`}
                      onClick={() => handleChallenge1Letter(letter)}
                      disabled={feedback.status === 'correct'}
                      className={`py-6 sm:py-8 rounded-3xl text-4xl sm:text-6xl font-black border-b-8 active:translate-y-2 active:border-b-2 shadow-lg transition-all cursor-pointer ${
                        isCorrect
                          ? 'bg-emerald-500 border-emerald-700 text-white animate-bounce'
                          : isSelected && feedback.status === 'retry'
                          ? 'bg-amber-300 border-amber-500 text-amber-950'
                          : 'bg-gradient-to-b from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 border-amber-700'
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TANTANGAN 2: MEMBACA KATA SEDERHANA 'HARTA' */}
          {challenge === 2 && (
            <div className="my-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-4">
                Tantangan 2: Baca mantra pembuka istana: <span className="text-amber-600">HAR – TA</span>!
              </h3>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { text: 'HARTA', emoji: '💎', correct: true },
                  { text: 'HUTAN', emoji: '🌳', correct: false },
                  { text: 'HUJAN', emoji: '🌧️', correct: false },
                ].map((item) => (
                  <button
                    key={item.text}
                    id={`btn-final-word-${item.text}`}
                    onClick={() => handleChallenge2Word(item.text)}
                    className="p-5 rounded-3xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black border-b-6 border-amber-600 shadow-md active:translate-y-1 active:border-b-2 flex flex-col items-center justify-center cursor-pointer"
                  >
                    <span className="text-4xl sm:text-5xl mb-1">{item.emoji}</span>
                    <span className="text-xl sm:text-2xl font-black">{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TANTANGAN 3: CODING ARAH KUNCI PEMBUKA PETI */}
          {challenge === 3 && (
            <div className="my-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-2">
                Tantangan 3: Masukkan 3 Arah Kunci Magis
              </h3>
              <p className="text-xs sm:text-sm font-bold text-amber-900 mb-4">
                Petunjuk Kiko: Tekan <span className="underline">Kanan ➡️</span>, lalu <span className="underline">Atas ⬆️</span>, lalu <span className="underline">Kanan ➡️</span>!
              </p>

              {/* Direction Slots */}
              <div className="flex items-center justify-center gap-3 mb-5">
                {[0, 1, 2].map((slotIdx) => {
                  const cmd = codeSequence[slotIdx];
                  return (
                    <div
                      key={slotIdx}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-50 border-4 border-amber-400 flex items-center justify-center text-2xl sm:text-3xl shadow-inner font-black"
                    >
                      {cmd === 'UP' && '⬆️'}
                      {cmd === 'RIGHT' && '➡️'}
                      {!cmd && <span className="text-amber-300 font-normal">?</span>}
                    </div>
                  );
                })}
              </div>

              {/* Coding Key Buttons */}
              <div className="flex items-center justify-center gap-4">
                <button
                  id="btn-key-right"
                  onClick={() => handleAddDirection('RIGHT')}
                  className="px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl border-b-6 border-emerald-700 active:translate-y-1 active:border-b-2 shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <ArrowRight className="w-7 h-7" />
                  <span>Kanan ➡️</span>
                </button>

                <button
                  id="btn-key-up"
                  onClick={() => handleAddDirection('UP')}
                  className="px-6 py-4 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xl border-b-6 border-sky-700 active:translate-y-1 active:border-b-2 shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <ArrowUp className="w-7 h-7" />
                  <span>Atas ⬆️</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom helper */}
          <div className="pt-2 border-t-2 border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
            <button onClick={onBackToMap} className="hover:underline">
              ← Kembali ke Peta
            </button>
            <span>Istana Harta Karun • Menuju Kemenangan!</span>
          </div>
        </div>
      ) : (
        /* ============================================================
            GRAND FINALE: TREASURE OPENED & CELEBRATION!
           ============================================================ */
        <div className="w-full max-w-2xl bg-white/95 rounded-3xl border-6 border-amber-400 shadow-2xl p-6 sm:p-10 text-center my-auto relative overflow-hidden animate-pulse-glow">
          {/* Fireworks & Sparkles visual banner */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl animate-bounce">🎆</span>
            <span className="text-5xl animate-bounce">🏆</span>
            <span className="text-4xl animate-bounce">🎆</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-amber-600 tracking-tight mb-2">
            SELAMAT, PETUALANG KECIL!
          </h1>
          <p className="text-xl sm:text-2xl font-black text-slate-800 mb-5">
            “Kamu berhasil membantu Kiko menemukan Harta Karun!”
          </p>

          {/* Treasure Chest OPENED with Gems & Gold */}
          <div className="my-4 flex flex-col items-center justify-center">
            <TreasureChest isOpen={true} size="xl" />
            <div className="flex items-center gap-2 text-2xl mt-2 animate-bounce">
              <span>🪙</span>
              <span>💎</span>
              <span>⭐</span>
              <span>👑</span>
              <span>⭐</span>
              <span>💎</span>
              <span>🪙</span>
            </div>
          </div>

          {/* Dancing Kiko & Pipi */}
          <div className="flex items-center justify-center gap-6 my-4">
            <div className="animate-cute-jump">
              <KikoCharacter mood="cheering" size="lg" />
              <span className="block text-xs font-black text-sky-700 mt-1">🐰 Kiko Menari Bahagia!</span>
            </div>
            <div className="animate-cute-jump">
              <PipiCharacter size="md" />
              <span className="block text-xs font-black text-amber-700 mt-1">🐥 Pipi Berkicau Gembira!</span>
            </div>
          </div>

          <p className="text-base sm:text-lg font-bold text-slate-700 max-w-md mx-auto mb-8">
            Kamu telah menyelesaikan seluruh petualangan membaca dan coding dengan luar biasa!
          </p>

          {/* Big Certificate Button */}
          <button
            id="btn-buka-sertifikat"
            onClick={() => {
              sound.playSuccess();
              onOpenCertificate();
            }}
            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:to-yellow-500 text-amber-950 font-black text-2xl sm:text-3xl rounded-3xl border-b-8 border-amber-700 shadow-2xl active:translate-y-2 active:border-b-2 transition flex items-center justify-center gap-3 cursor-pointer mx-auto"
          >
            <Award className="w-8 h-8 text-amber-950 fill-amber-300 animate-spin" />
            <span>LIHAT SERTIFIKATMU! 🎓</span>
          </button>
        </div>
      )}
    </div>
  );
};
