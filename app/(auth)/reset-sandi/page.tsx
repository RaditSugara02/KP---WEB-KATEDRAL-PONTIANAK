"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ResetSandiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Mohon lengkapi kata sandi baru Anda.");
      return;
    }

    if (password.length < 8) {
      toast.error("Kata sandi harus memiliki minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const token = new URLSearchParams(window.location.search).get("token");
      
      if (!token) {
        toast.error("Tautan tidak valid atau tidak memiliki token pemulihan.");
        setLoading(false);
        return;
      }

      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        throw new Error(error.message || "Gagal mengatur ulang kata sandi. Tautan mungkin telah kedaluwarsa.");
      }

      setIsSuccess(true);
      toast.success("Kata sandi berhasil diubah!");
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null; // Mencegah hydration mismatch

  return (
    <div className="flex min-h-screen bg-[#FDFBF7]">
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
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-[400px]">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-[#3D2B1F] mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
              Atur Ulang Sandi
            </h2>
            <p className="text-sm text-[#6B6560]" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Masukkan kata sandi baru Anda untuk akun ini.
            </p>
          </div>

          {isSuccess ? (
            <div className="bg-[#F0F5ED] border border-[#D5E5C9] p-6 rounded-lg text-center">
              <CheckCircle2 size={48} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-[#3D2B1F] font-bold text-lg mb-2">Berhasil!</h3>
              <p className="text-[#6B6560] text-sm mb-6">
                Kata sandi Anda telah berhasil diatur ulang. Anda sekarang dapat masuk menggunakan kata sandi baru.
              </p>
              <Link href="/masuk" className="w-full h-11 bg-[#B8960C] hover:bg-[#A3850B] text-white font-bold rounded-md transition-colors flex items-center justify-center">
                Masuk ke Dasbor
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} noValidate className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#6B6560] mb-1.5 uppercase tracking-wide">Kata Sandi Baru</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 px-3 pr-10 rounded-md border border-[#DDD8D0] bg-white text-[#3D2B1F] focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none text-sm transition-shadow"
                    placeholder="Minimal 8 karakter"
                    minLength={8}
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

              <div>
                <label className="block text-xs font-bold text-[#6B6560] mb-1.5 uppercase tracking-wide">Ulangi Sandi Baru</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 px-3 pr-10 rounded-md border border-[#DDD8D0] bg-white text-[#3D2B1F] focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none text-sm transition-shadow"
                    placeholder="Ulangi kata sandi"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89880] hover:text-[#6B6560] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#3D2B1F] hover:bg-[#2A1E15] text-[#FDFBF7] font-bold rounded-md transition-colors flex items-center justify-center disabled:opacity-70"
              >
                {loading ? "Menyimpan..." : "Simpan Kata Sandi"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
