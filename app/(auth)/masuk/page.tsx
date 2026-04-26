"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function MasukPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Email atau kata sandi salah.");
        setLoading(false);
        return;
      }

      if (data) {
        // hard-redirect to hit the middleware, which will redirect to /admin or /dasbor/beranda based on role
        window.location.href = "/dasbor";
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* KOLOM KIRI (50%) */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center flex-col"
        style={{
          background: "#3D2B1F",
        }}
      >
        <div className="relative z-10 flex flex-col items-center text-center px-8">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-6"
          >
            <path d="M18 22V11c0-2.8-2.2-5-5-5H9" />
            <path d="M12 22V2l-4 4" />
            <path d="M12 2l4 4" />
            <path d="M4 22v-6c0-1.7 1.3-3 3-3" />
            <path d="M22 22H2" />
          </svg>
          <h1
            className="text-white text-4xl lg:text-5xl mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Katedral Santo Yosef Martapura
          </h1>
          <p
            className="text-white/80 italic text-lg"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Melayani Umat dengan Kasih dan Ketulusan
          </p>
        </div>
      </div>

      {/* KOLOM KANAN (50%) */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center"
        style={{ background: "#FAF7F2", padding: "64px" }}
      >
        <div className="w-full max-w-md">
          {/* Logo kecil + teks gold */}
          <div className="flex items-center gap-2 mb-10">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B8960C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 22V11c0-2.8-2.2-5-5-5H9" />
              <path d="M12 22V2l-4 4" />
              <path d="M12 2l4 4" />
              <path d="M4 22v-6c0-1.7 1.3-3 3-3" />
              <path d="M22 22H2" />
            </svg>
            <span
              className="font-bold text-lg"
              style={{
                fontFamily: "var(--font-cormorant)",
                color: "#B8960C",
              }}
            >
              Katedral Santo Yosef
            </span>
          </div>

          <h2
            className="mb-2"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "32px",
              color: "#3D2B1F",
            }}
          >
            Masuk ke Akun Anda
          </h2>
          <p
            className="mb-8"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              color: "#6B6560",
            }}
          >
            Selamat datang kembali. Masukkan data Anda untuk melanjutkan.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 uppercase font-semibold"
                style={{
                  fontSize: "11px",
                  color: "#6B6560",
                  letterSpacing: "0.5px",
                }}
              >
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md outline-none transition-all"
                style={{
                  height: "44px",
                  border: "1px solid #DDD8D0",
                  padding: "0 14px",
                  fontSize: "14px",
                  background: "#fff",
                  color: "#3D2B1F",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#B8960C")}
                onBlur={(e) => (e.target.style.borderColor = "#DDD8D0")}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 uppercase font-semibold"
                style={{
                  fontSize: "11px",
                  color: "#6B6560",
                  letterSpacing: "0.5px",
                }}
              >
                KATA SANDI
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md outline-none transition-all"
                  style={{
                    height: "44px",
                    border: "1px solid #DDD8D0",
                    padding: "0 40px 0 14px",
                    fontSize: "14px",
                    background: "#fff",
                    color: "#3D2B1F",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#B8960C")}
                  onBlur={(e) => (e.target.style.borderColor = "#DDD8D0")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89880] hover:text-[#3D2B1F]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-[#B8960C]" />
                <span style={{ fontSize: "13px", color: "#6B6560" }}>
                  Ingat saya
                </span>
              </label>
              <Link
                href="/lupa-kata-sandi"
                style={{ fontSize: "13px", color: "#B8960C" }}
                className="hover:underline font-medium"
              >
                Lupa kata sandi?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-70"
              style={{
                height: "48px",
                background: "#B8960C",
                color: "#FFFFFF",
                fontFamily: "var(--font-dm-sans)",
                fontSize: "14px",
                fontWeight: "bold",
                marginTop: "24px",
              }}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-[#DDD8D0] flex-1"></div>
            <span style={{ fontSize: "12px", color: "#A89880" }}>
              atau lanjutkan dengan
            </span>
            <div className="h-px bg-[#DDD8D0] flex-1"></div>
          </div>

          <div className="mt-8 text-center">
            <p style={{ fontSize: "14px", color: "#6B6560" }}>
              Belum punya akun?{" "}
              <Link
                href="/daftar"
                className="font-bold hover:underline"
                style={{ color: "#B8960C" }}
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
