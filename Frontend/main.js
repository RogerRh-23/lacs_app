document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const messageBox = document.getElementById('message-box');
    const loadingOverlay = document.getElementById('loading-overlay');

    if (!loginForm || !messageBox || !loadingOverlay) {
        console.error("Uno o más elementos HTML críticos no se encontraron en login/login.html. Por favor, revisa tus IDs y clases.");
        console.log("Estado de elementos:");
        console.log("   loginForm:", loginForm);
        console.log("   messageBox:", messageBox);
        console.log("   loadingOverlay:", loadingOverlay);
        return;
    }

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
        loadingOverlay.classList.remove('hidden');
    }

    function hideLoadingOverlay() {
        loadingOverlay.classList.add('hidden');
    }

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

                    if (data.access) {
                        localStorage.setItem('accessToken', data.access);
                    }
                    if (data.role) {
                        localStorage.setItem('role', data.role);
                    }
                    if (data.username) {
                        localStorage.setItem('username', data.username);
                    }
                    window.location.href = "home/home.html";

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

    loadingOverlay.classList.add('hidden');
});
