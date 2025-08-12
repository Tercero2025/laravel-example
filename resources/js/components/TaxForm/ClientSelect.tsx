import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ClienteOption } from '@/types/tregsellos';

interface ClientSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ClienteOption[];
  disabled?: boolean;
  isLoading?: boolean;
  cuit?: string;
  className?: string;
}

/**
 * Componente especializado para selección de clientes
 * Muestra el cliente seleccionado y su CUIT
 */
export const ClientSelect: React.FC<ClientSelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  isLoading = false,
  cuit,
  className = ""
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Selección de cliente */}
      <div className="flex items-center gap-2 min-w-0">
        <Label className="font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap flex-shrink-0">
          {label}
        </Label>
        <Select 
          value={value} 
          onValueChange={onChange} 
          disabled={disabled || isLoading}
        >
          <SelectTrigger className="border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 text-xs min-w-0 flex-1 h-7">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {options.map((cliente, index) => (
              <SelectItem key={index} value={cliente.value} className="text-xs">
                {cliente.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Mostrar CUIT */}
      {cuit && (
        <div className="text-base text-center text-gray-600 dark:text-gray-400">
          CUIT N°: {cuit}
        </div>
      )}
    </div>
  );
};
