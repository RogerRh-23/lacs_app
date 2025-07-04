document.addEventListener('DOMContentLoaded', () => {
    const inputGroups = document.querySelectorAll('.input-group');

    inputGroups.forEach(group => {
        const input = group.querySelector('input');
        const label = group.querySelector('label');

        if (!input || !label) {
            console.warn("Grupo de entrada sin input o label encontrado:", group);
            return;
        }

        const updateLabelState = () => {
            if (input.value.length > 0 || input === document.activeElement) {
                group.classList.add('is-active');
            } else {
                group.classList.remove('is-active');
            }
        };

        input.addEventListener('focus', () => {
            group.classList.add('is-active');
        });

        input.addEventListener('blur', () => {
            updateLabelState();
        });

        input.addEventListener('input', () => {
            updateLabelState();
        });

        updateLabelState();
    });
});
