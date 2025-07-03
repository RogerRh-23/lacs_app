document.addEventListener('DOMContentLoaded', async function () {
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (sidebarPlaceholder) {
        try {
            const response = await fetch('sidebar.html');
            const sidebarHtml = await response.text();
            sidebarPlaceholder.innerHTML = sidebarHtml;

            if (typeof initDashboard === 'function') {
                initDashboard();
                console.log("Sidebar loaded and dashboard.js initialized.");
            } else {
                console.error("La función 'initDashboard' no se encontró. Asegúrate de que dashboard.js se carga antes de home.js.");
            }
        } catch (error) {
            console.error("Error al cargar sidebar.html:", error);
        }
    } else {
        console.warn("Elemento 'sidebar-placeholder' no encontrado en home.html. El sidebar no se cargará.");
    }

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    const displayUsername = document.getElementById('displayUsername');
    const displayEmail = document.getElementById('displayEmail');
    const displayRole = document.getElementById('displayRole');
    const protectedDataBox = document.getElementById('protectedData');
    const fetchProtectedDataButton = document.getElementById('fetchProtectedData');

    if (!accessToken) {
        window.location.href = 'login.html';
        return;
    }

    if (fetchProtectedDataButton) {
        fetchProtectedDataButton.addEventListener('click', async function () {
            try {
                const response = await fetch('http://127.0.0.1:8000/accounts/home/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    if (protectedDataBox) {
                        protectedDataBox.textContent = `Datos del Backend: ${JSON.stringify(data, null, 2)}`;
                        protectedDataBox.style.display = 'block';
                        protectedDataBox.style.backgroundColor = '#e6ffe6';
                        protectedDataBox.style.border = '1px solid #66cc66';
                        protectedDataBox.style.padding = '10px';
                        protectedDataBox.style.marginTop = '10px';
                        protectedDataBox.style.borderRadius = '5px';
                    }
                } else {
                    if (protectedDataBox) {
                        protectedDataBox.textContent = `Error: ${data.detail || 'No autorizado. Vuelve a iniciar sesión.'}`;
                        protectedDataBox.style.display = 'block';
                        protectedDataBox.style.backgroundColor = '#ffe6e6';
                        protectedDataBox.style.border = '1px solid #cc6666';
                        protectedDataBox.style.padding = '10px';
                        protectedDataBox.style.marginTop = '10px';
                        protectedDataBox.style.borderRadius = '5px';
                    }

                    if (response.status === 401) {
                        setTimeout(() => {
                            localStorage.clear();
                            window.location.href = 'login.html';
                        }, 2000);
                    }
                }
            } catch (error) {
                if (protectedDataBox) {
                    protectedDataBox.textContent = 'Error de red al intentar obtener datos protegidos. Asegúrate de que el servidor esté corriendo.';
                    protectedDataBox.style.display = 'block';
                    protectedDataBox.style.backgroundColor = '#ffe6e6';
                    protectedDataBox.style.border = '1px solid #cc6666';
                    protectedDataBox.style.padding = '10px';
                    protectedDataBox.style.marginTop = '10px';
                    protectedDataBox.style.borderRadius = '5px';
                }
            }
        });
    }
});
