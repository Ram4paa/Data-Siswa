const express = require("express");
const router = express.Router();
const Siswa = require("../isi_db/dtsiswa.js");

// simpan siswa, bisa edit dan tambah
router.post("/siswa", async (req, res) => {
    try {
        const { id, nis, nisn, nama, jk, lahir, nohp, alamat, jurusan, kelas, fromJurusan, fromKelas } = req.body;

        if (id) {
            // edit
            await Siswa.findByIdAndUpdate(id, {
                nis, nisn, nama, jk, lahir, nohp, alamat, 
                jurusan, 
                kelas    
            });
        } else {
            // dt baru
            const siswaBaru = new Siswa({
                nis, nisn, nama, jk, lahir, nohp, alamat, jurusan, kelas
            });
            await siswaBaru.save();
        }

        res.redirect(`/data_siswa?jurusan=${fromJurusan || jurusan}&kelas=${fromKelas || kelas}`);

    } catch (err) {
        console.error("Gagal simpan siswa:", err);
        res.status(500).send("Terjadi kesalahan. Periksa kembali data yang Anda masukkan.");
    }
});

// hapus
router.delete("/siswa/:id", async (req, res) => {
    try {
        const hapus = await Siswa.findByIdAndDelete(req.params.id);
        
        if (hapus) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: "Data tidak ditemukan" });
        }
    } catch (err) {
        console.error("Error Hapus:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// siswa berdasarkan kls dn jurusan
router.get("/siswa/list", async (req, res) => {
    try {
        const { jurusan, kelas } = req.query;
        const data = await Siswa.find({ jurusan, kelas });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;