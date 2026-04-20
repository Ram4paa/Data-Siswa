const mongoose = require("mongoose");

const JurusanSchema = new mongoose.Schema({
    nama: String,
    warna: String,
    logo: String,
    programkeahlian: String
});

module.exports = mongoose.model("Jurusan", JurusanSchema);