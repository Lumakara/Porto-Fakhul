import { motion } from 'framer-motion';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}

export const RadioGroup = ({ options, value, onChange, name }: RadioGroupProps) => {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`relative px-3 py-1.5 rounded-full text-xs font-hud tracking-wide transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 focus-visible:ring-offset-1 ${
            value === option.value
              ? 'text-white'
              : 'text-charcoal-light hover:text-charcoal bg-stone/50'
          }`}
        >
          {value === option.value && (
            <motion.div
              layoutId={`radio-indicator-${name}`}
              className="absolute inset-0 bg-terracotta rounded-full"
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            />
          )}
          <span className="relative z-10">{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default RadioGroup;
