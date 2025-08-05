"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { getWishlistItems, removeFromWishlist } from "@/lib/api/wishlist";
import { addToCart } from "@/lib/api/cart";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

interface WishlistItem {
  id: number;
  products: Product[];
}

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingItems, setProcessingItems] = useState<
    Record<number, { removing?: boolean; addingToCart?: boolean }>
  >({});

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWishlistItems();
      setWishlistItems(data.products || []);
    } catch (err) {
      console.error("Error fetching wishlist items:", err);
      setError("Failed to load your wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    setProcessingItems((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], removing: true },
    }));

    try {
      await removeFromWishlist(productId);
      setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
      toast.success("Item removed from wishlist");
      router.refresh();
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      toast.error("Failed to remove item from wishlist. Please try again.");
    } finally {
      setProcessingItems((prev) => {
        const updated = { ...prev };
        if (updated[productId]) {
          updated[productId] = { ...updated[productId], removing: false };
        }
        return updated;
      });
    }
  };

  const handleAddToCart = async (productId: number) => {
    setProcessingItems((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], addingToCart: true },
    }));

    try {
      await addToCart({ product: productId, quantity: 1 });
      toast.success("Item added to cart");
      router.refresh();
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setProcessingItems((prev) => {
        const updated = { ...prev };
        if (updated[productId]) {
          updated[productId] = { ...updated[productId], addingToCart: false };
        }
        return updated;
      });
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(price));
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <div className="w-12 h-12 border-4 border-[#22AA86] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button
            onClick={fetchWishlistItems}
            className="bg-[#22AA86] hover:bg-[#1c8f70]"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center">
          <div className="bg-muted/30 p-6 rounded-full mb-6">
            <Heart className="h-12 w-12 text-[#22AA86]" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-8">
            You haven't added any products to your wishlist yet. Browse our
            products and add your favorites!
          </p>
          <Link href="/shop">
            <Button className="bg-[#22AA86] hover:bg-[#1c8f70]">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Heart className="mr-3 h-8 w-8" /> My Wishlist
        </h1>
        <Link
          href="/shop"
          className="text-muted-foreground hover:text-[#22AA86] flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <Card key={product.id} className="overflow-hidden py-0">
            <div className="relative aspect-video overflow-hidden bg-muted/30">
              <Link href={`/shop/${product.id}`}>
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </Link>

              {!product.in_stock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="text-white font-medium px-4 py-2 bg-black/40 rounded-md">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            <CardContent className="p-5">
              <Link href={`/shop/${product.id}`}>
                <h3 className="font-bold text-lg mb-2 line-clamp-1 hover:text-[#22AA86] transition-colors">
                  {product.title}
                </h3>
              </Link>

              <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {product.description}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-lg">
                  {formatPrice(product.price)}
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-[#22AA86]/10 text-[#22AA86]">
                  {product.category.name}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-[#22AA86] hover:bg-[#1c8f70]"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={
                    !product.in_stock ||
                    processingItems[product.id]?.addingToCart
                  }
                >
                  {processingItems[product.id]?.addingToCart ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 mr-2" />
                  )}
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  disabled={processingItems[product.id]?.removing}
                >
                  {processingItems[product.id]?.removing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
