"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ShoppingCart,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  Loader2,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { getCartItems } from "@/lib/api/cart";
import { createOrder } from "@/lib/api/orders";
import { toast } from "sonner";

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

interface OrderData {
  shipping_address: string;
  contact_number: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState<OrderData>({
    shipping_address: "",
    contact_number: "",
  });
  const [formErrors, setFormErrors] = useState<{
    shipping_address?: string;
    contact_number?: string;
  }>({});
  const [paymentMethod, setPaymentMethod] = useState("cod");

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: {
      shipping_address?: string;
      contact_number?: string;
    } = {};

    if (!formData.shipping_address.trim()) {
      errors.shipping_address = "Shipping address is required";
    }

    if (!formData.contact_number.trim()) {
      errors.contact_number = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contact_number.trim())) {
      errors.contact_number = "Please enter a valid 10-digit phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        shipping_address: formData.shipping_address,
        contact_number: formData.contact_number,
      };

      const response = await createOrder(orderData);
      setOrderDetails(response);
      setOrderSuccess(true);

      // Show success toast
      toast.success("Order placed successfully!");

      // Scroll to top
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error("Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <div className="w-12 h-12 border-4 border-[#22AA86] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">
            Loading checkout information...
          </p>
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

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center">
          <div className="bg-muted/30 p-6 rounded-full mb-6">
            <ShoppingCart className="h-12 w-12 text-[#22AA86]" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            You need to add items to your cart before checking out.
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

  if (orderSuccess) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 dark:bg-green-800/30 p-4 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-green-800 dark:text-green-400">
              Order Placed Successfully!
            </h1>
            <p className="text-green-700 dark:text-green-300 mb-4">
              Thank you for your order. We've received your order and will begin
              processing it soon.
            </p>
            <div className="text-sm text-green-700 dark:text-green-300 mb-6">
              <p>
                Order ID:{" "}
                <span className="font-medium">#{orderDetails?.id}</span>
              </p>
              <p>
                Order Date:{" "}
                <span className="font-medium">
                  {new Date(orderDetails?.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </p>
              <p>
                Order Total:{" "}
                <span className="font-medium">
                  {formatPrice(Number(orderDetails?.total_amount))}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="space-y-4">
              {orderDetails?.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-3 border-b last:border-0"
                >
                  <div className="w-16 h-16 bg-muted/50 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image_url || "/placeholder.svg"}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.product.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.quantity} × {formatPrice(Number(item.price))}
                    </div>
                  </div>
                  <div className="font-medium">
                    {formatPrice(Number(item.subtotal))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>
                  {formatPrice(Number(orderDetails?.total_amount) / 1.18)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (18% GST)</span>
                <span>
                  {formatPrice(
                    (Number(orderDetails?.total_amount) / 1.18) * 0.18
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-[#22AA86]">
                  {formatPrice(Number(orderDetails?.total_amount))}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Shipping Address</div>
                  <div className="text-muted-foreground">
                    {orderDetails?.shipping_address}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Contact Number</div>
                  <div className="text-muted-foreground">
                    {orderDetails?.contact_number}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button className="bg-[#22AA86] hover:bg-[#1c8f70]">
                Continue Shopping
              </Button>
            </Link>
            <Button variant="outline" onClick={() => window.print()}>
              Print Order Details
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center mb-8">
        <Link
          href="/cart"
          className="text-muted-foreground hover:text-[#22AA86] flex items-center mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit}>
            {/* Shipping Information */}
            <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#22AA86]/10 p-2 rounded-full">
                  <Truck className="h-5 w-5 text-[#22AA86]" />
                </div>
                <h2 className="text-xl font-bold">Shipping Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="shipping_address" className="block mb-2">
                    Shipping Address <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="shipping_address"
                    name="shipping_address"
                    placeholder="Enter your full address including city, state, and postal code"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    className={
                      formErrors.shipping_address ? "border-red-500" : ""
                    }
                    rows={3}
                  />
                  {formErrors.shipping_address && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.shipping_address}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contact_number" className="block mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contact_number"
                    name="contact_number"
                    type="tel"
                    placeholder="Enter your 10-digit phone number"
                    value={formData.contact_number}
                    onChange={handleInputChange}
                    className={
                      formErrors.contact_number ? "border-red-500" : ""
                    }
                  />
                  {formErrors.contact_number && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.contact_number}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#22AA86]/10 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-[#22AA86]" />
                </div>
                <h2 className="text-xl font-bold">Payment Method</h2>
              </div>

              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer">
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-muted-foreground">
                      Pay when you receive your order
                    </div>
                  </Label>
                  <div className="bg-muted/50 p-2 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#22AA86]"
                    >
                      <rect width="20" height="12" x="2" y="6" rx="2" />
                      <circle cx="12" cy="12" r="2" />
                      <path d="M6 12h.01M18 12h.01" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-not-allowed opacity-60">
                  <RadioGroupItem value="card" id="card" disabled />
                  <Label htmlFor="card" className="flex-1 cursor-not-allowed">
                    <div className="font-medium">Credit/Debit Card</div>
                    <div className="text-sm text-muted-foreground">
                      Coming soon
                    </div>
                  </Label>
                  <div className="bg-muted/50 p-2 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-not-allowed opacity-60">
                  <RadioGroupItem value="upi" id="upi" disabled />
                  <Label htmlFor="upi" className="flex-1 cursor-not-allowed">
                    <div className="font-medium">UPI</div>
                    <div className="text-sm text-muted-foreground">
                      Coming soon
                    </div>
                  </Label>
                  <div className="bg-muted/50 p-2 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <path d="M16 2v5h5" />
                      <path d="M21 6v6a9 9 0 1 1-9-9h6l-3 3" />
                    </svg>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Review Items */}
            <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-6 mb-8 lg:hidden">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#22AA86]/10 p-2 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-[#22AA86]" />
                </div>
                <h2 className="text-xl font-bold">Order Summary</h2>
              </div>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-muted/50 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image_url || "/placeholder.svg"}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium line-clamp-1">
                        {item.product.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.quantity} ×{" "}
                        {formatPrice(Number.parseFloat(item.product.price))}
                      </div>
                    </div>
                    <div className="font-medium">
                      {formatPrice(Number.parseFloat(item.subtotal))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (18% GST)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-[#22AA86]">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <Button
              type="submit"
              className="w-full bg-[#22AA86] hover:bg-[#1c8f70] py-6 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Place Order
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3 hidden lg:block">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#22AA86]/10 p-2 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-[#22AA86]" />
                </div>
                <h2 className="text-xl font-bold">Order Summary</h2>
              </div>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-muted/50 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image_url || "/placeholder.svg"}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium line-clamp-1">
                        {item.product.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.quantity} ×{" "}
                        {formatPrice(Number.parseFloat(item.product.price))}
                      </div>
                    </div>
                    <div className="font-medium">
                      {formatPrice(Number.parseFloat(item.subtotal))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (18% GST)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-[#22AA86]">{formatPrice(total)}</span>
                </div>
              </div>

              {shipping === 0 ? (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm p-3 rounded-md mt-6 flex items-center">
                  <span>✓</span>
                  <span className="ml-2">
                    Your order qualifies for free shipping!
                  </span>
                </div>
              ) : (
                <div className="bg-muted/50 text-sm p-3 rounded-md mt-6">
                  <span>
                    Add {formatPrice(1000 - subtotal)} more to qualify for free
                    shipping
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
