"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { addToCart } from "@/lib/api/cart";
import { addToWishlist } from "@/lib/api/wishlist";
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

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number, quantity: number) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(price));
  };

  const handleAddToCart = async () => {
    setIsAdding(true);

    // Simulate API call or processing time
    await addToCart({ product: product.id, quantity: 1 }); // Always add quantity of 1
    setIsAdding(false);
    router.refresh();
  };

  // Generate star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">
          ({product.review_count})
        </span>
      </div>
    );
  };

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(product.id);
      toast.success("Added to wishlist!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to add to wishlist. Please try again.");
    }
  };

  return (
    <Card className="overflow-hidden border-border py-0">
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

        <div className="absolute top-3 right-3 z-10">
          <Button
            onClick={handleAddToWishlist}
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full bg-white/90 hover:bg-white shadow-sm hover:text-[#22AA86] transition-all duration-200 border-none"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {product.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1 z-10">
            {product.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag.id}
                className="bg-[#22AA86]/90 text-white backdrop-blur-sm"
              >
                {tag.name}
              </Badge>
            ))}
            {product.tags.length > 2 && (
              <Badge className="bg-black/50 text-white backdrop-blur-sm">
                +{product.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <div className="mb-1">{renderStars(product.average_rating)}</div>

        <Link href={`/shop/${product.id}`}>
          <h3 className="font-bold text-lg mb-1 line-clamp-1 hover:text-[#22AA86] transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="font-bold text-lg">{formatPrice(product.price)}</div>
          <div className="text-xs px-2 py-1 rounded-full bg-[#22AA86]/10 text-[#22AA86]">
            {product.category.name}
          </div>
        </div>

        {product.in_stock ? (
          <Button
            className={cn(
              "w-full transition-all duration-300",
              isAdded
                ? "bg-green-600 hover:bg-green-700"
                : "bg-[#22AA86] hover:bg-[#1c8f70]"
            )}
            onClick={handleAddToCart}
            disabled={!product.in_stock || isAdding}
          >
            {isAdding ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding...
              </div>
            ) : isAdded ? (
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4" /> Added to Cart
              </div>
            ) : (
              <div className="flex items-center">
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </div>
            )}
          </Button>
        ) : (
          <Button className="w-full" variant="outline" disabled>
            Out of Stock
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
