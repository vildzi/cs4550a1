"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { Button, ButtonGroup } from "react-bootstrap";

type Props = {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  minHeight?: number;
  placeholder?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  disabled = false,
  minHeight = 120,
}: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap-content form-control",
        style: `min-height: ${minHeight}px; white-space: pre-wrap;`,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  if (!editor) {
    return (
      <div
        className="form-control"
        style={{ minHeight, background: "#f8f9fa" }}
      />
    );
  }

  return (
    <div className="wd-rte border rounded p-2">
      <ButtonGroup size="sm" className="mb-2">
        <Button
          variant="outline-secondary"
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          disabled={disabled}
        >
          <b>B</b>
        </Button>
        <Button
          variant="outline-secondary"
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          disabled={disabled}
        >
          <i>I</i>
        </Button>
        <Button
          variant="outline-secondary"
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          disabled={disabled}
        >
          <s>S</s>
        </Button>
        <Button
          variant="outline-secondary"
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          disabled={disabled}
        >
          •
        </Button>
        <Button
          variant="outline-secondary"
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          disabled={disabled}
        >
          1.
        </Button>
        <Button
          variant="outline-secondary"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          disabled={disabled}
        >
          H2
        </Button>
      </ButtonGroup>
      <EditorContent editor={editor} />
    </div>
  );
}
