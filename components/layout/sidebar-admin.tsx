"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Plus, 
  Settings, 
  LogOut 
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function SidebarAdmin() {
  const pathname = usePathname();
  const router = useRouter();

  // MOCK DATA for now, since we haven't wired session fully into the component props
  const session = authClient.useSession();
  const userName = session.data?.user?.name || "Administrator Katedral";
  
  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/masuk");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Ringkasan", href: "/admin/ringkasan" },
    { icon: FileText, label: "Data Pernikahan", href: "/admin/pernikahan" },
    { icon: BookOpen, label: "Kelola Konten", href: "/admin/konten" },
  ];

  return (
    <aside
      className="hidden md:flex h-screen flex-shrink-0 flex-col justify-between"
      style={{
        width: "240px",
        background: "#2C1F14",
        borderRight: "none",
      }}
    >
      <div>
        {/* [A] Header User */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: "48px",
                height: "48px",
                background: "#B8960C",
                color: "#FFFFFF",
                fontFamily: "var(--font-cormorant)",
                fontSize: "24px",
              }}
            >
              SY
            </div>
            <div>
              <p
                className="text-white font-bold"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "14px",
                }}
              >
                {userName}
              </p>
              <p
                className="uppercase"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "10px",
                  color: "#A89880",
                  letterSpacing: "0.05em",
                }}
              >
                ADMIN SEKRETARIAT
              </p>
            </div>
          </div>
        </div>

        {/* [B] Tombol Buat Pengumuman */}
        <div className="px-4 mb-4">
          <Link
            href="/admin/konten/tambah"
            className="w-full rounded flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{
              height: "40px",
              background: "#B8960C",
              color: "#FFFFFF",
              fontFamily: "var(--font-dm-sans)",
              fontSize: "13px",
              fontWeight: "500",
              display: "flex",
            }}
          >
            <Plus size={16} />
            Buat Pengumuman
          </Link>
        </div>

        {/* [C] Menu Navigasi */}
        <nav className="flex flex-col px-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md transition-colors"
                style={{
                  padding: "10px 16px",
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "13px",
                  background: isActive ? "#3D2B1F" : "transparent",
                  color: isActive ? "#B8960C" : "#A89880",
                  fontWeight: isActive ? "bold" : "normal",
                  borderLeft: isActive ? "3px solid #B8960C" : "3px solid transparent",
                }}
              >
                <Icon size={18} color={isActive ? "#B8960C" : "#A89880"} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* [D] Divider & [E] Footer sidebar */}
      <div>
        <div style={{ height: "1px", background: "#3D2B1F" }} />
        <div className="p-4 flex flex-col gap-1">
          <Link
            href="/admin/pengaturan"
            className="flex items-center gap-3 rounded-md transition-colors hover:bg-[#3D2B1F]"
            style={{
              padding: "10px 16px",
              fontFamily: "var(--font-dm-sans)",
              fontSize: "13px",
              color: "#A89880",
            }}
          >
            <Settings size={18} />
            Pengaturan
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-md transition-colors hover:bg-[#3D2B1F]"
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
