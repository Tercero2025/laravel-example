import logo from '../../images/logo-project.jpg';
import splash from '../../images/splash.jpg';

interface AppLogoIconProps {
    className: string;
    variant?: 'logo' | 'splash';
}

export default function AppLogoIcon({ className, variant = 'logo' }: AppLogoIconProps) {
    const imageSrc = variant === 'logo' ? logo : splash;
    
    return (
        <div>
            <img src={imageSrc} alt="" className={className} />
        </div>
    );
}