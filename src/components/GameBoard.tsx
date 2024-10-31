import { useState, useCallback, useEffect } from "react";
import { Position, GameBoardProps } from '../types/gameTypes';
import { getObstaclesForLevel, updateObstaclePositions } from '../utils/obstacleUtils';
import CollisionHandler from './CollisionHandler';

const GameBoard = ({ level, onScoreChange, onLivesChange, onLevelComplete }: GameBoardProps) => {
  const [position, setPosition] = useState<Position>({ x: 40, y: 360 });
  const [obstacles, setObstacles] = useState(getObstaclesForLevel(level));
  const [currentScore, setCurrentScore] = useState(0);

  // Initialize obstacles based on level
  useEffect(() => {
    setObstacles(getObstaclesForLevel(level));
    setPosition({ x: 40, y: 360 });
  }, [level]);

  // Update obstacle positions
  useEffect(() => {
    const intervalId = setInterval(() => {
      setObstacles(updateObstaclePositions);
    }, 50);
    return () => clearInterval(intervalId);
  }, []);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const step = 20;
      switch (event.key) {
        case "ArrowUp":
          setPosition((prev) => ({ ...prev, y: Math.max(prev.y - step, 0) }));
          break;
        case "ArrowDown":
          setPosition((prev) => ({ ...prev, y: Math.min(prev.y + step, 380) }));
          break;
        case "ArrowLeft":
          setPosition((prev) => ({ ...prev, x: Math.max(prev.x - step, 0) }));
          break;
        case "ArrowRight":
          setPosition((prev) => ({ ...prev, x: Math.min(prev.x + step, 780) }));
          break;
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const handleCollision = () => {
    setPosition({ x: 40, y: 360 });
    onLivesChange((prev: number) => Math.max(0, prev - 1));
  };

  return (
    <div className={`relative w-full h-[400px] rounded-lg border-2 border-purple-500 overflow-hidden ${
      level === 2 ? 'bg-gray-900/50' : 'bg-purple-950/50'
    }`}>
      <CollisionHandler
        position={position}
        obstacles={obstacles}
        onCollision={handleCollision}
        onLevelComplete={onLevelComplete}
        level={level}
        currentScore={currentScore}
        onScoreChange={(newScore) => {
          setCurrentScore(newScore);
          onScoreChange(newScore);
        }}
      />

      {/* Start zone */}
      <div className="absolute bottom-0 left-10 w-20 h-20 bg-green-500/30 rounded flex items-center justify-center text-green-200 text-sm">
        Start
      </div>

      {/* End zone */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/30 rounded flex items-center justify-center text-yellow-200 text-sm">
        Exit
      </div>

      {/* Player (Genie) */}
      <div
        className="absolute transition-all duration-100 ease-in-out text-4xl"
        style={{ left: position.x, top: position.y }}
      >
        🧞
      </div>

      {/* Moving obstacles */}
      {obstacles.map((obstacle) => (
        <div
          key={obstacle.id}
          className={`absolute w-10 h-10 rounded transition-all duration-50 ${
            level === 2 ? 'bg-gray-700 rotate-45' : 'bg-purple-700'
          }`}
          style={{ left: obstacle.x, top: obstacle.y }}
        />
      ))}
    </div>
  );
};

export default GameBoard;