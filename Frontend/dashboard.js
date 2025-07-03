// dashboard.js

// Definición de la función initDashboard en el ámbito global
async function initDashboard() {
    // Primero, carga la barra lateral dinámicamente
    await loadSidebar();

    // Obtener referencias a los elementos de la barra lateral (ahora que están en el DOM)
    // Estas referencias se obtienen DESPUÉS de que la barra lateral se ha cargado
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggleButton = document.getElementById('toggle-sidebar');
    const registerEmployeesLink = document.getElementById('register-employees-link');
    const logoutButton = document.getElementById('sidebar-logout-button');

    /**
     * Carga el contenido de sidebar.html directamente en el cuerpo del documento.
     */
    async function loadSidebar() {
        try {
            const response = await fetch('sidebar.html'); // Asegúrate de que la ruta sea correcta
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const sidebarHtml = await response.text();

            // Crear un elemento temporal para parsear el HTML y luego adjuntar el nav
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = sidebarHtml;
            const sidebarElement = tempDiv.querySelector('#sidebar');

            if (sidebarElement) {
                document.body.appendChild(sidebarElement);
                console.log("Sidebar loaded successfully and appended to body.");
            } else {
                console.error("Error: #sidebar element not found in sidebar.html content.");
            }
        } catch (error) {
            console.error("Error loading sidebar:", error);
        }
    }

    /**
     * Verifica el estado de autenticación y el rol del usuario,
     * y redirige o muestra el contenido apropiado.
     */
    function checkAuthAndRole() {
        // Leer el token, el rol y el nombre de usuario de localStorage
        const jwtToken = localStorage.getItem('accessToken');
        const userRole = localStorage.getItem('role');
        const username = localStorage.getItem('username');

        // Ocultar el enlace de registro de empleados por defecto
        if (registerEmployeesLink) {
            registerEmployeesLink.style.display = 'none';
        }

        // Si falta alguna de las claves, redirigir al usuario a la página de login
        if (!jwtToken || !userRole || !username) {
            console.log("No JWT token, user role or username found. Redirigiendo a login.");
            window.location.href = 'login.html';
            return;
        }

        // La lógica para mostrar contenido específico de rol se ha eliminado,
        // ya que los divs de contenido ya no están en home.html.
        // Solo se gestionará la visibilidad del enlace de registro de empleados.
        if (userRole === 'admin') {
            if (registerEmployeesLink) {
                registerEmployeesLink.style.display = 'block';
            }
            console.log(`User ${username} logged in as ADMIN.`);
        } else {
            console.log(`User ${username} logged in with role: ${userRole}.`);
        }
    }

    /**
     * Configura el evento click para el botón de cerrar sesión.
     */
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            console.log("User logged out. Clearing localStorage and redirecting to login.");
            window.location.href = 'login.html';
        });
    } else {
        console.warn("Logout button with ID 'sidebar-logout-button' not found after sidebar load.");
    }

    /**
     * Lógica para alternar la visibilidad de la barra lateral.
     */
    if (sidebarToggleButton && sidebar) {
        sidebarToggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('closed');
            console.log("Sidebar toggle button clicked. Sidebar state:", sidebar.classList.contains('closed') ? 'closed' : 'open');
        });
    } else {
        console.warn("Sidebar toggle elements (button or sidebar) not found after sidebar load. Sidebar toggle functionality may not work.");
    }

    // Ejecutar la verificación de autenticación y rol después de cargar la barra lateral
    checkAuthAndRole();
}

// Este listener asegura que initDashboard se llama una vez que el DOM está completamente cargado.
document.addEventListener('DOMContentLoaded', initDashboard);
