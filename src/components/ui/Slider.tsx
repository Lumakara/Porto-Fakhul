interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export const Slider = ({ value, onChange, min = 0, max = 1, label }: SliderProps) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-hud text-charcoal-light tracking-wide">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          type="range"
          min={min}
          max={max}
          step={0.01}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          aria-label={label}
          className="w-full h-1.5 bg-stone rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-terracotta
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-terracotta
            [&::-moz-range-thumb]:border-none
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:cursor-pointer
            focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50"
          style={{
            background: `linear-gradient(to right, var(--color-terracotta) ${percentage}%, var(--color-stone) ${percentage}%)`,
          }}
        />
      </div>
    </div>
  );
};

export default Slider;
