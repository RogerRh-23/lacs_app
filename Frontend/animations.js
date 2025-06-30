document.addEventListener('DOMContentLoaded', function () {

    // --- Lógica de Sidebar (si aplica a esta página) ---
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');

    if (sidebarPlaceholder) {
        loadSidebar();
    }

    async function loadSidebar() {
        try {
            const response = await fetch('sidebar.html');
            if (response.ok) {
                const sidebarHtml = await response.text();
                sidebarPlaceholder.innerHTML = sidebarHtml;

                initializeSidebarLogic();
            } else {
                console.error('Error al cargar la sidebar:', response.statusText);
            }
        } catch (error) {
            console.error('Error de red al cargar la sidebar:', error);
        }
    }

    function initializeSidebarLogic() {
        const toggleBtn = document.getElementById('toggle-sidebar');
        const sidebar = document.querySelector('.sidebar');
        const icon = document.getElementById('sidebar-icon');
        const userMenuBtn = document.getElementById('user-menu-btn');
        const sidebarUser = document.querySelector('.sidebar-user');

        if (toggleBtn && sidebar && icon && userMenuBtn && sidebarUser) {
            toggleBtn.addEventListener('click', function () {
                sidebar.classList.toggle('closed');
                icon.innerHTML = sidebar.classList.contains('closed') ? '&#9776;' : '&times;';
                if (sidebar.classList.contains('closed') && sidebarUser) {
                    closeMenuWithAnimation();
                }
            });

            userMenuBtn.addEventListener('click', function (e) {
                if (!sidebar.classList.contains('closed')) {
                    if (sidebarUser.classList.contains('menu-open')) {
                        closeMenuWithAnimation();
                    } else {
                        sidebarUser.classList.add('menu-open');
                    }
                }
                e.stopPropagation();
            });

            document.addEventListener('click', function (e) {
                if (!sidebarUser.contains(e.target) && !userMenuBtn.contains(e.target) && !sidebar.classList.contains('closed')) {
                    closeMenuWithAnimation();
                }
            });

            function closeMenuWithAnimation() {
                if (sidebarUser.classList.contains('menu-open')) {
                    sidebarUser.classList.remove('menu-open');
                    sidebarUser.classList.add('menu-closing');
                    setTimeout(() => {
                        sidebarUser.classList.remove('menu-closing');
                    }, 300);
                }
            }
        }
    }

    // --- Lógica de Pestañas de Login/Registro ---
    const loginTabBtn = document.getElementById('login-tab-btn');
    const registerTabBtn = document.getElementById('register-tab-btn');
    const loginFormElement = document.getElementById('login-form');
    const registerFormElement = document.getElementById('register-form');
    const tabIndicator = document.querySelector('.tab-indicator');
    const loginBox = document.querySelector('.login-box');
    const registrationSuccessMessage = document.getElementById('registration-success-message'); // Necesario para ocultarlo al cambiar de pestaña

    if (loginTabBtn && registerTabBtn && loginFormElement && registerFormElement && tabIndicator && loginBox) {

        loginTabBtn.addEventListener('click', function () {
            activateTab('login');
            animateBoxHeight();
        });

        registerTabBtn.addEventListener('click', function () {
            activateTab('register');
            animateBoxHeight();
        });

        function activateTab(tabName) {
            // Desactiva todas las pestañas y formularios
            loginTabBtn.classList.remove('active');
            registerTabBtn.classList.remove('active');
            loginFormElement.classList.remove('active');
            loginFormElement.classList.add('hidden'); // Asegura que se oculte
            registerFormElement.classList.remove('active');
            registerFormElement.classList.add('hidden'); // Asegura que se oculte

            // Activa la pestaña y el formulario seleccionados
            if (tabName === 'login') {
                loginTabBtn.classList.add('active');
                loginFormElement.classList.remove('hidden');
                loginFormElement.classList.add('active');
            } else { // tabName === 'register'
                registerTabBtn.classList.add('active');
                registerFormElement.classList.remove('hidden');
                registerFormElement.classList.add('active');
            }
            updateTabIndicator(tabName); // Actualiza la posición del indicador

            // Oculta el mensaje de éxito de registro si está visible
            registrationSuccessMessage.classList.remove('visible');
        }

        function updateTabIndicator(tabName) {
            const activeTabElement = tabName === 'login' ? loginTabBtn : registerTabBtn;
            if (activeTabElement && tabIndicator) {
                const tabRect = activeTabElement.getBoundingClientRect();
                const parentRect = activeTabElement.parentElement.getBoundingClientRect();
                tabIndicator.style.width = `${tabRect.width}px`;
                tabIndicator.style.left = `${tabRect.left - parentRect.left}px`;
            }
        }

        function animateBoxHeight() {
            const clone = loginBox.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.visibility = 'hidden';
            clone.style.height = 'auto';
            clone.style.transition = 'none';
            clone.style.overflow = 'visible';
            document.body.appendChild(clone);

            clone.querySelectorAll('.tab-form').forEach(form => {
                // Asegura que el formulario activo en el clon sea visible para el cálculo de altura
                form.style.display = form.classList.contains('active') ? 'flex' : 'none';
            });

            const newHeight = clone.offsetHeight;
            document.body.removeChild(clone);

            loginBox.style.height = newHeight + 'px';
        }

        // Inicializa el estado de las pestañas al cargar la página
        activateTab('login');
        updateTabIndicator('login');
        animateBoxHeight();

        // Ajusta la altura y el indicador al cambiar el tamaño de la ventana
        window.addEventListener('resize', () => {
            const currentActiveTabName = loginTabBtn.classList.contains('active') ? 'login' : 'register';
            updateTabIndicator(currentActiveTabName);
            animateBoxHeight();
        });
    }

    // --- Lógica para la animación de etiquetas flotantes en los campos de entrada ---
    const inputGroups = document.querySelectorAll('.input-group');

    inputGroups.forEach(group => {
        const input = group.querySelector('input');

        if (input) {
            // Comprobación inicial si el input ya tiene un valor (ej. por autocompletado del navegador)
            if (input.value.trim() !== '') {
                group.classList.add('is-active');
            }

            // Añade la clase 'is-active' cuando el input está enfocado
            input.addEventListener('focus', () => {
                group.classList.add('is-active');
            });

            // Quita la clase 'is-active' cuando el input pierde el foco Y está vacío
            input.addEventListener('blur', () => {
                if (input.value.trim() === '') {
                    group.classList.remove('is-active');
                }
            });

            // Mantiene la clase 'is-active' si el usuario escribe o borra contenido
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    group.classList.add('is-active');
                } else {
                    group.classList.remove('is-active');
                }
            });
        }
    });
});
