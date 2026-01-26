const mongoose = require("mongoose");

const JurusanSchema = new mongoose.Schema({
    nama: String,
    warna: String,
    logo: String,
    kelompok: String // Teknik Elektronik, Broadcasting, dll
});

module.exports = mongoose.model("Jurusan", JurusanSchema);