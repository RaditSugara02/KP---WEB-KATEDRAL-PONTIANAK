"use client";

import { Bell, HelpCircle, Menu, Home, FileText, User, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";

interface HeaderBarProps {
  title: string;
}

export function HeaderBar({ title }: HeaderBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    fetch("/api/notifikasi/count")
      .then((r) => r.json())
      .then((data) => setNotifCount(data.count || 0));
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/masuk");
  };

  const navItems = [
    { icon: Home, label: "Beranda", href: "/dasbor/beranda" },
    { icon: FileText, label: "Dokumen", href: "/dasbor/dokumen" },
    { icon: Bell, label: "Notifikasi", href: "/dasbor/notifikasi", badge: notifCount },
    { icon: User, label: "Profil Saya", href: "/dasbor/profil" },
  ];

  return (
    <header
      className="flex items-center justify-between flex-shrink-0"
      style={{
        height: "56px",
        background: "#FFFFFF",
        borderBottom: "1px solid #EDE8DF",
        padding: "0 24px",
      }}
    >
      <div className="flex items-center gap-3">
        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="text-[#3D2B1F] p-1 -ml-2 rounded-md hover:bg-gray-100">
              <Menu size={24} />
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-white border-r-[#DDD8D0] flex flex-col justify-between">
              <div>
                <div className="p-6 pb-6 text-center border-b border-[#EDE8DF] mb-4">
                  <div className="flex justify-center mb-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B8960C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 22V11c0-2.8-2.2-5-5-5H9" />
                      <path d="M12 22V2l-4 4" />
                      <path d="M12 2l4 4" />
                      <path d="M4 22v-6c0-1.7 1.3-3 3-3" />
                      <path d="M22 22H2" />
                    </svg>
                  </div>
                  <h2 className="font-bold font-serif text-[#B8960C]">Katedral Santo Yosef</h2>
                  <p className="text-xs text-[#6B6560]">Portal Pengantin</p>
                </div>
                
                <nav className="flex flex-col px-2 gap-1">
                  {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between rounded-md transition-colors hover:bg-[#F5F0E8]"
                        style={{
                          padding: "10px 16px",
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
                        {item.badge ? (
                          <span className="flex items-center justify-center rounded-full text-white font-bold w-[18px] h-[18px] text-[10px] bg-red-500">
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              
              <div>
                <div className="h-[1px] bg-[#EDE8DF]" />
                <div className="p-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 rounded-md transition-colors hover:bg-[#FDECEA] text-red-500 p-[10px_16px] text-[13px]"
                  >
                    <LogOut size={18} />
                    Keluar
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "16px",
            color: "#3D2B1F",
            fontWeight: "600",
            margin: 0,
          }}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-[#6B6560] hover:text-[#B8960C] transition-colors">
          <Bell size={20} />
        </button>
        <button className="text-[#6B6560] hover:text-[#B8960C] transition-colors">
          <HelpCircle size={20} />
        </button>
      </div>
    </header>
  );
}
