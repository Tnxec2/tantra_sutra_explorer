import { ReactNode } from 'react';




export const TextBoxBordered = ({icon, title, children}: {
    icon?: ReactNode,
    title?: string,
    children?: ReactNode,
}) => {
    return (
        <div className="text-sm text-slate-200 leading-relaxed
         bg-theme-input/60
         p-2.5 
         rounded-lg border border-slate-800">
            { icon &&  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">{icon}</div>}
            { title && <h4 className="text-amber-300 font-semibold block mb-0.5">{title}</h4>}
            {
                children && <span className="text-slate-300">{children}</span>
            }
        </div>
    )
}

export const TextBox = ({icon, title, children}: {
    icon?: ReactNode,
    title?: string,
    children?: ReactNode,
}) => {
    return (
        <div className="text-sm text-slate-200 leading-relaxed">
            { icon &&  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">{icon}</div>}
            { title && <h4 className="text-amber-300 font-semibold block mb-0.5">{title}</h4>}
            {
                children && <span className="text-slate-300">{children}</span>
            }
        </div>
    )
}