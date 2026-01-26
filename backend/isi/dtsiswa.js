const mongoose = require("mongoose");

const SiswaSchema = new mongoose.Schema({
    nis: String,
    nisn: String,
    nama: String,
    jk: String,
    lahir: String,
    nohp: String,
    alamat: String,
    jurusan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jurusan"
    },
    kelas: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kelas"
    }
});

module.exports = mongoose.model("Siswa", SiswaSchema);
