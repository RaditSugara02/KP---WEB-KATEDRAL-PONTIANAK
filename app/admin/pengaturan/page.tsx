"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function PengaturanAdminPage() {
  const session = authClient.useSession();
  
  // Profil State
  const [name, setName] = useState(session.data?.user?.name || "");
  const [loadingProfil, setLoadingProfil] = useState(false);
  const [msgProfil, setMsgProfil] = useState({ text: "", type: "" });

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPass, setLoadingPass] = useState(false);
  const [msgPass, setMsgPass] = useState({ text: "", type: "" });

  const handleUpdateProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfil(true);
    setMsgProfil({ text: "", type: "" });

    try {
      const { error } = await authClient.updateUser({ name });
      if (error) throw new Error(error.message);
      
      setMsgProfil({ text: "Profil berhasil diperbarui.", type: "success" });
    } catch (err: unknown) {
      setMsgProfil({ text: err instanceof Error ? err.message : "Terjadi kesalahan.", type: "error" });
    } finally {
      setLoadingProfil(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPass(true);
    setMsgPass({ text: "", type: "" });

    if (newPassword !== confirmPassword) {
      setMsgPass({ text: "Konfirmasi kata sandi tidak cocok.", type: "error" });
      setLoadingPass(false);
      return;
    }

    if (newPassword.length < 8) {
      setMsgPass({ text: "Kata sandi baru minimal 8 karakter.", type: "error" });
      setLoadingPass(false);
      return;
    }

    try {
      const { error } = await authClient.changePassword({
        newPassword,
        currentPassword,
        revokeOtherSessions: true
      });

      if (error) throw new Error(error.message);

      setMsgPass({ text: "Kata sandi berhasil diubah.", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setMsgPass({ text: err instanceof Error ? err.message : "Terjadi kesalahan.", type: "error" });
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#3D2B1F] mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
          Pengaturan Akun
        </h1>
        <p className="text-[#6B6560] text-sm">Perbarui informasi profil dan keamanan akun Anda.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Form Ubah Profil */}
        <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#EDE8DF] bg-[#FAF7F2]">
            <h2 className="font-bold text-[#3D2B1F]">Informasi Profil</h2>
            <p className="text-xs text-[#6B6560] mt-1">Nama yang tampil di sistem dan kepada pengguna lain.</p>
          </div>
          <form onSubmit={handleUpdateProfil} className="p-6 space-y-5">
            {msgProfil.text && (
              <div className={`p-3 rounded-md text-sm flex items-center gap-2 ${msgProfil.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {msgProfil.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {msgProfil.text}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">Email (Tidak dapat diubah)</label>
              <input 
                type="email" 
                value={session.data?.user?.email || ""} 
                disabled 
                className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm bg-gray-50 text-gray-500 cursor-not-allowed" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required
                className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" 
              />
            </div>
            
            <div className="pt-2 flex justify-end">
              <button 
                type="submit" 
                disabled={loadingProfil || name === session.data?.user?.name}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#B8960C] text-white font-bold text-sm rounded-md hover:bg-[#9A7A00] transition-colors disabled:opacity-50"
              >
                {loadingProfil && <Loader2 size={16} className="animate-spin" />}
                Simpan Profil
              </button>
            </div>
          </form>
        </div>

        {/* Form Ubah Kata Sandi */}
        <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#EDE8DF] bg-[#FAF7F2]">
            <h2 className="font-bold text-[#3D2B1F]">Keamanan (Ubah Kata Sandi)</h2>
            <p className="text-xs text-[#6B6560] mt-1">Pastikan menggunakan kata sandi yang kuat dengan minimal 8 karakter.</p>
          </div>
          <form onSubmit={handleUpdatePassword} className="p-6 space-y-5">
            {msgPass.text && (
              <div className={`p-3 rounded-md text-sm flex items-center gap-2 ${msgPass.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {msgPass.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {msgPass.text}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">Kata Sandi Saat Ini</label>
              <input 
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                required
                className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">Kata Sandi Baru</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required
                  className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">Konfirmasi Sandi Baru</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required
                  className="w-full h-11 px-4 border border-[#DDD8D0] rounded-md text-sm focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none" 
                />
              </div>
            </div>
            
            <div className="pt-2 flex justify-end">
              <button 
                type="submit" 
                disabled={loadingPass || !currentPassword || !newPassword || !confirmPassword}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#3D2B1F] text-white font-bold text-sm rounded-md hover:bg-[#2C1F14] transition-colors disabled:opacity-50"
              >
                {loadingPass && <Loader2 size={16} className="animate-spin" />}
                Perbarui Kata Sandi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
