"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  getCartItems,
  updateCartItemQuantity,
  removeCartItem,
} from "@/lib/api/cart";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  subtotal: string;
}

interface CartResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CartItem[];
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);

  // Cart summary calculations
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    // Calculate cart summary values
    const calculatedSubtotal = cartItems.reduce(
      (sum, item) => sum + Number.parseFloat(item.subtotal),
      0
    );
    setSubtotal(calculatedSubtotal);

    // Calculate shipping (free over ₹1000, otherwise ₹150)
    const calculatedShipping = calculatedSubtotal > 1000 ? 0 : 150;
    setShipping(calculatedShipping);

    // Calculate tax (18% GST)
    const calculatedTax = calculatedSubtotal * 0.18;
    setTax(calculatedTax);

    // Calculate total
    setTotal(calculatedSubtotal + calculatedShipping + calculatedTax);
  }, [cartItems]);

  const fetchCartItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCartItems();
      setCartItems(data.results);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setError("Failed to load your cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdating(itemId);
    try {
      await updateCartItemQuantity(itemId, newQuantity);

      // Update the cart items in state
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: newQuantity,
                subtotal: (
                  Number.parseFloat(item.product.price) * newQuantity
                ).toFixed(2),
              }
            : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update quantity. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setRemoving(itemId);
    try {
      await removeCartItem(itemId);

      // Remove the item from state
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item. Please try again.");
    } finally {
      setRemoving(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <div className="w-12 h-12 border-4 border-[#22AA86] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading your cart...</p>
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
            onClick={fetchCartItems}
            className="bg-[#22AA86] hover:bg-[#1c8f70]"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center">
          <div className="bg-muted/30 p-6 rounded-full mb-6">
            <ShoppingBag className="h-12 w-12 text-[#22AA86]" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link href="/shop">
            <Button className="bg-[#22AA86] hover:bg-[#1c8f70]">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <ShoppingCart className="mr-3 h-8 w-8" /> Your Cart
      </h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-6">
            <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-muted-foreground">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            <Separator className="mb-6 hidden md:block" />

            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                >
                  {/* Product */}
                  <div className="col-span-1 md:col-span-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-muted/50 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image_url || "/placeholder.svg"}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/shop/${item.product.id}`}
                          className="font-medium hover:text-[#22AA86] line-clamp-2"
                        >
                          {item.product.title}
                        </Link>
                        <div className="text-xs text-muted-foreground mt-1">
                          Category: {item.product.category.name}
                        </div>
                        <div className="md:hidden text-sm font-medium mt-2">
                          {formatPrice(Number.parseFloat(item.product.price))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="hidden md:block md:col-span-2 text-center">
                    {formatPrice(Number.parseFloat(item.product.price))}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-r-none"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        disabled={updating === item.id || item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="text"
                        value={item.quantity}
                        className="h-8 w-12 rounded-none text-center p-0"
                        readOnly
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-l-none"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        disabled={updating === item.id}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end">
                    <span className="md:hidden text-sm text-muted-foreground">
                      Subtotal:
                    </span>
                    <span className="font-medium">
                      {formatPrice(Number.parseFloat(item.subtotal))}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <div className="col-span-1 md:hidden flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removing === item.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Desktop Remove Button */}
                  <div className="hidden md:flex md:col-span-12 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-red-500"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removing === item.id}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>

                  <Separator className="col-span-1 md:col-span-12 my-2" />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <Link href="/shop">
                <Button variant="outline" className="text-sm">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (18% GST)</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                <Separator className="my-3" />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-[#22AA86]">{formatPrice(total)}</span>
                </div>
              </div>

              {shipping === 0 ? (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm p-3 rounded-md mb-6 flex items-center">
                  <span>✓</span>
                  <span className="ml-2">
                    Your order qualifies for free shipping!
                  </span>
                </div>
              ) : (
                <div className="bg-muted/50 text-sm p-3 rounded-md mb-6">
                  <span>
                    Add {formatPrice(1000 - subtotal)} more to qualify for free
                    shipping
                  </span>
                </div>
              )}

              <Button
                onClick={() => router.push("/checkout")}
                className="w-full bg-[#22AA86] hover:bg-[#1c8f70]"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="mt-6 text-xs text-center text-muted-foreground">
                <p>We accept all major credit cards and PayPal</p>
                <div className="flex justify-center gap-2 mt-2">
                  <div className="w-8 h-5 bg-muted rounded"></div>
                  <div className="w-8 h-5 bg-muted rounded"></div>
                  <div className="w-8 h-5 bg-muted rounded"></div>
                  <div className="w-8 h-5 bg-muted rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
