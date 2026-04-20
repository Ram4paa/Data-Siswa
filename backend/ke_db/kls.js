const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Kelas = require("../isi_db/kelas");
const Siswa = require("../isi_db/dtsiswa");

router.get("/kelas/:jurusanId", async (req, res) => {
    console.log("GET /api/kelas/:jurusanId called");
    try {
        const { jurusanId } = req.params;
        const { tingkat } = req.query;

        console.log("jurusanId:", jurusanId, "tingkat:", tingkat);

        if (!jurusanId) {
            return res.status(400).json({
                message: "jurusanId tidak ditemukan"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(jurusanId)) {
            return res.status(400).json({ message: "jurusanId tidak valid" });
        }

        const query = { jurusan: jurusanId };
        if (tingkat) {
            query.tingkat = tingkat;
        }

        console.log("Query kelas:", query); // log untuk debug
        const data = await Kelas.find(query);
        res.json(data);
        console.log("Data kelas ditemukan:", data.length, "items"); // log jumlah data

    } catch (error) {
        console.error("ERROR ASLI:", error);

        return res.status(500).json({
            message: error.message 
        });
    }
});

router.get("/kelas/tingkat/:jurusanId", async (req, res) => {
    try {
        const data = await Kelas.distinct("tingkat", {
            jurusan: req.params.jurusanId
        });
        res.json(data);
    } catch {
        res.status(500).json({ error: "Gagal ambil tingkat" });
    }
});

//update kelas
router.post("/kelas", async (req, res) => {
    try {
        const { jurusan, programkeahlian, tingkat, rombel } = req.body;
        console.log("POST kelas data:", { jurusan, programkeahlian, tingkat, rombel }); // Log input

        if (!jurusan || !tingkat || !rombel) {
            console.log("Validasi gagal: field kosong");
            return res.redirect(`/tkelas?message=${encodeURIComponent('Lengkapi jurusan, tingkat, dan rombel.')}`);
        }

        const exists = await Kelas.findOne({ jurusan, tingkat, rombel });
        if (exists) {
            console.log("Duplikat ditemukan:", exists);
            return res.redirect(`/tkelas?message=${encodeURIComponent('Kombinasi jurusan, tingkat, dan rombel sudah ada.')}`);
        }

        const kelasBaru = new Kelas({
            jurusan,
            programkeahlian,
            tingkat,
            rombel
        });

        await kelasBaru.save();
        console.log("Kelas baru disimpan:", kelasBaru);

        res.redirect(`/data_siswa?jurusan=${jurusan}&tingkat=${tingkat}`);

    } catch (error) {
        console.error("Gagal simpan kelas:", error);
        if (error.code === 11000) {
            return res.redirect(`/tkelas?message=${encodeURIComponent('Duplikat kelas: tingkat, jurusan, dan rombel harus unik.')}`);
        }
        res.status(500).send("Terjadi kesalahan. Periksa kembali data yang Anda masukkan.");
    }
});

// hapus rombel
router.delete('/kelas/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Menghapus rombel dengan ID:", id); // Tambahkan log ini untuk debug

        // hpus kelas
        const hapusKelas = await Kelas.findByIdAndDelete(id);
        
        if (!hapusKelas) {
            return res.status(404).json({ message: "Rombel tidak ditemukan di database" });
        }

        // hapus siswa yang ada di kelas
        const Siswa = require("../isi_db/dtsiswa.js"); // Pastikan model siswa diimport jika belum
        await Siswa.deleteMany({ kelas: id });

        res.status(200).json({ message: "Berhasil dihapus" });
    } catch (error) {
        console.error("Error Hapus:", error);
        res.status(500).json({ message: "Gagal menghapus server error" });
    }
});

module.exports = router;