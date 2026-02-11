import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  currency?: string;
  presets?: { label: string; min: number; max?: number }[];
  className?: string;
}

const DEFAULT_PRESETS = [
  { label: "Under 50", min: 0, max: 50 },
  { label: "50 - 100", min: 50, max: 100 },
  { label: "100 - 150", min: 100, max: 150 },
  { label: "150+", min: 150, max: Infinity },
];

export const PriceRangeSlider = ({
  min,
  max,
  value,
  onChange,
  currency = "GHS",
  presets = DEFAULT_PRESETS,
  className,
}: PriceRangeSliderProps) => {
  const [inputMin, setInputMin] = useState(value[0].toString());
  const [inputMax, setInputMax] = useState(value[1].toString());

  const handleSliderChange = (newValue: number[]) => {
    const [newMin, newMax] = newValue;
    onChange([newMin, newMax]);
    setInputMin(newMin.toString());
    setInputMax(newMax.toString());
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || min;
    setInputMin(e.target.value);
    if (val >= min && val <= value[1]) {
      onChange([val, value[1]]);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || max;
    setInputMax(e.target.value);
    if (val >= value[0] && val <= max) {
      onChange([value[0], val]);
    }
  };

  const handlePresetClick = (presetMin: number, presetMax?: number) => {
    const newMax = presetMax === undefined ? max : presetMax;
    onChange([presetMin, newMax]);
    setInputMin(presetMin.toString());
    setInputMax(newMax.toString());
  };

  const isPresetActive = (presetMin: number, presetMax?: number) => {
    if (presetMax === undefined) {
      return value[0] === presetMin && value[1] === max;
    }
    return value[0] === presetMin && value[1] === presetMax;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant={isPresetActive(preset.min, preset.max) ? "default" : "outline"}
            size="sm"
            onClick={() => handlePresetClick(preset.min, preset.max)}
            className="text-xs"
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Slider */}
      <div className="px-2">
        <Slider
          min={min}
          max={max}
          step={1}
          value={value}
          onValueChange={handleSliderChange}
          className="my-4"
        />
      </div>

      {/* Input Fields */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Label htmlFor="min-price" className="text-xs text-muted-foreground">
            Min
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              {currency}
            </span>
            <Input
              id="min-price"
              type="number"
              value={inputMin}
              onChange={handleMinInputChange}
              min={min}
              max={value[1]}
              className="pl-12 h-9"
            />
          </div>
        </div>
        <span className="text-muted-foreground mt-4">—</span>
        <div className="flex-1">
          <Label htmlFor="max-price" className="text-xs text-muted-foreground">
            Max
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              {currency}
            </span>
            <Input
              id="max-price"
              type="number"
              value={inputMax === max.toString() ? "" : inputMax}
              onChange={handleMaxInputChange}
              placeholder="Any"
              min={value[0]}
              max={max}
              className="pl-12 h-9"
            />
          </div>
        </div>
      </div>

      {/* Display Current Range */}
      <div className="text-sm text-center text-muted-foreground">
        {currency} {value[0]} - {value[1] === max ? `${value[1]}+` : value[1]}
      </div>
    </div>
  );
};
