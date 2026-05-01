"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Loader2 } from "lucide-react";

export default function DaftarUlangButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleDaftarUlang = async () => {
    if (!confirm("Anda akan mengajukan pendaftaran ulang. Proses ini akan membuat aplikasi baru dari awal. Lanjutkan?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dasbor/daftar-ulang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mendaftar ulang.");
      setDone(true);
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-bold text-sm rounded-md">
        ✅ Pendaftaran ulang berhasil! Memuat ulang...
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleDaftarUlang}
        disabled={loading}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B8960C] text-white font-bold text-sm rounded-md hover:bg-[#9A7A00] transition-colors shadow-sm disabled:opacity-60"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <RefreshCw size={16} />
        )}
        {loading ? "Memproses..." : "Ajukan Daftar Ulang"}
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
