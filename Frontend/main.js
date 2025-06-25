document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const loginTabBtn = document.getElementById("login-tab-btn");
    const registerTabBtn = document.getElementById("register-tab-btn");

    loginTabBtn.addEventListener("click", () => switchTab("login"));
    registerTabBtn.addEventListener("click", () => switchTab("register"));

    function switchTab(tab) {
        const loginTab = document.getElementById("login-tab-btn");
        const registerTab = document.getElementById("register-tab-btn");
        const loginForm = document.getElementById("login-form");
        const registerForm = document.getElementById("register-form");

        if (tab === "login") {
            loginTab.classList.add("active");
            registerTab.classList.remove("active");
            loginForm.classList.add("active");
            registerForm.classList.remove("active");
        } else {
            registerTab.classList.add("active");
            loginTab.classList.remove("active");
            registerForm.classList.add("active");
            loginForm.classList.remove("active");
        }
    }

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const usuario = document.getElementById("login-usuario").value.trim();
        const password = document.getElementById("login-password").value.trim();

        if (usuario && password) {
            alert("Inicio de sesión exitoso.");
            // Aquí podrías agregar la lógica para autenticar al usuario
            switchTab("register");
        } else {
            alert("Por favor, completa todos los campos.");
        }
    });

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("reegister-name").value.trim();
        const lastname = document.getElementById("register-lastname").value.trim();
        const phone = document.getElementById("register-phone").value.trim();
        const email = document.getElementById("register-email").value.trim();
        const empresa = registerForm.querySelector('input[list="Empresas"]').value.trim();

        if (name && lastname && phone && email && empresa) {
            alert("Registro exitoso. Cambiando a pestaña de inicio de sesión...");
            switchTab("login");
        } else {
            alert("Por favor, completa todos los campos.");
        }
    });
});
