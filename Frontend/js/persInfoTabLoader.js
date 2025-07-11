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

const activateTabAndLoadContent = async (targetTabId) => {
    console.log(`[persInfoTabLoader] Activando pestaña y cargando contenido para: ${targetTabId}`);
    const tabButtons = document.querySelectorAll('.tab-navigation .tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    const activeButton = document.querySelector(`.tab-button[data-tab="${targetTabId}"]`);
    const activeContentDiv = document.getElementById(targetTabId);

    if (activeButton) activeButton.classList.add('active');
    if (activeContentDiv) activeContentDiv.classList.add('active');
    else {
        console.error(`[persInfoTabLoader] El div de contenido para la pestaña #${targetTabId} no se encontró en persInfo.html.`);
        return;
    }

    const fragmentPath = `/Frontend/html/persinfo/${targetTabId}.html`;

    const loaded = await loadFragment(targetTabId, fragmentPath);

    if (loaded && window.initPersInfoLogic) {
        console.log(`[persInfoTabLoader] Llamando a initPersInfoLogic para la pestaña: ${targetTabId}`);
        window.initPersInfoLogic(targetTabId); // Pasa el ID de la pestaña activa
    } else if (!window.initPersInfoLogic) {
        console.warn("[persInfoTabLoader] window.initPersInfoLogic no está definido. Asegúrate de que persInfo.js se haya cargado ANTES de persInfoTabLoader.js.");
    }

    history.pushState({ tab: targetTabId, page: 'persInfo' }, '', `#${targetTabId}`);
};

const initPersInfoTabs = () => {
    console.log("[persInfoTabLoader] initPersInfoTabs llamado. Configurando listeners de pestañas.");
    const tabButtons = document.querySelectorAll('.tab-navigation .tab-button');

    tabButtons.forEach(button => {
        button.removeEventListener('click', handleTabClick);
        button.addEventListener('click', handleTabClick);
    });

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

function handleTabClick(event) {
    const targetTab = event.target.dataset.tab;
    console.log(`[persInfoTabLoader] Clic en pestaña: ${targetTab}`);
    activateTabAndLoadContent(targetTab);
}

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

window.initPersInfoTabs = initPersInfoTabs;
