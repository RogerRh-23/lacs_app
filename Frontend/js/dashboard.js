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
        history.pushState({ path: pageUrl }, '', pageUrl);

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

let currentToggleClickListener = null;
let currentMouseEnterListener = null;
let currentMouseLeaveListener = null;

function applySidebarBehavior() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggleButton = document.getElementById('toggle-sidebar');
    const appLayoutWrapper = document.querySelector('.app-layout-wrapper');

    if (!sidebar || !sidebarToggleButton || !appLayoutWrapper) {
        console.warn("Elementos de la barra lateral no encontrados para aplicar comportamiento.");
        return;
    }

    if (currentToggleClickListener) {
        sidebarToggleButton.removeEventListener('click', currentToggleClickListener);
        currentToggleClickListener = null;
    }
    if (currentMouseEnterListener) {
        sidebar.removeEventListener('mouseenter', currentMouseEnterListener);
        currentMouseEnterListener = null;
    }
    if (currentMouseLeaveListener) {
        sidebar.removeEventListener('mouseleave', currentMouseLeaveListener);
        currentMouseLeaveListener = null;
    }

    if (window.innerWidth > 768) {
        console.log("Aplicando comportamiento de HOVER para escritorio.");

        sidebar.classList.add('closed');
        appLayoutWrapper.classList.add('sidebar-closed');

        currentMouseEnterListener = () => {
            console.log("Mouse ENTER en sidebar (desktop).");
            sidebar.classList.remove('closed');
            appLayoutWrapper.classList.remove('sidebar-closed');
        };
        sidebar.addEventListener('mouseenter', currentMouseEnterListener);

        currentMouseLeaveListener = () => {
            console.log("Mouse LEAVE en sidebar (desktop).");
            sidebar.classList.add('closed');
            appLayoutWrapper.classList.add('sidebar-closed');
        };
        sidebar.addEventListener('mouseleave', currentMouseLeaveListener);
        sidebarToggleButton.style.display = 'none';

    } else {
        console.log("Aplicando comportamiento de CLICK para móvil/tablet.");

        sidebar.classList.add('closed');
        appLayoutWrapper.classList.add('sidebar-closed');
        sidebar.classList.remove('open-mobile');

        currentToggleClickListener = () => {
            console.log("Clic en botón de toggle (móvil/tablet).");
            sidebar.classList.toggle('open-mobile');

            if (sidebar.classList.contains('open-mobile')) {
                sidebar.classList.remove('closed');
            } else {
                sidebar.classList.add('closed');
            }

            console.log("Estado de la barra lateral (móvil):", sidebar.classList.contains('open-mobile') ? 'abierta' : 'cerrada');
            window.dispatchEvent(new CustomEvent('mainContentLoaded'));
        };
        sidebarToggleButton.addEventListener('click', currentToggleClickListener);

        sidebarToggleButton.style.display = 'block';
    }
}

async function initDashboard() {
    console.log("Iniciando initDashboard...");

    await loadSidebar();
    applySidebarBehavior();

    window.addEventListener('resize', () => {
        console.log("Cambio de tamaño de ventana detectado. Re-aplicando comportamiento de sidebar.");
        applySidebarBehavior();
    });

    const registerEmployeesLink = document.getElementById('register-employees-link');
    const logoutButton = document.getElementById('sidebar-logout-button');
    const usernameDisplay = document.querySelector('.sidebar-user .username');

    function checkAuthAndRole() {
        const jwtToken = localStorage.getItem('accessToken');
        const userRole = localStorage.getItem('role');
        const username = localStorage.getItem('username');

        if (registerEmployeesLink) {
            registerEmployeesLink.style.display = 'none';
        }

        if (!jwtToken || !userRole || !username) {
            console.log("No se encontró token JWT, rol de usuario o nombre de usuario. Redirigiendo a login.");
            window.location.href = 'login.html';
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
            window.location.href = 'login.html';
        });
    } else {
        console.warn("Botón de cerrar sesión con ID 'sidebar-logout-button' no encontrado después de cargar la barra lateral.");
    }

    checkAuthAndRole();

    loadPageContent('html/home.html');
    console.log("Cargando contenido inicial: /Frontend/html/home.html");
}

window.addEventListener('popstate', (event) => {
    // Si el estado tiene una ruta, cárgala
    if (event.state && event.state.path) {
        console.log("Navegando con popstate a:", event.state.path);
        loadPageContent(event.state.path);
    } else {
        // Si no hay estado (ej. al cargar la página por primera vez),
        // carga la página inicial o la que corresponda a la URL actual
        console.log("Popstate sin estado, cargando página actual o predeterminada.");
        // Puedes poner aquí la lógica para cargar la página basada en window.location.pathname
        // Por ejemplo, si tu URL es /Frontend/html/persInfo.html, cargar persInfo.html
        const currentPath = window.location.pathname;
        const lastSegment = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        if (lastSegment && lastSegment.endsWith('.html')) {
            loadPageContent(`html/${lastSegment}`);
        } else {
            loadPageContent('/Frontend/html/home.html'); // O tu página por defecto
        }
    }
});

document.addEventListener('DOMContentLoaded', initDashboard);
