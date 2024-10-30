import { useEffect, useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface GameBoardProps {
  level: number;
  onScoreChange: (score: number) => void;
  onLivesChange: (lives: number) => void;
}

const GameBoard = ({ level, onScoreChange, onLivesChange }: GameBoardProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { toast } = useToast();

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
      <div
        className="absolute w-8 h-8 bg-yellow-400 rounded-full transition-all duration-100 ease-in-out"
        style={{ left: position.x, top: position.y }}
      />
      {level === 1 && (
        <>
          <div className="absolute top-20 left-40 w-20 h-20 bg-purple-700 rounded" />
          <div className="absolute bottom-40 right-60 w-20 h-20 bg-purple-700 rounded" />
        </>
      )}
    </div>
  );
};

export default GameBoard;