import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, ArrowRight, Star, Shuffle } from 'lucide-react';
import { KikoCharacter, PipiCharacter, SpeechBubble } from '../Characters';
import { sound } from '../../utils/sound';
import { shuffleArray, getRandomSubset } from '../../utils/shuffle';

interface Level2Props {
  onCompleteLevel: (levelId: number, starsEarned: number, readingPoints: number) => void;
  onBackToMap: () => void;
}

type ActivityType = 'match_image' | 'choose_word' | 'merge_syllables' | 'family_word' | 'word_match';

interface Level2Option {
  id: string;
  text: string;
  emoji: string;
  isCorrect: boolean;
}

interface Level2ActivityRaw {
  id: number;
  type: ActivityType;
  title: string;
  instruction: string;
  syllable1?: string;
  syllable2?: string;
  fullWord?: string;
  options: Level2Option[];
}

interface Level2ActivityPrepared extends Level2ActivityRaw {
  options: Level2Option[]; // Shuffled!
}

// Master pool of reading & syllable challenges for TK A
const MASTER_ACTIVITIES: Level2ActivityRaw[] = [
  {
    id: 1,
    type: 'match_image',
    title: 'Suku Kata Awal "BA"',
    instruction: 'Gambar mana yang dimulai dengan bunyi BA?',
    syllable1: 'BA',
    options: [
      { id: 'baju', text: 'BAJU', emoji: '👕', isCorrect: true },
      { id: 'kucing', text: 'KUCING', emoji: '🐱', isCorrect: false },
      { id: 'ikan', text: 'IKAN', emoji: '🐟', isCorrect: false },
    ],
  },
  {
    id: 2,
    type: 'choose_word',
    title: 'Suku Kata: BO – LA',
    instruction: 'Jika BO dan LA digabung, menjadi kata apa?',
    syllable1: 'BO',
    syllable2: 'LA',
    options: [
      { id: 'bola', text: 'BOLA', emoji: '⚽', isCorrect: true },
      { id: 'bebek', text: 'BEBEK', emoji: '🦆', isCorrect: false },
      { id: 'buku', text: 'BUKU', emoji: '📖', isCorrect: false },
    ],
  },
  {
    id: 3,
    type: 'merge_syllables',
    title: 'Satukan: BU + KU',
    instruction: 'Sentuh kedua suku kata untuk menyatukan menjadi kata BUKU!',
    syllable1: 'BU',
    syllable2: 'KU',
    fullWord: 'BUKU',
    options: [
      { id: 'buku', text: 'BUKU', emoji: '📖', isCorrect: true },
      { id: 'kaki', text: 'KAKI', emoji: '🦶', isCorrect: false },
      { id: 'sapi', text: 'SAPI', emoji: '🐄', isCorrect: false },
    ],
  },
  {
    id: 4,
    type: 'family_word',
    title: 'Kata Sayang: MA – MA',
    instruction: 'Ayo baca bersama: MA – MA menjadi apa?',
    syllable1: 'MA',
    syllable2: 'MA',
    options: [
      { id: 'mama', text: 'MAMA', emoji: '👩', isCorrect: true },
      { id: 'papa', text: 'PAPA', emoji: '👨', isCorrect: false },
      { id: 'topi', text: 'TOPI', emoji: '🧢', isCorrect: false },
    ],
  },
  {
    id: 5,
    type: 'word_match',
    title: 'Suku Kata: TO – PI',
    instruction: 'Pilih gambar yang cocok untuk kata TO – PI!',
    syllable1: 'TO',
    syllable2: 'PI',
    options: [
      { id: 'topi', text: 'TOPI', emoji: '🧢', isCorrect: true },
      { id: 'sapi', text: 'SAPI', emoji: '🐄', isCorrect: false },
      { id: 'kaki', text: 'KAKI', emoji: '🦶', isCorrect: false },
    ],
  },
  {
    id: 6,
    type: 'match_image',
    title: 'Suku Kata Awal "SA"',
    instruction: 'Gambar mana yang dimulai dengan bunyi SA?',
    syllable1: 'SA',
    options: [
      { id: 'sapi', text: 'SAPI', emoji: '🐄', isCorrect: true },
      { id: 'kuda', text: 'KUDA', emoji: '🐴', isCorrect: false },
      { id: 'bebek', text: 'BEBEK', emoji: '🦆', isCorrect: false },
    ],
  },
  {
    id: 7,
    type: 'choose_word',
    title: 'Suku Kata: KU – DA',
    instruction: 'Jika KU dan DA digabung, menjadi kata apa?',
    syllable1: 'KU',
    syllable2: 'DA',
    options: [
      { id: 'kuda', text: 'KUDA', emoji: '🐴', isCorrect: true },
      { id: 'kaki', text: 'KAKI', emoji: '🦶', isCorrect: false },
      { id: 'kucing', text: 'KUCING', emoji: '🐱', isCorrect: false },
    ],
  },
  {
    id: 8,
    type: 'merge_syllables',
    title: 'Satukan: MA + TA',
    instruction: 'Sentuh suku kata MA dan TA untuk menyatukan menjadi MATA!',
    syllable1: 'MA',
    syllable2: 'TA',
    fullWord: 'MATA',
    options: [
      { id: 'mata', text: 'MATA', emoji: '👀', isCorrect: true },
      { id: 'madu', text: 'MADU', emoji: '🍯', isCorrect: false },
      { id: 'mobil', text: 'MOBIL', emoji: '🚗', isCorrect: false },
    ],
  },
  {
    id: 9,
    type: 'choose_word',
    title: 'Suku Kata: RO – TI',
    instruction: 'Jika RO dan TI digabung, menjadi makanan apa?',
    syllable1: 'RO',
    syllable2: 'TI',
    options: [
      { id: 'roti', text: 'ROTI', emoji: '🍞', isCorrect: true },
      { id: 'rusa', text: 'RUSA', emoji: '🦌', isCorrect: false },
      { id: 'roda', text: 'RODA', emoji: '🛞', isCorrect: false },
    ],
  },
  {
    id: 10,
    type: 'word_match',
    title: 'Suku Kata: KA – KI',
    instruction: 'Pilih gambar yang cocok untuk kata KA – KI!',
    syllable1: 'KA',
    syllable2: 'KI',
    options: [
      { id: 'kaki', text: 'KAKI', emoji: '🦶', isCorrect: true },
      { id: 'kucing', text: 'KUCING', emoji: '🐱', isCorrect: false },
      { id: 'baju', text: 'BAJU', emoji: '👕', isCorrect: false },
    ],
  },
];

/**
 * Prepares randomized activities and shuffles the options inside each activity
 */
function prepareRandomActivities(): Level2ActivityPrepared[] {
  const selected = getRandomSubset(MASTER_ACTIVITIES, 5);
  return selected.map((act) => ({
    ...act,
    // Shuffle the answer options so correct answer is randomly in slot 0, 1, or 2
    options: shuffleArray(act.options),
  }));
}

export const Level2TamanMembaca: React.FC<Level2Props> = ({
  onCompleteLevel,
  onBackToMap,
}) => {
  // State holds randomized activities with shuffled options
  const [activities, setActivities] = useState<Level2ActivityPrepared[]>(() => prepareRandomActivities());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [merged, setMerged] = useState(false);
  const [feedback, setFeedback] = useState<{ status: 'idle' | 'correct' | 'retry'; message: string }>({
    status: 'idle',
    message: '',
  });
  const [starsThisLevel, setStarsThisLevel] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentAct = activities[currentIdx] || activities[0];

  // Manual shuffle of activities & answers
  const handleShuffleNewActivities = () => {
    sound.playPop();
    const newActs = prepareRandomActivities();
    setActivities(newActs);
    setCurrentIdx(0);
    setSelectedOptId(null);
    setMerged(false);
    setFeedback({ status: 'idle', message: '' });
    sound.speak('Aktivitas membaca baru telah diacak!');
  };

  const handleSelectOption = (opt: Level2Option) => {
    if (feedback.status === 'correct') return;

    sound.playPop();
    setSelectedOptId(opt.id);

    if (opt.isCorrect) {
      sound.playSuccess();
      sound.speak(`Hebat! ${opt.text}! Kamu pintar sekali!`);
      setStarsThisLevel((prev) => prev + 1);
      setFeedback({
        status: 'correct',
        message: `🎉 HEBAT! ${opt.text}!`,
      });

      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Fallback
      }

      setTimeout(() => {
        if (currentIdx < activities.length - 1) {
          setCurrentIdx((prev) => prev + 1);
          setSelectedOptId(null);
          setMerged(false);
          setFeedback({ status: 'idle', message: '' });
        } else {
          sound.playFanfare();
          sound.speak('Luar biasa! Taman Membaca selesai! Kamu hebat membaca suku kata!');
          setIsCompleted(true);
          try {
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 },
            });
          } catch {
            // Fallback
          }
        }
      }, 1500);
    } else {
      sound.playTryAgain();
      sound.speak('Coba lagi, Petualang! Cari yang bunyinya cocok ya!');
      setFeedback({
        status: 'retry',
        message: 'Coba lagi, Petualang! 😊',
      });
      setTimeout(() => {
        setSelectedOptId(null);
        setFeedback({ status: 'idle', message: '' });
      }, 1600);
    }
  };

  const handleReadSyllable = (text: string) => {
    sound.playPop();
    sound.speak(text);
  };

  const handleFinish = () => {
    onCompleteLevel(2, Math.max(starsThisLevel, 5), 5);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-gradient-to-b from-rose-100 via-pink-50 to-amber-100 p-4 sm:p-8 flex flex-col items-center justify-between">
      {/* Top Header Bar */}
      <div className="w-full max-w-2xl flex flex-wrap items-center justify-between bg-white/95 backdrop-blur-sm border-3 border-pink-300 rounded-3xl px-5 py-3 shadow-sm mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">🌸</span>
          <div>
            <span className="text-xs font-black text-pink-600 uppercase tracking-wide">
              LEVEL 2 • SOAL & JAWABAN DIACAK
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-800">TAMAN MEMBACA</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Activity Counter */}
          <div className="flex items-center gap-1.5 bg-pink-50 px-3.5 py-1.5 rounded-2xl border-2 border-pink-200">
            <span className="font-extrabold text-xs sm:text-sm text-pink-800">
              Soal {currentIdx + 1}/{activities.length}
            </span>
            <div className="flex gap-1 ml-1">
              {activities.map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full ${
                    i < currentIdx
                      ? 'bg-pink-500'
                      : i === currentIdx
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Shuffle Button */}
          <button
            onClick={handleShuffleNewActivities}
            title="Acak Soal Baru"
            className="px-3 py-1.5 bg-pink-100 hover:bg-pink-200 text-pink-900 border-2 border-pink-300 rounded-2xl font-black text-xs flex items-center gap-1 transition active:scale-95 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Acak Soal</span>
          </button>
        </div>
      </div>

      {/* Main Activity Card */}
      {!isCompleted ? (
        <div className="w-full max-w-2xl bg-white/95 rounded-3xl border-4 border-pink-300 shadow-2xl p-6 sm:p-8 text-center flex-1 flex flex-col justify-between my-2">
          {/* Character Speech */}
          <div className="flex items-start justify-center gap-3 mb-3">
            <KikoCharacter
              mood={feedback.status === 'correct' ? 'jumping' : 'happy'}
              size="md"
            />
            <div className="flex-1 text-left">
              <SpeechBubble
                speaker="kiko"
                text="Ayo membaca bersama Kiko di taman bunga! Pilihan jawaban selalu diacak lho!"
              />
            </div>
          </div>

          {/* Reading Display Area */}
          <div className="bg-gradient-to-b from-pink-50 to-rose-50 rounded-3xl p-6 border-3 border-pink-200 shadow-inner my-2">
            <h3 className="text-lg sm:text-xl font-black text-slate-700 mb-3">
              {currentAct.instruction}
            </h3>

            {/* Syllable Cards Display */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 my-3 flex-wrap">
              {currentAct.syllable1 && (
                <button
                  type="button"
                  onClick={() => handleReadSyllable(currentAct.syllable1!)}
                  className="px-6 py-4 rounded-2xl bg-white border-4 border-pink-400 shadow-md text-3xl sm:text-5xl font-black text-pink-600 hover:scale-105 active:scale-95 transition flex items-center gap-2 cursor-pointer"
                  title="Klik untuk mendengar suara"
                >
                  <span>{currentAct.syllable1}</span>
                  <Volume2 className="w-5 h-5 text-pink-400" />
                </button>
              )}

              {currentAct.syllable2 && (
                <>
                  <span className="text-3xl font-black text-pink-400">+</span>
                  <button
                    type="button"
                    onClick={() => handleReadSyllable(currentAct.syllable2!)}
                    className="px-6 py-4 rounded-2xl bg-white border-4 border-rose-400 shadow-md text-3xl sm:text-5xl font-black text-rose-600 hover:scale-105 active:scale-95 transition flex items-center gap-2 cursor-pointer"
                    title="Klik untuk mendengar suara"
                  >
                    <span>{currentAct.syllable2}</span>
                    <Volume2 className="w-5 h-5 text-rose-400" />
                  </button>
                </>
              )}
            </div>

            {/* Syllable merge animation if applicable */}
            {currentAct.type === 'merge_syllables' && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    sound.speak(`${currentAct.syllable1} tambah ${currentAct.syllable2} sama dengan ${currentAct.fullWord}`);
                    setMerged(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl border-b-4 border-amber-600 text-sm active:translate-y-1 active:border-b-0 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Tekan untuk Satukan: {currentAct.syllable1} + {currentAct.syllable2} = {currentAct.fullWord}!</span>
                </button>
              </div>
            )}
          </div>

          {/* Feedback Bar */}
          <div className="min-h-10 flex items-center justify-center my-1">
            {feedback.status === 'correct' && (
              <div className="inline-flex items-center gap-2 bg-emerald-100 border-2 border-emerald-400 text-emerald-900 px-6 py-2 rounded-full font-black text-lg sm:text-xl animate-bounce">
                <span>{feedback.message}</span>
              </div>
            )}
            {feedback.status === 'retry' && (
              <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-400 text-amber-900 px-6 py-2 rounded-full font-black text-lg sm:text-xl">
                <span>{feedback.message}</span>
              </div>
            )}
          </div>

          {/* Shuffled Options Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-2">
            {currentAct.options.map((opt, optIdx) => {
              const isSelected = selectedOptId === opt.id;
              const isCorrect = feedback.status === 'correct' && opt.isCorrect;

              return (
                <button
                  key={`${currentAct.id}-${opt.id}-${optIdx}`}
                  id={`btn-reading-opt-${opt.id}`}
                  onClick={() => handleSelectOption(opt)}
                  disabled={feedback.status === 'correct'}
                  className={`p-4 sm:p-5 rounded-3xl flex flex-col items-center justify-center transition-all duration-150 border-b-8 active:translate-y-2 active:border-b-2 shadow-lg cursor-pointer ${
                    isCorrect
                      ? 'bg-emerald-500 border-emerald-700 text-white scale-105 animate-bounce'
                      : isSelected && feedback.status === 'retry'
                      ? 'bg-amber-300 border-amber-500 text-amber-950'
                      : 'bg-gradient-to-b from-amber-300 to-yellow-400 border-yellow-600 text-amber-950 hover:from-amber-400 hover:to-yellow-500'
                  }`}
                >
                  <span className="text-4xl sm:text-5xl mb-1.5">{opt.emoji}</span>
                  <span className="text-lg sm:text-2xl font-black">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Level 2 Completion Modal */
        <div className="w-full max-w-xl bg-white/95 rounded-3xl border-4 border-pink-400 shadow-2xl p-8 text-center my-auto">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">🌸</span>
            <h2 className="text-3xl sm:text-4xl font-black text-pink-700">
              LEVEL 2 SELESAI!
            </h2>
            <span className="text-4xl">🌸</span>
          </div>

          <div className="flex items-center justify-center gap-4 my-4">
            <KikoCharacter mood="cheering" size="lg" />
            <PipiCharacter size="md" />
          </div>

          <p className="text-xl sm:text-2xl font-black text-slate-800 mb-2">
            Luar Biasa, Jago Membaca! 📖✨
          </p>
          <p className="text-base sm:text-lg font-bold text-slate-600 mb-6">
            Kamu sudah bisa membaca suku kata dan kata bergambar bersama Kiko!
          </p>

          <div className="inline-flex items-center gap-2 bg-amber-100 border-3 border-amber-400 px-6 py-3 rounded-2xl mb-8">
            <Star className="w-8 h-8 text-amber-500 fill-amber-400 animate-spin" />
            <span className="text-2xl font-black text-amber-950">
              +5 Bintang Petualang!
            </span>
          </div>

          <div className="flex justify-center">
            <button
              id="btn-level2-lanjut-peta"
              onClick={handleFinish}
              className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black text-xl rounded-2xl border-b-6 border-blue-800 shadow-lg active:translate-y-1 active:border-b-0 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>BUKA LEVEL 3 (SUNGAI CODING)</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Footer back button */}
      <div className="w-full max-w-2xl flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600 px-2 mt-2">
        <button
          onClick={onBackToMap}
          className="hover:underline text-pink-800 flex items-center gap-1"
        >
          ← Kembali ke Peta
        </button>
        <span>Petualangan TK A • Soal & Jawaban Diacak</span>
      </div>
    </div>
  );
};
