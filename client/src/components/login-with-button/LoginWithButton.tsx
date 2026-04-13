import { type ReactElement } from 'react';

type TSocialButtonProps = {
    icon: ReactElement;
    text: string;
    onClick: () => void;
};

const LoginWithButton = ({ icon, text, onClick }: TSocialButtonProps) => (
    <button type="button" onClick={onClick} className="flex w-full items-center justify-center gap-3 rounded-lg border border-light-border bg-light-bg px-4 py-2.5 text-sm font-semibold text-light-text hover:bg-light-hover transition-colors">
      {icon}
      {text}
    </button>
  );

export default LoginWithButton;