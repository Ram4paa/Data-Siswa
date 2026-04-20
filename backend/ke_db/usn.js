const express = require("express");
const router = express.Router();
const User = require("../isi_db/user");

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("Data diterima untuk Register:", req.body);

        const userBaru = new User({ username, email, password });
        await userBaru.save();

        console.log("Data BERHASIL disimpan ke Database");
        res.status(200).json({ success: true, message: "Berhasil simpan" });
    } catch (err) {
        console.error("Gagal simpan:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            console.log("Login Gagal: User tidak ditemukan");
            return res.status(401).json({ success: false, message: "Username/Password Salah" });
        }

        // cek password pakai method schema
        const cocok = await user.comparePassword(password);
        if (!cocok) {
            console.log("Login Gagal: Password salah");
            return res.status(401).json({ success: false, message: "Username/Password Salah" });
        }

        console.log("Login Berhasil untuk:", username);
        res.status(200).json({ success: true });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;