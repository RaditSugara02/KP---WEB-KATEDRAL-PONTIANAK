import { db } from "./lib/db";
import { contents } from "./lib/db/schema";
import { nanoid } from "nanoid";

async function main() {
  try {
    console.log("Menambahkan data dummy berita...");
    
    const dummyNews = [];
    
    // 11 Berita dengan Kategori "Berita Paroki"
    for (let i = 1; i <= 11; i++) {
      dummyNews.push({
        id: nanoid(),
        type: "NEWS",
        category: "Berita Paroki",
        title: `Berita Paroki ke-${i} Seputar Kegiatan Umat`,
        slug: `berita-paroki-${i}-${nanoid(4)}`,
        body: `Ini adalah deskripsi atau isi konten berita paroki ke-${i}. Kegiatan umat minggu lalu sangat meriah dan diikuti oleh banyak warga dari berbagai lingkungan.`,
        isPublished: true,
        createdAt: new Date(Date.now() - i * 86400000), // Mundur i hari
        updatedAt: new Date(),
      });
    }

    // 12 Berita dengan Kategori "Pengumuman"
    for (let i = 1; i <= 12; i++) {
      dummyNews.push({
        id: nanoid(),
        type: "NEWS",
        category: "Pengumuman",
        title: `Pengumuman Penting Katedral ke-${i}`,
        slug: `pengumuman-${i}-${nanoid(4)}`,
        body: `Ini adalah deskripsi pengumuman ke-${i}. Mohon perhatian seluruh umat bahwa jadwal ibadat selama masa pra-paskah akan mengalami penyesuaian.`,
        isPublished: true,
        createdAt: new Date(Date.now() - (i+5) * 86400000), // Mundur i+5 hari
        updatedAt: new Date(),
      });
    }

    await db.insert(contents).values(dummyNews);
    
    console.log(`Sukses menambahkan ${dummyNews.length} data dummy.`);
  } catch (e) {
    console.error("Error:", e);
  }
  process.exit(0);
}

main();
