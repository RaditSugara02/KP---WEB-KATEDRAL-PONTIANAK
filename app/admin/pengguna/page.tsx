export default function AdminPenggunaPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ fontSize: "32px" }}>Kelola Pengguna</h1>
        <button
          className="px-5 py-2 rounded-md text-white font-medium text-sm"
          style={{ background: "#B8960C" }}
        >
          + Tambah Pengguna
        </button>
      </div>
      <div
        className="p-6 rounded-xl"
        style={{
          background: "#FFFFFF",
          border: "1px solid #DDD8D0",
          boxShadow: "0 2px 8px rgba(44,36,22,0.08)",
        }}
      >
        <p style={{ fontSize: "14px", color: "#A89880" }}>
          Halaman kelola pengguna akan dibangun pada tahap berikutnya.
        </p>
      </div>
    </div>
  );
}
