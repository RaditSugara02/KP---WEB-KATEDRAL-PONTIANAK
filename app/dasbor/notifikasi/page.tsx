import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { Bell, Check, Clock } from "lucide-react";

export default async function NotifikasiPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const userNotifications = await db.select().from(notifications)
    .where(eq(notifications.userId, session.user.id))
    .orderBy(desc(notifications.createdAt));

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  // Mark all unread notifications as read silently in the background
  if (unreadCount > 0) {
    await db.update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.userId, session.user.id),
          eq(notifications.isRead, false)
        )
      );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#3D2B1F]" style={{ fontFamily: "var(--font-cormorant)" }}>
            Notifikasi Anda
          </h1>
          <p className="text-[#6B6560]">
            Pesan dan pembaruan sistem dari Sekretariat Paroki.
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="bg-[#B8960C] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            {unreadCount} Belum Dibaca
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm overflow-hidden">
        <div className="divide-y divide-[#EDE8DF]">
          {userNotifications.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <Bell size={48} className="text-[#EDE8DF] mb-4" />
              <p className="text-[#6B6560]">Belum ada notifikasi untuk Anda saat ini.</p>
            </div>
          ) : (
            userNotifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-5 sm:p-6 flex items-start gap-4 transition-colors ${
                  notif.isRead ? "bg-white" : "bg-[#FAF7F2]"
                }`}
              >
                <div className="mt-1 flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notif.isRead ? "bg-[#F5F0E8] text-[#A89880]" : "bg-[#FFF8E1] text-[#B8960C]"
                  }`}>
                    <Bell size={18} />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h4 className={`text-sm sm:text-base ${notif.isRead ? "font-medium text-[#3D2B1F]" : "font-bold text-[#B8960C]"}`}>
                      Pembaruan Pendaftaran
                    </h4>
                    <span className="text-xs text-[#A89880] flex items-center gap-1 flex-shrink-0">
                      <Clock size={12} />
                      {new Date(notif.createdAt || new Date()).toLocaleDateString('id-ID', { 
                        day: 'numeric', month: 'short', year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${notif.isRead ? "text-[#6B6560]" : "text-[#3D2B1F] font-medium"}`}>
                    {notif.message}
                  </p>
                </div>
                
                {!notif.isRead && (
                  <div className="flex-shrink-0 self-center hidden sm:block">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B8960C] block"></span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
