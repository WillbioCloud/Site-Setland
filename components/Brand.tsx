import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import defaultLogo from '../assets/optimized/logo-setland.webp';
import glacialLogo from '../assets/optimized/logo-glacial.webp';
import medievalLogo from '../assets/optimized/logo-medieval.webp';
import futuristicLogo from '../assets/optimized/logo-futuristica.webp';

const logos = {
  default: defaultLogo,
  glacial: glacialLogo,
  medieval: medievalLogo,
  futuristic: futuristicLogo,
};

export function Brand({ onClick }: { onClick?: () => void }) {
  const { currentTheme } = useTheme();
  return (
    <Link to="/" className="brand" aria-label="Setland — página inicial" onClick={onClick}>
      <img src={logos[currentTheme]} width="42" height="50" alt="" />
      <span className="brand__wordmark">
        Setland<span>PARQUE TEMÁTICO</span>
      </span>
    </Link>
  );
}
