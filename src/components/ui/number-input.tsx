
import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NumberInputProps {
  className?: string;
  value: string | number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const NumberInput = React.forwardRef<HTMLDivElement, NumberInputProps>(
  ({ className, value, min = 1, max = 999, step = 1, onChange, disabled = false, ...props }, ref) => {
    const handleIncrement = () => {
      const newValue = Number(value) + step;
      if (max !== undefined && newValue > max) return;
      onChange(newValue.toString());
    };

    const handleDecrement = () => {
      const newValue = Number(value) - step;
      if (min !== undefined && newValue < min) return;
      onChange(newValue.toString());
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      if (newValue === "") {
        onChange("");
        return;
      }
      
      const numValue = Number(newValue);
      if (isNaN(numValue)) return;
      
      if (min !== undefined && numValue < min) {
        onChange(min.toString());
      } else if (max !== undefined && numValue > max) {
        onChange(max.toString());
      } else {
        onChange(numValue.toString());
      }
    };

    return (
      <div className={cn("flex items-center", className)} ref={ref} {...props}>
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={handleDecrement}
          disabled={disabled || Number(value) <= min}
          className="rounded-r-none"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          className="h-10 rounded-none w-16 text-center"
          disabled={disabled}
        />
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && Number(value) >= max)}
          className="rounded-l-none"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";

export { NumberInput };
