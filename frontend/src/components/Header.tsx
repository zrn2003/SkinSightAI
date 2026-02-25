import { Scan, History, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[hsl(190_84%_45%)] flex items-center justify-center shadow-glow">
            <Scan className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg text-foreground">SkinSight</h1>
            <p className="text-xs text-muted-foreground">AI Skin Analysis</p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
        </nav>
      </div>
    </header>
  );
};

export default Header;
