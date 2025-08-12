import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import logo from '../../images/logo-project.jpg';
import AppearanceBtn from '@/components/appearance-btn';

export default function Welcome({ laravelVersion, phpVersion, author }: { laravelVersion: string, phpVersion: string, author: string }) {
    const { auth } = usePage<SharedData>().props;

    const softwareName = "Nombre del Proyecto";

    return (
        <>
            <Head title="Welcome">
                <style>{`
                    @keyframes float {
                        0% {
                            transform: translateY(0) translateX(0);
                            opacity: 0;
                        }
                        50% {
                            opacity: 0.8;
                        }
                        100% {
                            transform: translateY(-100px) translateX(20px);
                            opacity: 0;
                        }
                    }
                    .animate-float {
                        animation: float 8s infinite;
                    }
                `}</style>
            </Head>
            <div className="md:min-h-[88.5vh] welcome-gradient flex flex-col items-center justify-center p-4">
                <header className="absolute top-0 right-0 p-4 welcome-header w-full">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm welcome-button px-5 py-1.5 text-sm leading-normal transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm welcome-button px-5 py-1.5 text-sm leading-normal transition-colors"
                                >
                                    Acceder
                                </Link>
                            </>
                        )}
                        <AppearanceBtn className="ml-2" size={2} />
                    </nav>
                </header>

                <main className="w-full max-w-3xl mt-16 mb-6 md:m-auto">
                    <div className="w-full welcome-card backdrop-blur-sm rounded-xl shadow-xl p-8 md:p-12 relative overflow-hidden">
                        {/* Animated bubbles */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute rounded-full welcome-bubble animate-float"
                                style={{ width: '30px', height: '30px', left: '10%', top: '20%', animationDuration: '7s' }}></div>
                            <div className="absolute rounded-full welcome-bubble animate-float"
                                style={{ width: '20px', height: '20px', left: '25%', top: '50%', animationDuration: '8s', animationDelay: '1s' }}>
                            </div>
                            <div className="absolute rounded-full welcome-bubble animate-float"
                                style={{ width: '40px', height: '40px', left: '40%', top: '30%', animationDuration: '9s', animationDelay: '2s' }}>
                            </div>
                            <div className="absolute rounded-full welcome-bubble animate-float"
                                style={{ width: '25px', height: '25px', left: '60%', top: '70%', animationDuration: '6s', animationDelay: '0.5s' }}>
                            </div>
                            <div className="absolute rounded-full welcome-bubble animate-float"
                                style={{ width: '35px', height: '35px', left: '75%', top: '40%', animationDuration: '7.5s', animationDelay: '1.5s' }}>
                            </div>
                            <div className="absolute rounded-full welcome-bubble animate-float"
                                style={{ width: '15px', height: '15px', left: '85%', top: '60%', animationDuration: '8.5s', animationDelay: '2.5s' }}>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-center mb-6">
                                <div className="h-48 w-48 flex items-center justify-center overflow-hidden">
                                    <img src={logo} alt="JD Agua Mineralizada Logo" className="h-44 w-44 rounded-[25px]" />
                                </div>
                            </div>

                            <div className="w-20 h-1 welcome-divider mx-auto mb-6 rounded-full"></div>

                            <h2 className="text-xl md:text-2xl font-medium text-center welcome-text-primary mb-8">
                                {softwareName}
                            </h2>

                            <p className="welcome-text-secondary mb-8 max-w-xl mx-auto">
                                <span>Breve explicación de lo que hace el software.</span>

                                <p className='mt-4 mb-2'>El Software realiza las tareas de :</p>
                                <ul className='welcome-text-secondary list-disc pl-6'>
                                    <li>Manejo de Clientes</li>
                                    <li>Impresión de Reportes</li>
                                    <li>Item 3</li>
                                    <li>Item 4</li>
                                    <li>Item 5</li>
                                </ul>
                            </p>

                            <div className="flex items-center justify-center gap-4 mb-8">
                                <div className="flex items-center gap-2 welcome-accent">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    <span>Lanzamiento próximo</span>
                                </div>
                                <div className="h-4 w-0.5 welcome-bubble"></div>
                                <div className="flex items-center gap-2 welcome-accent">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                                        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                                        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                                    </svg>
                                    <span>Interfaz Amigable</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="w-full welcome-footer">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 welcome-card rounded flex items-center justify-center">
                                    <span className="welcome-text-primary font-bold text-sm">📄</span>
                                </div>
                                <h3 className="text-lg font-semibold welcome-footer-text">
                                    {softwareName}
                                </h3>
                            </div>
                            <p className="welcome-footer-text text-sm leading-relaxed">
                                Preservando la tradición de la documentación profesional con herramientas y servicios de calidad superior.
                            </p>
                            {/* Social Links */}
                            <div className="flex space-x-3 pt-2">
                                <a href="#" className="w-8 h-8 welcome-footer-button rounded flex items-center justify-center hover:welcome-footer-button transition-colors">
                                    <span className="welcome-footer-text text-sm">f</span>
                                </a>
                                <a href="#" className="w-8 h-8 welcome-footer-button rounded flex items-center justify-center hover:welcome-footer-button transition-colors">
                                    <span className="welcome-footer-text text-sm">t</span>
                                </a>
                                <a href="#" className="w-8 h-8 welcome-footer-button rounded flex items-center justify-center hover:welcome-footer-button transition-colors">
                                    <span className="welcome-footer-text text-sm">in</span>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold welcome-footer-text">Enlaces Rápidos</h4>
                            <nav className="space-y-2">
                                <a href="#" className="block welcome-footer-accent hover:welcome-footer-text transition-colors text-sm">Inicio</a>
                                <a href="#" className="block welcome-footer-accent hover:welcome-footer-text transition-colors text-sm">Servicios</a>
                                <a href="#" className="block welcome-footer-accent hover:welcome-footer-text transition-colors text-sm">Productos</a>
                                <a href="#" className="block welcome-footer-accent hover:welcome-footer-text transition-colors text-sm">Blog</a>
                            </nav>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold welcome-footer-text">Contacto</h4>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 welcome-footer-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="welcome-footer-text text-sm">info@oficinaclasica.com</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 welcome-footer-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="welcome-footer-text text-sm">+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 welcome-footer-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div className="welcome-footer-text text-sm">
                                        <div>Calle Principal 123</div>
                                        <div>Ciudad, País 12345</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technical Info */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold welcome-footer-text">Información Técnica</h4>
                            <div className="space-y-2">
                                <div className="welcome-footer-text text-sm">
                                    <span className="font-medium">Desarrollado por:</span><br />
                                    {author}
                                </div>
                                <div className="welcome-footer-text text-sm">
                                    <span className="font-medium">Tecnología:</span><br />
                                    Laravel v{laravelVersion}
                                </div>
                                <div className="welcome-footer-text text-sm">
                                    <span className="font-medium">PHP:</span><br />
                                    v{phpVersion}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t welcome-footer-border mt-8 pt-6">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <div className="welcome-footer-text text-sm">
                                © {new Date().getFullYear()} Sellados Web. Todos los derechos reservados.
                            </div>
                            <div className="flex space-x-6">
                                <a href="#" className="welcome-footer-accent hover:welcome-footer-text transition-colors text-sm">
                                    Política de Privacidad
                                </a>
                                <a href="#" className="welcome-footer-accent hover:welcome-footer-text transition-colors text-sm">
                                    Términos de Servicio
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
