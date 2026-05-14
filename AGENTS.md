<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:vibe-coding-workflow -->
# Vibe Coding Workflow
1. **Lokal Pertama**: Setiap perubahan kode WAJIB dijalankan dan diuji di lokal (`npm run dev`) sebelum di-push ke GitHub.
2. **Verifikasi User**: Setelah kode diubah, Agen AI harus menunggu konfirmasi dari User bahwa kode tersebut berjalan dengan baik di komputer lokal tanpa error.
3. **Push ke Vercel**: Hanya setelah User mengonfirmasi sukses, kode boleh di-commit dan di-push ke GitHub untuk memicu otomatisasi *deploy* di Vercel.
<!-- END:vibe-coding-workflow -->
