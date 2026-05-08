/*
|-----------------------------------------
| setting up GenerateRichTextEditorMenuBar for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const generateRichTextEditorMenuBar = (): string => {
  return ` import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    Highlighter,
    Italic,
    List,
    ListOrdered,
    Strikethrough,
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import { Editor } from '@tiptap/react'

export default function MenuBar({ editor }: { editor: Editor | null }) {
    if (!editor) {
        return null
    }

    const Options = [
        {
            icon: <Heading1 className="size-4" />,
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 1 }).run(),
            preesed: editor.isActive('heading', { level: 1 }),
        },
        {
            icon: <Heading2 className="size-4" />,
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 2 }).run(),
            preesed: editor.isActive('heading', { level: 2 }),
        },
        {
            icon: <Heading3 className="size-4" />,
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 3 }).run(),
            preesed: editor.isActive('heading', { level: 3 }),
        },
        {
            icon: <Heading4 className="size-4" />,
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 4 }).run(),
            preesed: editor.isActive('heading', { level: 4 }),
        },
        {
            icon: <Heading5 className="size-4" />,
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 5 }).run(),
            preesed: editor.isActive('heading', { level: 5 }),
        },
        {
            icon: <Heading6 className="size-4" />,
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 6 }).run(),
            preesed: editor.isActive('heading', { level: 6 }),
        },
        {
            icon: <Bold className="size-4" />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            preesed: editor.isActive('bold'),
        },
        {
            icon: <Italic className="size-4" />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            preesed: editor.isActive('italic'),
        },
        {
            icon: <Strikethrough className="size-4" />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            preesed: editor.isActive('strike'),
        },
        {
            icon: <AlignLeft className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign('left').run(),
            preesed: editor.isActive({ textAlign: 'left' }),
        },
        {
            icon: <AlignCenter className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign('center').run(),
            preesed: editor.isActive({ textAlign: 'center' }),
        },
        {
            icon: <AlignRight className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign('right').run(),
            preesed: editor.isActive({ textAlign: 'right' }),
        },
        {
            icon: <List className="size-4" />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            preesed: editor.isActive('bulletList'),
        },
        {
            icon: <ListOrdered className="size-4" />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            preesed: editor.isActive('orderedList'),
        },
        {
            icon: <Highlighter className="size-4" />,
            onClick: () => editor.chain().focus().toggleHighlight().run(),
            preesed: editor.isActive('highlight'),
        },
    ]

    return (
        <div className="border rounded-md p-1 mb-1 space-x-2 z-50 space-y-1">
            {Options.map((option, index) => (
                <Toggle
                    key={index}
                    pressed={option.preesed}
                    onPressedChange={option.onClick}
                    className={\` border-1 rounded-md cursor-pointer \${option.preesed ? 'border-slate-500' : 'border-slate-50'}\`}
                >
                    {option.icon}
                </Toggle>
            ))}
        </div>
    )
}

`;
};
