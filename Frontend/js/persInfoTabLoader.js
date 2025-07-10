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

    // Construir la ruta del fragmento HTML
    // Basado en tu estructura de carpetas: Frontend/html/persinfo/nombre-del-fragmento.html
    const fragmentPath = `/Frontend/html/persinfo/${targetTabId}.html`;

    // Cargar el fragmento HTML dentro del div de contenido de la pestaña
    const loaded = await loadFragment(targetTabId, fragmentPath);

    // --- Llamar a la lógica de inicialización de persInfo.js después de cargar el fragmento ---
    // Esto es crucial para que la lógica de formularios y beneficiarios se adjunte al DOM inyectado.
    if (loaded && window.initPersInfoLogic) {
        console.log(`[persInfoTabLoader] Llamando a initPersInfoLogic para la pestaña: ${targetTabId}`);
        window.initPersInfoLogic(targetTabId); // Pasa el ID de la pestaña activa
    } else if (!window.initPersInfoLogic) {
        console.warn("[persInfoTabLoader] window.initPersInfoLogic no está definido. Asegúrate de que persInfo.js se haya cargado ANTES de persInfoTabLoader.js.");
    }
    // ------------------------------------------------------------------------------------------------

    // Actualizar el hash de la URL para que los botones de atrás/adelante funcionen
    history.pushState({ tab: targetTabId, page: 'persInfo' }, '', `#${targetTabId}`);
};

// Inicializar la lógica de pestañas cuando el DOM de persInfo.html esté listo
// Esta función es llamada por dashboard.js una vez que persInfo.html se ha cargado.
const initPersInfoTabs = () => {
    console.log("[persInfoTabLoader] initPersInfoTabs llamado. Configurando listeners de pestañas.");
    const tabButtons = document.querySelectorAll('.tab-navigation .tab-button');

    tabButtons.forEach(button => {
        button.removeEventListener('click', handleTabClick); // Evitar duplicados si se llama varias veces
        button.addEventListener('click', handleTabClick);
    });

    // Activar la pestaña correcta al cargar la página (por hash o por defecto)
    const currentHash = window.location.hash.substring(1); // Obtiene el hash sin el '#'
    const defaultTab = 'datos-personales'; // Tu pestaña por defecto

    // Si hay un hash válido en la URL, activa esa pestaña; de lo contrario, activa la por defecto.
    if (currentHash && document.getElementById(currentHash)) {
        console.log(`[persInfoTabLoader] Activando pestaña desde hash: ${currentHash}`);
        activateTabAndLoadContent(currentHash);
    } else {
        console.log(`[persInfoTabLoader] No hay hash o es inválido, activando pestaña por defecto: ${defaultTab}`);
        activateTabAndLoadContent(defaultTab);
    }
};

// Función de manejo de clic para los botones de las pestañas
function handleTabClick(event) {
    const targetTab = event.target.dataset.tab;
    console.log(`[persInfoTabLoader] Clic en pestaña: ${targetTab}`);
    activateTabAndLoadContent(targetTab);
}

// Manejar el evento popstate para que los botones de atrás/adelante del navegador funcionen
// Esto permite que la navegación del historial del navegador cambie las pestañas.
window.addEventListener('popstate', (event) => {
    console.log("[persInfoTabLoader] Evento popstate detectado.", event.state);
    // Verifica si el estado del historial corresponde a una pestaña de persInfo
    if (event.state && event.state.page === 'persInfo' && event.state.tab) {
        console.log("[persInfoTabLoader] Popstate para persInfo, activando pestaña:", event.state.tab);
        activateTabAndLoadContent(event.state.tab);
    } else if (window.location.hash) {
        // Si hay un hash en la URL pero no en el estado (ej. primera carga con hash directo)
        const targetTabId = window.location.hash.substring(1);
        console.log("[persInfoTabLoader] Popstate con hash sin estado, activando pestaña:", targetTabId);
        activateTabAndLoadContent(targetTabId);
    } else {
        // Si no hay hash ni estado, vuelve a la primera pestaña por defecto
        const firstTabButton = document.querySelector('.tab-navigation .tab-button');
        if (firstTabButton) {
            const firstTabId = firstTabButton.dataset.tab;
            console.log("[persInfoTabLoader] Popstate sin hash ni estado, activando primera pestaña:", firstTabId);
            activateTabAndLoadContent(firstTabId);
        }
    }
});

// Exportar la función de inicialización para que dashboard.js pueda llamarla
// Esto hace que `initPersInfoTabs` sea accesible globalmente una vez que este script se carga.
window.initPersInfoTabs = initPersInfoTabs;
