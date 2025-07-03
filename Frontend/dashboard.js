async function initDashboard() {
    await loadSidebar();

    const sidebar = document.querySelector('.sidebar');
    const sidebarToggleButton = document.getElementById('toggle-sidebar');
    const registerEmployeesLink = document.getElementById('register-employees-link');
    const logoutButton = document.getElementById('sidebar-logout-button');

    async function loadSidebar() {
        try {
            const response = await fetch('sidebar.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const sidebarHtml = await response.text();

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

    function checkAuthAndRole() {
        const jwtToken = localStorage.getItem('accessToken');
        const userRole = localStorage.getItem('role');
        const username = localStorage.getItem('username');

        if (registerEmployeesLink) {
            registerEmployeesLink.style.display = 'none';
        }

        if (!jwtToken || !userRole || !username) {
            console.log("No JWT token, user role or username found. Redirigiendo a login.");
            window.location.href = 'login.html';
            return;
        }

        if (userRole === 'admin') {
            if (registerEmployeesLink) {
                registerEmployeesLink.style.display = 'block';
            }
            console.log(`User ${username} logged in as ADMIN.`);
        } else {
            console.log(`User ${username} logged in with role: ${userRole}.`);
        }
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            console.log("User logged out. Clearing localStorage and redirecting to login.");
            window.location.href = 'login/login.html';
        });
    } else {
        console.warn("Logout button with ID 'sidebar-logout-button' not found after sidebar load.");
    }

    if (sidebarToggleButton && sidebar) {
        sidebarToggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('closed');
            console.log("Sidebar toggle button clicked. Sidebar state:", sidebar.classList.contains('closed') ? 'closed' : 'open');
        });
    } else {
        console.warn("Sidebar toggle elements (button or sidebar) not found after sidebar load. Sidebar toggle functionality may not work.");
    }

    checkAuthAndRole();
}

document.addEventListener('DOMContentLoaded', initDashboard);
