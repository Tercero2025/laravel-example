import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowBigLeftIcon } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Head title="404 - Página no encontrada" />
            <div className="text-center p-8 rounded-lg shadow-md bg-white dark:bg-gray-800">
                <h1 className="text-6xl font-bold text-red-600 dark:text-red-500">404</h1>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Página no encontrada</p>
                <div className="mt-8 w-full flex justify-center">
                    <Button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowBigLeftIcon className="h-4 w-4" />
                        Volver Atras !!!
                    </Button>
                </div>
            </div>
        </div>
    );
}