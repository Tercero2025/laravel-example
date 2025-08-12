import { Link } from '@inertiajs/react';

// Función para filtrar los links y mostrar solo los necesarios
const filterPaginationLinks = (
    links: PaginationLink[],
    showFirstPages: number,
    showLastPages: number,
    adjacentPages: number
): (PaginationLink | { label: string; url: null; active: false })[] => {
    // Si no hay suficientes links o no se especifican parámetros, devolver todos los links
    if (links.length <= 3 || (!showFirstPages && !showLastPages && !adjacentPages)) {
        return links;
    }

    // Encontrar el índice de la página actual
    const currentPageIndex = links.findIndex(link => link.active);
    if (currentPageIndex === -1) return links; // Si no hay página activa, devolver todos los links

    const result: (PaginationLink | { label: string; url: null; active: false })[] = [];

    // Siempre incluir "Anterior"
    if (links[0]) result.push(links[0]);

    // Agregar primeras páginas
    for (let i = 1; i < links.length - 1 && i <= showFirstPages; i++) {
        result.push(links[i]);
    }

    // Calcular el rango de páginas cercanas a la actual
    const startAdjacentIndex = Math.max(1, currentPageIndex - adjacentPages);
    const endAdjacentIndex = Math.min(links.length - 2, currentPageIndex + adjacentPages);

    // Si hay un salto entre las primeras páginas y las páginas adyacentes, agregar "..."
    if (showFirstPages > 0 && startAdjacentIndex > showFirstPages + 1) {
        result.push({ label: '...', url: null, active: false });
    }

    // Agregar páginas adyacentes a la actual
    for (let i = startAdjacentIndex; i <= endAdjacentIndex; i++) {
        // Evitar duplicados de las primeras páginas
        if (i > showFirstPages && i < links.length - 1 - showLastPages) {
            result.push(links[i]);
        }
    }

    // Si hay un salto entre las páginas adyacentes y las últimas, agregar "..."
    if (showLastPages > 0 && endAdjacentIndex < links.length - 2 - showLastPages) {
        result.push({ label: '...', url: null, active: false });
    }

    // Agregar últimas páginas
    for (let i = Math.max(1, links.length - 1 - showLastPages); i < links.length - 1; i++) {
        // Evitar duplicados de las páginas adyacentes
        if (i > endAdjacentIndex) {
            result.push(links[i]);
        }
    }

    // Siempre incluir "Siguiente"
    if (links[links.length - 1]) result.push(links[links.length - 1]);

    return result;
};

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface AppPaginateProps {
    links: PaginationLink[];
    className?: string;
    showFirstPages?: number;  // Número de páginas a mostrar al inicio
    showLastPages?: number;   // Número de páginas a mostrar al final
    adjacentPages?: number;   // Número de páginas adyacentes a la actual
}

const translateLabel = (label: string): string => {
    if (label === '&laquo; Previous') return 'Ant';
    if (label === 'Next &raquo;') return 'Sig';
    return label;
};

export default function AppPaginate({ 
    links, 
    className = '',
    showFirstPages = 0,
    showLastPages = 0,
    adjacentPages = 0
}: AppPaginateProps) {
    if (!links || links.length === 0) return null;
    
    // Filtrar los links para mostrar solo los necesarios
    const filteredLinks = filterPaginationLinks(links, showFirstPages, showLastPages, adjacentPages);
    
    return (
            <div className={`mt-4 flex justify-center mb-6 w-full ${className}`}>
                <nav className="inline-flex -space-x-px">
                    {filteredLinks.map((link, idx) => (
                        link.label === '...' ? (
                            <span 
                                key={idx}
                                className="px-3 py-1 border text-sm rounded-sm bg-background text-foreground border-border pointer-events-none"
                            >
                                ...
                            </span>
                        ) : (
                            <Link
                                key={idx}
                                href={link.url || ''}
                                className={`px-2 md:px-3 py-2 border text-xs md:text-sm rounded-sm
                            ${link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
                                    } 
                            ${!link.url ? 'pointer-events-none opacity-50' : ''}
                            border-border`}
                                dangerouslySetInnerHTML={{ __html: translateLabel(link.label) }}
                            />
                        )
                    ))}
                </nav>
            </div>
    );
}
