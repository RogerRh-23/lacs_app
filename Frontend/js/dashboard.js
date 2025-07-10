// js/dashboard.js

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

        // Manejo de la URL en el historial del navegador
        let newUrl = pageUrl;
        if (pageUrl === '/Frontend/html/persInfo.html' && window.location.hash) {
            newUrl += window.location.hash;
        }
        // Usar newUrl para que el hash se mantenga en la URL si aplica
        history.pushState({ path: pageUrl }, '', newUrl);

        // --- Lógica para cargar y ejecutar scripts específicos de la página ---
        if (pageUrl === '/Frontend/html/persInfo.html') {
            let persInfoScript = document.getElementById('persInfoScript');
            if (!persInfoScript) {
                persInfoScript = document.createElement('script');
                persInfoScript.src = '/Frontend/js/persInfo.js'; // Asegúrate que esta ruta sea correcta
                persInfoScript.id = 'persInfoScript';
                persInfoScript.onload = () => {
                    console.log("[dashboard.js] persInfo.js cargado.");
                    // Cargar persInfoTabLoader.js DESPUÉS de persInfo.js
                    if (!document.getElementById('persInfoTabLoaderScript')) {
                        const tabLoaderScript = document.createElement('script');
                        tabLoaderScript.src = '/Frontend/js/persInfoTabLoader.js'; // Asegúrate que esta ruta sea correcta
                        tabLoaderScript.id = 'persInfoTabLoaderScript';
                        tabLoaderScript.onload = () => {
                            console.log("persInfoTabLoader.js cargado. Inicializando...");
                            if (window.initPersInfoTabs) {
                                window.initPersInfoTabs();
                            }
                        };
                        document.body.appendChild(tabLoaderScript);
                    } else {
                        console.log("persInfoTabLoader.js ya cargado. Re-inicializando...");
                        if (window.initPersInfoTabs) {
                            window.initPersInfoTabs();
                        }
                    }
                };
                document.body.appendChild(persInfoScript);
            } else {
                console.log("[dashboard.js] persInfo.js ya cargado. Re-inicializando lógica de pestaña.");
                // Si persInfo.js ya está cargado, intenta inicializar el TabLoader de nuevo
                if (!document.getElementById('persInfoTabLoaderScript')) {
                    const tabLoaderScript = document.createElement('script');
                    tabLoaderScript.src = '/Frontend/js/persInfoTabLoader.js';
                    tabLoaderScript.id = 'persInfoTabLoaderScript';
                    tabLoaderScript.onload = () => {
                        console.log("persInfoTabLoader.js cargado. Inicializando...");
                        if (window.initPersInfoTabs) {
                            window.initPersInfoTabs();
                        }
                    };
                    document.body.appendChild(tabLoaderScript);
                } else {
                    console.log("persInfoTabLoader.js ya cargado. Re-inicializando...");
                    if (window.initPersInfoTabs) {
                        window.initPersInfoTabs();
                    }
                }
            }
        }
        // Para incidencias.html (y cualquier otra página con lógica específica)
        else if (pageUrl === '/Frontend/html/incidencias.html') {
            let incidenciasScript = document.getElementById('incidenciasScript');
            if (!incidenciasScript) {
                incidenciasScript = document.createElement('script');
                incidenciasScript.src = '/Frontend/js/incidencias.js';
                incidenciasScript.id = 'incidenciasScript';
                incidenciasScript.onload = () => {
                    console.log("[dashboard.js] incidencias.js cargado.");
                    if (window.initIncidenciasLogic) {
                        window.initIncidenciasLogic();
                    }
                };
                document.body.appendChild(incidenciasScript);
            } else {
                console.log("[dashboard.js] incidencias.js ya cargado. Re-inicializando lógica.");
                if (window.initIncidenciasLogic) {
                    window.initIncidenciasLogic();
                }
            }
        }
        // ... (añade más `else if` para otros scripts de página si los tienes)

        // --- ¡Importante! Re-inicializar el scrollbar después de cargar CUALQUIER contenido ---
        // Asegúrate de que scrollbar.js se haya cargado y exponga window.initCustomScrollbar
        if (window.initCustomScrollbar) {
            console.log("[dashboard.js] Re-inicializando scrollbar después de cargar contenido.");
            // Pequeño retraso para asegurar que el contenido se ha renderizado y el DOM está listo
            setTimeout(window.initCustomScrollbar, 50);
        } else {
            // Si scrollbar.js aún no se ha cargado, cárgalo y luego inicialízalo
            let scrollbarScript = document.getElementById('scrollbarScript');
            if (!scrollbarScript) {
                scrollbarScript = document.createElement('script');
                scrollbarScript.src = '/Frontend/js/scrollbar.js'; // Asegúrate que esta ruta sea correcta
                scrollbarScript.id = 'scrollbarScript';
                scrollbarScript.onload = () => {
                    console.log("[dashboard.js] scrollbar.js cargado. Inicializando...");
                    if (window.initCustomScrollbar) {
                        setTimeout(window.initCustomScrollbar, 50);
                    }
                };
                document.body.appendChild(scrollbarScript);
            } else {
                console.log("[dashboard.js] scrollbar.js ya cargado. Re-inicializando...");
                setTimeout(window.initCustomScrollbar, 50);
            }
        }
        // ------------------------------------------------------------------------------------

        window.dispatchEvent(new CustomEvent('mainContentLoaded', { detail: { pageUrl: pageUrl } }));

    } catch (error) {
        console.error(`Fallo al cargar contenido de ${pageUrl}:`, error);
        mainContentArea.innerHTML = `<p style="color: red; text-align: center; padding: 50px;">Error al cargar la página: ${error.message}. Por favor, verifica la ruta del archivo.</p>`;
    }
};

async function loadSidebar() {
    try {
        console.log("Intentando cargar /Frontend/html/sidebar.html...");
        const response = await fetch('/Frontend/html/sidebar.html');

        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }

        const sidebarHtml = await response.text();
        console.log("/Frontend/html/sidebar.html cargado con éxito. Procesando contenido...");

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
        console.warn("Elementos de la barra lateral no encontrados para aplicar comportamiento. Esto puede ocurrir si la sidebar aún no ha sido cargada.");
        // Intentar volver a aplicar el comportamiento después de un pequeño retraso
        setTimeout(applySidebarBehavior, 100);
        return;
    }

    // Remueve listeners anteriores para evitar duplicados al re-aplicar
    if (currentToggleClickListener) {
        sidebarToggleButton.removeEventListener('click', currentToggleClickListener);
    }
    if (currentMouseEnterListener) {
        sidebar.removeEventListener('mouseenter', currentMouseEnterListener);
    }
    if (currentMouseLeaveListener) {
        sidebar.removeEventListener('mouseleave', currentMouseLeaveListener);
    }

    if (window.innerWidth > 768) {
        console.log("Aplicando comportamiento de HOVER para escritorio.");

        sidebar.classList.add('closed');
        appLayoutWrapper.classList.add('sidebar-closed');
        sidebarToggleButton.style.display = 'none'; // Oculta el botón de toggle en escritorio

        currentMouseEnterListener = () => {
            console.log("Mouse ENTER en sidebar (desktop).");
            sidebar.classList.remove('closed');
            appLayoutWrapper.classList.remove('sidebar-closed');
            // Re-inicializar scrollbar al abrir la sidebar
            if (window.initCustomScrollbar) { setTimeout(window.initCustomScrollbar, 50); }
        };
        sidebar.addEventListener('mouseenter', currentMouseEnterListener);

        currentMouseLeaveListener = () => {
            console.log("Mouse LEAVE en sidebar (desktop).");
            sidebar.classList.add('closed');
            appLayoutWrapper.classList.add('sidebar-closed');
            // Re-inicializar scrollbar al cerrar la sidebar
            if (window.initCustomScrollbar) { setTimeout(window.initCustomScrollbar, 50); }
        };
        sidebar.addEventListener('mouseleave', currentMouseLeaveListener);

    } else {
        console.log("Aplicando comportamiento de CLICK para móvil/tablet.");

        sidebar.classList.add('closed');
        appLayoutWrapper.classList.add('sidebar-closed');
        sidebar.classList.remove('open-mobile');
        sidebarToggleButton.style.display = 'block'; // Muestra el botón de toggle en móvil

        currentToggleClickListener = () => {
            console.log("Clic en botón de toggle (móvil/tablet).");
            sidebar.classList.toggle('open-mobile');

            if (sidebar.classList.contains('open-mobile')) {
                sidebar.classList.remove('closed');
            } else {
                sidebar.classList.add('closed');
            }

            console.log("Estado de la barra lateral (móvil):", sidebar.classList.contains('open-mobile') ? 'abierta' : 'cerrada');
            // Re-inicializar scrollbar al alternar la sidebar
            if (window.initCustomScrollbar) { setTimeout(window.initCustomScrollbar, 50); }
            window.dispatchEvent(new CustomEvent('mainContentLoaded')); // Esto ya lo tienes, útil para otros listeners
        };
        sidebarToggleButton.addEventListener('click', currentToggleClickListener);
    }
    // Lógica para los enlaces de la barra lateral (si están en dashboard.js)
    const sidebarLinks = document.querySelectorAll('#sidebar-placeholder .sidebar-link');
    sidebarLinks.forEach(link => {
        // Asegurarse de que el listener se añade una sola vez
        link.removeEventListener('click', handleSidebarLinkClick);
        link.addEventListener('click', handleSidebarLinkClick);
    });

    function handleSidebarLinkClick(event) {
        event.preventDefault(); // Prevenir la navegación por defecto
        const targetPage = event.currentTarget.dataset.page; // Asume que tienes data-page="/Frontend/html/persInfo.html"
        if (targetPage && window.loadPageContent) {
            console.log(`[dashboard.js] Navegando a: ${targetPage}`);
            window.loadPageContent(targetPage);
        }
    }
}

async function initDashboard() {
    console.log("Iniciando initDashboard...");

    await loadSidebar(); // Cargar la barra lateral primero
    applySidebarBehavior(); // Aplicar el comportamiento de la barra lateral después de que se carga el HTML

    window.addEventListener('resize', () => {
        console.log("Cambio de tamaño de ventana detectado. Re-aplicando comportamiento de sidebar y re-inicializando scrollbar.");
        applySidebarBehavior();
        if (window.initCustomScrollbar) { setTimeout(window.initCustomScrollbar, 50); }
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

    // El listener del botón de logout DEBE ser añadido *después* de que la sidebar se carga.
    // Moví esto aquí para asegurarme de que el elemento exista.
    // También asegúrate de que 'sidebar-logout-button' es el ID correcto en tu sidebar.html
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

    // Cargar los scripts globales que no son específicos de una página
    const scriptsToLoadOnce = [
        '/Frontend/js/animations.js', // Asegúrate que este script exista y sea necesario aquí
        '/Frontend/js/main.js'       // Asegúrate que este script exista y sea necesario aquí
    ];

    for (const scriptPath of scriptsToLoadOnce) {
        let scriptElement = document.getElementById(scriptPath.split('/').pop().replace('.js', 'Script'));
        if (!scriptElement) {
            scriptElement = document.createElement('script');
            scriptElement.src = scriptPath;
            scriptElement.id = scriptPath.split('/').pop().replace('.js', 'Script');
            scriptElement.onload = () => console.log(`${scriptPath} cargado.`);
            document.body.appendChild(scriptElement);
        }
    }


    checkAuthAndRole();

    // Determinar qué página cargar inicialmente
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash.substring(1); // Obtener el hash si existe
    const lastSegment = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    if (lastSegment && lastSegment.endsWith('.html') && lastSegment !== 'index.html') {
        loadPageContent(`/Frontend/html/${lastSegment}`);
    } else if (currentPath.includes('persInfo.html') && currentHash) {
        // Asumiendo que la ruta base es algo como / o /Frontend/
        loadPageContent('/Frontend/html/persInfo.html');
    } else {
        // Por defecto, cargar home.html
        loadPageContent('/Frontend/html/home.html');
    }
    console.log("Cargando contenido inicial después de initDashboard.");
}

// Manejar el evento popstate para que los botones de atrás/adelante del navegador funcionen
window.addEventListener('popstate', (event) => {
    console.log("[dashboard.js] Evento popstate detectado.", event.state);
    if (event.state && event.state.path) {
        console.log("[dashboard.js] Navegando con popstate a:", event.state.path);
        loadPageContent(event.state.path);
    } else {
        console.log("[dashboard.js] Popstate sin estado, cargando página actual o predeterminada.");
        const currentPath = window.location.pathname;
        const lastSegment = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        if (lastSegment && lastSegment.endsWith('.html')) {
            loadPageContent(`/Frontend/html/${lastSegment}`);
        } else {
            loadPageContent('/Frontend/html/home.html');
        }
    }
});

document.addEventListener('DOMContentLoaded', initDashboard);