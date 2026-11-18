import { ReactNode } from 'react';




export const Tag = ({icon, onClick, children}: {
    icon?: ReactNode,
    onClick?: () => void,
    children?: ReactNode
}) => {
    return (
        <div
            className={`inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 
            px-2.5 
            py-1 
            text-xs font-medium text-amber-200 
            ${ onClick && ' cursor-pointer '}
            hover:bg-amber-400/20 transition-all`}
            onClick={() => {if (onClick) onClick()}}
        >
            { icon &&  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">{icon}</div>}
            {
                children
            }
        </div>
    )
}