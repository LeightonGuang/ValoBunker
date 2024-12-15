"use client";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Card,
  Button,
  Divider,
  Tooltip,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor, EditorContent } from "@tiptap/react";

import {
  BoldSvg,
  ItalicSvg,
  AlignLeftSvg,
  UnderlineSvg,
  BulletListSvg,
  AlignCenterSvg,
} from "./textEditorIcons";

interface NewsTextEditorProps {
  onContentChange?: (content: string) => void;
  content?: string;
}

const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Tooltip content="Header 1">
        <Button
          isIconOnly
          color={
            editor.isActive("heading", { level: 1 }) ? "primary" : "default"
          }
          variant="flat"
          onPress={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </Button>
      </Tooltip>

      <Tooltip content="Header 2">
        <Button
          isIconOnly
          color={
            editor.isActive("heading", { level: 2 }) ? "primary" : "default"
          }
          variant="flat"
          onPress={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </Button>
      </Tooltip>

      <Tooltip content="Header 3">
        <Button
          isIconOnly
          color={
            editor.isActive("heading", { level: 3 }) ? "primary" : "default"
          }
          variant="flat"
          onPress={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </Button>
      </Tooltip>

      <Tooltip content="Paragraph">
        <Button
          isIconOnly
          color={editor.isActive("paragraph") ? "primary" : "default"}
          variant="flat"
          onPress={() => editor.chain().focus().setParagraph().run()}
        >
          P
        </Button>
      </Tooltip>

      <Tooltip content="Bold">
        <Button
          isIconOnly
          color={editor.isActive("bold") ? "primary" : "default"}
          variant="flat"
          onPress={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldSvg className="h-4 w-4" />
        </Button>
      </Tooltip>

      <Tooltip content="Italic">
        <Button
          isIconOnly
          color={editor.isActive("italic") ? "primary" : "default"}
          variant="flat"
          onPress={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicSvg className="h-4 w-4" />
        </Button>
      </Tooltip>

      <Tooltip content="Underline">
        <Button
          isIconOnly
          color={editor.isActive("underline") ? "primary" : "default"}
          variant="flat"
          onPress={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineSvg className="h-4 w-4" />
        </Button>
      </Tooltip>

      <Tooltip content="List">
        <Button
          isIconOnly
          color={editor.isActive("bulletList") ? "primary" : "default"}
          variant="flat"
          onPress={() => editor.chain().focus().toggleBulletList().run()}
        >
          <BulletListSvg className="h-4 w-4" />
        </Button>
      </Tooltip>

      <Tooltip content="Align Left">
        <Button
          isIconOnly
          color={editor.isActive({ textAlign: "left" }) ? "primary" : "default"}
          variant="flat"
          onPress={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeftSvg className="h-4 w-4" />
        </Button>
      </Tooltip>

      <Tooltip content="Align Center">
        <Button
          isIconOnly
          color={
            editor.isActive({ textAlign: "center" }) ? "primary" : "default"
          }
          variant="flat"
          onPress={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenterSvg className="h-4 w-4" />
        </Button>
      </Tooltip>

      <Tooltip content="Align Right">
        <Button
          isIconOnly
          color={
            editor.isActive({ textAlign: "right" }) ? "primary" : "default"
          }
          variant="flat"
          onPress={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignLeftSvg className="h-4 w-4" />
        </Button>
      </Tooltip>
    </div>
  );
};

const TiptapEditor = ({ onContentChange, content }: NewsTextEditorProps) => {
  const tiptapExtensions = [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
    Placeholder.configure({
      placeholder: "Write something …",
      emptyEditorClass: "text-default-400",
    }),
    Underline,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
  ];

  const editor = useEditor({
    immediatelyRender: false,
    extensions: tiptapExtensions,
    content: content,

    onUpdate: ({ editor }) => {
      onContentChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] cursor-text rounded-md p-4 ring-offset-background focus-within:outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    // <div className="w-full rounded-[1.75rem] bg-default-100 p-4">
    //   <Toolbar editor={editor} />
    //   <EditorContent
    //     className="min-h-64 rounded-xl bg-white px-3 py-2 text-black outline-none focus:outline-none"
    //     editor={editor}
    //   />
    // </div>
    <Card>
      <CardHeader>
        <Toolbar editor={editor} />
      </CardHeader>

      <Divider />

      <CardBody>
        <EditorContent editor={editor} />
      </CardBody>
    </Card>
  );
};

export default TiptapEditor;
