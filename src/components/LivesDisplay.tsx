const LivesDisplay = ({ lives }: { lives: number }) => {
  return (
    <div className="text-center p-4 bg-purple-800/50 rounded-lg">
      <h3 className="font-semibold mb-2">Lives</h3>
      <p className="text-2xl">{lives}</p>
    </div>
  );
};

export default LivesDisplay;