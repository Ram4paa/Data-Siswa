const path = require("path");
const express = require("express");
const router = express.Router();
const Jurusan = require("../isi_db/jurusan");
const multer = require("multer");

// ini multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const targetPath = path.join(__dirname, "../../data_siswa/img");
        cb(null, targetPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

// get
router.get("/jurusan", async (req, res) => {
    try {
        const program = req.query.program;

        const filter = program && program !== ""
            ? { programkeahlian: program }
            : {};

        const data = await Jurusan.find(filter);
        res.json(data);
    } catch (err) {
        console.error('Error ambil jurusan:', err);
        res.status(500).json({ message: 'Gagal mengambil jurusan' });
    }
});

router.post("/jurusan", upload.single("logo"), async (req, res) => {
    try {
        const { nama, programkeahlian, warna } = req.body;

        const dataBaru = new Jurusan({
            nama,
            programkeahlian,
            warna,
            logo: req.file ? req.file.filename : null
        });

        await dataBaru.save();
        res.redirect("/tjurusan");
    } catch (err) {
        console.error("Error menyimpan jurusan:", err);
        res.status(500).send("Terjadi kesalahan saat menyimpan jurusan.");
    }
});

// hapus
router.delete("/jurusan/:id", async (req, res) => {
    try {
        await Jurusan.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Jurusan berhasil dihapus" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal menghapus data");
    }
});

module.exports = router;