import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNumericValidation } from '@/hooks/useNumericValidation';
import { TregsellosFormData } from '@/types/tregsellos';

interface NumericInputProps {
  label?: string;
  value: string;
  field: keyof TregsellosFormData;
  onChange: (field: keyof TregsellosFormData, value: string) => void;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  placeholder?: string;
  textAlign?: 'left' | 'right' | 'center';
}

/**
 * Componente especializado para inputs numéricos con validación automática
 */
export const NumericInput: React.FC<NumericInputProps> = ({
  label,
  value,
  field,
  onChange,
  disabled = false,
  className = "w-36",
  labelClassName = "",
  placeholder = "",
  textAlign = 'right'
}) => {
  const { validateNumericInput } = useNumericValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedValue = validateNumericInput(e.target.value, field);
    onChange(field, validatedValue);
  };

  const inputElement = (
    <Input
      type="text"
      value={value}
      onChange={handleChange}
      className={`border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 text-xs ${className} text-${textAlign} h-7`}
      disabled={disabled}
      placeholder={placeholder}
    />
  );

  if (label) {
    return (
      <div className="flex items-center gap-2">
        <Label className={`font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap ${labelClassName}`}>
          {label}
        </Label>
        {inputElement}
      </div>
    );
  }

  return inputElement;
};
