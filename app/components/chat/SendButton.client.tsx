import { Button } from '~/components/ui/button';
import { ArrowRight } from 'lucide-react';

export interface SendButtonProps {
  onClick: () => void;
  disabled?: boolean;
  show?: boolean;
}

export function SendButton({ onClick, disabled, show = true }: SendButtonProps) {
  if (!show) return null;

  return (
    <Button
      type="submit"
      size="icon"
      variant="ghost"
      onClick={onClick}
      disabled={disabled}
      className="h-8 w-8"
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Send message</span>
    </Button>
  );
}
