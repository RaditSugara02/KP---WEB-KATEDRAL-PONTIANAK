"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function MasukPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dasbor",
      });
    } catch {
      toast.error("Terjadi kesalahan saat masuk dengan Google.");
      setLoading(false);
    }
  };

  const handleManualSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Mohon isi email dan kata sandi Anda.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Format alamat email tidak valid.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) {
        throw new Error(signInError.message || "Gagal masuk. Periksa email dan kata sandi Anda.");
      }

      toast.success("Berhasil masuk!");
      if (data?.user?.role === "ADMIN") {
        router.push("/admin/ringkasan");
      } else {
        router.push("/dasbor/beranda");
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* KOLOM KIRI (50%) */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center flex-col"
        style={{ background: "#3D2B1F" }}
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
            Sistem Informasi Paroki
          </h1>
          <p
            className="text-white/80 italic text-lg"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Pendaftaran Sakramen Perkawinan Katedral Santo Yosef
          </p>
        </div>
      </div>

      {/* KOLOM KANAN (50%) */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center py-12"
        style={{ background: "#FAF7F2", padding: "48px" }}
      >
        <div className="w-full max-w-md">
          {/* Logo kecil + teks gold */}
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
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
              style={{ fontFamily: "var(--font-cormorant)", color: "#B8960C" }}
            >
              Katedral Santo Yosef
            </span>
          </div>

          <h2
            className="mb-2 text-center lg:text-left"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "32px", color: "#3D2B1F" }}
          >
            Masuk ke Akun Anda
          </h2>
          <p
            className="mb-8 text-center lg:text-left"
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "14px", color: "#6B6560" }}
          >
            Selamat datang kembali. Lanjutkan dengan akun pilihan Anda.
          </p>

          <div className="space-y-4 mb-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full rounded-md flex items-center justify-center gap-3 transition-opacity hover:opacity-90 disabled:opacity-70 bg-white border border-[#DDD8D0] shadow-sm"
              style={{ height: "48px", color: "#3D2B1F", fontFamily: "var(--font-dm-sans)", fontSize: "14px", fontWeight: "bold" }}
            >
              {loading ? (
                "Memproses..."
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Lanjutkan dengan Google
                </>
              )}
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#DDD8D0]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#FAF7F2] text-[#A89880] text-xs font-bold uppercase tracking-wider">
                ATAU MASUK DENGAN EMAIL
              </span>
            </div>
          </div>

          <form onSubmit={handleManualSignIn} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#6B6560] mb-1.5 uppercase tracking-wide">Alamat Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 rounded-md border border-[#DDD8D0] bg-white text-[#3D2B1F] focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none text-sm transition-shadow"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wide">Kata Sandi</label>
                <Link href="/lupa-sandi" className="text-xs font-semibold text-[#B8960C] hover:underline">
                  Lupa Sandi?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3 pr-10 rounded-md border border-[#DDD8D0] bg-white text-[#3D2B1F] focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none text-sm transition-shadow"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89880] hover:text-[#6B6560] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md flex items-center justify-center transition-colors disabled:opacity-70"
              style={{
                height: "48px",
                background: "#B8960C",
                color: "white",
                fontFamily: "var(--font-dm-sans)",
                fontSize: "14px",
                fontWeight: "bold",
                marginTop: "24px"
              }}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-4">
            <p style={{ fontSize: "14px", color: "#6B6560" }}>
              Belum punya akun?{" "}
              <Link href="/daftar" className="font-bold hover:underline" style={{ color: "#B8960C" }}>
                Buat Akun
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
