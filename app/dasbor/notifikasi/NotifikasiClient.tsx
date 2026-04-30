"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Clock, RefreshCw, AlertCircle, CheckCheck } from "lucide-react";

interface Notif {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface Props {
  initialNotifications: Notif[];
  initialUnreadCount: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit", minute: "2-digit",
  });
}

function isCancel(message: string) {
  const lower = message.toLowerCase();
  return lower.includes("dibatalkan") || lower.includes("batal") || lower.includes("dihentikan");
}

export default function NotifikasiClient({ initialNotifications, initialUnreadCount }: Props) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const notifications = initialNotifications;

  const handleRefresh = async () => {
    setRefreshing(true);
    router.refresh();
    await new Promise(r => setTimeout(r, 800));
    setLastRefresh(new Date());
    setRefreshing(false);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3D2B1F]" style={{ fontFamily: "var(--font-cormorant)" }}>
            Notifikasi Anda
          </h1>
          <p className="text-[#6B6560]">
            Pesan dan pembaruan sistem dari Sekretariat Paroki.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {initialUnreadCount > 0 && (
            <div className="bg-[#B8960C] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {initialUnreadCount} Belum Dibaca
            </div>
          )}
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#DDD8D0] text-[#6B6560] text-sm font-semibold rounded-full hover:bg-[#FAF7F2] hover:border-[#B8960C] hover:text-[#B8960C] transition-all disabled:opacity-60"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Memperbarui..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Last refresh time */}
      <div className="flex items-center gap-1.5 text-xs text-[#A89880] mb-3 -mt-4">
        <Clock size={11} />
        <span>Terakhir diperbarui: {formatTime(lastRefresh.toISOString())}</span>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm overflow-hidden">
        <div className="divide-y divide-[#EDE8DF]">
          {notifications.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <Bell size={48} className="text-[#EDE8DF] mb-4" />
              <p className="text-[#6B6560]">Belum ada notifikasi untuk Anda saat ini.</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isCancelNotif = isCancel(notif.message);
              return (
                <div
                  key={notif.id}
                  className={`p-5 sm:p-6 flex items-start gap-4 transition-colors ${
                    isCancelNotif
                      ? "bg-[#FFF5F5] border-l-4 border-[#C0392B]"
                      : notif.isRead
                      ? "bg-white"
                      : "bg-[#FAF7F2]"
                  }`}
                >
                  {/* Icon */}
                  <div className="mt-1 flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCancelNotif
                        ? "bg-[#FDECEA] text-[#C0392B]"
                        : notif.isRead
                        ? "bg-[#F5F0E8] text-[#A89880]"
                        : "bg-[#FFF8E1] text-[#B8960C]"
                    }`}>
                      {isCancelNotif ? <AlertCircle size={18} /> : <Bell size={18} />}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 mb-1">
                      <h4 className={`text-sm sm:text-base ${
                        isCancelNotif
                          ? "font-bold text-[#C0392B]"
                          : notif.isRead
                          ? "font-medium text-[#3D2B1F]"
                          : "font-bold text-[#B8960C]"
                      }`}>
                        {isCancelNotif ? "⚠ Pendaftaran Dibatalkan" : "Pembaruan Pendaftaran"}
                      </h4>
                      {/* Tanggal + Jam */}
                      <span className="text-xs text-[#A89880] flex items-center gap-1 flex-shrink-0">
                        <Clock size={11} />
                        {formatDate(notif.createdAt)} · {formatTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${
                      isCancelNotif
                        ? "text-[#7B241C] font-medium"
                        : notif.isRead
                        ? "text-[#6B6560]"
                        : "text-[#3D2B1F] font-medium"
                    }`}>
                      {notif.message}
                    </p>
                    {/* Sudah dibaca badge */}
                    {notif.isRead && !isCancelNotif && (
                      <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-[#A89880]">
                        <CheckCheck size={10} /> Sudah dibaca
                      </span>
                    )}
                  </div>

                  {/* Unread dot */}
                  {!notif.isRead && !isCancelNotif && (
                    <div className="flex-shrink-0 self-center hidden sm:block">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B8960C] block" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
