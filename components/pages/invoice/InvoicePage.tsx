"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "@/assets/logo-square.svg";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
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
  extra_charges?: {
    name: string;
    cost: string;
  }[];
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
    pdf.save(`invoice-${order?.order_id}.pdf`);
  };

  if (!order) return <p className="p-6">Loading invoice...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 my-20">
      {/* 📥 Download PDF Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Print Preview</h2>
        <button
          onClick={handleDownloadPDF}
          className="bg-primary text-background px-4 py-2 rounded hover:bg-secondary hover:text-foreground transition"
        >
          Download PDF
        </button>
      </div>

      {/* Invoice Content */}
      <div
        ref={invoiceRef}
        className="border rounded shadow p-6 bg-white text-black"
        id="invoice"
      >
        <div className="flex items-start flex-row-reverse justify-between">
          <Image
            height={100}
            width={140}
            src={logo}
            alt="Radical Engineering"
          />
          <p className="w-80 text-sm space-y-1">
            <span className="flex gap-2 items-center">
              <Phone size={20} className="" />: 01911922109
            </span>
            <span className="flex gap-2 items-start">
              <Mail size={20} className="" />: absuvro@gmail.com
            </span>
            <span className="flex  gap-1 items-start">
              <span className="flex gap-2 items-center ">
                <MapPin size={20} />:
              </span>
              <span>
                Hazi Hasen Ali Market Station Road (opposite of Medilab)
                Kishoregonj , Kishoreganj, Bangladesh
              </span>
            </span>
          </p>
        </div>
        <hr className="my-4" />

        <div className="grid grid-cols-2">
          <div className="mb-2 space-y-1">
            <p>
              <h1 className="text-2xl font-bold mb-4">Invoice</h1>
              <strong>Order ID:</strong> {order.order_id}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.placed_at).toLocaleString()}
            </p>
          </div>
          <div>
            <p>
              <h3 className="mb-2 text-base font-bold">Shipping Address</h3>
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
          </div>
        </div>

        <table className="w-full border mt-6 text-sm">
          <thead>
            <tr className="bg-zinc-700 text-white">
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

            {order.extra_charges &&
              order.extra_charges.map((item, i) => (
                <tr key={i}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.cost} BDT</td>
                  <td className="border p-2"></td>
                  <td className="border p-2">{parseFloat(item.cost)} BDT</td>
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
