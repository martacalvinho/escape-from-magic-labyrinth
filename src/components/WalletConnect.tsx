import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletConnectProps {
  onConnect: () => void;
}

const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  return (
    <Button
      onClick={onConnect}
      className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800"
    >
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </Button>
  );
};

export default WalletConnect;