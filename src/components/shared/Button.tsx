import type { LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'ghost';
  icon?: LucideIcon;
}

export function Button({ variant, icon: Icon, children, ...props }: ButtonProps) {
  return (
    <button {...props}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
