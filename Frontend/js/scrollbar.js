document.addEventListener('DOMContentLoaded', () => {
    const scrollableContent = document.querySelector('.app-layout-wrapper');
    const customScrollbarTrack = document.querySelector('.custom-scrollbar-track');
    const customScrollbarThumb = document.querySelector('.custom-scrollbar-thumb');

    let isDragging = false;
    let scrollTimeout;
    let touchStartY = 0;
    let touchStartScrollTop = 0;

    const showScrollbar = () => {
        if (!customScrollbarTrack || !scrollableContent) return;

        if (scrollableContent.scrollHeight <= scrollableContent.clientHeight) {
            customScrollbarTrack.style.opacity = '0';
            customScrollbarTrack.style.pointerEvents = 'none';
            customScrollbarTrack.classList.remove('active');
            return;
        } else {
            customScrollbarTrack.style.opacity = '1';
            customScrollbarTrack.style.pointerEvents = 'auto';
        }

        customScrollbarTrack.classList.add('active');
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (!isDragging) {
                customScrollbarTrack.classList.remove('active');
                customScrollbarTrack.style.opacity = '0';
                customScrollbarTrack.style.pointerEvents = 'none';
            }
        }, 2000);
    };

    const updateScrollbar = () => {
        if (!scrollableContent || !customScrollbarTrack || !customScrollbarThumb) {
            console.warn("Elementos de scrollbar no encontrados (o no están listos), no se puede actualizar.");
            return;
        }

        const contentHeight = scrollableContent.scrollHeight;
        const visibleHeight = scrollableContent.clientHeight;
        const trackHeight = customScrollbarTrack.clientHeight;

        if (contentHeight <= visibleHeight) {
            customScrollbarTrack.style.opacity = '0';
            customScrollbarTrack.style.pointerEvents = 'none';
            customScrollbarTrack.classList.remove('active');
            return;
        } else {
            customScrollbarTrack.style.opacity = '1';
            customScrollbarTrack.style.pointerEvents = 'auto';
        }

        const thumbHeight = (visibleHeight / contentHeight) * trackHeight;
        customScrollbarThumb.style.height = `${Math.max(20, thumbHeight)}px`;

        const scrollTop = scrollableContent.scrollTop;
        const maxScrollTop = contentHeight - visibleHeight;
        const maxThumbPosition = trackHeight - customScrollbarThumb.clientHeight;

        const thumbPosition = maxScrollTop > 0 ? (scrollTop / maxScrollTop) * maxThumbPosition : 0;
        customScrollbarThumb.style.transform = `translateY(${thumbPosition}px)`;

        showScrollbar();
    };

    /**
     * @param {MouseEvent} e 
     */
    const startDrag = (e) => {
        e.preventDefault();
        isDragging = true;
        customScrollbarTrack.classList.add('active');
        document.body.classList.add('no-select');

        const startY = e.clientY;
        const initialThumbTop = customScrollbarThumb.getBoundingClientRect().top;
        const trackTop = customScrollbarTrack.getBoundingClientRect().top;
        const thumbOffset = startY - initialThumbTop;

        /**
         * @param {MouseEvent} e
         */
        const onDrag = (e) => {
            if (!isDragging) return;

            let newThumbTop = e.clientY - trackTop - thumbOffset;

            const maxThumbTop = customScrollbarTrack.clientHeight - customScrollbarThumb.clientHeight;
            newThumbTop = Math.max(0, Math.min(newThumbTop, maxThumbTop));

            customScrollbarThumb.style.transform = `translateY(${newThumbTop}px)`;

            const scrollRatio = maxThumbTop > 0 ? newThumbTop / maxThumbTop : 0;
            scrollableContent.scrollTop = scrollRatio * (scrollableContent.scrollHeight - scrollableContent.clientHeight);
        };

        const stopDrag = () => {
            isDragging = false;
            customScrollbarTrack.classList.remove('active');
            document.body.classList.remove('no-select');
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
            showScrollbar();
        };

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    };

    /**
     * @param {WheelEvent} e 
     */
    const handleWheelScroll = (e) => {
        updateScrollbar();
    };

    /**
     * @param {TouchEvent} e 
     */
    const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
            touchStartScrollTop = scrollableContent.scrollTop;
            showScrollbar();
        }
    };

    /**
     * @param {TouchEvent} e 
     */
    const handleTouchMove = (e) => {
        if (e.touches.length === 1) {
            const touchCurrentY = e.touches[0].clientY;
            const deltaY = touchCurrentY - touchStartY;
            scrollableContent.scrollTop = touchStartScrollTop - deltaY;
            updateScrollbar();
        }
    };

    const handleTouchEnd = () => {
        showScrollbar();
    };

    if (customScrollbarThumb) {
        customScrollbarThumb.addEventListener('mousedown', startDrag);
    } else {
        console.warn("customScrollbarThumb no encontrado, no se adjuntará mousedown listener.");
    }

    if (scrollableContent) {
        scrollableContent.addEventListener('wheel', handleWheelScroll, { passive: true });
        scrollableContent.addEventListener('touchstart', handleTouchStart, { passive: true });
        scrollableContent.addEventListener('touchmove', handleTouchMove, { passive: true });
        scrollableContent.addEventListener('touchend', handleTouchEnd);
        scrollableContent.addEventListener('scroll', updateScrollbar);
        document.body.addEventListener('mousemove', showScrollbar);
        document.body.addEventListener('mouseenter', showScrollbar);
    } else {
        console.error("¡CRÍTICO! scrollableContent (.app-layout-wrapper) no encontrado. La barra de desplazamiento personalizada NO funcionará.");
    }

    window.addEventListener('resize', updateScrollbar);

    window.addEventListener('mainContentLoaded', () => {
        console.log("Evento 'mainContentLoaded' recibido. Intentando actualizar scrollbar en breve...");
        setTimeout(updateScrollbar, 50);
    });

    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('.app-layout-wrapper')) {
            console.log("app-layout-wrapper detectado. Realizando actualización inicial de scrollbar.");
            updateScrollbar();
            obs.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(updateScrollbar, 500);
});
