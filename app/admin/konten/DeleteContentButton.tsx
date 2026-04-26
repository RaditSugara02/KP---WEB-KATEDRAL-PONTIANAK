"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteContentButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus konten ini? Tindakan ini tidak bisa dibatalkan.")) return;
    setLoading(true);
    await fetch(`/api/admin/konten?id=${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      disabled={loading}
      onClick={handleDelete}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 rounded text-xs font-bold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
      Hapus
    </button>
  );
}
