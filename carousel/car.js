function openModal(name, a, b, total) {
    document.getElementById('myModal').style.display = "block";
    document.getElementById('modalTitle').innerText = name;
    document.getElementById('valA').innerText = a;
    document.getElementById('valB').innerText = b;
    document.getElementById('valTotal').innerText = total;
}

function closeModal() {
    document.getElementById('myModal').style.display = "none";
}

window.onclick = function(event) {
    let modal = document.getElementById('myModal');
    if (event.target == modal) {
        closeModal();
    }
}

const carousel = document.querySelector(".carousel");

carousel.addEventListener("click", () => {
    carousel.style.animationPlayState =
        carousel.style.animationPlayState === "paused"
            ? "running"
            : "paused";
});