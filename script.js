const cards = document.querySelectorAll(".card");
const jurusanList = document.getElementById("jurusanList");
const detailPanel = document.getElementById("detailPanel");
const activeCard = document.getElementById("activeCard");

const kelasPanel = document.getElementById("kelasPanel");
const kelasButtons = document.getElementById("kelasButtons");

const dataSection = document.getElementById("dataSection");
const tabelBody = document.getElementById("tabelBody");
const tableHead = document.querySelector("#dataSection thead");

/* ================= KLIK CARD JURUSAN ================= */

cards.forEach(card => {
    card.addEventListener("click", async () => {

        jurusanList.classList.add("hidden");
        detailPanel.classList.remove("hidden");

        // clone card aktif
        activeCard.innerHTML = "";
        const clone = card.cloneNode(true);
        clone.classList.add("active");
        activeCard.appendChild(clone);

        kelasButtons.innerHTML = "";
        dataSection.classList.remove("active");

        const jurusanId = card.dataset.jurusanId;
        const warna = card.dataset.warna;

        // ambil kelas dari backend
        const res = await fetch(
            `http://localhost:5000/api/kelas/${jurusanId}`
        );
        const kelasList = await res.json();

        kelasList.forEach((k, i) => {
            const btn = document.createElement("button");
            btn.className = "kelas-btn";
            btn.textContent = k.nama;
            btn.dataset.kelasId = k._id;

            btn.style.background = warna;
            btn.style.animationDelay = `${i * 0.1}s`;

            btn.addEventListener("click", () => {
                tampilData(jurusanId, k._id, warna);
            });

            kelasButtons.appendChild(btn);
        });

        kelasPanel.classList.add("active");
    });
});

/* ================= DATA SISWA ================= */

async function tampilData(jurusanId, kelasId, warna) {
    dataSection.classList.add("active");
    tabelBody.innerHTML = "";
    tableHead.style.background = warna;

    const res = await fetch(
        `http://localhost:5000/api/siswa?jurusan=${jurusanId}&kelas=${kelasId}`
    );
    const data = await res.json();

    if (data.length === 0) {
        tabelBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center">
                    Data siswa belum tersedia
                </td>
            </tr>`;
        return;
    }

    data.forEach(s => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${s.nis}</td>
            <td>${s.nisn}</td>
            <td>${s.nama}</td>
            <td>${s.jk}</td>
            <td>${s.lahir}</td>
            <td>${s.nohp}</td>
            <td>${s.alamat}</td>
        `;
        tabelBody.appendChild(tr);
    });
}

/* ================= TOMBOL KEMBALI ================= */