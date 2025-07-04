document.addEventListener('DOMContentLoaded', () => {
    function setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                button.classList.add('active');
                const tabId = button.dataset.tab;
                document.getElementById(tabId).classList.add('active');
                window.dispatchEvent(new CustomEvent('persInfoContentChanged'));
            });
        });

        document.querySelectorAll('.input-group input, .input-group select, .input-group textarea').forEach(input => {
            if (input.value) {
                input.closest('.input-group').classList.add('is-active');
            }

            input.addEventListener('focus', () => {
                input.closest('.input-group').classList.add('is-active');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.closest('.input-group').classList.remove('is-active');
                }
            });
        });
    }

    const mainContentArea = document.getElementById('main-content-area');
    if (mainContentArea) {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    if (mainContentArea.querySelector('.tab-buttons-container')) {
                        setupTabs();
                        observer.disconnect();
                        break;
                    }
                }
            }
        });

        observer.observe(mainContentArea, { childList: true, subtree: true });
        if (mainContentArea.querySelector('.tab-buttons-container')) {
            setupTabs();
        }
    } else {
        setupTabs();
    }
})