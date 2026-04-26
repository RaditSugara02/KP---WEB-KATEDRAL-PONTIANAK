

export default function CekEmailPage() {
  return (
    <div className="min-h-screen flex">
      {/* KOLOM KIRI (50%) */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center flex-col"
        style={{
          background: "#3D2B1F",
        }}
      >
        <div className="relative z-10 flex flex-col items-center text-center px-8">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-6"
          >
            <path d="M18 22V11c0-2.8-2.2-5-5-5H9" />
            <path d="M12 22V2l-4 4" />
            <path d="M12 2l4 4" />
            <path d="M4 22v-6c0-1.7 1.3-3 3-3" />
            <path d="M22 22H2" />
          </svg>
          <h1
            className="text-white text-4xl lg:text-5xl mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Katedral Santo Yosef Martapura
          </h1>
          <p
            className="text-white/80 italic text-lg"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Melayani Umat dengan Kasih dan Ketulusan
          </p>
        </div>
      </div>

      {/* KOLOM KANAN (50%) */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center"
        style={{ background: "#FAF7F2", padding: "64px" }}
      >
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B8960C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>

          <h2
            className="mb-4"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "32px",
              color: "#3D2B1F",
            }}
          >
            Cek Email Anda
          </h2>
          <p
            className="mb-2"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "15px",
              color: "#6B6560",
            }}
          >
            Kami telah mengirim link aktivasi ke
          </p>
          <p className="font-bold mb-8" style={{ color: "#3D2B1F", fontSize: "16px" }}>
            email.anda@contoh.com
          </p>

          <a
            href="mailto:"
            className="w-full rounded-md flex items-center justify-center transition-opacity hover:opacity-90"
            style={{
              height: "48px",
              background: "#B8960C",
              color: "#FFFFFF",
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "24px"
            }}
          >
            Buka Aplikasi Email
          </a>

          <p style={{ fontSize: "14px", color: "#6B6560" }}>
            <button className="font-medium hover:underline mb-4" style={{ color: "#B8960C" }}>
              Kirim ulang email aktivasi
            </button>
          </p>
          
          <p style={{ fontSize: "12px", color: "#A89880" }}>
            Catatan: Cek folder spam jika tidak menemukan email dalam 5 menit.
          </p>
        </div>
      </div>
    </div>
  );
}
