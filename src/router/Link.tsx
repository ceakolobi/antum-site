import React, { AnchorHTMLAttributes, MouseEvent } from 'react';
import { useRouter } from './RouterContext';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  className?: string;
  children: React.ReactNode;
  id?: string;
}

export const Link: React.FC<LinkProps> = ({
  to,
  className = '',
  children,
  id,
  onClick,
  ...rest
}) => {
  const { navigate } = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Let standard browser actions proceed if meta/ctrl keys are held
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    if (onClick) {
      onClick(e);
    }
    navigate(to);
  };

  return (
    <a
      id={id}
      href={to}
      onClick={handleClick}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
};
