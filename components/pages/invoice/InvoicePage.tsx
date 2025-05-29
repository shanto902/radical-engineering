"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Product {
  id: string;
  name: string;
  price: number;
  discounted_price: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  product: Product;
}

interface Order {
  id: string;
  order_id: string;
  name: string;
  phone: string;
  address: string;
  placed_at: string;
  total: number;
  order_items: OrderItem[];
}

export default function InvoicePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) {
      router.replace("/");
      return;
    }

    fetch(`/api/invoice/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(setOrder)
      .catch((err) => {
        console.error("Fetch failed", err);
        router.replace("/");
      });
  }, [id, router]);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${order?.id}.pdf`);
  };

  if (!order) return <p className="p-6">Loading invoice...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 my-20">
      {/* 📥 Download PDF Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-yellow-500 hover:text-black transition"
        >
          Download PDF
        </button>
      </div>

      {/* Invoice Content */}
      <div
        ref={invoiceRef}
        className="border rounded shadow p-6 bg-white"
        id="invoice"
      >
        <h1 className="text-2xl font-bold mb-4">Invoice</h1>

        <div className="mb-4 space-y-1">
          <p>
            <strong>Order ID:</strong> {order.order_id}
          </p>
          <p>
            <strong>Name:</strong> {order.name}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>
          <p>
            <strong>Address:</strong> {order.address}
          </p>
          <p>
            <strong>Date:</strong> {new Date(order.placed_at).toLocaleString()}
          </p>
        </div>

        <table className="w-full border mt-6 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Product</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.product.name}</td>
                <td className="border p-2">
                  {item.product.discounted_price || item.product.price} BDT
                </td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">
                  {(item.product.discounted_price || item.product.price) *
                    item.quantity}{" "}
                  BDT
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-6 text-lg font-bold">
          Total: {order.total.toLocaleString()} BDT
        </div>
      </div>
    </div>
  );
}
