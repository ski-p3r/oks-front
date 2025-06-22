"use client";

import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

const AlertComponent = (props: any) => {
  const type = props.node.attrs.type || "info";
  const text = props.node.attrs.text || "";

  const getAlertStyles = () => {
    switch (type) {
      case "info":
        return {
          bg: "bg-blue-50 dark:bg-blue-950",
          border: "border-blue-200 dark:border-blue-800",
          icon: <Info className="h-5 w-5 text-blue-500" />,
        };
      case "warning":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-950",
          border: "border-yellow-200 dark:border-yellow-800",
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        };
      case "error":
        return {
          bg: "bg-red-50 dark:bg-red-950",
          border: "border-red-200 dark:border-red-800",
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        };
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-950",
          border: "border-green-200 dark:border-green-800",
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        };
      default:
        return {
          bg: "bg-blue-50 dark:bg-blue-950",
          border: "border-blue-200 dark:border-blue-800",
          icon: <Info className="h-5 w-5 text-blue-500" />,
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div
      className={`my-4 flex gap-3 rounded-md border p-4 ${styles.bg} ${styles.border}`}
      contentEditable={false}
    >
      <div className="flex-shrink-0">{styles.icon}</div>
      <div>{text}</div>
    </div>
  );
};

export default Node.create({
  name: "customAlert",
  group: "block",
  content: "",
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      type: {
        default: "info",
      },
      text: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="custom-alert"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "custom-alert" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AlertComponent);
  },
});
