const ScoreDisplay = ({ score }: { score: number }) => {
  return (
    <div className="text-center p-4 bg-purple-800/50 rounded-lg">
      <h3 className="font-semibold mb-2">Magic Points</h3>
      <p className="text-2xl">{score}</p>
    </div>
  );
};

export default ScoreDisplay;