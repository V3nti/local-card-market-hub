
import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const conditionOptions = [
  { value: "DMG", label: "DMG (Damaged)" },
  { value: "HP", label: "HP (Heavily Played)" }, 
  { value: "MP", label: "MP (Moderately Played)" },
  { value: "LP", label: "LP (Lightly Played)" },
  { value: "NM", label: "NM (Near Mint)" },
];

interface ConditionSliderProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ConditionSlider({
  value,
  onChange,
  className,
}: ConditionSliderProps) {
  const currentIndex = conditionOptions.findIndex(option => option.value === value);
  const sliderValue = currentIndex >= 0 ? [currentIndex] : [4]; // Default to NM (4)
  
  const handleSliderChange = (newValue: number[]) => {
    const index = newValue[0];
    if (index >= 0 && index < conditionOptions.length) {
      onChange(conditionOptions[index].value);
    }
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Worst</span>
        <span>Best</span>
      </div>
      <Slider
        value={sliderValue}
        min={0}
        max={conditionOptions.length - 1}
        step={1}
        onValueChange={handleSliderChange}
      />
      <div className="flex justify-between items-center">
        {conditionOptions.map((option, index) => (
          <div 
            key={option.value} 
            className={cn(
              "text-center text-xs w-12 cursor-pointer",
              index === sliderValue[0] ? "font-bold text-primary" : "text-muted-foreground"
            )}
            onClick={() => handleSliderChange([index])}
          >
            {option.value}
          </div>
        ))}
      </div>
      <div className="text-center font-medium mt-2">
        {conditionOptions[sliderValue[0]]?.label}
      </div>
    </div>
  );
}
