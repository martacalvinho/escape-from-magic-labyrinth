import { Obstacle } from '../types/gameTypes';

export const getObstaclesForLevel = (level: number): Obstacle[] => {
  if (level === 1) {
    return [
      { id: 1, x: 200, y: 100, direction: "horizontal", forward: true },
      { id: 2, x: 400, y: 250, direction: "vertical", forward: true },
      { id: 3, x: 300, y: 150, direction: "horizontal", forward: false },
      { id: 4, x: 500, y: 200, direction: "vertical", forward: true },
      { id: 5, x: 150, y: 300, direction: "horizontal", forward: true },
      { id: 6, x: 350, y: 100, direction: "vertical", forward: false },
      { id: 7, x: 250, y: 200, direction: "horizontal", forward: true },
    ];
  } else if (level === 2) {
    return [
      { id: 1, x: 150, y: 80, direction: "horizontal", forward: true },
      { id: 2, x: 350, y: 200, direction: "vertical", forward: true },
      { id: 3, x: 250, y: 120, direction: "horizontal", forward: false },
      { id: 4, x: 450, y: 180, direction: "vertical", forward: true },
      { id: 5, x: 100, y: 280, direction: "horizontal", forward: true },
      { id: 6, x: 600, y: 150, direction: "vertical", forward: false },
      { id: 7, x: 200, y: 350, direction: "horizontal", forward: true },
      { id: 8, x: 300, y: 50, direction: "vertical", forward: true },
      { id: 9, x: 550, y: 300, direction: "horizontal", forward: false },
    ];
  }
  return [];
};

export const updateObstaclePositions = (obstacles: Obstacle[]): Obstacle[] => {
  return obstacles.map((obstacle) => {
    const speed = 5;
    if (obstacle.direction === "horizontal") {
      let newX = obstacle.x + (obstacle.forward ? speed : -speed);
      if (newX > 700) return { ...obstacle, forward: false, x: 700 };
      if (newX < 100) return { ...obstacle, forward: true, x: 100 };
      return { ...obstacle, x: newX };
    } else {
      let newY = obstacle.y + (obstacle.forward ? speed : -speed);
      if (newY > 300) return { ...obstacle, forward: false, y: 300 };
      if (newY < 50) return { ...obstacle, forward: true, y: 50 };
      return { ...obstacle, y: newY };
    }
  });
};