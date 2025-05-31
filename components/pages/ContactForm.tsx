"use client";
import { MailIcon, MessageCircleMore } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import PaddingContainer from "../common/PaddingContainer";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Your message has been sent!");

        setForm({ name: "", phone: "", email: "", message: "" });
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error("Form error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaddingContainer className="min-h-[80vh] pt-10  px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl  ">
        <h2 className="text-3xl font-bold text-primary text-center mb-6">
          Get In Touch
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="relative">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="peer w-full px-4 pt-5 pb-2 border border-gray-300 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm peer-focus:text-primary peer-focus:top-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base transition-all">
              Full Name
            </label>
          </div>

          {/* Phone */}
          <div className="relative">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              className="peer w-full px-4 pt-5 pb-2 border border-gray-300 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm peer-focus:text-primary peer-focus:top-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base transition-all">
              Phone Number
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="peer w-full px-4 pt-5 pb-2 border border-gray-300 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm peer-focus:text-primary peer-focus:top-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base transition-all">
              Email Address
            </label>
          </div>

          {/* Message */}
          <div className="relative">
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              rows={4}
              className="peer w-full bg-background px-4 pt-5 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm peer-focus:text-primary peer-focus:top-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base transition-all ">
              Your Message
            </label>
          </div>
          <hr className="border border-primary" />
          <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
            <button
              aria-label="Submit Button"
              type="submit"
              disabled={loading}
              className="w-full flex  items-center justify-center gap-2 bg-primary text-background hover:bg-secondary hover:text-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition duration-200"
            >
              <MailIcon /> {loading ? "Sending..." : "Send Message"}
            </button>

            <span className="font-bold">OR</span>
            <div className="text-center  w-full">
              <a
                href="https://wa.me/+8801787224460"
                target="_blank"
                className="w-full flex  items-center justify-center gap-2 bg-primary text-background hover:bg-secondary hover:text-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition duration-200"
                rel="noopener noreferrer"
              >
                <MessageCircleMore /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </form>
      </div>
    </PaddingContainer>
  );
}
