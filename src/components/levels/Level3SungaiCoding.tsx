import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Play,
  RotateCcw,
  Sparkles,
  Flag,
  Star,
  CheckCircle,
} from 'lucide-react';
import { KikoCharacter, PipiCharacter, SpeechBubble } from '../Characters';
import { sound } from '../../utils/sound';

interface Level3Props {
  onCompleteLevel: (levelId: number, starsEarned: number, codingPoints: number) => void;
  onBackToMap: () => void;
}

type CodingGameMode = 1 | 2 | 3;

interface GridCell {
  x: number;
  y: number;
}

export const Level3SungaiCoding: React.FC<Level3Props> = ({
  onCompleteLevel,
  onBackToMap,
}) => {
  const [gameMode, setGameMode] = useState<CodingGameMode>(1);
  const [starsThisLevel, setStarsThisLevel] = useState(0);
  const [isLevelFinished, setIsLevelFinished] = useState(false);

  // ==========================================
  // GAME 1 STATE: Step by step directional walking
  // Grid 4x3. Kiko starts at (0, 1), Stars at (1, 1), (2, 1), Flag at (3, 1)
  // ==========================================
  const [g1KikoPos, setG1KikoPos] = useState<GridCell>({ x: 0, y: 1 });
  const [g1CollectedStars, setG1CollectedStars] = useState<number[]>([]);
  const [g1Success, setG1Success] = useState(false);

  // ==========================================
  // GAME 2 STATE: Program sequencing (Urutkan Langkah & Jalankan)
  // Target route from (0, 0) to Flag at (3, 1): e.g. RIGHT, RIGHT, DOWN, RIGHT
  // ==========================================
  const [g2Sequence, setG2Sequence] = useState<Array<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>>([]);
  const [g2IsRunning, setG2IsRunning] = useState(false);
  const [g2KikoPos, setG2KikoPos] = useState<GridCell>({ x: 0, y: 0 });
  const [g2ActiveStep, setG2ActiveStep] = useState<number | null>(null);
  const [g2Feedback, setG2Feedback] = useState<string | null>(null);

  // ==========================================
  // GAME 3 STATE: Simple kid-friendly maze crossing
  // Kiko navigates a 4x4 stepping pond with Apple, Star, and Trophy
  // ==========================================
  const [g3KikoPos, setG3KikoPos] = useState<GridCell>({ x: 0, y: 0 });
  const [g3CollectedItems, setG3CollectedItems] = useState<string[]>([]);
  const [g3Success, setG3Success] = useState(false);

  // ------------------------------------------
  // GAME 1 HANDLERS
  // ------------------------------------------
  const handleG1Move = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (g1Success) return;

    sound.playStep();
    let nextX = g1KikoPos.x;
    let nextY = g1KikoPos.y;

    if (direction === 'UP' && nextY > 0) nextY -= 1;
    if (direction === 'DOWN' && nextY < 2) nextY += 1;
    if (direction === 'LEFT' && nextX > 0) nextX -= 1;
    if (direction === 'RIGHT' && nextX < 3) nextX += 1;

    setG1KikoPos({ x: nextX, y: nextY });

    // Check star collection
    if (nextX === 1 && nextY === 1 && !g1CollectedStars.includes(1)) {
      sound.playSuccess();
      setG1CollectedStars((prev) => [...prev, 1]);
      setStarsThisLevel((s) => s + 1);
    }
    if (nextX === 2 && nextY === 1 && !g1CollectedStars.includes(2)) {
      sound.playSuccess();
      setG1CollectedStars((prev) => [...prev, 2]);
      setStarsThisLevel((s) => s + 1);
    }

    // Check reached flag (3, 1)
    if (nextX === 3 && nextY === 1) {
      sound.playSuccess();
      sound.speak('Wow! Kiko sampai ke bendera!');
      setG1Success(true);
      setStarsThisLevel((s) => s + 2);
      try {
        confetti({ particleCount: 40, spread: 60 });
      } catch {
        // fallback
      }
    }
  };

  const handleResetG1 = () => {
    sound.playPop();
    setG1KikoPos({ x: 0, y: 1 });
    setG1CollectedStars([]);
    setG1Success(false);
  };

  // ------------------------------------------
  // GAME 2 HANDLERS: Sequence Runner
  // ------------------------------------------
  const handleAddG2Command = (cmd: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (g2IsRunning || g2Sequence.length >= 6) return;
    sound.playPop();
    setG2Sequence((prev) => [...prev, cmd]);
    setG2Feedback(null);
  };

  const handleRemoveLastG2Command = () => {
    if (g2IsRunning || g2Sequence.length === 0) return;
    sound.playPop();
    setG2Sequence((prev) => prev.slice(0, -1));
  };

  const handleClearG2 = () => {
    if (g2IsRunning) return;
    sound.playPop();
    setG2Sequence([]);
    setG2KikoPos({ x: 0, y: 0 });
    setG2ActiveStep(null);
    setG2Feedback(null);
  };

  const handleRunG2Sequence = async () => {
    if (g2Sequence.length === 0 || g2IsRunning) return;

    sound.playPop();
    sound.speak('Ayo jalankan perintah coding!');
    setG2IsRunning(true);
    setG2Feedback(null);

    let curX = 0;
    let curY = 0;
    setG2KikoPos({ x: curX, y: curY });

    for (let i = 0; i < g2Sequence.length; i++) {
      setG2ActiveStep(i);
      const cmd = g2Sequence[i];

      await new Promise((resolve) => setTimeout(resolve, 650));
      sound.playStep();

      if (cmd === 'UP' && curY > 0) curY -= 1;
      if (cmd === 'DOWN' && curY < 2) curY += 1;
      if (cmd === 'LEFT' && curX > 0) curX -= 1;
      if (cmd === 'RIGHT' && curX < 3) curX += 1;

      setG2KikoPos({ x: curX, y: curY });
    }

    setG2ActiveStep(null);
    setG2IsRunning(false);

    // Goal is (3, 1) or (3, 2)
    if ((curX === 3 && curY === 1) || (curX === 3 && curY === 2)) {
      sound.playSuccess();
      sound.speak('WOW! Kiko sampai! Codingmu berhasil!');
      setG2Feedback('success');
      setStarsThisLevel((s) => s + 2);
      try {
        confetti({ particleCount: 50, spread: 70 });
      } catch {
        // fallback
      }
    } else {
      sound.playTryAgain();
      sound.speak('Ayo coba susunan langkah yang lain!');
      setG2Feedback('retry');
    }
  };

  // ------------------------------------------
  // GAME 3 HANDLERS: Friendly Maze
  // ------------------------------------------
  // Obstacles: (1, 0), (2, 2) - visual friendly rocks
  const g3Obstacles = [
    { x: 1, y: 0 },
    { x: 2, y: 2 },
  ];

  const handleG3Move = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (g3Success) return;

    let nextX = g3KikoPos.x;
    let nextY = g3KikoPos.y;

    if (direction === 'UP' && nextY > 0) nextY -= 1;
    if (direction === 'DOWN' && nextY < 2) nextY += 1;
    if (direction === 'LEFT' && nextX > 0) nextX -= 1;
    if (direction === 'RIGHT' && nextX < 3) nextX += 1;

    // Check if hitting obstacle rock
    const hitRock = g3Obstacles.some((o) => o.x === nextX && o.y === nextY);
    if (hitRock) {
      sound.playTryAgain();
      sound.speak('Ada batu besar! Ayo cari jalan lain!');
      return;
    }

    sound.playStep();
    setG3KikoPos({ x: nextX, y: nextY });

    // Collect Apple at (1, 1)
    if (nextX === 1 && nextY === 1 && !g3CollectedItems.includes('apple')) {
      sound.playSuccess();
      sound.speak('Yummy! Kiko dapat apel segar!');
      setG3CollectedItems((prev) => [...prev, 'apple']);
      setStarsThisLevel((s) => s + 1);
    }
    // Collect Star at (2, 1)
    if (nextX === 2 && nextY === 1 && !g3CollectedItems.includes('star')) {
      sound.playSuccess();
      sound.speak('Kiko dapat bintang berkilau!');
      setG3CollectedItems((prev) => [...prev, 'star']);
      setStarsThisLevel((s) => s + 1);
    }
    // Collect Trophy at (3, 2)
    if (nextX === 3 && nextY === 2) {
      sound.playSuccess();
      sound.speak('Horee! Kiko berhasil melewati labirin dan menemukan piala!');
      setG3Success(true);
      setStarsThisLevel((s) => s + 2);
      try {
        confetti({ particleCount: 80, spread: 80 });
      } catch {
        // fallback
      }
    }
  };

  const handleResetG3 = () => {
    sound.playPop();
    setG3KikoPos({ x: 0, y: 0 });
    setG3CollectedItems([]);
    setG3Success(false);
  };

  // Complete level
  const handleFinishLevel3 = () => {
    sound.playFanfare();
    setIsLevelFinished(true);
  };

  const handleConfirmFinish = () => {
    onCompleteLevel(3, Math.max(starsThisLevel, 5), 5);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-gradient-to-b from-sky-100 via-blue-50 to-emerald-100 p-4 sm:p-8 flex flex-col items-center justify-between">
      {/* Level Header Bar */}
      <div className="w-full max-w-3xl flex flex-wrap items-center justify-between bg-white/95 backdrop-blur-sm border-3 border-sky-300 rounded-3xl px-5 py-3 shadow-sm mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">💻</span>
          <div>
            <span className="text-xs font-black text-sky-600 uppercase tracking-wide">
              LEVEL 3 • CODING TK A
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-800">SUNGAI CODING</h2>
          </div>
        </div>

        {/* Sub-game switcher tabs */}
        <div className="flex items-center gap-1.5 bg-sky-50 p-1.5 rounded-2xl border-2 border-sky-200">
          <button
            onClick={() => {
              sound.playPop();
              setGameMode(1);
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition cursor-pointer ${
              gameMode === 1
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-sky-800 hover:bg-sky-100'
            }`}
          >
            1. Jalan Kiko {g1Success && '✅'}
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setGameMode(2);
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition cursor-pointer ${
              gameMode === 2
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-sky-800 hover:bg-sky-100'
            }`}
          >
            2. Urutkan Langkah {g2Feedback === 'success' && '✅'}
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setGameMode(3);
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition cursor-pointer ${
              gameMode === 3
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-sky-800 hover:bg-sky-100'
            }`}
          >
            3. Labirin Sungai {g3Success && '✅'}
          </button>
        </div>
      </div>

      {!isLevelFinished ? (
        <div className="w-full max-w-3xl bg-white/95 rounded-3xl border-4 border-sky-300 shadow-2xl p-5 sm:p-7 flex-1 flex flex-col justify-between my-2">
          {/* Coding Concept Speech */}
          <div className="flex items-start justify-center gap-3 mb-4">
            <KikoCharacter mood={g1Success || g2Feedback === 'success' || g3Success ? 'jumping' : 'happy'} size="sm" />
            <div className="flex-1 text-left">
              <SpeechBubble
                speaker="kiko"
                text="Coding adalah memberi perintah kepada teman kita agar tahu harus berjalan ke mana!"
              />
            </div>
          </div>

          {/* =========================================================
              SUB-GAME 1: JALAN MENUJU KIKO (Direct step-by-step)
             ========================================================= */}
          {gameMode === 1 && (
            <div className="flex flex-col items-center">
              <div className="text-center mb-3">
                <h3 className="text-lg sm:text-xl font-black text-slate-800">
                  Permainan 1: Jalan Menuju Bendera 🏁
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-600">
                  Tekan tombol panah arah untuk memandu Kiko melompati batu sungai dan mencapai bendera!
                </p>
              </div>

              {/* Grid 4 x 3 Stepping Stones on Rainbow River */}
              <div className="bg-gradient-to-r from-cyan-200 via-sky-200 to-blue-200 p-4 rounded-3xl border-4 border-sky-400 shadow-inner w-full max-w-lg mb-4">
                <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                  {[0, 1, 2].map((y) =>
                    [0, 1, 2, 3].map((x) => {
                      const isKikoHere = g1KikoPos.x === x && g1KikoPos.y === y;
                      const isFlagHere = x === 3 && y === 1;
                      const isStar1Here = x === 1 && y === 1 && !g1CollectedStars.includes(1);
                      const isStar2Here = x === 2 && y === 1 && !g1CollectedStars.includes(2);

                      return (
                        <div
                          key={`${x}-${y}`}
                          className="h-16 sm:h-20 rounded-2xl bg-white/80 border-3 border-sky-300 flex items-center justify-center relative shadow-sm transition-all"
                        >
                          {/* River ripple indicator */}
                          <span className="text-[10px] text-sky-400 absolute top-1 left-1.5 opacity-60">
                            🌊
                          </span>

                          {/* Items */}
                          {isStar1Here && <span className="text-2xl sm:text-3xl animate-bounce">⭐</span>}
                          {isStar2Here && <span className="text-2xl sm:text-3xl animate-bounce">⭐</span>}
                          {isFlagHere && <span className="text-3xl sm:text-4xl">🏁</span>}

                          {/* Kiko Bunny */}
                          {isKikoHere && (
                            <div className="scale-75 sm:scale-90 animate-cute-bob z-10">
                              <KikoCharacter size="sm" mood={g1Success ? 'jumping' : 'happy'} />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Status Message */}
              {g1Success ? (
                <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-900 px-6 py-2.5 rounded-full font-black text-lg mb-4 flex items-center gap-2 animate-bounce">
                  <span>🎉 WOW! Kiko sampai ke bendera!</span>
                  <button
                    onClick={() => setGameMode(2)}
                    className="ml-3 px-3 py-1 bg-emerald-600 text-white rounded-xl text-xs font-black shadow-sm"
                  >
                    Lanjut Game 2 ➜
                  </button>
                </div>
              ) : (
                <div className="text-xs sm:text-sm font-extrabold text-sky-800 mb-3">
                  Bintang didapat: {g1CollectedStars.length}/2 ⭐
                </div>
              )}

              {/* Directional Pad Buttons (Big tactile controls) */}
              <div className="flex flex-col items-center gap-2">
                <button
                  id="btn-move-up"
                  onClick={() => handleG1Move('UP')}
                  className="w-16 h-14 sm:w-20 sm:h-16 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 border-b-6 border-amber-600 active:translate-y-1 active:border-b-2 flex items-center justify-center font-black shadow-md cursor-pointer"
                  title="Atas"
                >
                  <ArrowUp className="w-8 h-8" />
                </button>
                <div className="flex items-center gap-3">
                  <button
                    id="btn-move-left"
                    onClick={() => handleG1Move('LEFT')}
                    className="w-16 h-14 sm:w-20 sm:h-16 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 border-b-6 border-amber-600 active:translate-y-1 active:border-b-2 flex items-center justify-center font-black shadow-md cursor-pointer"
                    title="Kiri"
                  >
                    <ArrowLeft className="w-8 h-8" />
                  </button>
                  <button
                    id="btn-move-down"
                    onClick={() => handleG1Move('DOWN')}
                    className="w-16 h-14 sm:w-20 sm:h-16 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 border-b-6 border-amber-600 active:translate-y-1 active:border-b-2 flex items-center justify-center font-black shadow-md cursor-pointer"
                    title="Bawah"
                  >
                    <ArrowDown className="w-8 h-8" />
                  </button>
                  <button
                    id="btn-move-right"
                    onClick={() => handleG1Move('RIGHT')}
                    className="w-16 h-14 sm:w-20 sm:h-16 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 border-b-6 border-amber-600 active:translate-y-1 active:border-b-2 flex items-center justify-center font-black shadow-md cursor-pointer"
                    title="Kanan"
                  >
                    <ArrowRight className="w-8 h-8" />
                  </button>
                </div>

                <button
                  onClick={handleResetG1}
                  className="mt-1 text-xs font-black text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Ulangi Posisi Kiko
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              SUB-GAME 2: URUTKAN LANGKAH (Sequencing & Run Button)
             ========================================================= */}
          {gameMode === 2 && (
            <div className="flex flex-col items-center">
              <div className="text-center mb-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-800">
                  Permainan 2: Urutkan Langkah Kiko
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-600">
                  Susun kartu perintah jalan, lalu klik tombol biru <span className="text-blue-600 font-black">JALANKAN 🚀</span>!
                </p>
              </div>

              {/* Miniature River Grid */}
              <div className="bg-sky-100 p-3 rounded-2xl border-3 border-sky-300 shadow-inner w-full max-w-md mb-3">
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2].map((y) =>
                    [0, 1, 2, 3].map((x) => {
                      const isKikoHere = g2KikoPos.x === x && g2KikoPos.y === y;
                      const isFlagHere = x === 3 && y === 1;

                      return (
                        <div
                          key={`g2-${x}-${y}`}
                          className="h-12 sm:h-14 rounded-xl bg-white border-2 border-sky-200 flex items-center justify-center relative"
                        >
                          {isFlagHere && <span className="text-2xl">🏁</span>}
                          {isKikoHere && (
                            <div className="scale-65">
                              <KikoCharacter size="sm" mood={g2Feedback === 'success' ? 'jumping' : 'happy'} />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Command Sequence Slot Box */}
              <div className="w-full max-w-lg bg-amber-50 rounded-2xl border-3 border-amber-300 p-3 mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-amber-900">
                    URUTAN PERINTAH CODING:
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {g2Sequence.length}/6 langkah
                  </span>
                </div>

                <div className="flex items-center gap-2 min-h-14 overflow-x-auto p-1">
                  {g2Sequence.length === 0 ? (
                    <span className="text-xs sm:text-sm font-bold text-slate-400 italic">
                      Pilih kartu arah panah di bawah untuk menyusun urutan langkah...
                    </span>
                  ) : (
                    g2Sequence.map((cmd, idx) => (
                      <div
                        key={idx}
                        className={`px-3 py-2 rounded-xl text-sm font-black border-2 flex items-center gap-1 shrink-0 ${
                          g2ActiveStep === idx
                            ? 'bg-amber-300 border-amber-500 scale-110 animate-bounce'
                            : 'bg-white border-slate-300 text-slate-800'
                        }`}
                      >
                        <span className="text-xs text-slate-400">{idx + 1}.</span>
                        {cmd === 'UP' && '⬆️'}
                        {cmd === 'DOWN' && '⬇️'}
                        {cmd === 'LEFT' && '⬅️'}
                        {cmd === 'RIGHT' && '➡️'}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Feedback messages */}
              {g2Feedback === 'success' && (
                <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-900 px-5 py-2 rounded-full font-black text-base mb-3 flex items-center gap-2 animate-bounce">
                  <span>🎉 WOW! Kiko sampai! Urutan codingmu tepat!</span>
                  <button
                    onClick={() => setGameMode(3)}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-xl text-xs font-black"
                  >
                    Lanjut Game 3 ➜
                  </button>
                </div>
              )}

              {g2Feedback === 'retry' && (
                <div className="bg-amber-100 border-2 border-amber-400 text-amber-900 px-5 py-2 rounded-full font-black text-sm mb-3">
                  <span>Ayo coba susunan langkah yang lain! 😊</span>
                </div>
              )}

              {/* Command Selection Buttons & Run */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-2">
                <button
                  onClick={() => handleAddG2Command('RIGHT')}
                  disabled={g2IsRunning}
                  className="px-4 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-emerald-950 font-black text-base border-b-4 border-emerald-600 active:translate-y-1 active:border-b-0 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <ArrowRight className="w-5 h-5" /> Kanan ➡️
                </button>
                <button
                  onClick={() => handleAddG2Command('DOWN')}
                  disabled={g2IsRunning}
                  className="px-4 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-emerald-950 font-black text-base border-b-4 border-emerald-600 active:translate-y-1 active:border-b-0 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <ArrowDown className="w-5 h-5" /> Bawah ⬇️
                </button>
                <button
                  onClick={() => handleAddG2Command('UP')}
                  disabled={g2IsRunning}
                  className="px-4 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-emerald-950 font-black text-base border-b-4 border-emerald-600 active:translate-y-1 active:border-b-0 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <ArrowUp className="w-5 h-5" /> Atas ⬆️
                </button>
                <button
                  onClick={() => handleAddG2Command('LEFT')}
                  disabled={g2IsRunning}
                  className="px-4 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-emerald-950 font-black text-base border-b-4 border-emerald-600 active:translate-y-1 active:border-b-0 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" /> Kiri ⬅️
                </button>
              </div>

              {/* Big Run Button */}
              <div className="flex items-center gap-3 mt-1">
                <button
                  id="btn-run-coding-sequence"
                  onClick={handleRunG2Sequence}
                  disabled={g2IsRunning || g2Sequence.length === 0}
                  className={`px-8 py-3.5 rounded-2xl font-black text-lg sm:text-xl text-white flex items-center gap-2 border-b-6 active:translate-y-1 active:border-b-0 shadow-lg cursor-pointer ${
                    g2Sequence.length > 0 && !g2IsRunning
                      ? 'bg-blue-500 hover:bg-blue-600 border-blue-800'
                      : 'bg-slate-300 border-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span>JALANKAN 🚀</span>
                </button>

                <button
                  onClick={handleClearG2}
                  disabled={g2IsRunning}
                  className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-2xl text-xs border-b-4 border-slate-400 active:translate-y-1 active:border-b-0"
                >
                  Hapus Semua
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              SUB-GAME 3: PILIH JALAN YANG BENAR (Labirin Ramah TK A)
             ========================================================= */}
          {gameMode === 3 && (
            <div className="flex flex-col items-center">
              <div className="text-center mb-3">
                <h3 className="text-lg sm:text-xl font-black text-slate-800">
                  Permainan 3: Labirin Sungai Kiko
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-600">
                  Kiko harus menemukan jalan menuju Apel 🍎, Bintang ⭐, dan Piala 🏆 tanpa menabrak batu!
                </p>
              </div>

              {/* 4x3 Maze Grid */}
              <div className="bg-gradient-to-r from-emerald-100 via-sky-100 to-amber-100 p-4 rounded-3xl border-4 border-sky-400 shadow-inner w-full max-w-lg mb-3">
                <div className="grid grid-cols-4 gap-2.5">
                  {[0, 1, 2].map((y) =>
                    [0, 1, 2, 3].map((x) => {
                      const isKikoHere = g3KikoPos.x === x && g3KikoPos.y === y;
                      const isRock = g3Obstacles.some((o) => o.x === x && o.y === y);
                      const isApple = x === 1 && y === 1 && !g3CollectedItems.includes('apple');
                      const isStar = x === 2 && y === 1 && !g3CollectedItems.includes('star');
                      const isTrophy = x === 3 && y === 2;

                      return (
                        <div
                          key={`g3-${x}-${y}`}
                          className={`h-16 sm:h-18 rounded-2xl border-3 flex items-center justify-center relative shadow-sm ${
                            isRock
                              ? 'bg-slate-300 border-slate-500'
                              : 'bg-white border-sky-200'
                          }`}
                        >
                          {isRock && (
                            <span className="text-2xl" title="Batu Besar!">
                              🪨
                            </span>
                          )}
                          {isApple && <span className="text-3xl animate-bounce">🍎</span>}
                          {isStar && <span className="text-3xl animate-pulse">⭐</span>}
                          {isTrophy && <span className="text-3xl sm:text-4xl">🏆</span>}

                          {isKikoHere && (
                            <div className="scale-75 z-10">
                              <KikoCharacter size="sm" mood={g3Success ? 'jumping' : 'happy'} />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Feedback */}
              {g3Success ? (
                <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-900 px-6 py-2.5 rounded-full font-black text-lg mb-3 flex items-center gap-2 animate-bounce">
                  <span>🎉 HOREE! Kiko sampai ke Piala Emas!</span>
                  <button
                    onClick={handleFinishLevel3}
                    className="ml-3 px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-sm font-black shadow-md"
                  >
                    Selesaikan Level 3 🏆
                  </button>
                </div>
              ) : (
                <div className="text-xs font-bold text-slate-500 mb-2">
                  Benda terkumpul: {g3CollectedItems.length} dari 2 (Apel & Bintang)
                </div>
              )}

              {/* Direction controls */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleG3Move('UP')}
                  className="w-16 h-13 sm:w-18 sm:h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 border-b-6 border-amber-600 active:translate-y-1 active:border-b-2 flex items-center justify-center font-black shadow-md cursor-pointer"
                >
                  <ArrowUp className="w-7 h-7" />
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleG3Move('LEFT')}
                    className="w-16 h-13 sm:w-18 sm:h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 border-b-6 border-amber-600 active:translate-y-1 active:border-b-2 flex items-center justify-center font-black shadow-md cursor-pointer"
                  >
                    <ArrowLeft className="w-7 h-7" />
                  </button>
                  <button
                    onClick={() => handleG3Move('DOWN')}
                    className="w-16 h-13 sm:w-18 sm:h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 border-b-6 border-amber-600 active:translate-y-1 active:border-b-2 flex items-center justify-center font-black shadow-md cursor-pointer"
                  >
                    <ArrowDown className="w-7 h-7" />
                  </button>
                  <button
                    onClick={() => handleG3Move('RIGHT')}
                    className="w-16 h-13 sm:w-18 sm:h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 border-b-6 border-amber-600 active:translate-y-1 active:border-b-2 flex items-center justify-center font-black shadow-md cursor-pointer"
                  >
                    <ArrowRight className="w-7 h-7" />
                  </button>
                </div>
                <button
                  onClick={handleResetG3}
                  className="mt-1 text-xs font-black text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Ulangi Labirin
                </button>
              </div>
            </div>
          )}

          {/* Bottom helper actions */}
          <div className="mt-3 pt-3 border-t-2 border-slate-100 flex items-center justify-between">
            <button
              onClick={onBackToMap}
              className="text-xs sm:text-sm font-bold text-sky-800 hover:underline"
            >
              ← Kembali ke Peta
            </button>

            <button
              onClick={handleFinishLevel3}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm rounded-xl border-b-3 border-emerald-700 shadow-sm active:translate-y-0.5 active:border-b-0 flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" /> Selesai & Buka Level 4
            </button>
          </div>
        </div>
      ) : (
        /* Level 3 Completion Modal */
        <div className="w-full max-w-xl bg-white/95 rounded-3xl border-4 border-sky-400 shadow-2xl p-8 text-center my-auto">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">💻</span>
            <h2 className="text-3xl sm:text-4xl font-black text-sky-800">
              LEVEL 3 SELESAI!
            </h2>
            <span className="text-4xl">💻</span>
          </div>

          <div className="flex items-center justify-center gap-4 my-4">
            <KikoCharacter mood="cheering" size="lg" />
            <PipiCharacter size="md" />
          </div>

          <p className="text-xl sm:text-2xl font-black text-slate-800 mb-2">
            Hebat Sekali, Coder Cilik! 🚀✨
          </p>
          <p className="text-base sm:text-lg font-bold text-slate-600 mb-6">
            Kamu sudah belajar memberi perintah arah (atas, bawah, kiri, kanan), menyusun urutan langkah algoritma, dan melewati labirin!
          </p>

          <div className="inline-flex items-center gap-2 bg-amber-100 border-3 border-amber-400 px-6 py-3 rounded-2xl mb-8">
            <Star className="w-8 h-8 text-amber-500 fill-amber-400 animate-spin" />
            <span className="text-2xl font-black text-amber-950">
              +5 Bintang Coding!
            </span>
          </div>

          <div className="flex justify-center">
            <button
              id="btn-level3-lanjut-peta"
              onClick={handleConfirmFinish}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-black text-xl rounded-2xl border-b-6 border-indigo-800 shadow-lg active:translate-y-1 active:border-b-0 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>BUKA LEVEL 4 (GUA MISTERI)</span>
              <Sparkles className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
