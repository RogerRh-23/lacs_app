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

function loadScript(src, id, callback) {
    let scriptElement = document.getElementById(id);
    if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.src = src;
        scriptElement.id = id;
        scriptElement.onload = () => {
            if (callback) callback();
        };
        document.body.appendChild(scriptElement);
    } else {
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

        if (pageUrl === '/Frontend/html/persInfo.html') {
            loadScript('/Frontend/js/persInfo.js', 'persInfoScript'); // persInfo.js si tiene lógica específica
        } else if (pageUrl === '/Frontend/html/incidencias.html') {
            loadScript('/Frontend/js/incidencias.js', 'incidenciasScript', () => { // ¡NUEVO! Carga incidencias.js
                if (window.initIncidenciasLogic) {
                    window.initIncidenciasLogic();
                }
            });
        }

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
    if (!_getSidebarElements()) {
        console.warn("[applySidebarBehavior] Elementos de la barra lateral no encontrados al inicio. Reintentando en 100ms.");
        setTimeout(applySidebarBehavior, 100);
        return;
    }

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
        sidebarElement.classList.add('sidebar--closed');
        appLayoutWrapper.classList.add('sidebar-closed');
        sidebarElement.classList.remove('sidebar--open');
        sidebarToggleButton.style.display = 'none';

        currentMouseEnterListener = () => {
            sidebarElement.classList.remove('sidebar--closed');
            sidebarElement.classList.add('sidebar--open');
            appLayoutWrapper.classList.remove('sidebar-closed');
            if (window.initCustomScrollbar) { setTimeout(window.initCustomScrollbar, 50); }
            toggleSidebarLogoVisibility(true);
        };
        sidebarElement.addEventListener('mouseenter', currentMouseEnterListener);

        currentMouseLeaveListener = () => {
            sidebarElement.classList.add('sidebar--closed');
            appLayoutWrapper.classList.add('sidebar-closed');
            sidebarElement.classList.remove('sidebar--open');
            if (window.initCustomScrollbar) { setTimeout(window.initCustomScrollbar, 50); }
            toggleSidebarLogoVisibility(false);
        };
        sidebarElement.addEventListener('mouseleave', currentMouseLeaveListener);

    } else {
        sidebarElement.classList.add('sidebar--closed');
        appLayoutWrapper.classList.add('sidebar-closed');
        sidebarElement.classList.remove('sidebar--open');
        sidebarToggleButton.style.display = 'block';

        currentToggleClickListener = () => {
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
    await loadSidebarHtml();

    setTimeout(() => {
        if (_getSidebarElements()) {
            applySidebarBehavior();
        } else {
            console.error("[initDashboard] No se pudieron obtener los elementos de la sidebar después de la carga inicial.");
        }
    }, 50);


    window.addEventListener('resize', () => {
        applySidebarBehavior();
        if (window.initCustomScrollbar) { setTimeout(window.initCustomScrollbar, 50); }
    });

    const registerEmployeesLink = document.getElementById('register-employees-link');
    const logoutButton = document.getElementById('sidebar-logout-button');
    const usernameDisplay = document.querySelector('.sidebar-user .username .user-name-text'); // ACTUALIZADO: Selector para el nombre de usuario
    const userMenuBtn = document.getElementById('user-menu-btn'); // Referencia al botón del usuario

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

        // Si existe el elemento user-role-text, actualízalo también
        const userRoleText = document.querySelector('.sidebar-user .user-role-text');
        if (userRoleText) {
            userRoleText.textContent = userRole; // Asumiendo que el rol se guarda en localStorage
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

    // Lógica para el dropdown del usuario (simplificada, si se necesita un dropdown real, se puede expandir)
    if (userMenuBtn) {
        const userDropdown = document.getElementById('user-dropdown');
        if (userDropdown) {
            userMenuBtn.addEventListener('click', (event) => {
                event.stopPropagation(); // Evita que el clic se propague y cierre el dropdown inmediatamente
                userDropdown.classList.toggle('show');
            });

            // Cerrar el dropdown si se hace clic fuera
            document.addEventListener('click', (event) => {
                if (!userMenuBtn.contains(event.target) && !userDropdown.contains(event.target)) {
                    userDropdown.classList.remove('show');
                }
            });
        }
    }


    loadScript('/Frontend/js/animations.js', 'animationsScript');

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
}

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.path) {
        loadPageContent(event.state.path);
    } else {
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
