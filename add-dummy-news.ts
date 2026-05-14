import { db } from "./lib/db";
import { contents } from "./lib/db/schema";
import { nanoid } from "nanoid";

async function main() {
  try {
    console.log("Menambahkan 5 data berita utama...");

    const dummyNews = [
      {
        id: nanoid(),
        type: "NEWS",
        category: "Berita Paroki",
        title: "Perayaan Ekaristi Misa Malam Paskah di Katedral Santo Yosef Berlangsung Khusyuk",
        slug: `misa-malam-paskah-${nanoid(4)}`,
        body: `Ribuan umat Katolik memadati Gereja Katedral Santo Yosef Pontianak untuk mengikuti Perayaan Ekaristi Malam Paskah. Misa yang dipimpin langsung oleh Uskup Agung ini berlangsung dengan penuh hikmat dan sukacita. Dalam homilinya, Uskup mengajak seluruh umat untuk bangkit bersama Kristus dan menjadi terang bagi sesama di tengah tantangan zaman saat ini. Rangkaian ibadat diawali dengan upacara cahaya di pelataran gereja, di mana lilin Paskah dinyalakan sebagai simbol Kristus yang bangkit mengalahkan kegelapan.`,
        imageUrl: "https://images.unsplash.com/photo-1548625361-ecb18361717c?auto=format&fit=crop&q=80&w=1200",
        isPublished: true,
        createdAt: new Date(Date.now() - 1 * 86400000), // 1 hari lalu
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        type: "NEWS",
        category: "Pengumuman",
        title: "Pendaftaran Komuni Pertama Tahun 2026 Resmi Dibuka",
        slug: `pendaftaran-komuni-pertama-${nanoid(4)}`,
        body: `Diberitahukan kepada seluruh umat Paroki Katedral Santo Yosef bahwa pendaftaran persiapan penerimaan Sakramen Mahakudus (Komuni Pertama) untuk anak-anak telah dibuka. Persyaratan utama adalah anak telah dibaptis secara Katolik dan minimal duduk di bangku kelas 4 SD. Orang tua dapat mengambil formulir pendaftaran di sekretariat paroki pada jam kerja. Harap melampirkan fotokopi surat baptis anak dan fotokopi Kartu Keluarga Katolik. Pertemuan perdana orang tua akan diadakan pada awal bulan depan.`,
        imageUrl: "https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=1200",
        isPublished: true,
        createdAt: new Date(Date.now() - 3 * 86400000), // 3 hari lalu
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        type: "NEWS",
        category: "Berita Paroki",
        title: "Uskup Agung Pontianak Menahbiskan 3 Imam Baru",
        slug: `tahbisan-imam-baru-${nanoid(4)}`,
        body: `Gereja Keuskupan Agung Pontianak bersukacita atas tahbisan tiga imam baru yang dilangsungkan di Katedral Santo Yosef. Misa tahbisan suci ini dihadiri oleh ratusan imam, biarawan-biarawati, serta umat dari berbagai paroki asal para diakon. Ketiga imam baru tersebut berkomitmen untuk melayani umat dengan penuh kasih dan kesederhanaan. Setelah perayaan Ekaristi, acara dilanjutkan dengan ramah tamah singkat dan pemberian berkat perdana oleh para imam baru kepada keluarga dan umat yang hadir.`,
        imageUrl: "https://images.unsplash.com/photo-1550020475-1eb47b2c011e?auto=format&fit=crop&q=80&w=1200",
        isPublished: true,
        createdAt: new Date(Date.now() - 5 * 86400000), // 5 hari lalu
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        type: "NEWS",
        category: "Kegiatan Umat",
        title: "Kerja Bakti OMK Menjelang Hari Raya Natal",
        slug: `kerja-bakti-omk-${nanoid(4)}`,
        body: `Orang Muda Katolik (OMK) Paroki Katedral Santo Yosef menggelar kegiatan kerja bakti untuk mempersiapkan area gereja menyambut Hari Raya Natal. Puluhan anggota OMK bahu-membahu membersihkan halaman, merapikan taman, dan mulai memasang dekorasi Natal, termasuk kandang Natal tradisional di sudut halaman gereja. Kegiatan ini tidak hanya bertujuan untuk memperindah lingkungan gereja, tetapi juga sebagai wadah untuk mempererat tali persaudaraan antar kaum muda di paroki.`,
        imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=1200",
        isPublished: true,
        createdAt: new Date(Date.now() - 7 * 86400000), // 7 hari lalu
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        type: "NEWS",
        category: "Pengumuman",
        title: "Jadwal Pelayanan Sakramen Tobat Menjelang Pekan Suci",
        slug: `jadwal-sakramen-tobat-${nanoid(4)}`,
        body: `Dalam rangka mempersiapkan batin menyambut Paskah, Paroki Katedral Santo Yosef mengadakan pelayanan Sakramen Tobat massal. Pelayanan akan diberikan mulai hari Senin hingga Rabu dalam Pekan Suci, pukul 16.00 hingga 19.00 WIB. Beberapa pastor tamu dari paroki tetangga juga akan hadir untuk membantu pelayanan ini. Umat dihimbau untuk memanfaatkan kesempatan ini dengan baik dan mempersiapkan diri dengan pemeriksaan batin yang mendalam.`,
        imageUrl: "https://images.unsplash.com/photo-1601132049052-a5f1f9175d27?auto=format&fit=crop&q=80&w=1200",
        isPublished: true,
        createdAt: new Date(Date.now() - 10 * 86400000), // 10 hari lalu
        updatedAt: new Date(),
      }
    ];

    await db.insert(contents).values(dummyNews);
    
    console.log(`Sukses menambahkan ${dummyNews.length} data berita dummy.`);
  } catch (e) {
    console.error("Error:", e);
  }
  process.exit(0);
}

main();
