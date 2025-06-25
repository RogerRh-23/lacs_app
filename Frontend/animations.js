document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const icon = document.getElementById('sidebar-icon');
    const userMenuBtn = document.getElementById('user-menu-btn');
    const sidebarUser = document.querySelector('.sidebar-user');
    const loginTabBtn = document.getElementById('login-tab-btn');
    const registerTabBtn = document.getElementById('register-tab-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabIndicator = document.querySelector('.tab-indicator');
    const loginBox = document.querySelector('.login-box');

    if (toggleBtn && sidebar && icon) {
        toggleBtn.addEventListener('click', function () {
            sidebar.classList.toggle('closed');
            icon.innerHTML = sidebar.classList.contains('closed') ? '&#9776;' : '&times;';
            if (sidebar.classList.contains('closed') && sidebarUser) {
                closeMenuWithAnimation();
            }
        });
    }

    function closeMenuWithAnimation() {
        if (sidebarUser.classList.contains('menu-open')) {
            sidebarUser.classList.remove('menu-open');
            sidebarUser.classList.add('menu-closing');
            setTimeout(() => {
                sidebarUser.classList.remove('menu-closing');
            }, 300);
        }
    }

    if (userMenuBtn && sidebarUser && sidebar) {
        userMenuBtn.addEventListener('click', function (e) {
            if (!sidebar.classList.contains('closed')) {
                if (sidebarUser.classList.contains('menu-open')) {
                    closeMenuWithAnimation();
                } else {
                    sidebarUser.classList.add('menu-open');
                }
            }
        });
        document.addEventListener('click', function (e) {
            if (!sidebarUser.contains(e.target)) {
                closeMenuWithAnimation();
            }
        });
    }

    function activateTab(tab) {
        if (tab === 'login') {
            loginTabBtn.classList.add('active');
            registerTabBtn.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            tabIndicator.style.left = '0';
        } else {
            loginTabBtn.classList.remove('active');
            registerTabBtn.classList.add('active');
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
            tabIndicator.style.left = '50%';
        }
    }

    function animateBoxHeight() {
        const loginBox = document.querySelector('.login-box');
        const clone = loginBox.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.height = 'auto';
        clone.style.transition = 'none';
        clone.style.overflow = 'visible';
        document.body.appendChild(clone);

        clone.querySelectorAll('.tab-form').forEach(form => {
            form.style.display = form.classList.contains('active') ? 'flex' : 'none';
        });

        const newHeight = clone.offsetHeight;
        document.body.removeChild(clone);

        loginBox.style.height = newHeight + 'px';
    }

    loginTabBtn.addEventListener('click', function () {
        activateTab('login');
        animateBoxHeight();
    });
    registerTabBtn.addEventListener('click', function () {
        activateTab('register');
        animateBoxHeight();
    });

    document.addEventListener('DOMContentLoaded', animateBoxHeight);
});

