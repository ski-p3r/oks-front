"use client";

import React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Star,
  ShoppingCart,
  Check,
  Truck,
  Shield,
  RefreshCw,
  Heart,
  Share2,
  ArrowLeft,
  Plus,
  Minus,
  ThumbsUp,
  Info,
} from "lucide-react";
import Link from "next/link";
import { addToCart, getProductById } from "@/lib/api/products";
import { submitReview } from "@/lib/api/reviews";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { addToWishlist } from "@/lib/api/wishlist";

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

interface Review {
  id: number;
  product: number;
  user: User;
  rating: number;
  comment: string;
  created_at: string;
}

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
  reviews: Review[];
}

interface ReviewFormData {
  product: number;
  rating: number;
  comment: string;
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({ show: false, message: "", type: "info" });

  // Review form state
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    product: 0,
    rating: 0,
    comment: "",
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Unwrap params using React.use()
  const unwrappedParams = React.use(params as any);
  //   @ts-ignore
  const id = Number(unwrappedParams.id);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);

        // Update the review form with the correct product ID
        setReviewForm((prev) => ({
          ...prev,
          product: id,
        }));
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(price));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAdding(true);

    await addToCart({ product: product.id, quantity });
    setIsAdding(false);
    toast.success("Product added to cart");
    router.refresh();
  };

  const handleToggleWishlist = async () => {
    setIsWishlisted(!isWishlisted);
    await addToWishlist(product?.id || 0);
    toast.success(
      isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      {
        icon: <ThumbsUp className="h-4 w-4" />,
      }
    );
    router.refresh();
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title || "Check out this product",
        text: product?.description || "I found this great product",
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  const handleRatingChange = (rating: number) => {
    setReviewForm((prev) => ({ ...prev, rating }));
    setReviewError("");
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewForm((prev) => ({ ...prev, comment: e.target.value }));
    setReviewError("");
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (reviewForm.rating === 0) {
      setReviewError("Please select a rating before submitting your review");
      return;
    }

    if (!reviewForm.comment.trim()) {
      setReviewError("Please enter a comment before submitting your review");
      return;
    }

    setIsSubmittingReview(true);
    setReviewError("");

    try {
      // Send review to API
      const data = await submitReview(reviewForm);
      if (data.detail) {
        toast.error(data.detail);
        setReviewError(data.detail);
        setTimeout(() => {
          setReviewError("");
        }, 5000);
        return;
      }
      // Reset form
      setReviewForm({
        product: Number(params.id),
        rating: 0,
        comment: "",
      });

      // Show success message
      setReviewSuccess(true);

      // Refetch product details to get updated reviews and rating
      const updatedProduct = await getProductById(Number(params.id));
      setProduct(updatedProduct);

      // Hide success message and form after 5 seconds
      toast.success("Thank you for your review!");
      setTimeout(() => {
        setReviewSuccess(false);
        setShowReviewForm(false);
      }, 5000);
    } catch (error: any) {
      console.error("Error submitting review:", error);
      // Display the error detail message from the API
      //   if (error && error.detail) {
      setReviewError(error.detail);
      //   } else {
      //     setReviewError("Failed to submit your review. Please try again.");
      //   }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Generate star rating
  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizes = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    };

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizes[size]} ${
              i < Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
        {size !== "sm" && (
          <span className="ml-2 text-sm text-muted-foreground">
            ({product?.review_count || 0} reviews)
          </span>
        )}
      </div>
    );
  };

  const renderRatingInput = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-8 w-8 cursor-pointer transition-colors ${
                star <= reviewForm.rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-muted-foreground hover:text-yellow-200"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container py-12 mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-12 h-12 border-4 border-[#22AA86] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-12 mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/shop">
            <Button className="bg-[#22AA86] hover:bg-[#1c8f70]">
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main>
        {/* Back Button */}
        <div className="border-b py-4">
          <div className="container mx-auto">
            <Link
              href="/shop"
              className="inline-flex items-center text-muted-foreground hover:text-[#22AA86]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
            <Alert
              className={cn(
                "shadow-lg border-l-4",
                notification.type === "success" && "border-green-500",
                notification.type === "error" && "border-destructive",
                notification.type === "info" && "border-blue-500"
              )}
            >
              <AlertDescription className="flex items-center">
                {notification.type === "success" && (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                )}
                {notification.type === "error" && (
                  <Info className="h-4 w-4 text-destructive mr-2" />
                )}
                {notification.type === "info" && (
                  <Info className="h-4 w-4 text-blue-500 mr-2" />
                )}
                {notification.message}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Product Details */}
        <section className="py-12">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left Column - Image */}
              <div className="lg:w-1/2">
                <div className="sticky top-24">
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-auto object-contain aspect-square "
                    />
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                      <Truck className="h-6 w-6 mx-auto mb-2 text-[#22AA86]" />
                      <p className="text-sm font-medium">Free Shipping</p>
                      <p className="text-xs text-muted-foreground">
                        On orders over ₹1000
                      </p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <RefreshCw className="h-6 w-6 mx-auto mb-2 text-[#22AA86]" />
                      <p className="text-sm font-medium">Easy Returns</p>
                      <p className="text-xs text-muted-foreground">
                        30 day policy
                      </p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <Shield className="h-6 w-6 mx-auto mb-2 text-[#22AA86]" />
                      <p className="text-sm font-medium">Secure Checkout</p>
                      <p className="text-xs text-muted-foreground">
                        Protected payment
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="lg:w-1/2">
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="text-[#22AA86] border-[#22AA86]/30"
                  >
                    {product.category.name}
                  </Badge>
                  {product.in_stock ? (
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200"
                    >
                      In Stock
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-red-600 border-red-200"
                    >
                      Out of Stock
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

                <div className="mb-6">
                  {renderStars(product.average_rating)}
                </div>

                <div className="text-3xl font-bold mb-6 text-[#22AA86]">
                  {formatPrice(product.price)}
                </div>

                <div className="mb-8">
                  <p className="text-muted-foreground mb-4">
                    {product.description.substring(0, 300)}...
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-[#22AA86]"
                    onClick={() => setActiveTab("description")}
                  >
                    Read more
                  </Button>
                </div>

                {/* Tags */}
                {product.tags.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/shop?tags__name=${tag.name}`}
                        >
                          <Badge
                            variant="secondary"
                            className="cursor-pointer hover:bg-secondary/80"
                          >
                            {tag.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity and Add to Cart */}
                <div className="mb-8">
                  <h3 className="font-medium mb-3">Quantity</h3>
                  <div className="flex items-center mb-6">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-r-none"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="h-10 w-20 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-l-none"
                      onClick={incrementQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex gap-3">
                    {product.in_stock ? (
                      <Button
                        className={cn(
                          "flex-1 py-6 text-lg transition-all duration-300",
                          isAdded
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-[#22AA86] hover:bg-[#1c8f70]"
                        )}
                        onClick={handleAddToCart}
                        disabled={isAdding}
                      >
                        {isAdding ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                            <Check className="mr-2 h-5 w-5" /> Added to Cart
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <ShoppingCart className="mr-2 h-5 w-5" /> Add to
                            Cart
                          </div>
                        )}
                      </Button>
                    ) : (
                      <Button
                        className="flex-1 py-6 text-lg"
                        variant="outline"
                        disabled
                      >
                        Out of Stock
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-14 w-14 border-2",
                        isWishlisted ? "border-red-500 text-red-500" : ""
                      )}
                      onClick={handleToggleWishlist}
                    >
                      <Heart
                        className={cn(
                          "h-6 w-6",
                          isWishlisted && "fill-red-500"
                        )}
                      />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-14 w-14 border-2"
                      onClick={handleShareProduct}
                    >
                      <Share2 className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details Tabs */}
        <section className="py-12 border-t">
          <div className="container mx-auto">
            <Tabs
              defaultValue="description"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full max-w-md mx-auto mb-8">
                <TabsTrigger value="description" className="flex-1">
                  Description
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">
                  Reviews ({product.review_count})
                </TabsTrigger>
                <TabsTrigger value="shipping" className="flex-1">
                  Shipping
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <div className="border rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    Product Description
                  </h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line">{product.description}</p>
                  </div>

                  <div className="mt-12">
                    <h3 className="text-xl font-bold mb-4">
                      Category Information
                    </h3>
                    <div className="border p-6 rounded-lg">
                      <h4 className="font-bold text-lg mb-2">
                        {product.category.name}
                      </h4>
                      <p className="text-muted-foreground">
                        {product.category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="border rounded-lg p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Customer Reviews</h2>
                    <Button
                      className="bg-[#22AA86] hover:bg-[#1c8f70]"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                    >
                      {showReviewForm ? "Cancel" : "Write a Review"}
                    </Button>
                  </div>

                  {/* Review Form */}
                  {showReviewForm && (
                    <div className="mb-8 border p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-4">
                        Write Your Review
                      </h3>

                      {reviewSuccess && (
                        <div className="mb-4 p-4 border border-green-200 text-green-800 rounded-lg flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">
                              Thank you for your review!
                            </p>
                            <p>
                              Your feedback helps other customers make informed
                              decisions.
                            </p>
                          </div>
                        </div>
                      )}

                      {reviewError && (
                        <div className="mb-4 p-4 border border-red-200 text-red-800 rounded-lg">
                          {reviewError}
                        </div>
                      )}

                      <form onSubmit={handleSubmitReview}>
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">
                            Your Rating
                          </label>
                          {renderRatingInput()}
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="comment"
                            className="block text-sm font-medium mb-2"
                          >
                            Your Review
                          </label>
                          <Textarea
                            id="comment"
                            placeholder="Share your experience with this product..."
                            value={reviewForm.comment}
                            onChange={handleCommentChange}
                            className="min-h-[120px]"
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            className="bg-[#22AA86] hover:bg-[#1c8f70]"
                            disabled={isSubmittingReview}
                          >
                            {isSubmittingReview ? (
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
                                Submitting...
                              </div>
                            ) : (
                              "Submit Review"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Rating Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8 border p-6 rounded-lg">
                    <div className="md:col-span-2 flex flex-col items-center justify-center border-r pr-8">
                      <div className="text-5xl font-bold mb-2 text-[#22AA86]">
                        {product.average_rating.toFixed(1)}
                      </div>
                      <div className="flex justify-center mb-2">
                        {renderStars(product.average_rating)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Based on {product.review_count} reviews
                      </p>
                    </div>

                    <div className="md:col-span-3">
                      <div className="space-y-4">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = product.reviews.filter(
                            (review) => review.rating === rating
                          ).length;
                          const percentage =
                            product.review_count > 0
                              ? (count / product.review_count) * 100
                              : 0;
                          return (
                            <div
                              key={rating}
                              className="flex items-center gap-3"
                            >
                              <div className="flex items-center gap-1 w-20">
                                <span>{rating}</span>
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              </div>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#22AA86]"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <div className="w-16 text-right text-sm text-muted-foreground">
                                {count} ({percentage.toFixed(0)}%)
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {product.reviews.length > 0 ? (
                      product.reviews.map((review) => (
                        <Card key={review.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="flex flex-col">
                              <div className="border-b p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10 border-2 border-[#22AA86]/20">
                                    <AvatarImage
                                      src={
                                        review.user.avatar_url ||
                                        "/placeholder.svg"
                                      }
                                      alt={`${review.user.first_name} ${review.user.last_name}`}
                                    />
                                    <AvatarFallback className="bg-[#22AA86]/10 text-[#22AA86]">
                                      {review.user.first_name[0]}
                                      {review.user.last_name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-bold">
                                      {review.user.first_name}{" "}
                                      {review.user.last_name}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <span>{review.user.role}</span>
                                      <span>•</span>
                                      <span>{review.user.city}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(review.created_at)}
                                </div>
                              </div>

                              <div className="p-6">
                                <div className="flex mb-3">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="text-muted-foreground mb-4">
                                  {review.comment}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-8 gap-1"
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                    Helpful
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs h-8"
                                  >
                                    Report
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 border rounded-lg">
                        <p className="text-muted-foreground mb-4">
                          No reviews yet. Be the first to review this product!
                        </p>
                        <Button
                          className="bg-[#22AA86] hover:bg-[#1c8f70]"
                          onClick={() => setShowReviewForm(true)}
                        >
                          Write a Review
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="shipping">
                <div className="border rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    Shipping & Returns
                  </h2>
                  <div className="space-y-8">
                    <div className="border p-6 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="bg-[#22AA86]/10 p-3 rounded-full">
                          <Truck className="h-6 w-6 text-[#22AA86]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold mb-2">
                            Delivery Information
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            We offer free standard shipping on all orders over
                            ₹1000. For orders under ₹1000, a flat shipping rate
                            of ₹150 applies.
                          </p>
                          <ul className="list-disc list-inside text-muted-foreground space-y-1">
                            <li>Standard delivery: 3-5 business days</li>
                            <li>
                              Express delivery: 1-2 business days (additional
                              ₹250)
                            </li>
                            <li>
                              Same-day delivery: Available in select cities
                              (additional ₹500)
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border p-6 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="bg-[#22AA86]/10 p-3 rounded-full">
                          <RefreshCw className="h-6 w-6 text-[#22AA86]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold mb-2">
                            Returns & Exchanges
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            We accept returns within 30 days of delivery. Items
                            must be unused and in their original packaging.
                          </p>
                          <ul className="list-disc list-inside text-muted-foreground space-y-1">
                            <li>
                              Initiate returns through your account or contact
                              customer service
                            </li>
                            <li>Return shipping is free for defective items</li>
                            <li>
                              Refunds are processed within 7-10 business days
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border p-6 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="bg-[#22AA86]/10 p-3 rounded-full">
                          <Shield className="h-6 w-6 text-[#22AA86]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold mb-2">Warranty</h3>
                          <p className="text-muted-foreground mb-4">
                            All products come with a standard 1-year warranty
                            against manufacturing defects. Some products may
                            have extended warranty options available.
                          </p>
                          <p className="text-muted-foreground">
                            To claim warranty, please contact our customer
                            service with your order details and a description of
                            the issue.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
}
