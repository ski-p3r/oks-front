"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, X } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/product-card";
import { getProducts } from "@/lib/api/products";

// Types (copied from ShopPage for simplicity)
interface Tag {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  product_count: number;
  created_at: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: Category;
  price: string;
  in_stock: boolean;
  tags: Tag[];
  average_rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

interface ShopClientProps {
  initialProducts: Product[];
  initialTotalProducts: number;
  initialCategories: Category[];
  initialPage: number;
  initialSearchQuery: string;
  initialCategory: string;
  initialTags: string[];
  initialSortBy: string;
  initialInStockOnly: boolean;
}

export default function ShopClient({
  initialProducts,
  initialTotalProducts,
  initialCategories,
  initialPage,
  initialSearchQuery,
  initialCategory,
  initialTags,
  initialSortBy,
  initialInStockOnly,
}: ShopClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(initialTotalProducts);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(initialTotalProducts / 10) || 1
  );
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(initialInStockOnly);

  // Update URL with current filters
  const updateUrlParams = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedTags.length > 0)
      params.set("tags__name", selectedTags.join(","));
    if (sortBy && sortBy !== "featured") params.set("ordering", sortBy);
    if (inStockOnly) params.set("in_stock", "true");
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newUrl = `/shop${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl, { scroll: false });
  };

  // Fetch products based on current filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let ordering = "";
        if (sortBy === "price-low") ordering = "price";
        else if (sortBy === "price-high") ordering = "-price";
        else if (sortBy === "rating") ordering = "-average_rating";
        else if (sortBy !== "featured") ordering = sortBy;

        const response = await getProducts({
          page: currentPage,
          search: searchQuery,
          category: selectedCategory,
          tags: selectedTags.join(","),
          ordering,
          in_stock: inStockOnly ? "true" : "",
        });

        setProducts(response.results);
        setTotalProducts(response.count);
        setTotalPages(Math.ceil(response.count / 10));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    currentPage,
    searchQuery,
    selectedCategory,
    selectedTags,
    sortBy,
    inStockOnly,
  ]);

  // Update URL when filters change
  useEffect(() => {
    updateUrlParams();
  }, [
    currentPage,
    searchQuery,
    selectedCategory,
    selectedTags,
    sortBy,
    inStockOnly,
  ]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedTags([]);
    setSortBy("featured");
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const handleAddToCart = (productId: number, quantity: number) => {
    console.log(`Added product ${productId} to cart with quantity ${quantity}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#22AA86]/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#22AA86]/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block mb-6">
                <div className="flex items-center justify-center">
                  <div className="h-1 w-6 bg-[#22AA86] rounded-full mr-2"></div>
                  <span className="text-[#22AA86] font-medium text-sm tracking-wider">
                    KIDNEY CARE SHELF
                  </span>
                  <div className="h-1 w-6 bg-[#22AA86] rounded-full ml-2"></div>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Products for Your{" "}
                <span className="text-[#22AA86]">Kidney Health Journey</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Discover kidney-friendly products, from dietary supplements to
                comfort items, carefully selected to support your kidney health
                and improve quality of life.
              </p>

              <form
                onSubmit={handleSearch}
                className="relative max-w-xl mx-auto"
              >
                <Input
                  type="text"
                  placeholder="Search for products..."
                  className="pl-4 pr-12 py-5 rounded-lg"
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

        {/* Shop Section */}
        <section className="py-12 bg-background">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden w-full mb-4">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <span className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </span>
                  {showFilters ? <X className="h-4 w-4" /> : null}
                </Button>
              </div>

              {/* Sidebar Filters */}
              <div
                className={`lg:w-1/4 ${
                  showFilters ? "block" : "hidden lg:block"
                }`}
              >
                <div className="bg-muted/30 dark:bg-muted/10 rounded-xl p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm text-muted-foreground"
                      onClick={handleClearFilters}
                    >
                      Clear all
                    </Button>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h5 className="font-medium mb-3">Categories</h5>
                    <Select
                      value={selectedCategory}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name} ({category.product_count})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h5 className="font-medium mb-3">Price Range</h5>
                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort by price" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-high">
                          Price: High to Low
                        </SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Availability */}
                  <div>
                    <h5 className="font-medium mb-3">Availability</h5>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="in-stock"
                        className="h-4 w-4 rounded border-gray-300 text-[#22AA86] focus:ring-[#22AA86]"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                      />
                      <label htmlFor="in-stock" className="text-sm">
                        In Stock Only
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div className="lg:w-3/4">
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold">
                      {loading
                        ? "Loading products..."
                        : `${totalProducts} Products`}
                    </h2>
                    {(selectedCategory || searchQuery) && (
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-sm text-muted-foreground">
                          Filters:
                        </span>
                        {selectedCategory && (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {categories.find(
                              (c) => c.id.toString() === selectedCategory
                            )?.name || "Category"}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => setSelectedCategory("")}
                            />
                          </Badge>
                        )}
                        {searchQuery && (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            Search: {searchQuery}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => setSearchQuery("")}
                            />
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-high">
                          Price: High to Low
                        </SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Products */}
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(9)].map((_, index) => (
                      <Card key={index} className="overflow-hidden py-0">
                        <div className="aspect-video w-full">
                          <Skeleton className="h-full w-full" />
                        </div>
                        <div className="p-4">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-4" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4 mb-4" />
                          <div className="flex justify-between items-center">
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/30 dark:bg-muted/10 rounded-xl">
                    <div className="mb-4 text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <h3 className="text-xl font-medium mb-2">
                        No products found
                      </h3>
                      <p>Try adjusting your search or filter criteria</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="mt-4"
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}

                {/* Pagination */}
                {!loading && products.length > 0 && (
                  <Pagination className="mt-12">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1)
                              setCurrentPage(currentPage - 1);
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
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories Section */}
        <section className="py-16 bg-muted/30 dark:bg-muted/10">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Browse our carefully curated categories designed to support your
                kidney health journey.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-background dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-muted hover:shadow-md transition-shadow duration-300 cursor-pointer hover:border-[#22AA86]/30"
                  onClick={() => handleCategoryChange(category.id.toString())}
                >
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {category.product_count} products
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#22AA86] hover:text-[#1c8f70] hover:bg-[#22AA86]/10 -mr-2"
                    >
                      Browse
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#22AA86] to-[#1a8a6c] rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

              <div className="relative z-10 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Need Personalized Recommendations?
                </h2>
                <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                  Our community members and kidney care experts can help you
                  find the right products for your specific needs.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-white text-[#22AA86] hover:bg-white/90 rounded-xl px-8"
                  >
                    Join Community
                  </Button>
                  <Link href="/contact">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/20 rounded-xl px-8"
                    >
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
