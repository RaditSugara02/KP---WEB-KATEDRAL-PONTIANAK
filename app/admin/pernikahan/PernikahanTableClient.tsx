"use client";

import { useState, useMemo } from "react";
import { ArrowRight, Search, Filter, X } from "lucide-react";
import Link from "next/link";

const STAGE_NAMES = [
  "Pengisian Profil",
  "KPP",
  "Pemberkasan Dokumen",
  "Kanonik",
  "Selesai (Menunggu Pemberkatan)",
];

const STAGE_COLORS = [
  "bg-[#F0EFED] text-[#6B6560]",
  "bg-[#EBF5FB] text-[#2471A3]",
  "bg-[#FFF8E1] text-[#B8960C]",
  "bg-[#FFF8E1] text-[#B8960C]",
  "bg-[#D8F3DC] text-[#2D6A4F]",
];

type App = {
  id: string;
  currentStage: number | null;
  weddingDate: string | null;
  regNum: string | null;
  groom: string | null;
  bride: string | null;
  createdAt: string | null;
  isReregistration: boolean;
};

export default function PernikahanTableClient({ apps }: { apps: App[] }) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => {
    return apps.filter((app) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        (app.groom ?? "").toLowerCase().includes(q) ||
        (app.bride ?? "").toLowerCase().includes(q) ||
        (app.regNum ?? "").toLowerCase().includes(q);

      const matchStage =
        stageFilter === "all" ||
        (stageFilter === "reregistration"
          ? app.isReregistration === true
          : stageFilter === "99"
          ? app.currentStage === 99
          : String(app.currentStage) === stageFilter);

      return matchSearch && matchStage;
    });
  }, [apps, search, stageFilter]);

  return (
    <>
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#DDD8D0] shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 md:max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89880]"
            size={16}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau no. registrasi..."
            className="w-full h-10 pl-9 pr-4 text-sm border border-[#DDD8D0] rounded-md focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C] outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89880] hover:text-[#3D2B1F]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Stage Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-semibold transition-colors ${
                stageFilter !== "all"
                  ? "bg-[#B8960C] text-white border-[#B8960C]"
                  : "bg-white border-[#DDD8D0] text-[#3D2B1F] hover:bg-[#FAF7F2]"
              }`}
            >
              <Filter size={15} />
              {stageFilter === "all"
                ? "Filter Tahap"
                : stageFilter === "99"
                ? "Dibatalkan"
                : stageFilter === "reregistration"
                ? "🔄 Daftar Ulang"
                : `Tahap ${stageFilter}`}
            </button>

            {showFilter && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-[#DDD8D0] rounded-lg shadow-lg z-20 w-52 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                {[
                   { label: "Semua Tahap", val: "all" },
                   { label: "Tahap 1 – Pengisian Profil", val: "1" },
                   { label: "Tahap 2 – KPP", val: "2" },
                   { label: "Tahap 3 – Pemberkasan", val: "3" },
                   { label: "Tahap 4 – Kanonik", val: "4" },
                   { label: "Tahap 5 – Selesai", val: "5" },
                   { label: "Dibatalkan", val: "99" },
                   { label: "🔄 Daftar Ulang", val: "reregistration" },
                 ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => {
                      setStageFilter(opt.val);
                      setShowFilter(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[#FAF7F2] transition-colors ${
                      stageFilter === opt.val
                        ? "font-bold text-[#B8960C]"
                        : "text-[#3D2B1F]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear filter */}
          {(search || stageFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setStageFilter("all");
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#FDECEA] text-[#C0392B] border border-[#C0392B]/20 rounded-md text-xs font-bold hover:bg-[#F5B7B1]/30 transition-colors"
            >
              <X size={13} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#DDD8D0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F5F0E8] text-[#6B6560] text-xs uppercase tracking-wider border-b border-[#EDE8DF]">
              <tr>
                <th className="px-6 py-4 font-semibold">No. Registrasi &amp; Pasangan</th>
                <th className="px-6 py-4 font-semibold">Tahap Saat Ini</th>
                <th className="px-6 py-4 font-semibold">Rencana Pemberkatan</th>
                <th className="px-6 py-4 font-semibold">Terdaftar Pada</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE8DF]">
              {filtered.map((app) => {
                const stageNum = app.currentStage || 1;
                return (
                  <tr key={app.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#B8960C]">{app.regNum || "—"}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <p className="text-[#3D2B1F] font-medium">
                          {app.groom} &amp; {app.bride}
                        </p>
                        {app.isReregistration && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-bold uppercase tracking-wide">
                            🔄 Daftar Ulang
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {stageNum === 99 ? (
                        <span className="inline-flex px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-[#FDECEA] text-[#C0392B] border border-[#C0392B]/20">
                          Dibatalkan
                        </span>
                      ) : (
                        <span
                          className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                            STAGE_COLORS[stageNum - 1]
                          }`}
                        >
                          Tahap {stageNum}: {STAGE_NAMES[stageNum - 1]}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#6B6560]">
                      {app.weddingDate
                        ? new Date(app.weddingDate).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Belum ditentukan"}
                    </td>
                    <td className="px-6 py-4 text-[#6B6560]">
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/pernikahan/${app.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#B8960C] rounded-md text-xs font-bold text-[#B8960C] hover:bg-[#FFF8E1] transition-colors"
                      >
                        Kelola <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#6B6560]">
                    {apps.length === 0
                      ? "Belum ada data pendaftaran pernikahan."
                      : `Tidak ada hasil untuk pencarian "${search}" dengan filter tahap ini.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-[#EDE8DF] bg-[#FAF7F2] text-xs text-[#6B6560]">
          Menampilkan {filtered.length} dari {apps.length} data
        </div>
      </div>
    </>
  );
}
