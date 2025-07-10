// js/scrollbar.js

// Función de inicialización principal del scrollbar
function initCustomScrollbar() {
    const scrollableContent = document.querySelector('.app-layout-wrapper');
    const customScrollbarTrack = document.querySelector('.custom-scrollbar-track');
    const customScrollbarThumb = document.querySelector('.custom-scrollbar-thumb');

    // Salir si los elementos críticos no se encuentran
    if (!scrollableContent || !customScrollbarTrack || !customScrollbarThumb) {
        console.warn("[ScrollbarJS] Elementos de scrollbar no encontrados. Reintentando o la barra de desplazamiento personalizada NO funcionará.");
        return; // No se puede inicializar si los elementos no están presentes
    }

    console.log("[ScrollbarJS] Elementos de scrollbar encontrados. Inicializando...");

    let isDragging = false;
    let scrollTimeout;
    let touchStartY = 0;
    let touchStartScrollTop = 0;

    const showScrollbar = () => {
        if (!customScrollbarTrack || !scrollableContent) return;

        // Ocultar si no hay suficiente contenido para scrollear
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
            console.warn("[ScrollbarJS] Elementos de scrollbar no encontrados durante la actualización. No se puede actualizar.");
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
        customScrollbarThumb.style.height = `${Math.max(20, thumbHeight)}px`; // Mínimo 20px de alto para el thumb

        const scrollTop = scrollableContent.scrollTop;
        const maxScrollTop = contentHeight - visibleHeight;
        const maxThumbPosition = trackHeight - customScrollbarThumb.clientHeight;

        const thumbPosition = maxScrollTop > 0 ? (scrollTop / maxScrollTop) * maxThumbPosition : 0;
        customScrollbarThumb.style.transform = `translateY(${thumbPosition}px)`;

        showScrollbar();
    };

    const startDrag = (e) => {
        e.preventDefault();
        isDragging = true;
        customScrollbarTrack.classList.add('active');
        document.body.classList.add('no-select');

        const startY = e.clientY;
        const initialThumbTop = customScrollbarThumb.getBoundingClientRect().top;
        const trackTop = customScrollbarTrack.getBoundingClientRect().top;
        const thumbOffset = startY - initialThumbTop;

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

    const handleWheelScroll = (e) => {
        updateScrollbar();
    };

    const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
            touchStartScrollTop = scrollableContent.scrollTop;
            showScrollbar();
        }
    };

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

    // Remover listeners anteriores para evitar duplicados si initCustomScrollbar se llama varias veces
    customScrollbarThumb.removeEventListener('mousedown', startDrag);
    scrollableContent.removeEventListener('wheel', handleWheelScroll);
    scrollableContent.removeEventListener('touchstart', handleTouchStart);
    scrollableContent.removeEventListener('touchmove', handleTouchMove);
    scrollableContent.removeEventListener('touchend', handleTouchEnd);
    scrollableContent.removeEventListener('scroll', updateScrollbar);
    document.body.removeEventListener('mousemove', showScrollbar);
    document.body.removeEventListener('mouseenter', showScrollbar);


    // Adjuntar listeners
    customScrollbarThumb.addEventListener('mousedown', startDrag);
    scrollableContent.addEventListener('wheel', handleWheelScroll, { passive: true });
    scrollableContent.addEventListener('touchstart', handleTouchStart, { passive: true });
    scrollableContent.addEventListener('touchmove', handleTouchMove, { passive: true });
    scrollableContent.addEventListener('touchend', handleTouchEnd);
    scrollableContent.addEventListener('scroll', updateScrollbar);
    document.body.addEventListener('mousemove', showScrollbar); // Para mostrar la barra al mover el ratón
    document.body.addEventListener('mouseenter', showScrollbar); // Para mostrar la barra al entrar el ratón en la ventana

    // Actualizar scrollbar al inicio y en cada cambio de contenido
    updateScrollbar();
}

// Lógica de inicialización:
// Exponer la función de inicialización para que dashboard.js pueda llamarla
window.initCustomScrollbar = initCustomScrollbar;

document.addEventListener('DOMContentLoaded', () => {
    // Intentar inicializar inmediatamente si los elementos ya están en el DOM (poco probable con carga dinámica)
    initCustomScrollbar();

    // Observador para detectar la adición de .app-layout-wrapper
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                if (document.querySelector('.app-layout-wrapper')) {
                    console.log("[ScrollbarJS] app-layout-wrapper detectado por MutationObserver. Inicializando scrollbar.");
                    initCustomScrollbar();
                    observer.disconnect();
                    break;
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Escuchar el evento personalizado de dashboard.js cuando el contenido principal cambia
    window.addEventListener('mainContentLoaded', () => {
        console.log("[ScrollbarJS] Evento 'mainContentLoaded' recibido. Re-inicializando scrollbar.");
        // Pequeño retraso para asegurar que el contenido se haya renderizado completamente
        setTimeout(initCustomScrollbar, 100);
    });

    // Fallback con un pequeño retraso por si acaso
    setTimeout(initCustomScrollbar, 500);
});
