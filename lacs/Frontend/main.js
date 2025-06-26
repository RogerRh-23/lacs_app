document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const loginFormsContainer = document.querySelector('.login-forms');

    const loadingOverlay = document.getElementById('loading-overlay');
    const welcomeMessageElement = document.getElementById('welcome-message');

    const registrationSuccessMessage = document.getElementById('registration-success-message');
    const generatedUsernameDisplay = document.getElementById('generated-username-display');
    const goToLoginBtn = document.getElementById('go-to-login-btn');

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
            if (loginBox) {
                loginBox.style.height = registrationSuccessMessage.offsetHeight + loginTabs.offsetHeight + 'px';
                const tabsHeight = document.querySelector('.login-tabs').offsetHeight;
                loginBox.style.height = `${registrationSuccessMessage.offsetHeight + tabsHeight + parseFloat(getComputedStyle(loginBox).paddingTop) + parseFloat(getComputedStyle(loginBox).paddingBottom)}px`;
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

                    if (response.ok) {
                        const data = await response.json();
                        console.log('Inicio de sesión exitoso:', data);
                        showLoadingScreen(data.username);
                        setTimeout(() => {
                            window.location.href = 'home.html';
                        }, 2000);

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

                    if (response.ok || response.status === 201) {
                        const data = await response.json();
                        console.log('Registro exitoso:', data);
                        showRegistrationSuccessMessage(data.username);
                    } else {
                        const errorData = await response.json();
                        console.error('Error en el registro:', errorData.message || 'Error desconocido.');
                        alert('Error en el registro: ' + (errorData.message || 'Algo salió mal.'));
                    }
                } catch (error) {
                    console.error('Error de red o del servidor durante el registro:', error);
                    alert('No se pudo conectar con el servidor para el registro. Intenta de nuevo más tarde.');
                }

            } else {
                alert("Por favor, completa todos los campos para el registro.");
            }
        });
    }

    const newReportForm = document.getElementById("new-report-form");
    if (newReportForm) {
        newReportForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("Formulario de Reporte enviado (lógica pendiente)");
            alert("Formulario de Reporte enviado (lógica pendiente)");
        });
    }
});
