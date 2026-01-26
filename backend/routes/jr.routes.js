const express = require("express");
const router = express.Router();
const Jurusan = require("../isi/jurusan");

// GET semua jurusan
router.get("/", async (req, res) => {
    const data = await Jurusan.find();
    res.json(data);
});

module.exports = router;