const mongoose = require("mongoose");

const SiswaSchema = new mongoose.Schema({
    nis: { type: String, unique: true },
    nisn: { type: String, unique: true },
    nama: { type: String, required: true },
    jk: { type: String, required: true },
    lahir: String,
    nohp: { type: String, required: true },
    alamat: String,
    jurusan: { type: mongoose.Schema.Types.ObjectId, ref: "Jurusan" },
    kelas: { type: mongoose.Schema.Types.ObjectId, ref: "Kelas" }
});

module.exports = mongoose.model("Siswa", SiswaSchema);