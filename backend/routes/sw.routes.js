const express = require("express");
const router = express.Router();
const Siswa = require("../isi/dtsiswa");

router.get("/", async (req, res) => {
    const { jurusan, kelas } = req.query;

    try {
        const siswa = await Siswa.find({
            jurusan,
            kelas
        });

        res.json(siswa);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;