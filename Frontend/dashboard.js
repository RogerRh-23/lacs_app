document.addEventListener('DOMContentLoaded', () => {
    const welcomeUsernameSpan = document.getElementById('welcome-username');
    const adminContent = document.getElementById('admin-content');
    const employeeContent = document.getElementById('employee-content');
    const unknownRoleMessage = document.getElementById('unknown-role-message');

    const logoutButton = document.getElementById('sidebar-logout-button');

    function checkAuthAndRole() {
        const jwtToken = localStorage.getItem('jwtToken');
        const userRole = localStorage.getItem('userRole');
        const username = localStorage.getItem('username');

        if (!jwtToken || !userRole || !username) {
            console.log("No JWT token, user role or username found. Redirecting to login.");
            window.location.href = 'login.html';
            return;
        }

        if (welcomeUsernameSpan) {
            welcomeUsernameSpan.textContent = username;
        }

        if (adminContent) adminContent.style.display = 'none';
        if (employeeContent) employeeContent.style.display = 'none';
        if (unknownRoleMessage) unknownRoleMessage.style.display = 'none';

        switch (userRole) {
            case 'ROLE_ADMIN':
                if (adminContent) adminContent.style.display = 'block';
                console.log(`User ${username} logged in as ADMIN.`);
                break;
            case 'ROLE_EMPLOYEE':
                if (employeeContent) employeeContent.style.display = 'block';
                console.log(`User ${username} logged in as EMPLOYEE.`);
                break;
            default:
                if (unknownRoleMessage) unknownRoleMessage.style.display = 'block';
                console.warn(`User ${username} logged in with unrecognized role: ${userRole}.`);
                break;
        }
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('username');
            console.log("User logged out. Clearing localStorage and redirecting to login.");
            window.location.href = 'login.html';
        });
    } else {
        console.warn("Logout button with ID 'sidebar-logout-button' not found. Please ensure your sidebar has this ID for the logout functionality to work.");
    }

    checkAuthAndRole();
});
