
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
    toast({
      title: `Switched to ${theme === "dark" ? "light" : "dark"} theme`,
      duration: 2000,
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleToggle} 
      className="rounded-full"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
