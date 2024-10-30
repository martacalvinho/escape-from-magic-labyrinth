import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Wallet } from "lucide-react";
import GameBoard from "@/components/GameBoard";
import ScoreDisplay from "@/components/ScoreDisplay";
import LivesDisplay from "@/components/LivesDisplay";
import WalletConnect from "@/components/WalletConnect";

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const { toast } = useToast();

  const handleStartGame = () => {
    if (!isWalletConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to start playing",
        variant: "destructive",
      });
      return;
    }
    // Here we would implement the token burning logic
    toast({
      title: "Game Started!",
      description: "20 $GENIE tokens have been burned",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Genie's Escape</h1>
          <WalletConnect onConnect={() => setIsWalletConnected(true)} />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <LivesDisplay lives={lives} />
          <ScoreDisplay score={score} />
          <div className="text-center p-4 bg-purple-800/50 rounded-lg">
            <h3 className="font-semibold mb-2">Level</h3>
            <p className="text-2xl">{currentLevel}</p>
          </div>
        </div>

        <GameBoard
          level={currentLevel}
          onScoreChange={setScore}
          onLivesChange={setLives}
        />

        <div className="mt-8 text-center">
          <Button
            onClick={handleStartGame}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-8 py-4 text-lg"
          >
            {isWalletConnected ? "Start Game (20 $GENIE)" : "Connect Wallet to Play"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;