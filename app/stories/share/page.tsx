"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Editor from "@/components/editor/editor";
import TagSelector from "@/components/tag-selector";
import { toast } from "sonner";
import { createStory } from "@/lib/api/stories";
import { Loader2, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MarkdownPreview from "@/components/markdown-preview";

// Form schema
const storyFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  body: z.string().min(50, {
    message: "Story content must be at least 50 characters.",
  }),
  image_url: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  tags: z.array(z.string()).min(1, {
    message: "Please select at least one tag.",
  }),
});

type StoryFormValues = z.infer<typeof storyFormSchema>;

export default function CreateStoryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [activeTab, setActiveTab] = useState<string>("edit");
  const router = useRouter();

  // Initialize form with default values
  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      title: "",
      body: "",
      image_url: "",
      tags: [],
    },
  });

  // This prevents Enter key from submitting the form
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.target instanceof HTMLElement) {
        // Allow Enter in textareas
        if (e.target.tagName === "TEXTAREA") return;

        // Check if the target is an input and it's not part of the editor
        if (
          e.target.tagName === "INPUT" &&
          !e.target.closest(".editor-wrapper")
        )
          return;

        // If it's inside the editor, prevent form submission
        if (e.target.closest(".editor-wrapper")) {
          e.stopPropagation();
          if (!e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
          }
        }
      }
    };

    // Add the event listener
    document.addEventListener("keydown", handleKeyDown);

    // Clean up
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    form.setValue("body", content, { shouldValidate: true });
  };

  const handleTagsChange = (selectedTags: string[]) => {
    form.setValue("tags", selectedTags, { shouldValidate: true });
  };

  async function onSubmit(data: StoryFormValues) {
    // Double-check that editor content is included
    if (!data.body && editorContent) {
      data.body = editorContent;
    }

    setIsSubmitting(true);
    try {
      const result = await createStory(data);
      toast.success("Story created successfully!");
      router.push(`/stories/${result.id}`);
    } catch (error: any) {
      console.error("Error creating story:", error);
      toast.error(error.message || "Failed to create story. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Create Story</h1>
      <Alert className="mb-6 border-[#22AA86]/30 bg-[#22AA86]/10">
        <AlertTriangle className="h-4 w-4 text-[#22AA86]" />
        <AlertDescription>
          Use the "Publish Story" button at the bottom to submit your story.
          Press Shift+Enter for new lines in the editor.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle>Story Details</CardTitle>
          <CardDescription>
            Share your kidney journey with the community. Your story can inspire
            and help others.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="prevent-submission-on-enter"
          >
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a compelling title for your story"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between items-center">
                      <span>Story Content</span>
                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-xs"
                          onClick={() =>
                            setActiveTab(
                              activeTab === "edit" ? "preview" : "edit"
                            )
                          }
                        >
                          {activeTab === "edit" ? (
                            <>
                              <Eye className="h-3.5 w-3.5" />
                              Preview
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3.5 w-3.5" />
                              Edit
                            </>
                          )}
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <div className="border rounded-md overflow-hidden">
                        {activeTab === "edit" ? (
                          <Editor
                            initialContent={field.value}
                            onChange={handleEditorChange}
                          />
                        ) : (
                          <div className="p-4 min-h-[300px] bg-muted/20">
                            <MarkdownPreview content={editorContent} />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {field.value && (
                      <div className="mt-2 border rounded-md p-2">
                        <img
                          src={field.value || "/placeholder.svg"}
                          alt="Preview"
                          className="max-h-40 mx-auto object-contain"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/abstract-geometric-flow.png";
                          }}
                        />
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <TagSelector
                        selectedTags={field.value}
                        onChange={handleTagsChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#22AA86] hover:bg-[#1c8f70]"
                disabled={isSubmitting}
                onClick={() => {
                  // Ensure editor content is included in submission
                  if (editorContent && !form.getValues().body) {
                    form.setValue("body", editorContent, {
                      shouldValidate: true,
                    });
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Publish Story"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
