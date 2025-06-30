document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const loginTabBtn = document.getElementById('login-tab-btn');
    const registerTabBtn = document.getElementById('register-tab-btn');
    const tabIndicator = document.querySelector('.tab-indicator');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const registrationSuccessMessage = document.getElementById('registration-success-message');
    const goToLoginBtn = document.getElementById('go-to-login-btn');
    const generatedUsernameDisplay = document.getElementById('generated-username-display');
    const messageBox = document.getElementById('message-box');
    const loadingOverlay = document.getElementById('loading-overlay');

    // Función para mostrar mensajes temporales
    function showMessage(message, duration = 3000) {
        messageBox.textContent = message;
        messageBox.classList.add('show');
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, duration);
    }

    // Función para mostrar el overlay de carga
    function showLoadingOverlay(message = "¡Bienvenido!", redirecting = true) {
        document.getElementById('welcome-message').textContent = message;
        document.querySelector('.loading-content p').textContent = redirecting ? "Redirigiendo..." : "Cargando...";
        loadingOverlay.classList.add('show');
    }

    // Función para ocultar el overlay de carga
    function hideLoadingOverlay() {
        loadingOverlay.classList.remove('show');
    }

    // Función para cambiar entre formularios (pestañas)
    function switchTab(targetFormId) {
        // Oculta todos los formularios y quita la clase 'active' de las pestañas
        [loginForm, registerForm].forEach(form => {
            form.classList.remove('active');
        });
        [loginTabBtn, registerTabBtn].forEach(btn => {
            btn.classList.remove('active');
        });

        // Muestra el formulario objetivo y activa la pestaña correspondiente
        if (targetFormId === 'login-form') {
            loginForm.classList.add('active');
            loginTabBtn.classList.add('active');
            tabIndicator.style.left = '0%'; // Mueve el indicador a la izquierda
        } else if (targetFormId === 'register-form') {
            registerForm.classList.add('active');
            registerTabBtn.classList.add('active');
            tabIndicator.style.left = '50%'; // Mueve el indicador a la derecha
        }

        // Oculta el mensaje de éxito si está visible
        registrationSuccessMessage.classList.remove('visible');
    }

    // Event listeners para los botones de las pestañas
    loginTabBtn.addEventListener('click', () => switchTab('login-form'));
    registerTabBtn.addEventListener('click', () => switchTab('register-form'));

    // Event listener para el botón "Ir a Iniciar Sesión" en el mensaje de éxito
    goToLoginBtn.addEventListener('click', () => {
        switchTab('login-form'); // Vuelve al formulario de inicio de sesión
        // Oculta el mensaje de éxito
        registrationSuccessMessage.classList.remove('visible');
    });

    // Manejo del envío del formulario de registro (ejemplo)
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita el envío predeterminado del formulario

        // Simula un proceso de registro con un retraso
        showLoadingOverlay("Registrando...", false);

        try {
            // Aquí iría tu lógica real de registro (ej. llamada a una API)
            // Por ahora, simulamos un éxito
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simula 2 segundos de carga

            // --- CAMBIO AQUÍ: Usando document.getElementById ---
            const firstName = document.getElementById('register-name').value;
            const lastName = document.getElementById('register-lastname').value;
            const phone = document.getElementById('register-phone').value;
            const company = document.getElementById('register-empresa').value;
            const password = document.getElementById('register-password').value;
            const password2 = document.getElementById('register-password2').value;
            // --- FIN CAMBIO ---

            // Validación de contraseñas (mantener en el frontend para UX)
            if (password !== password2) {
                hideLoadingOverlay();
                showMessage("Las contraseñas no coinciden.", 3000);
                return;
            }

            // Genera un nombre de usuario simple (esto debería venir del backend en tu implementación real)
            const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${company.toLowerCase().replace(/\s/g, '').substring(0, 3)}`;
            generatedUsernameDisplay.textContent = username;

            // Oculta los formularios y muestra el mensaje de éxito
            loginForm.classList.remove('active');
            registerForm.classList.remove('active');
            registrationSuccessMessage.classList.add('visible');

            showMessage("¡Registro completado con éxito!");

        } catch (error) {
            console.error("Error durante el registro:", error);
            showMessage("Error en el registro. Inténtalo de nuevo.");
        } finally {
            hideLoadingOverlay();
        }
    });

    // Manejo del envío del formulario de inicio de sesión (ejemplo)
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita el envío predeterminado del formulario

        showLoadingOverlay("Iniciando sesión...", false);

        try {
            // Aquí iría tu lógica real de inicio de sesión (ej. llamada a una API)
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simula 1.5 segundos de carga

            // --- CAMBIO AQUÍ: Usando document.getElementById ---
            const username = document.getElementById('login-usuario').value;
            const password = document.getElementById('login-password').value;
            // --- FIN CAMBIO ---

            // Simulación de validación
            if (username === "test" && password === "password") {
                showMessage(`¡Bienvenido, ${username}!`, 2000);
                // Aquí podrías redirigir al usuario o cargar el contenido principal
                setTimeout(() => {
                    // Ejemplo de redirección (puedes cambiarlo a tu página principal)
                    // window.location.href = "/dashboard.html";
                    hideLoadingOverlay(); // Oculta el overlay si no hay redirección real
                }, 2000);
            } else {
                showMessage("Usuario o contraseña incorrectos.", 3000);
                hideLoadingOverlay();
            }

        } catch (error) {
            console.error("Error durante el inicio de sesión:", error);
            showMessage("Error en el inicio de sesión. Inténtalo de nuevo.");
            hideLoadingOverlay();
        }
    });

    if (loginTabBtn.classList.contains('active')) {
        tabIndicator.style.left = '0%';
    } else if (registerTabBtn.classList.contains('active')) {
        tabIndicator.style.left = '50%';
    }
    registrationSuccessMessage.classList.remove('visible');
});
