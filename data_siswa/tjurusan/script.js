fetch("/api/programkeahlian")
    .then(res => res.json())
    .then(data => {
        const select = document.getElementById("programkeahlianSelect");

        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.programkeahlian;
            option.textContent = item.programkeahlian;
            select.appendChild(option);
        });
    });

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData(form);
            const response = await fetch("/api/jurusan", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                window.location.href = "/data_siswa";
            } else {
                const errorText = await response.text();
                alert("Gagal: " + errorText);
            }

        } catch (err) {
            alert("Gagal menyimpan data");
            console.log(err);
        }
    });

const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const direction = document.getElementById("gradientDirection");
const result = document.getElementById("gradientResult");
const preview = document.getElementById("gradientPreview");
const label = document.getElementById("gradientLabel");

function updateGradient() {
    let value;

    if (color1.value === color2.value) {
        // kalau sama jadi warna biasa
        value = color1.value;
        label.textContent = "Mode: Warna solid";
    } else {
        // kalau beda jadi gradient
        value = `linear-gradient(${direction.value}, ${color1.value}, ${color2.value})`;
        label.textContent = "Mode: Gradient";
    }

    result.value = value;
    preview.style.background = value;
}

[color1, color2, direction].forEach(el => {
    el.addEventListener("input", updateGradient);
});

// set awal
updateGradient();
});

AOS.init({
    once: true,
    duration: 600,
    easing: 'ease-out-cubic'
});