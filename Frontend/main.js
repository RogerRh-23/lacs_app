document.addEventListener('DOMContentLoaded', () => {
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

    function showMessage(message, duration = 3000) {
        messageBox.textContent = message;
        messageBox.classList.add('show');
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, duration);
    }

    function showLoadingOverlay(message = "¡Bienvenido!", redirecting = true) {
        document.getElementById('welcome-message').textContent = message;
        document.querySelector('.loading-content p').textContent = redirecting ? "Redirigiendo..." : "Cargando...";
        loadingOverlay.classList.add('show');
    }

    function hideLoadingOverlay() {
        loadingOverlay.classList.remove('show');
    }

    function switchTab(targetFormId) {
        [loginForm, registerForm].forEach(form => {
            form.classList.remove('active');
        });
        [loginTabBtn, registerTabBtn].forEach(btn => {
            btn.classList.remove('active');
        });

        if (targetFormId === 'login-form') {
            loginForm.classList.add('active');
            loginTabBtn.classList.add('active');
            tabIndicator.style.left = '0%';
        } else if (targetFormId === 'register-form') {
            registerForm.classList.add('active');
            registerTabBtn.classList.add('active');
            tabIndicator.style.left = '50%';
        }

        registrationSuccessMessage.classList.remove('visible');
    }

    loginTabBtn.addEventListener('click', () => switchTab('login-form'));
    registerTabBtn.addEventListener('click', () => switchTab('register-form'));

    goToLoginBtn.addEventListener('click', () => {
        switchTab('login-form');
        registrationSuccessMessage.classList.remove('visible');
    });

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

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        showLoadingOverlay("Registrando...", false);

        const formData = {
            first_name: document.getElementById('register-name').value,
            last_name: document.getElementById('register-lastname').value,
            phone: document.getElementById('register-phone').value,
            company: document.getElementById('register-empresa').value,
            password: document.getElementById('register-password').value,
            password_confirm: document.getElementById('register-password2').value
        };

        if (formData.password !== formData.password_confirm) {
            hideLoadingOverlay();
            showMessage("Las contraseñas no coinciden.", 3000);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/accounts/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(formData)
            });

            hideLoadingOverlay();

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
                        errorMessage = Object.keys(data.errors).map(field => {
                            return `${field}: ${data.errors[field].join(', ')}`;
                        }).join('; ');
                    } else if (data.message) {
                        errorMessage = data.message;
                    }
                    showMessage(errorMessage, 5000);
                }
            } else {
                const textResponse = await response.text();
                console.error("Respuesta no JSON del servidor:", textResponse);
                showMessage(`Error del servidor: ${response.status} ${response.statusText}. La URL podría ser incorrecta o el servidor devolvió HTML.`, 7000);
            }

        } catch (error) {
            hideLoadingOverlay();
            console.error("Error de red durante el registro:", error);
            showMessage("Error de conexión. Inténtalo de nuevo.", 5000);
        }
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        showLoadingOverlay("Iniciando sesión...", false);

        const loginData = {
            username: document.getElementById('login-usuario').value,
            password: document.getElementById('login-password').value
        };

        try {
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
                } else {
                    let errorMessage = "Usuario o contraseña incorrectos.";
                    if (data.errors) {
                        errorMessage = Object.keys(data.errors).map(field => {
                            return `${field}: ${data.errors[field].join(', ')}`;
                        }).join('; ');
                    } else if (data.message) {
                        errorMessage = data.message;
                    }
                    showMessage(errorMessage, 3000);
                }
            } else {
                const textResponse = await response.text();
                console.error("Respuesta no JSON del servidor:", textResponse);
                showMessage(`Error del servidor: ${response.status} ${response.statusText}. La URL podría ser incorrecta o el servidor devolvió HTML.`, 7000);
            }

        } catch (error) {
            hideLoadingOverlay();
            console.error("Error de red durante el inicio de sesión:", error);
            showMessage("Error de conexión. Inténtalo de nuevo.", 5000);
        }
    });

    if (loginTabBtn.classList.contains('active')) {
        tabIndicator.style.left = '0%';
    } else if (registerTabBtn.classList.contains('active')) {
        tabIndicator.style.left = '50%';
    }

    registrationSuccessMessage.classList.remove('visible');
});
