import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Volume2, Star, Shuffle } from 'lucide-react';
import { KikoCharacter, PipiCharacter, SpeechBubble } from '../Characters';
import { sound } from '../../utils/sound';
import { shuffleArray, getRandomSubset } from '../../utils/shuffle';

interface Level1Props {
  onCompleteLevel: (levelId: number, starsEarned: number, readingPoints: number) => void;
  onBackToMap: () => void;
}

interface Question {
  id: number;
  word: string;
  imageEmoji: string;
  correctLetter: string;
  distractors: string[];
  hint: string;
}

// Master pool of Indonesian vocabulary suitable for TK A
const QUESTION_POOL: Question[] = [
  {
    id: 1,
    word: 'APEL',
    imageEmoji: '🍎',
    correctLetter: 'A',
    distractors: ['B', 'C', 'D'],
    hint: 'Apel merah manis!',
  },
  {
    id: 2,
    word: 'BOLA',
    imageEmoji: '⚽',
    correctLetter: 'B',
    distractors: ['D', 'P', 'T'],
    hint: 'Bola bulat untuk bermain!',
  },
  {
    id: 3,
    word: 'CICAK',
    imageEmoji: '🦎',
    correctLetter: 'C',
    distractors: ['G', 'O', 'S'],
    hint: 'Cicak-cicak di dinding!',
  },
  {
    id: 4,
    word: 'DADU',
    imageEmoji: '🎲',
    correctLetter: 'D',
    distractors: ['B', 'P', 'T'],
    hint: 'Dadu bermata enam!',
  },
  {
    id: 5,
    word: 'ES KRIM',
    imageEmoji: '🍧',
    correctLetter: 'E',
    distractors: ['F', 'I', 'L'],
    hint: 'Es krim dingin dan lezat!',
  },
  {
    id: 6,
    word: 'GAJAH',
    imageEmoji: '🐘',
    correctLetter: 'G',
    distractors: ['C', 'Q', 'O'],
    hint: 'Gajah yang berbelalai panjang!',
  },
  {
    id: 7,
    word: 'HARIMAU',
    imageEmoji: '🐯',
    correctLetter: 'H',
    distractors: ['M', 'N', 'K'],
    hint: 'Harimau loreng yang gagah!',
  },
  {
    id: 8,
    word: 'IKAN',
    imageEmoji: '🐟',
    correctLetter: 'I',
    distractors: ['L', 'T', 'E'],
    hint: 'Ikan berenang di dalam air!',
  },
  {
    id: 9,
    word: 'JERUK',
    imageEmoji: '🍊',
    correctLetter: 'J',
    distractors: ['U', 'L', 'I'],
    hint: 'Jeruk segar kaya vitamin C!',
  },
  {
    id: 10,
    word: 'KUDA',
    imageEmoji: '🐴',
    correctLetter: 'K',
    distractors: ['R', 'X', 'H'],
    hint: 'Kuda gagah berlari kencang!',
  },
  {
    id: 11,
    word: 'MOBIL',
    imageEmoji: '🚗',
    correctLetter: 'M',
    distractors: ['W', 'N', 'H'],
    hint: 'Mobil melaju di jalan raya!',
  },
  {
    id: 12,
    word: 'NANAS',
    imageEmoji: '🍍',
    correctLetter: 'N',
    distractors: ['M', 'H', 'U'],
    hint: 'Nanas manis bersisik cantik!',
  },
  {
    id: 13,
    word: 'PISANG',
    imageEmoji: '🍌',
    correctLetter: 'P',
    distractors: ['B', 'R', 'D'],
    hint: 'Pisang kuning kesukaan Kiko!',
  },
  {
    id: 14,
    word: 'RUSA',
    imageEmoji: '🦌',
    correctLetter: 'R',
    distractors: ['P', 'B', 'K'],
    hint: 'Rusa bertanduk indah di hutan!',
  },
  {
    id: 15,
    word: 'SAPI',
    imageEmoji: '🐄',
    correctLetter: 'S',
    distractors: ['C', 'Z', 'G'],
    hint: 'Sapi ramah penghasil susu sehat!',
  },
  {
    id: 16,
    word: 'TOPI',
    imageEmoji: '🧢',
    correctLetter: 'T',
    distractors: ['I', 'F', 'L'],
    hint: 'Topi keren pelindung dari sinar matahari!',
  },
  {
    id: 17,
    word: 'ULAR',
    imageEmoji: '🐍',
    correctLetter: 'U',
    distractors: ['V', 'W', 'O'],
    hint: 'Ular meliuk-liuk di ranting!',
  },
];

interface PreparedQuestion {
  id: number;
  word: string;
  imageEmoji: string;
  correctLetter: string;
  options: string[]; // Always randomized
  hint: string;
}

/**
 * Generate 5 randomized questions with shuffled options for each
 */
function prepareRandomQuestions(): PreparedQuestion[] {
  const selectedPool = getRandomSubset(QUESTION_POOL, 5);
  return selectedPool.map((q) => {
    // Pick 2 random distractors + the correct letter
    const chosenDistractors = getRandomSubset(q.distractors, 2);
    const options = shuffleArray([q.correctLetter, ...chosenDistractors]);
    return {
      id: q.id,
      word: q.word,
      imageEmoji: q.imageEmoji,
      correctLetter: q.correctLetter,
      options,
      hint: q.hint,
    };
  });
}

export const Level1HutanHuruf: React.FC<Level1Props> = ({
  onCompleteLevel,
  onBackToMap,
}) => {
  // Shuffled questions and shuffled options state
  const [questions, setQuestions] = useState<PreparedQuestion[]>(() => prepareRandomQuestions());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ status: 'idle' | 'correct' | 'retry'; message: string }>({
    status: 'idle',
    message: '',
  });
  const [starsThisLevel, setStarsThisLevel] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = questions[currentIdx] || questions[0];

  // User action to shuffle all questions anew
  const handleShuffleNewQuestions = () => {
    sound.playPop();
    const newQuestions = prepareRandomQuestions();
    setQuestions(newQuestions);
    setCurrentIdx(0);
    setSelectedOption(null);
    setFeedback({ status: 'idle', message: '' });
    sound.speak('Soal baru telah diacak!');
  };

  const handleSelectOption = (letter: string) => {
    if (feedback.status === 'correct') return; // already answered this question

    sound.playPop();
    setSelectedOption(letter);

    if (letter === currentQ.correctLetter) {
      // Correct answer
      sound.playSuccess();
      sound.speak(`Hebat! Huruf ${letter}! Kamu pintar sekali!`);
      setStarsThisLevel((prev) => prev + 1);
      setFeedback({
        status: 'correct',
        message: `🎉 HEBAT! Huruf ${letter} benar!`,
      });

      // Small confetti puff for encouragement
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Confetti fallback
      }

      // Automatically transition to next question or complete level
      setTimeout(() => {
        if (currentIdx < questions.length - 1) {
          setCurrentIdx((prev) => prev + 1);
          setSelectedOption(null);
          setFeedback({ status: 'idle', message: '' });
        } else {
          // Finished level 1!
          sound.playFanfare();
          sound.speak('Luar biasa! Hutan Huruf selesai! Kamu dapat bintang!');
          setIsCompleted(true);
          try {
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 },
            });
          } catch {
            // Confetti fallback
          }
        }
      }, 1400);
    } else {
      // Friendly encouragement - never say "SALAH"
      sound.playTryAgain();
      sound.speak('Coba lagi, Petualang!');
      setFeedback({
        status: 'retry',
        message: 'Coba lagi, Petualang! 😊',
      });
      setTimeout(() => {
        setSelectedOption(null);
        setFeedback({ status: 'idle', message: '' });
      }, 1600);
    }
  };

  const handleFinish = () => {
    onCompleteLevel(1, Math.max(starsThisLevel, 5), 5);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-gradient-to-b from-emerald-100 via-green-50 to-amber-100 p-4 sm:p-8 flex flex-col items-center justify-between">
      {/* Top Level Bar */}
      <div className="w-full max-w-2xl flex flex-wrap items-center justify-between bg-white/95 backdrop-blur-sm border-3 border-emerald-300 rounded-3xl px-5 py-3 shadow-sm mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">🌳</span>
          <div>
            <span className="text-xs font-black text-emerald-600 uppercase tracking-wide">
              LEVEL 1 • SOAL & JAWABAN DIACAK
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-800">HUTAN HURUF</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Question Counter */}
          <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-2xl border-2 border-emerald-200">
            <span className="font-extrabold text-xs sm:text-sm text-emerald-800">
              Soal {currentIdx + 1}/{questions.length}
            </span>
            <div className="flex gap-1 ml-1">
              {questions.map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full ${
                    i < currentIdx
                      ? 'bg-emerald-500'
                      : i === currentIdx
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Shuffle Questions Button */}
          <button
            onClick={handleShuffleNewQuestions}
            title="Acak Soal Baru"
            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300 rounded-2xl font-black text-xs flex items-center gap-1 transition active:scale-95 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Acak Soal</span>
          </button>
        </div>
      </div>

      {/* Main Game Container */}
      {!isCompleted ? (
        <div className="w-full max-w-2xl bg-white/95 rounded-3xl border-4 border-emerald-300 shadow-2xl p-6 sm:p-8 text-center flex-1 flex flex-col justify-between my-2">
          {/* Kiko's Speech Bubble */}
          <div className="flex items-start justify-center gap-3 mb-4">
            <KikoCharacter
              mood={feedback.status === 'correct' ? 'jumping' : 'happy'}
              size="md"
            />
            <div className="flex-1 text-left">
              <SpeechBubble
                speaker="kiko"
                text="Bantu Kiko mencari huruf awal yang cocok! Soal dan posisi jawaban selalu diacak lho!"
              />
            </div>
          </div>

          {/* Question Visual Card */}
          <div className="bg-gradient-to-b from-amber-50 to-yellow-50 rounded-3xl p-6 border-3 border-amber-200 shadow-inner my-2 flex flex-col items-center justify-center">
            {/* Big Picture Emoji with Animation */}
            <div
              className={`w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white shadow-md border-3 border-amber-300 flex items-center justify-center text-6xl sm:text-7xl mb-4 transition-transform duration-300 ${
                feedback.status === 'correct' ? 'scale-110 rotate-6' : 'hover:scale-105'
              }`}
            >
              <span>{currentQ.imageEmoji}</span>
            </div>

            {/* Prompt Text */}
            <h3 className="text-xl sm:text-3xl font-black text-slate-800 mb-1">
              <span className="text-emerald-700 underline decoration-emerald-300">
                {currentQ.word}
              </span>{' '}
              dimulai dengan huruf...
            </h3>
            <p className="text-sm font-bold text-slate-500">
              {currentQ.hint}
            </p>
          </div>

          {/* Feedback Display */}
          <div className="min-h-10 flex items-center justify-center my-2">
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

          {/* Big Option Buttons: 3 Shuffled Choices */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-2">
            {currentQ.options.map((letter, optIdx) => {
              const isSelected = selectedOption === letter;
              const isCorrect = feedback.status === 'correct' && letter === currentQ.correctLetter;

              return (
                <button
                  key={`${currentQ.id}-${letter}-${optIdx}`}
                  id={`btn-letter-${letter}`}
                  onClick={() => handleSelectOption(letter)}
                  disabled={feedback.status === 'correct'}
                  className={`py-5 sm:py-7 rounded-3xl text-4xl sm:text-6xl font-black transition-all duration-150 border-b-8 active:translate-y-2 active:border-b-2 shadow-lg cursor-pointer ${
                    isCorrect
                      ? 'bg-emerald-500 border-emerald-700 text-white scale-105 animate-bounce'
                      : isSelected && feedback.status === 'retry'
                      ? 'bg-amber-300 border-amber-500 text-amber-950'
                      : 'bg-gradient-to-b from-sky-400 to-blue-500 border-blue-700 text-white hover:from-sky-500 hover:to-blue-600'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Celebration Dialog after completing Level 1 */
        <div className="w-full max-w-xl bg-white/95 rounded-3xl border-4 border-emerald-400 shadow-2xl p-8 text-center my-auto">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">🎉</span>
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-800">
              LEVEL 1 SELESAI!
            </h2>
            <span className="text-4xl">🎉</span>
          </div>

          <div className="flex items-center justify-center gap-4 my-4">
            <KikoCharacter mood="cheering" size="lg" />
            <PipiCharacter size="md" />
          </div>

          <p className="text-xl sm:text-2xl font-black text-slate-800 mb-2">
            Hebat, Petualang Cilik! 🌟
          </p>
          <p className="text-base sm:text-lg font-bold text-slate-600 mb-6">
            Kamu berhasil mengenal huruf awal dengan sangat baik!
          </p>

          <div className="inline-flex items-center gap-2 bg-amber-100 border-3 border-amber-400 px-6 py-3 rounded-2xl mb-8">
            <Star className="w-8 h-8 text-amber-500 fill-amber-400 animate-spin" />
            <span className="text-2xl font-black text-amber-950">
              +5 Bintang Petualang!
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="btn-level1-lanjut-peta"
              onClick={handleFinish}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xl rounded-2xl border-b-6 border-emerald-800 shadow-lg active:translate-y-1 active:border-b-0 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>BUKA LEVEL 2 (TAMAN MEMBACA)</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom helper */}
      <div className="w-full max-w-2xl flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600 px-2 mt-2">
        <button
          onClick={onBackToMap}
          className="hover:underline text-emerald-800 flex items-center gap-1"
        >
          ← Kembali ke Peta
        </button>
        <span>Petualangan TK A • Soal & Jawaban Diacak</span>
      </div>
    </div>
  );
};
