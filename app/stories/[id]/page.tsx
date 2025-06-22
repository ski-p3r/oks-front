"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MessageSquare,
  ArrowLeft,
  Loader2,
  X,
  Heart,
  Share2,
  Clock,
  ThumbsUp,
  Send,
} from "lucide-react";
import Link from "next/link";
import { getStoryById, likeStory } from "@/lib/api/stories";
import {
  getCommentsByStoryId,
  createComment,
  createStoryComment,
} from "@/lib/api/comments";
import { formatDate } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { toast } from "sonner";

interface CommentFormData {
  content: string;
  parent?: number | null;
}

interface CommentUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  city: string;
  avatar_url: string;
  created_at: string;
}

interface CommentReply {
  id: number;
  story: number;
  user: CommentUser;
  content: string;
  parent: number;
  created_at: string;
  likes?: number;
}

interface Comment {
  id: number;
  story: number;
  user: CommentUser;
  content: string;
  parent: number | null;
  created_at: string;
  replies: CommentReply[];
  likes?: number;
}

interface Tag {
  id: number;
  name: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  city: string;
  avatar_url: string;
  created_at: string;
}

interface Story {
  id: number;
  title: string;
  body: string;
  image_url: string;
  user: User;
  tags: Tag[];
  like_count: number;
  is_liked: boolean;
  views: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

// Custom components for ReactMarkdown
const components = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code
        className={`${className} bg-muted px-1.5 py-0.5 rounded text-sm font-mono`}
        {...props}
      >
        {children}
      </code>
    );
  },
  blockquote({ node, children, ...props }: any) {
    // Check for GitHub-style alerts
    const childrenString = String(children);
    if (childrenString.includes("[!NOTE]")) {
      return (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 my-4 rounded-r-md">
          <div className="flex items-start gap-2">
            <div className="text-blue-800 dark:text-blue-300">
              {children.toString().replace("[!NOTE]", "")}
            </div>
          </div>
        </div>
      );
    } else if (childrenString.includes("[!WARNING]")) {
      return (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 my-4 rounded-r-md">
          <div className="flex items-start gap-2">
            <div className="text-amber-800 dark:text-amber-300">
              {children.toString().replace("[!WARNING]", "")}
            </div>
          </div>
        </div>
      );
    } else if (childrenString.includes("[!TIP]")) {
      return (
        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 my-4 rounded-r-md">
          <div className="flex items-start gap-2">
            <div className="text-green-800 dark:text-green-300">
              {children.toString().replace("[!TIP]", "")}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <blockquote
          className="border-l-4 border-[#22AA86] pl-4 italic my-4 text-muted-foreground"
          {...props}
        >
          {children}
        </blockquote>
      );
    }
  },
  a({ node, children, ...props }: any) {
    return (
      <a className="text-[#22AA86] hover:underline" {...props}>
        {children}
      </a>
    );
  },
  img({ node, ...props }: any) {
    return <img className="max-w-full rounded-md my-4" {...props} />;
  },
  table({ node, children, ...props }: any) {
    return (
      <div className="overflow-x-auto my-4">
        <table
          className="min-w-full border-collapse border border-border"
          {...props}
        >
          {children}
        </table>
      </div>
    );
  },
  th({ node, children, ...props }: any) {
    return (
      <th
        className="border border-border bg-muted px-4 py-2 text-left font-medium"
        {...props}
      >
        {children}
      </th>
    );
  },
  td({ node, children, ...props }: any) {
    return (
      <td className="border border-border px-4 py-2" {...props}>
        {children}
      </td>
    );
  },
  li({ node, children, ordered, checked, ...props }: any) {
    if (typeof checked === "boolean") {
      return (
        <li className="flex items-start gap-2 my-1" {...props}>
          <input type="checkbox" checked={checked} readOnly className="mt-1" />
          <span>{children}</span>
        </li>
      );
    }
    return (
      <li className="my-1" {...props}>
        {children}
      </li>
    );
  },
  h1({ node, children, ...props }: any) {
    return (
      <h1 className="text-2xl font-bold mt-6 mb-4" {...props}>
        {children}
      </h1>
    );
  },
  h2({ node, children, ...props }: any) {
    return (
      <h2 className="text-xl font-bold mt-5 mb-3" {...props}>
        {children}
      </h2>
    );
  },
  h3({ node, children, ...props }: any) {
    return (
      <h3 className="text-lg font-bold mt-4 mb-2" {...props}>
        {children}
      </h3>
    );
  },
  hr({ node, ...props }: any) {
    return <hr className="my-6 border-t border-border" {...props} />;
  },
  p({ node, children, ...props }: any) {
    return (
      <p className="my-3" {...props}>
        {children}
      </p>
    );
  },
};

export default function StoryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Redirect if someone tries to access /stories/share through the dynamic route
  if (params.id === "share") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Incorrect Route</h1>
        <p className="mb-4">
          You're trying to access the share story page through an incorrect
          route.
        </p>
        <Link href="/stories/share" className="text-[#22AA86] hover:underline">
          Go to Share Story page
        </Link>
      </div>
    );
  }

  // Unwrap params using React.use()
  const unwrappedParams = React.use(params as any);
  // @ts-ignore
  const id = unwrappedParams.id;

  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [relatedStories, setRelatedStories] = useState<any[]>([]);
  const [commentForm, setCommentForm] = useState<CommentFormData>({
    content: "",
    parent: null,
  });
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [readingTime, setReadingTime] = useState("0 min read");
  const [hasMounted, setHasMounted] = useState(false);

  const articleRef = useRef<HTMLElement>(null);
  const commentsRef = useRef<HTMLDivElement>(null);

  // Calculate reading time
  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Handle scroll events for reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (articleRef.current) {
        const articleTop = articleRef.current.offsetTop;
        const articleHeight = articleRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        // Calculate reading progress
        const totalToRead = articleHeight - windowHeight;
        const currentProgress = scrollY - articleTop + windowHeight;
        const progress = Math.min(
          Math.max((currentProgress / totalToRead) * 100, 0),
          100
        );
        setReadingProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Count total comments including replies
  const countTotalComments = (comments: Comment[]): number => {
    let count = comments.length;
    for (const comment of comments) {
      count += comment.replies.length;
    }
    return count;
  };

  useEffect(() => {
    const fetchStory = async () => {
      setIsLoading(true);
      try {
        const data = await getStoryById(Number(id));
        setStory(data);
        setIsLiked(data.is_liked);
        setLikeCount(data.like_count);
        setReadingTime(calculateReadingTime(data.body));

        // Fetch related stories
        const fetchRelatedStories = async () => {
          try {
            const relatedData = await fetch(
              `/api/stories/related?id=${id}`
            ).then((res) => res.json());
            setRelatedStories(relatedData.results || []);
          } catch (error) {
            console.error("Error fetching related stories:", error);
            setRelatedStories([]);
          }
        };

        fetchRelatedStories();
      } catch (error) {
        console.error("Error fetching story:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!story) return;

      setIsCommentsLoading(true);
      try {
        const commentsData = await getCommentsByStoryId(story.id);
        setComments(commentsData.results);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      } finally {
        setIsCommentsLoading(false);
      }
    };

    if (story) {
      fetchComments();
    }
  }, [story]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCommentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReplyClick = (commentId: number) => {
    setReplyingTo(commentId);
    setCommentForm((prev) => ({
      ...prev,
      content: "",
      parent: commentId,
    }));
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setCommentForm((prev) => ({
      ...prev,
      parent: null,
    }));
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!story) return;

    // Basic validation
    if (!commentForm.content.trim()) {
      setSubmitError("Please enter a comment");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await createStoryComment(story.id, commentForm);

      // Reset form
      setCommentForm({
        content: "",
        parent: null,
      });
      setReplyingTo(null);

      // Show success message
      setSubmitSuccess(true);
      toast.success("Comment posted successfully!");

      // Refresh comments
      const commentsData = await getCommentsByStoryId(story.id);
      setComments(commentsData.results);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting comment:", error);
      setSubmitError("Failed to submit comment. Please try again.");
      toast.error("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeStory = async () => {
    if (!story) return;

    try {
      // Optimistic update
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

      // Call API
      await likeStory(story.id);
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount + 1 : likeCount - 1);
      console.error("Error liking story:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to like the story. Please try again.",
      //   variant: "destructive",
      // });
    }
  };

  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#22AA86]" />
          <p className="mt-4 text-muted-foreground">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Story Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The story you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/stories">
            <Button className="bg-[#22AA86] hover:bg-[#1c8f70]">
              Back to Stories
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalComments = countTotalComments(comments);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-[#22AA86] z-50 transition-all duration-300"
        style={{ width: `${readingProgress}%` }}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-background to-muted/30 pt-8 pb-16">
          <div className="container mx-auto">
            <Link
              href="/stories"
              className="inline-flex items-center text-muted-foreground hover:text-[#22AA86] mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to stories
            </Link>

            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                {story.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    className="bg-[#22AA86]/10 text-[#22AA86] hover:bg-[#22AA86]/20"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {story.title}
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <Avatar className="h-12 w-12 border-2 border-[#22AA86]/20">
                  <AvatarImage
                    src={story.user.avatar_url || "/placeholder.svg"}
                    alt={`${story.user.first_name} ${story.user.last_name}`}
                  />
                  <AvatarFallback className="bg-[#22AA86]/10 text-[#22AA86]">
                    {story.user.first_name[0]}
                    {story.user.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {story.user.first_name} {story.user.last_name}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {formatDate(story.created_at)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {readingTime}
                    </div>
                  </div>
                </div>
              </div>

              {story.image_url && (
                <div className="relative aspect-[2/1] rounded-xl overflow-hidden mb-8">
                  <img
                    src={story.image_url || "/placeholder.svg"}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-4 md:gap-8">
                {/* Story Content */}
                <div className="flex-1">
                  <article
                    ref={articleRef}
                    className="prose dark:prose-invert max-w-none"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      components={components}
                    >
                      {story.body}
                    </ReactMarkdown>
                  </article>

                  <div className="flex items-center justify-between mt-8 pt-6 border-t">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`gap-2 ${
                          isLiked ? "bg-red-50 text-red-500 border-red-200" : ""
                        }`}
                        onClick={handleLikeStory}
                      >
                        <Heart
                          className={`h-4 w-4 ${isLiked ? "fill-red-500" : ""}`}
                        />
                        <span>{likeCount}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={scrollToComments}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>{totalComments}</span>
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <Separator className="my-8" />

                  {/* Author Bio */}
                  <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-6 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16 border-2 border-[#22AA86]/20">
                        <AvatarImage
                          src={story.user.avatar_url || "/placeholder.svg"}
                          alt={`${story.user.first_name} ${story.user.last_name}`}
                        />
                        <AvatarFallback className="bg-[#22AA86]/10 text-[#22AA86]">
                          {story.user.first_name[0]}
                          {story.user.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-lg">
                          {story.user.first_name} {story.user.last_name}
                        </h3>
                        <p className="text-muted-foreground">
                          {story.user.role} from {story.user.city}. Sharing
                          personal experiences with kidney health to help others
                          on their journey.
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View All Stories by {story.user.first_name}
                    </Button>
                  </div>

                  {/* Comments Section */}
                  <div ref={commentsRef}>
                    <h3 className="text-xl font-bold mb-6">
                      Comments ({totalComments})
                    </h3>

                    {isCommentsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-[#22AA86]" />
                      </div>
                    ) : comments.length > 0 ? (
                      <div className="space-y-6 mb-8">
                        {comments.map((comment) => (
                          <div key={comment.id} className="border-b pb-6">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={
                                    comment.user.avatar_url ||
                                    "/placeholder.svg"
                                  }
                                  alt={`${comment.user.first_name} ${comment.user.last_name}`}
                                />
                                <AvatarFallback className="bg-[#22AA86]/10 text-[#22AA86]">
                                  {comment.user.first_name[0]}
                                  {comment.user.last_name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="font-medium">
                                    {comment.user.first_name}{" "}
                                    {comment.user.last_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatDate(comment.created_at)}
                                  </div>
                                </div>
                                <p className="text-sm mb-2">
                                  {comment.content}
                                </p>
                                <div className="flex items-center gap-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs gap-1"
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                    <span>{comment.likes || 0}</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => handleReplyClick(comment.id)}
                                  >
                                    Reply
                                  </Button>
                                </div>

                                {/* Reply form for this comment */}
                                {replyingTo === comment.id && (
                                  <div className="mt-4 pl-4 border-l-2 border-[#22AA86]/20">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm text-muted-foreground">
                                        Replying to {comment.user.first_name}{" "}
                                        {comment.user.last_name}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={cancelReply}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <form
                                      className="space-y-3"
                                      onSubmit={handleCommentSubmit}
                                    >
                                      <Textarea
                                        name="content"
                                        placeholder="Write your reply..."
                                        className="min-h-[80px]"
                                        value={commentForm.content}
                                        onChange={handleCommentChange}
                                      />
                                      <div className="flex justify-end">
                                        <Button
                                          type="submit"
                                          size="sm"
                                          className="bg-[#22AA86] hover:bg-[#1c8f70]"
                                          disabled={isSubmitting}
                                        >
                                          {isSubmitting ? (
                                            <>
                                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                              Submitting...
                                            </>
                                          ) : (
                                            <div className="flex items-center gap-1">
                                              <Send className="h-3 w-3" />
                                              Post Reply
                                            </div>
                                          )}
                                        </Button>
                                      </div>
                                    </form>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Replies to this comment */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="ml-12 mt-3 space-y-3">
                                {comment.replies.map((reply: any) => (
                                  <div key={reply.id} className="border-b pb-4">
                                    <div className="flex items-start gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage
                                          src={
                                            reply.user.avatar_url ||
                                            "/placeholder.svg"
                                          }
                                          alt={`${reply.user.first_name} ${reply.user.last_name}`}
                                        />
                                        <AvatarFallback className="bg-[#22AA86]/10 text-[#22AA86] text-xs">
                                          {reply.user.first_name[0]}
                                          {reply.user.last_name[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                          <div className="font-medium">
                                            {reply.user.first_name}{" "}
                                            {reply.user.last_name}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {formatDate(reply.created_at)}
                                          </div>
                                        </div>
                                        <p className="text-sm mb-2">
                                          {reply.content}
                                        </p>
                                        <div className="flex items-center gap-4">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2 text-xs gap-1"
                                          >
                                            <ThumbsUp className="h-3 w-3" />
                                            <span>{reply.likes || 0}</span>
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-muted/30 dark:bg-muted/10 rounded-xl p-8 text-center mb-8">
                        <p className="text-muted-foreground">
                          No comments yet. Be the first to comment!
                        </p>
                      </div>
                    )}

                    {/* Comment Form */}
                    <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-4">
                      <h4 className="font-medium mb-4">Leave a Comment</h4>
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>Y</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <form onSubmit={handleCommentSubmit}>
                            <Textarea
                              name="content"
                              className="w-full p-3 rounded-lg border bg-background min-h-[100px] text-sm"
                              placeholder="Share your thoughts..."
                              value={commentForm.content}
                              onChange={handleCommentChange}
                            />
                            {submitError && (
                              <div className="text-red-500 text-sm mt-2">
                                {submitError}
                              </div>
                            )}
                            <div className="flex justify-end mt-2">
                              <Button
                                type="submit"
                                className="bg-[#22AA86] hover:bg-[#1c8f70]"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Post Comment
                                  </>
                                )}
                              </Button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Stories Section */}
        {relatedStories.length > 0 && (
          <section className="py-12 bg-muted/30 dark:bg-muted/10">
            <div className="container mx-auto">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-8">Related Stories</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedStories.map((relatedStory) => (
                    <Card key={relatedStory.id} className="overflow-hidden">
                      <div className="relative h-40">
                        <img
                          src={relatedStory.image_url || "/placeholder.svg"}
                          alt={relatedStory.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {relatedStory.tags &&
                            relatedStory.tags.slice(0, 2).map((tag: any) => (
                              <Badge
                                key={tag.id}
                                variant="outline"
                                className="text-xs bg-[#22AA86]/5 text-[#22AA86] border-[#22AA86]/20"
                              >
                                {tag.name}
                              </Badge>
                            ))}
                        </div>
                        <h3 className="font-bold mb-2 line-clamp-2">
                          {relatedStory.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {relatedStory.body
                            ? relatedStory.body.substring(0, 100) + "..."
                            : ""}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-muted-foreground">
                            By {relatedStory.user?.first_name}{" "}
                            {relatedStory.user?.last_name}
                          </div>
                          <Link href={`/stories/${relatedStory.id}`}>
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-[#22AA86]"
                            >
                              Read More
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
