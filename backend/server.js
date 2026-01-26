const express = require("express");
const cors = require("cors");
const connectDB = require("../database/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/jurusan", require("../routes/jr.routes"));
app.use("/api/kelas", require("../routes/kls.routes"));
app.use("/api/siswa", require("../routes/sw.routes"));

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
