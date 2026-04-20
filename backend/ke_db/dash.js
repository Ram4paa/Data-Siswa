const express = require("express");
const router = express.Router();
const Jurusan = require("../isi_db/jurusan");
const Kelas = require("../isi_db/kelas");
const Siswa = require("../isi_db/dtsiswa");

// buat singkat jurusna, jadi ambil huruf kpital dan menghilngkn tanda selain huruf
function singkatJurusan(nama) {
    const skip = ["dan", "di", "ke", "dari"];

    return nama
        .replace(/[^A-Za-z\s]/g, "") // hapus karakter selain huruf dan spasi
        .split(" ")
        .filter(kata => {
            const lower = kata.toLowerCase();
            return kata && !skip.includes(lower);
        })
        .map(kata => kata[0])
        .join("")
        .toUpperCase();
}

router.get("/dash_api", async (req, res) => {
    try {
        const jurusan = await Jurusan.find();
        const result = [];

        for (const j of jurusan) {
            const kelas = await Kelas.find({ jurusan: j._id });

            let totalSiswa = 0;
            const kelasData = [];

            for (const k of kelas) {
                const jumlah = await Siswa.countDocuments({ kelas: k._id });
                totalSiswa += jumlah;

                kelasData.push({
                    nama: `${k.tingkat} ${singkatJurusan(j.nama)} ${k.rombel}`,
                    tingkat: k.tingkat,
                    total: jumlah
                });
            }

            result.push({
                jurusan: j.nama,
                warna: j.warna,
                logo: j.logo,
                kelas: kelasData,
                totalSiswa
            });
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;