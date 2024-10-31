export interface Obstacle {
  id: number;
  x: number;
  y: number;
  direction: "horizontal" | "vertical";
  forward: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface GameBoardProps {
  level: number;
  onScoreChange: (newScore: number) => void;
  onLivesChange: (newLives: number) => void;
  onLevelComplete: () => void;
}