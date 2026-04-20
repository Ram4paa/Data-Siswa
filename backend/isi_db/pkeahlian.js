const mongoose = require("mongoose");

const programKeahlianSchema = new mongoose.Schema({
    programkeahlian: String
});

module.exports = mongoose.model("programKeahlian", programKeahlianSchema, "programkeahlian");