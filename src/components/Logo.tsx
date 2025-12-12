import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  href?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ href = '/', showText = true, size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 40, text: 'text-2xl' },
  }

  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image 
        src="/logo.svg" 
        alt="RFI Tracker" 
        width={sizes[size].icon} 
        height={sizes[size].icon}
        className="flex-shrink-0"
      />
      {showText && (
        <span className={`font-bold text-slate-900 ${sizes[size].text}`}>
          RFI Tracker
        </span>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

// Inline SVG version for places where we can't load external images
export function LogoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="40" height="40" rx="8" fill="#2563EB"/>
      <path d="M12 10C12 9.44772 12.4477 9 13 9H20C23.866 9 27 12.134 27 16C27 18.4 25.8 20.5 23.9 21.7L27.6 29.1C27.9 29.7 27.5 30.4 26.8 30.4H23.4C23 30.4 22.7 30.2 22.5 29.9L19.2 23H16V29C16 29.6 15.6 30 15 30H13C12.4 30 12 29.6 12 29V10Z" fill="white"/>
      <path d="M16 13V19H19.5C21.4 19 23 17.4 23 15.5V16.5C23 14.6 21.4 13 19.5 13H16Z" fill="#2563EB"/>
      <circle cx="31" cy="11" r="3" fill="#60A5FA"/>
    </svg>
  )
}

