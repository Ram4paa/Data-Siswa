require('dotenv').config();

console.log("TEST ENV:", process.env.SESSION_SECRET);

const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./database/db.js");

// hubungkan ke mongo
const usnApi = require("./ke_db/usn.js");
const sswApi = require("./ke_db/ssw.js");
const dashApi = require("./ke_db/dash.js");
const jrsnApi = require("./ke_db/jrsn.js");
const klsApi = require("./ke_db/kls.js");
const prgrmkApi = require("./ke_db/prgrmk.js");

// scehma db struktur mongodb
const User = require("./isi_db/user.js");
const Siswa = require("./isi_db/dtsiswa.js");
const Jurusan = require("./isi_db/jurusan.js");
const Kelas = require("./isi_db/kelas.js");
const ProgramKeahlian = require("./isi_db/pkeahlian.js");
const app = express();
connectDB();

// middleware (terima data json, form dan request fronend)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static folder buat akses file dari folder
app.use("/login", express.static(path.join(__dirname, "../login")));
app.use("/dashboard", express.static(path.join(__dirname, "../dashboard")));
app.use("/data_siswa", express.static(path.join(__dirname, "../data_siswa")));
app.use("/input", express.static(path.join(__dirname, "../input")));
app.use("/sidebar", express.static(path.join(__dirname, "../sidebar")));
app.use("/carousel", express.static(path.join(__dirname, "../carousel")));
app.use("/img", express.static(path.join(__dirname, "../data_siswa/img")));

// akses ejs
app.set("views", [
    path.join(__dirname, "../login"),
    path.join(__dirname, "../dashboard"),
    path.join(__dirname, "../data_siswa"),
    path.join(__dirname, "../input"),
    path.join(__dirname, "../sidebar"),
    path.join(__dirname, "../carousel")
]);
app.set("view engine", "ejs");

// api
app.use("/api", usnApi);
app.use("/api", sswApi);
app.use("/api", dashApi);
app.use("/api", jrsnApi);
app.use("/api", klsApi);
app.use("/api", prgrmkApi);

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/dashboard", async (req, res) => {
    try {
        const jurusans = await Jurusan.find();
        res.render("dashboard", { 
            listlogo: jurusans 
        });
    } catch (error) {
        console.error("Error dashboard:", error);
        res.status(500).send("Terjadi kesalahan saat memuat dashboard");
    }
});

app.get("/data_siswa", async (req, res) => {
    try {
        const programs = await ProgramKeahlian.find();
        const jurusans = await Jurusan.find();
        const { jurusan, kelas } = req.query;

        res.render("datasiswa", {
            active: 'datasiswa',
            programsemua: programs,      // Sesuaikan dengan source 1
            jurusansemua: jurusans,      // Sesuaikan dengan source 4
            pilihJurusan: req.query.jurusan || "",
            pilihKelas: req.query.kelas || ""
        });
    } catch (error) {
        console.error("Error data_siswa:", error);
        res.status(500).send("Terjadi kesalahan server");
    }
});

app.get('/tjurusan', (req, res) => {
    res.render('tjurusan/tjurusan', { active: 'jurusan' });
});

app.get('/tkelas', (req, res) => {
    const message = req.query.message || '';
    res.render('tkelas/tkelas', { active: 'kelas', message });
});

app.get("/input", async (req, res) => {
    try {
        const { id, jurusan, kelas } = req.query;

        // id ada, berarti lagi edit dtsiswa
        if (id) {
            const siswa = await Siswa.findById(id);
            return res.render("index", {
                siswa: siswa,
                fromJurusan: jurusan || "",
                fromKelas: kelas || ""
            });
        }

        res.render("index", {
            siswa: null,
            fromJurusan: jurusan || "",
            fromKelas: kelas || ""
        });
    } catch (error) {
        console.error("Error rute input:", error);
        res.status(500).send("Terjadi kesalahan server");
    }
});

// redirect root ke /login supaya "Cannot GET /" tidak muncul
app.get("/", (req, res) => {
    return res.redirect("/login");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});