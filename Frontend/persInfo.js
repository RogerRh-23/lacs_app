document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const inputGroups = document.querySelectorAll('.input-group');

    // Manejo de pestañas
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover 'active' de todos los botones y contenidos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Añadir 'active' al botón clickeado
            button.classList.add('active');

            // Mostrar el contenido de la pestaña correspondiente
            const tabId = button.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Manejo de etiquetas flotantes para inputs y selects
    inputGroups.forEach(group => {
        const input = group.querySelector('input, select');
        const label = group.querySelector('.input-label');

        if (input) {
            const checkInput = () => {
                if (input.type === 'checkbox') {
                    if (input.checked) {
                        group.classList.add('is-active');
                    } else {
                        group.classList.remove('is-active');
                    }
                } else if (input.value !== '' && input.value !== null && input.value !== undefined) {
                    group.classList.add('is-active');
                } else {
                    group.classList.remove('is-active');
                }
            };

            checkInput();

            input.addEventListener('focus', () => {
                group.classList.add('is-active');
            });

            input.addEventListener('blur', () => {
                checkInput();
            });

            input.addEventListener('change', () => {
                checkInput();
            });

            if (input.type !== 'checkbox') {
                input.addEventListener('input', () => {
                    checkInput();
                });
            }
        }
    });

    const calculateAge = () => {
        const birthDateInput = document.getElementById('pers-fechNac');
        const ageInput = document.getElementById('pers-edad');

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

    const birthDateInput = document.getElementById('pers-fechNac');
    if (birthDateInput) {
        birthDateInput.addEventListener('change', calculateAge);
        calculateAge();
    }

    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons[0].classList.add('active');
        tabContents[0].classList.add('active');
    }

    const forms = document.querySelectorAll('.pers-forms .tab-content');
    forms.forEach(formContent => {
        const submitButton = formContent.querySelector('.submit-button');
        if (submitButton) {
            submitButton.addEventListener('click', (event) => {
                event.preventDefault();
                alert(`Formulario de "${formContent.id}" enviado (simulado). Revisa la consola para los datos.`);
                const formData = new FormData();
                formContent.querySelectorAll('input, select').forEach(input => {
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
