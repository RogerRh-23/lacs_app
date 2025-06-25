// Frontend/main.js

document.addEventListener("DOMContentLoaded", () => {
    // Referencias a los formularios y botones de tabs
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const loginTabBtn = document.getElementById("login-tab-btn");
    const registerTabBtn = document.getElementById("register-tab-btn");
    const tabIndicator = document.querySelector('.tab-indicator'); // Para el indicador visual de los tabs

    // Event listeners para los botones de los tabs
    loginTabBtn.addEventListener("click", () => switchTab("login"));
    registerTabBtn.addEventListener("click", () => switchTab("register"));

    // Función para cambiar entre los tabs (lógica existente, mejorada para el indicador)
    function switchTab(tab) {
        // Obtenemos de nuevo las referencias dentro de la función para asegurar que siempre estén actualizadas
        const loginTab = document.getElementById("login-tab-btn");
        const registerTab = document.getElementById("register-tab-btn");
        const loginFormElement = document.getElementById("login-form"); // Renombrado para evitar conflicto con la variable 'loginForm' de arriba
        const registerFormElement = document.getElementById("register-form"); // Renombrado

        if (tab === "login") {
            loginTab.classList.add("active");
            registerTab.classList.remove("active");
            loginFormElement.classList.add("active");
            registerFormElement.classList.remove("active");
            updateTabIndicator(loginTab); // Actualiza la posición del indicador
        } else {
            registerTab.classList.add("active");
            loginTab.classList.remove("active");
            registerFormElement.classList.add("active");
            loginFormElement.classList.remove("active");
            updateTabIndicator(registerTab); // Actualiza la posición del indicador
        }
    }

    // Función para actualizar la posición y ancho del indicador del tab
    const updateTabIndicator = (activeTab) => {
        if (activeTab && tabIndicator) {
            const tabRect = activeTab.getBoundingClientRect();
            const parentRect = activeTab.parentElement.getBoundingClientRect();
            tabIndicator.style.width = `${tabRect.width}px`;
            tabIndicator.style.left = `${tabRect.left - parentRect.left}px`;
        }
    };

    // Inicializar el indicador al cargar la página
    const currentActiveTab = document.querySelector('.login-tab.active');
    if (currentActiveTab) {
        updateTabIndicator(currentActiveTab);
    }

    // Ajustar el indicador cuando la ventana cambia de tamaño
    window.addEventListener('resize', () => {
        const activeTabOnResize = document.querySelector('.login-tab.active');
        if (activeTabOnResize) {
            updateTabIndicator(activeTabOnResize);
        }
    });


    // --- Lógica para el formulario de LOGIN (INTEGRACIÓN CON BACKEND) ---
    loginForm.addEventListener("submit", async (e) => { // Añadimos 'async' aquí
        e.preventDefault(); // Evita el envío tradicional del formulario

        const usuario = document.getElementById("login-usuario").value.trim();
        const password = document.getElementById("login-password").value.trim();

        if (usuario && password) {
            const backendUrl = 'http://localhost:8080/api/auth/login'; // URL de tu endpoint de login

            try {
                const response = await fetch(backendUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: usuario, password: password }) // 'username' y 'password' deben coincidir con LoginRequest.java
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Inicio de sesión exitoso:', data);
                    // Aquí puedes manejar el token de autenticación si el backend lo devuelve
                    // Por ejemplo: localStorage.setItem('authToken', data.token);

                    // Redirigir al usuario a la página principal
                    window.location.href = 'home.html'; // Asegúrate que 'home.html' exista en la misma carpeta o ajusta la ruta
                } else {
                    const errorData = await response.json(); // Intentamos parsear el error como JSON
                    console.error('Error en el inicio de sesión:', errorData.message || 'Error desconocido.');
                    alert('Error: ' + (errorData.message || 'Credenciales inválidas.'));
                }
            } catch (error) {
                console.error('Error de red o del servidor:', error);
                alert('No se pudo conectar con el servidor. Por favor, inténtalo de nuevo más tarde.');
            }
        } else {
            alert("Por favor, completa todos los campos.");
        }
    });

    // --- Lógica para el formulario de REGISTRO (actualmente solo front-end) ---
    registerForm.addEventListener("submit", async (e) => { // Añadimos 'async' aquí
        e.preventDefault();

        const name = document.getElementById("reegister-name").value.trim(); // Ojo: "reegister-name" parece un typo, ¿debería ser "register-name"?
        const lastname = document.getElementById("register-lastname").value.trim();
        const phone = document.getElementById("register-phone").value.trim();
        const email = document.getElementById("register-email").value.trim();
        const empresa = registerForm.querySelector('input[list="Empresas"]').value.trim();

        if (name && lastname && phone && email && empresa) {
            console.log('Datos de registro:', { name, lastname, phone, email, empresa });
            // Aquí iría la lógica para enviar estos datos al backend para el registro
            // Por ahora, solo muestra una alerta y cambia de tab
            alert("Registro exitoso. Cambiando a pestaña de inicio de sesión...");
            switchTab("login");
        } else {
            alert("Por favor, completa todos los campos para el registro.");
        }
    });
});
