"use client";

import type { ReactNode } from "react";
import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  Text,
  TextQuote,
} from "lucide-react";

interface CommandItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

interface Command {
  title: string;
  description: string;
  icon: ReactNode;
  command: ({ editor, range }: { editor: any; range: any }) => void;
}

const Command = ({ title, description, icon }: CommandItemProps) => (
  <div className="flex gap-2 w-full">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-background">
      {icon}
    </div>
    <div className="flex flex-col">
      <p className="font-medium">{title}</p>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  </div>
);

const commands: Command[] = [
  {
    title: "Text",
    description: "Just start typing...",
    icon: <Text size={16} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run();
    },
  },
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: <Heading1 size={16} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: <Heading2 size={16} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: <Heading3 size={16} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a bullet list",
    icon: <List size={16} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a numbered list",
    icon: <ListOrdered size={16} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Task List",
    description: "Create a task list",
    icon: <CheckSquare size={16} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "Blockquote",
    description: "Create a blockquote",
    icon: <TextQuote size={16} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: "Code Block",
    description: "Create a code block",
    icon: <Code size={16} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: "Image",
    description: "Upload an image",
    icon: <ImageIcon size={16} />,
    command: ({ editor, range }) => {
      // This is a placeholder. Ideally, you'd open an image upload dialog here.
      const url = window.prompt("Enter the image URL:");
      if (url) {
        editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
      }
    },
  },
];

const SlashCommands = Extension.create({
  name: "slash-commands",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: any;
          range: any;
          props: any;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          return commands.filter((item) => {
            return item.title.toLowerCase().includes(query.toLowerCase());
          });
        },
        render: () => {
          let component: any;
          let popup: any;

          return {
            onStart: (props: any) => {
              component = document.createElement("div");
              component.classList.add("slash-command-list");
              component.style.position = "absolute";
              component.style.zIndex = 1000;
              component.style.backgroundColor = "white";
              component.style.borderRadius = "0.5rem";
              component.style.boxShadow =
                "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)";
              component.style.overflow = "hidden";
              component.style.width = "20rem";
              component.style.maxHeight = "20rem";
              component.style.overflowY = "auto";

              popup = props.clientRect?.() || { left: 0, top: 0, bottom: 0 };

              // Check if we're in dark mode by looking at the html element
              const isDarkMode =
                document.documentElement.classList.contains("dark");
              if (isDarkMode) {
                component.style.backgroundColor = "#1f2937"; // Dark background for dark mode
                component.style.color = "white";
                component.style.border = "1px solid #374151";
              } else {
                component.style.backgroundColor = "white";
                component.style.color = "black";
                component.style.border = "1px solid #e5e7eb";
              }

              component.innerHTML = `
                <div class="p-2 cursor-pointer hover:bg-muted transition-colors">
                  ${commands
                    .filter((item) =>
                      item.title
                        .toLowerCase()
                        .includes(props.text.toLowerCase())
                    )
                    .map(
                      (item) => `
                    <div class="flex items-center gap-2 p-2 hover:bg-muted transition-colors" data-command="${
                      item.title
                    }">
                      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      } ${isDarkMode ? "bg-gray-800" : "bg-background"}">
                        ${
                          item.icon
                            ? (item.icon as any).outerHTML || item.icon
                            : ""
                        }
                      </div>
                      <div class="flex flex-col">
                        <p class="font-medium">${item.title}</p>
                        <p class="${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } text-sm">${item.description}</p>
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              `;

              // Calculate position
              const editorRect = props.editor.view.dom.getBoundingClientRect();
              const top = popup.top - editorRect.top;
              const left = popup.left - editorRect.left;

              component.style.top = `${top}px`;
              component.style.left = `${left}px`;

              props.editor.view.dom.parentElement?.appendChild(component);

              // Add click event listener to each command
              component
                .querySelectorAll("[data-command]")
                .forEach((item: any) => {
                  item.addEventListener("click", () => {
                    const commandTitle = item.getAttribute("data-command");
                    const command = commands.find(
                      (cmd) => cmd.title === commandTitle
                    );
                    if (command) {
                      command.command({
                        editor: props.editor,
                        range: props.range,
                      });
                      component.remove();
                    }
                  });
                });

              // Handle keyboard navigation and selection
              const items = component.querySelectorAll("[data-command]");
              let selectedIndex = 0;

              const selectItem = (index: number) => {
                items.forEach((item: Element, i: number) => {
                  if (i === index) {
                    item.classList.add("bg-muted");
                  } else {
                    item.classList.remove("bg-muted");
                  }
                });
              };

              selectItem(selectedIndex);

              const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  selectedIndex = (selectedIndex + 1) % items.length;
                  selectItem(selectedIndex);
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  selectedIndex =
                    (selectedIndex - 1 + items.length) % items.length;
                  selectItem(selectedIndex);
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  const commandTitle =
                    items[selectedIndex].getAttribute("data-command");
                  const command = commands.find(
                    (cmd) => cmd.title === commandTitle
                  );
                  if (command) {
                    command.command({
                      editor: props.editor,
                      range: props.range,
                    });
                    component.remove();
                    document.removeEventListener("keydown", handleKeyDown);
                  }
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  component.remove();
                  document.removeEventListener("keydown", handleKeyDown);
                }
              };

              document.addEventListener("keydown", handleKeyDown);
            },
            onUpdate: (props: any) => {
              popup = props.clientRect?.() || popup;
              const editorRect = props.editor.view.dom.getBoundingClientRect();
              const top = popup.top - editorRect.top;
              const left = popup.left - editorRect.left;

              component.style.top = `${top}px`;
              component.style.left = `${left}px`;

              // Update the list of commands based on the query
              const items = commands.filter((item) =>
                item.title.toLowerCase().includes(props.text.toLowerCase())
              );
              const isDarkMode =
                document.documentElement.classList.contains("dark");

              component.innerHTML = `
                <div class="p-2 cursor-pointer">
                  ${items
                    .map(
                      (item) => `
                    <div class="flex items-center gap-2 p-2 hover:bg-muted transition-colors" data-command="${
                      item.title
                    }">
                      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      } ${isDarkMode ? "bg-gray-800" : "bg-background"}">
                        ${
                          item.icon
                            ? (item.icon as any).outerHTML || item.icon
                            : ""
                        }
                      </div>
                      <div class="flex flex-col">
                        <p class="font-medium">${item.title}</p>
                        <p class="${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } text-sm">${item.description}</p>
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              `;

              // Re-add click event listeners
              component
                .querySelectorAll("[data-command]")
                .forEach((item: any) => {
                  item.addEventListener("click", () => {
                    const commandTitle = item.getAttribute("data-command");
                    const command = commands.find(
                      (cmd) => cmd.title === commandTitle
                    );
                    if (command) {
                      command.command({
                        editor: props.editor,
                        range: props.range,
                      });
                      component.remove();
                    }
                  });
                });
            },
            onKeyDown: (props: any) => {
              if (props.event.key === "Escape") {
                component.remove();
                return true;
              }
              return false;
            },
            onExit: () => {
              component.remove();
            },
          };
        },
      }),
    ];
  },
});

export default SlashCommands;
