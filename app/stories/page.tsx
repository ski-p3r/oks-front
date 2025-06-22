"use client";

import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Calendar,
  Heart,
  MessageSquare,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getStories } from "@/lib/api/stories";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

interface StoriesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Story[];
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

export default function StoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedTag, setSelectedTag] = useState(
    searchParams.get("tags__name") || ""
  );
  const [selectedRole, setSelectedRole] = useState("");
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("ordering") || "-created_at"
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get excerpt from content
  const getExcerpt = (content: string, maxLength = 150) => {
    const plainText = content.replace(/\n/g, " ");
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + "...";
  };

  // Update URL with current filters
  const updateUrlParams = () => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);
    if (selectedTag) params.set("tags__name", selectedTag);
    if (selectedRole) params.set("user__role", selectedRole);
    if (sortOrder) params.set("ordering", sortOrder);
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newUrl = `/stories${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.push(newUrl, { scroll: false });
  };

  // Fetch stories based on current filters
  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      try {
        const response = await getStories({
          page: currentPage,
          search: searchQuery,
          tags: selectedTag,
          role: selectedRole,
          ordering: sortOrder,
        });

        setStories(response.results);
        setTotalCount(response.count);

        // Extract all unique tags
        const tags = Array.from(
          new Set(
            response.results.flatMap((story: any) =>
              story.tags.map((tag: any) => tag.name)
            )
          )
        ).sort();
        setAllTags(tags as string[]);
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, [currentPage, searchQuery, selectedTag, selectedRole, sortOrder]);

  // Update URL when filters change
  useEffect(() => {
    updateUrlParams();
  }, [currentPage, searchQuery, selectedTag, selectedRole, sortOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? "" : tag);
    setCurrentPage(1);
  };

  const handleRoleFilter = (role: string) => {
    setSelectedRole(selectedRole === role ? "" : role);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag("");
    setSelectedRole("");
    setSortOrder("-created_at");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery || selectedTag || selectedRole || sortOrder !== "-created_at";

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / 10);

  return (
    <main className="flex-grow min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#22AA86]/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#22AA86]/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center">
                <div className="h-1 w-6 bg-[#22AA86] rounded-full mr-2" />
                <span className="text-[#22AA86] font-medium text-sm tracking-wider">
                  COMMUNITY STORIES
                </span>
                <div className="h-1 w-6 bg-[#22AA86] rounded-full ml-2"></div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Stories from{" "}
              <span className="text-[#22AA86]">Kidney Warriors</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Real experiences shared by patients and caregivers to inspire,
              educate, and connect our community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/stories/share">
                <Button
                  size="lg"
                  className="bg-[#22AA86] hover:bg-[#1c8f70] rounded-xl px-8"
                >
                  Share Your Story
                </Button>
              </Link>
              <form
                className="relative flex-1 max-w-xs mx-auto sm:mx-0"
                onSubmit={handleSearch}
              >
                <Input
                  type="text"
                  placeholder="Search stories..."
                  className="pl-4 pr-12 py-5 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 bg-[#22AA86] hover:bg-[#1c8f70] rounded-lg"
                >
                  <Search className="h-6 w-6" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Stories Content Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto">
          {/* Filter and Sort Options */}
          <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!selectedRole ? "default" : "outline"}
                className={
                  !selectedRole
                    ? "bg-[#22AA86] text-white"
                    : "hover:bg-[#22AA86] hover:text-white"
                }
                onClick={() => handleRoleFilter("")}
              >
                All Stories
              </Badge>
              <Badge
                variant={selectedRole === "PATIENT" ? "default" : "outline"}
                className={
                  selectedRole === "PATIENT"
                    ? "bg-[#22AA86] text-white"
                    : "hover:bg-[#22AA86] hover:text-white"
                }
                onClick={() => handleRoleFilter("PATIENT")}
              >
                Patient Stories
              </Badge>
              <Badge
                variant={selectedRole === "CAREGIVER" ? "default" : "outline"}
                className={
                  selectedRole === "CAREGIVER"
                    ? "bg-[#22AA86] text-white"
                    : "hover:bg-[#22AA86] hover:text-white"
                }
                onClick={() => handleRoleFilter("CAREGIVER")}
              >
                Caregiver Stories
              </Badge>
              <Badge
                variant={sortOrder === "-like_count" ? "default" : "outline"}
                className={
                  sortOrder === "-like_count"
                    ? "bg-[#22AA86] text-white"
                    : "hover:bg-[#22AA86] hover:text-white"
                }
                onClick={() => setSortOrder("-like_count")}
              >
                Most Popular
              </Badge>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                className="text-sm border rounded-md px-2 py-1 bg-background"
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="-created_at">Most Recent</option>
                <option value="-like_count">Most Popular</option>
                <option value="-comment_count">Most Commented</option>
                <option value="-views">Most Viewed</option>
                <option value="created_at">Oldest First</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#22AA86]" />
                <p className="mt-4 text-muted-foreground">Loading stories...</p>
              </div>
            </div>
          ) : stories.length === 0 ? (
            <>
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold mb-4">No stories found</h3>
                <p className="text-muted-foreground mb-8">
                  Try adjusting your search or filters
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-[#22AA86] hover:bg-[#1c8f70]"
                >
                  Clear All Filters
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Tags Section */}
              <div className="mt-12 bg-muted/30 dark:bg-muted/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">
                  Browse Stories by Tag
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedTag === tag
                          ? "bg-[#22AA86] text-white"
                          : "hover:bg-[#22AA86] hover:text-white"
                      }`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stories.map((story) => (
                  <div
                    key={story.id}
                    className="bg-muted/30 dark:bg-muted/10 rounded-xl overflow-hidden group"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={story.image_url || "/placeholder.svg"}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {story.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag.id}
                            className="bg-[#22AA86]/90 text-white backdrop-blur-sm cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              handleTagClick(tag.name);
                            }}
                          >
                            {tag.name}
                          </Badge>
                        ))}
                        {story.tags.length > 2 && (
                          <Badge className="bg-black/50 text-white backdrop-blur-sm">
                            +{story.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-[#22AA86] transition-colors line-clamp-2">
                        {story.title}
                      </h3>
                      <div className="text-muted-foreground mb-4 line-clamp-2">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          components={components}
                        >
                          {getExcerpt(story.body)}
                        </ReactMarkdown>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-8 w-8 border-2 border-[#22AA86]/20">
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
                          <div className="text-sm font-medium">
                            {story.user.first_name} {story.user.last_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {story.user.role}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-muted-foreground text-xs">
                          <div className="flex items-center gap-1">
                            <Heart
                              className={`h-3 w-3 ${
                                story.is_liked
                                  ? "fill-red-500 text-red-500"
                                  : ""
                              }`}
                            />
                            <span>{story.like_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{story.comment_count}</span>
                          </div>
                        </div>
                        <Link href={`/stories/${story.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#22AA86] hover:text-[#1c8f70] p-0"
                          >
                            Read More
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {stories.length > 0 && (
                <Pagination className="mt-12">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      // Show first page, last page, and pages around current page
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                              isActive={page === currentPage}
                              className={
                                page === currentPage
                                  ? "bg-[#22AA86] text-white hover:bg-[#1c8f70]"
                                  : ""
                              }
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

                      // Show ellipsis for gaps
                      if (
                        (page === 2 && currentPage > 3) ||
                        (page === totalPages - 1 &&
                          currentPage < totalPages - 2)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            setCurrentPage(currentPage + 1);
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#22AA86] to-[#1a8a6c] rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Share Your Journey?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Your story matters. Share your kidney health journey to inspire
                others and connect with a community who understands.
              </p>
              <Link href="/stories/share">
                <Button
                  size="lg"
                  className="bg-white text-[#22AA86] hover:bg-white/90 rounded-xl px-8"
                >
                  Share Your Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final Thoughts Section */}
      {/* <section className="py-16 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-muted/30 dark:bg-muted/10 rounded-xl p-8">
            <ReactMarkdown>
              {`## Final Thoughts

You're already following best practices and this app is scalable for a **social storytelling platform**. Apply a few performance and UX optimizations, and this can be deployed confidently.

Let me know if you want:

- Postgres full-text search for stories
- Tag auto-suggestion endpoint
- Analytics endpoint (daily new stories, likes, comments)
- Swagger/OpenAPI schema improvements`}
            </ReactMarkdown>
          </div>
        </div>
      </section> */}
    </main>
  );
}
