// js/persInfoTabLoader.js

// Función para cargar un fragmento HTML en un elemento específico
async function loadFragment(elementId, filePath) {
    console.log(`[persInfoTabLoader] Intentando cargar fragmento en #${elementId} desde: ${filePath}`);
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            console.error(`[persInfoTabLoader] Error HTTP! estado: ${response.status} al cargar ${filePath}`);
            throw new Error(`HTTP error! status: ${response.status} al cargar ${filePath}`);
        }
        const html = await response.text();
        const targetElement = document.getElementById(elementId);
        if (targetElement) {
            targetElement.innerHTML = html; // Inyecta el HTML

            // --- NUEVO: Ejecutar scripts dentro del HTML inyectado ---
            // Esto es crucial para que la lógica JS dentro de los fragmentos funcione
            const scripts = targetElement.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.textContent = oldScript.textContent;
                // Si el script tiene un src, cárgalo de nuevo
                if (oldScript.src) {
                    newScript.src = oldScript.src;
                }
                oldScript.parentNode.removeChild(oldScript); // Elimina el script viejo
                targetElement.appendChild(newScript); // Añade el nuevo script para que se ejecute
            });
            // --------------------------------------------------------

            console.log(`[persInfoTabLoader] Fragmento ${filePath} cargado con éxito en #${elementId}`);
            return true;
        } else {
            console.error(`[persInfoTabLoader] Elemento con ID #${elementId} no encontrado para cargar fragmento. Asegúrate de que el div exista en persInfo.html.`);
            return false;
        }
    } catch (error) {
        console.error(`[persInfoTabLoader] Error al cargar el fragmento ${filePath}:`, error);
        return false;
    }
}

// Función para activar una pestaña y cargar su contenido
const activateTabAndLoadContent = async (targetTabId) => {
    console.log(`[persInfoTabLoader] Activando pestaña y cargando contenido para: ${targetTabId}`);
    const tabButtons = document.querySelectorAll('.tab-navigation .tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Desactivar todas las pestañas y contenidos
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Activar la pestaña y el contenido objetivo
    const activeButton = document.querySelector(`.tab-button[data-tab="${targetTabId}"]`);
    const activeContentDiv = document.getElementById(targetTabId);

    if (activeButton) activeButton.classList.add('active');
    if (activeContentDiv) activeContentDiv.classList.add('active');
    else {
        console.error(`[persInfoTabLoader] El div de contenido para la pestaña #${targetTabId} no se encontró en persInfo.html.`);
        return;
    }

    const fragmentPath = `html/persinfo/${targetTabId}.html`;

    // Cargar el fragmento HTML dentro del div de contenido de la pestaña
    const loaded = await loadFragment(targetTabId, fragmentPath);

    // La lógica de beneficiarios ahora se ejecutará si el script está dentro de adicional-beneficiarios.html
    // y loadFragment lo evalúa. Por lo tanto, no necesitamos un attachBeneficiaryListeners() aquí.
};

// Inicializar la lógica de pestañas cuando el DOM de persInfo.html esté listo
const initPersInfoTabs = () => {
    console.log("[persInfoTabLoader] initPersInfoTabs llamado. Configurando listeners de pestañas.");
    const tabButtons = document.querySelectorAll('.tab-navigation .tab-button');

    tabButtons.forEach(button => {
        button.removeEventListener('click', handleTabClick); // Evitar duplicados
        button.addEventListener('click', handleTabClick);
    });

    // Activar la pestaña correcta al cargar la página (por hash o por defecto)
    const currentHash = window.location.hash.substring(1);
    const defaultTab = 'datos-personales';

    if (currentHash && document.getElementById(currentHash)) {
        console.log(`[persInfoTabLoader] Activando pestaña desde hash: ${currentHash}`);
        activateTabAndLoadContent(currentHash);
    } else {
        console.log(`[persInfoTabLoader] No hay hash o es inválido, activando pestaña por defecto: ${defaultTab}`);
        activateTabAndLoadContent(defaultTab);
    }
};

// Función de manejo de clic para las pestañas
function handleTabClick(event) {
    const targetTab = event.target.dataset.tab;
    console.log(`[persInfoTabLoader] Clic en pestaña: ${targetTab}`);
    activateTabAndLoadContent(targetTab);
}

// Manejar el evento popstate para que los botones de atrás/adelante del navegador funcionen
window.addEventListener('popstate', (event) => {
    console.log("[persInfoTabLoader] Evento popstate detectado.", event.state);
    if (event.state && event.state.page === 'persInfo' && event.state.tab) {
        console.log("[persInfoTabLoader] Popstate para persInfo, activando pestaña:", event.state.tab);
        activateTabAndLoadContent(event.state.tab);
    } else if (window.location.hash) {
        const targetTabId = window.location.hash.substring(1);
        console.log("[persInfoTabLoader] Popstate con hash sin estado, activando pestaña:", targetTabId);
        activateTabAndLoadContent(targetTabId);
    } else {
        const firstTabButton = document.querySelector('.tab-navigation .tab-button');
        if (firstTabButton) {
            const firstTabId = firstTabButton.dataset.tab;
            console.log("[persInfoTabLoader] Popstate sin hash ni estado, activando primera pestaña:", firstTabId);
            activateTabAndLoadContent(firstTabId);
        }
    }
});

// Exportar la función de inicialización para que dashboard.js pueda llamarla
window.initPersInfoTabs = initPersInfoTabs;
