"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  MessageSquare,
  Eye,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  ArrowLeft,
  Loader2,
  CornerDownRight,
  X,
} from "lucide-react";
import Link from "next/link";
import { getBlogBySlug } from "@/lib/api/blog";
import { getCommentsByBlogId, createComment } from "@/lib/api/comments";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "../page";

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
  blog: number;
  user: CommentUser;
  content: string;
  parent: number;
  created_at: string;
  likes?: number;
}

interface Comment {
  id: number;
  blog: number;
  user: CommentUser;
  content: string;
  parent: number | null;
  created_at: string;
  replies: CommentReply[];
  likes?: number;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params as any);
  // @ts-ignore
  const slug = unwrappedParams.slug;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [commentForm, setCommentForm] = useState<CommentFormData>({
    content: "",
    parent: null,
  });
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Format content with paragraphs
  const formatContent = (content: string) => {
    return content.split("\n\n").map((paragraph, index) => (
      <p key={index} className="mb-6">
        {paragraph}
      </p>
    ));
  };

  // Count total comments including replies
  const countTotalComments = (comments: Comment[]): number => {
    let count = comments.length;
    for (const comment of comments) {
      count += comment.replies.length;
    }
    return count;
  };

  useEffect(() => {
    const fetchBlogPost = async () => {
      setIsLoading(true);
      try {
        const data = await getBlogBySlug(slug);
        setPost(data);

        // Fetch related posts (in a real app, you'd have an API for this)
        // For now, we'll just simulate it
        const fetchRelatedPosts = async () => {
          try {
            const relatedData = await fetch(
              `/api/blogs/related?slug=${slug}`
            ).then((res) => res.json());
            setRelatedPosts(relatedData.results || []);
          } catch (error) {
            console.error("Error fetching related posts:", error);
            setRelatedPosts([]);
          }
        };

        fetchRelatedPosts();
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!post) return;

      setIsCommentsLoading(true);
      try {
        const commentsData = await getCommentsByBlogId(post.id);
        setComments(commentsData.results);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      } finally {
        setIsCommentsLoading(false);
      }
    };

    if (post) {
      fetchComments();
    }
  }, [post]);

  const handleCommentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

    if (!post) return;

    // Basic validation
    if (!commentForm.content.trim()) {
      setSubmitError("Please enter a comment");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await createComment(post.id, commentForm);

      // Reset form
      setCommentForm({
        content: "",
        parent: null,
      });
      setReplyingTo(null);

      // Show success message
      setSubmitSuccess(true);

      // Refresh comments
      const commentsData = await getCommentsByBlogId(post.id);
      setComments(commentsData.results);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting comment:", error);
      setSubmitError("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#22AA86]" />
          <p className="mt-4 text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/blog">
            <Button className="bg-[#22AA86] hover:bg-[#1c8f70]">
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalComments = countTotalComments(comments);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-background to-muted/30 pt-8 pb-16">
          <div className="container mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-muted-foreground hover:text-[#22AA86] mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all articles
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag.id} className="bg-[#22AA86] text-white">
                  {tag.name}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-4xl">
              {post.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-8">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-[#22AA86]/20">
                  <AvatarImage
                    src={post.author.avatar_url || "/placeholder.svg"}
                    alt={`${post.author.first_name} ${post.author.last_name}`}
                  />
                  <AvatarFallback className="bg-[#22AA86]/10 text-[#22AA86]">
                    {post.author.first_name[0]}
                    {post.author.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {post.author.first_name} {post.author.last_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {post.author.role}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{totalComments} comments</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="py-8 bg-background">
          <div className="container mx-auto">
            <div className="rounded-2xl overflow-hidden mb-12">
              <img
                src={post.thumbnail_url || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-auto max-h-[600px] object-cover"
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* Main Content */}
              <div className="lg:w-2/3">
                <article className="prose dark:prose-invert max-w-none lg:prose-lg mb-12">
                  {formatContent(post.content)}
                </article>

                {/* Share Section */}
                <div className="bg-muted/30 dark:bg-muted/10 rounded-xl p-6 mb-12">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-medium">Share this article</h3>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                      >
                        <Facebook className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                      >
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                      >
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold mb-6">
                    Comments ({totalComments})
                  </h3>

                  {isCommentsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-[#22AA86]" />
                    </div>
                  ) : comments.length > 0 ? (
                    <div className="space-y-6 mb-8">
                      {comments.map((comment) => (
                        <div key={comment.id}>
                          {/* Parent Comment */}
                          <div className="bg-muted/30 dark:bg-muted/10 rounded-xl p-6">
                            <div className="flex items-start gap-4">
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
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <div className="font-medium">
                                      {comment.user.first_name}{" "}
                                      {comment.user.last_name}
                                    </div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                                      <span>{comment.user.role}</span>
                                      <span>•</span>
                                      <span>
                                        {formatDate(comment.created_at)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm mb-2">
                                  {comment.content}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <button className="hover:text-[#22AA86]">
                                    Like{" "}
                                    {comment.likes ? `(${comment.likes})` : ""}
                                  </button>
                                  <button
                                    className="hover:text-[#22AA86] flex items-center gap-1"
                                    onClick={() => handleReplyClick(comment.id)}
                                  >
                                    <CornerDownRight className="h-3 w-3" />
                                    Reply
                                  </button>
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
                                            "Post Reply"
                                          )}
                                        </Button>
                                      </div>
                                    </form>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Replies to this comment */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-12 mt-3 space-y-3">
                              {comment.replies.map((reply) => (
                                <div
                                  key={reply.id}
                                  className="bg-muted/30 dark:bg-muted/10 rounded-xl p-6"
                                >
                                  <div className="flex items-start gap-4">
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
                                      <div className="flex items-center justify-between mb-2">
                                        <div>
                                          <div className="font-medium">
                                            {reply.user.first_name}{" "}
                                            {reply.user.last_name}
                                          </div>
                                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                                            <span>{reply.user.role}</span>
                                            <span>•</span>
                                            <span>
                                              {formatDate(reply.created_at)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <p className="text-sm mb-2">
                                        {reply.content}
                                      </p>
                                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <button className="hover:text-[#22AA86]">
                                          Like{" "}
                                          {reply.likes
                                            ? `(${reply.likes})`
                                            : ""}
                                        </button>
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
                  <div className="bg-muted/30 dark:bg-muted/10 rounded-xl p-6">
                    <h4 className="text-xl font-bold mb-4">Leave a comment</h4>
                    {submitSuccess && (
                      <div className="bg-green-100 border border-green-200 text-green-800 rounded-lg p-4 mb-4">
                        Your comment has been submitted successfully!
                      </div>
                    )}
                    {submitError && (
                      <div className="bg-red-100 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
                        {submitError}
                      </div>
                    )}
                    <form className="space-y-4" onSubmit={handleCommentSubmit}>
                      <div>
                        <Textarea
                          name="content"
                          placeholder="Your comment"
                          className="min-h-[120px]"
                          value={commentForm.content}
                          onChange={handleCommentChange}
                        />
                      </div>
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
                          "Post Comment"
                        )}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:w-1/3">
                <div className="space-y-8">
                  {/* Author Bio */}
                  <div className="bg-muted/30 dark:bg-muted/10 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">About the Author</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16 border-2 border-[#22AA86]/20">
                        <AvatarImage
                          src={post.author.avatar_url || "/placeholder.svg"}
                          alt={`${post.author.first_name} ${post.author.last_name}`}
                        />
                        <AvatarFallback className="bg-[#22AA86]/10 text-[#22AA86] text-xl">
                          {post.author.first_name[0]}
                          {post.author.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-lg">
                          {post.author.first_name} {post.author.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {post.author.role} • {post.author.city}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Passionate about kidney health education and patient
                      advocacy. Dedicated to providing reliable information to
                      help patients and caregivers navigate their kidney health
                      journey.
                    </p>
                    <Button variant="outline" className="w-full">
                      View All Posts
                    </Button>
                  </div>

                  {/* Related Posts */}
                  <div className="bg-muted/30 dark:bg-muted/10 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Related Articles</h3>
                    {relatedPosts.length > 0 ? (
                      <div className="space-y-4">
                        {relatedPosts.map((relatedPost) => (
                          <Link
                            key={relatedPost.id}
                            href={`/blog/${relatedPost.slug}`}
                          >
                            <div className="group flex gap-3 items-start">
                              <img
                                src={
                                  relatedPost.thumbnail_url ||
                                  "/placeholder.svg"
                                }
                                alt={relatedPost.title}
                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                              />
                              <div>
                                <h4 className="font-medium group-hover:text-[#22AA86] transition-colors line-clamp-2">
                                  {relatedPost.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDate(relatedPost.created_at)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No related articles found.
                      </p>
                    )}
                  </div>

                  {/* Newsletter */}
                  <div className="bg-[#22AA86] rounded-xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">
                      Subscribe to Our Newsletter
                    </h3>
                    <p className="text-white/80 mb-4">
                      Get the latest kidney health articles delivered to your
                      inbox.
                    </p>
                    <form className="space-y-3">
                      <Input
                        type="email"
                        placeholder="Your email address"
                        className="bg-white/20 border-white/30 placeholder:text-white/60 text-white"
                      />
                      <Button className="w-full bg-white text-[#22AA86] hover:bg-white/90">
                        Subscribe
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
