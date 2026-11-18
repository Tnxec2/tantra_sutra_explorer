
import { Tag } from './Tag';




export const TagsBox = ({ tags, onClick }: {
    onClick?: (tag: string) => void,
    tags?: string[]
}) => {
    return (
        <div data-export-ignore className="flex flex-wrap gap-2 border-t border-slate-800 pt-2"
            aria-label="Tags">
            {tags?.map(tag => (
                <Tag key={tag} onClick={() => { if (onClick) onClick(tag) }}>
                    {tag}
                </Tag>
            ))}
        </div>
    )
}