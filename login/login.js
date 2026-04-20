const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const regUsername = document.getElementById("regUsername");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");

if(registerBtn && loginBtn && container) {
    registerBtn.addEventListener("click", () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener("click", () => {
        container.classList.remove("active");
    });
}

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = regUsername.value;
  const email = regEmail.value;
  const password = regPassword.value;

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();

  if (data.success) {
    alert("Akun berhasil disimpan, silakan login");
    
    // pindah ke login
    container.classList.remove("active");

    // reset form (optional)
    document.getElementById("registerForm").reset();
  } else {
    alert(data.message);
  }
});

// masuk ke dashboard 
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    window.location.href = "/dashboard";
  } else {
    alert(data.message);
  }

});