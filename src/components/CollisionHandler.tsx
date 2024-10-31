import { useEffect } from 'react';
import { Position, Obstacle } from '../types/gameTypes';
import { useToast } from '../components/ui/use-toast';

interface CollisionHandlerProps {
  position: Position;
  obstacles: Obstacle[];
  onCollision: () => void;
  onLevelComplete: () => void;
  level: number;
  currentScore: number;
  onScoreChange: (newScore: number) => void;
}

const CollisionHandler = ({
  position,
  obstacles,
  onCollision,
  onLevelComplete,
  level,
  currentScore,
  onScoreChange,
}: CollisionHandlerProps) => {
  const { toast } = useToast();

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
      onCollision();
      toast({
        title: "Ouch!",
        description: "You hit an obstacle! Try again.",
        variant: "destructive",
      });
    }

    // Check if player reached the end zone
    const endZone = { x: 700, y: 0, width: 80, height: 80 };
    const playerInEndZone = 
      position.x >= endZone.x && 
      position.x <= endZone.x + endZone.width && 
      position.y >= endZone.y && 
      position.y <= endZone.y + endZone.height;

    if (playerInEndZone) {
      const levelPoints = level * 100;
      const bonusPoints = 50;
      const totalPoints = levelPoints + bonusPoints;
      
      const newScore = currentScore + totalPoints;
      onScoreChange(newScore);
      
      toast({
        title: "Level Complete! 🎉",
        description: `Level ${level} completed! +${totalPoints} points (${levelPoints} level + ${bonusPoints} bonus)`,
      });
      
      onLevelComplete();
    }
  }, [position, obstacles, onCollision, onLevelComplete, level, currentScore, onScoreChange, toast]);

  return null;
};

export default CollisionHandler;