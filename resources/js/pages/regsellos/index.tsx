import TaxForm from '@/components/tax-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role } from '@/types';
import { Head } from '@inertiajs/react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sistema de Sellados - Formulario de Carga',
        href: '/tax',
    },
];

export default function Tax() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sistema de Sellados - Formulario de Carga" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <TaxForm />
            </div>
        </AppLayout>
    );
}
