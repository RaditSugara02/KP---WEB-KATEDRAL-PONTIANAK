"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function LupaSandiPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Mohon masukkan alamat email Anda.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Format alamat email tidak valid.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-sandi",
      });

      if (error) {
        console.error("Lupa Sandi Error Message:", error.message);
        console.error("Lupa Sandi Error Status:", error.status);
        throw new Error(error.message || `Gagal mengirim email (Status: ${error?.status || 'Unknown'})`);
      }

      setIsSent(true);
      toast.success("Tautan pemulihan telah dikirim ke email Anda.");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan sistem.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFBF7]">
      {/* Kiri: Gambar/Warna Solid (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#3D2B1F] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="text-center z-10 p-12">
          <div className="mb-6 flex justify-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#FDFBF7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 20V10" />
              <path d="M6 20V10" />
              <path d="M12 20V4" />
              <path d="M12 4l6 6" />
              <path d="M12 4l-6 6" />
              <path d="M4 20h16" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-[#FDFBF7] mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
            Katedral Santo Yosef Martapura
          </h1>
          <p className="text-[#DDD8D0] text-lg font-medium italic" style={{ fontFamily: "var(--font-cormorant)" }}>
            Melayani Umat dengan Kasih dan Ketulusan
          </p>
        </div>
      </div>

      {/* Kanan: Form Pemulihan */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <Link href="/masuk" className="absolute top-8 left-8 text-[#A89880] hover:text-[#6B6560] flex items-center gap-2 text-sm transition-colors">
          <ArrowLeft size={16} /> Kembali ke Masuk
        </Link>

        <div className="w-full max-w-[400px]">
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B8960C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 20V10" />
                <path d="M6 20V10" />
                <path d="M12 20V4" />
                <path d="M12 4l6 6" />
                <path d="M12 4l-6 6" />
                <path d="M4 20h16" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-[#3D2B1F] mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
              Lupa Kata Sandi
            </h2>
            <p className="text-sm text-[#6B6560]" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
            </p>
          </div>

          {isSent ? (
            <div className="bg-[#F0F5ED] border border-[#D5E5C9] p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3 className="text-[#3D2B1F] font-bold text-lg mb-2">Periksa Email Anda</h3>
              <p className="text-[#6B6560] text-sm mb-6">
                Tautan pemulihan kata sandi telah dikirim ke <span className="font-bold">{email}</span>. Silakan periksa folder Inbox atau Spam Anda.
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="text-[#B8960C] text-sm font-semibold hover:underline"
              >
                Kirim ulang email
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} noValidate className="space-y-6">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#B8960C] hover:bg-[#A3850B] text-white font-bold rounded-md transition-colors flex items-center justify-center disabled:opacity-70"
              >
                {loading ? "Mengirim..." : "Kirim Tautan Pemulihan"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
