import { useEffect, useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface GameBoardProps {
  level: number;
  onScoreChange: (newScore: number) => void;
  onLivesChange: (newLives: number) => void;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  direction: "horizontal" | "vertical";
  forward: boolean;
}

const GameBoard = ({ level, onScoreChange, onLivesChange }: GameBoardProps) => {
  const [position, setPosition] = useState({ x: 40, y: 360 });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const { toast } = useToast();

  // Initialize obstacles based on level
  useEffect(() => {
    if (level === 1) {
      setObstacles([
        { id: 1, x: 200, y: 100, direction: "horizontal", forward: true },
        { id: 2, x: 400, y: 250, direction: "vertical", forward: true },
        { id: 3, x: 300, y: 150, direction: "horizontal", forward: false },
        { id: 4, x: 500, y: 200, direction: "vertical", forward: true },
        { id: 5, x: 150, y: 300, direction: "horizontal", forward: true },
        { id: 6, x: 350, y: 100, direction: "vertical", forward: false },
        { id: 7, x: 250, y: 200, direction: "horizontal", forward: true },
      ]);
    } else if (level === 2) {
      setObstacles([
        { id: 1, x: 150, y: 80, direction: "horizontal", forward: true },
        { id: 2, x: 350, y: 200, direction: "vertical", forward: true },
        { id: 3, x: 250, y: 120, direction: "horizontal", forward: false },
        { id: 4, x: 450, y: 180, direction: "vertical", forward: true },
        { id: 5, x: 100, y: 280, direction: "horizontal", forward: true },
        { id: 6, x: 600, y: 150, direction: "vertical", forward: false },
        { id: 7, x: 200, y: 350, direction: "horizontal", forward: true },
        { id: 8, x: 300, y: 50, direction: "vertical", forward: true },
        { id: 9, x: 550, y: 300, direction: "horizontal", forward: false },
      ]);
    }
    // Reset position when level changes
    setPosition({ x: 40, y: 360 });
  }, [level]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setObstacles((currentObstacles) =>
        currentObstacles.map((obstacle) => {
          const speed = 5;
          if (obstacle.direction === "horizontal") {
            let newX = obstacle.x + (obstacle.forward ? speed : -speed);
            if (newX > 700) {
              return { ...obstacle, forward: false, x: 700 };
            }
            if (newX < 100) {
              return { ...obstacle, forward: true, x: 100 };
            }
            return { ...obstacle, x: newX };
          } else {
            let newY = obstacle.y + (obstacle.forward ? speed : -speed);
            if (newY > 300) {
              return { ...obstacle, forward: false, y: 300 };
            }
            if (newY < 50) {
              return { ...obstacle, forward: true, y: 50 };
            }
            return { ...obstacle, y: newY };
          }
        })
      );
    }, 50);

    return () => clearInterval(intervalId);
  }, []);

  // Check for collisions and winning
  useEffect(() => {
    // Check collisions with obstacles
    const collision = obstacles.some((obstacle) => {
      const obstacleRect = {
        left: obstacle.x,
        right: obstacle.x + 40,
        top: obstacle.y,
        bottom: obstacle.y + 40,
      };
      const playerRect = {
        left: position.x,
        right: position.x + 32,
        top: position.y,
        bottom: position.y + 32,
      };

      return !(
        playerRect.left > obstacleRect.right ||
        playerRect.right < obstacleRect.left ||
        playerRect.top > obstacleRect.bottom ||
        playerRect.bottom < obstacleRect.top
      );
    });

    if (collision) {
      setPosition({ x: 40, y: 360 });
      const newLives = Math.max(0, currentScore - 1);
      onLivesChange(newLives);
      toast({
        title: "Ouch!",
        description: "You hit an obstacle! Try again.",
        variant: "destructive",
      });
    }

    // Check if player reached the end
    const endZone = { x: 740, y: 20, width: 40, height: 40 };
    if (
      position.x > endZone.x &&
      position.x < endZone.x + endZone.width &&
      position.y > endZone.y &&
      position.y < endZone.y + endZone.height
    ) {
      const levelPoints = level * 100;
      const bonusPoints = 50; // Base points for clearing level
      const totalPoints = levelPoints + bonusPoints;
      
      const newScore = currentScore + totalPoints;
      setCurrentScore(newScore);
      onScoreChange(newScore);
      
      toast({
        title: "Level Complete! 🎉",
        description: `Level ${level} completed! +${totalPoints} points (${levelPoints} level + ${bonusPoints} bonus)`,
      });
      
      // Reset position for next level
      setPosition({ x: 40, y: 360 });
    }
  }, [position, obstacles, onLivesChange, onScoreChange, toast, level, currentScore]);

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

  return (
    <div className="relative w-full h-[400px] bg-purple-950/50 rounded-lg border-2 border-purple-500 overflow-hidden">
      {/* Start zone */}
      <div className="absolute bottom-0 left-10 w-20 h-20 bg-green-500/30 rounded flex items-center justify-center text-green-200 text-sm">
        Start
      </div>

      {/* End zone */}
      <div className="absolute top-5 right-5 w-10 h-10 bg-yellow-500/30 rounded flex items-center justify-center text-yellow-200 text-sm">
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
          className="absolute w-10 h-10 bg-purple-700 rounded transition-all duration-50"
          style={{ left: obstacle.x, top: obstacle.y }}
        />
      ))}
    </div>
  );
};

export default GameBoard;