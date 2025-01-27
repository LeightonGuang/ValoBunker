"use client";

import { useEffect } from "react";
import {
  Card,
  Button,
  Divider,
  Tooltip,
  Dropdown,
  CardBody,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@heroui/react";
import Table from "@tiptap/extension-table";
import StarterKit from "@tiptap/starter-kit";
import TableRow from "@tiptap/extension-table-row";
import Underline from "@tiptap/extension-underline";
import TableCell from "@tiptap/extension-table-cell";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import TableHeader from "@tiptap/extension-table-header";
import { useEditor, EditorContent } from "@tiptap/react";

import {
  UndoSvg,
  RedoSvg,
  BoldSvg,
  TableSvg,
  ItalicSvg,
  AlignLeftSvg,
  UnderlineSvg,
  BulletListSvg,
  AlignCenterSvg,
  OrderedListSvg,
} from "./textEditorIcons";
import { ChevronDown } from "./icons";
interface NewsTextEditorProps {
  onContentChange?: (content: string) => void;
  value: string;
}

const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Tooltip content="Undo">
        <Button
          isIconOnly
          isDisabled={!editor.can().undo()}
          variant="flat"
          onPress={() => editor.chain().focus().undo().run()}
        >
          <UndoSvg className="h-4 w-4" />
        </Button>
      </Tooltip>

      <Tooltip content="Redo">
        <Button
          isIconOnly
          isDisabled={!editor.can().redo()}
          variant="flat"
          onPress={() => editor.chain().focus().redo().run()}
        >
          <RedoSvg className="h-4 w-4" />
        </Button>
      </Tooltip>

      <Divider className="h-10" orientation="vertical" />

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

      <Divider className="h-10" orientation="vertical" />

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

      <Divider className="h-10" orientation="vertical" />

      <Tooltip content="Bullet List">
        <Button
          isIconOnly
          color={editor.isActive("bulletList") ? "primary" : "default"}
          variant="flat"
          onPress={() => editor.chain().focus().toggleBulletList().run()}
        >
          <BulletListSvg className="h-4 w-4" />
        </Button>
      </Tooltip>

      <Tooltip content="Ordered List">
        <Button
          isIconOnly
          color={editor.isActive("orderedList") ? "primary" : "default"}
          variant="flat"
          onPress={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <OrderedListSvg className="h-4 w-4" />
        </Button>
      </Tooltip>

      <Tooltip content="Table">
        <Dropdown>
          <DropdownTrigger>
            <Button
              isIconOnly
              color={editor.isActive("table") ? "primary" : "default"}
              endContent={<ChevronDown fill="currentColor" size={16} />}
              variant="flat"
              onPress={() => editor.chain().focus().toggleTable().run()}
            >
              <TableSvg className="h-4 w-4" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Table" onAction={(action) => action}>
            <DropdownItem key="insertTable">
              <Button
                variant="flat"
                onPress={() =>
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run()
                }
              >
                Create table
              </Button>
            </DropdownItem>
            <DropdownItem key="addColumnBefore">
              <Button
                variant="flat"
                onPress={() => editor.chain().focus().addColumnBefore().run()}
              >
                Add column before
              </Button>
            </DropdownItem>
            <DropdownItem key="addColumnAfter">
              <Button
                variant="flat"
                onPress={() => editor.chain().focus().addColumnAfter().run()}
              >
                Add column after
              </Button>
            </DropdownItem>
            <DropdownItem key="deleteColumn">
              <Button
                variant="flat"
                onPress={() => editor.chain().focus().deleteColumn().run()}
              >
                Delete column
              </Button>
            </DropdownItem>
            <DropdownItem key="addRowBefore">
              <Button
                variant="flat"
                onPress={() => editor.chain().focus().addRowBefore().run()}
              >
                Add row before
              </Button>
            </DropdownItem>
            <DropdownItem key="addRowAfter">
              <Button
                variant="flat"
                onPress={() => editor.chain().focus().addRowAfter().run()}
              >
                Add row after
              </Button>
            </DropdownItem>
            <DropdownItem key="deleteRow">
              <Button
                variant="flat"
                onPress={() => editor.chain().focus().deleteRow().run()}
              >
                Delete row
              </Button>
            </DropdownItem>
            <DropdownItem key="deleteTable">
              <Button
                color="danger"
                variant="flat"
                onPress={() => editor.chain().focus().deleteTable().run()}
              >
                Delete table
              </Button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Tooltip>

      <Divider className="h-10" orientation="vertical" />

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

const NextTextEditor = ({ onContentChange, value }: NewsTextEditorProps) => {
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
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableCell,
    TableHeader,
    Underline,
  ];

  const editor = useEditor({
    immediatelyRender: false,
    extensions: tiptapExtensions,
    content: value,

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

  useEffect(() => {
    if (editor && !editor.isFocused) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  return (
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

export default NextTextEditor;
