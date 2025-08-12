import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { SearchIcon, XIcon } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';

interface AppSearchProps {
    placeholder?: string;
    routeName: string;
    initialValue?: string;
    preserveState?: boolean;
    className?: string;
}

const AppSearch: React.FC<AppSearchProps> = ({
    placeholder = 'Buscar...',
    routeName,
    initialValue = '',
    preserveState = true,
    className = '',
}) => {
    // Obtenemos el valor de búsqueda desde la URL
    const { url } = usePage();
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    const searchFromUrl = urlParams.get('search') || initialValue;
    
    const [searchTerm, setSearchTerm] = useState(searchFromUrl);
    
    // Actualizar el término de búsqueda cuando cambie la URL
    useEffect(() => {
        const urlParams = new URLSearchParams(url.split('?')[1] || '');
        const searchFromUrl = urlParams.get('search') || initialValue;
        setSearchTerm(searchFromUrl);
    }, [url, initialValue]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route(routeName), { search: searchTerm }, { preserveState });
    };

    return (
        <form onSubmit={handleSearch} className={`flex items-center w-full ${className}`}>
            <div className="relative flex items-center w-full">
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10 pr-10 rounded-lg w-full"
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setSearchTerm('');
                            router.get(route(routeName), { search: '' }, { preserveState });
                        }}
                        className="absolute right-8 p-2 text-gray-400 hover:text-gray-600"
                        title="Limpiar búsqueda"
                    >
                        <XIcon className="h-4 w-4" />
                    </button>
                )}
                <button 
                    type="submit"
                    className="absolute right-0 p-2 rounded-r-lg text-gray-400 hover:text-gray-600"
                >
                    <SearchIcon className="h-5 w-5" />
                </button>
            </div>
        </form>
    );
};

export default AppSearch;
