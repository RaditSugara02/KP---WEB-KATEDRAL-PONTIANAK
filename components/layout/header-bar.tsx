import { Bell, HelpCircle } from "lucide-react";

interface HeaderBarProps {
  title: string;
}

export function HeaderBar({ title }: HeaderBarProps) {
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
      <div>
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
