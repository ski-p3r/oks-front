import { Suspense } from "react";
import { getOrders } from "@/lib/api/orders";
import OrdersClient from "./OrdersClient";

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

interface OrderItem {
  id: number;
  product: {
    id: number;
    title: string;
    image_url: string;
    price: string;
  };
  quantity: number;
  price: string;
  subtotal: string;
}

export interface Order {
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

interface OrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const status = searchParams.status || "";

  let orders: Order[] = [];
  let totalOrders = 0;

  try {
    const response: OrdersResponse = await getOrders();
    orders = response.results;
    totalOrders = response.count;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }

  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-16 px-4">
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="w-12 h-12 border-4 border-[#22AA86] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading your orders...</p>
          </div>
        </div>
      }
    >
      <OrdersClient
        orders={orders}
        totalOrders={totalOrders}
        initialPage={page}
        initialSearchQuery={search}
        initialStatusFilter={status}
      />
    </Suspense>
  );
}
