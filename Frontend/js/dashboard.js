window.loadPageContent = async (pageUrl) => {
    const mainContentArea = document.getElementById('main-content-area');
    if (!mainContentArea) {
        console.error("Error: #main-content-area no encontrado. No se puede cargar el contenido.");
        return;
    }

    try {
        mainContentArea.innerHTML = '<div style="text-align: center; padding: 50px; font-size: 1.5rem; color: var(--color-primary);">Cargando...</div>';

        const response = await fetch(pageUrl);
        if (!response.ok) {
            console.error(`Error al cargar ${pageUrl}: ${response.statusText} (${response.status})`);
            throw new Error(`Error al cargar ${pageUrl}: ${response.statusText} (${response.status})`);
        }
        const contentHtml = await response.text();
        mainContentArea.innerHTML = contentHtml;

        console.log(`Contenido de ${pageUrl} cargado con éxito.`);

        if (pageUrl === '/Frontend/html/persInfo.html') {
            window.dispatchEvent(new CustomEvent('persInfoContentChanged'));
        }
        window.dispatchEvent(new CustomEvent('mainContentLoaded', { detail: { pageUrl: pageUrl } }));

    } catch (error) {
        console.error(`Fallo al cargar contenido de ${pageUrl}:`, error);
        mainContentArea.innerHTML = `<p style="color: red; text-align: center; padding: 50px;">Error al cargar la página: ${error.message}. Por favor, verifica la ruta del archivo.</p>`;
    }
};

async function loadSidebar() {
    try {
        console.log("Intentando cargar html/sidebar.html...");
        const response = await fetch('/Frontend/html/sidebar.html');

        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }

        const sidebarHtml = await response.text();
        console.log("html/sidebar.html cargado con éxito. Procesando contenido...");

        const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
        if (!sidebarPlaceholder) {
            console.error("Error: El div 'sidebar-placeholder' no se encontró en index.html. La barra lateral no se adjuntará.");
            return;
        }

        sidebarPlaceholder.innerHTML = '';

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sidebarHtml;
        const sidebarElement = tempDiv.querySelector('#sidebar');

        if (sidebarElement) {
            sidebarPlaceholder.appendChild(sidebarElement);
            console.log("Sidebar cargado con éxito y adjuntado a #sidebar-placeholder.");
        } else {
            console.error("Error: El elemento #sidebar no se encontró dentro del contenido de sidebar.html.");
        }
    } catch (error) {
        console.error("Error al cargar la barra lateral:", error);
    }
}

async function initDashboard() {
    console.log("Iniciando initDashboard...");

    await loadSidebar();

    const sidebar = document.querySelector('.sidebar');
    const sidebarToggleButton = document.getElementById('toggle-sidebar');
    const registerEmployeesLink = document.getElementById('register-employees-link');
    const logoutButton = document.getElementById('sidebar-logout-button');
    const usernameDisplay = document.querySelector('.sidebar-user .username');
    const appLayoutWrapper = document.querySelector('.app-layout-wrapper');

    console.log("Depuración de elementos después de cargar sidebar:");
    console.log("sidebar:", sidebar);
    console.log("sidebarToggleButton:", sidebarToggleButton);
    console.log("appLayoutWrapper:", appLayoutWrapper);

    // Función para verificar autenticación y rol
    function checkAuthAndRole() {
        const jwtToken = localStorage.getItem('accessToken');
        const userRole = localStorage.getItem('role');
        const username = localStorage.getItem('username');

        if (registerEmployeesLink) {
            registerEmployeesLink.style.display = 'none';
        }

        if (!jwtToken || !userRole || !username) {
            console.log("No se encontró token JWT, rol de usuario o nombre de usuario. Redirigiendo a login.");
            window.location.href = '/login.html';
            return;
        }

        if (usernameDisplay) {
            usernameDisplay.textContent = username;
            console.log(`Nombre de usuario establecido: ${username}`);
        }

        if (userRole === 'admin') {
            if (registerEmployeesLink) {
                registerEmployeesLink.style.display = 'block';
            }
            console.log(`Usuario ${username} ha iniciado sesión como ADMIN.`);
        } else {
            console.log(`Usuario ${username} ha iniciado sesión con rol: ${userRole}.`);
        }
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            console.log("Usuario ha cerrado sesión. Limpiando localStorage y redirigiendo a login.");
            window.location.href = '/login.html';
        });
    } else {
        console.warn("Botón de cerrar sesión con ID 'sidebar-logout-button' no encontrado después de cargar la barra lateral.");
    }

    if (sidebarToggleButton && sidebar && appLayoutWrapper) {
        console.log("Elementos de toggle encontrados. Adjuntando event listener.");
        sidebarToggleButton.addEventListener('click', () => {
            console.log("Clic en el botón de toggle detectado.");
            sidebar.classList.toggle('closed');
            appLayoutWrapper.classList.toggle('sidebar-closed');

            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('open-mobile');
            }

            console.log("Botón de alternar la barra lateral clicado. Estado de la barra lateral:", sidebar.classList.contains('closed') ? 'cerrada' : 'abierta');
            window.dispatchEvent(new CustomEvent('mainContentLoaded'));
        });
    } else {
        console.error("ERROR: Algunos elementos de alternancia de la barra lateral NO fueron encontrados después de cargar el sidebar. " +
            "Verifica que #sidebar, #toggle-sidebar, y .app-layout-wrapper existan.");
        if (!sidebarToggleButton) console.error("sidebarToggleButton es NULL.");
        if (!sidebar) console.error("sidebar es NULL.");
        if (!appLayoutWrapper) console.error("appLayoutWrapper es NULL.");
    }

    checkAuthAndRole();

    loadPageContent('/Frontend/html/home.html');
    console.log("Cargando contenido inicial: html/home.html");
}

document.addEventListener('DOMContentLoaded', initDashboard);
