"use client";

import React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  AlertCircle,
  MapPin,
  Phone,
  Calendar,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Download,
} from "lucide-react";
import Link from "next/link";
import { getOrderById } from "@/lib/api/orders";

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

interface Product {
  id: number;
  title: string;
  description: string;
  image_url: string;
  price: string;
  category: {
    id: number;
    name: string;
  };
}

interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: string;
  subtotal: string;
}

interface Order {
  id: number;
  user: User;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shipping_address: string;
  contact_number: string;
  total_amount: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params as any);
  //   @ts-ignore
  const id = Number(unwrappedParams.id);

  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(price));
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Processing
          </Badge>
        );
      case "SHIPPED":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Shipped
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Delivered
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "PROCESSING":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "SHIPPED":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "DELIVERED":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <div className="w-12 h-12 border-4 border-[#22AA86] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading order details...</p>
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
          <Button onClick={() => router.back()} className="mr-4">
            Go Back
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#22AA86] hover:bg-[#1c8f70]"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center">
          <div className="bg-muted/30 p-6 rounded-full mb-6">
            <AlertCircle className="h-12 w-12 text-[#22AA86]" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/orders">
            <Button className="bg-[#22AA86] hover:bg-[#1c8f70]">
              View All Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate subtotal (without tax)
  const subtotal = order.items.reduce(
    (sum, item) => sum + Number(item.subtotal),
    0
  );
  // Assuming 18% tax
  const tax = subtotal * 0.18;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center mb-8">
        <Link
          href="/orders"
          className="text-muted-foreground hover:text-[#22AA86] flex items-center mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
        <h1 className="text-3xl font-bold">Order Details</h1>
      </div>

      {/* Order Summary */}
      <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Order #{order.id}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(order.created_at)} at {formatTime(order.created_at)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getStatusIcon(order.status)}
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              {getStatusBadge(order.status)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Shipping Information</h3>
            <div className="bg-background rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Shipping Address</div>
                  <div className="text-muted-foreground whitespace-pre-line">
                    {order.shipping_address}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Contact Number</div>
                  <div className="text-muted-foreground">
                    {order.contact_number}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Payment Information</h3>
            <div className="bg-background rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal.toString())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (18% GST)</span>
                  <span>{formatPrice(tax.toString())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{subtotal > 1000 ? "Free" : formatPrice("150")}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-[#22AA86]">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <Card className="mb-8 py-0">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-6">Order Items</h2>

          <div className="space-y-6">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-4 pb-6 border-b last:border-0 last:pb-0"
              >
                <div className="w-full sm:w-20 h-20 bg-muted/50 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.image_url || "/placeholder.svg"}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <Link
                    href={`/shop/${item.product.id}`}
                    className="font-medium hover:text-[#22AA86]"
                  >
                    {item.product.title}
                  </Link>

                  <div className="text-sm text-muted-foreground mt-1">
                    Category: {item.product.category.name}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Price:</span>{" "}
                      {formatPrice(item.price)}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Quantity:</span>{" "}
                      {item.quantity}
                    </div>
                    <div className="font-medium">
                      <span className="text-muted-foreground">Subtotal:</span>{" "}
                      {formatPrice(item.subtotal)}
                    </div>
                  </div>
                </div>

                <div className="sm:text-right mt-2 sm:mt-0">
                  <Link href={`/shop/${item.product.id}`}>
                    <Button variant="outline" size="sm">
                      View Product
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Timeline */}
      <Card className="mb-8 py-0">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-6">Order Timeline</h2>

          <div className="relative border-l-2 border-muted pl-6 ml-3 space-y-8">
            <div className="relative">
              <div className="absolute -left-[31px] p-1 bg-yellow-100 rounded-full border-2 border-yellow-500">
                <Clock className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <div className="font-medium">Order Placed</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(order.created_at)} at{" "}
                  {formatTime(order.created_at)}
                </div>
                <div className="text-sm mt-1">
                  Your order has been received and is being processed.
                </div>
              </div>
            </div>

            {order.status !== "PENDING" && order.status !== "CANCELLED" && (
              <div className="relative">
                <div className="absolute -left-[31px] p-1 bg-blue-100 rounded-full border-2 border-blue-500">
                  <Package className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <div className="font-medium">Order Processing</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(order.updated_at)} at{" "}
                    {formatTime(order.updated_at)}
                  </div>
                  <div className="text-sm mt-1">
                    Your order is being prepared for shipping.
                  </div>
                </div>
              </div>
            )}

            {(order.status === "SHIPPED" || order.status === "DELIVERED") && (
              <div className="relative">
                <div className="absolute -left-[31px] p-1 bg-purple-100 rounded-full border-2 border-purple-500">
                  <Truck className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <div className="font-medium">Order Shipped</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(order.updated_at)} at{" "}
                    {formatTime(order.updated_at)}
                  </div>
                  <div className="text-sm mt-1">
                    Your order is on its way to you.
                  </div>
                </div>
              </div>
            )}

            {order.status === "DELIVERED" && (
              <div className="relative">
                <div className="absolute -left-[31px] p-1 bg-green-100 rounded-full border-2 border-green-500">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <div className="font-medium">Order Delivered</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(order.updated_at)} at{" "}
                    {formatTime(order.updated_at)}
                  </div>
                  <div className="text-sm mt-1">
                    Your order has been delivered successfully.
                  </div>
                </div>
              </div>
            )}

            {order.status === "CANCELLED" && (
              <div className="relative">
                <div className="absolute -left-[31px] p-1 bg-red-100 rounded-full border-2 border-red-500">
                  <XCircle className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <div className="font-medium">Order Cancelled</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(order.updated_at)} at{" "}
                    {formatTime(order.updated_at)}
                  </div>
                  <div className="text-sm mt-1">
                    Your order has been cancelled.
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => window.print()}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Print Order Details
        </Button>

        <Link href="/orders">
          <Button className="bg-[#22AA86] hover:bg-[#1c8f70]">
            View All Orders
          </Button>
        </Link>

        {order.status === "DELIVERED" && (
          <Link href={`/shop/${order.items[0].product.id}`}>
            <Button variant="outline">Buy Again</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
