import { Input } from "./input"
import { Label } from "./label"
import { cn } from "@/lib/utils"

interface InputDateProps {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  min?: string
  max?: string
  placeholder?: string
  className?: string
  containerClassName?: string
  labelClassName?: string
  title?: string
}

export function InputDate({
  label,
  value,
  onChange,
  disabled = false,
  min,
  max,
  placeholder,
  className,
  containerClassName,
  labelClassName,
  title,
  ...props
}: InputDateProps) {
  return (
    <div className={cn("flex items-center gap-2 min-w-0", containerClassName)}>
      <Label className={cn("font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap flex-shrink-0", labelClassName)}>
        {label}
      </Label>
      <Input
        type="date"
        className={cn(
          "border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 text-xs min-w-0 flex-1 h-7",
          "[&::-webkit-calendar-picker-indicator]:dark:filter-invert",
          "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
          "[&::-webkit-calendar-picker-indicator]:bg-transparent",
          "[&::-webkit-calendar-picker-indicator]:p-1",
          "[&::-webkit-calendar-picker-indicator]:hover:bg-gray-100",
          "[&::-webkit-calendar-picker-indicator]:dark:hover:bg-gray-600",
          "[&::-webkit-calendar-picker-indicator]:rounded",
          className
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        min={min}
        max={max}
        placeholder={placeholder}
        title={title}
        {...props}
      />
    </div>
  )
}
