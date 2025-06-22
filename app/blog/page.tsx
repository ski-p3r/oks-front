"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Calendar,
  Eye,
  MessageSquare,
  ArrowRight,
  Search,
  Filter,
  ChevronDown,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { getBlogs } from "@/lib/api/blog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";

export interface BlogListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlogPost[];
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail_url: string;
  author: Author;
  tags: Tag[];
  published: boolean;
  views: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface Author {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  city: string;
  avatar_url: string;
  created_at: string;
}

export interface Tag {
  id: number;
  name: string;
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogListResponse>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState("-created_at");

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

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setIsLoading(true);
      try {
        const data = await getBlogs({
          page: currentPage,
          search: searchQuery,
          tags: selectedTag,
          ordering: sortOrder,
        });
        setBlogPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogPosts();
  }, [currentPage, searchQuery, selectedTag, selectedCategory, sortOrder]);

  // Get all unique tags from blog posts
  const allTags = Array.from(
    new Map(
      blogPosts.results.flatMap((post) => post.tags).map((tag) => [tag.id, tag])
    ).values()
  ).map((tag) => tag.name);

  const sortOptions = [
    { label: "Newest First", value: "-created_at" },
    { label: "Oldest First", value: "created_at" },
    { label: "Most Viewed", value: "-views" },
    { label: "Most Comments", value: "-comment_count" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedTag("");
    setSelectedCategory("");
    setSearchQuery("");
    setSortOrder("-created_at");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedTag ||
    selectedCategory ||
    searchQuery ||
    sortOrder !== "-created_at";

  // Calculate total pages based on count and items per page (assuming 9 per page)
  const itemsPerPage = 9;
  const totalPages = Math.ceil(blogPosts.count / itemsPerPage);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with Background */}
      <section className="relative bg-gradient-to-b from-[#22AA86]/10 to-background py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#22AA86]/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#22AA86]/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center">
                <div className="h-1 w-6 bg-[#22AA86] rounded-full mr-2"></div>
                <span className="text-[#22AA86] font-medium text-sm tracking-wider">
                  BLOG & INSIGHTS
                </span>
                <div className="h-1 w-6 bg-[#22AA86] rounded-full ml-2"></div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Explore Our <span className="text-[#22AA86]">Knowledge Hub</span>
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Dive into a world of knowledge with our curated articles, tips,
              and resources designed to empower you on your health journey.
            </p>

            <form className="relative max-w-xl mx-auto" onSubmit={handleSearch}>
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-4 pr-12 py-6 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                className="absolute right-1 top-1 bottom-1 bg-[#22AA86] hover:bg-[#1c8f70] rounded-lg"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="bg-muted/30 border-y border-border/50">
        <div className="container mx-auto py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 md:hidden"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Narrow down your search with these filters
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Tags */}
                    <div>
                      <h3 className="font-medium mb-3">Popular Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tagName) => (
                          <Badge
                            key={tagName}
                            variant={
                              selectedTag === tagName ? "default" : "outline"
                            }
                            className={`cursor-pointer ${
                              selectedTag === tagName
                                ? "bg-[#22AA86] text-white"
                                : "hover:bg-[#22AA86] hover:text-white"
                            }`}
                            onClick={() => {
                              setSelectedTag(
                                selectedTag === tagName ? "" : tagName
                              );
                              setCurrentPage(1);
                            }}
                          >
                            {tagName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Tags Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="hidden md:flex items-center gap-2"
                  >
                    {selectedTag || "All Tags"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className={!selectedTag ? "text-[#22AA86] font-medium" : ""}
                    onClick={() => {
                      setSelectedTag("");
                      setCurrentPage(1);
                    }}
                  >
                    All Tags
                  </DropdownMenuItem>
                  {allTags.map((tagName) => (
                    <DropdownMenuItem
                      key={tagName}
                      className={
                        selectedTag === tagName
                          ? "text-[#22AA86] font-medium"
                          : ""
                      }
                      onClick={() => {
                        setSelectedTag(tagName);
                        setCurrentPage(1);
                      }}
                    >
                      {tagName}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {sortOptions.find((o) => o.value === sortOrder)?.label ||
                      "Sort By"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className={
                        sortOrder === option.value
                          ? "text-[#22AA86] font-medium"
                          : ""
                      }
                      onClick={() => setSortOrder(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clear Filters */}
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

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {blogPosts.count}{" "}
                {blogPosts.count === 1 ? "article" : "articles"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-muted/30 rounded-xl h-[400px] animate-pulse"
              ></div>
            ))}
          </div>
        ) : blogPosts.results.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-4">No articles found</h3>
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
        ) : (
          <>
            {/* Featured Post */}
            {currentPage === 1 && (
              <div className="mb-16">
                <div className="relative rounded-2xl overflow-hidden group">
                  <img
                    src={
                      blogPosts.results[0].thumbnail_url || "/placeholder.svg"
                    }
                    alt={blogPosts.results[0].title}
                    className="w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blogPosts.results[0].tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          className="bg-[#22AA86]/90 text-white backdrop-blur-sm"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                      {blogPosts.results[0].title}
                    </h2>
                    <p className="text-white/80 mb-4 line-clamp-2 md:text-lg">
                      {getExcerpt(blogPosts.results[0].content, 200)}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {blogPosts.results[0].author.avatar_url && (
                          <img
                            src={
                              blogPosts.results[0].author.avatar_url ||
                              "/placeholder.svg" ||
                              "/placeholder.svg"
                            }
                            alt={`${blogPosts.results[0].author.first_name} ${blogPosts.results[0].author.last_name}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <div className="text-white font-medium">
                            {blogPosts.results[0].author.first_name}{" "}
                            {blogPosts.results[0].author.last_name}
                          </div>
                          <div className="flex items-center gap-2 text-white/70 text-sm">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {formatDate(blogPosts.results[0].created_at)}
                            </span>
                            <span className="mx-1">•</span>
                            <Eye className="h-3 w-3" />
                            <span>{blogPosts.results[0].views}</span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/blog/${blogPosts.results[0].slug}`}>
                        <Button className="bg-white text-[#22AA86] hover:bg-white/90">
                          Read Article
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.results
                .slice(currentPage === 1 ? 1 : 0)
                .map((post) => (
                  <div
                    key={post.id}
                    className="bg-muted/30 dark:bg-muted/10 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={post.thumbnail_url || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag.id}
                            className="bg-[#22AA86]/90 text-white backdrop-blur-sm"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                        {post.tags.length > 2 && (
                          <Badge className="bg-black/50 text-white backdrop-blur-sm">
                            +{post.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-[#22AA86] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {getExcerpt(post.content)}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(post.created_at)}</span>
                          <span className="mx-1">•</span>
                          <MessageSquare className="h-3 w-3" />
                          <span>{post.comment_count}</span>
                        </div>
                        <Link href={`/blog/${post.slug}`}>
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
            {blogPosts.results.length > 0 && (
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
                      (page === totalPages - 1 && currentPage < totalPages - 2)
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

      {/* Newsletter Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#22AA86] to-[#1a8a6c] rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter to receive the latest articles,
                resources, and exclusive content directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-white/20 border-white/30 placeholder:text-white/60 text-white"
                />
                <Button className="bg-white text-[#22AA86] hover:bg-white/90 whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
