import { Suspense } from "react";
import { getProducts, getCategories } from "@/lib/api/products";
import ShopClient from "./ShopClient";

// Types
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

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams.page) || 1;
  const search =
    typeof searchParams.search === "string"
      ? searchParams.search
      : Array.isArray(searchParams.search)
      ? searchParams.search[0] || ""
      : "";
  const category =
    typeof searchParams.category === "string"
      ? searchParams.category
      : Array.isArray(searchParams.category)
      ? searchParams.category[0] || ""
      : "";
  const tags = searchParams.tags__name ? String(searchParams.tags__name) : "";
  const ordering =
    typeof searchParams.ordering === "string"
      ? searchParams.ordering
      : Array.isArray(searchParams.ordering)
      ? searchParams.ordering[0] || "featured"
      : "featured";
  const in_stock = searchParams.in_stock === "true";

  let products: Product[] = [];
  let totalProducts = 0;
  let categories: Category[] = [];

  try {
    // Fetch initial products
    const productsResponse: ProductsResponse = await getProducts({
      page,
      search,
      category,
      tags,
      ordering,
      in_stock: in_stock ? "true" : "",
    });
    products = productsResponse.results;
    totalProducts = productsResponse.count;

    // Fetch categories
    categories = await getCategories();
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }

  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-16 px-4">
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="w-12 h-12 border-4 border-[#22AA86] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        </div>
      }
    >
      <ShopClient
        initialProducts={products}
        initialTotalProducts={totalProducts}
        initialCategories={categories}
        initialPage={page}
        initialSearchQuery={search}
        initialCategory={category}
        initialTags={tags ? tags.split(",") : []}
        initialSortBy={ordering}
        initialInStockOnly={in_stock}
      />
    </Suspense>
  );
}
