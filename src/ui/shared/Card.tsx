import { ReactNode } from 'react';

type T = {
    children: ReactNode
}

export const Card = ({children}: T) => {
    return (
        <div className="bg-[#14102b]/50 
        backdrop-blur-md 
        p-3.5 
        rounded-xl 
        border 
        border-amber-500/15
        flex flex-col
        justify-between 
        space-y-3">
            {
                children
            }
        </div>
    )
}

export const CardHeader = ({icon, title, uppercase, primary, children}: {
    children?: ReactNode,
    icon?: ReactNode,
    title?: string,
    uppercase?: boolean,
    primary?: boolean
}) => {
    return (
        <div className="flex items-center space-x-2 pr-10">
            { icon &&  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">{icon}</div>}
            { title && <h4 className={`font-serif font-bold text-base 
                ${primary ? 'text-amber-400/80' : 'text-amber-100'}
                ${uppercase && 'uppercase'}`}>{title}</h4>}
            {
                children
            }
        </div>
    )
}