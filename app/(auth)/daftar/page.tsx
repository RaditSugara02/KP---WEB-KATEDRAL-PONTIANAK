"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function DaftarPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "Nama depan wajib diisi";
    if (!lastName.trim()) newErrors.lastName = "Nama belakang wajib diisi";
    if (!email.trim() || !email.includes("@")) newErrors.email = "Email tidak valid";
    if (!phone.trim()) newErrors.phone = "Nomor telepon wajib diisi";
    if (password.length < 8) newErrors.password = "Kata sandi minimal 8 karakter";
    if (password !== confirmPassword) newErrors.confirmPassword = "Kata sandi tidak cocok";
    if (!agreeTerms) newErrors.agreeTerms = "Anda harus menyetujui syarat & ketentuan";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`.trim(),
      });

      if (authError) {
        setErrors({ submit: authError.message || "Gagal mendaftar." });
        setLoading(false);
        return;
      }

      if (data) {
        router.push("/cek-email");
      }
    } catch {
      setErrors({ submit: "Terjadi kesalahan sistem. Silakan coba lagi." });
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
        className="w-full lg:w-1/2 flex items-center justify-center py-12"
        style={{ background: "#FAF7F2", padding: "64px" }}
      >
        <div className="w-full max-w-md">
          {/* Logo kecil + teks gold */}
          <div className="flex items-center gap-2 mb-8">
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
            Buat Akun Baru
          </h2>
          <p
            className="mb-6"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              color: "#6B6560",
            }}
          >
            Daftarkan diri Anda untuk memantau progres pernikahan secara online.
          </p>

          <div
            className="mb-8"
            style={{
              borderLeft: "3px solid #B8960C",
              background: "#F5F0E8", // Slightly darker cream for contrast
              padding: "12px",
              fontSize: "13px",
              color: "#6B6560",
              borderRadius: "0 4px 4px 0"
            }}
          >
            Akun ini dikhususkan untuk calon pengantin yang ingin memantau progres
            pendaftaran pernikahan. Untuk akses Admin atau Romo, hubungi sekretariat.
          </div>

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="firstName"
                  className="block mb-2 uppercase font-semibold"
                  style={{ fontSize: "11px", color: "#6B6560", letterSpacing: "0.5px" }}
                >
                  NAMA DEPAN
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-md outline-none transition-all"
                  style={{
                    height: "44px",
                    border: "1px solid #DDD8D0",
                    padding: "0 14px",
                    fontSize: "14px",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#B8960C")}
                  onBlur={(e) => (e.target.style.borderColor = "#DDD8D0")}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="lastName"
                  className="block mb-2 uppercase font-semibold"
                  style={{ fontSize: "11px", color: "#6B6560", letterSpacing: "0.5px" }}
                >
                  NAMA BELAKANG
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-md outline-none transition-all"
                  style={{
                    height: "44px",
                    border: "1px solid #DDD8D0",
                    padding: "0 14px",
                    fontSize: "14px",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#B8960C")}
                  onBlur={(e) => (e.target.style.borderColor = "#DDD8D0")}
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 uppercase font-semibold"
                style={{ fontSize: "11px", color: "#6B6560", letterSpacing: "0.5px" }}
              >
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md outline-none transition-all"
                style={{
                  height: "44px",
                  border: "1px solid #DDD8D0",
                  padding: "0 14px",
                  fontSize: "14px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#B8960C")}
                onBlur={(e) => (e.target.style.borderColor = "#DDD8D0")}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block mb-2 uppercase font-semibold"
                style={{ fontSize: "11px", color: "#6B6560", letterSpacing: "0.5px" }}
              >
                NOMOR TELEPON
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+62..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md outline-none transition-all"
                style={{
                  height: "44px",
                  border: "1px solid #DDD8D0",
                  padding: "0 14px",
                  fontSize: "14px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#B8960C")}
                onBlur={(e) => (e.target.style.borderColor = "#DDD8D0")}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 uppercase font-semibold"
                style={{ fontSize: "11px", color: "#6B6560", letterSpacing: "0.5px" }}
              >
                KATA SANDI
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md outline-none transition-all"
                  style={{
                    height: "44px",
                    border: "1px solid #DDD8D0",
                    padding: "0 40px 0 14px",
                    fontSize: "14px",
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
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-2 uppercase font-semibold"
                style={{ fontSize: "11px", color: "#6B6560", letterSpacing: "0.5px" }}
              >
                KONFIRMASI KATA SANDI
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-md outline-none transition-all"
                  style={{
                    height: "44px",
                    border: "1px solid #DDD8D0",
                    padding: "0 40px 0 14px",
                    fontSize: "14px",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#B8960C")}
                  onBlur={(e) => (e.target.style.borderColor = "#DDD8D0")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89880] hover:text-[#3D2B1F]"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="flex items-start gap-2 cursor-pointer mt-2">
                <input 
                  type="checkbox" 
                  className="accent-[#B8960C] mt-1" 
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span style={{ fontSize: "13px", color: "#6B6560" }}>
                  Saya menyetujui Syarat & Ketentuan dan Kebijakan Privasi
                </span>
              </label>
              {errors.agreeTerms && <p className="mt-1 text-xs text-red-500 ml-5">{errors.agreeTerms}</p>}
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
              {loading ? "Memproses..." : "Buat Akun"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p style={{ fontSize: "14px", color: "#6B6560" }}>
              Sudah punya akun?{" "}
              <Link
                href="/masuk"
                className="font-bold hover:underline"
                style={{ color: "#B8960C" }}
              >
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
