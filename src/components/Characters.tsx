import React from 'react';
import { Volume2 } from 'lucide-react';
import { sound } from '../utils/sound';

interface KikoProps {
  mood?: 'happy' | 'jumping' | 'thinking' | 'cheering' | 'waving';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const KikoCharacter: React.FC<KikoProps> = ({
  mood = 'happy',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
    xl: 'w-56 h-56',
  };

  const isJumping = mood === 'jumping' || mood === 'cheering';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${
        isJumping ? 'animate-cute-jump' : 'animate-cute-bob'
      } ${className}`}
    >
      <svg
        viewBox="0 0 160 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Shadow */}
        <ellipse cx="80" cy="170" rx="42" ry="7" fill="rgba(0,0,0,0.12)" />

        {/* Explorer Backpack Straps & Pack */}
        <rect
          x="35"
          y="85"
          width="90"
          height="55"
          rx="18"
          fill="#3B82F6"
          stroke="#1D4ED8"
          strokeWidth="3.5"
        />
        <rect
          x="48"
          y="95"
          width="64"
          height="32"
          rx="8"
          fill="#60A5FA"
          stroke="#1D4ED8"
          strokeWidth="2.5"
        />
        {/* Backpack buckle */}
        <circle cx="80" cy="111" r="6" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />

        {/* Bunny Left Ear */}
        <g transform="rotate(-10 60 40)">
          <path
            d="M 50 65 C 38 45 42 10 58 10 C 72 10 74 45 66 65 Z"
            fill="#FFFFFF"
            stroke="#E2E8F0"
            strokeWidth="3.5"
          />
          <path
            d="M 52 58 C 45 42 48 20 58 20 C 67 20 68 42 63 58 Z"
            fill="#F472B6"
            opacity="0.75"
          />
        </g>

        {/* Bunny Right Ear */}
        <g transform="rotate(10 100 40)">
          <path
            d="M 94 65 C 86 45 88 10 102 10 C 118 10 122 45 110 65 Z"
            fill="#FFFFFF"
            stroke="#E2E8F0"
            strokeWidth="3.5"
          />
          <path
            d="M 97 58 C 92 42 93 20 102 20 C 112 20 115 42 108 58 Z"
            fill="#F472B6"
            opacity="0.75"
          />
        </g>

        {/* Bunny Body */}
        <ellipse
          cx="80"
          cy="128"
          rx="38"
          ry="34"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="3.5"
        />
        {/* Tummy */}
        <ellipse cx="80" cy="132" rx="22" ry="20" fill="#FEF3C7" />

        {/* Bunny Feet */}
        <ellipse
          cx="58"
          cy="162"
          rx="16"
          ry="9"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="3"
        />
        <ellipse cx="58" cy="162" rx="9" ry="5" fill="#FBCFE8" />

        <ellipse
          cx="102"
          cy="162"
          rx="16"
          ry="9"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="3"
        />
        <ellipse cx="102" cy="162" rx="9" ry="5" fill="#FBCFE8" />

        {/* Bunny Head */}
        <ellipse
          cx="80"
          cy="75"
          rx="44"
          ry="38"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="3.5"
        />

        {/* Explorer Scarf */}
        <path
          d="M 52 100 Q 80 112 108 100 Q 80 106 52 100 Z"
          fill="#EF4444"
          stroke="#B91C1C"
          strokeWidth="2.5"
        />
        <path
          d="M 88 104 L 98 122 L 86 118 Z"
          fill="#EF4444"
          stroke="#B91C1C"
          strokeWidth="2"
        />

        {/* Cheeks */}
        <circle cx="53" cy="84" r="8" fill="#FDA4AF" opacity="0.8" />
        <circle cx="107" cy="84" r="8" fill="#FDA4AF" opacity="0.8" />

        {/* Big Sparkling Eyes */}
        {mood === 'cheering' ? (
          // Happy squinting closed eyes ^ ^
          <>
            <path
              d="M 56 74 Q 65 65 74 74"
              fill="none"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 86 74 Q 95 65 104 74"
              fill="none"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        ) : (
          // Big shiny round eyes
          <>
            <circle cx="65" cy="72" r="7" fill="#1E293B" />
            <circle cx="63" cy="69" r="2.8" fill="#FFFFFF" />
            <circle cx="68" cy="74" r="1.4" fill="#FFFFFF" />

            <circle cx="95" cy="72" r="7" fill="#1E293B" />
            <circle cx="93" cy="69" r="2.8" fill="#FFFFFF" />
            <circle cx="98" cy="74" r="1.4" fill="#FFFFFF" />
          </>
        )}

        {/* Cute Bunny Nose */}
        <path
          d="M 77 82 L 83 82 L 80 86 Z"
          fill="#F43F5E"
          stroke="#E11D48"
          strokeWidth="1.5"
        />

        {/* Bunny Mouth */}
        <path
          d="M 74 88 Q 80 94 80 87 Q 80 94 86 88"
          fill="none"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Whiskers */}
        <path d="M 44 80 L 30 78" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 44 84 L 32 87" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 116 80 L 130 78" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 116 84 L 128 87" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

        {/* Hands / Paws */}
        {mood === 'waving' || mood === 'cheering' ? (
          <>
            {/* Waving Paw up */}
            <ellipse
              cx="38"
              cy="70"
              rx="9"
              ry="12"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="3"
              transform="rotate(-30 38 70)"
            />
            {/* Right Paw holding strap */}
            <ellipse
              cx="115"
              cy="115"
              rx="9"
              ry="10"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="3"
            />
          </>
        ) : (
          <>
            <ellipse
              cx="45"
              cy="115"
              rx="9"
              ry="10"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="3"
            />
            <ellipse
              cx="115"
              cy="115"
              rx="9"
              ry="10"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="3"
            />
          </>
        )}
      </svg>
    </div>
  );
};

interface PipiProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PipiCharacter: React.FC<PipiProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} animate-cute-bob ${className}`}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Shadow */}
        <ellipse cx="60" cy="112" rx="28" ry="5" fill="rgba(0,0,0,0.12)" />

        {/* Pipi Little Feet */}
        <path d="M 48 98 L 48 108 M 42 108 L 52 108" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
        <path d="M 72 98 L 72 108 M 66 108 L 76 108" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />

        {/* Head Feather Tuft */}
        <path
          d="M 60 20 Q 56 10 50 14 Q 58 22 58 28"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="2"
        />

        {/* Round Yellow Body */}
        <circle
          cx="60"
          cy="65"
          r="38"
          fill="#FDE047"
          stroke="#EAB308"
          strokeWidth="3.5"
        />

        {/* Soft Tummy */}
        <ellipse cx="60" cy="74" rx="22" ry="18" fill="#FEF08A" />

        {/* Flapping Wing holding Map */}
        <g className="animate-wing-flap origin-bottom-left">
          <ellipse
            cx="28"
            cy="68"
            rx="14"
            ry="9"
            fill="#FACC15"
            stroke="#CA8A04"
            strokeWidth="2.5"
            transform="rotate(20 28 68)"
          />
        </g>

        {/* Right Wing */}
        <ellipse
          cx="90"
          cy="68"
          rx="12"
          ry="9"
          fill="#FACC15"
          stroke="#CA8A04"
          strokeWidth="2.5"
          transform="rotate(-20 90 68)"
        />

        {/* Cheeks */}
        <circle cx="44" cy="66" r="6" fill="#F87171" opacity="0.75" />
        <circle cx="76" cy="66" r="6" fill="#F87171" opacity="0.75" />

        {/* Cute Eyes */}
        <circle cx="50" cy="56" r="5" fill="#1E293B" />
        <circle cx="48.5" cy="54.5" r="2" fill="#FFFFFF" />

        <circle cx="70" cy="56" r="5" fill="#1E293B" />
        <circle cx="68.5" cy="54.5" r="2" fill="#FFFFFF" />

        {/* Orange Beak */}
        <path
          d="M 55 60 L 65 60 L 60 70 Z"
          fill="#F97316"
          stroke="#C2410C"
          strokeWidth="2"
        />

        {/* Little Rolled Adventure Map in hand */}
        <g transform="translate(14, 62) rotate(-15)">
          <rect
            x="0"
            y="0"
            width="24"
            height="16"
            rx="3"
            fill="#FEF3C7"
            stroke="#D97706"
            strokeWidth="2"
          />
          {/* Map details: Red X mark & dotted path */}
          <path d="M 4 8 Q 10 4 14 12" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M 16 8 L 20 12 M 20 8 L 16 12" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

interface TreasureChestProps {
  isOpen?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const TreasureChest: React.FC<TreasureChestProps> = ({
  isOpen = false,
  size = 'lg',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-20 h-16',
    md: 'w-32 h-24',
    lg: 'w-48 h-36',
    xl: 'w-64 h-48',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${
        isOpen ? 'animate-pulse-glow' : 'animate-cute-bob'
      } ${className}`}
    >
      <svg
        viewBox="0 0 180 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        {/* Glow if opened */}
        {isOpen && (
          <g>
            <circle cx="90" cy="70" r="60" fill="#FDE047" opacity="0.35" />
            {/* Sparkles */}
            <path
              d="M 90 10 L 93 25 L 108 28 L 93 31 L 90 46 L 87 31 L 72 28 L 87 25 Z"
              fill="#FEF08A"
            />
            <path
              d="M 40 30 L 42 40 L 52 42 L 42 44 L 40 54 L 38 44 L 28 42 L 38 40 Z"
              fill="#FDE047"
            />
            <path
              d="M 145 35 L 147 43 L 155 45 L 147 47 L 145 55 L 143 47 L 135 45 L 143 43 Z"
              fill="#FDE047"
            />
          </g>
        )}

        {/* Chest Base */}
        <rect
          x="25"
          y="70"
          width="130"
          height="55"
          rx="10"
          fill="#92400E"
          stroke="#451A03"
          strokeWidth="4"
        />

        {/* Wood planks texture */}
        <line x1="26" y1="88" x2="154" y2="88" stroke="#78350F" strokeWidth="2.5" />
        <line x1="26" y1="106" x2="154" y2="106" stroke="#78350F" strokeWidth="2.5" />

        {/* Golden Straps Vertical */}
        <rect
          x="44"
          y="70"
          width="16"
          height="55"
          fill="#F59E0B"
          stroke="#B45309"
          strokeWidth="3"
        />
        <rect
          x="120"
          y="70"
          width="16"
          height="55"
          fill="#F59E0B"
          stroke="#B45309"
          strokeWidth="3"
        />

        {/* Golden studs */}
        <circle cx="52" cy="78" r="2.5" fill="#FEF3C7" />
        <circle cx="52" cy="118" r="2.5" fill="#FEF3C7" />
        <circle cx="128" cy="78" r="2.5" fill="#FEF3C7" />
        <circle cx="128" cy="118" r="2.5" fill="#FEF3C7" />

        {isOpen ? (
          <>
            {/* Overflowing Gold Coins & Gems */}
            <g>
              <ellipse cx="65" cy="65" rx="14" ry="9" fill="#FACC15" stroke="#B45309" strokeWidth="2" />
              <ellipse cx="90" cy="60" rx="18" ry="11" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
              <ellipse cx="115" cy="65" rx="14" ry="9" fill="#FACC15" stroke="#B45309" strokeWidth="2" />

              {/* Rubies & Emeralds */}
              <polygon points="75,52 82,45 89,52 82,59" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
              <polygon points="100,50 108,44 116,50 108,56" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
              <circle cx="90" cy="45" r="7" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1.5" />
            </g>

            {/* Opened Lid swung open upwards */}
            <path
              d="M 22 45 C 22 20 50 12 90 12 C 130 12 158 20 158 45 L 152 52 L 28 52 Z"
              fill="#B45309"
              stroke="#451A03"
              strokeWidth="4"
            />
            <rect
              x="44"
              y="18"
              width="16"
              height="34"
              fill="#F59E0B"
              stroke="#B45309"
              strokeWidth="2.5"
            />
            <rect
              x="120"
              y="18"
              width="16"
              height="34"
              fill="#F59E0B"
              stroke="#B45309"
              strokeWidth="2.5"
            />
          </>
        ) : (
          <>
            {/* Closed Lid */}
            <path
              d="M 22 70 C 22 45 50 35 90 35 C 130 35 158 45 158 70 Z"
              fill="#B45309"
              stroke="#451A03"
              strokeWidth="4"
            />
            <rect
              x="44"
              y="40"
              width="16"
              height="30"
              fill="#F59E0B"
              stroke="#B45309"
              strokeWidth="3"
            />
            <rect
              x="120"
              y="40"
              width="16"
              height="30"
              fill="#F59E0B"
              stroke="#B45309"
              strokeWidth="3"
            />

            {/* Golden Lock */}
            <rect
              x="80"
              y="62"
              width="20"
              height="24"
              rx="4"
              fill="#FBBF24"
              stroke="#B45309"
              strokeWidth="3"
            />
            <circle cx="90" cy="71" r="3" fill="#451A03" />
            <path d="M 90 74 L 90 79" stroke="#451A03" strokeWidth="2.5" />
          </>
        )}
      </svg>
    </div>
  );
};

interface SpeechBubbleProps {
  speaker?: 'kiko' | 'pipi';
  text: string;
  className?: string;
  canSpeak?: boolean;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  speaker = 'kiko',
  text,
  className = '',
  canSpeak = true,
}) => {
  return (
    <div
      id="dialog-bubble"
      className={`relative inline-flex items-center gap-3 bg-white/95 backdrop-blur-sm px-5 py-3.5 rounded-3xl border-4 border-amber-300 shadow-md ${className}`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-extrabold text-sm tracking-wide text-amber-800">
            {speaker === 'kiko' ? '🐰 KIKO BERKATA:' : '🐥 PIPI BERKATA:'}
          </span>
        </div>
        <p className="text-slate-800 font-bold text-base md:text-lg leading-snug">
          {text}
        </p>
      </div>

      {canSpeak && (
        <button
          id="btn-speak-bubble"
          onClick={() => {
            sound.playPop();
            sound.speak(text);
          }}
          title="Dengarkan suara Kiko"
          className="shrink-0 p-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-700 transition active:scale-95 border-2 border-amber-300"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
