"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Heading1, Heading2, Italic, Link2, List, ListOrdered, Minus, Redo, Undo } from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function ArtikelEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({
        placeholder: placeholder ?? "Tulis konten artikel di sini... (bisa paste dari Word)",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none focus:outline-none min-h-[360px] px-4 py-3 text-[13px]",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  type ToolItem =
    | { type: "button"; label: React.ReactNode; title: string; action: () => void; active: boolean }
    | { type: "sep" };

  const tools: ToolItem[] = [
    {
      type: "button",
      label: <Bold className="h-3.5 w-3.5" />,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
    },
    {
      type: "button",
      label: <Italic className="h-3.5 w-3.5" />,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
    },
    { type: "sep" },
    {
      type: "button",
      label: <Heading1 className="h-3.5 w-3.5" />,
      title: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
    },
    {
      type: "button",
      label: <Heading2 className="h-3.5 w-3.5" />,
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
    },
    { type: "sep" },
    {
      type: "button",
      label: <List className="h-3.5 w-3.5" />,
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
    },
    {
      type: "button",
      label: <ListOrdered className="h-3.5 w-3.5" />,
      title: "Numbered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
    },
    {
      type: "button",
      label: <Minus className="h-3.5 w-3.5" />,
      title: "Garis Pemisah",
      action: () => editor.chain().focus().setHorizontalRule().run(),
      active: false,
    },
    { type: "sep" },
    {
      type: "button",
      label: <Link2 className="h-3.5 w-3.5" />,
      title: "Link",
      action: () => {
        const url = window.prompt("URL:");
        if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        else editor.chain().focus().unsetLink().run();
      },
      active: editor.isActive("link"),
    },
    { type: "sep" },
    {
      type: "button",
      label: <Undo className="h-3.5 w-3.5" />,
      title: "Undo",
      action: () => editor.chain().focus().undo().run(),
      active: false,
    },
    {
      type: "button",
      label: <Redo className="h-3.5 w-3.5" />,
      title: "Redo",
      action: () => editor.chain().focus().redo().run(),
      active: false,
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        {tools.map((tool, i) =>
          tool.type === "sep" ? (
            <div key={`sep-${i}`} className="mx-1 h-5 w-px bg-slate-200" />
          ) : (
            <button
              key={tool.title}
              type="button"
              title={tool.title}
              onClick={tool.action}
              className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                tool.active
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {tool.label}
            </button>
          ),
        )}
      </div>

      {/* Tips paste Word */}
      <div className="border-b border-slate-100 bg-amber-50 px-4 py-1.5 text-[10px] text-amber-700">
        Tips: Tulis di Word → Ctrl+A → Ctrl+C → klik di area bawah → Ctrl+V. Bold, heading, dan list akan terbawa otomatis.
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
