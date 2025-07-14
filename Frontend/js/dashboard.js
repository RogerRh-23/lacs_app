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
            setTimeout(() => {
                if (typeof setupSidebarDropdowns === 'function') {
                    setupSidebarDropdowns();
                }
            }, 100);
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
    const usernameDisplay = document.querySelector('.sidebar-user .username');
    const userRoleText = document.querySelector('.sidebar-user .user-role-text');
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



function setupSidebarDropdowns() {
    if (!_getSidebarElements()) return;

    const registerEmployeesLink = document.getElementById('register-employees-link');
    const logoutButton = document.getElementById('sidebar-logout-button');
    const usernameDisplay = document.querySelector('.sidebar-user .username');
    const userRoleText = document.querySelector('.sidebar-user .user-role-text');
    const userDropdown = sidebarElement.querySelector('#user-dropdown');
    const empContent = sidebarElement.querySelector('#employees-dropdown-content');

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

        if (userRoleText) {
            userRoleText.textContent = userRole;
        }

        if (userRole === 'admin') {
            if (registerEmployeesLink) {
                registerEmployeesLink.style.display = 'block';
            }
        }
    }

    if (logoutButton) {
        logoutButton.onclick = (event) => {
            event.preventDefault();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        };
    } else {
        console.warn("[setupSidebarDropdowns] Botón de cerrar sesión con ID 'sidebar-logout-button' no encontrado después de cargar la barra lateral.");
    }

    // Delegación de eventos para dropdowns (robusta y con logs)
    if (sidebarElement) {
        sidebarElement.onclick = null;
        document.onclick = null;

        console.log('[setupSidebarDropdowns] Estado inicial de dropdowns:', {
            userDropdown: userDropdown ? userDropdown.classList : 'No encontrado',
            empContent: empContent ? empContent.classList : 'No encontrado'
        });

        sidebarElement.addEventListener('click', function(event) {
            console.log('[DEBUG] Click detectado en sidebarElement:', event.target);
            const userDropdown = sidebarElement.querySelector('#user-dropdown');
            const empContent = sidebarElement.querySelector('#employees-dropdown-content');

            if (userDropdown) {
                console.log('[DEBUG] Estado actual de userDropdown:', {
                    classList: userDropdown.classList,
                    styles: window.getComputedStyle(userDropdown)
                });
            }

            if (empContent) {
                console.log('[DEBUG] Estado actual de empContent:', {
                    classList: empContent.classList,
                    styles: window.getComputedStyle(empContent)
                });
            }

            // Usuario: click en avatar o bloque principal
            if (event.target.closest('.sidebar-user')) {
                console.log('[DEBUG] Click en .sidebar-user');
                if (!event.target.closest('#user-dropdown')) {
                    event.stopPropagation();
                    if (userDropdown) {
                        userDropdown.classList.toggle('show');
                        if (userDropdown.classList.contains('show')) {
                            document.body.appendChild(userDropdown); // Mover al final del body
                            userDropdown.style.position = 'absolute';
                            userDropdown.style.top = `${event.target.getBoundingClientRect().bottom}px`;
                            userDropdown.style.left = `${sidebarElement.getBoundingClientRect().left + 10}px`; // Ajustar posición horizontal
                            userDropdown.style.display = 'block';
                            userDropdown.style.opacity = '1';
                            userDropdown.style.zIndex = '9999'; // Forzar z-index
                        } else {
                            sidebarElement.appendChild(userDropdown); // Restaurar al contenedor original
                            userDropdown.style.display = 'none';
                            userDropdown.style.opacity = '0';
                            userDropdown.style.zIndex = '';
                        }
                        console.log('[Dropdown] Usuario: toggle show', userDropdown.classList);
                    }
                }
                return;
            }
            // Empleados: click en botón
            if (event.target.closest('#employees-dropdown-toggle')) {
                console.log('[DEBUG] Click en #employees-dropdown-toggle');
                if (!event.target.closest('#employees-dropdown-content')) {
                    event.stopPropagation();
                    if (empContent) {
                        empContent.classList.toggle('show');
                        if (empContent.classList.contains('show')) {
                            document.body.appendChild(empContent); // Mover al final del body
                            empContent.style.position = 'absolute';
                            empContent.style.top = `${event.target.getBoundingClientRect().bottom}px`;
                            empContent.style.left = `${sidebarElement.getBoundingClientRect().left + 10}px`; // Ajustar posición horizontal
                            empContent.style.display = 'block';
                            empContent.style.opacity = '1';
                            empContent.style.zIndex = '9999'; // Forzar z-index
                        } else {
                            sidebarElement.appendChild(empContent); // Restaurar al contenedor original
                            empContent.style.display = 'none';
                            empContent.style.opacity = '0';
                            empContent.style.zIndex = '';
                        }
                        console.log('[Dropdown] Empleados: toggle show', empContent.classList);
                    }
                }
                return;
            }
        });

        document.addEventListener('click', function(event) {
            console.log('[DEBUG] Click detectado en document:', event.target);
            const userDropdown = sidebarElement.querySelector('#user-dropdown');
            const empContent = sidebarElement.querySelector('#employees-dropdown-content');
            if (userDropdown && !userDropdown.contains(event.target) && !event.target.closest('.sidebar-user')) {
                userDropdown.classList.remove('show');
                console.log('[Dropdown] Usuario: close');
            }
            if (empContent && !empContent.contains(event.target) && !event.target.closest('#employees-dropdown-toggle')) {
                empContent.classList.remove('show');
                console.log('[Dropdown] Empleados: close');
            }
        });
    }

    // Cierra ambos dropdowns al cerrar la sidebar
    function closeDropdownsOnSidebarClose() {
        const userDropdown = sidebarElement.querySelector('#user-dropdown');
        const empContent = sidebarElement.querySelector('#employees-dropdown-content');
        if (!sidebarElement.classList.contains('sidebar--open')) {
            if (userDropdown) userDropdown.classList.remove('show');
            if (empContent) empContent.classList.remove('show');
        }
    }
    // Observa cambios de clase en la sidebar para ocultar dropdowns
    const observer = new MutationObserver(() => {
        if (!sidebarElement.classList.contains('sidebar--open')) {
            const userDropdown = sidebarElement.querySelector('#user-dropdown');
            const empContent = sidebarElement.querySelector('#employees-dropdown-content');
            if (userDropdown && userDropdown.classList.contains('show')) {
                userDropdown.classList.remove('show');
                sidebarElement.appendChild(userDropdown); // Restaurar al contenedor original
                userDropdown.style.display = 'none';
                userDropdown.style.opacity = '0';
                userDropdown.style.zIndex = '';
            }
            if (empContent && empContent.classList.contains('show')) {
                empContent.classList.remove('show');
                sidebarElement.appendChild(empContent); // Restaurar al contenedor original
                empContent.style.display = 'none';
                empContent.style.opacity = '0';
                empContent.style.zIndex = '';
            }
        }
    });

    observer.observe(sidebarElement, { attributes: true, attributeFilter: ['class'] });

    loadScript('/Frontend/js/animations.js', 'animationsScript');
    checkAuthAndRole();
}

async function initDashboard() {
    await loadSidebarHtml();

    // Asegurarse de que los elementos existan antes de adjuntar listeners
    // Se usa setTimeout para dar tiempo al DOM a renderizarse después de innerHTML
    setTimeout(() => {
        if (_getSidebarElements()) {
            applySidebarBehavior();
            setupSidebarDropdowns();

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
        } else {
            console.error("[initDashboard] No se pudieron obtener los elementos de la sidebar después de la carga inicial.");
        }
    }, 100); // Aumentar el tiempo de espera si es necesario

    window.addEventListener('resize', () => {
        applySidebarBehavior();
        setupSidebarDropdowns();
        if (window.initCustomScrollbar) { setTimeout(window.initCustomScrollbar, 50); }
    });
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
