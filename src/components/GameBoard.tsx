import { useEffect, useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface GameBoardProps {
  level: number;
  onScoreChange: (score: number) => void;
  onLivesChange: (lives: number) => void;
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
  const { toast } = useToast();

  // Initialize obstacles
  useEffect(() => {
    if (level === 1) {
      setObstacles([
        { id: 1, x: 200, y: 100, direction: "horizontal", forward: true },
        { id: 2, x: 400, y: 250, direction: "vertical", forward: true },
      ]);
    }
  }, [level]);

  // Move obstacles
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
      onLivesChange((prev) => prev - 1);
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
      toast({
        title: "Level Complete!",
        description: "You made it to the exit! +100 points",
      });
      onScoreChange((prev) => prev + 100);
    }
  }, [position, obstacles, onLivesChange, onScoreChange, toast]);

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