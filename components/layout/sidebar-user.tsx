"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Home, 
  FileText, 
  Bell, 
  User, 
  LogOut 
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function SidebarUser() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/masuk");
  };

  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    fetch("/api/notifikasi/count")
      .then(r => r.json())
      .then(data => setNotifCount(data.count || 0));
  }, []);

  const navItems = [
    { icon: Home, label: "Beranda", href: "/dasbor/beranda" },
    { icon: FileText, label: "Dokumen", href: "/dasbor/dokumen" },
    { icon: Bell, label: "Notifikasi", href: "/dasbor/notifikasi", badge: notifCount },
    { icon: User, label: "Profil Saya", href: "/dasbor/profil" },
  ];

  return (
    <aside
      className="hidden md:flex h-screen flex-shrink-0 flex-col justify-between"
      style={{
        width: "240px",
        background: "#FFFFFF",
        borderRight: "1px solid #DDD8D0",
      }}
    >
      <div>
        {/* [A] Header */}
        <Link href="/" className="block p-6 pb-6 text-center border-b border-[#EDE8DF] mb-4 hover:bg-[#FDFBF7] transition-colors">
          <div className="flex justify-center mb-2">
            <svg
              width="32"
              height="32"
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
          </div>
          <h2
            className="font-bold"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "16px",
              color: "#B8960C",
            }}
          >
            Katedral Santo Yosef
          </h2>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "12px",
              color: "#6B6560",
            }}
          >
            Portal Pengantin
          </p>
        </Link>

        {/* [B] Menu Navigasi */}
        <nav className="flex flex-col px-2 gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-md transition-colors hover:bg-[#F5F0E8]"
                style={{
                  padding: "10px 16px",
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "13px",
                  background: isActive ? "#F5F0E8" : "transparent",
                  color: isActive ? "#B8960C" : "#6B6560",
                  fontWeight: isActive ? "bold" : "normal",
                  borderLeft: isActive ? "3px solid #B8960C" : "3px solid transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} color={isActive ? "#B8960C" : "#6B6560"} />
                  {item.label}
                </div>
                {item.badge && (
                  <span
                    className="flex items-center justify-center rounded-full text-white font-bold"
                    style={{
                      width: "18px",
                      height: "18px",
                      fontSize: "10px",
                      background: "#EF4444",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* [C] Divider & [D] Footer sidebar */}
      <div>
        <div style={{ height: "1px", background: "#EDE8DF" }} />
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-md transition-colors hover:bg-[#FDECEA]"
            style={{
              padding: "10px 16px",
              fontFamily: "var(--font-dm-sans)",
              fontSize: "13px",
              color: "#EF4444",
            }}
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}
