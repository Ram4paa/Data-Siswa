const mongoose = require("mongoose");

const KelasSchema = new mongoose.Schema({
    nama: String,
    jurusan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jurusan"
    }
});

module.exports = mongoose.model("Kelas", KelasSchema);