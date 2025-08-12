import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import logo from '../../../images/logo-project.jpg';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <>
            <div
                className="bg-dynamic
                            flex 
                            flex-col-reverse 
                            items-center 
                            justify-center
                            min-h-screen
                            bg-cover bg-center
                            lg:bg-gray-100 
                            lg:sm:bg-none
                            lg:dark:bg-gray-900 
                            lg:dark:bg-none
                            md:bg-cover md:bg-center
                            lg:grid
                            lg:grid-cols-2 
                            lg:grid-rows-1 
                            lg:min-h-screen
                            lg:bg-cover lg:bg-center"
                style={{ '--bg-image': `url(${logo})` } as React.CSSProperties & { '--bg-image': string }}
            >
                <div className='hidden lg:flex items-center justify-center bg-slate-500 dark:bg-slate-700 min-h-[35vh] md:min-h-[50vh] lg:min-h-[100vh]'>
                    <Link href="/">
                        <AppLogoIcon className="h-screen aspect-video" variant='logo' />
                    </Link>
                </div>
                <div className='flex 
                                flex-col 
                                items-center 
                                justify-center 
                                lg:bg-gray-400 
                                lg:dark:bg-gray-600 
                                min-h-auto 
                                md:min-h-[50vh] 
                                lg:flex-row 
                                lg:min-h-[100vh]
                                '>
                    <div className="
                    overflow-hidden 
                    bg-white 
                    dark:bg-gray-800 
                    dark:border-sidebar-border
                    px-6 
                    py-4 
                    border 
                    border-sidebar-border/70 
                    shadow-md 
                    sm:max-w-md 
                    rounded-lg 
                    w-[90vw] 
                    lg:mt-6 
                    ">
                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium dark:text-white">{title}</h1>
                            <p className="text-muted-foreground dark:text-gray-300 text-center text-sm">{description}</p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
