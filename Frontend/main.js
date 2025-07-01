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

    // Función para obtener el token CSRF de las cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Manejo del envío del formulario de registro
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita el envío predeterminado del formulario

        showLoadingOverlay("Registrando...", false);

        const formData = {
            first_name: document.getElementById('register-name').value,
            last_name: document.getElementById('register-lastname').value,
            phone: document.getElementById('register-phone').value,
            company: document.getElementById('register-empresa').value,
            password: document.getElementById('register-password').value,
            password_confirm: document.getElementById('register-password2').value // Mantenemos para validación frontend
        };

        // Validación de contraseñas en el frontend
        if (formData.password !== formData.password_confirm) {
            hideLoadingOverlay();
            showMessage("Las contraseñas no coinciden.", 3000);
            return;
        }

        try {
            // --- CAMBIO CLAVE AQUÍ: Usar el puerto 8000 de Django ---
            const response = await fetch('http://127.0.0.1:8000/accounts/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(formData)
            });

            hideLoadingOverlay();

            // Intenta parsear la respuesta como JSON, maneja el error si no es JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();

                if (response.ok) {
                    generatedUsernameDisplay.textContent = data.username;
                    registrationSuccessMessage.classList.add('visible');
                    showMessage(data.message || "¡Registro completado con éxito!");
                } else {
                    let errorMessage = "Error en el registro.";
                    if (data.errors) {
                        errorMessage = Object.values(data.errors).flat().join(' ');
                    } else if (data.message) {
                        errorMessage = data.message;
                    }
                    showMessage(errorMessage, 5000);
                }
            } else {
                // Si la respuesta no es JSON (ej. HTML de error 404), muestra un mensaje genérico
                const textResponse = await response.text();
                console.error("Respuesta no JSON del servidor:", textResponse);
                showMessage(`Error del servidor: ${response.status} ${response.statusText}. La URL podría ser incorrecta.`, 7000);
            }


        } catch (error) {
            hideLoadingOverlay();
            console.error("Error de red durante el registro:", error);
            showMessage("Error de conexión. Inténtalo de nuevo.", 5000);
        }
    });

    // Manejo del envío del formulario de inicio de sesión
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita el envío predeterminado del formulario

        showLoadingOverlay("Iniciando sesión...", false);

        const loginData = {
            username: document.getElementById('login-usuario').value,
            password: document.getElementById('login-password').value
        };

        try {
            // --- CAMBIO CLAVE AQUÍ: Usar el puerto 8000 de Django ---
            const response = await fetch('http://127.0.0.1:8000/accounts/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(loginData)
            });

            hideLoadingOverlay();

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();

                if (response.ok) {
                    showMessage(data.message || `¡Bienvenido, ${data.username || loginData.username}!`, 2000);
                    // Aquí podrías redirigir al usuario o cargar el contenido principal
                    // Por ejemplo: window.location.href = "http://127.0.0.1:8000/accounts/home/";
                } else {
                    let errorMessage = "Usuario o contraseña incorrectos.";
                    if (data.errors) {
                        errorMessage = Object.values(data.errors).flat().join(' ');
                    } else if (data.message) {
                        errorMessage = data.message;
                    }
                    showMessage(errorMessage, 3000);
                }
            } else {
                const textResponse = await response.text();
                console.error("Respuesta no JSON del servidor:", textResponse);
                showMessage(`Error del servidor: ${response.status} ${response.statusText}. La URL podría ser incorrecta.`, 7000);
            }

        } catch (error) {
            hideLoadingOverlay();
            console.error("Error de red durante el inicio de sesión:", error);
            showMessage("Error de conexión. Inténtalo de nuevo.", 5000);
        }
    });

    // Inicializa el estado de las pestañas al cargar la página
    if (loginTabBtn.classList.contains('active')) {
        tabIndicator.style.left = '0%';
    } else if (registerTabBtn.classList.contains('active')) {
        tabIndicator.style.left = '50%';
    }

    // Asegura que el mensaje de éxito esté oculto al cargar la página
    registrationSuccessMessage.classList.remove('visible');
});
