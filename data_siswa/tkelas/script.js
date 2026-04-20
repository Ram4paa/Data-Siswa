// Global Variables
const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const pageSize = 6;
let currentPage = 0;
let selectedValue = '';
let usedLetters = [];

// DOM Elements
const programSelect = document.getElementById('programkeahlianSelect');
const jurusanSelect = document.getElementById('jurusanSelect');
const tingkatSelect = document.getElementById('tingkatSelect');
const rombelInput = document.getElementById('rombelInput');
const dropdownTrigger = document.getElementById('dropdownTrigger');
const dropdownMenu = document.getElementById('dropdownMenu');
const rombelItems = document.getElementById('rombelItems');
const rombelError = document.getElementById('rombelError');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const pageLabel = document.getElementById('pageLabel');

function setDropdownExpanded(isExpanded) {
    if (dropdownTrigger) {
        dropdownTrigger.setAttribute('aria-expanded', String(isExpanded));
    }
}

// fungsi untuk ambil data program keahlian
async function fetchProgramKeahlian() {
    try {
        const res = await fetch('/api/programkeahlian');
        const data = await res.json();

        programSelect.innerHTML = '<option value="">Pilih Program Keahlian</option>';
        data.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.programkeahlian;
            opt.textContent = item.programkeahlian;
            programSelect.appendChild(opt);
        });
        console.log("Program Keahlian Berhasil Dimuat");
    } catch (err) {
        console.error('Gagal ambil program keahlian:', err);
    }
}

// fungsi untuk ambil jurusan berdasarkan program keahlian yang dipilih
async function updateJurusanOptions(program) {
    jurusanSelect.innerHTML = '<option value="">Pilih Jurusan</option>';
    jurusanSelect.disabled = true;

    if (!program) return;

    try {
        const res = await fetch(`/api/jurusan?program=${encodeURIComponent(program)}`);
        const data = await res.json();
        data.forEach(j => {
            const option = document.createElement('option');
            option.value = j._id;
            option.textContent = j.nama;
            jurusanSelect.appendChild(option);
        });
        jurusanSelect.disabled = (data.length === 0);
    } catch (err) {
        console.error('Gagal ambil jurusan:', err);
    }
}

// fungsi untuk ambil tingkat rombel berdasarkan jurusan yang dipilih
async function updateUsedRombel() {
    const jurusan = jurusanSelect.value;
    const tingkat = tingkatSelect.value;

    // reset pilihan rombel
    rombelInput.value = '';
    dropdownTrigger.textContent = 'Pilih Rombel';
    selectedValue = '';

    if (!jurusan || !tingkat) {
        usedLetters = [];
        renderRombelPage();
        return;
    }

    try {
        const res = await fetch(`/api/kelas/${encodeURIComponent(jurusan)}?tingkat=${encodeURIComponent(tingkat)}`);
        const data = await res.json();
        usedLetters = data.map(item => item.rombel).filter(Boolean);

        // otomatis pindah ke halaman yang berisi huruf selanjutnya yang bisa dipilih
        const nextLetter = getNextAllowedLetter();
        if (nextLetter) {
            currentPage = Math.floor(letters.indexOf(nextLetter) / pageSize);
        }
    } catch (err) {
        console.error('Gagal fetch rombel:', err);
        usedLetters = [];
    }
    renderRombelPage();
}

// fungsi untuk dapatkan huruf selanjutnya yang bisa dipilih
function getNextAllowedLetter() {
    const usedSet = new Set(usedLetters);
    return letters.find(l => !usedSet.has(l)) || '';
}

function renderRombelPage() {
    rombelItems.innerHTML = '';

    const start = currentPage * pageSize;
    const pageLetters = letters.slice(start, start + pageSize);
    const selectionActive = (jurusanSelect.value && tingkatSelect.value);
    const usedSet = new Set(usedLetters);
    const nextAllowed = getNextAllowedLetter();

    pageLetters.forEach(value => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'rombel-item';
        btn.textContent = value;

        const isUsed = usedSet.has(value);
        const isNext = (value === nextAllowed);
        const canClick = selectionActive && (isUsed || isNext);

        btn.disabled = !canClick;
        if (!canClick) btn.classList.add('disabled');
        if (isUsed) btn.classList.add('used');
        if (value === selectedValue) btn.classList.add('active');

        btn.onclick = () => {
            if (!canClick) return;
            selectedValue = value;
            rombelInput.value = value;
            dropdownTrigger.textContent = value;

            if (isUsed) {
                rombelError.textContent = `Rombel ${value} sudah terdaftar.`;
                rombelError.style.display = 'block';
            } else {
                rombelError.style.display = 'none';
            }

            renderRombelPage();
            dropdownMenu.classList.remove('active');
            setDropdownExpanded(false);
        };
        rombelItems.appendChild(btn);
    });

    pageLabel.textContent = `${letters[start]} - ${letters[Math.min(start + pageSize - 1, 25)]}`;
    prevPage.disabled = (currentPage === 0);
    nextPage.disabled = (start + pageSize >= letters.length);
}

document.addEventListener('DOMContentLoaded', () => {
    // inisialisasi aos kalau ada
    if (typeof AOS !== 'undefined') {
        AOS.init({ once: true, duration: 600 });
    }

    // panggil program keahlian
    fetchProgramKeahlian();
    renderRombelPage();

    // event dropdown & pilihan
    programSelect.addEventListener('change', (e) => {
        updateJurusanOptions(e.target.value);
        updateUsedRombel();
    });

    jurusanSelect.addEventListener('change', updateUsedRombel);
    tingkatSelect.addEventListener('change', updateUsedRombel);

    // navigasi dan menu
    dropdownTrigger.onclick = () => {
        const isActive = dropdownMenu.classList.toggle('active');
        setDropdownExpanded(isActive);
    };

    prevPage.onclick = () => {
        if (currentPage > 0) {
            currentPage--;
            renderRombelPage();
        }
    };

    nextPage.onclick = () => {
        if ((currentPage + 1) * pageSize < letters.length) {
            currentPage++;
            renderRombelPage();
        }
    };

    // klik di luar dropdown untuk menutup
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-rombel')) {
            dropdownMenu.classList.remove('active');
            setDropdownExpanded(false);
        }
    });
});