import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Bell, CheckCircle2 } from "lucide-react";

export default async function NotifikasiDasborPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  // Fetch notifications
  const userNotifications = await db.select().from(notifications)
    .where(eq(notifications.userId, session.user.id))
    .orderBy(desc(notifications.createdAt));

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  // Mark all as read after fetching
  if (unreadCount > 0) {
    await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, session.user.id));
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-end justify-between border-b border-[#DDD8D0] pb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-[#3D2B1F]" style={{ fontFamily: "var(--font-cormorant)" }}>
            Notifikasi
          </h1>
          <p className="text-[#6B6560]">
            Pemberitahuan terkait proses pendaftaran pernikahan Anda.
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="px-3 py-1.5 bg-[#FDECEA] text-[#C0392B] text-xs font-bold uppercase rounded-full tracking-wider flex items-center gap-1.5">
            <Bell size={14} />
            {unreadCount} Pesan Baru
          </div>
        )}
      </div>

      {/* List Notifikasi */}
      <div className="space-y-4">
        {userNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#DDD8D0] shadow-sm">
            <div className="w-16 h-16 bg-[#F5F0E8] rounded-full flex items-center justify-center mx-auto mb-4 text-[#A89880]">
              <Bell size={32} />
            </div>
            <h3 className="text-lg font-bold text-[#3D2B1F] mb-1">Belum Ada Notifikasi</h3>
            <p className="text-[#6B6560]">Anda akan menerima pemberitahuan di sini jika ada pembaruan.</p>
          </div>
        ) : (
          userNotifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-5 rounded-xl border shadow-sm transition-all ${
                !notif.isRead 
                  ? "bg-white border-[#DDD8D0] border-l-4 border-l-[#B8960C]" 
                  : "bg-[#FAF7F2] border-[#EDE8DF]"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {!notif.isRead ? (
                    <span className="inline-block px-2 py-0.5 bg-[#FFF8E1] text-[#B8960C] text-[10px] font-bold uppercase rounded tracking-wider">
                      Baru
                    </span>
                  ) : (
                    <CheckCircle2 size={16} className="text-[#A89880]" />
                  )}
                  <span className="text-xs text-[#A89880] font-medium">
                    {new Date(notif.createdAt || new Date()).toLocaleString('id-ID', { 
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
              
              <p className={`text-[15px] leading-relaxed ${!notif.isRead ? "text-[#3D2B1F] font-medium" : "text-[#6B6560]"}`}>
                {notif.message}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
