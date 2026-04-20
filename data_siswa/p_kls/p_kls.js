let rombelIDTerpilih = null;
let jurusanIDTerpilih = null;
let warnaTerpilih = null;
let tipeHapus = "";

function formatKelas(kelas) {
    // singkat jurusan
    let namaSingkat = kelas.jurusan.nama;
    if (namaSingkat.includes("Sistem Informasi")) namaSingkat = "SIJA";
    
    return `${kelas.tingkat} ${namaSingkat} ${kelas.rombel}`;
}

async function loadKelasByJurusan(jurusanId, warna) {
    const container = document.getElementById("kelasButtons");
    
    // ambil tingkat yang sedang dipilih (X / XI / XII)
    const tingkatAktif = document.querySelector(".tingkat-item.active").dataset.tingkat;
    
    container.innerHTML = "<p>Loading...</p>";

    try {
        // fetch ke API backend 
        const res = await fetch(`/api/kelas/${jurusanId}?tingkat=${tingkatAktif}`);
        const data = await res.json();

        container.innerHTML = ""; 

        if (data.length === 0) {
            container.innerHTML = `<p style="color: #94a3b8;">Tidak ada kelas di tingkat ${tingkatAktif}</p>`;
            return;
        }

        data.forEach(kls => {
            const btnWrapper = document.createElement("div");
            btnWrapper.style.position = "relative";
            
            const btn = document.createElement("button");
            btn.className = "kelas-btn";
            
            // field rombel yang ditampilkan di tombol (A, B)
            btn.innerText = kls.rombel;

            btn.dataset.id = kls._id;
            
            // tombol hapus rombel
            const delBtn = document.createElement("button");
            delBtn.innerHTML = "×";
            delBtn.className = "btn-hapus-rombel";
            delBtn.onclick = (e) => {
                e.stopPropagation();
                confirmHapusRombel(kls._id, kls.rombel, jurusanId, warna);
                document.getElementById("fullLayar").classList.remove("hidden");
            };

            btn.onclick = () => {
                document.querySelectorAll(".kelas-btn").forEach(b => b.classList.remove("active-btn"));
                btn.classList.add("active-btn");
                // panggil fungsi tampilkan tabel siswa di script.js
                tampilData(jurusanId, kls._id, warna);
            };

            btnWrapper.appendChild(btn);
            btnWrapper.appendChild(delBtn);
            container.appendChild(btnWrapper);
        });
    } catch (err) {
        console.error("Gagal ambil kelas:", err);
        container.innerHTML = "<p>Gagal memuat data.</p>";
    }
}

async function confirmHapusRombel(id, nama, jurusanId, warna) {
    // Isi variabel global (agar bisa dibaca saat klik tombol 'Ya' di script.js)
    idYangAkanDihapus = id; 
    rombelIDTerpilih = id;
    jurusanIDTerpilih = jurusanId;
    warnaTerpilih = warna;
    tipeHapus = "rombel";

    // update isi modal dengan data yang akan dihapus
    document.getElementById("modalTitle").innerText = `Hapus Rombel ${nama}?`;
    document.getElementById("modalDesc").innerText = "Seluruh data siswa di dalam rombel ini juga akan terhapus.";

    // tampilkan modal
    const modal = document.getElementById("confirmHapus");
    modal.classList.remove("hidden");
    modal.style.display = "flex";
}

// fungsi untuk tutup modal hapus
function tutupModalHapus() {
    const modal = document.getElementById("confirmHapus");
    modal.classList.add("hidden");
    modal.style.display = "none";
}

// Handler untuk klik pindah tingkat (X, XI, XII)
document.querySelectorAll(".tingkat-item").forEach(item => {
    item.addEventListener("click", function() {
        document.querySelectorAll(".tingkat-item").forEach(i => i.classList.remove("active"));
        this.classList.add("active");

        // ambil jurusan yang sedang dipilih
        const activeCard = document.querySelector("#activeCard .card");
        if (activeCard) {
            const jurusanId = activeCard.dataset.jurusanId;
            const warna = activeCard.dataset.warna;
            loadKelasByJurusan(jurusanId, warna);
        }
    });
});

function inisialisasiAnimasiKls() {
    const items = document.querySelectorAll(".tingkat-item");
    const indicator = document.querySelector(".active-indicator");

    if (!indicator || items.length === 0) return;

    function moveIndicator(el) {
        indicator.style.width = `${el.offsetWidth}px`;
        indicator.style.left = `${el.offsetLeft}px`;
    }

    // posisi awal
    const activeItem = document.querySelector(".tingkat-item.active");
    if (activeItem) moveIndicator(activeItem);

    items.forEach(item => {
        item.addEventListener("mouseenter", () => moveIndicator(item));

        item.addEventListener("click", function () {
            items.forEach(i => i.classList.remove("active"));
            this.classList.add("active");
            moveIndicator(this);
        });
    });

    const selection = document.querySelector(".tingkat-selection");
    if (selection) {
        selection.addEventListener("mouseleave", () => {
            const active = document.querySelector(".tingkat-item.active");
            if (active) moveIndicator(active);
        });
    }
}