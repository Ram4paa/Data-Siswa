const express = require("express");
const router = express.Router();
const Kelas = require("../isi/kelas");

// GET kelas per jurusan
router.get("/:jurusanId", async (req, res) => {
    const data = await Kelas.find({ jurusan: req.params.jurusanId });
    res.json(data);
});

module.exports = router;