import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, useEffect, useState } from 'react';

interface AppearanceBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    size?: number; // Tamaño del botón en rem
}

// Componente de botón de apariencia ON/OFF (día/noche)
export default function AppearanceBtn({ className = '', size = 3, ...props }: AppearanceBtnProps) {
    const { appearance, updateAppearance } = useAppearance();
    const [isDark, setIsDark] = useState(false);

    // Detectar el estado actual del tema al cargar
    useEffect(() => {
        const checkTheme = () => {
            if (appearance === 'system') {
                // Si es 'system', detectar el tema del sistema
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                setIsDark(mediaQuery.matches);
            } else {
                // Si es 'light' o 'dark', usar el valor directo
                setIsDark(appearance === 'dark');
            }
        };

        checkTheme();

        // Escuchar cambios en el tema del sistema si está en modo 'system'
        if (appearance === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [appearance]);

    return (
        <button
            type="button"
            aria-label={isDark ? 'Cambiar a modo día' : 'Cambiar a modo noche'}
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
            style={{
                width: `${size}rem`,
                height: `${size}rem`,
            }}
            className={cn(
                'relative flex items-center justify-center rounded-full focus:outline-none transition-all cursor-pointer shadow-md',
                isDark ? 'bg-neutral-800' : 'bg-neutral-200',
                className
            )}
            {...props}
        >
            {/* Círculo exterior */}
            <span
                className={cn(
                    'absolute inset-0 rounded-full border-4',
                    isDark ? 'border-red-600' : 'border-green-500',
                    'pointer-events-none'
                )}
            />
            {/* Icono de encendido */}
            <span className="relative z-10 flex items-center justify-center">
                {isDark ? (
                    <Moon style={{ width: `${size/2}rem`, height: `${size/2}rem` }} className="text-red-600" />
                ) : (
                    <Sun style={{ width: `${size/2}rem`, height: `${size/2}rem` }} className="text-green-500" />
                )}
            </span>
        </button>
    );
}
