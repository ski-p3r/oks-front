"use client";

import type React from "react";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  TableIcon,
  YoutubeIcon,
  AlertTriangle,
  Palette,
  Upload,
} from "lucide-react";
import { useState, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToolbarProps {
  editor: Editor;
  onSave?: () => void;
  onLoad?: () => void;
}

export default function Toolbar({ editor, onSave, onLoad }: ToolbarProps) {
  const [linkUrl, setLinkUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageAlt, setImageAlt] = useState<string>("");
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [tableRows, setTableRows] = useState<number>(3);
  const [tableCols, setTableCols] = useState<number>(3);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<string>("info");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl, target: "_blank" })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          editor
            .chain()
            .focus()
            .setImage({ src: reader.result, alt: file.name })
            .run();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addYoutubeVideo = () => {
    if (youtubeUrl) {
      editor.commands.setYoutubeVideo({
        src: youtubeUrl,
      });
    }
  };

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: true })
      .run();
  };

  const addAlert = () => {
    if (alertText) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "customAlert",
          attrs: { type: alertType, text: alertText },
        })
        .run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border-b p-1 sticky top-0 bg-background z-10 flex flex-wrap gap-0.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-muted" : ""}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-muted" : ""}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "bg-muted" : ""}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "bg-muted" : ""}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
      >
        <Heading2 className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "bg-muted" : ""}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "bg-muted" : ""}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={editor.isActive("taskList") ? "bg-muted" : ""}
      >
        <CheckSquare className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "bg-muted" : ""}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "bg-muted" : ""}
      >
        <Code className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={editor.isActive("link") ? "bg-muted" : ""}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="link">Link URL</Label>
              <Input
                id="link"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={setLink} className="flex-1">
                Set Link
              </Button>
              <Button
                variant="outline"
                onClick={() => editor.chain().focus().unsetLink().run()}
                className="flex-1"
              >
                Remove Link
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            <ImageIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <Tabs defaultValue="url">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageAlt">Alt Text</Label>
                <Input
                  id="imageAlt"
                  placeholder="Image description"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                />
              </div>
              <Button onClick={addImage}>Add Image</Button>
            </TabsContent>
            <TabsContent value="upload" className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="imageUpload">Upload Image</Label>
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex gap-2"
              >
                <Upload className="h-4 w-4" /> Choose File
              </Button>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={editor.isActive({ textAlign: "left" }) ? "bg-muted" : ""}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={editor.isActive({ textAlign: "center" }) ? "bg-muted" : ""}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={editor.isActive({ textAlign: "right" }) ? "bg-muted" : ""}
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            <TableIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tableRows">Rows</Label>
                <Input
                  id="tableRows"
                  type="number"
                  min="1"
                  max="10"
                  value={tableRows}
                  onChange={(e) =>
                    setTableRows(Number.parseInt(e.target.value))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tableCols">Columns</Label>
                <Input
                  id="tableCols"
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) =>
                    setTableCols(Number.parseInt(e.target.value))
                  }
                />
              </div>
            </div>
            <Button onClick={insertTable}>Insert Table</Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                disabled={!editor.can().addColumnBefore()}
              >
                Add Column Before
              </Button>
              <Button
                variant="outline"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                disabled={!editor.can().addColumnAfter()}
              >
                Add Column After
              </Button>
              <Button
                variant="outline"
                onClick={() => editor.chain().focus().addRowBefore().run()}
                disabled={!editor.can().addRowBefore()}
              >
                Add Row Before
              </Button>
              <Button
                variant="outline"
                onClick={() => editor.chain().focus().addRowAfter().run()}
                disabled={!editor.can().addRowAfter()}
              >
                Add Row After
              </Button>
              <Button
                variant="outline"
                onClick={() => editor.chain().focus().deleteColumn().run()}
                disabled={!editor.can().deleteColumn()}
              >
                Delete Column
              </Button>
              <Button
                variant="outline"
                onClick={() => editor.chain().focus().deleteRow().run()}
                disabled={!editor.can().deleteRow()}
              >
                Delete Row
              </Button>
              <Button
                variant="outline"
                onClick={() => editor.chain().focus().deleteTable().run()}
                disabled={!editor.can().deleteTable()}
                className="col-span-2"
              >
                Delete Table
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            <YoutubeIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="youtubeUrl">YouTube URL</Label>
              <Input
                id="youtubeUrl"
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
            </div>
            <Button onClick={addYoutubeVideo}>Add YouTube Video</Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            <AlertTriangle className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="alertType">Alert Type</Label>
              <Select
                value={alertType}
                onValueChange={(value) => setAlertType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select alert type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="alertText">Alert Text</Label>
              <Input
                id="alertText"
                placeholder="Alert message"
                value={alertText}
                onChange={(e) => setAlertText(e.target.value)}
              />
            </div>
            <Button onClick={addAlert}>Add Alert</Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            <Palette className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Text Color</Label>
              <div className="flex flex-wrap gap-1">
                {[
                  "#000000",
                  "#FF0000",
                  "#00FF00",
                  "#0000FF",
                  "#FFFF00",
                  "#FF00FF",
                  "#00FFFF",
                  "#808080",
                ].map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color }}
                    onClick={() => editor.chain().focus().setColor(color).run()}
                  />
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Highlight Color</Label>
              <div className="flex flex-wrap gap-1">
                {[
                  "#FFFF00",
                  "#00FFFF",
                  "#FF00FF",
                  "#FF0000",
                  "#00FF00",
                  "#0000FF",
                ].map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      editor.chain().focus().toggleHighlight({ color }).run()
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
