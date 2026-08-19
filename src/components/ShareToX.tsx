import { Button } from './ui';
import { XIcon } from './XIcon';
import { openXShare } from '../lib/share';

type ButtonVariant = 'primary' | 'light' | 'dark' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export function ShareToXButton({
  text,
  url,
  label = 'Share on X',
  variant = 'light',
  size = 'md',
  className = '',
}: {
  text: string;
  url?: string;
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => openXShare(text, url)}
      data-testid="button-share-x"
    >
      <XIcon size={size === 'lg' ? 18 : 15} />
      {label}
    </Button>
  );
}
