import { ReactNode, useRef } from "react"
import { ShareMenu } from "./ShareMenu"


export const ShareableContent = ({ title, markdownContent, verseNum, verseTitle, className, children }:
    { title: string, markdownContent: string, verseNum: string, verseTitle?: string, className: string, children: ReactNode }) => {
    const contentRef = useRef<HTMLDivElement>(null)

    return <div className="relative">
        <div ref={contentRef} className={className}>
            {children}
            <p className="mt-4 text-[10px] leading-tight text-slate-500 text-end">
                {verseNum} {verseTitle ? `• ${verseTitle}` : ""}
            </p>
        </div>
        <ShareMenu
            title={title}
            markdownContent={`${markdownContent}\n\n> — ${verseNum}${verseTitle ? ` • ${verseTitle}` : ""}`}
            targetRef={contentRef}
        />
    </div>
}