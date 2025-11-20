import logoImage from '../assets/LumenIQLogo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const heights = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-16',
  };

  return (
    <img
      src={logoImage}
      alt="LumenIQ"
      className={`${heights[size]} w-auto ${className}`}
    />
  );
}
