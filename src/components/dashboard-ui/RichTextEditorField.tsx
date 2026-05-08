/*
|-----------------------------------------
| setting up RichTextEditorField for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import {
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
} from 'lucide-react';
import React, { useEffect } from 'react';

import { cn } from '@/lib/utils';
import StarterKit from '@tiptap/starter-kit';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor, EditorContent, Editor } from '@tiptap/react';

function EditorMenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
    },
    {
      icon: <Heading4 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: editor.isActive('heading', { level: 4 }),
    },
    {
      icon: <Heading5 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      isActive: editor.isActive('heading', { level: 5 }),
    },
    {
      icon: <Heading6 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
      isActive: editor.isActive('heading', { level: 6 }),
    },
    { icon: <Bold className="size-4" />, onClick: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold') },
    { icon: <Italic className="size-4" />, onClick: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic') },
    { icon: <Strikethrough className="size-4" />, onClick: () => editor.chain().focus().toggleStrike().run(), isActive: editor.isActive('strike') },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' }),
    },
    { icon: <List className="size-4" />, onClick: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList') },
    { icon: <ListOrdered className="size-4" />, onClick: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList') },
    { icon: <Highlighter className="size-4" />, onClick: () => editor.chain().focus().toggleHighlight().run(), isActive: editor.isActive('highlight') },
  ];

  return (
    <div
      className={cn(
        'flex flex-wrap gap-1 p-1 mb-3 rounded-sm border border-white/20',
        'bg-white/10 backdrop-blur-md shadow-sm hover:bg-white/15 transition-all',
      )}
    >
      {options.map((option, index) => (
        <Toggle
          key={index}
          size="sm"
          pressed={option.isActive}
          onPressedChange={option.onClick}
          className={cn(
            'rounded-sm bg-white/5 hover:bg-white/20 transition-all border border-transparent',
            option.isActive && 'bg-white/20 border-white/30 shadow-sm',
          )}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
}

export interface RichTextEditorProps {
  id: string;
  value: string;
  onChange: (content: string) => void;
  label?: string;
  className?: string;
}

export default function RichTextEditorField({ id, value, onChange, label, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: 'list-disc pl-4' } },
        orderedList: { HTMLAttributes: { class: 'list-decimal pl-4' } },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg min-h-[150px] w-full rounded-sm border border-white/20 bg-white/10 backdrop-blur-md px-3 py-2 text-sm text-white/90 placeholder:text-white/40 shadow-inner transition-all focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent focus:outline-none focus:ring-0',
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  return (
    <div className={cn('grid w-full gap-2 text-white', className)}>
      {label && (
        <Label htmlFor={id} className="text-white/80 tracking-wide">
          {label}
        </Label>
      )}
      <div className={cn('rounded-sm border border-white/20 bg-white/5 backdrop-blur-md shadow-lg p-2', 'hover:bg-white/10 transition-all duration-200')}>
        <EditorMenuBar editor={editor} />
        <div className="rounded-sm overflow-hidden border border-white/10">
          <EditorContent editor={editor} id={id} />
        </div>
      </div>
    </div>
  );
}
