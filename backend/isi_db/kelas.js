const mongoose = require("mongoose");

const KelasSchema = new mongoose.Schema({
    jurusan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jurusan"
    },
    programkeahlian: String,
    tingkat: String,
    rombel: String
});

KelasSchema.index({ jurusan: 1, tingkat: 1, rombel: 1 }, { unique: true });

module.exports = mongoose.model("Kelas", KelasSchema);