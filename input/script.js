const jurusanSelect = document.getElementById("jurusanSelect");
const kelasSelect = document.getElementById("kelasSelect");
const tingkatSelect = document.getElementById("tingkatSelect");

// untuk mode edit (optional)
const currentJurusan = window.selectedJurusan || "";
const currentKelas = window.selectedKelas || "";

if (jurusanSelect) {
    jurusanSelect.addEventListener("change", async () => {
        const jurusanId = jurusanSelect.value;

        await loadTingkat(jurusanId);
        kelasSelect.innerHTML = `<option value="">Rombel</option>`;
        kelasSelect.disabled = true;
    });
}

if (tingkatSelect) {
    tingkatSelect.addEventListener("change", loadKelasDropdown);
}

async function loadJurusan() {
    if (!jurusanSelect) return;
    try {
        jurusanSelect.innerHTML = `<option value="">Jurusan</option>`;

        const res = await fetch("/api/jurusan");
        const data = await res.json();
        data.forEach(j => {
            const opt = document.createElement("option");
            opt.value = j._id;
            opt.textContent = j.nama;

            if (j._id === currentJurusan) {
                opt.selected = true;
            }
            jurusanSelect.appendChild(opt);
        });

    } catch (error) {
        console.error("Error Load Jurusan:", error);
    }
}

async function loadTingkat(jurusanId) {
    tingkatSelect.innerHTML = `<option value="">Tingkat</option>`;

    if (!jurusanId) return;

    try {
        const res = await fetch(`/api/kelas/tingkat/${jurusanId}`);
        const data = await res.json();

        data.forEach(t => {
            const opt = document.createElement("option");
            opt.value = t;
            opt.textContent = t;
            tingkatSelect.appendChild(opt);
        });

    } catch (err) {
        console.error("Gagal load tingkat:", err);
    }
}

async function loadKelasDropdown(selectedKelasId = "") {
    const jurusan = jurusanSelect.value;
    const tingkat = tingkatSelect.value;

    kelasSelect.innerHTML = `<option value="">Rombel</option>`;
    if (!jurusan || !tingkat) {
        kelasSelect.disabled = true;
        return;
    }

    try {
        const res = await fetch(`/api/kelas/${jurusan}?tingkat=${tingkat}`);
        const data = await res.json();
        
        // kalau kosong
        if (data.length === 0) {
            const opt = document.createElement("option");
            opt.textContent = "Tidak ada rombel";
            opt.disabled = true;
            kelasSelect.appendChild(opt);
            kelasSelect.disabled = false;
            return;
        }

        data.forEach(kls => {
            const option = document.createElement("option");
            option.value = kls._id;
            option.textContent = kls.rombel;

            if (kls._id === selectedKelasId) {
                option.selected = true;
            }

            kelasSelect.appendChild(option);
        });

        kelasSelect.disabled = false;

    } catch (err) {
        console.error("Gagal load kelas:", err);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadJurusan();

    // edit mode
    if (currentJurusan) {
        await loadTingkat(currentJurusan);

        if (currentKelas) {
            await loadKelasDropdown(currentKelas);
        }
    }
});