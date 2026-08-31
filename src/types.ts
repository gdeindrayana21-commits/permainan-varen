export type ScreenType = 'welcome' | 'identity' | 'map' | 'level' | 'certificate';

export interface PlayerProfile {
  name: string;
  avatar: string;
  grade: string;
  stars: number;
  unlockedLevel: number; // 1 to 5
  completedLevels: number[];
  readingPoints: number;
  codingPoints: number;
  soundEnabled: boolean;
  completionDate?: string;
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
}

export type DirectionCommand = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GridPosition {
  x: number;
  y: number;
}
