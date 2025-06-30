document.addEventListener('DOMContentLoaded', function () {

    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');

    if (sidebarPlaceholder) {
        loadSidebar();
    }

    async function loadSidebar() {
        try {
            const response = await fetch('sidebar.html');
            if (response.ok) {
                const sidebarHtml = await response.text();
                sidebarPlaceholder.innerHTML = sidebarHtml;

                initializeSidebarLogic();
            } else {
                console.error('Error al cargar la sidebar:', response.statusText);
            }
        } catch (error) {
            console.error('Error de red al cargar la sidebar:', error);
        }
    }

    function initializeSidebarLogic() {
        const toggleBtn = document.getElementById('toggle-sidebar');
        const sidebar = document.querySelector('.sidebar');
        const icon = document.getElementById('sidebar-icon');
        const userMenuBtn = document.getElementById('user-menu-btn');
        const sidebarUser = document.querySelector('.sidebar-user');

        if (toggleBtn && sidebar && icon && userMenuBtn && sidebarUser) {
            toggleBtn.addEventListener('click', function () {
                sidebar.classList.toggle('closed');
                icon.innerHTML = sidebar.classList.contains('closed') ? '&#9776;' : '&times;';
                if (sidebar.classList.contains('closed') && sidebarUser) {
                    closeMenuWithAnimation();
                }
            });

            userMenuBtn.addEventListener('click', function (e) {
                if (!sidebar.classList.contains('closed')) {
                    if (sidebarUser.classList.contains('menu-open')) {
                        closeMenuWithAnimation();
                    } else {
                        sidebarUser.classList.add('menu-open');
                    }
                }
                e.stopPropagation();
            });

            document.addEventListener('click', function (e) {
                if (!sidebarUser.contains(e.target) && !userMenuBtn.contains(e.target) && !sidebar.classList.contains('closed')) {
                    closeMenuWithAnimation();
                }
            });

            function closeMenuWithAnimation() {
                if (sidebarUser.classList.contains('menu-open')) {
                    sidebarUser.classList.remove('menu-open');
                    sidebarUser.classList.add('menu-closing');
                    setTimeout(() => {
                        sidebarUser.classList.remove('menu-closing');
                    }, 300);
                }
            }
        }
    }


    const loginTabBtn = document.getElementById('login-tab-btn');
    const registerTabBtn = document.getElementById('register-tab-btn');
    const loginFormElement = document.getElementById('login-form');
    const registerFormElement = document.getElementById('register-form');
    const tabIndicator = document.querySelector('.tab-indicator');
    const loginBox = document.querySelector('.login-box');

    if (loginTabBtn && registerTabBtn && loginFormElement && registerFormElement && tabIndicator && loginBox) {

        loginTabBtn.addEventListener('click', function () {
            activateTab('login');
            animateBoxHeight();
        });
        registerTabBtn.addEventListener('click', function () {
            activateTab('register');
            animateBoxHeight();
        });

        function activateTab(tab) {
            if (tab === 'login') {
                loginTabBtn.classList.add('active');
                registerTabBtn.classList.remove('active');
                loginFormElement.classList.add('active');
                registerFormElement.classList.remove('active');
            } else {
                loginTabBtn.classList.remove('active');
                registerTabBtn.classList.add('active');
                loginFormElement.classList.remove('active');
                registerFormElement.classList.add('active');
            }
            updateTabIndicator(tab === 'login' ? loginTabBtn : registerTabBtn);
        }

        function updateTabIndicator(activeTab) {
            if (activeTab && tabIndicator) {
                const tabRect = activeTab.getBoundingClientRect();
                const parentRect = activeTab.parentElement.getBoundingClientRect();
                tabIndicator.style.width = `${tabRect.width}px`;
                tabIndicator.style.left = `${tabRect.left - parentRect.left}px`;
            }
        }

        function animateBoxHeight() {
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

        const currentActiveTabOnLoad = document.querySelector('.login-tab.active');
        if (currentActiveTabOnLoad) {
            updateTabIndicator(currentActiveTabOnLoad);
            animateBoxHeight();
        }

        window.addEventListener('resize', () => {
            const activeTabOnResize = document.querySelector('.login-tab.active');
            if (activeTabOnResize) {
                updateTabIndicator(activeTabOnResize);
                animateBoxHeight();
            }
        });
    } else {
    }
});
