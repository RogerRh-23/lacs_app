// js/dashboard.js

let sidebarElement;
let sidebarToggleButton;
let compactLogo;
let fullLogo;
let companySwitcher;
let lacsButton;
let dornishButton;
let appLayoutWrapper;

function getImagePath(imageName) {
    return `/image/${imageName}`;
}

const companyLogos = {
    'LACS': {
        compact: getImagePath('LACS - Logo.png'),
        full: getImagePath('LACS.png')
    },
    'DORNISH': {
        compact: getImagePath('DORNISH - Logo.png'),
        full: getImagePath('DORNISH.png')
    }
};

let activeCompany = 'LACS';

function _getSidebarElements() {
    sidebarElement = document.getElementById('sidebar');
    sidebarToggleButton = document.getElementById('toggle-sidebar');
    compactLogo = document.getElementById('logo-compact');
    fullLogo = document.getElementById('logo-full');
    companySwitcher = document.getElementById('company-switcher');
    lacsButton = document.getElementById('lacs-button');
    dornishButton = document.getElementById('dornish-button');
    appLayoutWrapper = document.querySelector('.app-layout-wrapper');

    if (!sidebarElement || !sidebarToggleButton || !compactLogo || !fullLogo || !companySwitcher || !lacsButton || !dornishButton || !appLayoutWrapper) {
        console.warn("[_getSidebarElements] No todos los elementos de la sidebar/layout fueron encontrados. Esto es normal si la sidebar aún no se ha cargado completamente.");
        return false;
    }
    return true;
}

function updateLogos() {
    if (!_getSidebarElements()) {
        console.warn("[updateLogos] Elementos de logo no disponibles para actualización.");
        return;
    }

    const logos = companyLogos[activeCompany];
    compactLogo.src = logos.compact;
    fullLogo.src = logos.full;
    // console.log(`[updateLogos] Estableciendo logo compacto src: ${logos.compact}`);
    // console.log(`[updateLogos] Estableciendo logo completo src: ${logos.full}`);

    if (sidebarElement.classList.contains('sidebar--open')) {
        compactLogo.style.display = 'none';
        fullLogo.style.display = 'block';
    } else {
        compactLogo.style.display = 'block';
        fullLogo.style.display = 'none';
    }
}

function toggleSidebarLogoVisibility(isOpen) {
    if (!_getSidebarElements()) {
        console.warn("[toggleSidebarLogoVisibility] Elementos de logo no disponibles.");
        return;
    }

    if (isOpen) {
        compactLogo.style.opacity = '0';
        fullLogo.style.opacity = '1';
        setTimeout(() => {
            compactLogo.style.display = 'none';
            fullLogo.style.display = 'block';
        }, 300);
    } else {
        compactLogo.style.opacity = '1';
        fullLogo.style.opacity = '0';
        setTimeout(() => {
            compactLogo.style.display = 'block';
            fullLogo.style.display = 'none';
        }, 300);
    }
}

function switchCompany(company) {
    if (activeCompany === company) {
        // console.log(`[switchCompany] La empresa '${company}' ya está activa.`);
        return;
    }
    activeCompany = company;
    console.log(`[switchCompany] Cambiando a la empresa: ${activeCompany}`);
    updateLogos();
}

async function loadSidebarHtml() {
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (!sidebarPlaceholder) {
        console.error("Error: El div 'sidebar-placeholder' no se encontró en el HTML principal. La barra lateral no se adjuntará.");
        return;
    }

    try {
        const response = await fetch('/Frontend/html/sidebar.html');
        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        const sidebarHtml = await response.text();

        sidebarPlaceholder.innerHTML = '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sidebarHtml;
        const loadedSidebarElement = tempDiv.querySelector('#sidebar');

        if (loadedSidebarElement) {
            sidebarPlaceholder.appendChild(loadedSidebarElement);
        } else {
            console.error("Error: El elemento #sidebar no se encontró dentro del contenido de sidebar.html.");
        }
    } catch (error) {
        console.error("[loadSidebarHtml] Error al cargar la barra lateral:", error);
    }
}

// Función auxiliar para cargar scripts dinámicamente
function loadScript(src, id, callback) {
    let scriptElement = document.getElementById(id);
    if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.src = src;
        scriptElement.id = id;
        scriptElement.onload = () => {
            // console.log(`${src} cargado.`);
            if (callback) callback();
        };
        document.body.appendChild(scriptElement);
    } else {
        // console.log(`${src} ya cargado.`);
        if (callback) callback();
    }
}


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

        let newUrl = pageUrl;
        if (pageUrl === '/Frontend/html/persInfo.html' && window.location.hash) {
            newUrl += window.location.hash;
        }
        history.pushState({ path: pageUrl }, '', newUrl);

        // Carga dinámica de scripts específicos de página
        if (pageUrl === '/Frontend/html/persInfo.html') {
            loadScript('/Frontend/js/persInfo.js', 'persInfoScript', () => {
                loadScript('/Frontend/js/persInfoTabLoader.js', 'persInfoTabLoaderScript', () => {
                    if (window.initPersInfoTabs) {
                        window.initPersInfoTabs();
                    }
                });
            });
        } else if (pageUrl === '/Frontend/html/incidencias.html') {
            loadScript('/Frontend/js/incidencias.js', 'incidenciasScript', () => {
                if (window.initIncidenciasLogic) {
                    window.initIncidenciasLogic();
                }
            });
        }

        // Siempre carga scrollbar.js si no está ya cargado
        loadScript('/Frontend/js/scrollbar.js', 'scrollbarScript', () => {
            if (window.initCustomScrollbar) {
                setTimeout(window.initCustomScrollbar, 50);
            }
        });

        window.dispatchEvent(new CustomEvent('mainContentLoaded', { detail: { pageUrl: pageUrl } }));

    } catch (error) {
        console.error(`Fallo al cargar contenido de ${pageUrl}:`, error);
        mainContentArea.innerHTML = `<p style="color: red; text-align: center; padding: 50px;">Error al cargar la página: ${error.message}. Por favor, verifica la ruta del archivo.</p>`;
    }
};

let currentToggleClickListener = null;
let currentMouseEnterListener = null;
let currentMouseLeaveListener = null;

function applySidebarBehavior() {
    // console.log("[applySidebarBehavior] Ejecutando applySidebarBehavior.");
    if (!_getSidebarElements()) {
        console.warn("[applySidebarBehavior] Elementos de la barra lateral no encontrados al inicio. Reintentando en 100ms.");
        setTimeout(applySidebarBehavior, 100);
        return;
    }

    // console.log("[applySidebarBehavior] Ancho de la ventana:", window.innerWidth);
    // console.log("[applySidebarBehavior] Clases de Sidebar:", sidebarElement.classList.value);
    // console.log("[applySidebarBehavior] Display de Toggle Button:", sidebarToggleButton.style.display);


    if (currentToggleClickListener) {
        sidebarToggleButton.removeEventListener('click', currentToggleClickListener);
    }
    if (currentMouseEnterListener) {
        sidebarElement.removeEventListener('mouseenter', currentMouseEnterListener);
    }
    if (currentMouseLeaveListener) {
        sidebarElement.removeEventListener('mouseleave', currentMouseLeaveListener);
    }

    if (window.innerWidth > 768) {
        // console.log("[applySidebarBehavior] Modo escritorio (HOVER).");

        sidebarElement.classList.add('sidebar--closed');
        appLayoutWrapper.classList.add('sidebar-closed');
        sidebarElement.classList.remove('sidebar--open');
        sidebarToggleButton.style.display = 'none';
        // console.log("[applySidebarBehavior] Botón de toggle oculto en escritorio.");


        currentMouseEnterListener = () => {
            // console.log("[applySidebarBehavior] Mouse ENTER en sidebar (desktop). Abriendo sidebar.");
            sidebarElement.classList.remove('sidebar--closed');
            sidebarElement.classList.add('sidebar--open');
            appLayoutWrapper.classList.remove('sidebar-closed');
            if (window.initCustomScrollbar) { setTimeout(window.initCustomScrollbar, 50); }
            toggleSidebarLogoVisibility(true);
            // console.log("[applySidebarBehavior] Clases de Sidebar después de ENTER:", sidebarElement.classList.value);
        };
        sidebarElement.addEventListener('mouseenter', currentMouseEnterListener);

        currentMouseLeaveListener = () => {
            // console.log("[applySidebarBehavior] Mouse LEAVE en sidebar (desktop). Cerrando sidebar.");
            sidebarElement.classList.add('sidebar--closed');
            sidebarElement.classList.remove('sidebar--open');
            appLayoutWrapper.classList.add('sidebar-closed');
            if (window.initCustomScrollbar) { setTimeout(window.initCustomScrollbar, 50); }
            toggleSidebarLogoVisibility(false);
            // console.log("[applySidebarBehavior] Clases de Sidebar después de LEAVE:", sidebarElement.classList.value);
        };
        sidebarElement.addEventListener('mouseleave', currentMouseLeaveListener);

    } else {
        // console.log("[applySidebarBehavior] Modo móvil/tablet (CLICK).");

        sidebarElement.classList.add('sidebar--closed');
        appLayoutWrapper.classList.add('sidebar-closed');
        sidebarElement.classList.remove('sidebar--open');
        sidebarToggleButton.style.display = 'block';
        // console.log("[applySidebarBehavior] Botón de toggle visible en móvil.");

        currentToggleClickListener = () => {
            // console.log("[applySidebarBehavior] Clic en botón de toggle (móvil/tablet).");
            sidebarElement.classList.toggle('sidebar--open');

            if (sidebarElement.classList.contains('sidebar--open')) {
                sidebarElement.classList.remove('sidebar--closed');
                appLayoutWrapper.classList.remove('sidebar-closed');
                toggleSidebarLogoVisibility(true);
            } else {
                sidebarElement.classList.add('sidebar--closed');
                appLayoutWrapper.classList.add('sidebar-closed');
                toggleSidebarLogoVisibility(false);
            }

            if (window.initCustomScrollbar) { setTimeout(window.initCustomScrollbar, 50); }
            window.dispatchEvent(new CustomEvent('mainContentLoaded'));
        };
        sidebarToggleButton.addEventListener('click', currentToggleClickListener);
    }

    if (lacsButton) lacsButton.addEventListener('click', () => switchCompany('LACS'));
    if (dornishButton) dornishButton.addEventListener('click', () => switchCompany('DORNISH'));

    updateLogos();
}


async function initDashboard() {
    // console.log("[initDashboard] Iniciando initDashboard.");
    await loadSidebarHtml();

    setTimeout(() => {
        if (_getSidebarElements()) {
            applySidebarBehavior();
        } else {
            console.error("[initDashboard] No se pudieron obtener los elementos de la sidebar después de la carga inicial.");
        }
    }, 50);


    window.addEventListener('resize', () => {
        // console.log("[resize] Cambio de tamaño de ventana detectado. Re-aplicando comportamiento de sidebar y re-inicializando scrollbar.");
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
            window.location.href = 'login.html';
            return;
        }

        if (usernameDisplay) {
            usernameDisplay.textContent = username;
        }

        if (userRole === 'admin') {
            if (registerEmployeesLink) {
                registerEmployeesLink.style.display = 'block';
            }
        }
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        });
    } else {
        console.warn("[initDashboard] Botón de cerrar sesión con ID 'sidebar-logout-button' no encontrado después de cargar la barra lateral.");
    }

    // Carga animaciones.js
    loadScript('/Frontend/js/animations.js', 'animationsScript');

    // ¡IMPORTANTE! Asegúrate de que main.js NO esté aquí si es tu script de login.
    // loadScript('/Frontend/js/main.js', 'mainScript'); // Esto NO debe estar aquí para el dashboard

    checkAuthAndRole();

    const currentPath = window.location.pathname;
    const currentHash = window.location.hash.substring(1);
    const lastSegment = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    if (lastSegment && lastSegment.endsWith('.html') && lastSegment !== 'index.html') {
        loadPageContent(`/Frontend/html/${lastSegment}`);
    } else if (currentPath.includes('persInfo.html') && currentHash) {
        loadPageContent('/Frontend/html/persInfo.html');
    } else {
        loadPageContent('/Frontend/html/home.html');
    }
    // console.log("[initDashboard] Cargando contenido inicial después de initDashboard.");
}

window.addEventListener('popstate', (event) => {
    // console.log("[popstate] Evento popstate detectado.", event.state);
    if (event.state && event.state.path) {
        // console.log("[popstate] Navegando con popstate a:", event.state.path);
        loadPageContent(event.state.path);
    } else {
        // console.log("[popstate] Popstate sin estado, cargando página actual o predeterminada.");
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
