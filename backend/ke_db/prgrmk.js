const path = require("path");
const express = require("express");
const router = express.Router();
const multer = require('multer');
const programkeahlian = require("../isi_db/pkeahlian");
const Jurusan = require('../isi_db/jurusan');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const targetPath = path.join(__dirname, "../../data_siswa/img");
        cb(null, targetPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get("/programkeahlian", async (req, res) => {
    const data = await programkeahlian.find();
    res.json(data);
});

router.get('/jurusan', async (req, res) => {
    try {
        const data = await Jurusan.find();
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Gagal ambil data jurusan");
    }
});

router.post('/jurusan', upload.single('logo'), async (req, res) => {
    try {
        const { nama, programkeahlian, warna } = req.body;
        const logo = req.file ? req.file.filename : null;

        await Jurusan.create({
            nama,
            warna,
            logo,
            programkeahlian
        });

        res.redirect('/data_siswa');

    } catch (err) {
        console.log("Error Simpan:", err);
        res.status(500).send("Terjadi error saat menyimpan data");
    }
});

module.exports = router;