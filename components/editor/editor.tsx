"use client";

import type React from "react";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { useCallback, useState, useRef } from "react";
import { common, createLowlight } from "lowlight";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  ImageIcon,
  LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Create a lowlight instance with common languages
const lowlight = createLowlight(common);

interface EditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function Editor({
  initialContent = "",
  onChange,
  placeholder = "Start writing your story...",
}: EditorProps) {
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false, // Disable the default code block to use CodeBlockLowlight
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#22AA86] underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-md max-w-full mx-auto my-4",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        languageClassPrefix: "language-",
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-green dark:prose-invert prose-headings:font-bold prose-p:my-2 prose-img:my-4 focus:outline-none min-h-[300px] max-w-none p-4",
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // Update link
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkUrl })
      .run();
    setIsLinkPopoverOpen(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!editor) return;

    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setIsImagePopoverOpen(false);
    }
  }, [editor, imageUrl]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && editor) {
          editor
            .chain()
            .focus()
            .setImage({ src: event.target.result.toString() })
            .run();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="editor-wrapper relative border rounded-md">
      <div className="flex flex-wrap gap-1 p-1 border-b bg-muted/40">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("h-8 w-8", editor.isActive("bold") ? "bg-muted" : "")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("h-8 w-8", editor.isActive("italic") ? "bg-muted" : "")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            "h-8 w-8",
            editor.isActive("underline") ? "bg-muted" : ""
          )}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn("h-8 w-8", editor.isActive("strike") ? "bg-muted" : "")}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={cn(
            "h-8 w-8",
            editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""
          )}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={cn(
            "h-8 w-8",
            editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""
          )}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={cn(
            "h-8 w-8",
            editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""
          )}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={cn(
            "h-8 w-8",
            editor.isActive({ textAlign: "left" }) ? "bg-muted" : ""
          )}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={cn(
            "h-8 w-8",
            editor.isActive({ textAlign: "center" }) ? "bg-muted" : ""
          )}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={cn(
            "h-8 w-8",
            editor.isActive({ textAlign: "right" }) ? "bg-muted" : ""
          )}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={cn(
            "h-8 w-8",
            editor.isActive({ textAlign: "justify" }) ? "bg-muted" : ""
          )}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-8 w-8",
            editor.isActive("bulletList") ? "bg-muted" : ""
          )}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-8 w-8",
            editor.isActive("orderedList") ? "bg-muted" : ""
          )}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "h-8 w-8",
            editor.isActive("blockquote") ? "bg-muted" : ""
          )}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            "h-8 w-8",
            editor.isActive("codeBlock") ? "bg-muted" : ""
          )}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                editor.isActive("link") ? "bg-muted" : ""
              )}
              title="Add Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium">Insert Link</div>
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="col-span-3"
              />
              <div className="flex justify-between mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLinkPopoverOpen(false)}
                >
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={setLink}
                  className="bg-[#22AA86] hover:bg-[#1c8f70]"
                >
                  <Check className="h-4 w-4 mr-1" /> Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Popover open={isImagePopoverOpen} onOpenChange={setIsImagePopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Add Image"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <Tabs defaultValue="url">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="mt-2">
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium">Image URL</div>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <div className="flex justify-between mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsImagePopoverOpen(false)}
                    >
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={addImage}
                      className="bg-[#22AA86] hover:bg-[#1c8f70]"
                    >
                      <Check className="h-4 w-4 mr-1" /> Insert
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="upload" className="mt-2">
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium">Upload Image</div>
                  <Input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsImagePopoverOpen(false)}
                    >
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
        <div className="w-px h-8 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-background rounded-md shadow-md border overflow-hidden flex"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "h-8 w-8 rounded-none",
              editor.isActive("bold") ? "bg-muted" : ""
            )}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "h-8 w-8 rounded-none",
              editor.isActive("italic") ? "bg-muted" : ""
            )}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(
              "h-8 w-8 rounded-none",
              editor.isActive("underline") ? "bg-muted" : ""
            )}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const url = editor.getAttributes("link").href;
              setLinkUrl(url || "");
              setIsLinkPopoverOpen(true);
            }}
            className={cn(
              "h-8 w-8 rounded-none",
              editor.isActive("link") ? "bg-muted" : ""
            )}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}
