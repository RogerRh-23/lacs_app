document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const loginFormsContainer = document.querySelector('.login-forms');

    const loadingOverlay = document.getElementById('loading-overlay');
    const welcomeMessageElement = document.getElementById('welcome-message');

    const registrationSuccessMessage = document.getElementById('registration-success-message');
    const generatedUsernameDisplay = document.getElementById('generated-username-display');
    const goToLoginBtn = document.getElementById('go-to-login-btn');

    const messageBox = document.getElementById('message-box');

    function showMessage(message, type) {
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.className = `message-box ${type}`;
            messageBox.style.display = 'block';
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 5000);
        } else {
            alert(message);
        }
    }

    function showLoadingScreen(username = '') {
        if (loadingOverlay && welcomeMessageElement) {
            welcomeMessageElement.textContent = `¡Bienvenido${username ? ' ' + username : ''}!`;
            loadingOverlay.classList.remove('hidden');
        }
    }

    function showRegistrationSuccessMessage(username) {
        if (registrationSuccessMessage && generatedUsernameDisplay && loginFormsContainer) {
            generatedUsernameDisplay.textContent = username;
            registrationSuccessMessage.classList.add('visible');
            loginFormsContainer.classList.add('hidden-for-success');
            const loginBox = document.querySelector('.login-box');
            const loginTabs = document.querySelector('.login-tabs');
            if (loginBox && loginTabs) {
                const tabsHeight = loginTabs.offsetHeight;
                loginBox.style.height = `${registrationSuccessMessage.offsetHeight + tabsHeight + parseFloat(getComputedStyle(loginBox).paddingTop) + parseFloat(getComputedStyle(loginBox).paddingBottom)}px`;
            } else if (loginBox) {
                loginBox.style.height = `${registrationSuccessMessage.offsetHeight + parseFloat(getComputedStyle(loginBox).paddingTop) + parseFloat(getComputedStyle(loginBox).paddingBottom)}px`;
            }
        }
    }

    function hideRegistrationSuccessMessage() {
        if (registrationSuccessMessage && loginFormsContainer) {
            registrationSuccessMessage.classList.remove('visible');
            loginFormsContainer.classList.remove('hidden-for-success');
        }
    }

    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', () => {
            hideRegistrationSuccessMessage();
            const loginTabBtn = document.getElementById('login-tab-btn');
            if (loginTabBtn) {
                loginTabBtn.click();
            }
        });
    }

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

                    const data = await response.json();

                    if (response.ok) {
                        console.log('Inicio de sesión exitoso:', data);
                        showMessage(data.message || 'Inicio de sesión exitoso.', 'success');

                        localStorage.setItem('jwtToken', data.token);
                        localStorage.setItem('userRole', data.role);
                        localStorage.setItem('username', data.username);

                        showLoadingScreen(data.username);
                        setTimeout(() => {
                            window.location.href = 'home.html';
                        }, 2000);
                    } else {
                        console.error('Error en el inicio de sesión:', data.message || 'Error desconocido.');
                        showMessage(data.message || 'Credenciales inválidas.', 'error');
                    }
                } catch (error) {
                    console.error('Error de red o del servidor:', error);
                    showMessage('No se pudo conectar con el servidor. Por favor, inténtalo de nuevo más tarde.', 'error');
                }
            } else {
                showMessage("Por favor, completa todos los campos de inicio de sesión.", 'error');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const firstName = document.getElementById("register-name").value.trim();
            const lastName = document.getElementById("register-lastname").value.trim();
            const phone = document.getElementById("register-phone").value.trim();
            const password = document.getElementById("register-password").value.trim();
            const company = document.getElementById("register-empresa").value.trim();

            if (firstName && lastName && phone && password && company) {
                const backendRegisterUrl = 'http://localhost:8080/api/auth/register';

                const registrationData = {
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    password: password,
                    company: company
                };

                try {
                    const response = await fetch(backendRegisterUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(registrationData)
                    });

                    const data = await response.json();

                    if (response.ok || response.status === 201) {
                        console.log('Registro exitoso:', data);
                        showMessage(data.message + " Tu usuario es: " + data.username, 'success');

                        localStorage.setItem('jwtToken', data.token);
                        localStorage.setItem('userRole', data.role);
                        localStorage.setItem('username', data.username);

                        showRegistrationSuccessMessage(data.username);
                        setTimeout(() => {
                            window.location.href = 'home.html';
                        }, 2000);

                    } else {
                        console.error('Error en el registro:', data.message || 'Error desconocido.');
                        showMessage(data.message || 'Algo salió mal durante el registro.', 'error');
                    }
                } catch (error) {
                    console.error('Error de red o del servidor durante el registro:', error);
                    showMessage('No se pudo conectar con el servidor para el registro. Intenta de nuevo más tarde.', 'error');
                }

            } else {
                showMessage("Por favor, completa todos los campos para el registro.", 'error');
            }
        });
    }

    const newReportForm = document.getElementById("new-report-form");
    if (newReportForm) {
        newReportForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("Formulario de Reporte enviado (lógica pendiente)");
            showMessage("Formulario de Reporte enviado (lógica pendiente)", 'info');
        });
    }
});
