// Frontend/main.js

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const loginTabBtn = document.getElementById("login-tab-btn");
    const registerTabBtn = document.getElementById("register-tab-btn");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const usuario = document.getElementById("login-usuario").value.trim();
            const password = document.getElementById("login-password").value.trim();

            if (usuario && password) {
                const backendUrl = 'http://localhost:8080/api/auth/login';

                try {
                    const response = await fetch(backendUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username: usuario, password: password })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log('Inicio de sesión exitoso:', data);
                        // Aquí puedes manejar el token de autenticación si el backend lo devuelve
                        // Por ejemplo: localStorage.setItem('authToken', data.token);

                        window.location.href = 'home.html';
                    } else {
                        const errorData = await response.json();
                        console.error('Error en el inicio de sesión:', errorData.message || 'Error desconocido.');
                        alert('Error: ' + (errorData.message || 'Credenciales inválidas.'));
                    }
                } catch (error) {
                    console.error('Error de red o del servidor:', error);
                    alert('No se pudo conectar con el servidor. Por favor, inténtalo de nuevo más tarde.');
                }
            } else {
                alert("Por favor, completa todos los campos de inicio de sesión.");
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("register-name").value.trim();
            const lastname = document.getElementById("register-lastname").value.trim();
            const phone = document.getElementById("register-phone").value.trim();
            const email = document.getElementById("register-email").value.trim();
            const password = document.getElementById("register-password").value.trim();
            const empresa = document.getElementById("register-empresa").value.trim();

            if (name && lastname && phone && email && password && empresa) {
                console.log('Datos de registro:', { name, lastname, phone, email, password, empresa });
                // Aquí, más adelante, integrarás la llamada fetch al backend para el registro
                // alert("Registro exitoso. Cambiando a pestaña de inicio de sesión...");

                alert("Registro exitoso. La funcionalidad de backend aún no está completa.");
                // Si la función `switchTab` de animations.js es global, podrías llamarla así:
                // window.switchTab('login');
                // Pero es mejor que los `addEventListener` de los botones manejen eso.
            } else {
                alert("Por favor, completa todos los campos para el registro.");
            }
        });
    }
});
