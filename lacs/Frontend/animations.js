// Frontend/animations.js

document.addEventListener('DOMContentLoaded', function () {
    // --- Referencias a elementos de la BARRA LATERAL (Sidebar) ---
    // Estos elementos solo existen en páginas que tienen la sidebar
    const toggleBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const icon = document.getElementById('sidebar-icon');
    const userMenuBtn = document.getElementById('user-menu-btn');
    const sidebarUser = document.querySelector('.sidebar-user');

    // --- Referencias a elementos del LOGIN/REGISTER (Tabs) ---
    // Estos elementos existen en login.html
    const loginTabBtn = document.getElementById('login-tab-btn');
    const registerTabBtn = document.getElementById('register-tab-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabIndicator = document.querySelector('.tab-indicator');
    const loginBox = document.querySelector('.login-box');


    // --- Lógica para la BARRA LATERAL (Sidebar) ---
    // Solo ejecutamos esta lógica si los elementos de la sidebar existen en la página
    if (toggleBtn && sidebar && icon && userMenuBtn && sidebarUser) {
        toggleBtn.addEventListener('click', function () {
            sidebar.classList.toggle('closed');
            icon.innerHTML = sidebar.classList.contains('closed') ? '&#9776;' : '&times;'; // Icono de hamburguesa o cerrar
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
            e.stopPropagation(); // Evita que el clic se propague al documento
        });

        // Cierra el menú si se hace clic fuera de la sidebar-user y la sidebar no está cerrada
        document.addEventListener('click', function (e) {
            if (!sidebarUser.contains(e.target) && !userMenuBtn.contains(e.target) && !sidebar.classList.contains('closed')) {
                closeMenuWithAnimation();
            }
        });

        // Función para cerrar el menú de usuario con animación
        function closeMenuWithAnimation() {
            if (sidebarUser.classList.contains('menu-open')) {
                sidebarUser.classList.remove('menu-open');
                sidebarUser.classList.add('menu-closing');
                setTimeout(() => {
                    sidebarUser.classList.remove('menu-closing');
                }, 300); // Duración de la animación en CSS
            }
        }
    }


    // --- Lógica para los TABS de Login/Register ---
    // Solo ejecutamos esta lógica si los elementos de los tabs existen en la página (ej. login.html)
    if (loginTabBtn && registerTabBtn && loginForm && registerForm && tabIndicator && loginBox) {

        // Event listeners para los botones de los tabs
        loginTabBtn.addEventListener('click', function () {
            activateTab('login');
            animateBoxHeight();
        });
        registerTabBtn.addEventListener('click', function () {
            activateTab('register');
            animateBoxHeight();
        });

        // Función para activar una pestaña y manejar las clases 'active'
        function activateTab(tab) {
            if (tab === 'login') {
                loginTabBtn.classList.add('active');
                registerTabBtn.classList.remove('active');
                loginForm.classList.add('active');
                registerForm.classList.remove('active');
            } else {
                loginTabBtn.classList.remove('active');
                registerTabBtn.classList.add('active');
                loginForm.classList.remove('active');
                registerForm.classList.add('active');
            }
            // Llama a la función para actualizar el indicador visual
            updateTabIndicator(tab === 'login' ? loginTabBtn : registerTabBtn);
        }

        // Función para actualizar la posición y ancho del indicador del tab
        function updateTabIndicator(activeTab) {
            const tabRect = activeTab.getBoundingClientRect();
            const parentRect = activeTab.parentElement.getBoundingClientRect();
            tabIndicator.style.width = `${tabRect.width}px`;
            tabIndicator.style.left = `${tabRect.left - parentRect.left}px`;
        }

        // Función para animar la altura de la caja de login/registro
        function animateBoxHeight() {
            // Clonamos la caja para calcular su altura sin afectar el layout actual
            const clone = loginBox.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.visibility = 'hidden';
            clone.style.height = 'auto'; // Calcular altura automática
            clone.style.transition = 'none'; // Sin transiciones para el cálculo
            clone.style.overflow = 'visible'; // Asegurar que todo el contenido sea visible para el cálculo
            document.body.appendChild(clone);

            // Asegurarse de que el formulario activo sea el visible en el clon para calcular la altura correcta
            clone.querySelectorAll('.tab-form').forEach(form => {
                form.style.display = form.classList.contains('active') ? 'flex' : 'none';
            });

            const newHeight = clone.offsetHeight; // Obtenemos la altura calculada
            document.body.removeChild(clone); // Eliminamos el clon

            // Aplicamos la altura calculada a la caja original con una transición
            // Asegúrate de que la transición 'height' esté definida en tu CSS para .login-box
            loginBox.style.height = newHeight + 'px';
        }

        // Inicializar el indicador del tab y la altura de la caja al cargar la página
        // Solo llamamos animateBoxHeight cuando los elementos de los tabs existen
        const currentActiveTabOnLoad = document.querySelector('.login-tab.active');
        if (currentActiveTabOnLoad) {
            updateTabIndicator(currentActiveTabOnLoad);
            animateBoxHeight(); // Llamada inicial para establecer la altura correcta al cargar
        }

        // Actualizar la altura de la caja y el indicador al redimensionar la ventana
        window.addEventListener('resize', () => {
            const activeTabOnResize = document.querySelector('.login-tab.active');
            if (activeTabOnResize) {
                updateTabIndicator(activeTabOnResize);
                animateBoxHeight();
            }
        });
    } else {
        // Opcional: Mensaje de consola si los elementos de los tabs no están presentes
        // console.log("Elementos de Login/Registro no encontrados en esta página. La lógica de tabs no se activará.");
    }
});
