document.addEventListener('DOMContentLoaded', () => {
    // Select all tab buttons and tab contents
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const inputGroups = document.querySelectorAll('.input-group');

    // Custom Scrollbar Elements for the BODY
    const scrollableContent = document.documentElement; // Refers to the <html> element for page scrolling
    const customScrollbarTrack = document.querySelector('.custom-scrollbar-track');
    const customScrollbarThumb = document.querySelector('.custom-scrollbar-thumb');

    let isDragging = false; // Flag to check if the thumb is being dragged
    let scrollTimeout; // Variable to store the timeout for hiding the scrollbar
    let touchStartY = 0; // Stores the initial Y position for touch events
    let touchStartScrollTop = 0; // Stores the scroll position at the start of a touch

    // --- Custom Scrollbar Functions ---

    /**
     * Shows the custom scrollbar and sets a timeout to hide it.
     */
    const showScrollbar = () => {
        // Ensure the scrollbar is visible
        customScrollbarTrack.classList.add('active');
        // Clear any existing timeout to prevent premature hiding
        clearTimeout(scrollTimeout);
        // Set a new timeout to hide the scrollbar after 2 seconds (2000 ms)
        // This ensures it stays visible during continuous interaction
        scrollTimeout = setTimeout(() => {
            if (!isDragging) { // Only hide if not currently dragging the thumb
                customScrollbarTrack.classList.remove('active');
            }
        }, 2000);
    };

    /**
     * Updates the size and position of the custom scrollbar thumb.
     */
    const updateScrollbar = () => {
        // Get the total scrollable height of the content (of the whole document)
        const contentHeight = scrollableContent.scrollHeight;
        // Get the visible height of the scrollable area (viewport height)
        const visibleHeight = scrollableContent.clientHeight;
        // Get the total height of the custom scrollbar track
        const trackHeight = customScrollbarTrack.clientHeight;

        // If content is not scrollable, hide the custom scrollbar completely
        if (contentHeight <= visibleHeight) {
            customScrollbarTrack.style.display = 'none';
            return;
        } else {
            customScrollbarTrack.style.display = 'block'; // Ensure it's displayed if content is scrollable
        }

        // Calculate the height of the thumb
        // thumbHeight / trackHeight = visibleHeight / contentHeight
        const thumbHeight = (visibleHeight / contentHeight) * trackHeight;
        customScrollbarThumb.style.height = `${thumbHeight}px`;

        // Calculate the position of the thumb
        // thumbPosition / (trackHeight - thumbHeight) = scrollTop / (contentHeight - visibleHeight)
        const scrollTop = scrollableContent.scrollTop;
        const maxScrollTop = contentHeight - visibleHeight;
        const maxThumbPosition = trackHeight - thumbHeight;

        // Prevent division by zero if content is not scrollable
        const thumbPosition = maxScrollTop > 0 ? (scrollTop / maxScrollTop) * maxThumbPosition : 0;
        customScrollbarThumb.style.transform = `translateY(${thumbPosition}px)`;

        showScrollbar(); // Show scrollbar on any scroll update
    };

    /**
     * Handles the mouse down event on the custom scrollbar thumb to start dragging.
     * @param {MouseEvent} e - The mouse event.
     */
    const startDrag = (e) => {
        e.preventDefault(); // Prevent default browser drag behavior
        isDragging = true;
        // Add a class to the track to keep it visible while dragging
        customScrollbarTrack.classList.add('active');
        // Prevent text selection during drag
        document.body.classList.add('no-select');

        // Calculate the initial offset of the mouse from the top of the thumb
        // This prevents the thumb from jumping when clicked
        const startY = e.clientY;
        const initialThumbTop = customScrollbarThumb.getBoundingClientRect().top;
        const trackTop = customScrollbarTrack.getBoundingClientRect().top;
        const thumbOffset = startY - initialThumbTop; // Offset from mouse to thumb's top

        /**
         * Handles the mouse move event during dragging.
         * @param {MouseEvent} e - The mouse event.
         */
        const onDrag = (e) => {
            if (!isDragging) return;

            // Calculate new thumb position relative to the track
            let newThumbTop = e.clientY - trackTop - thumbOffset;

            // Clamp the thumb position within the track boundaries
            const maxThumbTop = customScrollbarTrack.clientHeight - customScrollbarThumb.clientHeight;
            newThumbTop = Math.max(0, Math.min(newThumbTop, maxThumbTop));

            // Update the thumb's visual position
            customScrollbarThumb.style.transform = `translateY(${newThumbTop}px)`;

            // Calculate the corresponding scroll position for the content
            const scrollRatio = maxThumbTop > 0 ? newThumbTop / maxThumbTop : 0;
            scrollableContent.scrollTop = scrollRatio * (scrollableContent.scrollHeight - scrollableContent.clientHeight);
        };

        /**
         * Handles the mouse up event to stop dragging.
         */
        const stopDrag = () => {
            isDragging = false;
            // Remove the active class from the track
            customScrollbarTrack.classList.remove('active');
            // Re-enable text selection
            document.body.classList.remove('no-select');
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
            showScrollbar(); // Reset timeout after drag ends
        };

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    };

    /**
     * Handles mouse wheel scroll events.
     * @param {WheelEvent} e - The wheel event.
     */
    const handleWheelScroll = (e) => {
        e.preventDefault(); // Prevent default browser scroll
        scrollableContent.scrollTop += e.deltaY; // Adjust scroll position
        updateScrollbar(); // Update custom scrollbar position
    };

    /**
     * Handles touch start events.
     * @param {TouchEvent} e - The touch event.
     */
    const handleTouchStart = (e) => {
        // Only consider single touch for vertical scrolling
        if (e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
            touchStartScrollTop = scrollableContent.scrollTop;
            showScrollbar(); // Show scrollbar immediately on touch start
        }
    };

    /**
     * Handles touch move events.
     * @param {TouchEvent} e - The touch event.
     */
    const handleTouchMove = (e) => {
        // Only consider single touch for vertical scrolling
        if (e.touches.length === 1) {
            e.preventDefault(); // Prevent default browser touch scrolling
            const touchCurrentY = e.touches[0].clientY;
            const deltaY = touchCurrentY - touchStartY; // Calculate vertical movement
            // Adjust scroll position: subtract deltaY because moving finger down (positive deltaY)
            // means content scrolls up (scrollTop increases).
            scrollableContent.scrollTop = touchStartScrollTop - deltaY;
            updateScrollbar(); // Update custom scrollbar position
        }
    };

    /**
     * Handles touch end events.
     */
    const handleTouchEnd = () => {
        showScrollbar(); // Reset timeout after touch ends
    };


    // --- Event Listeners for Custom Scrollbar ---
    customScrollbarThumb.addEventListener('mousedown', startDrag);
    window.addEventListener('wheel', handleWheelScroll, { passive: false }); // Use window for page-level scroll
    document.body.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.body.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.body.addEventListener('touchend', handleTouchEnd);


    // Update scrollbar on content scroll (e.g., programmatic scroll, or if native scrollbar was not fully hidden)
    // This listener is crucial for keeping the custom scrollbar in sync with any scroll changes.
    scrollableContent.addEventListener('scroll', updateScrollbar);

    // Update scrollbar on window resize (content dimensions might change, or viewport size)
    window.addEventListener('resize', updateScrollbar);


    // --- Tab handling (existing logic) ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            const tabId = button.dataset.tab;
            document.getElementById(tabId).classList.add('active');

            // IMPORTANT: Update scrollbar after tab content changes (visibility/height might change)
            // Use setTimeout to allow browser to render new tab content before calculating scrollbar
            setTimeout(updateScrollbar, 50);
        });
    });

    // --- Handling 'is-active' classes for inputs with floating labels (existing logic) ---
    inputGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('.input-label');

        if (input) {
            const checkInput = () => {
                if (input.type === 'checkbox') {
                    if (input.checked) {
                        group.classList.add('is-active');
                    } else {
                        group.classList.remove('is-active');
                    }
                } else {
                    if (input.value !== '' && input.value !== null && input.value !== undefined) {
                        group.classList.add('is-active');
                    } else {
                        group.classList.remove('is-active');
                    }
                }
            };

            checkInput();
            input.addEventListener('focus', () => { group.classList.add('is-active'); });
            input.addEventListener('blur', () => { checkInput(); });
            input.addEventListener('change', () => { checkInput(); });
            if (input.type !== 'checkbox') {
                input.addEventListener('input', () => { checkInput(); });
            }
        }
    });

    // --- Age calculation for the birth date field (existing logic) ---
    const birthDateInput = document.getElementById('pers-fechNac');
    const ageInput = document.getElementById('pers-edad');

    const calculateAge = () => {
        if (birthDateInput && ageInput && birthDateInput.value) {
            const birthDate = new Date(birthDateInput.value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();

            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            ageInput.value = age >= 0 ? age : '';

            if (ageInput.value) {
                ageInput.closest('.input-group').classList.add('is-active');
            } else {
                ageInput.closest('.input-group').classList.remove('is-active');
            }
        } else if (ageInput) {
            ageInput.value = '';
            ageInput.closest('.input-group').classList.remove('is-active');
        }
    };

    if (birthDateInput) {
        birthDateInput.addEventListener('change', calculateAge);
    }

    // --- Initialization: Activate the first tab on page load and update scrollbar ---
    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons[0].classList.add('active');
        tabContents[0].classList.add('active');
        // Initial scrollbar update after content is rendered
        setTimeout(updateScrollbar, 100);
    }

    // --- Form submission handling (simulated) ---
    const forms = document.querySelectorAll('.pers-forms .tab-content');
    forms.forEach(formContent => {
        const submitButton = formContent.querySelector('.submit-button');

        if (submitButton) {
            submitButton.addEventListener('click', (event) => {
                event.preventDefault();

                const showMessageModal = (message) => {
                    let modal = document.getElementById('customMessageModal');
                    if (!modal) {
                        modal = document.createElement('div');
                        modal.id = 'customMessageModal';
                        modal.style.cssText = `
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background-color: white;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                            z-index: 1000;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 15px;
                            max-width: 90%;
                            text-align: center;
                        `;
                        const messageText = document.createElement('p');
                        messageText.id = 'customMessageText';
                        messageText.style.cssText = `
                            font-family: "Montserrat", sans-serif;
                            color: var(--color-dark-text);
                            font-size: 1.1rem;
                        `;
                        const closeButton = document.createElement('button');
                        closeButton.textContent = 'Cerrar';
                        closeButton.style.cssText = `
                            padding: 10px 20px;
                            background-color: var(--color-primary);
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-family: "Montserrat", sans-serif;
                            font-size: 1rem;
                        `;
                        closeButton.onclick = () => modal.remove();
                        modal.appendChild(messageText);
                        modal.appendChild(closeButton);
                        document.body.appendChild(modal);
                    }
                    document.getElementById('customMessageText').textContent = message;
                    modal.style.display = 'flex';
                };

                showMessageModal(`Formulario de ${formContent.id} enviado (simulado). Revisa la consola para los datos.`);

                const formData = new FormData();
                formContent.querySelectorAll('input, select, textarea').forEach(input => {
                    if (input.type === 'checkbox') {
                        formData.append(input.name, input.checked);
                    } else {
                        formData.append(input.name, input.value);
                    }
                });

                const data = {};
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                }
                console.log(`Datos de la pestaña ${formContent.id}:`, data);
            });
        }
    });
});
