"use client";

import PaddingContainer from "@/components/common/PaddingContainer";
import { login } from "@/store/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useDispatch } from "react-redux";

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(
    searchParams.get("mode") !== "register",
  );
  const [formData, setFormData] = useState({
    identifier: "", // For Login: Email or Phone
    email: "",
    phone: "",
    password: "",
    name: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectPath = searchParams.get("redirect") || "/e-learning/quiz";

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      identifier: "",
      email: "",
      phone: "",
      password: "",
      name: "",
      address: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    // Basic Validation
    if (!isLogin) {
      if (
        !formData.email ||
        !formData.phone ||
        !formData.password ||
        !formData.name
      ) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }
    } else {
      if (!formData.identifier || !formData.password) {
        setError("Please enter your email/phone and password.");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin
            ? {
                identifier: formData.identifier,
                password: formData.password,
              }
            : {
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                name: formData.name,
                address: formData.address,
              },
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (data.success) {
        // Dispatch login action
        dispatch(login(data.user));
        // Redirect
        router.push(redirectPath);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaddingContainer>
      <div className="py-6">
        <Link
          href="/e-learning"
          className="inline-flex items-center gap-2 text-sm font-medium group transition-colors"
        >
          <div className="p-2 bg-secondary rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="group-hover:underline underline-offset-8">
            {" "}
            Back to E-Learning
          </span>
        </Link>
      </div>
      <div className="flex items-center justify-center pb-20">
        <div className="bg-card border rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-muted-foreground">
                {isLogin
                  ? "Enter your credentials to access your account"
                  : "Sign up to start taking quizzes"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required={!isLogin}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required={!isLogin}
                      placeholder="e.g. john@example.com"
                      className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 ml-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required={!isLogin}
                        placeholder="e.g. 017XXXXXXXX"
                        className="w-full pl-4 pr-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all tracking-wide"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 ml-1">
                      Address
                    </label>
                    <textarea
                      placeholder="e.g. House #12, Road #4, Dhaka"
                      className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none min-h-[80px]"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-1.5 ml-1">
                    Email or Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter email or phone"
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    value={formData.identifier}
                    onChange={(e) =>
                      setFormData({ ...formData, identifier: e.target.value })
                    }
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1.5 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-lg shadow-primary/20"
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Login"
                  : "Create Account"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PaddingContainer>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  );
}
