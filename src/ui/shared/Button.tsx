import { ReactNode } from 'react';

export const Button = ({ icon, onClick, title, disabled, children }: {
    icon?: ReactNode,
    onClick?: () => void,
    children?: ReactNode,
    title?: string,
    disabled?: boolean
}) => {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() => { if (onClick) onClick() }}
            title={title}
            aria-label={title}
            className="p-2 rounded-lg bg-theme-raised hover:bg-amber-500/20 border
            border-amber-500/30 text-amber-300 transition-all flex items-center gap-1.5
            text-xs shrink-0"
        >
            {icon}
            <span className="hidden sm:inline">
                {children}
            </span>
        </button>
    )
}