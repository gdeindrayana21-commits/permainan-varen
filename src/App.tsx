import React, { useState, useEffect } from 'react';
import { ScreenType, PlayerProfile } from './types';
import { HeaderNav } from './components/HeaderNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { IdentityScreen } from './components/IdentityScreen';
import { AdventureMap } from './components/AdventureMap';
import { Level1HutanHuruf } from './components/levels/Level1HutanHuruf';
import { Level2TamanMembaca } from './components/levels/Level2TamanMembaca';
import { Level3SungaiCoding } from './components/levels/Level3SungaiCoding';
import { Level4GuaMisteri } from './components/levels/Level4GuaMisteri';
import { Level5IstanaHartaKarun } from './components/levels/Level5IstanaHartaKarun';
import { TeacherAreaModal } from './components/TeacherAreaModal';
import { CertificateModal } from './components/CertificateModal';
import { sound } from './utils/sound';

const STORAGE_KEY = 'kiko_adventure_progress_v1';

const DEFAULT_PROFILE: PlayerProfile = {
  name: '',
  avatar: '👧',
  grade: 'TK A',
  stars: 0,
  unlockedLevel: 1,
  completedLevels: [],
  readingPoints: 0,
  codingPoints: 0,
  soundEnabled: true,
};

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // LocalStorage fallback
    }
    return DEFAULT_PROFILE;
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    // If child already filled name, go to map; otherwise start at welcome
    return profile.name ? 'map' : 'welcome';
  });

  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [isTeacherAreaOpen, setIsTeacherAreaOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  // Sync sound setting to sound engine
  useEffect(() => {
    sound.setSoundEnabled(profile.soundEnabled);
  }, [profile.soundEnabled]);

  // Persist profile to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  // Sound toggle
  const handleToggleSound = () => {
    setProfile((prev) => {
      const nextSound = !prev.soundEnabled;
      sound.setSoundEnabled(nextSound);
      return { ...prev, soundEnabled: nextSound };
    });
  };

  // Identity screen submission
  const handleIdentitySubmit = (name: string, grade: string, avatar: string) => {
    setProfile((prev) => ({
      ...prev,
      name,
      grade,
      avatar,
    }));
    setCurrentScreen('map');
  };

  // Selecting a level from the map
  const handleSelectLevel = (levelId: number) => {
    setCurrentLevelId(levelId);
    setCurrentScreen('level');
  };

  // When a level is completed
  const handleCompleteLevel = (
    levelId: number,
    starsEarned: number,
    readingPts: number = 0,
    codingPts: number = 0
  ) => {
    setProfile((prev) => {
      const isAlreadyCompleted = prev.completedLevels.includes(levelId);
      const nextUnlocked = Math.max(prev.unlockedLevel, Math.min(5, levelId + 1));
      const nextCompleted = isAlreadyCompleted
        ? prev.completedLevels
        : [...prev.completedLevels, levelId];

      return {
        ...prev,
        stars: prev.stars + starsEarned,
        readingPoints: prev.readingPoints + readingPts,
        codingPoints: prev.codingPoints + codingPts,
        unlockedLevel: nextUnlocked,
        completedLevels: nextCompleted,
      };
    });
    // Return to map so user sees the newly unlocked node
    setCurrentScreen('map');
  };

  // Reset Progress from Teacher Area
  const handleResetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(DEFAULT_PROFILE);
    setCurrentScreen('welcome');
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50 text-slate-800 antialiased select-none font-sans">
      {/* Persistent Navigation Header */}
      <HeaderNav
        currentScreen={currentScreen}
        currentLevelId={currentLevelId}
        profile={profile}
        onNavigate={(screen, lvlId) => {
          setCurrentScreen(screen);
          if (lvlId) setCurrentLevelId(lvlId);
        }}
        onToggleSound={handleToggleSound}
        onOpenTeacherArea={() => setIsTeacherAreaOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* Main Screen Router */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            onStart={() => {
              if (profile.name) {
                setCurrentScreen('map');
              } else {
                setCurrentScreen('identity');
              }
            }}
          />
        )}

        {currentScreen === 'identity' && (
          <IdentityScreen
            initialName={profile.name}
            initialGrade={profile.grade}
            initialAvatar={profile.avatar}
            onSubmit={handleIdentitySubmit}
          />
        )}

        {currentScreen === 'map' && (
          <AdventureMap
            unlockedLevel={profile.unlockedLevel}
            completedLevels={profile.completedLevels}
            onSelectLevel={handleSelectLevel}
            onOpenCertificate={() => setIsCertificateOpen(true)}
          />
        )}

        {currentScreen === 'level' && (
          <>
            {currentLevelId === 1 && (
              <Level1HutanHuruf
                onCompleteLevel={(lvlId, stars, rPts) =>
                  handleCompleteLevel(lvlId, stars, rPts, 0)
                }
                onBackToMap={() => setCurrentScreen('map')}
              />
            )}

            {currentLevelId === 2 && (
              <Level2TamanMembaca
                onCompleteLevel={(lvlId, stars, rPts) =>
                  handleCompleteLevel(lvlId, stars, rPts, 0)
                }
                onBackToMap={() => setCurrentScreen('map')}
              />
            )}

            {currentLevelId === 3 && (
              <Level3SungaiCoding
                onCompleteLevel={(lvlId, stars, cPts) =>
                  handleCompleteLevel(lvlId, stars, 0, cPts)
                }
                onBackToMap={() => setCurrentScreen('map')}
              />
            )}

            {currentLevelId === 4 && (
              <Level4GuaMisteri
                onCompleteLevel={(lvlId, stars, rPts, cPts) =>
                  handleCompleteLevel(lvlId, stars, rPts, cPts)
                }
                onBackToMap={() => setCurrentScreen('map')}
              />
            )}

            {currentLevelId === 5 && (
              <Level5IstanaHartaKarun
                onCompleteLevel={(lvlId, stars, rPts, cPts) =>
                  handleCompleteLevel(lvlId, stars, rPts, cPts)
                }
                onOpenCertificate={() => setIsCertificateOpen(true)}
                onBackToMap={() => setCurrentScreen('map')}
              />
            )}
          </>
        )}
      </main>

      {/* Teacher / Parent Portal Modal */}
      <TeacherAreaModal
        isOpen={isTeacherAreaOpen}
        onClose={() => setIsTeacherAreaOpen(false)}
        profile={profile}
        onResetProgress={handleResetProgress}
      />

      {/* Printable Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        profile={profile}
      />
    </div>
  );
}
