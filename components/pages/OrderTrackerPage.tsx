"use client";

import { TOrder } from "@/interfaces";
import { format } from "date-fns";
import { Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import PaddingContainer from "../common/PaddingContainer";

const statusSteps = ["Pending", "Placed", "Processing", "Shipped", "Delivered"];

export default function OrderTrackerPage() {
  const [mobile, setMobile] = useState("");
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const validateMobile = (mobile: string) => {
    const regex = /^01[0-9]{9}$/;
    return regex.test(mobile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateMobile(mobile)) {
      toast.error(
        "Please enter a valid Bangladeshi mobile number (e.g., 017xxxxxxxx)"
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `/api/order-tracker?mobile=${encodeURIComponent(mobile)}`
      );
      const data = await res.json();

      if (!data.orders || data.orders.length === 0) {
        toast("No orders found for this mobile number.");
      }

      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const getStepIndex = (status: string) => {
    return statusSteps.findIndex(
      (step) => step.toLowerCase() === status.toLowerCase()
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-green-600";
      case "Processing":
        return "text-yellow-600";
      case "Placed":
        return "text-primary";
      case "Pending":
        return "text-blue-600";
      case "Shipped":
        return "text-indigo-600";
      default:
        return "text-blue-600";
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <PaddingContainer className=" my-10">
      <h1 className="text-3xl font-bold mb-4 text-center">Track Your Orders</h1>
      <form onSubmit={handleSubmit} className="mb-6 w-fit mx-auto">
        <input
          type="text"
          placeholder="Enter your mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="border p-2 w-full mb-2 bg-background accent-primary border-foreground  rounded"
          required
        />
        <button
          type="submit"
          className="bg-primary text-background hover:text-foreground hover:bg-secondary font-bold py-2 px-4 rounded w-full"
        >
          {loading ? "Searching..." : "Track Orders"}
        </button>
      </form>

      {loading && (
        <div className="flex justify-center items-center my-10">
          <svg
            className="animate-spin h-8 w-8 text-primary"
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
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        </div>
      )}

      {searched && !loading && (
        <>
          {orders.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Orders:</h2>
              {orders.map((order) => {
                const currentStep = getStepIndex(order.status);
                const isExpanded = expandedOrderId === order.id;

                return (
                  <div
                    key={order.id}
                    className="border border-primary p-4 mb-4 rounded shadow cursor-pointer transition-all"
                    onClick={() => toggleExpand(order.id)}
                  >
                    {/* Collapsed View */}
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-semibold">
                          Order ID: {order.order_id}
                        </p>
                        <p className="text-sm">
                          Placed at:{" "}
                          {format(
                            new Date(order.placed_at),
                            "MMMM do yyyy, h:mm a"
                          )}
                        </p>
                      </div>
                      <div
                        className={`font-semibold  uppercase ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </div>
                    </div>

                    {/* Expanded View */}
                    {isExpanded && (
                      <div className="mt-4 border-t pt-4 text-sm">
                        <p className="mb-1">
                          <strong>Name:</strong> {order.name}
                        </p>
                        <p className="mb-1">
                          <strong>Phone:</strong> {order.phone}
                        </p>
                        <p className="mb-1">
                          <strong>Total:</strong> ৳ {order.total}
                        </p>
                        <p className="mb-3">
                          <strong>Address:</strong> {order.address}
                        </p>

                        {/* Timeline */}
                        <div className="flex items-center justify-between mb-6 relative px-2">
                          {statusSteps.map((step, idx) => {
                            const isCompleted = idx <= currentStep;
                            return (
                              <div
                                key={step}
                                className="flex-1 flex flex-col items-center relative"
                              >
                                {/* Connector */}
                                <hr className="h-1 border-none bg-primary absolute w-full bottom-8 z-0" />

                                {/* Circle */}
                                <div
                                  className={`w-5 z-10 flex justify-center items-center h-5 rounded-full border-2 mb-2 ${
                                    isCompleted
                                      ? "bg-primary border-primary text-background"
                                      : "bg-white border-gray-300"
                                  }`}
                                >
                                  {isCompleted && (
                                    <Check className="font-bold" />
                                  )}
                                </div>
                                {/* Label */}
                                <span className="text-xs text-center">
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Items */}
                        <div>
                          <strong>Items:</strong>
                          <ul className="list-disc list-inside">
                            {order?.order_items?.map((item, idx) => (
                              <li key={idx}>
                                {item.product?.name} x {item.quantity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center ">
              No orders found for this mobile number.
            </p>
          )}
        </>
      )}
    </PaddingContainer>
  );
}
