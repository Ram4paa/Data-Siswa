const jurusanList = document.getElementById("jurusanList");
const detailPanel = document.getElementById("detailPanel");
const activeCard = document.getElementById("activeCard");

const kelasPanel = document.getElementById("kelasPanel");

const dataSection = document.getElementById("dataSection");
const tabelBody = document.getElementById("tabelBody");

const searchInput = document.getElementById("searchInput");

let posisiScrollTerakhir = 0;

searchInput.addEventListener("input", function () {
    const keyword = this.value.toLowerCase().trim();
    const rows = document.querySelectorAll(".siswa-row, #tabelBody tr");

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(keyword) ? "" : "none";
    });
});

async function handleClick(card) {
    posisiScrollTerakhir = window.scrollY;
    const { jurusanId, warna } = card.dataset;

    // semua jurusan disembunyikan dulu
    jurusanList.classList.add("hidden");
    detailPanel.classList.remove("hidden");
    
    // tampilkan search wrapper (yang sekarang berisi judul + panel kelas)
    const searchWrapper = document.getElementById("searchWrapper");
    searchWrapper.classList.remove("hidden");

    // kloning kartu untuk tampilan detail atas
    activeCard.innerHTML = "";
    const clone = card.cloneNode(true);
    clone.classList.add("active");
    // hapus tombol hapus di dalam kloningan detail agar tidak double
    const btnHapus = clone.querySelector('.btn-hapus-jurusan');
    if(btnHapus) btnHapus.remove();
    activeCard.appendChild(clone);

    // // panggil fungsi dari p_kls untuk isi tombol kls
    if (typeof loadKelasByJurusan === "function") {
        loadKelasByJurusan(jurusanId, warna);
    }

    setTimeout(() => {
        if (typeof inisialisasiAnimasiKls === "function") {
            inisialisasiAnimasiKls();
        }
    }, 100);
}

function kembali() {
    // munculkan jurusan lagi
    jurusanList.classList.remove("hidden");
    
    // sembunyikan detail panel dan search wrapper
    detailPanel.classList.add("hidden");
    document.getElementById("searchWrapper").classList.add("hidden");
    dataSection.classList.remove("active");
    
    // reset teks breadcrumb
    document.getElementById("sub-breadcrumb").innerText = "";
    
    // kembalikan posisi scroll ke posisi terakhir sebelum klik kartu jurusan
    setTimeout(() => {
        window.scrollTo({
            top: posisiScrollTerakhir,
            behavior: 'instant' 
        });
    }, 10);

    // reset input pencarian
    searchInput.value = "";
}

async function tampilData(jurusanId, kelasId, warna) {
    tabelBody.innerHTML = "";

    // load sebentar
    tabelBody.innerHTML = `
    `
    tabelBody.innerHTML = `
    <tr>
        <td colspan="8" style="text-align:center">⏳ Memuat data...</td>
    </tr>`;

    dataSection.classList.add("active");

    const res = await fetch(`/api/siswa/list?jurusan=${jurusanId}&kelas=${kelasId}`);
    const data = await res.json();
    dataSection.querySelector("thead").style.background = warna;

    tabelBody.innerHTML = "";

    if (!data.length) {
        tabelBody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align:center">
                Data siswa belum tersedia
            </td>
        </tr>`;
        return;
    }

    data.forEach(s => {
        const tr = document.createElement("tr");
        tr.id = `row-${s._id}`;
        tr.classList.add("siswa-row");

        tr.innerHTML = `
        <td>${s.nis}</td>
        <td>${s.nisn}</td>
        <td>${s.nama}</td>
        <td>${s.jk}</td>
        <td>${s.lahir}</td>
        <td>${s.nohp}</td>
        <td>${s.alamat}</td>
        <td class="edithapus">
            <a href="/input?id=${s._id}&jurusan=${jurusanId}&kelas=${kelasId}" class="btn-edit">✏️</a>
            <button class="btn-hapus" onclick="tampilConfirm('${s._id}')">🗑</button>
        </td>
        `;

        tabelBody.appendChild(tr);
    });
}

let idYangAkanDihapus = null;

function tampilConfirm(id) {
    idYangAkanDihapus = id;
    tipeHapus = "siswa";
    document.getElementById("modalTitle").innerText = "Hapus Data Siswa?";
    document.getElementById("modalDesc").innerText = "Data yang dihapus tidak bisa dikembalikan.";
    document.getElementById("confirmHapus").classList.remove("hidden");
    document.getElementById("confirmHapus").style.display = "flex";
}

function tutupNotif() {
    const modal = document.getElementById("confirmHapus");
    modal.classList.add("hidden");
    modal.style.display = "none"

    idYangAkanDihapus = null;
    tipeHapus = "";
    document.getElementById("confirmHapus").classList.add("hidden");
    document.getElementById("confirmHapus").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    loadJurusan();

    document.getElementById("btnBatal").onclick = () => {
        tutupNotif();
    };

    document.getElementById("btnYa").onclick = async () => {
        try {
            // JIKA YANG MAU DIHAPUS ADALAH ROMBEL
            if (tipeHapus === "rombel") {
                const res = await fetch(`/api/kelas/${rombelIDTerpilih}`, { method: "DELETE" });
                if (res.ok) {
                    tampilToast("Rombel berhasil dihapus", "success");
                    loadKelasByJurusan(jurusanIDTerpilih, warnaTerpilih); 
                } else {
                    throw new Error();
                }

            } 
            // JIKA YANG MAU DIHAPUS ADALAH SISWA
            else if (tipeHapus === "siswa") {
                const res = await fetch(`/api/siswa/${idYangAkanDihapus}`, { method: "DELETE" });
                if (res.ok) {
                    document.getElementById(`row-${idYangAkanDihapus}`)?.remove();
                    tampilToast("Data siswa berhasil dihapus", "success");
                } else {
                    throw new Error();
                }
            }
        } catch (err) {
            tampilToast("Gagal menghapus data", "error");
        }

        tutupNotif();
    };
});

function tampilToast(pesan, tipe = "success") {
    const notif = document.createElement("div");
    notif.className = `toast ${tipe}`;
    notif.innerText = pesan;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.classList.add("hide");
    }, 2500);

    setTimeout(() => {
        notif.remove();
    }, 3000);
}

const jurusanContainer = document.getElementById("jurusanContainer");

function adjustColor(hex, percent) {
    let num = parseInt(hex.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;

    return "#" + (
        0x1000000 +
        (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 0 ? 0 : B) : 255)
    ).toString(16).slice(1);
}

function buatGradient(warna) {
    if (!warna || !warna.startsWith("#")) {
        console.warn("WARNA INVALID:", warna);
        return "linear-gradient(45deg, #999, #bbb)";
    }

    try {
        const gelap = adjustColor(warna, -20);
        const terang = adjustColor(warna, 20);
        return `linear-gradient(45deg, ${gelap}, ${terang})`;
    } catch (err) {
        console.error("GRADIENT ERROR:", warna, err);
        return "linear-gradient(45deg, #999, #bbb)";
    }
}

async function loadJurusan() {
    try {
        const res = await fetch("/api/jurusan");
        const data = await res.json();

        jurusanContainer.innerHTML = "";

        // jurusan dikelompokkan sesuai program keahlian
        const grouped = {};
        data.forEach(j => {
            if (!grouped[j.programkeahlian]) {
                grouped[j.programkeahlian] = [];
            }
            grouped[j.programkeahlian].push(j);
        });

        Object.keys(grouped).forEach((groupName, index) => {

            const groupDiv = document.createElement("div");
            groupDiv.className = "jurusan-group";
            groupDiv.setAttribute("data-aos", "fade-up");
            groupDiv.setAttribute("data-aos-delay", index * 100);

            groupDiv.innerHTML = `
                <div class="group-header">
                    <h2>${groupName}</h2>
                </div>
                <div class="card-row"></div>
            `;

            const cardRow = groupDiv.querySelector(".card-row");

            grouped[groupName].forEach((j, i) => {
                const card = document.createElement("div");
                card.className = "card";
                card.dataset.jurusanId = j._id;
                card.dataset.warna = j.warna;

                card.style.backgroundColor = j.warna;
                card.style.backgroundImage = buatGradient(j.warna);

                card.setAttribute("data-aos", "fade-up");
                card.setAttribute("data-aos-delay", i * 100);

                const warna = j.warna;

                card.style.background = j.warna;
                card.style.boxShadow = `0 10px 25px ${j.warna}55`;

                const logoPath = `/img/${j.logo || 'smk.png'}`;

                card.innerHTML = `
                <button class="btn-hapus-jurusan" onclick="confirmHapusJurusan(event, '${j._id}', '${j.nama}')">🗑</button>
                <img src="${logoPath}" onerror="this.src='/data_siswa/img/';">
                <span>${j.nama}</span>
                `;

                card.addEventListener("click", () => handleClick(card));

                cardRow.appendChild(card);
            });

            jurusanContainer.appendChild(groupDiv);
        });

    } catch (err) {
        jurusanContainer.innerHTML = "<p>Gagal load jurusan</p>";
        console.error(err);
    }
}

async function confirmHapusJurusan(event, id, nama) {
    event.stopPropagation(); // biar panel kelas tidak terbuka saat klik hapus
    
    if (confirm(`Yakin ingin hapus jurusan ${nama}? Semua data di dalamnya akan hilang.`)) {
        try {
            const res = await fetch(`/api/jurusan/${id}`, { method: "DELETE" });
            if (res.ok) {
                tampilToast("Jurusan berhasil dihapus", "success");
                loadJurusan(); 
            } else {
                throw new Error();
            }
        } catch (err) {
            tampilToast("Gagal menghapus", "error");
        }
    }
}