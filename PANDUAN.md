# Panduan: Surat Masuk + SITAP di GitHub Pages

Isi paket:

| Folder / file | Tujuan |
|---|---|
| `siap-upload-github/` | **Unggah isi folder ini ke GitHub** (index.html, perjadin.html, config.js, api-shim.js, .nojekyll) |
| `apps-script/Code.gs` | **Ganti isi Code.gs lama** di Apps Script (sudah ditambah gateway API) |

Data tetap di Google Spreadsheet + Drive Anda. GitHub hanya menyimpan tampilan.

## A. Apps Script (lakukan dulu)

1. Buka project Apps Script lama → buka `Code.gs` → hapus semua isinya → tempel isi `apps-script/Code.gs` dari paket ini → Simpan.
   - `SPREADSHEET_ID`, `FOLDER_ID`, dan `TOKEN_INTEGRASI` di bagian atas sudah ikut dari file Anda (tidak berubah).
   - File `Index.html` dan `Perjadin.html` di Apps Script boleh dibiarkan, tidak dipakai lagi.
2. Deploy → **Manage deployments** → ikon pensil pada deployment Web app → Version: **New version** → Deploy.
   (Jika belum pernah deploy: Deploy → New deployment → Web app.)
   - Execute as: **Me**
   - Who has access: **Anyone**
3. Salin **Web app URL** yang berakhiran `/exec`.
4. (Sekali saja) Jalankan fungsi `setupKonfigurasiAwal` dari editor jika belum pernah.
5. Cek: buka URL `/exec` di browser → harus tampil teks JSON `{"ok":true,...}`.

## B. GitHub

1. Buat repository baru (mis. `sitap-mubar`).
2. Buka `siap-upload-github/config.js`, ganti `ISI_ID_DEPLOYMENT_ANDA` dengan URL `/exec` dari langkah A3 (seluruh URL).
3. Unggah semua file dari `siap-upload-github/` ke root repository (Add file → Upload files). Pastikan `.nojekyll` ikut (file tersembunyi; jika sulit, buat file kosong bernama `.nojekyll` lewat Add file → Create new file).
4. Settings → Pages → Source: **Deploy from a branch** → Branch `main` / `(root)` → Save.
5. Tunggu 1–2 menit. Alamat:
   - Surat Masuk: `https://USERNAME.github.io/NAMA-REPO/`
   - SITAP: `https://USERNAME.github.io/NAMA-REPO/perjadin.html`

## C. Uji

1. Buka alamat Surat Masuk → login.
2. Klik menu **Perjalanan Dinas / Buka SITAP** → SITAP terbuka di tab baru, langsung masuk (tiket SSO).
3. Di SITAP, tombol **Ke Beranda** kembali ke Surat Masuk.

## Jika bermasalah

| Gejala | Penyebab / solusi |
|---|---|
| Pesan "API_URL di config.js belum diisi" | Edit `config.js` (langkah B2) |
| "Respons server tidak valid" | Deployment belum **Anyone** / belum **New version** setelah mengganti Code.gs |
| "Fungsi tidak dikenal: xxx" | Fungsi itu tidak ada di daftar `API_PUBLIK_` di Code.gs; tambahkan namanya di sana lalu deploy versi baru |
| Halaman kosong | Tekan F12 → Console, lihat pesan merah |
| Perubahan Code.gs tidak terasa | Setiap ubah Code.gs wajib Manage deployments → New version |

## Catatan keamanan

- Repo publik = kode tampilan bisa dibaca orang. Data, ID Spreadsheet/Folder, dan `TOKEN_INTEGRASI` ada di Code.gs (di Google), bukan di GitHub.
- Jangan menaruh password/token apa pun di `config.js`; isinya hanya URL API.
- Gateway hanya mengizinkan fungsi yang dipakai tampilan; fungsi setup, diagnosa, dan penerima surat antar-OPD tidak bisa dipanggil lewat gateway.
