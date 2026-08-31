import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Key, Sparkles, ArrowRight, ArrowUp, ArrowDown, ArrowLeft, Star, Volume2 } from 'lucide-react';
import { KikoCharacter, PipiCharacter, SpeechBubble } from '../Characters';
import { sound } from '../../utils/sound';

interface Level4Props {
  onCompleteLevel: (levelId: number, starsEarned: number, readingPoints: number, codingPoints: number) => void;
  onBackToMap: () => void;
}

type Stage = 'doors' | 'word_puzzle' | 'cave_path';

export const Level4GuaMisteri: React.FC<Level4Props> = ({
  onCompleteLevel,
  onBackToMap,
}) => {
  const [stage, setStage] = useState<Stage>('doors');
  const [selectedDoor, setSelectedDoor] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [keyPosition, setKeyPosition] = useState({ x: 3, y: 1 });
  const [kikoCavePos, setKikoCavePos] = useState({ x: 0, y: 1 });
  const [hasKey, setHasKey] = useState(false);
  const [starsThisLevel, setStarsThisLevel] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState<{ status: 'idle' | 'correct' | 'retry'; message: string }>({
    status: 'idle',
    message: '',
  });

  // Stage 1: Door Selection
  const handleSelectDoor = (doorLetter: string) => {
    sound.playPop();
    setSelectedDoor(doorLetter);

    if (doorLetter === 'B') {
      sound.playSuccess();
      sound.speak('Hebat! Pintu B terbuka!');
      setStarsThisLevel((s) => s + 2);
      setFeedback({ status: 'correct', message: '🎉 HEBAT! Pintu Huruf B Terbuka!' });

      try {
        confetti({ particleCount: 40, spread: 60 });
      } catch {
        // fallback
      }

      setTimeout(() => {
        setStage('word_puzzle');
        setSelectedDoor(null);
        setFeedback({ status: 'idle', message: '' });
      }, 1400);
    } else {
      sound.playTryAgain();
      sound.speak('Coba lagi, Petualang! Cari pintu dengan huruf B!');
      setFeedback({ status: 'retry', message: 'Coba lagi, Petualang! Cari huruf B 😊' });
      setTimeout(() => {
        setSelectedDoor(null);
        setFeedback({ status: 'idle', message: '' });
      }, 1500);
    }
  };

  // Stage 2: Suku kata puzzle (B -> BA -> BOLA)
  const handleSelectWord = (word: string) => {
    sound.playPop();
    setSelectedWord(word);

    if (word === 'BOLA') {
      sound.playSuccess();
      sound.speak('B -> BA -> BOLA! Hebat sekali!');
      setStarsThisLevel((s) => s + 2);
      setFeedback({ status: 'correct', message: '🎉 BENAR! B -> BA -> BOLA!' });

      try {
        confetti({ particleCount: 45, spread: 60 });
      } catch {
        // fallback
      }

      setTimeout(() => {
        setStage('cave_path');
        setSelectedWord(null);
        setFeedback({ status: 'idle', message: '' });
      }, 1400);
    } else {
      sound.playTryAgain();
      sound.speak('Coba lagi! Cari kata BOLA yang dimulai dari B dan BA!');
      setFeedback({ status: 'retry', message: 'Coba lagi! Cari kata BOLA 😊' });
      setTimeout(() => {
        setSelectedWord(null);
        setFeedback({ status: 'idle', message: '' });
      }, 1500);
    }
  };

  // Stage 3: Cave Walk to grab the Golden Key
  const handleCaveMove = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (hasKey) return;

    sound.playStep();
    let nextX = kikoCavePos.x;
    let nextY = kikoCavePos.y;

    if (dir === 'UP' && nextY > 0) nextY -= 1;
    if (dir === 'DOWN' && nextY < 2) nextY += 1;
    if (dir === 'LEFT' && nextX > 0) nextX -= 1;
    if (dir === 'RIGHT' && nextX < 3) nextX += 1;

    setKikoCavePos({ x: nextX, y: nextY });

    // Grab Golden Key at (3, 1)
    if (nextX === 3 && nextY === 1) {
      sound.playSuccess();
      sound.speak('Horee! Kiko mendapatkan Kunci Emas Gua Misteri!');
      setHasKey(true);
      setStarsThisLevel((s) => s + 2);

      try {
        confetti({ particleCount: 80, spread: 80 });
      } catch {
        // fallback
      }

      setTimeout(() => {
        sound.playFanfare();
        setIsCompleted(true);
      }, 1500);
    }
  };

  const handleFinish = () => {
    onCompleteLevel(4, Math.max(starsThisLevel, 6), 3, 3);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-gradient-to-b from-indigo-200 via-purple-100 to-amber-100 p-4 sm:p-8 flex flex-col items-center justify-between">
      {/* Top Level Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between bg-white/95 backdrop-blur-sm border-3 border-indigo-300 rounded-3xl px-5 py-3 shadow-sm mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">🕵️</span>
          <div>
            <span className="text-xs font-black text-indigo-600 uppercase tracking-wide">
              LEVEL 4 • MEMBACA + CODING
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-800">GUA MISTERI</h2>
          </div>
        </div>

        {/* Stage Indicator */}
        <div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-2xl border-2 border-indigo-200 text-xs sm:text-sm font-black text-indigo-800">
          <span>
            {stage === 'doors' && 'Tahap 1: Pintu Rahasia 🚪'}
            {stage === 'word_puzzle' && 'Tahap 2: Kata Berantai 📖'}
            {stage === 'cave_path' && 'Tahap 3: Kunci Emas 🔑'}
          </span>
        </div>
      </div>

      {!isCompleted ? (
        <div className="w-full max-w-2xl bg-white/95 rounded-3xl border-4 border-indigo-300 shadow-2xl p-6 sm:p-8 text-center flex-1 flex flex-col justify-between my-2">
          {/* Character Speech */}
          <div className="flex items-start justify-center gap-3 mb-3">
            <KikoCharacter mood={feedback.status === 'correct' || hasKey ? 'jumping' : 'happy'} size="md" />
            <div className="flex-1 text-left">
              <SpeechBubble
                speaker="kiko"
                text={
                  stage === 'doors'
                    ? 'Cari pintu yang memiliki huruf B!'
                    : stage === 'word_puzzle'
                    ? 'B → BA → Menjadi kata apa ya?'
                    : 'Beri perintah arah jalan Kiko untuk mengambil Kunci Emas!'
                }
              />
            </div>
          </div>

          {/* Feedback message */}
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

          {/* TAHAP 1: THREE MYSTERY DOORS */}
          {stage === 'doors' && (
            <div className="my-3">
              <p className="text-base sm:text-xl font-extrabold text-slate-700 mb-5">
                Kiko berada di depan 3 pintu gua. Pintu mana yang memiliki huruf <span className="text-3xl text-indigo-600 font-black underline">B</span>?
              </p>

              <div className="grid grid-cols-3 gap-3 sm:gap-6">
                {['A', 'B', 'C'].map((letter) => {
                  const isSelected = selectedDoor === letter;
                  const isCorrect = feedback.status === 'correct' && letter === 'B';

                  return (
                    <button
                      key={letter}
                      id={`btn-door-${letter}`}
                      onClick={() => handleSelectDoor(letter)}
                      disabled={feedback.status === 'correct'}
                      className={`p-5 sm:p-8 rounded-3xl flex flex-col items-center justify-center border-b-8 active:translate-y-2 active:border-b-2 shadow-lg transition-all cursor-pointer ${
                        isCorrect
                          ? 'bg-emerald-500 border-emerald-700 text-white animate-bounce'
                          : isSelected && feedback.status === 'retry'
                          ? 'bg-amber-300 border-amber-500 text-amber-950'
                          : 'bg-gradient-to-b from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white border-indigo-700'
                      }`}
                    >
                      <span className="text-5xl sm:text-6xl mb-2">🚪</span>
                      <span className="text-3xl sm:text-5xl font-black">PINTU {letter}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAHAP 2: WORD CHAIN (B -> BA -> BOLA) */}
          {stage === 'word_puzzle' && (
            <div className="my-3">
              <div className="bg-indigo-50 rounded-3xl p-5 border-3 border-indigo-200 shadow-inner mb-5">
                <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap text-2xl sm:text-4xl font-black text-indigo-900">
                  <span className="px-4 py-2 bg-white rounded-2xl border-2 border-indigo-300">B</span>
                  <span>➜</span>
                  <span className="px-4 py-2 bg-white rounded-2xl border-2 border-indigo-300">BA</span>
                  <span>➜</span>
                  <span className="px-4 py-2 bg-amber-200 rounded-2xl border-2 border-amber-400 text-amber-900">
                    ???
                  </span>
                </div>
                <p className="text-sm font-bold text-indigo-700 mt-2">
                  Lengkapi rantai kata ajaib untuk membuka ruang kristal!
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { text: 'BOLA', emoji: '⚽', correct: true },
                  { text: 'BUKU', emoji: '📖', correct: false },
                  { text: 'BEBEK', emoji: '🦆', correct: false },
                ].map((item) => (
                  <button
                    key={item.text}
                    id={`btn-word-chain-${item.text}`}
                    onClick={() => handleSelectWord(item.text)}
                    className="p-4 sm:p-5 rounded-3xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black border-b-6 border-amber-600 shadow-md active:translate-y-1 active:border-b-2 flex flex-col items-center justify-center cursor-pointer"
                  >
                    <span className="text-4xl sm:text-5xl mb-1">{item.emoji}</span>
                    <span className="text-lg sm:text-2xl font-black">{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAHAP 3: CRYSTAL CAVE PATH CODING */}
          {stage === 'cave_path' && (
            <div className="flex flex-col items-center my-1">
              <div className="text-center mb-2">
                <h3 className="text-base sm:text-lg font-black text-slate-800">
                  Langkah Terakhir: Ambil Kunci Emas 🔑
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  Arahkan Kiko menuju peti kristal di ujung gua!
                </p>
              </div>

              {/* 4x3 Crystal Cave Grid */}
              <div className="bg-gradient-to-r from-purple-200 via-indigo-200 to-sky-200 p-3 rounded-2xl border-4 border-indigo-400 shadow-inner w-full max-w-md mb-3">
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2].map((y) =>
                    [0, 1, 2, 3].map((x) => {
                      const isKikoHere = kikoCavePos.x === x && kikoCavePos.y === y;
                      const isKeyHere = x === 3 && y === 1;

                      return (
                        <div
                          key={`cave-${x}-${y}`}
                          className="h-14 sm:h-16 rounded-xl bg-white/80 border-2 border-indigo-300 flex items-center justify-center relative"
                        >
                          <span className="text-[10px] text-purple-400 absolute top-1 left-1.5 opacity-50">
                            💎
                          </span>
                          {isKeyHere && !hasKey && (
                            <Key className="w-8 h-8 text-amber-500 fill-amber-400 animate-bounce" />
                          )}
                          {isKeyHere && hasKey && (
                            <span className="text-2xl">✨</span>
                          )}
                          {isKikoHere && (
                            <div className="scale-75">
                              <KikoCharacter size="sm" mood={hasKey ? 'cheering' : 'happy'} />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Direction controls */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => handleCaveMove('UP')}
                  className="w-14 h-12 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 border-b-4 border-amber-600 active:translate-y-1 active:border-b-0 flex items-center justify-center font-black shadow-md cursor-pointer"
                >
                  <ArrowUp className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCaveMove('LEFT')}
                    className="w-14 h-12 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 border-b-4 border-amber-600 active:translate-y-1 active:border-b-0 flex items-center justify-center font-black shadow-md cursor-pointer"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleCaveMove('DOWN')}
                    className="w-14 h-12 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 border-b-4 border-amber-600 active:translate-y-1 active:border-b-0 flex items-center justify-center font-black shadow-md cursor-pointer"
                  >
                    <ArrowDown className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleCaveMove('RIGHT')}
                    className="w-14 h-12 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 border-b-4 border-amber-600 active:translate-y-1 active:border-b-0 flex items-center justify-center font-black shadow-md cursor-pointer"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom helper */}
          <div className="pt-2 border-t-2 border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-800">
            <button onClick={onBackToMap} className="hover:underline">
              ← Kembali ke Peta
            </button>
            <span>Petualangan TK A • Membaca & Coding</span>
          </div>
        </div>
      ) : (
        /* Level 4 Completion Modal */
        <div className="w-full max-w-xl bg-white/95 rounded-3xl border-4 border-indigo-400 shadow-2xl p-8 text-center my-auto">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">🔑</span>
            <h2 className="text-3xl sm:text-4xl font-black text-indigo-800">
              LEVEL 4 SELESAI!
            </h2>
            <span className="text-4xl">🔑</span>
          </div>

          <div className="flex items-center justify-center gap-4 my-4">
            <KikoCharacter mood="cheering" size="lg" />
            <PipiCharacter size="md" />
          </div>

          <p className="text-xl sm:text-2xl font-black text-slate-800 mb-2">
            KUNCI EMAS BERHASIL DIDAPATKAN! 🌟
          </p>
          <p className="text-base sm:text-lg font-bold text-slate-600 mb-6">
            Kiko sekarang punya kunci emas untuk membuka pintu Istana Harta Karun!
          </p>

          <div className="inline-flex items-center gap-2 bg-amber-100 border-3 border-amber-400 px-6 py-3 rounded-2xl mb-8">
            <Star className="w-8 h-8 text-amber-500 fill-amber-400 animate-spin" />
            <span className="text-2xl font-black text-amber-950">
              +6 Bintang Petualang!
            </span>
          </div>

          <div className="flex justify-center">
            <button
              id="btn-level4-lanjut-peta"
              onClick={handleFinish}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-amber-950 font-black text-xl rounded-2xl border-b-6 border-amber-700 shadow-lg active:translate-y-1 active:border-b-0 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>BUKA LEVEL 5 (ISTANA HARTA KARUN 🏰)</span>
              <Sparkles className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
