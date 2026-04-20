console.log("DASHBOARD JS LOADED");

const initDashboard = async () => {
    try {
        const res = await fetch("/api/dash_api");
        if (!res.ok) throw new Error("Gagal mengambil data");

        const data = await res.json();
        console.log("DATA RECEIVED:", data);

        renderDashboard(data);
    } catch (err) {
        console.error("FETCH ERROR:", err);

        document.getElementById("dashboardContainer").innerHTML =
            `<p style="color:red">Gagal memuat data dashboard.</p>`;
    }
};

function renderDashboard(data) {
    const container = document.getElementById("dashboardContainer");

    // ambil elemen modal dan kontennya
    const modal = document.getElementById("jurusanModal");
    const modalContent = modal.querySelector(".modal-content");
    const modalBody = document.getElementById("modalBody");
    const modalTitle = document.getElementById("modalTitle");
    const closeBtn = document.querySelector(".close-modal");

    container.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "jurusan-grid";

    data.forEach((j) => {
        const box = document.createElement("div");
        box.className = "jurusan-box";

        // set warna untuk kartu utama
        if (j.warna) box.style.setProperty("--accent", j.warna);

        box.style.borderRadius = "14px";
        box.style.overflow = "hidden";

        const logoPath = j.logo ? '/data_siswa/img/' + j.logo : '/data_siswa/img/smk.png';

        box.innerHTML = `
        <div class="jurusan-box-inner">
            <div class="jurusan-header">
                <h3 class="jurusan-title">${j.jurusan}</h3>
                <img class="jurusan-logo" src="${logoPath}" 
                    onerror="this.src='/data_siswa/img/smk.png'" alt="Logo">
            </div>
        </div>
        `;

        // klik buka modal
        box.onclick = () => {
            if (j.warna) {
                modalContent.style.setProperty("--accent", j.warna);
            }
            modalTitle.textContent = j.jurusan;

            // grouping berdasarkan tingkat
            const grouped = {};

            j.kelas.forEach(k => {
                const tingkat = k.tingkat;
                if (!grouped[tingkat]) grouped[tingkat] = [];
                grouped[tingkat].push(k);
            });

            // bikin dropdown HTML
            const kelasHTML = ["X", "XI", "XII"].map(tingkat => {
                if (!grouped[tingkat]) return "";

                const items = grouped[tingkat].map(k => `
                    <p class="kelas-item">
                    <span>${k.nama}</span>
                    <span>${k.total} siswa</span>
                    </p>
                `).join("");

                return `
                <div class="dropdown">
                    <div class="dropdown-header" onclick="toggleDropdown(this)">
                    <span>${tingkat}</span>
                    <span class="arrow">›</span>
                </div>
                <div class="dropdown-body">
                    ${items}
                </div>
                </div>
                `;
            }).join("");

            modalBody.innerHTML = `
                <div class="modal-list">
                    ${kelasHTML}
                </div>

                <hr style="border: 0; border-top: 2px solid #f1f5f9; margin: 15px 0;">

                <div class="total-footer">
                    <p style="display:flex; justify-content:space-between; margin:0;">
                        <span>Total Keseluruhan</span> 
                        <span>${j.totalSiswa} Siswa</span>
                    </p>
                </div>
            `;

            modal.style.display = "flex";
        };

        grid.appendChild(box);
    });

    container.appendChild(grid);

    // fungsi tutup modal
    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    };
}

initDashboard();

// animasi tulisan
const textElement = document.getElementById("typing-text");
const phrases = ["cepat.", "aman.", "terstruktur.", "mudah."];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    if (!textElement) return;
    const currentPhrase = phrases[phraseIndex];

    textElement.textContent = isDeleting
        ? currentPhrase.substring(0, charIndex - 1)
        : currentPhrase.substring(0, charIndex + 1);

    charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

document.addEventListener("DOMContentLoaded", type);

function toggleDropdown(el) {
    const allDropdowns = document.querySelectorAll(".dropdown");

    allDropdowns.forEach(d => {
        if (d !== el.parentElement) {
            d.classList.remove("active");
            d.querySelector(".dropdown-body").classList.remove("show");
        }
    });

    const parent = el.parentElement;
    const body = el.nextElementSibling;

    parent.classList.toggle("active");
    body.classList.toggle("show");
}